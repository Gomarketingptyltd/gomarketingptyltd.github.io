#!/usr/bin/env node

const SITE_URL = (process.env.SITE_URL || "https://gomarketing.net.au").replace(/\/$/, "");

const PRIORITY_PATHS = [
  "/",
  "/cn/",
  "/services/",
  "/services/digital.html",
  "/cn/digital.html",
  "/services/sydneyBilingualMarketingAgency.html",
  "/cn/sydneyBilingualMarketingAgency.html",
  "/services/chineseCommunityGrowth.html",
  "/cn/chineseCommunityGrowth.html",
  "/services/support.html",
  "/services/advertising.html",
  "/services/howToReachChineseConsumersInSydney.html",
  "/services/xiaohongshuMarketingForSydneyRestaurants.html",
  "/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html",
];

const MOJIBAKE_PATTERNS = [
  { label: "Unicode replacement character", pattern: /\uFFFD/u },
  { label: "common UTF-8 mojibake sequence", pattern: /(?:Ã[\x80-\xBF]|Â[\x80-\xBF]?|â[€\x80-\xBF]|[äåæç][\x80-\xBF])/u },
];

const INSECURE_HTTP_RE = /http:\/\/(?!127\.0\.0\.1(?::\d+)?(?:[/"'\s]|$)|localhost(?::\d+)?(?:[/"'\s]|$))/i;

function getAttr(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}=["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function findMojibake(value) {
  for (const { label, pattern } of MOJIBAKE_PATTERNS) {
    const match = value.match(pattern);
    if (match) return `${label}: ${match[0]}`;
  }
  return "";
}

function stylesheetLinks(html, pageUrl) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .filter(([tag]) => getAttr(tag, "rel").split(/\s+/).includes("stylesheet"))
    .map(([tag]) => getAttr(tag, "href"))
    .filter(Boolean)
    .map((href) => new URL(href, pageUrl).href);
}

async function fetchOk(url) {
  const response = await fetch(url, {
    headers: {
      "cache-control": "no-cache",
    },
  });
  return response;
}

async function main() {
  const issues = [];
  const checkedStylesheets = new Set();

  for (const path of PRIORITY_PATHS) {
    const pageUrl = new URL(path, `${SITE_URL}/`).href;
    let pageResponse;

    try {
      pageResponse = await fetchOk(pageUrl);
    } catch (error) {
      issues.push(`${pageUrl}: failed to fetch page: ${error.message}`);
      continue;
    }

    if (!pageResponse.ok) {
      issues.push(`${pageUrl}: page returned HTTP ${pageResponse.status}`);
      continue;
    }

    if (!pageResponse.url.startsWith("https://")) {
      issues.push(`${pageUrl}: final page URL is not HTTPS: ${pageResponse.url}`);
    }

    const pageContentType = pageResponse.headers.get("content-type") || "";
    if (!/text\/html/i.test(pageContentType) || !/charset=utf-8/i.test(pageContentType)) {
      issues.push(`${pageUrl}: unexpected page content-type: ${pageContentType || "missing"}`);
    }

    const html = await pageResponse.text();
    const mojibake = findMojibake(html);
    const insecureHttp = html.match(INSECURE_HTTP_RE);

    if (mojibake) {
      issues.push(`${pageUrl}: possible mojibake or broken encoding: ${mojibake}`);
    }

    if (insecureHttp) {
      issues.push(`${pageUrl}: contains insecure http:// URL: ${insecureHttp[0]}`);
    }

    const links = stylesheetLinks(html, pageUrl);

    if (!links.length) {
      issues.push(`${pageUrl}: missing live stylesheet link`);
      continue;
    }

    for (const stylesheetUrl of links) {
      if (checkedStylesheets.has(stylesheetUrl)) continue;
      checkedStylesheets.add(stylesheetUrl);

      try {
        const stylesheetResponse = await fetchOk(stylesheetUrl);
        if (!stylesheetResponse.ok) {
          issues.push(`${pageUrl}: stylesheet ${stylesheetUrl} returned HTTP ${stylesheetResponse.status}`);
        }
        if (!stylesheetResponse.url.startsWith("https://")) {
          issues.push(`${pageUrl}: stylesheet final URL is not HTTPS: ${stylesheetResponse.url}`);
        }
      } catch (error) {
        issues.push(`${pageUrl}: failed to fetch stylesheet ${stylesheetUrl}: ${error.message}`);
      }
    }
  }

  if (issues.length) {
    console.error(`Live stylesheet check failed with ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log("Live production safety check passed.");
  console.log(`Checked ${PRIORITY_PATHS.length} priority pages and ${checkedStylesheets.size} unique stylesheet URL(s).`);
}

main().catch((error) => {
  console.error(`Live stylesheet check failed: ${error.message}`);
  process.exit(1);
});
