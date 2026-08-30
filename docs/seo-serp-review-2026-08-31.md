# SEO SERP Review — 2026-08-31

## Review context

- Run type: Monday full strategy and data review.
- Search Console state: OAuth token refresh and the required 28-day snapshot both failed with `Bad Request`; the latest usable window remains 2026-06-07 to 2026-07-04 and is 57 days stale.
- Method: current web-search samples for the five required query families. Results are directional and can vary by location, index and personalisation; they are not a neutral rank tracker.
- Production safety: release gate, live HTTPS/CSS checks and 28 desktop/mobile renders passed. Visual report: `.seo-visual/20260830T233111Z/report.md`.

## Query-family observations

### Marketing agency Sydney — homepage owner

The sampled results remain dominated by agency homepages that make Sydney relevance, channel scope, process and proof visible immediately. Go Marketing's homepage was discoverable in the broader sample and retains a differentiated bilingual-growth position. Preserve that positioning: edit only after a fresh weak-CTR or wrong-page signal, or after approved local identity/proof inputs permit a concrete credibility improvement.

### Digital marketing services Sydney — `services/digital.html`

Go Marketing's dedicated owner page appeared in the current sample with the intended title, H1 and small-business service promise. Competing pages foreground channel breadth, local coverage, reviews, measurable outcomes and engagement terms. Ownership looks clean in the sample, so do not repeat those claims without evidence or broaden the page from 57-day-old data. Trigger an edit only on fresh position 4-15 weak CTR, position 16-25 rising impressions, or wrong-page ownership.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

Specialist competitors increasingly combine Sydney location detail, platform scope, sectors, process, pricing and quantified case claims. Go Marketing already covers the strategic bilingual distinction but the evidence intake remains empty. Keep the page on hold until a fresh comparable report or one evidence packet is approved to draft; invented metrics, client names or delivery scope would be a larger risk than the current proof gap.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

The sampled result set still mixes broad Chinese-community intent with specialist Chinese-social agencies. Keep this page as the audience-trust and community-growth owner. Do not copy the managed-platform promise from `services/xiaohongshuWeChatContentSupport.html`; edit only if fresh query-page data shows ownership confusion or a position 16-25 rising-impression opportunity.

### Xiaohongshu marketing Sydney — `services/xiaohongshuWeChatContentSupport.html`

Go Marketing's intended service owner appeared in the current sample with clean Xiaohongshu/WeChat role separation. Competing results now expose concrete setup fees or monthly ranges, creator/KOL/KOC scope, operating process and claimed outcomes. The prepared comparison brief already captures the buyer questions and first-party source gate. Drafting remains correctly blocked until Go Marketing approves a public pricing position and deliverable boundaries; competitor ranges must not be borrowed.

## Priority decisions

| Page | Opportunity score | Decision | Rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Sampled visibility and differentiation remain intact; act on fresh weak CTR, ownership regression or approved local proof |
| `services/digital.html` | 2 | `hold` | Current sample shows the correct owner; require fresh comparable GSC evidence before another ranking edit |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Historical position 23.1/rising impressions are stale; act on fresh confirmation or an approved evidence packet |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Preserve broader community intent; act only on fresh ownership confusion or rising position 16-25 demand |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No row in the latest local report; inspect canonical/coverage after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 4 | `request indexing` | Improved bilingual pair remains queued for authenticated inspection |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 4 | `request indexing` | Newest materially changed bilingual pair remains first in the inspection queue |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual improvements remain absent from the stale report |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Sampled ownership is clean; publication action is gated on approved pricing and scope |

## Selected weekly action

Preserve the clean digital-services and Xiaohongshu owner-page signals and keep the four-pair indexing queue ready. The highest-confidence executable action is authenticated sitemap submission plus restaurant-guide URL Inspection immediately after OAuth recovery. If OAuth remains blocked, the next content action is the bilingual Xiaohongshu-versus-WeChat guide only after the owner records one pricing position and deliverable boundaries in `docs/seo-support-brief-xiaohongshu-vs-wechat-sydney-2026-07-20.md`.

## Sampled result sources

- Go Marketing homepage: `https://gomarketing.net.au/`
- Go Marketing digital-services owner: `https://gomarketing.net.au/services/digital.html`
- Go Marketing Xiaohongshu/WeChat owner: `https://gomarketing.net.au/services/xiaohongshuWeChatContentSupport.html`
- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- Techable Australia: `https://techableaustralia.com.au/digital-marketing`
- Deep Reach Sydney: `https://www.deepreachagency.com/locations/sydney/`
- Riseo Xiaohongshu cost guide: `https://riseo.com.au/blog/xiaohongshu-marketing-agency-sydney-cost/`
- Orient Media: `https://orientmedia.com.au/`

## Recovery and next trigger

Run `npm run search-console:auth`, complete Google sign-in and consent, then run `node scripts/search-console.js doctor`, `node scripts/search-console.js snapshot --days=28`, `npm run seo:dashboard`, and `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`. Inspect the restaurant-guide pair first and request indexing only if Google lacks the current canonical/material version. Wednesday should execute that queue, or draft the prepared bilingual comparison guide only when pricing and deliverable boundaries are approved.
