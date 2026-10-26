#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://gomarketing.net.au";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY = "f637a8a6610c9333bf7cff037953d6cf";
const MAX_URLS = 20;
const digest = (text) => crypto.createHash("sha256").update(text).digest("hex");

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function pageUrl(file) {
  if (!/^(index\.html|(?:services|cn)\/[A-Za-z0-9&_-]+\.html)$/.test(file)) return null;
  return `${ORIGIN}/${file}`.replace(/\/index\.html$/, "/");
}

function assertIndexable(html, url) {
  const clean = html.replace(/<!--[\s\S]*?-->/g, "");
  const meta = [...clean.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => tag);
  if (meta.some((tag) => /^(robots|googlebot|bingbot)$/i.test(attr(tag, "name")) && /\b(noindex|none)\b/i.test(attr(tag, "content")))) {
    throw new Error(`${url}: noindex directive`);
  }
  if (meta.some((tag) => /^refresh$/i.test(attr(tag, "http-equiv")))) throw new Error(`${url}: redirect page`);
  const canonicals = [...clean.matchAll(/<link\b[^>]*>/gi)]
    .map(([tag]) => tag).filter((tag) => /^canonical$/i.test(attr(tag, "rel")));
  if (canonicals.length !== 1 || attr(canonicals[0], "href") !== url) throw new Error(`${url}: canonical mismatch`);
}

function buildPlan({ files, readFile, sitemap, ledger = {}, now = Date.now() }) {
  const allowed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const entries = [];
  const skipped = [];
  for (const file of [...new Set(files)].sort()) {
    const url = pageUrl(file);
    if (!url || !allowed.has(url)) {
      skipped.push({ file, reason: "outside published service-page sitemap" });
      continue;
    }
    const html = readFile(file);
    assertIndexable(html, url);
    const sha256 = digest(html);
    const previous = ledger[url];
    if (previous?.sha256 === sha256) {
      // Even an uncertain POST outcome is held for review, not blindly retried.
      skipped.push({ file, reason: `unchanged version: ${previous.state}` });
      continue;
    }
    if (previous?.submittedAt && now - Date.parse(previous.submittedAt) < 86400000) {
      skipped.push({ file, reason: "24-hour per-URL cooldown" });
      continue;
    }
    entries.push({ file, url, sha256 });
  }
  if (entries.length > MAX_URLS) throw new Error(`Refusing more than ${MAX_URLS} URLs in one reviewed release`);
  return { entries, skipped };
}

async function getText(url, fetcher) {
  const response = await fetcher(url, { redirect: "error", signal: AbortSignal.timeout(20000), headers: { "cache-control": "no-cache" } });
  if (response.status !== 200) throw new Error(`${url}: expected HTTP 200, received ${response.status}`);
  return { response, text: await response.text() };
}

async function verifyLive(entries, fetcher = fetch) {
  const key = await getText(`${ORIGIN}/${KEY}.txt`, fetcher);
  if (key.text.trim() !== KEY) throw new Error("Live IndexNow verification file does not match");
  const robots = await getText(`${ORIGIN}/robots.txt`, fetcher);
  // Only the existing simple allow-all policy is supported. Changed rules need review.
  const lines = robots.text.split(/\r?\n/).map((line) => line.replace(/#.*/, "").trim()).filter(Boolean);
  if (lines.length !== 3 || !lines.includes("User-agent: *") || !lines.includes("Allow: /") || !lines.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) {
    throw new Error("Robots policy changed; review before submitting");
  }
  const sitemap = await getText(`${ORIGIN}/sitemap.xml`, fetcher);
  for (const entry of entries) {
    if (!sitemap.text.includes(`<loc>${entry.url}</loc>`)) throw new Error(`${entry.url}: absent from live sitemap`);
    const page = await getText(entry.url, fetcher);
    if (!/text\/html/i.test(page.response.headers.get("content-type") || "")) throw new Error(`${entry.url}: not HTML`);
    if (/\b(noindex|none)\b/i.test(page.response.headers.get("x-robots-tag") || "")) throw new Error(`${entry.url}: X-Robots-Tag blocks indexing`);
    assertIndexable(page.text, entry.url);
    if (digest(page.text) !== entry.sha256) throw new Error(`${entry.url}: production is not the reviewed version`);
  }
}

function parseArgs(args) {
  if (args.some((arg) => arg !== "--submit" && !/^--since=[a-f0-9]{40}$/.test(arg))) throw new Error("Use --since=<full commit SHA> and optionally --submit");
  const commits = args.filter((arg) => arg.startsWith("--since="));
  if (commits.length !== 1) throw new Error("Exactly one --since=<full commit SHA> is required");
  return { since: commits[0].slice(8), submit: args.includes("--submit") };
}

function writePrivate(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(tmp, file);
}

async function main(args) {
  const { since, submit } = parseArgs(args);
  execFileSync("git", ["merge-base", "--is-ancestor", since, "HEAD"], { cwd: ROOT });
  const files = execFileSync("git", ["diff", "--name-only", "--diff-filter=AM", since, "HEAD", "--", "*.html"], { cwd: ROOT, encoding: "utf8" }).trim().split("\n").filter(Boolean);
  if (files.length && execFileSync("git", ["status", "--porcelain", "--", ...files], { cwd: ROOT, encoding: "utf8" }).trim()) throw new Error("Changed pages must be committed and clean before planning");
  const dir = path.join(ROOT, ".search-console", "reports", "indexnow");
  const ledgerFile = path.join(dir, "ledger.json");
  const lockFile = path.join(dir, "submit.lock");
  let lock;
  if (submit) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    lock = fs.openSync(lockFile, "wx", 0o600);
  }
  try {
    const ledger = fs.existsSync(ledgerFile) ? JSON.parse(fs.readFileSync(ledgerFile, "utf8")) : {};
    const plan = buildPlan({ files, readFile: (file) => fs.readFileSync(path.join(ROOT, file), "utf8"), sitemap: fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8"), ledger });
    if (!submit || !plan.entries.length) {
      console.log(JSON.stringify({ mode: submit ? "no-change" : "dry-run", since, ...plan }, null, 2));
      return;
    }
    await verifyLive(plan.entries);
    const submittedAt = new Date().toISOString();
    const receipt = { submittedAt, since, head: execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(), endpoint: ENDPOINT, entries: plan.entries, state: "outcome-unknown", httpStatus: null, meaning: "Receipt only; not indexing, ranking, AI citation or traffic evidence." };
    const receiptFile = path.join(dir, `${submittedAt.replace(/[:.]/g, "-")}.json`);
    for (const entry of plan.entries) ledger[entry.url] = { sha256: entry.sha256, submittedAt, state: receipt.state };
    writePrivate(ledgerFile, ledger);
    writePrivate(receiptFile, receipt);
    try {
      const response = await fetch(ENDPOINT, { method: "POST", redirect: "error", signal: AbortSignal.timeout(30000), headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: new URL(ORIGIN).host, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: plan.entries.map((entry) => entry.url) }) });
      receipt.httpStatus = response.status;
      receipt.state = response.status === 200 ? "received" : response.status === 202 ? "received-key-validation-pending" : "rejected-review-required";
      await response.text();
    } finally {
      for (const entry of plan.entries) ledger[entry.url].state = receipt.state;
      writePrivate(ledgerFile, ledger);
      writePrivate(receiptFile, receipt);
      console.log(JSON.stringify({ ...receipt, receiptFile }, null, 2));
    }
    if (![200, 202].includes(receipt.httpStatus)) throw new Error("Submission not accepted; inspect receipt, do not retry automatically");
  } finally {
    if (lock !== undefined) {
      fs.closeSync(lock);
      fs.unlinkSync(lockFile);
    }
  }
}

module.exports = { ORIGIN, KEY, digest, pageUrl, assertIndexable, buildPlan, verifyLive, parseArgs };
if (require.main === module) main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exitCode = 1; });
