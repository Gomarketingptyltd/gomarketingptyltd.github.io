const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({window: {}});
for (const file of ['faq-data.js', 'search.js']) vm.runInContext(read('help/' + file), context);
const data = context.window.GoMarketingHelp;
const find = query => context.window.GoMarketingHelpSearch.search(query, data);
const answer = id => data.entries.find(item => item.id === id).answer;

test('public FAQ has 30 bilingual answers and valid topic and related links', () => {
  assert.equal(data.publicationApproved, true);
  assert.equal(data.entries.length, 30);
  const ids = new Set(data.entries.map(item => item.id));
  const categories = new Set(data.categories.map(item => item.id));
  assert.equal(ids.size, 30);
  for (const item of data.entries) {
    assert.ok(categories.has(item.category));
    item.related.forEach(id => assert.ok(ids.has(id) && id !== item.id));
    for (const lang of ['zh', 'en']) {
      assert.ok(item.question[lang].trim());
      assert.ok(item.answer[lang].trim());
      assert.doesNotMatch(item.answer[lang], /https?:|<[^>]+>|\$\s*\d|\b(?:AUD|USD)\s*\d/);
    }
  }
  data.popular.forEach(id => assert.ok(ids.has(id)));
});

for (const [query, id] of [
  ['多少钱', 'quote'], ['pricing', 'quote'], ['Rednote promotion', 'xhs-routes'],
  ['账号管理', 'management'], ['Everyday 五篇', 'everyday'], ['Premium 5000 views', 'premium'],
  ['App 上架', 'app'], ['apps', 'app'], ['能做网站吗', 'website'], ['Shopify online store', 'ecommerce'],
  ['CRM 系统', 'crm'], ['自动回复 WhatsApp', 'automation'], ['Local Market', 'local-market'],
  ['Google 排名', 'seo'], ['NDA case studies', 'confidentiality'], ['退一半', 'refund'],
  ['需要修改几次', 'revisions'], ['交付要多久', 'timing']
]) test('FAQ search: ' + query, () => assert.ok(find(query).entries.some(item => item.id === id)));

test('unknown, human and sensitive questions never generate an invented answer', () => {
  for (const query of ['quantum tractor licensing', '火星开采许可证', '<img src=x onerror=alert(1)>']) {
    assert.equal(find(query).kind, 'unknown');
    assert.equal(find(query).entries.length, 0);
  }
  for (const query of ['转人工', '电话是多少', 'WhatsApp', 'human']) assert.equal(find(query).kind, 'contact');
  for (const query of ['person@example.test', 'password: fictional-only', '验证码：123456', '+61 400 000 001']) {
    assert.equal(find(query).kind, 'privacy');
    assert.equal(find(query).entries.length, 0);
  }
});

test('service boundaries do not turn targets, reporting or a refund suggestion into guarantees', () => {
  assert.match(answer('everyday').zh, /三篇.*三个月.*五篇.*五个月/);
  assert.match(answer('premium').en, /metric, assessment window and shortfall/);
  assert.doesNotMatch(JSON.stringify(answer('premium')), /1,?000|3,?000|5,?000/);
  assert.doesNotMatch(JSON.stringify(answer('refund')), /50%|退一半|half refund/);
  assert.match(answer('reports').zh, /我们账号.*约两周/);
  assert.match(answer('management-reports').zh, /另外确认/);
  assert.ok(find('报告').entries.some(item => item.id === 'reports'));
  assert.ok(find('报告').entries.some(item => item.id === 'management-reports'));
  assert.match(answer('revisions').zh, /每篇最多三轮/);
  assert.match(answer('delay').zh, /不自动减免月费.*不会自动发布/);
  assert.match(answer('confidentiality').zh, /授权允许/);
  assert.match(answer('app').zh, /不能保证上架/);
});

test('FAQ contacts have no prefilled transcript or tracking and no search is persisted or sent', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(data.contacts)), {
    whatsapp: 'https://wa.me/61450428693', email: 'mailto:info@gomarketing.net.au', phone: 'tel:+61299096785'
  });
  const source = ['faq-data.js', 'search.js', 'help.js', 'index.html'].map(file => read('help/' + file)).join('\n');
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|innerHTML|127\.0\.0\.1|\/api\//);
  assert.match(source, /connect-src 'none'/);
  assert.match(source, /form-action 'none'/);
  assert.match(source, /noindex,nofollow,noarchive/);
  assert.doesNotMatch(source, /PACKAGE-MASTER|Brochure&Pricing|sk-[a-z0-9]{12}/i);
  assert.match(read('index.html'), /href="\.\/help\/\?lang=en"/);
  assert.match(read('cn/index.html'), /href="\.\.\/help\/\?lang=zh"/);
});

test('brochure is script-free, quote-only and absent from navigation and sitemap', () => {
  const html = read('brochure/xiaohongshu/index.html');
  assert.match(html, /noindex, nofollow, noarchive/);
  assert.match(html, /script-src 'none'/);
  assert.doesNotMatch(html, /<script\b|<form\b|<dialog\b|id="showcase"/i);
  assert.match(html, /3 posts \/ 3 months/);
  assert.match(html, /5 posts \/ 5 months/);
  assert.match(html, /Contact us for pricing/);
  assert.ok(html.includes('href="../../help/?lang=en"'));
  assert.doesNotMatch(html, /(?:AUD|\$)\s*\d|1,000|3,000|5,000|half refund|50% refund/i);
  for (const term of ['coogee-original', 'Luna Park', 'One Drop', '203K', '7,830', 'showcase.js', 'Back to review', 'Not published']) assert.ok(!html.includes(term), term);
  // The main site reuses approved service photos, but links customers to the indexed service page.
  for (const file of ['index.html', 'cn/index.html']) assert.doesNotMatch(read(file), /href="[^\"]*brochure\/xiaohongshu/);
  assert.ok(!read('sitemap.xml').includes('brochure/xiaohongshu'));
  assert.ok(!read('sitemap.xml').includes('/help/'));
});

test('new public folders contain only the approved static files', () => {
  const list = dir => fs.readdirSync(path.join(root, dir), {withFileTypes: true}).flatMap(item =>
    item.isDirectory() ? list(dir + '/' + item.name).map(file => item.name + '/' + file) : [item.name]);
  assert.deepEqual(list('help').sort(), ['faq-data.js', 'help.css', 'help.js', 'index.html', 'logo.jpeg', 'search.js']);
  assert.deepEqual(list('brochure/xiaohongshu').sort(), ['assets/cafe.jpg', 'assets/logo.jpeg', 'assets/planning.jpg', 'assets/restaurant.jpg', 'brochure-v2.css', 'index.html']);
});

for (const [lang, home, service, form] of [
  ['en', 'index.html', 'services/xiaohongshuWeChatContentSupport.html', '../#info'],
  ['zh', 'cn/index.html', 'cn/xiaohongshuWeChatContentSupport.html', './#info']
]) {
  test(`${lang}: homepage routes reach the language-matched integrated service`, () => {
    const html = read(home);
    const section = html.match(/<section class="xhs-home"[\s\S]*?<\/section>/)[0];
    const links = [...section.matchAll(/<a class="xhs-home-card" href="([^"]+)"/g)];
    assert.equal(links.length, 2);
    for (const [, href] of links) {
      const url = new URL(href, 'https://gomarketing.net.au/' + home);
      assert.equal(url.pathname, '/' + service);
      assert.match(read(service), new RegExp(`id="${url.hash.slice(1)}"`));
    }
    assert.match(read(service), new RegExp(`href="${form.replaceAll('.', '\\.')}"`));
    assert.match(read(service), /href="https:\/\/wa\.me\/61450428693"/);
  });

  test(`${lang}: integrated service remains indexed, bilingual, quote-only and client-safe`, () => {
    const html = read(service);
    assert.doesNotMatch(html, /name="robots"[^>]*noindex/);
    assert.match(html, /hreflang="en-AU"/);
    assert.match(html, /hreflang="zh-Hans"/);
    assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
    assert.equal([...html.matchAll(/<details class="xhs-scope"/g)].length, 4);
    for (const id of ['platform-roles', 'what-is-included', 'best-fit', 'related-insights', 'account-management', 'channel-promotion', 'local-market']) {
      assert.ok(html.includes(`id="${id}"`), id);
    }
    assert.doesNotMatch(html, /(?:AUD|\$)\s*\d|1,000|3,000|5,000|50%|half refund|退一半|Luna Park|One Drop|203K|7,830/);
    assert.doesNotMatch(html, /<form\b|<iframe\b|showcase\.js/i);
    assert.match(html, lang === 'en' ? /3 posts \/ 3 months/ : /3 篇 \/ 3 个月/);
    assert.match(html, lang === 'en' ? /5 posts \/ 5 months/ : /5 篇 \/ 5 个月/);
    assert.match(html, lang === 'en' ? /up to three revision rounds per post/i : /每篇最多三轮修改/);
    assert.match(html, lang === 'en' ? /unapproved content is not automatically published/i : /未确认的内容不会自动发布/);
    assert.match(html, lang === 'en' ? /Reports, meetings.*separate management options/ : /报告、会议.*可选服务/);
    assert.match(html, lang === 'en' ? /Where permission allows/ : /在授权允许的范围内/);
    assert.match(html, /href="\.\.\/brochure\/xiaohongshu\/"/);
  });

  test(`${lang}: all seven service FAQ answers match the published structured data`, () => {
    const html = read(service);
    const clean = s => s.replace(/&amp;/g, '&').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const visible = [...html.matchAll(/<article class="seo-faq__item"><h3>(.*?)<\/h3><p>(.*?)<\/p><\/article>/gs)]
      .map(m => ({question:clean(m[1]), answer:clean(m[2])}));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const page = schema['@graph'].find(n => Array.isArray(n['@type']) && n['@type'].includes('FAQPage'));
    assert.equal(visible.length, 7);
    assert.deepEqual(page.mainEntity.map(n => ({question:n.name, answer:n.acceptedAnswer.text})), visible);
  });
}

test('shared brochure links to both integrated service languages without exposing private materials', () => {
  const html = read('brochure/xiaohongshu/index.html');
  assert.match(html, /href="\.\.\/\.\.\/services\/xiaohongshuWeChatContentSupport.html"/);
  assert.match(html, /href="\.\.\/\.\.\/cn\/xiaohongshuWeChatContentSupport.html"/);
  const css = read('css/xhs-services.css');
  assert.doesNotMatch(css, /@import|url\(|font-size:[^;]*(?:vw|vh)/);
  assert.doesNotMatch(css, /animation\s*:/);
});

for (const [lang, directory, formHref, home] of [
  ['en', 'services', '../#info', 'index.html'],
  ['zh', 'cn', './#info', 'cn/index.html']
]) {
  test(`${lang}: agency and support enquiries reach the existing language-matched form`, () => {
    const sections = [
      read(`${directory}/sydneyBilingualMarketingAgency.html`).match(/<section class="service-overview__cta">[\s\S]*?<\/section>/)?.[0],
      read(`${directory}/support.html`).match(/<section class="support-page__lead"[^>]*>[\s\S]*?<\/section>/)?.[0]
    ];
    for (const section of sections) {
      assert.ok(section, 'The enquiry section must remain present');
      assert.ok(section.includes(`href="${formHref}"`));
      assert.doesNotMatch(section, /<form\b|<iframe\b|<script\b/i);
      const destination = new URL(formHref, `https://gomarketing.net.au/${directory}/support.html`);
      assert.equal(destination.pathname + 'index.html', '/' + home);
      assert.equal(destination.hash, '#info');
    }
    assert.match(read(home), /id="info"/);
    assert.match(read(home), /<form\b/);
  });

  test(`${lang}: support scope stays conditional and agency paths avoid a stale count`, () => {
    const support = read(`${directory}/support.html`);
    const lead = support.match(/<section class="support-page__lead"[^>]*>[\s\S]*?<\/section>/)[0];
    assert.match(lead, lang === 'en' ? /focused project or\s+ongoing support/ : /单个项目或持续支持/);
    assert.match(lead, lang === 'en' ? /not all included in a\s+single package/ : /并非所有项目都包含在同一个套餐/);
    assert.doesNotMatch(lead, /(?:AUD|\$)\s*\d|guaranteed rankings|保证排名|免费完整审计/i);
    const agency = read(`${directory}/sydneyBilingualMarketingAgency.html`);
    const paths = agency.match(/<section class="service-overview__section" id="core-paths">[\s\S]*?<\/section>/)[0];
    assert.equal([...paths.matchAll(/<a class="service-overview__card"/g)].length, 5);
    assert.doesNotMatch(paths, /three main ways|三条主要服务/);
  });
}
