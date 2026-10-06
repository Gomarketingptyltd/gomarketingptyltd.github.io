(function () {
  'use strict';
  const data = window.GoMarketingHelp;
  const matching = window.GoMarketingHelpSearch;
  if (!data || !matching) return;
  const $ = selector => document.querySelector(selector);
  const copy = {
    zh: {
      skip: '跳到常见问题', brandCaption: '服务咨询', eyebrow: 'GO MARKETING · 常见问题', heading: '你想了解哪项服务？',
      intro: '从小红书推广、网站与 App，到 CRM 和业务自动化。', searchLabel: '搜索常见问题', search: '搜索', clear: '清除',
      searchNote: '请只输入问题，不要填写客户资料、密码或保密内容。', topics: '按主题查找', popular: '热门问题', all: '全部问题', results: '相关问题',
      talkWhatsApp: '通过 WhatsApp 咨询', browseAll: '查看全部问题', contactEyebrow: '聊聊下一步', contactTitle: '聊聊你的具体需求',
      contactCopy: '简单介绍你的业务和目标。没有完整方案，也可以先聊聊。', email: '邮件', phone: '电话',
      contactNote: '不需要先填表。打开联系渠道后，由你自行发送消息。',
      answerNote: '以上为一般服务说明。具体范围、费用与合作条款，由团队与你书面确认。',
      related: '你可能还想了解', askAboutThis: '进一步咨询团队', placeholder: '例如：报价、App', serviceLabel: '服务咨询 · 常见问题',
      privacyTitle: '搜索与隐私', privacyBody: '问题搜索只在你的浏览器内进行，不调用 AI，不保存搜索历史，也不向团队发送输入。联系链接不携带你的搜索内容。打开 WhatsApp、邮件或电话后，将使用相应服务的数据处理方式。请勿输入个人信息或保密资料。',
      unknownTitle: '这个问题，直接和我们聊聊', unknownBody: '暂时没有对应的常见问题。告诉团队你的具体情况，我们会进一步确认。',
      privacyHeading: '请不要输入私人或保密信息', privacyDescription: '这里无需填写联系方式、密码或客户记录。这些内容没有被发送；请清除后只输入问题，或直接联系团队。',
      contactHeading: '可以直接联系团队', contactDescription: '选择 WhatsApp、邮件或电话即可，不需要继续回答问题或填写表单。',
      count: n => n + ' 个问题', nav: '问题主题', whatsappLabel: '通过 WhatsApp 联系 Go Marketing', brandLabel: 'Go Marketing 官网'
    },
    en: {
      skip: 'Skip to questions', brandCaption: 'Service enquiries', eyebrow: 'GO MARKETING · COMMON QUESTIONS', heading: 'What would you like to know?',
      intro: 'Xiaohongshu, websites and apps, CRM and business automation.', searchLabel: 'Search common questions', search: 'Search', clear: 'Clear',
      searchNote: 'Questions only. Do not enter customer records, passwords or confidential information.', topics: 'Browse by topic', popular: 'Popular questions', all: 'All questions', results: 'Related questions',
      talkWhatsApp: 'Enquire on WhatsApp', browseAll: 'Browse all questions', contactEyebrow: 'YOUR NEXT STEP', contactTitle: 'Let’s discuss your project.',
      contactCopy: 'Tell us about your business and your goal. You do not need a complete brief to start.', email: 'Email', phone: 'Phone',
      contactNote: 'No form required. Opening a contact channel does not send a message for you.',
      answerNote: 'These are general service details. The team confirms scope, fees and terms with you in writing.',
      related: 'You may also want to know', askAboutThis: 'Discuss this with our team', placeholder: 'Try: pricing', serviceLabel: 'Service enquiries · Common questions',
      privacyTitle: 'Search & privacy', privacyBody: 'Question searches run only in your browser. They do not call AI, save search history or send your input to the team. Contact links do not contain your search. If you open WhatsApp, email or phone, that service’s data practices apply. Do not enter personal or confidential information.',
      unknownTitle: 'Let’s discuss that directly', unknownBody: 'There is no matching answer in these common questions. Tell the team about your situation so we can clarify it with you.',
      privacyHeading: 'Please keep private information out', privacyDescription: 'Contact details, passwords and customer records are not needed here. Your input has not been sent. Clear it and enter only your question, or contact the team directly.',
      contactHeading: 'Speak directly with our team', contactDescription: 'Choose WhatsApp, email or phone. You do not have to answer more questions or complete a form.',
      count: n => n === 1 ? '1 question' : n + ' questions', nav: 'Question topics', whatsappLabel: 'Contact Go Marketing on WhatsApp', brandLabel: 'Go Marketing website'
    }
  };
  let language = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'zh';
  let category = 'popular';
  let openId = null;
  const input = $('#search');
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function contactLink(label, className = '', channel = 'whatsapp') {
    const link = element('a', className, label);
    link.href = data.contacts[channel];
    link.dataset.contact = channel;
    if (channel === 'whatsapp') { link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', copy[language].whatsappLabel); }
    return link;
  }
  function categories() {
    const options = [{id: 'popular', label: copy[language].popular, count: data.popular.length},
      ...data.categories.map(item => ({id: item.id, label: item.label[language], count: data.entries.filter(entry => entry.category === item.id).length})),
      {id: 'all', label: copy[language].all, count: data.entries.length}];
    $('#categories').replaceChildren(...options.map(option => {
      const button = element('button', 'category');
      button.type = 'button'; button.dataset.category = option.id;
      button.setAttribute('aria-pressed', String(category === option.id));
      button.append(element('span', '', option.label), element('span', 'count', String(option.count)));
      button.addEventListener('click', () => {
        category = option.id; input.value = ''; openId = null; render();
        document.querySelector('[data-category="' + option.id + '"]').focus({preventScroll: true});
      });
      return button;
    }));
  }
  function reveal(id) {
    const entry = data.entries.find(item => item.id === id);
    if (!entry) return;
    category = entry.category; input.value = ''; openId = id; render();
    const target = document.getElementById('faq-' + id);
    target.querySelector('summary').focus({preventScroll: true});
    target.scrollIntoView({block: 'start', behavior: 'auto'});
  }
  function question(entry) {
    const details = element('details', 'faq');
    details.id = 'faq-' + entry.id; details.dataset.faq = entry.id;
    details.setAttribute('name', 'help-faq');
    details.open = openId === entry.id;
    const summary = element('summary');
    const mark = element('span', 'toggle-mark'); mark.setAttribute('aria-hidden', 'true');
    summary.append(element('span', '', entry.question[language]), mark);
    const answer = element('div', 'answer');
    answer.append(element('p', '', entry.answer[language]), contactLink(copy[language].askAboutThis, 'answer-contact'));
    if (entry.related.length) {
      const related = element('div', 'related');
      related.append(element('span', 'related-label', copy[language].related));
      for (const id of entry.related) {
        const item = data.entries.find(other => other.id === id);
        const button = element('button', '', item.question[language]);
        button.type = 'button'; button.dataset.related = id;
        button.addEventListener('click', () => reveal(id));
        related.append(button);
      }
      answer.append(related);
    }
    details.append(summary, answer);
    details.addEventListener('toggle', () => {
      if (!details.isConnected) return;
      if (details.open) {
        openId = entry.id;
      } else if (openId === entry.id) openId = null;
    });
    return details;
  }
  function render() {
    const text = copy[language];
    const query = input.value.trim();
    let result;
    if (query) {
      category = 'all';
      result = matching.search(query, data);
    } else {
      result = {kind: 'results', entries: category === 'popular' ? data.popular.map(id => data.entries.find(entry => entry.id === id))
        : data.entries.filter(entry => category === 'all' || entry.category === category)};
    }
    categories();
    $('#clear-search').disabled = input.value.length === 0;
    const title = query ? text.results : category === 'popular' ? text.popular : category === 'all' ? text.all : data.categories.find(item => item.id === category).label[language];
    $('#section-title').textContent = title;
    $('#result-count').textContent = text.count(result.entries.length);
    $('#faq-list').replaceChildren(...result.entries.map(question));
    $('#empty').hidden = result.entries.length > 0;
    const privacy = result.kind === 'privacy';
    const contact = result.kind === 'contact';
    $('#empty-title').textContent = privacy ? text.privacyHeading : contact ? text.contactHeading : text.unknownTitle;
    $('#empty-description').textContent = privacy ? text.privacyDescription : contact ? text.contactDescription : text.unknownBody;
  }
  function translate() {
    const text = copy[language];
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = language === 'zh' ? 'Go Marketing | 服务咨询' : 'Go Marketing | Service enquiries';
    document.querySelectorAll('[data-text]').forEach(node => { node.textContent = text[node.dataset.text]; });
    input.placeholder = text.placeholder;
    $('#categories').setAttribute('aria-label', text.nav);
    $('.brand').setAttribute('aria-label', text.brandLabel);
    $('#language').textContent = language === 'zh' ? 'EN' : '中文';
    $('#language').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    document.querySelectorAll('[data-contact="whatsapp"]').forEach(link => link.setAttribute('aria-label', text.whatsappLabel));
    render();
  }
  input.addEventListener('input', () => { openId = null; render(); });
  input.addEventListener('search', () => { openId = null; render(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { input.value = ''; openId = null; category = 'popular'; render(); }
  });
  $('#search-form').addEventListener('submit', event => {
    event.preventDefault(); render(); $('#questions').focus({preventScroll: true});
    $('#questions').scrollIntoView({block: 'start', behavior: 'auto'});
  });
  $('#clear-search').addEventListener('click', () => { input.value = ''; openId = null; category = 'popular'; render(); input.focus(); });
  $('#browse-all').addEventListener('click', () => { input.value = ''; openId = null; category = 'all'; render(); $('#questions').focus(); });
  $('#language').addEventListener('click', () => {
    openId = document.querySelector('.faq[open]')?.dataset.faq || null;
    language = language === 'zh' ? 'en' : 'zh'; translate();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) { input.value = ''; openId = null; category = 'popular'; render(); } });
  input.value = '';
  translate();
})();
