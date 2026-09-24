const assert = require("node:assert/strict");
const test = require("node:test");
const { buildSnapshotMarkdown } = require("./search-console");

function snapshot(sitemaps) {
  return buildSnapshotMarkdown({
    siteUrl: "sc-domain:example.com",
    sites: [],
    sitemaps,
    outputDir: "/tmp/search-console-report",
    summary: {
      generatedAt: "2026-09-24T00:00:00Z",
      startDate: "2026-08-25",
      endDate: "2026-09-21",
      totals: { clicks: 19, impressions: 4880, ctr: 19 / 4880, position: 43.02 },
      counts: { queries: 295, pages: 55 },
    },
  });
}

test("snapshot does not interpret deprecated sitemap indexed values as counts", () => {
  for (const indexed of ["0", "90", undefined]) {
    const report = snapshot({
      sitemap: [{
        path: "https://example.com/sitemap.xml",
        contents: [{ submitted: "90", indexed }],
        warnings: "0",
        errors: "0",
      }],
    });
    assert.match(report, /submitted: 90 \| warnings: 0 \| errors: 0/);
    assert.match(report, /indexed field is deprecated/);
    assert.doesNotMatch(report, /\| indexed:|Indexed from sitemap:/);
    assert.match(report, /Clicks: 19/);
  }
});

test("snapshot handles properties without submitted sitemaps", () => {
  const report = snapshot({});
  assert.match(report, /No sitemap entries returned/);
  assert.match(report, /URL Inspection/);
});
