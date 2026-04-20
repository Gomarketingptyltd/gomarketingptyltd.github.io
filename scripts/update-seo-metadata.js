#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://gomarketing.net.au";
const SITE_NAME = "Go Marketing";
const LEGAL_NAME = "Go Marketing Pty Ltd";
const SOCIAL_IMAGE = `${SITE_URL}/images/logo.png`;
const LOGO_IMAGE = `${SITE_URL}/images/newlogoblack.jpeg`;
const EMAIL = "info@gomarketing.net.au";
const TELEPHONE = "+61299096785";

const SOCIAL_BLOCK_RE =
  /\n?\s*<!-- Managed social metadata -->[\s\S]*?<!-- End managed social metadata -->\s*/i;
const STRUCTURED_DATA_BLOCK_RE =
  /\n?\s*<!-- Managed structured data -->[\s\S]*?<!-- End managed structured data -->\s*/i;

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

function htmlDecode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? htmlDecode(match[1].trim()) : "";
}

function getDescription(html) {
  const match = html.match(/<meta\s+name=["']description["'][\s\S]*?\bcontent=["']([^"']*)["'][^>]*>/i);
  return match ? htmlDecode(match[1].trim()) : "";
}

function getCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i);
  return match ? htmlDecode(match[1].trim()) : "";
}

function isChinese(relative) {
  return relative.startsWith("cn/");
}

function pageNameFromTitle(title) {
  return title.replace(/^Go Marketing Pty Ltd\s*-\s*/i, "").trim() || SITE_NAME;
}

function inLanguage(relative) {
  return isChinese(relative) ? "zh-Hans" : "en-AU";
}

function ogLocale(relative) {
  return isChinese(relative) ? "zh_CN" : "en_AU";
}

function socialMetadata({ title, description, canonical, relative }) {
  return [
    "\t<!-- Managed social metadata -->",
    `\t<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
    `\t<meta property="og:title" content="${escapeAttr(title)}">`,
    `\t<meta property="og:description" content="${escapeAttr(description)}">`,
    `\t<meta property="og:type" content="website">`,
    `\t<meta property="og:url" content="${escapeAttr(canonical)}">`,
    `\t<meta property="og:image" content="${escapeAttr(SOCIAL_IMAGE)}">`,
    `\t<meta property="og:locale" content="${ogLocale(relative)}">`,
    `\t<meta name="twitter:card" content="summary_large_image">`,
    `\t<meta name="twitter:title" content="${escapeAttr(title)}">`,
    `\t<meta name="twitter:description" content="${escapeAttr(description)}">`,
    `\t<meta name="twitter:image" content="${escapeAttr(SOCIAL_IMAGE)}">`,
    "\t<!-- End managed social metadata -->",
  ].join("\n");
}

function agencyNode(description) {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#agency`,
    name: LEGAL_NAME,
    alternateName: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: LOGO_IMAGE,
    image: SOCIAL_IMAGE,
    email: EMAIL,
    telephone: TELEPHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "100 Barangaroo Ave",
      addressLocality: "Barangaroo",
      addressRegion: "NSW",
      postalCode: "2000",
      addressCountry: "AU",
    },
    areaServed: [
      { "@type": "City", name: "Sydney" },
      { "@type": "Country", name: "Australia" },
    ],
    availableLanguage: ["English", "Chinese"],
    description,
    knowsAbout: [
      "Bilingual marketing",
      "Chinese-Australian audience communication",
      "Xiaohongshu marketing",
      "WeChat marketing",
      "Website messaging",
      "Digital credibility",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bilingual marketing services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Chinese Community Growth",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bilingual Brand and Content Strategy",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Website Messaging and Digital Credibility",
          },
        },
      ],
    },
  };
}

function structuredData({ title, description, canonical, relative }) {
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#agency` },
      inLanguage: inLanguage(relative),
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: pageNameFromTitle(title),
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#agency` },
      inLanguage: inLanguage(relative),
    },
  ];

  if (relative === "index.html" || relative === "cn/index.html") {
    graph.unshift(agencyNode(description));
  }

  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return [
    "\t<!-- Managed structured data -->",
    `\t<script type="application/ld+json">`,
    `\t${json}`,
    "\t</script>",
    "\t<!-- End managed structured data -->",
  ].join("\n");
}

function updateFile(file) {
  const relative = rel(file);
  const html = fs.readFileSync(file, "utf8");
  const title = getTitle(html);
  const description = getDescription(html);
  const canonical = getCanonical(html);

  if (!title || !description || !canonical) {
    throw new Error(`${relative} is missing title, description, or canonical URL`);
  }

  const managed = `${socialMetadata({ title, description, canonical, relative })}\n${structuredData({
    title,
    description,
    canonical,
    relative,
  })}\n`;

  const cleaned = html.replace(SOCIAL_BLOCK_RE, "\n").replace(STRUCTURED_DATA_BLOCK_RE, "\n").replace(/\n{3,}/g, "\n\n");
  const next = cleaned.replace(/<\/head>/i, `${managed}</head>`);

  if (next !== html) {
    fs.writeFileSync(file, next);
  }
}

const files = primaryHtmlFiles();
for (const file of files) {
  updateFile(file);
}

console.log(`Updated social metadata and structured data for ${files.length} primary pages.`);
