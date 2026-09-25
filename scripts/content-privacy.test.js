const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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
