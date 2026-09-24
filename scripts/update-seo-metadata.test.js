const test = require("node:test");
const assert = require("node:assert/strict");
const { articleDatesFromHtml, articleNode, socialMetadata } = require("./update-seo-metadata");

const meta = (content) => `<div class="article-meta"><span class="date">${content}</span></div>`;
const dated = (published, modified) => meta(
  `Published <time data-article-date="published" datetime="${published}">Apr 15, 2026</time>` +
  `<br/>Updated <time datetime="${modified}" data-article-date="modified">Sep 24, 2026</time>`
);

test("legacy English and Chinese dates keep their original metadata", () => {
  for (const date of ["Apr 15, 2026", "2026年4月15日"]) {
    assert.deepEqual(articleDatesFromHtml(meta(date)), {
      published: "2026-04-15", modified: "2026-04-15",
    });
  }
});

test("explicit update dates do not replace the original publication date", () => {
  assert.deepEqual(articleDatesFromHtml(dated("2026-04-15", "2026-09-24")), {
    published: "2026-04-15", modified: "2026-09-24",
  });
});

test("dates outside the article metadata are ignored", () => {
  assert.deepEqual(articleDatesFromHtml('<time data-article-date="published" datetime="2026-04-15">Date</time>'), {
    published: null, modified: null,
  });
});

test("invalid or backwards dates fail before generating misleading metadata", () => {
  for (const invalid of ["2026-02-30", "2026-13-01", "invalid", "2026-9-24"]) {
    assert.throws(() => articleDatesFromHtml(dated("2026-04-15", invalid)), /Invalid article/);
  }
  assert.throws(() => articleDatesFromHtml(dated("2026-04-15", "2026-04-14")), /cannot precede/);
  assert.throws(() => articleDatesFromHtml(meta('<time data-article-date="modified" datetime="2026-09-24">Updated</time>')), /requires a publication date/);
});

test("structured data and social tags share the correct dates in both languages", () => {
  for (const relative of ["services/localSeoStartsWithClearMessaging.html", "cn/localSeoStartsWithClearMessaging.html"]) {
    const context = {
      title: "Go Marketing Pty Ltd - Local SEO Checklist", description: "A practical checklist.",
      canonical: `https://gomarketing.net.au/${relative}`, relative,
      html: dated("2026-04-15", "2026-09-24"),
    };
    const schema = articleNode(context);
    assert.equal(schema.datePublished, "2026-04-15");
    assert.equal(schema.dateModified, "2026-09-24");
    const social = socialMetadata(context);
    assert.match(social, /property="article:published_time" content="2026-04-15"/);
    assert.match(social, /property="article:modified_time" content="2026-09-24"/);
  }
});
