#!/usr/bin/env node

const { createServer } = require("http");
const {
  CONFIG_PATH,
  TOKEN_PATH,
  WEBMASTERS_READONLY_SCOPE,
  loadConfig,
  loadToken,
  saveToken,
  createAuthUrl,
  exchangeAuthorizationCode,
  getAccessToken,
  callSearchConsole,
  ensureDir,
  reportsDirForRange,
  resolveDateRange,
  writeJson,
  writeCsv,
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
  node scripts/search-console.js report [--siteUrl=sc-domain:gomarketing.net.au] [--days=28]
  node scripts/search-console.js report [--siteUrl=sc-domain:gomarketing.net.au] --start=YYYY-MM-DD --end=YYYY-MM-DD

Config:
  Copy search-console.config.example.json to .search-console/config.json
  and add your Google OAuth desktop-app credentials.

Stored locally:
  Config: ${CONFIG_PATH}
  Token:  ${TOKEN_PATH}
  Scope:  ${WEBMASTERS_READONLY_SCOPE}`);
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

function runDoctor() {
  const {
    doctor,
  } = require("./search-console-lib");
  const report = doctor();

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
  const accessToken = await getAccessToken(config, loadToken());
  const response = await callSearchConsole({
    accessToken,
    pathname: "/sites",
  });

  const sites = response.siteEntry || [];
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

  const accessToken = await getAccessToken(config, loadToken());
  const response = await callSearchConsole({
    accessToken,
    pathname: `/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
  });

  const outputDir = reportsDirForRange("sitemaps");
  ensureDir(outputDir);
  const outputPath = `${outputDir}/sitemaps.json`;
  writeJson(outputPath, response);

  const sitemaps = response.sitemap || [];
  console.log(`Saved ${sitemaps.length} sitemap entries to ${outputPath}`);
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

  const summary = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    startDate,
    endDate,
    rowLimit,
    counts: Object.fromEntries(
      Object.entries(results).map(([name, rows]) => [name, rows.length]),
    ),
    topQuery: results.queries[0] || null,
    topPage: results.pages[0] || null,
  };

  writeJson(`${outputDir}/summary.json`, summary);

  console.log(`Saved Search Console report to ${outputDir}`);
  console.log(`- Queries: ${results.queries.length}`);
  console.log(`- Pages: ${results.pages.length}`);
  console.log(`- Countries: ${results.countries.length}`);
  console.log(`- Devices: ${results.devices.length}`);
  console.log(`- Dates: ${results.dates.length}`);
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
    runDoctor();
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
