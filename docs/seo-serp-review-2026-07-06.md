# SERP Review

Date: 2026-07-06

## Purpose

Monday full-review refresh after pulling the 2026-06-05 to 2026-07-02 Search Console window. This review is used with `docs/seo-dashboard.md` and the fresh query-page table at `.search-console/reports/2026-06-05_to_2026-07-02/query_pages.csv`.

## Current competitor pattern

| Query family | Visible competitor examples | What Google appears to reward | Implication for Go Marketing |
| --- | --- | --- | --- |
| `marketing agency sydney` / `digital marketing services sydney` | Clutch Sydney agency list, Sydney Digital Marketing, The Collective Co, Semrush agency listings, Digital Nomads HQ | Directory trust, broad local agency proof, service breadth, lead-generation framing, review-style comparison pages | Keep homepage and digital owner page stable. Build proof and support assets before another broad service rewrite. |
| `chinese marketing agency sydney` / `chinese marketing sydney` | Brand Asia, Ignite Search Chinese marketing page, Vantage Digital, BE BOLDER Chinese marketing page, job/listing results mixed into Sydney searches | Chinese-market specialization, bilingual execution, Australia-China market bridge, platform knowledge, visible client/category proof | Owner page is now appearing for the target query, but homepage still has more impressions. Continue ownership cleanup through contextual internal links and avoid reloading homepage with Chinese-agency wording. |
| `xiaohongshu marketing sydney` / `xiaohongshu marketing australia` | Brand Asia RedNote page, OZClicks, AiMRed, Balmer Agency guides, Trafficon, VisionVivo hospitality content | Specific RedNote/Xiaohongshu service pages, creator/UGC language, Australian brand examples, platform-specific education | The Xiaohongshu/WeChat support page remains the highest CTR opportunity, but the 2026-07-02 edit is too recent to change again. Hold until post-edit GSC data is available. |
| `marketing support services` | Mixed service-support, fractional marketing, cross-border and agency support pages | Practical scope, first-step clarity, implementation support and proof of operational help | Hold the support page after the 2026-06-26 edit. If it remains around position 15-20 with 0 clicks in the next comparable report, tighten the snippet or first FAQ. |
| `marketing automation sydney` | Job boards, Sydney Digital Marketing automation service page, Semrush agency listings, Salesforce informational guide | Commercial service pages and broad automation education both appear, but service intent is present | Query ownership is wrong: the informational article has all 19 impressions and the service page has no row. Fix by making the article more educational and strengthening the service-page handoff. |

## Data-backed signals

| Signal | Interpretation | Action |
| --- | --- | --- |
| Site totals moved to 20 clicks, 1,659 impressions, 1.21% CTR and average position 41.5 | Traffic is broadly flat; no full-site rewrite trigger | Use precise ownership and crawl-path actions |
| `chinese marketing agency sydney` has 103 impressions; homepage has 57 impressions at position 15.5 and owner page has 11 at position 14.2 | Owner page is gaining visibility but homepage still has most impressions | Hold recently edited owner/homepage pages and keep building contextual support into the owner page |
| `chinese marketing sydney` owner page has 10 impressions at position 18, with homepage at 5 impressions position 21.2 | Owner ownership is cleaner than the agency query | Hold and validate next report before changing the owner page |
| `marketing support services` has 72 impressions at position 18.9 on `services/support.html` | Close to the tactical zone, but not improving yet | Hold one more comparable report after the 2026-06-26 edit |
| `marketing automation sydney` has 19 impressions on `services/whatIsMarketingAutomation.html`; the service page still has no row | Wrong-page ownership and service-page discovery issue | Ship a small article role/handoff edit and update sitemap `lastmod` |
| `services/xiaohongshuWeChatContentSupport.html` has 31 impressions at position 7.7 and 0 clicks | Strong page-one CTR opportunity | Hold because the 2026-07-02 snippet edit is not yet reflected in a fresh post-edit window |

## Decision

- Highest-confidence action today: marketing automation query ownership cleanup.
- Action taken: changed `services/whatIsMarketingAutomation.html` title/meta/social/schema/H1 from Sydney service-page framing to educational guide framing, strengthened the contextual link to `services/marketingAutomationServicesSydney.html`, updated visible and structured modified dates, and updated sitemap `lastmod`.
- Sitemap/indexing action: submit `https://gomarketing.net.au/sitemap.xml` after deployment; request indexing for `https://gomarketing.net.au/services/whatIsMarketingAutomation.html` only if manual quota is available because it had a material role/handoff edit.

## Sources checked

- Clutch Sydney digital marketing list: `https://clutch.co/au/agencies/digital-marketing/sydney`
- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- The Collective Co: `https://www.thecollectiveco.com.au/`
- Semrush Sydney agency list: `https://agencies.semrush.com/list/sydney/`
- Digital Nomads HQ Sydney page: `https://digitalnomadshq.com.au/digital-marketing-sydney/`
- Brand Asia: `https://brandasia.com.au/`
- Brand Asia RedNote page: `https://brandasia.com.au/rednote-little-red-book-marketing/`
- Ignite Search Chinese marketing page: `https://www.ignitesearch.com.au/chinese-marketing-agency/`
- Vantage Digital: `https://vantagedigital.com.au/`
- BE BOLDER Chinese marketing page: `https://bebolder.com.au/chinese-marketing/`
- OZClicks Xiaohongshu page: `https://ozclicks.com.au/xiaohongshu-marketing/`
- AiMRed Xiaohongshu page: `https://aimred.co/index.php/xiaohongshu/`
- Balmer Agency Xiaohongshu guides: `https://www.balmeragency.com.au/`
- Trafficon Xiaohongshu page: `https://trafficon.com.au/xiaohongshu-marketing/`
- VisionVivo Xiaohongshu hospitality page: `https://visionvivo.com/marketing-with-xiaohongshu/`
- Sydney Digital Marketing automation page: `https://sydneydigitalmarketing.com.au/services/marketing-automation-agency/`
- Salesforce AU marketing automation guide: `https://www.salesforce.com/au/marketing/automation/guide/`
