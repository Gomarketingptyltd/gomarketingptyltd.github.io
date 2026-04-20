#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://gomarketing.net.au";
const TODAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Australia/Sydney",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

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

function htmlFiles() {
  return walk(ROOT).filter((file) => file.endsWith(".html"));
}

function primaryHtmlFiles() {
  return htmlFiles().filter((file) => {
    const name = rel(file);
    return name === "index.html" || /^services\/[^/]+\.html$/.test(name) || /^cn\/[^/]+\.html$/.test(name);
  });
}

function isNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function canonicalPathFor(relPath) {
  if (relPath === "index.html") return "/";
  if (relPath === "services/index.html") return "/services/";
  if (relPath === "cn/index.html") return "/cn/";
  return `/${relPath}`;
}

function encodeUrlPath(urlPath) {
  return urlPath
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}

function canonicalUrlFor(relPath) {
  return `${SITE_URL}${encodeUrlPath(canonicalPathFor(relPath))}`;
}

function buildPairs(files) {
  const fileSet = new Set(files.map(rel));
  const pairs = new Map();

  function add(en, zh) {
    if (fileSet.has(en) && fileSet.has(zh)) {
      pairs.set(en, { en, zh });
      pairs.set(zh, { en, zh });
    }
  }

  add("index.html", "cn/index.html");
  add("services/index.html", "cn/graphicDesign.html");

  for (const file of fileSet) {
    const match = file.match(/^services\/([^/]+\.html)$/);
    if (!match || file === "services/index.html") continue;
    add(file, `cn/${match[1]}`);
  }

  return pairs;
}

function sitemapUrlBlock(relative, pairs) {
  const lines = [
    "  <url>",
    `    <loc>${canonicalUrlFor(relative)}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
  ];

  if (pairs.has(relative)) {
    const pair = pairs.get(relative);
    lines.push(`    <xhtml:link rel="alternate" hreflang="en-AU" href="${canonicalUrlFor(pair.en)}" />`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${canonicalUrlFor(pair.zh)}" />`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrlFor(pair.en)}" />`);
  }

  lines.push("  </url>");
  return lines.join("\n");
}

const files = primaryHtmlFiles();
const pairs = buildPairs(files);

const sitemapUrls = files
  .map((file) => rel(file))
  .sort((a, b) => canonicalPathFor(a).localeCompare(canonicalPathFor(b)))
  .filter((relative) => !isNoindex(fs.readFileSync(path.join(ROOT, relative), "utf8")))
  .map((relative) => sitemapUrlBlock(relative, pairs))
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapUrls}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(ROOT, "robots.txt"), robots);

console.log(`Generated sitemap with ${sitemapUrls.split("  <url>").length - 1} URLs.`);
