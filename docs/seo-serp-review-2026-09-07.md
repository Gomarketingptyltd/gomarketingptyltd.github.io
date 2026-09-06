# SEO SERP Review — 2026-09-07

## Review context

- Run type: Monday full strategy and data review.
- Search Console state: token refresh and the required 28-day snapshot failed with `Bad Request`; the latest usable window remains 2026-06-07 to 2026-07-04 and is 64 days stale.
- Method: current web-search samples for the required query families plus the adjacent marketing-support and marketing-automation families. Results are directional and can vary by location, index and personalisation; they are not a neutral rank tracker.
- Production safety: release gate, live HTTPS/CSS/UTF-8 checks and 28 desktop/mobile renders passed. Visual report: `.seo-visual/20260906T233112Z/report.md`.

## Query-family observations

### Marketing agency Sydney — homepage owner

The sample remains dominated by agency homepages that lead with a precise Sydney audience, channel scope, named process, sector fit and quantified proof. Go Marketing's differentiated bilingual-growth role should remain stable. Change the homepage only after fresh weak-CTR or wrong-page evidence, or after approved local identity and proof inputs make a concrete credibility improvement possible.

### Digital marketing services Sydney — `services/digital.html`

Competing pages expose channel-by-channel deliverables, local coverage, commercial outcomes, reporting and engagement terms near the first screen. This does not justify copying claims or broadening Go Marketing's page from a 64-day-old report. Hold until fresh Search Console data confirms a position 4-15 CTR problem, position 16-25 rising demand, or wrong-page ownership.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

The specialist set continues to make Sydney context, platform scope, sector fit, creator activity, delivery process, pricing and case proof explicit. The historical score-4 signal is too stale for another owner-page edit. The defensible next gain is one approved evidence packet or fresh query/page confirmation; no client metric, scope promise or fee should be invented.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

Go Marketing's intended community-growth owner appeared in the current sample with aligned audience-trust, local relevance and bilingual-touchpoint intent. Ownership looks clean. Preserve the distinction between broad community strategy here and managed Xiaohongshu/WeChat delivery on the platform owner page.

### Xiaohongshu marketing Sydney — `services/xiaohongshuWeChatContentSupport.html`

Specialist results foreground setup and verification, content production, KOL/KOC or creator governance, paid activity, measurement, pricing and claimed outcomes. Go Marketing's prepared comparison-guide brief captures these buyer questions without borrowing competitor ranges. Publication remains blocked until the business approves a pricing position and deliverable boundaries.

## Adjacent commercial signals

- `marketing support services Sydney`: the sample favours flexible, embedded execution with clear task types, project delivery and human proof. Keep `services/support.html` observation-only until fresh performance data or approved evidence gives a precise trigger.
- `marketing automation Sydney`: results emphasise CRM/tool implementation, lead workflows and ongoing operational support. `services/marketingAutomationServicesSydney.html` remains an indexing-recovery action, not a stale-data copy rewrite.

## Priority decisions

| Page | Opportunity score | Decision | Rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Act on fresh weak CTR, ownership regression or approved local proof |
| `services/digital.html` | 2 | `hold` | Require a fresh comparable report before another ranking edit |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Historical rising-impression signal is stale; act on fresh confirmation or approved evidence |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Current sample shows clean community-intent ownership |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No latest page row; inspect canonical and coverage after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 4 | `request indexing` | Improved bilingual pair remains queued for authenticated inspection |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 4 | `request indexing` | Newest materially changed pair remains first in the inspection queue |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual improvements remain absent from the stale report |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Sampled intent is aligned; guide publication requires approved pricing and scope |

## Selected weekly action

Keep owner-page copy stable and refresh the executable indexing-recovery packet with live evidence. Immediately after OAuth consent, pull fresh data, submit the sitemap once, inspect the Xiaohongshu restaurant-guide pair first and request indexing only if Google lacks the current canonical or material version.

## Sampled result sources

- Go Marketing Chinese community owner: `https://gomarketing.net.au/services/chineseCommunityGrowth.html`
- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- PMGS Sydney: `https://www.pmgs.com.au/digital-marketing/sydney/`
- Techable Australia: `https://techableaustralia.com.au/`
- Deep Reach Sydney: `https://www.deepreachagency.com/locations/sydney/`
- Riseo Xiaohongshu cost guide: `https://riseo.com.au/blog/xiaohongshu-marketing-agency-sydney-cost/`
- WeChat Marketing Australia: `https://wechatmarketing.com.au/`
- GSC Marketing support services: `https://www.gscmarketing.com.au/marketing-services-sydney/`
- iChat Labs: `https://ichatlabs.com/`

## Recovery and next trigger

Run `npm run search-console:auth` and complete Google sign-in and consent. Then run `node scripts/search-console.js doctor`, `node scripts/search-console.js snapshot --days=28`, `npm run seo:dashboard`, and `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`. Inspect the restaurant-guide pair first. Wednesday should execute that indexing queue or, if approved first, draft the prepared bilingual comparison guide using the confirmed pricing position and deliverable boundaries.
