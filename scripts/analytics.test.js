const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../js/analytics.js"), "utf8");
const key = "gom.analytics-consent.v1";
const id = "G-CTQEPEXZ4X";

function harness(options = {}) {
  const nodes = [];
  class Element extends EventTarget {
    constructor(tag) { super(); this.tagName = tag; this.children = []; this.attributes = {}; nodes.push(this); }
    appendChild(child) { this.children.push(child); return child; }
    setAttribute(name, value) { this.attributes[name] = value; }
    focus() { this.focused = true; }
    click() { this.dispatchEvent(new Event("click")); }
  }
  const document = new EventTarget();
  document.head = new Element("head"); document.body = new Element("body");
  document.documentElement = { lang: options.language || "en" };
  document.referrer = options.referrer || "https://www.google.com/search?q=private@example.invalid";
  document.currentScript = { src: "https://gomarketing.net.au/js/analytics.js" };
  document.createElement = (tag) => new Element(tag);
  document.getElementById = (value) => nodes.find((node) => node.id === value);
  document.querySelector = (selector) => selector === 'link[rel="canonical"]'
    ? { href: options.canonical || "https://gomarketing.net.au/" }
    : options.noindex ? { content: "noindex,follow" } : null;
  const cookieWrites = [];
  Object.defineProperty(document, "cookie", {
    get: () => "_ga=old; _ga_CTQEPEXZ4X=old; keep=private",
    set: (value) => cookieWrites.push(value)
  });
  const storage = new Map();
  if (options.saved !== undefined) storage.set(key, options.saved);
  const localStorage = {
    getItem: (k) => { if (options.storageFailure) throw Error(); return storage.get(k) || null; },
    setItem: (k, value) => { if (options.storageFailure) throw Error(); storage.set(k, value); }
  };
  const window = new EventTarget();
  window.location = new URL(options.url || "https://gomarketing.net.au/");
  const context = { window, document, localStorage, navigator: options.navigator || {}, URL, Date };
  vm.runInNewContext(source, context);
  const css = document.head.children.find((node) => node.rel === "stylesheet");
  if (css && options.cssReady !== false) css.onload();
  return {
    window, document, nodes, storage, cookieWrites, css,
    button: (text) => nodes.find((node) => node.tagName === "button" && node.textContent === text),
    panel: () => document.getElementById("gom-privacy-panel"),
    commands: () => Array.from(window.dataLayer || [], (value) => Array.from(value)),
    scripts: () => document.head.children.filter((node) => node.tagName === "script"),
    event(detail) { document.dispatchEvent(new CustomEvent("gom:contact", { detail })); },
    storageEvent() { const event = new Event("storage"); Object.defineProperty(event, "key", { value: key }); window.dispatchEvent(event); }
  };
}
const saved = (value, at = Date.now()) => JSON.stringify({ value, at });

test("no Google requests or new storage before a choice; reject remains usable", () => {
  const h = harness();
  assert.equal(h.scripts().length, 0);
  assert.equal(h.commands().length, 0);
  assert.equal(h.storage.size, 0);
  assert.equal(h.panel().hidden, false);
  h.button("Reject analytics").click();
  assert.equal(h.scripts().length, 0);
  assert.equal(h.panel().hidden, true);
  assert.equal(JSON.parse(h.storage.get(key)).value, "denied");
});
test("grant loads one tag and one pageview, with safe defaults and redacted addresses", () => {
  const h = harness();
  h.button("Allow analytics").click();
  h.button("Allow analytics").click();
  assert.equal(h.scripts().length, 1);
  assert.equal(h.scripts()[0].referrerPolicy, "no-referrer");
  const commands = h.commands();
  assert.equal(commands[0][2].analytics_storage, "denied");
  const config = commands.find((command) => command[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.cookie_update, false);
  assert.equal(config.page_location, "https://gomarketing.net.au/");
  assert.equal(config.page_referrer, "https://www.google.com/");
  assert.equal(commands.filter((command) => command[1] === "page_view").length, 1);
  assert.ok(!JSON.stringify(commands).includes("private@example.invalid"));
});
test("reject can be changed later; withdrawal stops contact events and clears only Analytics cookies", () => {
  const h = harness({ saved: saved("denied") });
  h.button("Analytics privacy settings").click();
  assert.equal(h.panel().hidden, false);
  h.button("Allow analytics").click();
  h.button("Reject analytics").click();
  const count = h.commands().length;
  h.event({ name: "whatsapp_click", placement: "home_contact" });
  assert.equal(h.commands().length, count);
  assert.equal(h.window["ga-disable-" + id], true);
  assert.ok(h.cookieWrites.some((value) => value.startsWith("_ga=")));
  assert.ok(h.cookieWrites.every((value) => !value.startsWith("keep=")));
});
test("only allowlisted contact data is passed; success is not inferred from a form submit", () => {
  const h = harness({ saved: saved("granted") });
  h.event({ name: "form_submit", placement: "home_contact" });
  h.event({ name: "whatsapp_click", placement: "home_contact", email: "private@example.invalid", message: "Secret" });
  h.event({ name: "whatsapp_click", placement: "home_contact" });
  h.event({ name: "enquiry_submit_success", placement: "home_contact" });
  h.event({ name: "enquiry_submit_success", placement: "home_contact" });
  h.event({ name: "whatsapp_click", placement: "private@example.invalid" });
  const events = h.commands().filter((command) => command[0] === "event");
  assert.deepEqual(events.map((command) => command[1]), ["page_view", "whatsapp_click", "enquiry_submit_success"]);
  assert.ok(!JSON.stringify(events).includes("Secret"));
  assert.ok(!JSON.stringify(events).includes("private@"));
});
test("events before consent are discarded, not replayed after consent", () => {
  const h = harness(); h.event({ name: "enquiry_submit_success", placement: "home_contact" });
  h.button("Allow analytics").click();
  assert.equal(h.commands().filter((command) => command[0] === "event").length, 1);
});
for (const options of [
  { url: "http://127.0.0.1:1234/" }, { noindex: true },
  { url: "https://gomarketing.net.au/?email=private@example.invalid" },
  { url: "https://gomarketing.net.au/#private" },
  { navigator: { globalPrivacyControl: true } }, { navigator: { doNotTrack: "1" } }
]) test(`no Google tag for restricted context ${JSON.stringify(options)}`, () => {
  const h = harness({ saved: saved("granted"), ...options });
  h.button("Allow analytics").click();
  assert.equal(h.scripts().length, 0);
  assert.equal(h.window["ga-disable-" + id], true);
});
test("expired, malformed and future-dated choices cannot grant consent", () => {
  for (const value of ["garbage", saved("granted", 0), saved("granted", Date.now() + 100000)]) {
    const h = harness({ saved: value }); assert.equal(h.scripts().length, 0); assert.equal(h.panel().hidden, false);
  }
});
test("storage failure, stylesheet failure and blocked Google script do not affect forms", () => {
  const h = harness({ storageFailure: true }); h.button("Allow analytics").click();
  h.scripts()[0].onerror(); assert.equal(h.window["ga-disable-" + id], true);
  const fail = harness({ saved: saved("granted"), cssReady: false });
  assert.equal(fail.scripts().length, 0);
});
test("cross-tab withdrawal stops measurement", () => {
  const h = harness({ saved: saved("granted") });
  h.storage.set(key, saved("denied")); h.storageEvent();
  assert.equal(h.window["ga-disable-" + id], true);
});
test("unknown referrers are omitted and a known public anchor is removed", () => {
  const h = harness({ saved: saved("granted"), referrer: "https://private-portal.invalid/user/42?token=secret", url: "https://gomarketing.net.au/#info" });
  const config = h.commands().find((command) => command[0] === "config")[2];
  assert.equal(config.page_referrer, ""); assert.equal(config.page_location, "https://gomarketing.net.au/");
});
test("Chinese controls and normalised index.html work", () => {
  const h = harness({ language: "zh-Hans", url: "https://gomarketing.net.au/cn/index.html", canonical: "https://gomarketing.net.au/cn/" });
  h.button("同意统计").click(); assert.equal(h.scripts().length, 1);
});
test("canonical mismatch prevents loading on unrelated pages", () => {
  const h = harness({ url: "https://gomarketing.net.au/not-a-public-page" });
  assert.equal(h.nodes.length, 2); assert.equal(h.scripts().length, 0);
});
