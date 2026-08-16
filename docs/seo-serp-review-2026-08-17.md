# SEO SERP Review — 2026-08-17

## Review context

- Run type: Monday full strategy and data review.
- Search Console state: OAuth token refresh failed with `Bad Request`; latest usable 28-day window remains 2026-06-07 to 2026-07-04 and is 43 days stale.
- Method: current web-search samples for the five required query families. Results are directional and may vary by location or personalisation; this is not a neutral rank tracker.
- Production safety: release gate and live HTTPS/CSS checks passed; Playwright Chromium was restored and 28 desktop/mobile renders passed in `.seo-visual/20260816T233235Z/report.md`.

## Query-family observations

### Marketing agency Sydney — homepage owner

The broad results remain agency service pages and homepages that lead with named channel scope, local-market fit, process, reviews and quantified outcomes. Go Marketing's bilingual positioning remains differentiated. With no fresh CTR or ownership signal, the homepage stays on hold; approved proof and consistent local identity remain more defensible than broader copy.

### Digital marketing services Sydney — `services/digital.html`

Current results expose SEO, PPC/Google Ads, social, content, web/CRO and a measurable delivery promise. Go Marketing's service owner and small-business guide already cover service sequencing and buyer fit. The 43-day-old GSC data cannot justify another owner-page edit. Trigger only on a fresh near-page-one weak-CTR, rising position 16-25, or wrong-page ownership signal.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

Specialist results make local Sydney context, platform scope, sector fit, delivery process and proof visible together. Go Marketing covers the first four but still lacks approved project evidence. Hold the owner page until either a fresh comparable GSC report or one evidence intake is marked `approved to draft`.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

The result set overlaps specialist social agencies and broad community-marketing pages. Platform execution detail belongs on the Xiaohongshu/WeChat owner rather than being duplicated here. Keep this page as the broader trust/community owner and use contextual support links to separate query ownership.

### Xiaohongshu marketing Sydney — `services/xiaohongshuWeChatContentSupport.html`

Go Marketing appeared in the sampled results with clean query alignment, alongside specialists showing platform deliverables, creator/KOL/KOC work, sector examples, pricing and proof. The service title, H1 and first screen should remain unchanged. The clearest safe action is to reinforce this surfaced owner from the relevant bilingual Sydney-restaurant support pair.

## Priority decisions

| Page | Opportunity score | Decision | Rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Edit only on fresh near-page-one weak CTR or ownership regression |
| `services/digital.html` | 2 | `hold` | Stale position 62.2; require a fresh comparable report |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Rising-impression signal is stale; require fresh data or approved case evidence |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Preserve broader community intent and avoid platform-owner overlap |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No latest page row; inspect after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 4 | `request indexing` | Improved bilingual pair remains queued for inspection |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 4 | `request indexing` | Bilingual contextual owner links changed on 2026-08-17 |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual improvements remain queued for inspection |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Current sampled result has clean ownership; require fresh CTR data or approved proof before editing |

## Selected weekly action

Add bilingual contextual links from the Sydney restaurant support article to the surfaced Xiaohongshu/WeChat service owner, update truthful article-modification signals and sitemap dates, and leave all owner-page ranking copy unchanged.

## Recovery and next trigger

Run `npm run search-console:auth`, complete Google sign-in and consent, then run doctor, a 28-day snapshot, dashboard generation and one sitemap submission. Use URL Inspection on the updated restaurant pair and request indexing only if Google lacks the current canonical version. Wednesday should compare the fresh report if available; otherwise validate deployment and progress only an approved proof/citation or verified crawl action.
