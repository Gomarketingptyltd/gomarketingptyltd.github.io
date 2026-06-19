#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, ".search-console", "reports");
const OUTPUT_PATH = path.join(ROOT, "docs", "seo-dashboard.md");
const SITE_URL = "https://gomarketing.net.au";

const PRIORITY_PAGES = [
  { label: "Homepage", path: "/" },
  { label: "Digital services", path: "/services/digital.html" },
  { label: "Chinese agency", path: "/services/sydneyBilingualMarketingAgency.html" },
  { label: "Chinese community growth", path: "/services/chineseCommunityGrowth.html" },
  { label: "Marketing support", path: "/services/support.html" },
  { label: "Advertising", path: "/services/advertising.html" },
  { label: "Marketing automation", path: "/services/marketingAutomationServicesSydney.html" },
  { label: "Reach Chinese consumers article", path: "/services/howToReachChineseConsumersInSydney.html" },
  { label: "Xiaohongshu restaurants article", path: "/services/xiaohongshuMarketingForSydneyRestaurants.html" },
  { label: "Digital small business article", path: "/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html" },
];

const PRIORITY_QUERIES = [
  "marketing agency sydney",
  "digital marketing services sydney",
  "digital marketing strategy sydney",
  "chinese marketing agency sydney",
  "chinese marketing sydney",
  "xiaohongshu marketing sydney",
  "wechat marketing agency australia",
  "marketing support services",
  "marketing automation sydney",
];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function reportDirs() {
  if (!fs.existsSync(REPORTS_DIR)) {
    throw new Error(`Missing Search Console reports directory: ${REPORTS_DIR}`);
  }

  return fs.readdirSync(REPORTS_DIR)
    .filter((name) => /^\d{4}-\d{2}-\d{2}_to_\d{4}-\d{2}-\d{2}$/.test(name))
    .sort();
}

function loadReport(name) {
  const dir = path.join(REPORTS_DIR, name);
  return {
    name,
    dir,
    summary: JSON.parse(fs.readFileSync(path.join(dir, "summary.json"), "utf8")),
    pages: readCsv(path.join(dir, "pages.csv")),
    queries: readCsv(path.join(dir, "queries.csv")),
  };
}

function number(value) {
  return Number(value || 0);
}

function pct(value) {
  return `${(number(value) * 100).toFixed(2)}%`;
}

function fixed(value, digits = 1) {
  return number(value).toFixed(digits);
}

function signed(value, digits = 0) {
  const numeric = number(value);
  const formatted = digits ? numeric.toFixed(digits) : String(Math.round(numeric));
  return numeric > 0 ? `+${formatted}` : formatted;
}

function pageUrl(pagePath) {
  return `${SITE_URL}${pagePath === "/" ? "/" : pagePath}`;
}

function findPage(rows, pagePath) {
  const url = pageUrl(pagePath);
  return rows.find((row) => row.page === url) || null;
}

function findQuery(rows, query) {
  return rows.find((row) => row.query.toLowerCase() === query.toLowerCase()) || null;
}

function opportunity({ latest, previous }) {
  if (!latest) {
    return { score: 3, decision: "request indexing", reason: "No row in latest report" };
  }

  const position = number(latest.position);
  const ctr = number(latest.ctr);
  const impressions = number(latest.impressions);
  const previousImpressions = previous ? number(previous.impressions) : 0;
  const impressionsRising = previousImpressions > 0
    ? impressions >= previousImpressions * 1.15
    : impressions > 0;

  if (position >= 4 && position <= 10 && ctr < 0.02) {
    return { score: 5, decision: "edit", reason: "Position 4-10 with weak CTR" };
  }
  if (position > 10 && position <= 15 && ctr < 0.015) {
    return { score: 5, decision: "edit", reason: "Position 11-15 with weak CTR" };
  }
  if (position > 15 && position <= 25 && impressionsRising) {
    return { score: 4, decision: "edit", reason: "Position 16-25 with rising impressions" };
  }
  if (impressions === 0) {
    return { score: 3, decision: "request indexing", reason: "No impressions in latest report" };
  }
  return { score: 2, decision: "hold", reason: "No high-confidence edit trigger yet" };
}

function totalsLine(latest, previous) {
  const latestTotals = latest.summary.totals;
  const previousTotals = previous.summary.totals;
  const clickDelta = latestTotals.clicks - previousTotals.clicks;
  const impressionDelta = latestTotals.impressions - previousTotals.impressions;
  const ctrDelta = latestTotals.ctr - previousTotals.ctr;
  const positionDelta = latestTotals.position - previousTotals.position;

  return [
    `- Clicks: ${latestTotals.clicks} (${signed(clickDelta)})`,
    `- Impressions: ${latestTotals.impressions.toLocaleString("en-AU")} (${signed(impressionDelta)})`,
    `- CTR: ${pct(latestTotals.ctr)} (${signed(ctrDelta * 100, 2)} pp)`,
    `- Avg position: ${fixed(latestTotals.position, 2)} (${signed(positionDelta, 2)}; lower is better)`,
  ];
}

function daysSince(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  const now = new Date();
  return Math.floor((now - date) / 86400000);
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function main() {
  const dirs = reportDirs();
  if (dirs.length < 1) {
    throw new Error("No Search Console reports found. Run npm run search-console:snapshot -- --days=28 first.");
  }

  const latest = loadReport(dirs[dirs.length - 1]);
  const previous = dirs.length > 1 ? loadReport(dirs[dirs.length - 2]) : latest;
  const generatedAt = new Date().toISOString();
  const latestDataAgeDays = daysSince(latest.summary.endDate);
  const freshnessNote = latestDataAgeDays > 4
    ? `- Freshness warning: latest available GSC end date is ${latestDataAgeDays} days old. Refresh Search Console auth and run a new snapshot before making major ranking calls.`
    : `- Freshness: latest available GSC end date is ${latestDataAgeDays} days old.`;

  const pageRows = PRIORITY_PAGES.map((page) => {
    const latestRow = findPage(latest.pages, page.path);
    const previousRow = findPage(previous.pages, page.path);
    const action = opportunity({ latest: latestRow, previous: previousRow });
    return [
      page.label,
      page.path,
      latestRow ? number(latestRow.clicks) : 0,
      latestRow ? number(latestRow.impressions) : 0,
      latestRow ? pct(latestRow.ctr) : "0.00%",
      latestRow ? fixed(latestRow.position, 1) : "-",
      previousRow && latestRow ? signed(number(latestRow.impressions) - number(previousRow.impressions)) : "-",
      action.score,
      action.decision,
      action.reason,
    ];
  });

  const queryRows = PRIORITY_QUERIES.map((query) => {
    const latestRow = findQuery(latest.queries, query);
    const previousRow = findQuery(previous.queries, query);
    return [
      query,
      latestRow ? number(latestRow.clicks) : 0,
      latestRow ? number(latestRow.impressions) : 0,
      latestRow ? pct(latestRow.ctr) : "0.00%",
      latestRow ? fixed(latestRow.position, 1) : "-",
      previousRow && latestRow ? signed(number(latestRow.impressions) - number(previousRow.impressions)) : "-",
    ];
  });

  const topActions = pageRows
    .filter((row) => row[8] !== "hold")
    .sort((a, b) => number(b[7]) - number(a[7]))
    .slice(0, 5);

  const lines = [
    "# SEO Dashboard",
    "",
    `- Generated: ${generatedAt}`,
    `- Latest GSC window: ${latest.summary.startDate} to ${latest.summary.endDate}`,
    `- Previous comparison window: ${previous.summary.startDate} to ${previous.summary.endDate}`,
    `- Source: ${latest.dir}`,
    freshnessNote,
    "",
    "## Site Summary",
    "",
    ...totalsLine(latest, previous),
    "",
    "## Priority Pages",
    "",
    markdownTable(
      ["Page", "Path", "Clicks", "Impressions", "CTR", "Position", "Impr delta", "Score", "Decision", "Reason"],
      pageRows,
    ),
    "",
    "## Priority Queries",
    "",
    markdownTable(
      ["Query", "Clicks", "Impressions", "CTR", "Position", "Impr delta"],
      queryRows,
    ),
    "",
    "## Next Action Queue",
    "",
    topActions.length
      ? markdownTable(["Page", "Path", "Score", "Decision", "Reason"], topActions.map((row) => [row[0], row[1], row[7], row[8], row[9]]))
      : "- No non-hold page action from the latest report. Keep indexing and SERP review active.",
    "",
    "## Manager Notes",
    "",
    "- A lower average position number is better.",
    "- Use this dashboard with `docs/seo-manager-operating-system.md`; do not ship edits without production safety checks.",
    "- GSC data has reporting lag, so validate material edits on the next scheduled pulse before judging impact.",
  ];

  fs.writeFileSync(OUTPUT_PATH, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote SEO dashboard to ${OUTPUT_PATH}`);
}

main();
