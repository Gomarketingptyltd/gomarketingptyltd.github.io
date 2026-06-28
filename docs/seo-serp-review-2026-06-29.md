# SERP Review

Date: 2026-06-29

## Purpose

Monday full-review refresh for priority query families after pulling the 2026-05-29 to 2026-06-25 Search Console window. This review is used with `docs/seo-dashboard.md`; it does not override query/page ownership rules.

## Current competitor pattern

| Query family | Visible competitor examples | What Google appears to reward | Implication for Go Marketing |
| --- | --- | --- | --- |
| `marketing agency sydney` / `digital marketing services sydney` | Clutch Sydney agency list, Sydney Digital Marketing, Sparro, Digital Nomads HQ, AEK Media | Local agency proof, review/directory trust, service breadth, lead-generation language, named frameworks and measurable outcomes | Do not rewrite the homepage while CTR remains acceptable. Strengthen proof, local citation presence and support pages before another broad homepage or digital-services edit. |
| `chinese marketing agency sydney` / `chinese marketing agency australia` | Brand Asia, Ignite Search, Vantage Digital | Chinese-market specialization, bilingual execution, Australia-China bridge, platform knowledge, client/category proof | The owner page still has no GSC page row while the query family is gaining impressions. The next action is indexing/crawl follow-up and manual URL Inspection before another owner-page rewrite. |
| `chinese marketing sydney` | Brand Asia, Vantage Digital, bilingual and multicultural agency pages | Community-specific credibility, category proof, platform familiarity, clear Sydney/Australia market framing | Keep `services/chineseCommunityGrowth.html` stable; use support content and internal links to build relevance instead of changing the owner page again. |
| `xiaohongshu marketing sydney` / `xiaohongshu marketing australia` | Brand Asia RedNote page, Trafficon, OZClicks, S&J Media Group and RedNote/Xiaohongshu guides | RedNote/Xiaohongshu specificity, creator/UGC language, Australia-China examples, hospitality and retail use cases | Hold the recently edited `services/xiaohongshuWeChatContentSupport.html` until post-edit data arrives. The support cluster remains the right escalation path. |
| `marketing support services` | Mixed agency, fractional marketing and business-support results | Clear scope, process, first-step definition and proof of practical help | Hold after the 2026-06-26 support-page process/FAQ edit because the latest GSC window ends before that edit can be judged. |

## Data-backed signals

| Signal | Interpretation | Action |
| --- | --- | --- |
| Site totals fell to 19 clicks, 1,815 impressions, 1.05% CTR and average position 37.0 | Slight softening versus the prior comparable window; no single broad rewrite trigger | Keep page ownership stable and focus on indexing/crawl actions |
| `chinese marketing agency sydney` rose to 97 impressions at average position 31.9 | Demand is present, but the English Chinese agency owner page still has no latest page row | Request indexing and resubmit sitemap |
| `services/xiaohongshuWeChatContentSupport.html` has 37 impressions at average position 7.8 and 0 clicks | Strong position/CTR opportunity, but the 2026-06-24 snippet edit has only partial data in this window | Hold until the next comparable report |
| `marketing support services` has 77 impressions at average position 17.4 and 0 clicks | Still a tactical opportunity, but the 2026-06-26 page edit is not reflected in the window | Hold until the next comparable report |
| GSC still reports `http://gomarketing.net.au/` with 110 impressions | Live HTTP redirects to HTTPS, so this is not a current production safety failure | Track as a canonical/indexing follow-up; keep sitemap HTTPS-only |

## Tactical content gaps

| Gap | Priority | Recommended action |
| --- | --- | --- |
| Chinese agency owner page has no GSC page row | High | Manual URL Inspection for the English and Chinese Chinese-agency URLs; resubmit sitemap after any material sitemap/page update |
| Local trust and third-party proof remain weaker than visible agency competitors | High | Prepare Google Business Profile, LinkedIn and agency-directory citation checklist; prioritize proof/case references over more generic copy |
| Xiaohongshu support content is visible but not clicked yet | Medium | Wait for post-2026-06-24 data; if CTR is still 0 with page-one average position, refine title/meta again or add a more specific FAQ snippet |
| Marketing support page is close to page two but recently edited | Medium | Wait for post-2026-06-26 data; if CTR remains 0 near position 15-20, tighten title/meta around practical marketing support services |

## Decision

- Highest-confidence action today: indexing/crawl reinforcement rather than ranking-copy changes.
- Action taken: submitted `https://gomarketing.net.au/sitemap.xml` in Search Console.
- Manual URL Inspection still recommended for:
  - `https://gomarketing.net.au/services/sydneyBilingualMarketingAgency.html`
  - `https://gomarketing.net.au/cn/sydneyBilingualMarketingAgency.html`
  - `https://gomarketing.net.au/services/marketingAutomationServicesSydney.html`
  - `https://gomarketing.net.au/services/howToReachChineseConsumersInSydney.html`
  - `https://gomarketing.net.au/services/xiaohongshuMarketingForSydneyRestaurants.html`
  - `https://gomarketing.net.au/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html`

## Sources Checked

- Clutch Sydney digital marketing list: `https://clutch.co/au/agencies/digital-marketing/sydney`
- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- Sparro: `https://sparro.com.au/`
- Digital Nomads HQ Sydney page: `https://digitalnomadshq.com.au/digital-marketing-sydney/`
- AEK Media Sydney page: `https://aekmedia.com.au/sydney/`
- Brand Asia: `https://brandasia.com.au/`
- Brand Asia RedNote page: `https://brandasia.com.au/rednote-little-red-book-marketing/`
- Ignite Search Chinese marketing page: `https://www.ignitesearch.com.au/chinese-marketing-agency/`
- Vantage Digital: `https://vantagedigital.com.au/`
- Trafficon Xiaohongshu page: `https://trafficon.com.au/xiaohongshu-marketing/`
- S&J Media Group RedNote page: `https://sjmediagroup.com.au/rednote-advertising-in-australia/`
