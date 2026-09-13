# SEO SERP Review — 2026-09-14

## Review context

- Run type: Monday full strategy and data review.
- Search Console state: token refresh and the required 28-day snapshot failed with `Bad Request`; the latest usable window remains 2026-06-07 to 2026-07-04 and is 71 days stale.
- Method: current web-search samples for the required query families plus the adjacent marketing-automation family. Results are directional and can vary by location, index and personalisation; they are not a neutral rank tracker.
- Production safety: release gate, live HTTPS/CSS/UTF-8 checks and 38 desktop/mobile renders passed. Visual report: `.seo-visual/20260913T233127Z/report.md`.

## Query-family observations

### Marketing agency Sydney — homepage owner

The sample is crowded with established agency homepages that put Sydney location, channel breadth, commercial outcomes, delivery model and quantified proof above the fold. Go Marketing should keep its bilingual-growth differentiation stable. A copy edit requires fresh weak-CTR or wrong-page evidence, or approved local proof that can make the offer more concrete without inventing claims.

### Digital marketing services Sydney — `services/digital.html`

Competing pages continue to lead with named channels, revenue or lead outcomes, local/suburb coverage, engagement terms and proof. The gap is evidence rather than another generic service-list rewrite. Hold until fresh Search Console data confirms a position 4-15 CTR problem, position 16-25 rising demand or wrong-page ownership.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

The specialist result set still rewards explicit platform scope, audience definition, delivery process, creator/KOL activity and credible proof. The historical score-4 signal is now too stale to support another owner-page edit. The next defensible action is fresh query/page evidence or an approved case/proof packet.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

Go Marketing's community-growth owner appeared in the current sample with the intended Sydney, Xiaohongshu, WeChat and community-trust framing. Query ownership appears aligned. Keep this page focused on community strategy and leave managed platform delivery to `services/xiaohongshuWeChatContentSupport.html`.

### Xiaohongshu marketing Sydney / WeChat marketing Australia

Go Marketing's restaurant guide appeared in the current sample, confirming public search discovery of the newest English support article. Competing WeChat pages emphasise verification, account management, content, advertising, fees and turnaround. Do not add promises without approved scope. Keep the restaurant bilingual pair in `request indexing` until authenticated URL Inspection confirms both canonicals and the current material version.

## Adjacent commercial signal

`services/marketingAutomationServicesSydney.html` also appeared in the current sample for marketing-automation intent. Competitors are explicit about tools, workflows, pricing, ownership and measurable operational outcomes. Search discovery lowers the likelihood of a basic crawl failure, but does not replace URL Inspection or justify a stale-data copy rewrite.

## Priority decisions

| Page | Opportunity score | Decision | Rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Act on fresh weak CTR, ownership regression or approved local proof |
| `services/digital.html` | 2 | `hold` | Require a fresh comparable report before another ranking edit |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Historical rising-impression signal is stale; act on fresh confirmation or approved evidence |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Current sample shows clean community-intent ownership |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | Public search discovery observed; inspect both canonicals after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 4 | `request indexing` | Improved bilingual pair remains queued for authenticated inspection |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 4 | `request indexing` | English URL is search-discovered; verify the current bilingual pair with URL Inspection |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual improvements remain absent from the stale report |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Guide publication still requires approved pricing and scope |

## Selected weekly action

Record the new public-search discovery evidence for the restaurant guide and marketing-automation page, keep owner-page copy stable, and preserve the authenticated inspection queue. Immediately after OAuth consent, pull fresh data, submit the sitemap once, inspect the restaurant-guide bilingual pair first and request indexing only if Google lacks the current canonical or material version.

## Sampled result sources

- Go Marketing Chinese community owner: `https://gomarketing.net.au/services/chineseCommunityGrowth.html`
- Go Marketing restaurant guide: `https://gomarketing.net.au/services/xiaohongshuMarketingForSydneyRestaurants.html`
- Go Marketing marketing automation: `https://gomarketing.net.au/services/marketingAutomationServicesSydney.html`
- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- Techable Australia: `https://techableaustralia.com.au/digital-marketing`
- PMGS Sydney: `https://www.pmgs.com.au/digital-marketing/sydney/`
- Orient Media: `https://orientmedia.com.au/`
- WeChat Marketing Australia: `https://wechatmarketing.com.au/`
- WebGlobals: `https://webglobals.com.au/business-automation/`

## Recovery and next trigger

Run `npm run search-console:auth` and complete Google sign-in and consent. Then run `node scripts/search-console.js doctor`, `node scripts/search-console.js snapshot --days=28`, `npm run seo:dashboard`, and `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`. Inspect the restaurant-guide pair first. Wednesday should execute the authenticated indexing queue or, if approval arrives first, add a verified case/proof packet to the Chinese-agency owner.
