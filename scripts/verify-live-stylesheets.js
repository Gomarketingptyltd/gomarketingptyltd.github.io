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

function getAttr(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}=["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
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

    const html = await pageResponse.text();
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

  console.log("Live stylesheet check passed.");
  console.log(`Checked ${PRIORITY_PATHS.length} priority pages and ${checkedStylesheets.size} unique stylesheet URL(s).`);
}

main().catch((error) => {
  console.error(`Live stylesheet check failed: ${error.message}`);
  process.exit(1);
});
