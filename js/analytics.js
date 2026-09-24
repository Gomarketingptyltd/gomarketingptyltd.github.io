(function () {
  "use strict";
  if (document.getElementById("gom-privacy-settings")) return;

  const id = "G-CTQEPEXZ4X";
  const key = "gom.analytics-consent.v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const origin = "https://gomarketing.net.au";
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) return;
  let page;
  try { page = new URL(canonical.href); } catch (_) { return; }
  if (page.origin !== origin || page.search || page.hash) return;
  const normalize = (path) => path.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  if (normalize(page.pathname) !== normalize(window.location.pathname)) return;

  const language = document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  const copy = language === "zh" ? {
    title: "可选的网站统计", settings: "统计隐私设置", reject: "拒绝统计", accept: "同意统计", close: "关闭",
    body: "经您同意，我们才使用 Google Analytics 的 Cookie 统计页面访问和联系操作。姓名、邮箱、电话和留言不会发送给 Analytics，也不用于广告个性化。拒绝不影响咨询。",
    policy: "阅读隐私政策", blocked: "您的浏览器已要求不追踪，本网站不会启用统计。",
    saved: "统计选择已保存。您可随时在页脚更改。", unavailable: "统计暂不可用，不影响浏览或提交咨询。"
  } : {
    title: "Optional website analytics", settings: "Analytics privacy settings", reject: "Reject analytics", accept: "Allow analytics", close: "Close",
    body: "With your permission, Google Analytics cookies measure page visits and contact actions. We do not send names, emails, phone numbers or messages to Analytics or use this data for personalised ads. You can enquire without agreeing.",
    policy: "Read our privacy policy", blocked: "Your browser requests no tracking. Analytics will stay off.",
    saved: "Your choice is saved. You can change it in the footer.", unavailable: "Analytics is unavailable. Browsing and enquiries are unaffected."
  };
  const blocked = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
  const robots = document.querySelector('meta[name="robots"]');
  // No Google connection on previews, non-indexable pages or URLs carrying input.
  const eligible = window.location.origin === origin && !window.location.search &&
    ["", "#info", "#enquiry-demo"].includes(window.location.hash) &&
    !(robots && /noindex/i.test(robots.content));
  let choice = readChoice();
  let configured = false;
  let pageSent = false;
  let formSent = false;
  let lastClick = 0;
  let openedBySettings = false;
  window["ga-disable-" + id] = true;

  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && ["granted", "denied"].includes(value.value) && Number.isFinite(value.at) &&
          value.at <= Date.now() && Date.now() - value.at < lifetime) return value.value;
    } catch (_) { /* Storage can be unavailable in privacy modes. */ }
    return null;
  }
  function remember(value) {
    choice = value;
    try { localStorage.setItem(key, JSON.stringify({ value, at: Date.now() })); } catch (_) { /* Keep this page usable. */ }
  }
  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  function safeReferrer() {
    try {
      const url = new URL(document.referrer);
      const allowed = ["www.google.com", "www.google.com.au", "www.bing.com", "bing.com", "duckduckgo.com", "search.yahoo.com", "www.baidu.com", "www.linkedin.com", "www.instagram.com", "www.facebook.com", "gomarketing.net.au"];
      return url.protocol === "https:" && allowed.includes(url.hostname) ? url.origin + "/" : "";
    } catch (_) { return ""; }
  }
  function parameters() {
    return {
      send_to: id,
      page_location: page.href,
      page_referrer: safeReferrer(),
      page_title: "Go Marketing " + page.pathname,
      page_language: language
    };
  }
  function permitted() { return choice === "granted" && !blocked && eligible; }
  function start() {
    if (!permitted()) return;
    window["ga-disable-" + id] = false;
    if (!configured) {
      configured = true;
      gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      gtag("set", "ads_data_redaction", true);
      gtag("set", "url_passthrough", false);
      gtag("js", new Date());
      gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      gtag("config", id, Object.assign(parameters(), {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_expires: lifetime / 1000, cookie_update: false, cookie_flags: "SameSite=Lax;Secure"
      }));
      const script = document.createElement("script");
      script.id = "gom-google-tag";
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
      script.onerror = function () { window["ga-disable-" + id] = true; notice.textContent = copy.unavailable; };
      document.head.appendChild(script);
    } else {
      gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    }
    if (!pageSent) {
      pageSent = true;
      gtag("event", "page_view", parameters());
    }
  }
  function stop() {
    window["ga-disable-" + id] = true;
    if (configured) gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    // Only expire our Analytics cookies; never touch form or other service storage.
    document.cookie.split(";").forEach(function (entry) {
      const name = entry.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      ["", "; Domain=gomarketing.net.au", "; Domain=.gomarketing.net.au"].forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax; Secure" + domain;
      });
    });
  }
  function element(tag, text, parent) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }
  const settings = element("div", "", document.body);
  settings.id = "gom-privacy-settings";
  const settingsButton = element("button", copy.settings, settings);
  settingsButton.type = "button";
  const notice = element("p", "", settings);
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  const panel = element("section", "", document.body);
  panel.id = "gom-privacy-panel";
  panel.hidden = true;
  panel.setAttribute("aria-labelledby", "gom-privacy-title");
  const title = element("h2", copy.title, panel);
  title.id = "gom-privacy-title";
  title.tabIndex = -1;
  element("p", blocked ? copy.blocked : copy.body, panel);
  const policy = element("a", copy.policy, panel);
  policy.href = language === "zh" ? "/cn/privatePolicy.html" : "/services/privatePolicy.html";
  const actions = element("div", "", panel);
  actions.className = "gom-privacy-actions";
  const reject = element("button", copy.reject, actions);
  const accept = element("button", copy.accept, actions);
  const close = element("button", copy.close, actions);
  [reject, accept, close].forEach(function (button) { button.type = "button"; });
  accept.disabled = blocked;
  function hide() {
    panel.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
    if (openedBySettings) settingsButton.focus();
  }
  function choose(value) {
    remember(value);
    if (value === "granted") start(); else stop();
    notice.textContent = copy.saved;
    hide();
  }
  settingsButton.setAttribute("aria-controls", panel.id);
  settingsButton.setAttribute("aria-expanded", "false");
  settingsButton.addEventListener("click", function () {
    openedBySettings = true;
    panel.hidden = false;
    settingsButton.setAttribute("aria-expanded", "true");
    title.focus();
  });
  reject.addEventListener("click", function () { choose("denied"); });
  accept.addEventListener("click", function () { if (!blocked) choose("granted"); });
  close.addEventListener("click", hide);
  panel.addEventListener("keydown", function (event) { if (event.key === "Escape") hide(); });
  document.addEventListener("gom:contact", function (event) {
    if (!permitted() || window["ga-disable-" + id]) return;
    const detail = event.detail || {};
    if (!["home_contact", "support_contact"].includes(detail.placement)) return;
    if (detail.name === "enquiry_submit_success") {
      if (formSent) return;
      formSent = true;
    } else if (detail.name === "whatsapp_click") {
      if (Date.now() - lastClick < 1000) return;
      lastClick = Date.now();
    } else return;
    gtag("event", detail.name, Object.assign(parameters(), { contact_placement: detail.placement }));
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== key && event.key !== null) return;
    choice = readChoice();
    if (permitted()) start(); else stop();
  });
  // Styling must load before showing the panel. A failure keeps analytics off.
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("../css/analytics.css", document.currentScript.src).href;
  css.onload = function () {
    settings.hidden = false;
    if (choice === null && !blocked) {
      panel.hidden = false;
      settingsButton.setAttribute("aria-expanded", "true");
    }
    if (permitted()) start(); else stop();
  };
  settings.hidden = true;
  document.head.appendChild(css);
}());
