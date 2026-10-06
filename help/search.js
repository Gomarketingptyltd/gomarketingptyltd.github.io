(function () {
  'use strict';
  const normalize = text => text.normalize('NFKC').toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
  const sensitive = text => /[\w.+-]+@[\w.-]+\.[a-z]{2,}|\bsk-[a-z0-9_-]{12,}|(?:password|api.?key|密码|验证码)\s*[:=：]\s*\S{3,}|(?:\+?\d[\s()-]*){9,}/i.test(text);
  function contains(query, term) {
    if (!term) return false;
    if (/^[a-z0-9\s-]+$/.test(term)) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:$|[^a-z0-9])').test(query);
    }
    return query.includes(term);
  }
  function search(input, data) {
    const raw = String(input).slice(0, 160);
    if (sensitive(raw)) return {kind: 'privacy', entries: []};
    const query = normalize(raw);
    if (!query) return {kind: 'empty', entries: []};
    if (/^(?:我要|我想|请帮我|怎么|如何)?(?:联系你们|联系团队|联系|转人工|找人工|人工|电话|电话号码|电话是多少|邮箱|邮箱地址|whatsapp|email|phone|contact|contact you|human|speak to your team)$/i.test(query)) {
      return {kind: 'contact', entries: []};
    }
    const ranked = data.entries.map(entry => {
      const titles = Object.values(entry.question).map(normalize);
      let score = titles.some(title => title === query) ? 100 : 0;
      if (query.length >= 2 && titles.some(title => title.includes(query))) score = Math.max(score, 42);
      for (const keyword of entry.keywords) {
        const term = normalize(keyword);
        if (contains(query, term)) score = Math.max(score, 12 + Math.min(term.length, 20));
      }
      return {entry, score};
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
    return {kind: ranked.length ? 'results' : 'unknown', entries: ranked.map(item => item.entry)};
  }
  window.GoMarketingHelpSearch = Object.freeze({search, normalize});
})();
