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
  for (const file of ['index.html', 'cn/index.html', 'sitemap.xml']) assert.ok(!read(file).includes('brochure/xiaohongshu'));
  assert.ok(!read('sitemap.xml').includes('/help/'));
});

test('new public folders contain only the approved static files', () => {
  const list = dir => fs.readdirSync(path.join(root, dir), {withFileTypes: true}).flatMap(item =>
    item.isDirectory() ? list(dir + '/' + item.name).map(file => item.name + '/' + file) : [item.name]);
  assert.deepEqual(list('help').sort(), ['faq-data.js', 'help.css', 'help.js', 'index.html', 'logo.jpeg', 'search.js']);
  assert.deepEqual(list('brochure/xiaohongshu').sort(), ['assets/cafe.jpg', 'assets/logo.jpeg', 'assets/planning.jpg', 'assets/restaurant.jpg', 'brochure-v2.css', 'index.html']);
});
