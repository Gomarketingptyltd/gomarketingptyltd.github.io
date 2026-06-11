#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = (process.env.SITE_URL || "https://gomarketing.net.au").replace(/\/$/, "");

const DECORATIVE_IMAGE_RE =
  /(triangle|circle|cross|double-square|icon-gomarket|hamburger|cancel|chevron|blur|plus-sign|minus-sign|footer\/icons8-)/i;

const FORBIDDEN_TEXT = [
  "_ijt=",
  "Lorem ipsum",
  "Pepsi",
  "Mazda",
  "Gillette",
  "Clorox",
  "CVS",
  "BMW",
  "Pantene",
  "Marriott",
  "Aych",
  "Babylon",
  "Basalt",
  "Bense",
  "Camden Nurseries",
  "Chinese Garden",
  "Cieq",
  "Eaglestone",
  "Forward Business",
  "Goldleaf",
  "Green Apple",
  "Hongson",
  "IL Bianco",
  "Jameel",
  "Lurky",
  "My Tea",
  "My Tile",
  "Nanshan",
  "Ostar",
  "Roma Sauna",
  "Southern Sydney",
  "The Coffee Emporium",
  "Ultimo",
  "Vanton",
  "Wiso",
  "Zetland",
  "鸿图",
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules"].includes(entry.name)) return [];
      return walk(filePath);
    }
    return entry.isFile() ? [filePath] : [];
  });
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function htmlDecode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getAttr(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}=["']([^"']*)["']`, "i"));
  return match ? match[1] : "";
}

function hasMeta(html, attr, name) {
  const re = new RegExp(`<meta\\b[^>]*\\b${attr}=["']${escapeRegExp(name)}["'][^>]*\\bcontent=["'][^"']+["'][^>]*>`, "i");
  return re.test(html);
}

function getIds(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
}

function isExternalOrSpecial(url) {
  return /^(https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(url);
}

function localPathForUrl(url, fromFile) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean) return null;
  let decoded = clean;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    decoded = clean;
  }
  return decoded.startsWith("/")
    ? path.join(ROOT, decoded.slice(1))
    : path.resolve(path.dirname(fromFile), decoded);
}

function existsLocalTarget(target) {
  return (
    fs.existsSync(target) ||
    fs.existsSync(`${target}.html`) ||
    fs.existsSync(path.join(target, "index.html"))
  );
}

function isNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function htmlFiles() {
  return walk(ROOT).filter((file) => file.endsWith(".html"));
}

function primaryHtmlFiles() {
  return htmlFiles().filter((file) => {
    const name = rel(file);
    return name === "index.html" || /^services\/[^/]+\.html$/.test(name) || /^cn\/[^/]+\.html$/.test(name);
  });
}

function canonicalPathFor(relPath) {
  if (relPath === "index.html") return "/";
  if (relPath === "services/index.html") return "/services/";
  if (relPath === "cn/index.html") return "/cn/";
  return `/${relPath}`;
}

function canonicalUrlFor(relPath) {
  return `${SITE_URL}${encodeUrlPath(canonicalPathFor(relPath))}`;
}

function buildPairs() {
  const files = new Set(primaryHtmlFiles().map(rel));
  const pairs = new Map();

  function add(en, zh) {
    if (files.has(en) && files.has(zh)) {
      pairs.set(en, { en, zh });
      pairs.set(zh, { en, zh });
    }
  }

  add("index.html", "cn/index.html");
  add("services/index.html", "cn/graphicDesign.html");

  for (const file of files) {
    const match = file.match(/^services\/([^/]+\.html)$/);
    if (!match) continue;
    if (file === "services/index.html") continue;
    add(file, `cn/${match[1]}`);
  }

  return pairs;
}

function reportIssue(issues, file, message) {
  issues.push(`${file}: ${message}`);
}

const issues = [];
const files = htmlFiles();
const pairs = buildPairs();

for (const file of files) {
  const relative = rel(file);
  const html = fs.readFileSync(file, "utf8");
  const scanHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  const noindex = isNoindex(html);
  const ids = getIds(scanHtml);

  if (!/<title>[\s\S]*?<\/title>/i.test(scanHtml)) {
    reportIssue(issues, relative, "missing <title>");
  }

  if (!/<meta\s+name=["']description["']/i.test(scanHtml)) {
    reportIssue(issues, relative, "missing meta description");
  }

  if (!noindex && !/<link\b[^>]*\brel=["']stylesheet["']/i.test(scanHtml)) {
    reportIssue(issues, relative, "missing stylesheet link");
  }

  if (relative.startsWith("cn/") && !/<html\s+lang=["']zh-Hans["']/i.test(scanHtml)) {
    reportIssue(issues, relative, "Chinese page should use lang=\"zh-Hans\"");
  }

  if (!noindex) {
    const h1Count = [...scanHtml.matchAll(/<h1\b/gi)].length;
    if (h1Count !== 1) {
      reportIssue(issues, relative, `expected exactly one h1, found ${h1Count}`);
    }
  }

  for (const forbidden of FORBIDDEN_TEXT) {
    if (scanHtml.includes(forbidden)) {
      reportIssue(issues, relative, `contains forbidden or legacy text: ${forbidden}`);
    }
  }

  for (const [, attr, rawValue] of scanHtml.matchAll(/\b(href|src)=["']([^"']*)["']/g)) {
    const value = htmlDecode(rawValue.trim());
    if (!value) {
      reportIssue(issues, relative, `empty ${attr}`);
      continue;
    }

    if (value.startsWith("#")) {
      const id = value.slice(1);
      if (id && !ids.has(id)) {
        reportIssue(issues, relative, `missing local anchor ${value}`);
      }
      continue;
    }

    if (isExternalOrSpecial(value)) continue;

    const target = localPathForUrl(value, file);
    if (target && !existsLocalTarget(target)) {
      reportIssue(issues, relative, `missing local ${attr} target: ${value}`);
    }
  }

  for (const [imgTag] of scanHtml.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(imgTag)) {
      reportIssue(issues, relative, "image missing alt attribute");
      continue;
    }
    const alt = getAttr(imgTag, "alt").trim();
    const src = getAttr(imgTag, "src");
    if (!alt && !DECORATIVE_IMAGE_RE.test(src)) {
      reportIssue(issues, relative, `non-decorative image has empty alt: ${src}`);
    }
  }

  if (!noindex && pairs.has(relative)) {
    const canonical = canonicalUrlFor(relative);
    const pair = pairs.get(relative);
    const expectedAlternates = [
      { hreflang: "en-AU", href: canonicalUrlFor(pair.en) },
      { hreflang: "zh-Hans", href: canonicalUrlFor(pair.zh) },
      { hreflang: "x-default", href: canonicalUrlFor(pair.en) },
    ];

    if (!new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${escapeRegExp(canonical)}["']`, "i").test(scanHtml)) {
      reportIssue(issues, relative, `missing canonical ${canonical}`);
    }

    for (const alternate of expectedAlternates) {
      const re = new RegExp(
        `<link[^>]+rel=["']alternate["'][^>]+hreflang=["']${escapeRegExp(alternate.hreflang)}["'][^>]+href=["']${escapeRegExp(alternate.href)}["']`,
        "i"
      );
      if (!re.test(scanHtml)) {
        reportIssue(issues, relative, `missing hreflang ${alternate.hreflang} -> ${alternate.href}`);
      }
    }

    const requiredSocialMeta = [
      { attr: "property", name: "og:title" },
      { attr: "property", name: "og:description" },
      { attr: "property", name: "og:type" },
      { attr: "property", name: "og:url" },
      { attr: "property", name: "og:image" },
      { attr: "name", name: "twitter:card" },
      { attr: "name", name: "twitter:title" },
      { attr: "name", name: "twitter:description" },
      { attr: "name", name: "twitter:image" },
    ];

    for (const meta of requiredSocialMeta) {
      if (!hasMeta(scanHtml, meta.attr, meta.name)) {
        reportIssue(issues, relative, `missing social metadata ${meta.name}`);
      }
    }

    const jsonLdBlocks = [...scanHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (!jsonLdBlocks.length) {
      reportIssue(issues, relative, "missing JSON-LD structured data");
    }
    for (const [, json] of jsonLdBlocks) {
      try {
        JSON.parse(json.trim());
      } catch (error) {
        reportIssue(issues, relative, `invalid JSON-LD structured data: ${error.message}`);
      }
    }
  }
}

const sitemapPath = path.join(ROOT, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  reportIssue(issues, "sitemap.xml", "missing sitemap.xml");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  for (const file of primaryHtmlFiles()) {
    const relative = rel(file);
    const html = fs.readFileSync(file, "utf8");
    if (!isNoindex(html)) {
      const url = canonicalUrlFor(relative);
      if (!sitemap.includes(`<loc>${url}</loc>`)) {
        reportIssue(issues, "sitemap.xml", `missing ${url}`);
      }
    }
  }
}

const robotsPath = path.join(ROOT, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  reportIssue(issues, "robots.txt", "missing robots.txt");
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
    reportIssue(issues, "robots.txt", "missing sitemap directive");
  }
}

if (issues.length) {
  console.error(`SEO check failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log("SEO check passed.");
console.log(`Checked ${files.length} HTML files with ${pairs.size / 2} bilingual page pairs.`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function encodeUrlPath(urlPath) {
  return urlPath
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}
