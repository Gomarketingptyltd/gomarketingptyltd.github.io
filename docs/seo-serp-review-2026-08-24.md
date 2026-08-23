# SEO SERP Review — 2026-08-24

## Review context

- Run type: Monday full strategy and data review.
- Search Console state: OAuth token refresh failed with `Bad Request`; latest usable 28-day window remains 2026-06-07 to 2026-07-04 and is 50 days stale.
- Method: current web-search samples for the five required query families. Results are directional and can vary by location or personalisation; they are not a neutral rank tracker.
- Production safety: release gate, live HTTPS/CSS checks and 28 desktop/mobile renders passed. Visual report: `.seo-visual/20260823T233125Z/report.md`.

## Query-family observations

### Marketing agency Sydney — homepage owner

The current set remains dominated by agency homepages and service pages that expose channel scope, Sydney location coverage, reviews, process and quantified outcomes early. Go Marketing's homepage appeared in the sample and retains a distinct bilingual-growth position. With no fresh CTR or query-page evidence, keep the homepage on hold and prioritise approved proof and consistent local identity over broader service copy.

### Digital marketing services Sydney — `services/digital.html`

Results foreground SEO, paid search, social, content, web/CRO, local-area relevance and measurable commercial outcomes. Go Marketing already has a dedicated owner plus a small-business guide. The stale report cannot support another owner-page edit; trigger only on a fresh position 4-15 weak-CTR signal, rising position 16-25 signal, or wrong-page ownership.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

Specialist results increasingly package Sydney context, platform scope, sector fit, process, pricing and case evidence together. Go Marketing covers market context, platform roles and sector fit but still lacks an approved project proof block. Hold the owner page until a fresh comparable report or a completed evidence intake authorises a concrete example.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

The sampled set continues to mix broad community-growth pages with specialist Chinese-social agencies. Keep the page as the broader audience-trust and community owner. Do not duplicate the detailed managed-platform promise from `services/xiaohongshuWeChatContentSupport.html`.

### Xiaohongshu marketing Sydney — `services/xiaohongshuWeChatContentSupport.html`

Go Marketing appeared prominently in the sample with the correct service owner, while the broader community page also appeared lower in the set. Competing results have strengthened buyer-decision content around setup, monthly scope, creator/KOL/KOC activity, sector fit, process and pricing. The safest response is not a new owner-page rewrite: upgrade the existing Xiaohongshu-vs-WeChat support brief so it answers scope and cost-driver questions without inventing fees or borrowing competitor ranges.

## Priority decisions

| Page | Opportunity score | Decision | Rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Sampled visibility is present; edit only on fresh weak CTR or ownership regression |
| `services/digital.html` | 2 | `hold` | Stale position 62.2; require a fresh comparable report |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Historical rising-impression signal is stale; require fresh data or approved case evidence |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Preserve broad community intent and avoid platform-owner overlap |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No latest page row; inspect current canonical after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 4 | `request indexing` | Improved bilingual pair remains queued for authenticated inspection |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 4 | `request indexing` | Newest material bilingual change remains first in the inspection queue |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual improvements remain absent from the stale report |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Current sampled ownership is clean; use support content for the pricing/scope gap |

## Selected weekly action

Upgrade `docs/seo-support-brief-xiaohongshu-vs-wechat-sydney-2026-07-20.md` with a buyer-decision section covering cost drivers, minimum operational inputs, scope tiers, creator governance and measurement. Publication remains gated on approved Go Marketing pricing language and current attributable platform sources.

## Recovery and next trigger

Run `npm run search-console:auth`, complete Google sign-in and consent, then run doctor, a 28-day snapshot, dashboard generation and one sitemap submission. Inspect the restaurant-guide pair first and request indexing only if Google lacks the current canonical version. Wednesday should execute the authenticated queue or, if OAuth remains blocked, progress the support draft only after pricing language/source inputs are approved.
