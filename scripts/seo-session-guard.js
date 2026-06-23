#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SESSION_DIR = path.join(ROOT, ".seo-session");
const SESSION_FILE = path.join(SESSION_DIR, "current.json");
const MINUTES = Number(process.env.SEO_SESSION_MIN_MINUTES || 55);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readSession() {
  if (!fs.existsSync(SESSION_FILE)) {
    throw new Error(`No active SEO session file found at ${SESSION_FILE}. Run npm run seo:session-start first.`);
  }
  return JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
}

function writeSession(session) {
  ensureDir(SESSION_DIR);
  fs.writeFileSync(SESSION_FILE, `${JSON.stringify(session, null, 2)}\n`, "utf8");
}

function start() {
  const session = {
    startedAt: new Date().toISOString(),
    minMinutes: MINUTES,
    cwd: ROOT,
  };
  writeSession(session);
  console.log(`Started SEO manager session at ${session.startedAt}. Minimum target: ${MINUTES} minutes.`);
}

function finish(args) {
  const session = readSession();
  const startedAt = new Date(session.startedAt);
  const finishedAt = new Date();
  const elapsedMinutes = (finishedAt - startedAt) / 60000;
  const allowShortBlocker = args.includes("--allow-short-blocker");

  const result = {
    ...session,
    finishedAt: finishedAt.toISOString(),
    elapsedMinutes: Number(elapsedMinutes.toFixed(2)),
    allowShortBlocker,
  };
  writeSession(result);

  console.log(`SEO manager session elapsed: ${result.elapsedMinutes} minutes.`);

  if (elapsedMinutes < (session.minMinutes || MINUTES) && !allowShortBlocker) {
    console.error(
      `SEO manager session ended early. Required at least ${session.minMinutes || MINUTES} minutes, or rerun finish with --allow-short-blocker and document the blocker in docs/seo-execution-log.md.`,
    );
    process.exit(1);
  }

  console.log("SEO manager session guard passed.");
}

function usage() {
  console.log("Usage: node scripts/seo-session-guard.js <start|finish> [--allow-short-blocker]");
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "start") {
    start();
  } else if (command === "finish") {
    finish(args);
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`SEO session guard failed: ${error.message}`);
  process.exit(1);
}
