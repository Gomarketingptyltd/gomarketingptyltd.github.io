const test = require("node:test");
const assert = require("node:assert/strict");
const { checkUnique, checkPage, checkRejectedImages, audit } = require("./blog-images");
const { createHash } = require("node:crypto");
const { socialMetadata, articleNode } = require("./update-seo-metadata");
const manifest = require("./blog-images.json");

test("all published articles have unique registered covers and consistent placements", () => {
  assert.deepEqual(audit(), []);
});

test("renaming an identical image is rejected by its bytes", () => {
  const entries = {
    "a.html": { image: "/images/insights/one.jpg", sourceId: "one" },
    "b.html": { image: "/images/insights/renamed.jpg", sourceId: "two" },
  };
  assert.match(checkUnique(entries, () => Buffer.from("same photo")).join("\n"), /duplicate bytes/);
});

test("alternate encodings or crops of the same source are rejected", () => {
  const entries = {
    "a.html": { image: "/images/insights/one.jpg", sourceId: "pexels:123" },
    "b.html": { image: "/images/insights/crop.jpg", sourceId: "pexels:123" },
  };
  assert.match(checkUnique(entries, (file) => Buffer.from(file)).join("\n"), /duplicate source/);
});

test("query strings cannot disguise a duplicate image path", () => {
  const entries = {
    "a.html": { image: "/images/insights/one.jpg?v=1", sourceId: "one" },
    "b.html": { image: "/images/insights/one.jpg?v=2", sourceId: "two" },
  };
  assert.match(checkUnique(entries, () => Buffer.from("photo")).join("\n"), /duplicate path/);
});

test("new unregistered articles and missing assets block release", () => {
  assert.match(checkPage("services/new.html", '<div class="article-meta"></div>', {}).join("\n"), /not registered/);
  assert.match(checkUnique({ "a.html": {image:"/images/insights/missing.jpg", sourceId:"a"} }, () => { throw Error(); }).join("\n"), /missing asset/);
});

test("stale article thumbnails are detected on home and Chinese pages", () => {
  const entries = { "a.html": { image: "/images/insights/new.jpg" } };
  for (const [page, href] of [["index.html", "services/a.html"], ["cn/insights.html", "./a.html"]]) {
    const html = `<a href="${href}"><div><img src="/images/insights/old.jpg" alt="Photo"></div></a>`;
    assert.match(checkPage(page, html, entries).join("\n"), /stale thumbnail/);
    assert.deepEqual(checkPage(page, html.replace("old.jpg", "new.jpg"), entries), []);
  }
});

test("metadata generation uses the manifest for both language versions", () => {
  for (const [article, { image }] of Object.entries(manifest)) {
    for (const language of ["services", "cn"]) {
      const context = { relative: `${language}/${article}`, canonical: `https://gomarketing.net.au/${language}/${article}`, title: "Article", description: "Description", html: '<div class="article-meta"><time data-article-date="published" datetime="2026-01-01">Jan 1, 2026</time></div>' };
      assert.ok(socialMetadata(context).includes(`content="https://gomarketing.net.au${image}"`));
      assert.equal(articleNode(context).image, `https://gomarketing.net.au${image}`);
    }
  }
});

test("rejected source cannot return through a renamed manifest entry", () => {
  const entry = { "a.html": { image: "/images/insights/renamed.jpg", sourceId: "pexels:29205845" } };
  assert.match(checkUnique(entry, () => Buffer.from("different crop")).join("\n"), /owner-rejected/);
});

test("rejected image URLs are blocked in visible, responsive, social and structured images", () => {
  const url = "https://gomarketing.net.au/images/insights/china-safe/pexels-29205845.jpg?v=2";
  const placements = [
    `<img src="${url}">`,
    `<source srcset="/images/safe.jpg 1x, ${url} 2x">`,
    `<meta property="og:image" content="${url}">`,
    `<meta name="twitter:image" content="${url}">`,
    `<link rel="preload" as="image" href="${url}">`,
    `<script type="application/ld+json">${JSON.stringify({"@graph":[{"@type":"WebPage",image:[{"@type":"ImageObject",url}]}]})}</script>`,
  ];
  for (const html of placements) assert.match(checkRejectedImages("services/example.html", html).join("\n"), /owner-rejected/);
  assert.deepEqual(checkRejectedImages("services/example.html", '<img src="/images/insights/editorial/restaurant-food-content-693267.jpg">'), []);
});

test("identical rejected image bytes cannot hide behind a different URL", () => {
  const bytes = Buffer.from("rejected image fixture");
  const rule = { pathMarker: "blocked-original", sha256: createHash("sha256").update(bytes).digest("hex") };
  assert.match(checkRejectedImages("services/example.html", '<img src="/images/renamed.jpg">', () => bytes, [rule]).join("\n"), /owner-rejected/);
});

test("generated covers require provenance and stay within the image size budget", () => {
  const entry = { "a.html": { image: "/images/insights/generated/a.jpg", sourceId: "generated:a" } };
  assert.match(checkUnique(entry, () => Buffer.alloc(251 * 1024)).join("\n"), /exceeds 250 KB/);
  assert.match(checkUnique(entry, () => Buffer.from("image")).join("\n"), /requires provenance/);
});

test("automation service and educational guide have distinct non-rejected social covers", () => {
  for (const language of ["services", "cn"]) {
    const relative = `${language}/marketingAutomationServicesSydney.html`;
    const html = socialMetadata({relative, canonical:`https://gomarketing.net.au/${relative}`, title:"Automation", description:"Services", html:""});
    assert.ok(html.includes("/images/services/generated/custom-automation-system.jpg"));
    assert.ok(!html.includes(manifest["whatIsMarketingAutomation.html"].image));
    assert.deepEqual(checkRejectedImages(relative, html), []);
  }
});
