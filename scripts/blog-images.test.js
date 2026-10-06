const test = require("node:test");
const assert = require("node:assert/strict");
const { checkUnique, checkPage, audit } = require("./blog-images");
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
