const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const { articleDatesFromHtml } = require("./update-seo-metadata");

const read = (relative) => fs.readFileSync(path.join(__dirname, "..", relative), "utf8");

test("project pages describe delivery steps rather than confidential cases", () => {
  for (const lang of ["services", "cn"]) {
    const html = read(`${lang}/project.html`);
    assert.doesNotMatch(html, /Case 0[123]|案例 0[123]|Our Clients &amp; Selected Work|客户与精选项目/);
    assert.equal((html.match(/class="work-card"/g) || []).length, 3);
    assert.match(html, lang === "cn" ? /客户项目不公开展示/ : /Client work stays private/);
    assert.match(html, lang === "cn" ? /相关协议与授权允许/ : /relevant agreement and permissions allow/);
    assert.ok(html.includes(`href="https://gomarketing.net.au/${lang}/project.html"`));
    assert.ok(read(`${lang}/whatIsMarketingAutomation.html`).includes('id="enquiry-demo"'));
    assert.match(html, /href="whatIsMarketingAutomation.html#enquiry-demo"/);
  }
});

test("privacy clarification keeps original article dates in both languages", () => {
  const articles = {
    digitalCredibilityChecklist: "2026-03-28",
    propertyCommunicationChineseAudiences: "2026-04-03",
    websiteMessagingMistakes: "2026-04-12",
  };
  for (const lang of ["services", "cn"]) {
    for (const [article, published] of Object.entries(articles)) {
      const html = read(`${lang}/${article}.html`);
      const dates = articleDatesFromHtml(html);
      assert.equal(dates.published, published);
      assert.ok(dates.modified >= "2026-09-25");
      assert.match(html, lang === "cn" ? /协议与授权/ : /agreement and permissions/);
      assert.doesNotMatch(html, /anonymised case (?:examples|framing)|公开评价或匿名案例说明|位置背景、匿名案例/);
    }
  }
});

test("the publication evidence intake cannot be mistaken for an active client-data form", () => {
  const intake = read("docs/seo-case-study-evidence-intake-chinese-audience-growth-2026-07-15.md");
  assert.match(intake, /ARCHIVED, DO NOT FILL IN THIS REPOSITORY/);
  assert.match(read(".gitignore"), /^\.search-console\/$/m);
});

// These assertions verify public answer consistency, not external AI recommendations.
const capabilityPages = [
  "services/marketingAutomationServicesSydney.html",
  "cn/marketingAutomationServicesSydney.html",
  "services/web.html",
  "cn/web.html",
];
const plainText = (html) => html.replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ").trim();

for (const page of capabilityPages) {
  test(`${page}: all eight FAQ answers are visible and match structured data`, () => {
    const html = read(page);
    const body = html.split("<body>")[1];
    const visible = [...body.matchAll(/<article class="seo-faq__item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/article>/g)]
      .map(([, q, a]) => ({ q: plainText(q), a: plainText(a) }));
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
    const faq = graph.find((node) => [].concat(node["@type"]).includes("FAQPage"));
    assert.equal(visible.length, 8);
    assert.deepEqual(faq.mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })), visible);
    assert.match(body, /href="project.html"/);
    assert.match(body, page.startsWith("cn/") ? /协议与授权允许/ : /agreement and permissions allow/);
    assert.match(body, page.startsWith("cn/") ? /href="\.\/#info"/ : /href="\.\.\/#info"/);
    assert.doesNotMatch(body, /Case 0[123]|案例 0[123]|appstore\.com|apps\.apple\.com|play\.google\.com/);
  });
}

test("app and CRM answers keep approval, access and quote boundaries in both languages", () => {
  const en = read("services/marketingAutomationServicesSydney.html").split("<body>")[1];
  const cn = read("cn/marketingAutomationServicesSydney.html").split("<body>")[1];
  for (const phrase of ["not guaranteed by Go Marketing", "available APIs and permissions", "fixed price or delivery date cannot be confirmed", "not every project is available to view", "customer relationship management (CRM)"]) {
    assert.ok(en.includes(phrase), phrase);
  }
  for (const phrase of ["不保证通过", "取决于接口与权限", "不能仅凭笼统需求确定固定价格或交付日期", "并非每个项目都可查看", "客户关系管理（CRM）"]) {
    assert.ok(cn.includes(phrase), phrase);
  }
  assert.equal((en.match(/class="service-overview__card"/g) || []).length, 8);
  assert.equal((cn.match(/class="service-overview__card"/g) || []).length, 8);
});

test("e-commerce copy supports consultation without inventing results or requiring sensitive intake", () => {
  const en = read("services/web.html").split("<body>")[1];
  const cn = read("cn/web.html").split("<body>")[1];
  assert.match(en, /no sales increase is guaranteed/);
  assert.match(cn, /不承诺销售额增长/);
  assert.match(en, /Do not include passwords, customer records or confidential files/);
  assert.match(cn, /请勿提供密码、客户记录或保密文件/);
  assert.match(en, /you do not need all three/);
  assert.match(cn, /不默认三种都需要/);
  assert.equal((en.match(/class="web-page__card"/g) || []).length, 8);
  assert.equal((cn.match(/class="web-page__card"/g) || []).length, 8);
});

test("SEO scanning excludes private reports but still rejects invalid public HTML", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "seo-private-scan-"));
  try {
    fs.mkdirSync(path.join(fixture, "scripts"));
    fs.copyFileSync(path.join(__dirname, "seo-check.js"), path.join(fixture, "scripts/seo-check.js"));
    fs.writeFileSync(path.join(fixture, "sitemap.xml"), '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');
    const site = (process.env.SITE_URL || "https://gomarketing.net.au").replace(/\/$/, "");
    fs.writeFileSync(path.join(fixture, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
    for (const dir of [".search-console", ".seo-visual", ".seo-session"]) {
      fs.mkdirSync(path.join(fixture, dir));
      fs.writeFileSync(path.join(fixture, dir, "review.html"), "<p>Private preview fixture</p>");
    }
    const run = () => spawnSync(process.execPath, [path.join(fixture, "scripts/seo-check.js")], { encoding: "utf8" });
    const privateOnly = run();
    assert.equal(privateOnly.status, 0, privateOnly.stderr);
    assert.match(privateOnly.stdout, /Checked 0 HTML files/);
    fs.writeFileSync(path.join(fixture, "broken.html"), "<p>Invalid public fixture</p>");
    const publicInvalid = run();
    assert.equal(publicInvalid.status, 1);
    assert.match(publicInvalid.stderr, /broken\.html: missing meta description/);
    assert.doesNotMatch(publicInvalid.stderr, /review\.html/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
