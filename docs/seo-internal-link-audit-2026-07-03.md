# SEO Internal-Link Audit

Date: 2026-07-03

## Scope

This audit covers the Friday growth/correction pass after the 2026-07-02 manual URL Inspection requests. It focuses on priority owner pages, support articles and crawl paths that can be improved without a broad rewrite.

## Data Context

- Latest available GSC window: 2026-06-02 to 2026-06-29
- Dashboard: `docs/seo-dashboard.md`
- SERP context: `docs/seo-serp-review-2026-06-29.md`
- Production status before audit: `npm run seo:release-gate`, `npm run seo:live-check` and `npm run seo:visual-check` passed
- Deploy status: local commits exist, but `git push origin main` is blocked by missing GitHub credentials in this environment

## Priority Cluster Findings

| Page | Current link support | Audit decision | Next action trigger |
| --- | --- | --- | --- |
| `index.html` | Links to digital, Chinese agency, Chinese community growth, support and automation owner pages | Hold | Do not add more Chinese-agency phrasing until post-2026-06-29 cannibalisation data is visible |
| `services/digital.html` | Links to Chinese agency, Chinese community growth, support, automation and digital support article | Hold | If digital queries rise into positions 16-25, refine first-screen/service proof before adding more links |
| `services/sydneyBilingualMarketingAgency.html` | Links to digital, Chinese community growth and support | Hold after edit | If owner page remains behind homepage for `chinese marketing agency sydney`, add another exact contextual support link from a relevant article, not the homepage |
| `services/chineseCommunityGrowth.html` | Links to Chinese agency, digital, support, Xiaohongshu/WeChat support and Chinese-consumer support articles | Hold | If `chinese marketing sydney` remains around position 18 with 0 clicks, test a snippet/FAQ edit before adding more internal links |
| `services/howToReachChineseConsumersInSydney.html` | Now has body links to Chinese agency and Chinese community growth plus related-service cards | Edit shipped | Validate whether it gains a GSC page row after sitemap submission and recrawl |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | Links to Chinese community growth, Chinese agency and digital pages | Hold after request indexing | If no page row appears by the next fresh report, check crawl/indexing before another content edit |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | Links to digital, Chinese agency and web/support paths | Hold after request indexing | If no page row appears, add one contextual link from `services/digital.html` or `services/support.html` only if the anchor can be natural |
| `services/xiaohongshuWeChatContentSupport.html` | Links to Chinese community growth, but not directly to Chinese agency | Hold after edit | If page-one average position persists with 0 clicks after the 2026-07-02 snippet edit, add a short agency-fit handoff to `services/sydneyBilingualMarketingAgency.html` |
| `services/marketingAutomationServicesSydney.html` | Linked from homepage, digital and support pages | Hold after request indexing | If still no page row after indexing, strengthen one contextual link from the digital small-business support article |

## Recommended Backlog

1. Push and deploy local commits once GitHub credentials are restored.
2. Submit `https://gomarketing.net.au/sitemap.xml` after the support-article update is deployed.
3. On 2026-07-06, compare the next GSC report against `.search-console/reports/2026-06-02_to_2026-06-29`.
4. If `services/xiaohongshuWeChatContentSupport.html` still averages page one with 0 clicks, add one agency-fit body paragraph linking to `services/sydneyBilingualMarketingAgency.html`.
5. If the June support articles still have no page rows, check crawl/index status before adding more content.
6. If `chinese marketing agency sydney` still lands mostly on the homepage after fresh data reflects the 2026-06-29 and 2026-07-02 edits, prioritize query-page ownership cleanup over new support content.
