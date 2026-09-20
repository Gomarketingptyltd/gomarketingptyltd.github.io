# SEO SERP Review — 2026-09-21

## Review context

- Run type: Monday full strategy and data review.
- Search Console state: token refresh and the required 28-day snapshot failed with `Bad Request`; the latest usable window remains 2026-06-07 to 2026-07-04 and is 78 days stale.
- Method: current web-search samples for the five required query families. Results are directional and can vary by location, index and personalisation; they are not a neutral rank tracker.
- Production safety: release gate, live HTTPS/CSS/UTF-8 checks and 38 desktop/mobile renders passed. Visual report: `.seo-visual/20260920T233741Z/report.md`.

## Query-family observations

### Marketing agency Sydney — homepage owner

The sample remains dominated by agency homepages that combine Sydney relevance with named channels, commercial outcomes, delivery terms and quantified proof. Go Marketing's homepage appeared with its intended bilingual-growth framing and clean links into the Chinese-agency and community-growth owners. Preserve that differentiation. The next homepage edit requires fresh weak-CTR or ownership evidence, or approved local proof that can make the offer more concrete.

### Digital marketing services Sydney — `services/digital.html`

Competing service pages foreground channel scope, suburb coverage, engagement terms, audits and measurable outcomes. This reinforces an evidence gap rather than a need for another generic service-list rewrite. Hold until fresh Search Console data confirms a position 4-15 CTR issue, position 16-25 rising demand or wrong-page ownership.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

Specialist competitors now make platform coverage, local audience scope, delivery sequence, pricing bands and case outcomes unusually explicit. Go Marketing should not copy unverified competitor claims or invent pricing. The historical score-4 signal is too stale for another owner-page edit; the defensible escalation remains an approved case/proof packet or fresh query/page evidence.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

Go Marketing's homepage appeared for the broader Chinese-agency framing, while the community owner remains the intended destination for Xiaohongshu, WeChat and community-trust strategy. No sampled evidence showed a technical ownership failure. Keep the community page distinct from managed platform delivery and inspect query-to-page ownership after OAuth recovery.

### Xiaohongshu marketing Sydney / WeChat marketing Australia

Go Marketing's restaurant guide again appeared in the current sample, with the live August update and intended local hospitality scenarios. Competing pages emphasise platform-native deliverables, KOC/KOL coordination, account verification, turnaround, reporting and case proof. These are useful proof/scope requirements for the prepared comparison guide, but publication remains blocked until Go Marketing's real boundaries are approved. Keep the restaurant bilingual pair first in the authenticated inspection queue.

## Priority decisions

| Page | Opportunity score | Decision | Rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Act on fresh weak CTR, ownership regression or approved local proof |
| `services/digital.html` | 2 | `hold` | Require a fresh comparable report before another ranking edit |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Historical rising-impression signal is stale; act on fresh confirmation or approved case evidence |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Preserve distinct community-strategy ownership; verify query landing pages after OAuth recovery |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | Public discovery was previously observed; inspect both canonicals after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 3 | `request indexing` | Improved bilingual pair remains queued for authenticated inspection |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 4 | `request indexing` | English URL remains search-discovered; verify both canonicals and the current material version |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 3 | `request indexing` | Material bilingual improvements remain absent from the stale report |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Strong current intent gap, but publication requires approved pricing and delivery boundaries |

## Selected weekly action

Refresh the five-family market evidence and preserve the authenticated inspection queue. The highest-confidence growth action remains the prepared Xiaohongshu-versus-WeChat support guide, but it must not publish until pricing, deliverables, turnaround and platform-ownership boundaries are approved. Immediately after OAuth consent, pull fresh data, submit the sitemap once, inspect the restaurant-guide bilingual pair first and request indexing only where Google lacks the current canonical or material version.

## Sampled result sources

- Go Marketing homepage: `https://gomarketing.net.au/`
- Go Marketing restaurant guide: `https://gomarketing.net.au/services/xiaohongshuMarketingForSydneyRestaurants.html`
- Sydney Digital Marketer: `https://sydneydigitalmarketer.com/`
- PMGS Sydney: `https://www.pmgs.com.au/digital-marketing/sydney/`
- Techable Australia: `https://techableaustralia.com.au/digital-marketing`
- Orient Media: `https://orientmedia.com.au/`
- Riseo: `https://riseo.com.au/services/chinese-marketing-agency-sydney/`
- Deep Reach Sydney: `https://www.deepreachagency.com/locations/sydney/`
- VL Marketing RedNote: `https://vlmarketing.com.au/services/xiaohongshu-marketing-australia`
- WeChat Marketing Australia: `https://wechatmarketing.com.au/`

## Recovery and next trigger

Run `npm run search-console:auth` and complete Google sign-in and consent. Then run `node scripts/search-console.js doctor`, `node scripts/search-console.js snapshot --days=28`, `npm run seo:dashboard`, and `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`. Inspect the restaurant-guide pair first. Wednesday should execute the authenticated indexing queue or, if approval arrives first, publish the verified Xiaohongshu-versus-WeChat scope guide or add an approved case/proof packet to the Chinese-agency owner.
