# SEO SERP Review — 2026-08-10

## Review context

- Run type: Monday full strategy and data review
- Search Console state: OAuth token refresh failed with `Bad Request`; latest usable 28-day window remains 2026-06-07 to 2026-07-04 and is 36 days stale.
- Method: current web-search samples for `marketing agency sydney`, `digital marketing services sydney`, `chinese marketing agency sydney`, `chinese marketing sydney`, and `xiaohongshu marketing sydney`. Results are directional, personalised-location effects are possible, and this is not a neutral rank tracker.
- Safety state: the release gate and live HTTPS/CSS checks passed. The browser visual check stalled during navigation, so ranking-copy edits are paused until a fresh visual report is captured.

## Query-family observations

### Marketing agency Sydney — homepage owner

The broad Sydney result set remains crowded with agencies that foreground named services, a short operating process, sector fit, reviews and quantified outcomes. Go Marketing's bilingual-growth positioning is differentiated, but its next defensible gain is approved evidence and consistent local identity rather than broader homepage copy. Hold the homepage until fresh GSC identifies a CTR or ownership problem; the local citation correction pack remains waiting on approved source-of-truth fields.

### Digital marketing services Sydney — `services/digital.html`

Competitors continue to expose SEO, Google Ads/PPC, social media, web/CRO and a clear delivery sequence, often with client-specific outcome blocks. Go Marketing's owner page and recently improved buyer guide already cover service selection and sequencing. Do not duplicate competitor claims or rewrite the owner page from stale position data. The next trigger is a fresh comparable report showing near-page-one weak CTR, rising position 16-25 visibility, or wrong-page ownership.

### Chinese marketing agency Sydney — `services/sydneyBilingualMarketingAgency.html`

Specialist results increasingly make platform scope, local Sydney context, sectors, process and proof visible together. Go Marketing already covers platform roles and buyer fit, but its evidence intake is still empty. The highest-confidence action is to convert the current SERP proof gap into a tightly scoped evidence request so one real project can unlock a case page without invented claims.

### Chinese marketing Sydney — `services/chineseCommunityGrowth.html`

Results overlap with Chinese social-media specialists and directory-style discovery. Competitors describe content production, creator/KOL/KOC access, local lead paths and channel-specific delivery. Go Marketing should retain its broader community-growth owner and avoid forcing platform-service detail onto this page. A verified case should support this page through internal links while keeping `xiaohongshuWeChatContentSupport.html` as the platform-service owner.

### Xiaohongshu marketing Sydney — `services/xiaohongshuWeChatContentSupport.html`

Go Marketing appeared in the sampled results alongside specialist agencies. Strong competitors show concrete platform deliverables, process, sector examples, pricing or verified project outcomes. The Go Marketing result already has clean query alignment and a clear Xiaohongshu/WeChat/website role split. Hold its title, H1 and first-screen copy; the next escalation is approved proof, not another unsupported snippet edit.

## Priority decisions

| Page | Opportunity score | Decision | Monday rationale / next trigger |
| --- | ---: | --- | --- |
| `index.html` | 2 | `hold` | Broad result positioning is differentiated; edit only on fresh near-page-one weak CTR or ownership regression |
| `services/digital.html` | 2 | `hold` | Stale position 62.2; recent support improvements need a fresh comparable report |
| `services/sydneyBilingualMarketingAgency.html` | 4 | `hold` | Prior rising-impression signal is stale and a current visual report is blocked; approved case evidence is the next safe escalation |
| `services/chineseCommunityGrowth.html` | 2 | `hold` | Stale position 47.9; keep broader community intent separate from the platform-service owner |
| `services/support.html` | 2 | `hold` | Observation page without a fresh actionable signal |
| `services/advertising.html` | 2 | `hold` | Observation page without a fresh upgrade signal |
| `services/marketingAutomationServicesSydney.html` | 3 | `request indexing` | No latest page row; submit/inspect after OAuth recovery |
| `services/howToReachChineseConsumersInSydney.html` | 4 | `request indexing` | Improved content and owner-page crawl paths are live; submit/inspect after OAuth recovery |
| `services/xiaohongshuMarketingForSydneyRestaurants.html` | 3 | `request indexing` | Relevant crawl paths are live; verify coverage after OAuth recovery |
| `services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | 4 | `request indexing` | Material bilingual improvement remains queued for post-auth inspection |
| `services/xiaohongshuWeChatContentSupport.html` | 5 | `hold` | Current result has clean query alignment; require fresh CTR data or approved proof before editing |

## Selected weekly action

Add a SERP-prioritised evidence packet to the existing Chinese-audience case-study intake. This turns the clearest competitive gap—verifiable Sydney sector context, channel roles, before/after evidence and buyer-relevant outcomes—into an exact collection task without publishing generic copy or unsupported performance claims.

## Recovery and next trigger

1. Run `npm run search-console:auth`, complete Google sign-in and consent, then run `node scripts/search-console.js doctor`, `node scripts/search-console.js snapshot --days=28`, `npm run seo:dashboard`, and `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`.
2. Rerun `npm run seo:visual-check` from a browser/network environment that can finish navigation and require a new timestamped report before ranking-copy edits.
3. Have the internal project owner complete one Priority A evidence packet in `docs/seo-case-study-evidence-intake-chinese-audience-growth-2026-07-15.md`; draft the bilingual case-page pair only after it is marked `approved to draft`.
