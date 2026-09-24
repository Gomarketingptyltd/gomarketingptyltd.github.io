const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js/enquiry.js"), "utf8");
const flush = () => new Promise((resolve) => setImmediate(resolve));

function harness({ language = "en", response, failure, pending = false, valid = true, enabled = true } = {}) {
  const form = new EventTarget();
  const button = { textContent: "Send", disabled: false };
  const status = { textContent: "", dataset: {} };
  const fallback = { hidden: true };
  const fields = { username: "Private Test", email: "private@example.invalid", phone: "0000", services: "Test", message: "Confidential test only", page_language: language };
  form.action = "https://formspree.io/f/xknavdvn";
  form.attributes = {};
  form.querySelector = (selector) => ({ ".info-btn": button, "[data-enquiry-status]": status, "[data-enquiry-native]": fallback })[selector];
  form.reportValidity = () => valid;
  form.setAttribute = (key, value) => { form.attributes[key] = value; };
  form.removeAttribute = (key) => { delete form.attributes[key]; };
  const link = new EventTarget();
  link.closest = () => form;
  const document = new EventTarget();
  document.documentElement = { lang: language };
  document.querySelectorAll = (selector) => selector === "[data-whatsapp-contact]" ? [link] : (enabled && selector === 'form[data-enquiry-form="enhanced"]' ? [form] : []);
  const events = [];
  document.addEventListener("gom:contact", (event) => events.push(event.detail));
  const window = new EventTarget();
  const requests = [];
  let settle;
  let timeout;
  let clearCount = 0;
  class FormData {
    constructor(value) {
      assert.equal(value, form);
      this.fields = { ...fields };
    }
  }
  const fetch = (url, options) => {
    requests.push({ url, options });
    if (failure) return Promise.reject(new Error("Network error"));
    if (pending) return new Promise((resolve, reject) => {
      settle = resolve;
      options.signal.addEventListener("abort", () => reject(new Error("Aborted")));
    });
    return Promise.resolve(response || { ok: true, status: 200, json: async () => ({ ok: true }) });
  };
  Object.assign(window, {
    fetch, FormData, AbortController,
    setTimeout: (fn, ms) => { assert.equal(ms, 20000); timeout = fn; return 1; },
    clearTimeout: () => { clearCount++; }
  });
  vm.runInNewContext(source, { document, window, fetch, FormData, AbortController, CustomEvent });
  return {
    form, button, status, fallback, fields, events, requests, link, window,
    settle: (value) => settle(value), timeout: () => timeout(), clearCount: () => clearCount,
    submit(native = false) {
      const event = new Event("submit", { cancelable: true });
      Object.defineProperty(event, "submitter", { value: native ? fallback : button });
      form.dispatchEvent(event);
      return event.defaultPrevented;
    }
  };
}

for (const language of ["en", "zh-Hans"]) {
  test(`${language}: confirmed success is counted once, with no personal data in the event`, async () => {
    const h = harness({ language });
    assert.equal(h.submit(), true);
    assert.equal(h.button.disabled, true);
    await flush();
    assert.equal(h.status.dataset.state, "success");
    assert.equal(h.button.disabled, true);
    assert.equal(h.fallback.hidden, true);
    assert.equal(h.events.length, 1);
    assert.deepEqual(Object.keys(h.events[0]), ["name", "language", "placement"]);
    assert.equal(h.events[0].name, "enquiry_submit_success");
    assert.equal(h.events[0].language, language.startsWith("zh") ? "zh" : "en");
    assert.ok(!JSON.stringify(h.events).includes("Private"));
    assert.equal(h.requests[0].options.credentials, "omit");
    assert.deepEqual(h.requests[0].options.body.fields, h.fields);
    h.submit();
    await flush();
    assert.equal(h.requests.length, 1);
    assert.equal(h.events.length, 1);
  });
}

test("invalid form does not submit or record a conversion", async () => {
  const h = harness({ valid: false });
  h.submit();
  await flush();
  assert.equal(h.requests.length, 0);
  assert.equal(h.events.length, 0);
});

test("native mode never intercepts the working provider submission", () => {
  const h = harness({ enabled: false });
  assert.equal(h.submit(), false);
  assert.equal(h.requests.length, 0);
  assert.equal(h.events.length, 0);
  assert.equal(h.button.disabled, false);
});

test("duplicate click while pending makes only one request", async () => {
  const h = harness({ pending: true });
  h.submit();
  h.submit();
  assert.equal(h.requests.length, 1);
  assert.equal(h.form.attributes["aria-busy"], "true");
  h.settle({ ok: true, status: 200, json: async () => ({ ok: true }) });
  await flush();
  assert.equal(h.status.dataset.state, "success");
  assert.equal(h.form.attributes["aria-busy"], undefined);
});

for (const status of [400, 401, 403, 404, 422, 429]) {
  test(`HTTP ${status} retains details and offers the original secure form`, async () => {
    const h = harness({ response: { ok: false, status, json: async () => ({ errors: [{ message: "Untrusted error" }] }) } });
    h.submit();
    await flush();
    assert.equal(h.status.dataset.state, "error");
    assert.match(h.status.textContent, /did not accept/);
    assert.equal(h.fields.email, "private@example.invalid");
    assert.equal(h.button.disabled, false);
    assert.equal(h.fallback.hidden, false);
    assert.equal(h.events.length, 0);
    assert.equal(h.submit(true), false);
    assert.equal(h.requests.length, 1);
  });
}

for (const response of [
  { ok: false, status: 500, json: async () => ({ error: "Unavailable" }) },
  { ok: true, status: 200, json: async () => ({ ok: false }) },
  { ok: true, status: 200, json: async () => ({}) },
  { ok: true, status: 200, json: async () => { throw new Error("Not JSON"); } }
]) {
  test(`unconfirmed HTTP ${response.status} response is not labelled successful`, async () => {
    const h = harness({ response });
    h.submit();
    await flush();
    assert.equal(h.status.dataset.state, "error");
    assert.match(h.status.textContent, /could not confirm/);
    assert.equal(h.events.length, 0);
    assert.equal(h.button.disabled, false);
  });
}

test("network failure preserves details and does not automatically retry", async () => {
  const h = harness({ failure: true });
  h.submit();
  await flush();
  assert.match(h.status.textContent, /could not confirm/);
  assert.equal(h.requests.length, 1);
  assert.equal(h.events.length, 0);
  assert.equal(h.fields.message, "Confidential test only");
});

test("timeout aborts without recording a conversion or retrying", async () => {
  const h = harness({ pending: true });
  h.submit();
  h.timeout();
  await flush();
  assert.equal(h.requests[0].options.signal.aborted, true);
  assert.equal(h.status.dataset.state, "error");
  assert.equal(h.button.disabled, false);
  assert.equal(h.events.length, 0);
  assert.equal(h.requests.length, 1);
});

test("navigation during submission does not leave a disabled form on back navigation", async () => {
  const h = harness({ pending: true });
  h.submit();
  h.window.dispatchEvent(new Event("pagehide"));
  await flush();
  assert.equal(h.requests[0].options.signal.aborted, true);
  assert.equal(h.button.disabled, false);
  assert.match(h.status.textContent, /could not confirm/);
  assert.equal(h.events.length, 0);
  assert.ok(h.clearCount() > 0);
});

test("WhatsApp click is distinct from a submitted enquiry", () => {
  const h = harness();
  h.link.dispatchEvent(new Event("click"));
  assert.equal(h.events[0].name, "whatsapp_click");
  assert.equal(h.requests.length, 0);
});

test("HTML keeps native POST, required fields and the existing official contact URL", () => {
  for (const file of ["index.html", "cn/index.html"]) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const form = html.match(/<form\b[^>]*>[\s\S]*?<\/form>/)[0];
    assert.match(form, /action="https:\/\/formspree\.io\/f\/xknavdvn"/);
    assert.match(form, /method="POST"/);
    assert.match(form, /data-enquiry-form="native"/);
    assert.equal((form.match(/\brequired\b/g) || []).length, 4);
    assert.match(form, /name="message"/);
    assert.match(html, /data-whatsapp-contact href="https:\/\/wa\.me\/61450428693\?src=qr"/);
    assert.doesNotMatch(html, /googletagmanager\.com|google-analytics\.com|G-[A-Z0-9]{6,}/);
  }
});
