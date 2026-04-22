const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SEARCH_CONSOLE_DIR = path.join(ROOT, ".search-console");
const CONFIG_PATH = path.join(SEARCH_CONSOLE_DIR, "config.json");
const TOKEN_PATH = path.join(SEARCH_CONSOLE_DIR, "token.json");
const REPORTS_DIR = path.join(SEARCH_CONSOLE_DIR, "reports");
const WEBMASTERS_SCOPE = "https://www.googleapis.com/auth/webmasters";
const WEBMASTERS_READONLY_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`);
}

function loadConfig() {
  const config = readJson(CONFIG_PATH);
  if (!config) {
    throw new Error(
      `Missing config file at ${CONFIG_PATH}. Copy search-console.config.example.json to .search-console/config.json first.`,
    );
  }

  const missing = ["clientId", "clientSecret", "redirectUri"].filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(`Missing required Search Console config values: ${missing.join(", ")}`);
  }

  return {
    defaultDateRangeDays: 28,
    dataLagDays: 3,
    ...config,
  };
}

function configHasPlaceholder(config) {
  return [
    config.clientId,
    config.clientSecret,
  ].some((value) => !value || String(value).includes("YOUR_GOOGLE_OAUTH"));
}

function loadToken() {
  const token = readJson(TOKEN_PATH);
  if (!token) {
    throw new Error(
      `Missing token file at ${TOKEN_PATH}. Run "npm run search-console:auth" first.`,
    );
  }
  return token;
}

function saveToken(token) {
  writeJson(TOKEN_PATH, token);
}

function importGoogleClientFile(inputPath) {
  const resolvedPath = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`OAuth client file not found: ${resolvedPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  const installed = raw.installed || raw.web;
  if (!installed || !installed.client_id) {
    throw new Error("The JSON file does not look like a valid Google OAuth client export.");
  }

  const existing = fs.existsSync(CONFIG_PATH) ? readJson(CONFIG_PATH) : {};
  const imported = {
    clientId: installed.client_id,
    clientSecret: installed.client_secret || "",
    redirectUri: existing.redirectUri || "http://127.0.0.1:8788",
    siteUrl: existing.siteUrl || "sc-domain:gomarketing.net.au",
    defaultDateRangeDays: existing.defaultDateRangeDays || 28,
    dataLagDays: existing.dataLagDays || 3,
  };

  writeJson(CONFIG_PATH, imported);
  return imported;
}

function parseArgs(argv) {
  const args = { _: [] };

  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      args._.push(arg);
      continue;
    }

    const [rawKey, ...rest] = arg.slice(2).split("=");
    args[rawKey] = rest.length ? rest.join("=") : true;
  }

  return args;
}

function createAuthUrl(config) {
  const state = crypto.randomBytes(16).toString("hex");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", WEBMASTERS_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  return { url: url.toString(), state };
}

function tokenHasScope(token, scope) {
  return String(token.scope || "")
    .split(/\s+/)
    .filter(Boolean)
    .includes(scope);
}

function requireScope(token, scope) {
  if (tokenHasScope(token, scope)) return;
  throw new Error(`Saved token is missing required scope: ${scope}. Run "npm run search-console:auth" again to upgrade access.`);
}

async function exchangeAuthorizationCode(config, code) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUri,
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error_description || json.error || "Token exchange failed");
  }

  return normalizeToken(json);
}

function normalizeToken(token) {
  const expiryDate = token.expires_in ? Date.now() + Number(token.expires_in) * 1000 : null;
  return {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    scope: token.scope,
    token_type: token.token_type,
    expiry_date: expiryDate,
  };
}

async function refreshAccessToken(config, token) {
  if (!token.refresh_token) {
    throw new Error("Saved token does not include a refresh token. Re-run auth with consent.");
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: token.refresh_token,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error_description || json.error || "Access token refresh failed");
  }

  const nextToken = {
    ...token,
    ...normalizeToken(json),
    refresh_token: token.refresh_token,
  };
  saveToken(nextToken);
  return nextToken.access_token;
}

async function getAccessToken(config, token) {
  if (token.access_token && token.expiry_date && token.expiry_date > Date.now() + 60_000) {
    return token.access_token;
  }
  return refreshAccessToken(config, token);
}

async function callSearchConsole({ accessToken, pathname, method = "GET", body = null }) {
  const url = new URL(`https://www.googleapis.com/webmasters/v3${pathname}`);
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  const json = rawText ? JSON.parse(rawText) : {};
  if (!response.ok) {
    const message = json.error?.message || json.error_description || "Search Console API request failed";
    throw new Error(message);
  }
  return json;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function resolveDateRange({ start, end, days, defaultDays, lagDays }) {
  if (start && end) {
    return { startDate: start, endDate: end };
  }

  const totalDays = Number(days || defaultDays || 28);
  const lag = Number(lagDays || 3);
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - lag);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - (totalDays - 1));

  return {
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
  };
}

function reportsDirForRange(label) {
  return path.join(REPORTS_DIR, label);
}

function doctor() {
  const checks = [];
  const nextSteps = [];

  const configExists = fs.existsSync(CONFIG_PATH);
  checks.push({
    label: "Config file",
    ok: configExists,
    message: configExists ? CONFIG_PATH : `Missing ${CONFIG_PATH}`,
  });

  if (!configExists) {
    nextSteps.push("Create .search-console/config.json or import a downloaded Google OAuth client JSON.");
    return { checks, nextSteps };
  }

  const config = readJson(CONFIG_PATH);
  const placeholder = configHasPlaceholder(config);
  checks.push({
    label: "OAuth client values",
    ok: !placeholder,
    message: !placeholder ? "Client ID and client secret are present." : "Config still contains placeholder OAuth values.",
  });

  checks.push({
    label: "Redirect URI",
    ok: Boolean(config.redirectUri),
    message: config.redirectUri || "Missing redirectUri",
  });

  checks.push({
    label: "Site URL",
    ok: Boolean(config.siteUrl),
    message: config.siteUrl || "Missing siteUrl",
  });

  const tokenExists = fs.existsSync(TOKEN_PATH);
  checks.push({
    label: "OAuth token",
    ok: tokenExists,
    message: tokenExists ? TOKEN_PATH : `Missing ${TOKEN_PATH}`,
  });

  if (tokenExists) {
    const token = readJson(TOKEN_PATH);
    const canManage = tokenHasScope(token, WEBMASTERS_SCOPE);
    checks.push({
      label: "Token scope",
      ok: canManage,
      message: canManage ? token.scope : `Current token scope is ${token.scope || "missing"}`,
    });
    if (!canManage) {
      nextSteps.push("Re-run local authorization to upgrade from read-only access: npm run search-console:auth");
    }
  }

  if (placeholder) {
    nextSteps.push("Import your downloaded Google OAuth client JSON: npm run search-console:import-client -- /path/to/client_secret_xxx.json");
  }

  if (!tokenExists && !placeholder) {
    nextSteps.push("Run local authorization: npm run search-console:auth");
  }

  if (tokenExists) {
    nextSteps.push("List accessible Search Console properties: npm run search-console:sites");
    nextSteps.push("Pull the latest performance bundle: npm run search-console:report -- --days=28");
    nextSteps.push("Submit the current sitemap: npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml");
  }

  return { checks, nextSteps };
}

function escapeCsvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function writeCsv(filePath, rows) {
  ensureDir(path.dirname(filePath));

  if (!rows.length) {
    fs.writeFileSync(filePath, "\n");
    return;
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(",")),
  ];

  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function formatRowsForCsv(rows, dimensions) {
  return rows.map((row) => {
    const entry = {};
    dimensions.forEach((dimension, index) => {
      entry[dimension] = row.keys?.[index] || "";
    });
    entry.clicks = row.clicks ?? "";
    entry.impressions = row.impressions ?? "";
    entry.ctr = row.ctr ?? "";
    entry.position = row.position ?? "";
    return entry;
  });
}

module.exports = {
  CONFIG_PATH,
  TOKEN_PATH,
  WEBMASTERS_SCOPE,
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
  writeText,
  writeCsv,
  parseArgs,
  formatRowsForCsv,
  importGoogleClientFile,
  doctor,
  requireScope,
};
