const test = require("node:test");
const assert = require("node:assert/strict");
const { ORIGIN, KEY, digest, pageUrl, assertIndexable, buildPlan, verifyLive, parseArgs } = require("./indexnow");
const url = `${ORIGIN}/services/support.html`;
const html = `<html><head><link href="${url}" rel="canonical"><meta content="index, follow" name="robots"></head><body>Scoped support</body></html>`;
const sitemap = `<urlset><url><loc>${url}</loc></url></urlset>`;
const options = { files: ["services/support.html"], readFile: () => html, sitemap };

test("only public page paths are eligible, with canonical directory roots", () => {
  assert.equal(pageUrl("index.html"), `${ORIGIN}/`);
  assert.equal(pageUrl("cn/index.html"), `${ORIGIN}/cn/`);
  for (const file of [".search-console/private.html", "../index.html", "services/../../private.html", "services/test.html?secret=x", "brochure/xiaohongshu/index.html"]) assert.equal(pageUrl(file), null);
});
test("requires an exact commit and makes submission opt-in", () => {
  assert.equal(parseArgs([`--since=${"a".repeat(40)}`]).submit, false);
  assert.equal(parseArgs([`--since=${"a".repeat(40)}`, "--submit"]).submit, true);
  for (const args of [[], ["--since=HEAD~1"], ["--all"], ["--url=https://example.com"], [`--since=${"a".repeat(40)}`, "--force"]]) assert.throws(() => parseArgs(args));
});
test("blocks noindex in either attribute order, redirects and wrong canonicals", () => {
  assert.doesNotThrow(() => assertIndexable(html, url));
  for (const tag of ['<meta name="robots" content="noindex">', '<meta content="none" name="bingbot">', '<meta content="0;url=/" http-equiv="refresh">']) assert.throws(() => assertIndexable(html.replace("</head>", `${tag}</head>`), url));
  assert.throws(() => assertIndexable(html, `${ORIGIN}/`));
  assert.throws(() => assertIndexable(html.replace("</head>", `<link rel="canonical" href="${url}"></head>`), url));
});
test("plans only sitemap-listed public HTML and removes duplicates", () => {
  const plan = buildPlan({ ...options, files: [...options.files, ...options.files, "cn/private.html"] });
  assert.equal(plan.entries.length, 1);
  assert.equal(plan.entries[0].sha256, digest(html));
  assert.equal(plan.skipped.length, 1);
});
test("holds already received, rejected and uncertain versions without re-posting", () => {
  for (const state of ["received", "received-key-validation-pending", "outcome-unknown", "rejected-review-required"]) {
    assert.equal(buildPlan({ ...options, ledger: { [url]: { sha256: digest(html), state } } }).entries.length, 0);
  }
});
test("changed content remains subject to a 24-hour cooldown", () => {
  const now = Date.parse("2026-10-26T02:00:00Z");
  const ledger = { [url]: { sha256: "old", submittedAt: "2026-10-26T01:00:00Z", state: "received" } };
  assert.equal(buildPlan({ ...options, ledger, now }).entries.length, 0);
  assert.equal(buildPlan({ ...options, ledger, now: now + 86400000 }).entries.length, 1);
});
test("caps a release rather than silently truncating submitted URLs", () => {
  const files = Array.from({ length: 21 }, (_, i) => `services/page${i}.html`);
  assert.throws(() => buildPlan({ files, sitemap: files.map((f) => `<loc>${pageUrl(f)}</loc>`).join(""), readFile: (f) => `<link rel="canonical" href="${pageUrl(f)}">` }), /more than 20/);
});

function fakeFetch(overrides = {}) {
  return async (target, init) => {
    assert.equal(init.redirect, "error");
    const defaults = target.endsWith(`${KEY}.txt`) ? KEY : target.endsWith("robots.txt") ? `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n` : target.endsWith("sitemap.xml") ? sitemap : html;
    const patch = overrides[target] || {};
    return new Response(patch.body ?? defaults, { status: patch.status ?? 200, headers: { "content-type": "text/html; charset=utf-8", ...patch.headers } });
  };
}
test("live check accepts exact published bytes before any POST", async () => {
  await verifyLive(buildPlan(options).entries, fakeFetch());
});
test("live check fails closed on missing key, robots changes and version mismatch", async () => {
  for (const overrides of [
    { [`${ORIGIN}/${KEY}.txt`]: { body: "wrong" } },
    { [`${ORIGIN}/robots.txt`]: { body: "User-agent: *\nDisallow: /" } },
    { [`${ORIGIN}/sitemap.xml`]: { body: "<urlset/>" } },
    { [url]: { body: `${html} changed` } },
    { [url]: { status: 404 } },
    { [url]: { headers: { "x-robots-tag": "noindex" } } },
    { [url]: { headers: { "content-type": "application/json" } } }
  ]) await assert.rejects(verifyLive(buildPlan(options).entries, fakeFetch(overrides)));
});
