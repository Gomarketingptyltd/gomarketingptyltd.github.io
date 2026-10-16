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

test("root favicon is an unchanged copy of the existing valid company icon", () => {
  const icon = fs.readFileSync(path.join(root, "favicon.ico"));
  assert.deepEqual(icon, fs.readFileSync(path.join(root, "images/favicon.ico")));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.ok(icon.readUInt16LE(4) > 0);
});
