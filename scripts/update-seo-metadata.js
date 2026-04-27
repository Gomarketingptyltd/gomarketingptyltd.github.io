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
const AGENCY_DESCRIPTION =
  "Go Marketing is a Sydney-based bilingual marketing agency helping hospitality, property, wellness and service-based businesses build stronger trust, clearer communication and better visibility across Chinese-Australian and mainstream Australian markets.";
const CHINESE_AGENCY_DESCRIPTION =
  "Go Marketing 是一家位于悉尼的双语营销机构，帮助餐饮、地产、健康养生、牙科及服务型企业在华人社区与澳洲主流市场之间建立更清晰的沟通、更强的信任和更好的可见度。";
const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/go-marketing-pty-ltd/",
  "https://www.instagram.com/gomarketing22/",
  "https://twitter.com/GoMarketing18",
  "https://www.facebook.com/profile.php?id=100078097333826",
  "https://www.youtube.com/channel/UCENkRPv-bwIm1n_2zygeKag",
];
const CUSTOM_SOCIAL_IMAGES = {
  "index.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/index.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/index.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/graphicDesign.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/chineseCommunityGrowth.html":
    "https://images.pexels.com/photos/30470951/pexels-photo-30470951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/chineseCommunityGrowth.html":
    "https://images.pexels.com/photos/30470951/pexels-photo-30470951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/digital.html":
    "https://images.pexels.com/photos/8970645/pexels-photo-8970645.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/digital.html":
    "https://images.pexels.com/photos/8970645/pexels-photo-8970645.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/sydneyHospitalityMarketing.html":
    "https://images.pexels.com/photos/17564425/pexels-photo-17564425.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/sydneyHospitalityMarketing.html":
    "https://images.pexels.com/photos/17564425/pexels-photo-17564425.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/sydneyPropertyMarketing.html":
    "https://images.pexels.com/photos/17082224/pexels-photo-17082224.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/sydneyPropertyMarketing.html":
    "https://images.pexels.com/photos/17082224/pexels-photo-17082224.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/sydneyHealthWellnessDentalMarketing.html":
    "https://images.pexels.com/photos/12746003/pexels-photo-12746003.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/sydneyHealthWellnessDentalMarketing.html":
    "https://images.pexels.com/photos/12746003/pexels-photo-12746003.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/bilingualBrandContentStrategy.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/bilingualBrandContentStrategy.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/sydneyBilingualMarketingAgency.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/sydneyBilingualMarketingAgency.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/web.html":
    "https://images.pexels.com/photos/10347149/pexels-photo-10347149.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/web.html":
    "https://images.pexels.com/photos/10347149/pexels-photo-10347149.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/targetMarket.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/targetMarket.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/QnA.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/QnA.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/support.html":
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/support.html":
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/insights.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/insights.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/bilingualMarketingNotTranslation.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/bilingualMarketingNotTranslation.html":
    "https://images.pexels.com/photos/4344340/pexels-photo-4344340.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/restaurantTrustChineseCustomers.html":
    "https://images.pexels.com/photos/29394567/pexels-photo-29394567.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/restaurantTrustChineseCustomers.html":
    "https://images.pexels.com/photos/29394567/pexels-photo-29394567.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/websiteMessagingMistakes.html":
    "https://images.pexels.com/photos/5483188/pexels-photo-5483188.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/websiteMessagingMistakes.html":
    "https://images.pexels.com/photos/5483188/pexels-photo-5483188.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/wechatXiaohongshuPlatformFit.html":
    "https://images.pexels.com/photos/30470951/pexels-photo-30470951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/wechatXiaohongshuPlatformFit.html":
    "https://images.pexels.com/photos/30470951/pexels-photo-30470951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/propertyCommunicationChineseAudiences.html":
    "https://images.pexels.com/photos/17082224/pexels-photo-17082224.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/propertyCommunicationChineseAudiences.html":
    "https://images.pexels.com/photos/17082224/pexels-photo-17082224.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/digitalCredibilityChecklist.html":
    "https://images.pexels.com/photos/10347149/pexels-photo-10347149.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/digitalCredibilityChecklist.html":
    "https://images.pexels.com/photos/10347149/pexels-photo-10347149.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/xiaohongshuVsInstagramHospitality.html":
    "https://images.pexels.com/photos/17564425/pexels-photo-17564425.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/xiaohongshuVsInstagramHospitality.html":
    "https://images.pexels.com/photos/17564425/pexels-photo-17564425.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/chineseAustralianAudiencesDiscoverLocalBusinesses.html":
    "https://images.pexels.com/photos/30470951/pexels-photo-30470951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/chineseAustralianAudiencesDiscoverLocalBusinesses.html":
    "https://images.pexels.com/photos/30470951/pexels-photo-30470951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/dentalTrustChinesePatientsSydney.html":
    "https://images.pexels.com/photos/12746003/pexels-photo-12746003.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/dentalTrustChinesePatientsSydney.html":
    "https://images.pexels.com/photos/12746003/pexels-photo-12746003.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/localSeoStartsWithClearMessaging.html":
    "https://images.pexels.com/photos/8970645/pexels-photo-8970645.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/localSeoStartsWithClearMessaging.html":
    "https://images.pexels.com/photos/8970645/pexels-photo-8970645.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/howToEvaluateWhetherBusiness.html":
    "https://images.pexels.com/photos/8970671/pexels-photo-8970671.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/howToEvaluateWhetherBusiness.html":
    "https://images.pexels.com/photos/8970671/pexels-photo-8970671.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/howToMakeMotion.html":
    "https://images.pexels.com/photos/7818230/pexels-photo-7818230.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/howToMakeMotion.html":
    "https://images.pexels.com/photos/7818230/pexels-photo-7818230.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/whatIsBrandKit.html":
    "https://images.pexels.com/photos/8970685/pexels-photo-8970685.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/whatIsBrandKit.html":
    "https://images.pexels.com/photos/8970685/pexels-photo-8970685.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/whatIsAgileMarketing.html":
    "https://images.pexels.com/photos/8279219/pexels-photo-8279219.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/whatIsAgileMarketing.html":
    "https://images.pexels.com/photos/8279219/pexels-photo-8279219.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/whatIsGlobalStrategy.html":
    "https://images.pexels.com/photos/7412032/pexels-photo-7412032.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/whatIsGlobalStrategy.html":
    "https://images.pexels.com/photos/7412032/pexels-photo-7412032.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/whatIsMarketingAutomation.html":
    "https://images.pexels.com/photos/29205845/pexels-photo-29205845.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/whatIsMarketingAutomation.html":
    "https://images.pexels.com/photos/29205845/pexels-photo-29205845.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "services/whatIsDigitalPoster.html":
    "https://images.pexels.com/photos/12887602/pexels-photo-12887602.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "cn/whatIsDigitalPoster.html":
    "https://images.pexels.com/photos/12887602/pexels-photo-12887602.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

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
  const match = html.match(/<meta\s+name=["']description["'][\s\S]*?\bcontent=(["'])([\s\S]*?)\1[^>]*>/i);
  return match ? htmlDecode(match[2].trim()) : "";
}

function getCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i);
  return match ? htmlDecode(match[1].trim()) : "";
}

function stripTags(value) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
}

function cleanText(value) {
  return htmlDecode(stripTags(value))
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function isChinese(relative) {
  return relative.startsWith("cn/");
}

function pageNameFromTitle(title) {
  return title.replace(/^Go Marketing Pty Ltd\s*-\s*/i, "").trim() || SITE_NAME;
}

function monthNumber(name) {
  const months = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  };
  return months[name.toLowerCase()] || null;
}

function normalizeDate(value) {
  const text = cleanText(value);
  const english = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (english) {
    const month = monthNumber(english[1]);
    if (!month) return null;
    const day = String(english[2]).padStart(2, "0");
    return `${english[3]}-${month}-${day}`;
  }

  const chinese = text.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  if (chinese) {
    return `${chinese[1]}-${String(chinese[2]).padStart(2, "0")}-${String(chinese[3]).padStart(2, "0")}`;
  }

  return null;
}

function articleDateFromHtml(html) {
  const match = html.match(/<div class=["']article-meta["'][\s\S]*?<span class=["']date["']>([\s\S]*?)<\/span>/i);
  return match ? normalizeDate(match[1]) : null;
}

function inLanguage(relative) {
  return isChinese(relative) ? "zh-Hans" : "en-AU";
}

function ogLocale(relative) {
  return isChinese(relative) ? "zh_CN" : "en_AU";
}

function canonicalPathFor(relative) {
  if (relative === "index.html") return "/";
  if (relative === "services/index.html") return "/services/";
  if (relative === "cn/index.html") return "/cn/";
  return `/${relative}`;
}

function canonicalUrlFor(relative) {
  return `${SITE_URL}${encodeURI(canonicalPathFor(relative))}`;
}

function socialImageFor(relative) {
  return CUSTOM_SOCIAL_IMAGES[relative] || SOCIAL_IMAGE;
}

function socialMetadata({ title, description, canonical, relative, html }) {
  const image = socialImageFor(relative);
  const articleDate = articleDateFromHtml(html);
  const ogType = articleDate ? "article" : "website";
  return [
    "\t<!-- Managed social metadata -->",
    `\t<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
    `\t<meta property="og:title" content="${escapeAttr(title)}">`,
    `\t<meta property="og:description" content="${escapeAttr(description)}">`,
    `\t<meta property="og:type" content="${ogType}">`,
    `\t<meta property="og:url" content="${escapeAttr(canonical)}">`,
    `\t<meta property="og:image" content="${escapeAttr(image)}">`,
    `\t<meta property="og:locale" content="${ogLocale(relative)}">`,
    ...(articleDate
      ? [
          `\t<meta property="article:published_time" content="${articleDate}">`,
          `\t<meta property="article:modified_time" content="${articleDate}">`,
        ]
      : []),
    `\t<meta name="twitter:card" content="summary_large_image">`,
    `\t<meta name="twitter:title" content="${escapeAttr(title)}">`,
    `\t<meta name="twitter:description" content="${escapeAttr(description)}">`,
    `\t<meta name="twitter:image" content="${escapeAttr(image)}">`,
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
      streetAddress: "Level 35, International Tower One, 100 Barangaroo Ave",
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
    sameAs: SOCIAL_PROFILES,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: EMAIL,
        telephone: TELEPHONE,
        availableLanguage: ["English", "Chinese"],
        areaServed: "AU",
      },
    ],
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

function breadcrumbNode({ title, canonical, relative }) {
  if (relative === "index.html") return null;
  const chinese = isChinese(relative);
  const items = [];

  if (chinese) {
    items.push({ name: "主页", item: `${SITE_URL}/cn/` });
    if (relative !== "cn/index.html") {
      items.push({ name: pageNameFromTitle(title), item: canonical });
    }
  } else {
    items.push({ name: "Home", item: `${SITE_URL}/` });
    if (relative === "services/index.html") {
      items.push({ name: "Services", item: canonical });
    } else if (relative.startsWith("services/")) {
      items.push({ name: "Services", item: `${SITE_URL}/services/` });
      items.push({ name: pageNameFromTitle(title), item: canonical });
    } else {
      items.push({ name: pageNameFromTitle(title), item: canonical });
    }
  }

  if (items.length < 2) return null;

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function faqNode({ html, canonical, relative }) {
  const qnaEntries = /QnA\.html$/i.test(relative)
    ? [...html.matchAll(/<div class=["']content__details["'][\s\S]*?<h4 class=["']QnA--heading["']>([\s\S]*?)<\/h4>[\s\S]*?<div class=["']QnA--normal["'][^>]*>([\s\S]*?)<\/div>/gi)]
        .map((match) => ({
          question: cleanText(match[1]),
          answer: cleanText(match[2]),
        }))
    : [];

  const seoFaqEntries = [...html.matchAll(/<article class=["']seo-faq__item["'][\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/article>/gi)]
    .map((match) => ({
      question: cleanText(match[1]),
      answer: cleanText(match[2]),
    }));

  const entries = [...qnaEntries, ...seoFaqEntries].filter((entry) => entry.question && entry.answer);

  if (!entries.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    url: canonical,
    inLanguage: inLanguage(relative),
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

function articleNode({ title, description, canonical, relative, html }) {
  if (!/class=["']article-meta["']/i.test(html)) return null;
  const date = articleDateFromHtml(html);
  return {
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    headline: pageNameFromTitle(title),
    description,
    image: socialImageFor(relative),
    datePublished: date || undefined,
    dateModified: date || undefined,
    mainEntityOfPage: canonical,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@id": `${SITE_URL}/#agency`,
    },
    inLanguage: inLanguage(relative),
  };
}

function insightsItemListNode({ html, canonical, relative, filePath }) {
  if (!/\/insights\.html$/i.test(canonical)) return null;

  const items = [...html.matchAll(/<a href=["']([^"']+\.html)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      if (!match[1].startsWith("./")) return null;
      const titleMatch = match[2].match(/<div class=["']ourInsightCardHeader["']>([\s\S]*?)<\/div>/i);
      if (!titleMatch) return null;
      const targetPath = path.resolve(path.dirname(filePath), match[1]);
      const relativeTarget = rel(targetPath);
      return {
        name: cleanText(titleMatch[1]),
        url: canonicalUrlFor(relativeTarget),
      };
    })
    .filter(Boolean)
    .filter((item, index, arr) => item.name && item.url && arr.findIndex((candidate) => candidate.url === item.url) === index);

  if (!items.length) return null;

  return {
    "@type": "ItemList",
    "@id": `${canonical}#itemlist`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

function structuredData({ title, description, canonical, relative, html, filePath }) {
  const page = {
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: pageNameFromTitle(title),
    description,
    image: socialImageFor(relative),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#agency` },
    inLanguage: inLanguage(relative),
  };

  const graph = [
    agencyNode(isChinese(relative) ? CHINESE_AGENCY_DESCRIPTION : AGENCY_DESCRIPTION),
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#agency` },
      inLanguage: inLanguage(relative),
    },
    page,
  ];

  const breadcrumb = breadcrumbNode({ title, canonical, relative });
  if (breadcrumb) {
    page.breadcrumb = { "@id": breadcrumb["@id"] };
    graph.push(breadcrumb);
  }

  const article = articleNode({ title, description, canonical, relative, html });
  if (article) {
    page.mainEntity = { "@id": article["@id"] };
    graph.push(article);
  }

  const faq = faqNode({ html, canonical, relative });
  if (faq) {
    page["@type"] = ["WebPage", "FAQPage"];
    page.mainEntity = faq.mainEntity;
  }

  const itemList = insightsItemListNode({ html, canonical, relative, filePath });
  if (itemList) {
    page["@type"] = "CollectionPage";
    page.mainEntity = { "@id": itemList["@id"] };
    graph.push(itemList);
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

  const managed = `${socialMetadata({ title, description, canonical, relative, html })}\n${structuredData({
    title,
    description,
    canonical,
    relative,
    html,
    filePath: file,
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
