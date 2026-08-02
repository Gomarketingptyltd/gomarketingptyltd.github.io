# SEO SERP Review — 2026-08-03

## Review context

- Run type: Monday full strategy and data review
- Search Console state: OAuth token refresh failed with `Bad Request`; latest usable 28-day window remains 2026-06-07 to 2026-07-04 and is 29 days stale.
- Method: current web-search sample for `marketing agency sydney`, `digital marketing services sydney`, `chinese marketing agency sydney`, and `chinese marketing sydney` / Xiaohongshu / WeChat intent. Results are directional and are not a neutral rank tracker.
- Copy rule: no owner-page ranking edit is justified from stale GSC data alone.

## Query-family observations

### Marketing agency Sydney — homepage owner

Go Marketing appeared in the sampled broad-agency result set with a clear bilingual-growth position. Competing results usually lead with full-service breadth, measurable-growth language, sector fit, client logos, testimonials, named process stages and quantified outcomes. The homepage should remain stable until fresh GSC shows a CTR or ownership problem. The outstanding local-citation source-of-truth approval remains the safer authority action.

### Digital marketing services Sydney — `services/digital.html`

The sampled result set was especially explicit about SEO, Google Ads/PPC, social media, website/CRO, audience type and operating process. Several competitors also expose proof blocks or outcome claims. Go Marketing's owner page already names the service mix and small-business audience; the weaker asset was its supporting guide, which contained little buyer-decision help. The selected action is therefore to improve the support article rather than repeat the owner-page service list or invent performance proof.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

Go Marketing's Chinese agency positioning remains aligned with the query family, while specialist competitors foreground platform names, Sydney audience/sector context, workflow, scope and proof. The owner page had a material edit on 2026-07-13 but still lacks a fresh comparable report. Hold it; approved client evidence would unlock the next higher-confidence proof/case action.

### Chinese marketing Sydney / Xiaohongshu / WeChat — `services/chineseCommunityGrowth.html`

Specialist results continue to separate discovery, content delivery and private follow-up roles and make platform readiness visible. Existing Go Marketing support assets already cover platform fit and a planned Xiaohongshu-versus-WeChat guide. Hold the owner page until fresh GSC clarifies query ownership; do not publish the planned comparison guide unless its documented fresh-data or approved-proof trigger is met.

## Priority decisions

| Page | Opportunity score | Decision | Monday rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Present in sampled broad-agency results; edit only on fresh near-page-one weak-CTR or ownership-regression evidence |
| `services/digital.html` | 2 | `hold` | Stale position 62.2; strengthen buyer-help support first, then reassess on a fresh report |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Prior position 23.1 with rising impressions is stale; its 2026-07-13 edit still needs a comparable post-change report |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Stale position 47.9 and no precise owner-page trigger |
| `services/support.html` | 2 | `hold` | Observation page; stale priority-query signal does not justify a change |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh upgrade signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No latest page row; retain for sitemap/URL Inspection after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 3 | `request indexing` | No latest page row; verify coverage after OAuth recovery |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 3 | `request indexing` | New internal crawl path is live; verify coverage after OAuth recovery |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual support-content improvement shipped today; submit sitemap and inspect after OAuth recovery |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Prior page-one/zero-click signal is stale; require a fresh comparable report before another snippet edit |

## Selected weekly action

Improve the bilingual digital-services support guide with a bottleneck-led service decision framework, a practical sequence, buyer questions, bilingual-market logic and contextual links to digital services, marketing automation and the Chinese agency owner. This closes a clear SERP/helpfulness gap without changing owner-page ranking copy on stale data or using unapproved proof.

## Recovery and next trigger

Run `npm run search-console:auth`, complete Google sign-in and consent, then run `node scripts/search-console.js doctor`, `node scripts/search-console.js snapshot --days=28`, `npm run seo:dashboard`, and `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`. Request indexing for the materially updated digital-services guide, then compare query ownership and page performance before Wednesday's tactical edit decision.
