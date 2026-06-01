#!/usr/bin/env node

const { createServer } = require("http");
const path = require("path");
const {
  CONFIG_PATH,
  TOKEN_PATH,
  WEBMASTERS_SCOPE,
  loadConfig,
  loadToken,
  saveToken,
  createAuthUrl,
  exchangeAuthorizationCode,
  getAccessToken,
  requireScope,
  callSearchConsole,
  ensureDir,
  reportsDirForRange,
  resolveDateRange,
  writeJson,
  writeCsv,
  writeText,
  parseArgs,
  formatRowsForCsv,
} = require("./search-console-lib");

function usage() {
  console.log(`Usage:
  node scripts/search-console.js auth
  node scripts/search-console.js import-client /path/to/client_secret_xxx.json
  node scripts/search-console.js doctor
  node scripts/search-console.js sites
  node scripts/search-console.js sitemaps [--siteUrl=sc-domain:gomarketing.net.au]
  node scripts/search-console.js submit-sitemap [--siteUrl=sc-domain:gomarketing.net.au] --feedpath=https://gomarketing.net.au/sitemap.xml
  node scripts/search-console.js delete-sitemap [--siteUrl=sc-domain:gomarketing.net.au] --feedpath=https://gomarketing.net.au/
  node scripts/search-console.js snapshot [--siteUrl=sc-domain:gomarketing.net.au] [--days=28]
  node scripts/search-console.js report [--siteUrl=sc-domain:gomarketing.net.au] [--days=28]
  node scripts/search-console.js report [--siteUrl=sc-domain:gomarketing.net.au] --start=YYYY-MM-DD --end=YYYY-MM-DD

Config:
  Copy search-console.config.example.json to .search-console/config.json
  and add your Google OAuth desktop-app credentials.

Stored locally:
  Config: ${CONFIG_PATH}
  Token:  ${TOKEN_PATH}
  Scope:  ${WEBMASTERS_SCOPE}`);
}

function runImportClient(args) {
  const jsonPath = args._[1] || args.path;
  if (!jsonPath) {
    throw new Error("Missing OAuth client JSON path. Usage: npm run search-console:import-client -- /path/to/client_secret_xxx.json");
  }

  const imported = require("./search-console-lib").importGoogleClientFile(jsonPath);
  console.log("Imported Google OAuth client into local Search Console config:");
  console.log(`- Client ID: ${imported.clientId}`);
  console.log(`- Redirect URI: ${imported.redirectUri}`);
  console.log(`- Config: ${CONFIG_PATH}`);
  console.log("Next step:");
  console.log("  npm run search-console:auth");
}

async function runDoctor() {
  const {
    doctor,
  } = require("./search-console-lib");
  const report = await doctor();

  console.log("\nSearch Console local status:\n");
  for (const item of report.checks) {
    const prefix = item.ok ? "OK " : "ERR";
    console.log(`- [${prefix}] ${item.label}: ${item.message}`);
  }

  if (report.nextSteps.length) {
    console.log("\nSuggested next steps:\n");
    for (const step of report.nextSteps) {
      console.log(`- ${step}`);
    }
  }
}

async function runAuth() {
  const config = loadConfig();
  const authUrl = createAuthUrl(config);
  const redirectUrl = new URL(config.redirectUri);
  const hostname = redirectUrl.hostname;
  const port = Number(redirectUrl.port || 80);
  const callbackPath = redirectUrl.pathname;

  console.log("\nOpen this URL in your browser and approve access:\n");
  console.log(authUrl.url);
  console.log(`\nListening for OAuth callback on ${config.redirectUri}\n`);

  await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const requestUrl = new URL(req.url, config.redirectUri);

      if (requestUrl.pathname !== callbackPath) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      const returnedState = requestUrl.searchParams.get("state");
      const code = requestUrl.searchParams.get("code");
      const error = requestUrl.searchParams.get("error");

      if (error) {
        res.statusCode = 400;
        res.end(`Authorization failed: ${error}`);
        server.close();
        reject(new Error(`Google returned an OAuth error: ${error}`));
        return;
      }

      if (!code || returnedState !== authUrl.state) {
        res.statusCode = 400;
        res.end("Invalid OAuth callback");
        server.close();
        reject(new Error("OAuth callback was missing a valid code or state."));
        return;
      }

      try {
        const token = await exchangeAuthorizationCode(config, code);
        saveToken(token);

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end("<h1>Search Console API connected</h1><p>You can return to the terminal.</p>");
        server.close(() => resolve());
      } catch (errorObject) {
        res.statusCode = 500;
        res.end(`Token exchange failed: ${errorObject.message}`);
        server.close();
        reject(errorObject);
      }
    });

    server.once("error", reject);
    server.listen(port, hostname);
  });

  console.log("Authorization successful. Token saved locally.");
  console.log("Next steps:");
  console.log("  npm run search-console:sites");
  console.log("  npm run search-console:report -- --days=28");
}

async function runSites() {
  const config = loadConfig();
  const token = loadToken();
  const accessToken = await getAccessToken(config, token);
  const sites = await fetchSites(accessToken);
  if (!sites.length) {
    console.log("No Search Console properties were returned for this account.");
    return;
  }

  console.log("\nAccessible Search Console properties:\n");
  for (const site of sites) {
    console.log(`- ${site.siteUrl} (${site.permissionLevel})`);
  }
}

async function runSitemaps(args) {
  const config = loadConfig();
  const siteUrl = args.siteUrl || config.siteUrl;
  if (!siteUrl) {
    throw new Error("Missing siteUrl. Add it to .search-console/config.json or pass --siteUrl=...");
  }

  const token = loadToken();
  const accessToken = await getAccessToken(config, token);
  const response = await fetchSitemaps(accessToken, siteUrl);

  const outputDir = reportsDirForRange("sitemaps");
  ensureDir(outputDir);
  const outputPath = `${outputDir}/sitemaps.json`;
  writeJson(outputPath, response);

  const sitemaps = response.sitemap || [];
  console.log(`Saved ${sitemaps.length} sitemap entries to ${outputPath}`);
}

async function fetchSites(accessToken) {
  const response = await callSearchConsole({
    accessToken,
    pathname: "/sites",
  });
  return response.siteEntry || [];
}

async function fetchSitemaps(accessToken, siteUrl) {
  return callSearchConsole({
    accessToken,
    pathname: `/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
  });
}

async function runSubmitSitemap(args) {
  const config = loadConfig();
  const siteUrl = args.siteUrl || config.siteUrl;
  const feedpath = args.feedpath;

  if (!siteUrl) {
    throw new Error("Missing siteUrl. Add it to .search-console/config.json or pass --siteUrl=...");
  }
  if (!feedpath) {
    throw new Error("Missing --feedpath. Example: --feedpath=https://gomarketing.net.au/sitemap.xml");
  }

  const token = loadToken();
  requireScope(token, WEBMASTERS_SCOPE);
  const accessToken = await getAccessToken(config, token);

  await callSearchConsole({
    accessToken,
    pathname: `/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
    method: "PUT",
  });

  console.log(`Submitted sitemap for ${siteUrl}: ${feedpath}`);
}

async function runDeleteSitemap(args) {
  const config = loadConfig();
  const siteUrl = args.siteUrl || config.siteUrl;
  const feedpath = args.feedpath;

  if (!siteUrl) {
    throw new Error("Missing siteUrl. Add it to .search-console/config.json or pass --siteUrl=...");
  }
  if (!feedpath) {
    throw new Error("Missing --feedpath. Example: --feedpath=https://gomarketing.net.au/");
  }

  const token = loadToken();
  requireScope(token, WEBMASTERS_SCOPE);
  const accessToken = await getAccessToken(config, token);

  await callSearchConsole({
    accessToken,
    pathname: `/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
    method: "DELETE",
  });

  console.log(`Deleted sitemap for ${siteUrl}: ${feedpath}`);
}

async function fetchDimensionReport({ accessToken, siteUrl, startDate, endDate, dimensions, rowLimit }) {
  const response = await callSearchConsole({
    accessToken,
    pathname: `/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    method: "POST",
    body: {
      startDate,
      endDate,
      dimensions,
      rowLimit,
      dataState: "final",
    },
  });

  return response.rows || [];
}

function totalMetric(rows, metricName) {
  return rows.reduce((sum, row) => sum + Number(row[metricName] || 0), 0);
}

function weightedAveragePosition(rows) {
  let weighted = 0;
  let impressions = 0;
  for (const row of rows) {
    const rowImpressions = Number(row.impressions || 0);
    const position = Number(row.position || 0);
    weighted += position * rowImpressions;
    impressions += rowImpressions;
  }
  return impressions ? weighted / impressions : 0;
}

function buildReportSummary(results, metadata) {
  const dateRows = results.dates || [];
  const totalClicks = totalMetric(dateRows, "clicks");
  const totalImpressions = totalMetric(dateRows, "impressions");
  const averageCtr = totalImpressions ? totalClicks / totalImpressions : 0;
  const averagePosition = weightedAveragePosition(dateRows);

  return {
    generatedAt: new Date().toISOString(),
    ...metadata,
    counts: Object.fromEntries(
      Object.entries(results).map(([name, rows]) => [name, rows.length]),
    ),
    totals: {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: averageCtr,
      position: averagePosition,
    },
    topQuery: results.queries[0] || null,
    topPage: results.pages[0] || null,
  };
}

async function runReport(args) {
  const config = loadConfig();
  const siteUrl = args.siteUrl || config.siteUrl;
  if (!siteUrl) {
    throw new Error("Missing siteUrl. Add it to .search-console/config.json or pass --siteUrl=...");
  }

  const { startDate, endDate } = resolveDateRange({
    start: args.start,
    end: args.end,
    days: args.days,
    defaultDays: config.defaultDateRangeDays,
    lagDays: config.dataLagDays,
  });

  const accessToken = await getAccessToken(config, loadToken());
  const rowLimit = Number(args.rowLimit || 250);
  const outputDir = reportsDirForRange(`${startDate}_to_${endDate}`);
  ensureDir(outputDir);

  const dimensions = {
    queries: ["query"],
    pages: ["page"],
    countries: ["country"],
    devices: ["device"],
    dates: ["date"],
  };

  const results = {};
  for (const [name, dims] of Object.entries(dimensions)) {
    results[name] = await fetchDimensionReport({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      dimensions: dims,
      rowLimit,
    });
    writeCsv(`${outputDir}/${name}.csv`, formatRowsForCsv(results[name], dims));
  }

  const summary = buildReportSummary(results, {
    siteUrl,
    startDate,
    endDate,
    rowLimit,
  });

  writeJson(`${outputDir}/summary.json`, summary);

  console.log(`Saved Search Console report to ${outputDir}`);
  console.log(`- Queries: ${results.queries.length}`);
  console.log(`- Pages: ${results.pages.length}`);
  console.log(`- Countries: ${results.countries.length}`);
  console.log(`- Devices: ${results.devices.length}`);
  console.log(`- Dates: ${results.dates.length}`);
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-AU");
}

function buildSnapshotMarkdown({ siteUrl, sites, sitemaps, summary, outputDir }) {
  const matchedSite = sites.find((site) => site.siteUrl === siteUrl) || null;
  const activeSitemaps = sitemaps.sitemap || [];
  const topQuery = summary.topQuery?.keys?.[0] || "None yet";
  const topPage = summary.topPage?.keys?.[0] || "None yet";

  const sitemapLines = activeSitemaps.length
    ? activeSitemaps.map((item) => {
        const submitted = item.contents?.[0]?.submitted || "0";
        const indexed = item.contents?.[0]?.indexed || "0";
        return `- ${item.path} | submitted: ${submitted} | indexed: ${indexed} | warnings: ${item.warnings} | errors: ${item.errors}`;
      }).join("\n")
    : "- No sitemap entries returned";

  return `# Search Console Snapshot

- Generated: ${summary.generatedAt}
- Site property: ${siteUrl}
- Permission level: ${matchedSite ? matchedSite.permissionLevel : "Unknown"}
- Report range: ${summary.startDate} to ${summary.endDate}

## Sitemaps

${sitemapLines}

## Performance Summary

- Clicks: ${formatNumber(summary.totals.clicks)}
- Impressions: ${formatNumber(summary.totals.impressions)}
- CTR: ${formatPercent(summary.totals.ctr)}
- Avg position: ${Number(summary.totals.position || 0).toFixed(2)}
- Query rows: ${summary.counts.queries}
- Page rows: ${summary.counts.pages}

## Current Leaders

- Top query: ${topQuery}
- Top page: ${topPage}

## Files

- Summary JSON: ${path.join(outputDir, "summary.json")}
- Snapshot markdown: ${path.join(outputDir, "snapshot.md")}
`;
}

async function runSnapshot(args) {
  const config = loadConfig();
  const siteUrl = args.siteUrl || config.siteUrl;
  if (!siteUrl) {
    throw new Error("Missing siteUrl. Add it to .search-console/config.json or pass --siteUrl=...");
  }

  const { startDate, endDate } = resolveDateRange({
    start: args.start,
    end: args.end,
    days: args.days,
    defaultDays: config.defaultDateRangeDays,
    lagDays: config.dataLagDays,
  });

  const token = loadToken();
  const accessToken = await getAccessToken(config, token);
  const rowLimit = Number(args.rowLimit || 250);
  const outputDir = reportsDirForRange(`${startDate}_to_${endDate}`);
  ensureDir(outputDir);

  const sites = await fetchSites(accessToken);
  const sitemaps = await fetchSitemaps(accessToken, siteUrl);
  const dimensions = {
    queries: ["query"],
    pages: ["page"],
    countries: ["country"],
    devices: ["device"],
    dates: ["date"],
  };
  const results = {};
  for (const [name, dims] of Object.entries(dimensions)) {
    results[name] = await fetchDimensionReport({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      dimensions: dims,
      rowLimit,
    });
    writeCsv(`${outputDir}/${name}.csv`, formatRowsForCsv(results[name], dims));
  }

  const summary = buildReportSummary(results, {
    siteUrl,
    startDate,
    endDate,
    rowLimit,
  });
  writeJson(`${outputDir}/summary.json`, summary);
  writeJson(path.join(reportsDirForRange("sitemaps"), "sitemaps.json"), sitemaps);
  writeText(
    `${outputDir}/snapshot.md`,
    buildSnapshotMarkdown({
      siteUrl,
      sites,
      sitemaps,
      summary,
      outputDir,
    }),
  );

  console.log(`Saved Search Console snapshot to ${outputDir}`);
  console.log(`- Snapshot: ${path.join(outputDir, "snapshot.md")}`);
  console.log(`- Impressions: ${formatNumber(summary.totals.impressions)}`);
  console.log(`- Indexed from sitemap: ${sitemaps.sitemap?.[0]?.contents?.[0]?.indexed || "0"}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || args.help || args.h) {
    usage();
    return;
  }

  if (command === "auth") {
    await runAuth();
    return;
  }

  if (command === "import-client") {
    runImportClient(args);
    return;
  }

  if (command === "doctor") {
    await runDoctor();
    return;
  }

  if (command === "sites") {
    await runSites();
    return;
  }

  if (command === "sitemaps") {
    await runSitemaps(args);
    return;
  }

  if (command === "submit-sitemap") {
    await runSubmitSitemap(args);
    return;
  }

  if (command === "delete-sitemap") {
    await runDeleteSitemap(args);
    return;
  }

  if (command === "snapshot") {
    await runSnapshot(args);
    return;
  }

  if (command === "report") {
    await runReport(args);
    return;
  }

  usage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Search Console command failed: ${error.message}`);
  process.exitCode = 1;
});
