const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { OUTPUT_PATH, opportunity, selectComparison } = require("./seo-dashboard");

test("dashboard selects adjacent equal windows rather than overlapping snapshots", () => {
  assert.deepEqual(selectComparison([
    "2026-08-26_to_2026-09-22",
    "2026-08-01_to_2026-08-28",
    "2026-08-28_to_2026-09-24",
    "2026-08-29_to_2026-09-25",
  ]), {
    latest: "2026-08-29_to_2026-09-25",
    previous: "2026-08-01_to_2026-08-28",
  });
});

test("missing comparison fails with a recovery command, never compares with itself", () => {
  assert.throws(() => selectComparison(["2026-08-29_to_2026-09-25"]),
    /--start=2026-08-01 --end=2026-08-28/);
});

test("overlapping and unequal-length reports are rejected as comparisons", () => {
  for (const previous of ["2026-08-28_to_2026-09-24", "2026-08-02_to_2026-08-28"]) {
    assert.throws(() => selectComparison([previous, "2026-08-29_to_2026-09-25"]),
      /Missing adjacent equal-length/);
  }
});

test("comparison handles year boundaries", () => {
  assert.deepEqual(selectComparison(["2025-12-18_to_2026-01-14", "2025-11-20_to_2025-12-17"]), {
    latest: "2025-12-18_to_2026-01-14", previous: "2025-11-20_to_2025-12-17",
  });
});

test("missing performance data is not treated as an indexing failure", () => {
  for (const latest of [null, { impressions: 0, position: 0, ctr: 0 }]) {
    assert.equal(opportunity({ latest, previous: null }).decision, "hold");
  }
});

test("existing near-page-one opportunity remains a review suggestion", () => {
  assert.equal(opportunity({ latest: { impressions: 60, position: 11, ctr: 0 }, previous: null }).score, 5);
});

test("dashboard output stays under the ignored local reports directory", () => {
  assert.equal(OUTPUT_PATH, path.resolve(__dirname, "../.search-console/reports/seo-dashboard.md"));
});
