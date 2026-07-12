# SERP Review

Date: 2026-07-13

## Purpose

Monday full-review refresh using the latest available local Search Console window (2026-06-07 to 2026-07-04), the stale-data dashboard generated on 2026-07-13, and a fresh web SERP sample. Search Console OAuth is still revoked, so this review does not treat the local report as fresh enough to justify another ranking-copy edit.

## Current competitor pattern

| Query family | Visible examples in the fresh sample | What the result set appears to reward | Implication for Go Marketing |
| --- | --- | --- | --- |
| `marketing agency sydney` / `digital marketing services sydney` | StrivMedia, Makaroni, DOM Digital Marketing, Sydney Digital Marketing, Techable Australia | Strong local wording, broad channel coverage, explicit outcomes and visible experience or client proof | Hold homepage and digital owner-page copy. The next useful asset is verifiable commercial proof, not another broad services rewrite. |
| `chinese marketing agency sydney` | Go Marketing, BE BOLDER, Deep Reach | Exact Sydney/Chinese agency relevance, bilingual or cross-market positioning, Xiaohongshu/WeChat specificity, category examples and concrete delivery detail | The owner-page snippet edit is directionally aligned but is still only local and unpublished. Push it before judging or editing again. Add a real case-study asset once evidence is approved. |
| `chinese marketing sydney` / Xiaohongshu and WeChat variants | BE BOLDER, Deep Reach and mixed educational/platform results | Platform-specific expertise, local audience context, creator/KOL/KOC language, examples and implementation detail | Hold the Chinese community page. Prepare proof that demonstrates platform and cross-channel decision logic without inventing metrics. |
| `marketing support services` / `marketing automation sydney` | Sydney Digital Marketing and mixed agency, directory and educational results | Practical scope, systems/process framing, lead follow-up outcomes and proof that implementation works | Keep the support page on hold and the automation service page in the request-indexing queue. The unpublished automation ownership cleanup must be deployed first. |

## Data-backed signals

| Signal | Interpretation | Action |
| --- | --- | --- |
| Latest usable GSC window is 2026-06-07 to 2026-07-04 and is eight days behind the dashboard generation date | Data is stale because Search Console OAuth refresh is revoked | Do not make a new ranking-copy call; restore auth and rerun the 28-day snapshot |
| Local `main` is five commits ahead of `origin/main` | The 2026-07-08 Chinese agency snippet and prior ownership work are not live | Restore GitHub credentials and push before measuring or stacking edits |
| Chinese agency page had 46 impressions, position 23.1 and +14 impressions in the last usable report | It remains the clearest score-4 page, but its selected edit is already waiting to deploy | `hold after edit`; push, submit sitemap and wait for a comparable post-deploy report |
| Marketing automation service page and three support articles still had no page row | Crawl/indexing follow-up remains justified | `request indexing`; submit sitemap after Search Console auth is restored |
| Fresh competitor pages make stronger claims through client/category experience and concrete execution detail | Go Marketing has sound positioning but no publish-ready, substantiated case-study asset | Prepare a proof-first case-study brief with evidence gates |

## Priority-page decisions

| Page | Opportunity score | Decision | Trigger / reason |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Broad owner page is stable; edit only if fresh GSC shows ownership regression or CTR loss near page one |
| `services/digital.html` | 2 | `hold` | Last usable position is 62.2; strengthen proof/authority before more owner-page copy |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Selected snippet/first-screen edit is committed locally but not deployed; push and collect post-deploy data first |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Position 47.9 without a precise copy trigger; support with evidence-led case content |
| `services/support.html` | 2 | `hold` | Priority query was position 18.8 but impressions were not rising; require a fresh comparable report |
| `services/advertising.html` | 2 | `hold` | Observation-only page without an upgrade signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No page row; submit sitemap and request inspection after auth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 3 | `request indexing` | No page row after prior internal-link reinforcement |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 3 | `request indexing` | No page row after prior improvement |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 3 | `request indexing` | No page row; keep in the sitemap/manual inspection queue |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Prior page-one/zero-click signal needs a fresh post-edit report before another snippet change |

## Highest-confidence action

Prepare `docs/seo-case-study-brief-chinese-audience-growth-2026-07-13.md`. This closes the clearest SERP gap—verifiable proof—without inventing claims or modifying recently edited ranking copy on stale data.

## Sources checked

- Go Marketing homepage: `https://gomarketing.net.au/`
- StrivMedia: `https://www.strivmedia.au/`
- Makaroni: `https://www.makaroni.com.au/`
- DOM Digital Marketing: `https://www.domdigitalmarketing.com.au/`
- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- Techable Australia: `https://www.techableaustralia.com.au/`
- BE BOLDER Chinese marketing: `https://bebolder.com.au/chinese-marketing/`
- Deep Reach Sydney: `https://www.deepreachagency.com/locations/sydney/`

