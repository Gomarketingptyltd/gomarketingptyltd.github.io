const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("legacy contact path goes directly to the existing contact section", () => {
  const html = read("contact/index.html");
  assert.match(html, /http-equiv="refresh" content="0; url=\/#info"/);
  assert.match(html, /href="\/#info"/);
  assert.match(html, /rel="canonical" href="https:\/\/gomarketing\.net\.au\/"/);
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.doesNotMatch(html, /<form\b|<script\b/i);
  assert.match(read("index.html"), /\bid="info"/);
  assert.match(read("index.html"), /data-enquiry-form="native"/);
});

test("contact alias is not promoted as a separate search landing page", () => {
  assert.doesNotMatch(read("sitemap.xml"), /<loc>https:\/\/gomarketing\.net\.au\/contact\//);
});

test("agency introductions link to the existing language-matched enquiry form first", () => {
  const pages = [
    ["services/sydneyBilingualMarketingAgency.html", "../#info", "index.html"],
    ["cn/sydneyBilingualMarketingAgency.html", "./#info", "cn/index.html"],
  ];

  for (const [page, href, home] of pages) {
    const hero = read(page).match(/<section class="service-overview__hero">([\s\S]*?)<\/section>/)?.[1];
    assert.ok(hero, `${page}: introduction exists`);
    const firstLink = hero.match(/<div class="service-overview__nav">\s*<a href="([^"]+)">([^<]+)<\/a>/);
    assert.equal(firstLink?.[1], href, `${page}: enquiry precedes chapter links`);
    assert.ok(firstLink[2].trim(), `${page}: enquiry has a visible label`);
    assert.doesNotMatch(hero, /<form\b/i);
    assert.match(read(home), /\bid="info"/);
    assert.match(read(home), /data-enquiry-form="native"/);
  }
});

test("root favicon is an unchanged copy of the existing valid company icon", () => {
  const icon = fs.readFileSync(path.join(root, "favicon.ico"));
  assert.deepEqual(icon, fs.readFileSync(path.join(root, "images/favicon.ico")));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.ok(icon.readUInt16LE(4) > 0);
});
