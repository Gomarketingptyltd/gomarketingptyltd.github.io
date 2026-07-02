# Priority URLs For Manual Search Console Indexing

Google Search Console supports manual **Request indexing** inside the URL Inspection tool. For normal websites, that request is still a manual UI action, so the most practical approach is to submit the highest-value pages first and let the sitemap handle the rest.

## First priority

Submit these first:

1. `https://gomarketing.net.au/`
2. `https://gomarketing.net.au/services/`
3. `https://gomarketing.net.au/services/sydneyBilingualMarketingAgency.html`
4. `https://gomarketing.net.au/services/targetMarket.html`
5. `https://gomarketing.net.au/services/chineseCommunityGrowth.html`
6. `https://gomarketing.net.au/services/bilingualBrandContentStrategy.html`
7. `https://gomarketing.net.au/services/web.html`
8. `https://gomarketing.net.au/services/sydneyHospitalityMarketing.html`
9. `https://gomarketing.net.au/services/sydneyPropertyMarketing.html`
10. `https://gomarketing.net.au/services/sydneyHealthWellnessDentalMarketing.html`
11. `https://gomarketing.net.au/services/insights.html`
12. `https://gomarketing.net.au/services/marketingAutomationServicesSydney.html`
13. `https://gomarketing.net.au/services/support.html`
14. `https://gomarketing.net.au/services/advertising.html`
15. `https://gomarketing.net.au/services/digital.html`

## 2026-07-01 tactical recovery shortlist

Status: completed on 2026-07-02 after Search Console authorization was restored, the sitemap was submitted, and the user manually requested indexing in URL Inspection.

Search Console authorization was blocked by an expired or revoked token on 2026-07-01. After running `npm run search-console:auth`, use this shortlist before making another page-copy edit if any of these URLs again lose page rows or show a fresh crawl/indexing issue:

1. `https://gomarketing.net.au/services/sydneyBilingualMarketingAgency.html`
2. `https://gomarketing.net.au/cn/sydneyBilingualMarketingAgency.html`
3. `https://gomarketing.net.au/services/marketingAutomationServicesSydney.html`
4. `https://gomarketing.net.au/services/howToReachChineseConsumersInSydney.html`
5. `https://gomarketing.net.au/services/xiaohongshuMarketingForSydneyRestaurants.html`
6. `https://gomarketing.net.au/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html`

Recovery sequence:

1. Run `npm run search-console:auth` - completed 2026-07-02
2. Run `node scripts/search-console.js doctor` - completed 2026-07-02
3. Run `node scripts/search-console.js snapshot --days=28` - completed 2026-07-02
4. Run `npm run seo:dashboard` - completed 2026-07-02
5. Submit `https://gomarketing.net.au/sitemap.xml` - completed 2026-07-02
6. Use URL Inspection and request indexing for the shortlist above - completed by user 2026-07-02

## Monday quick-run shortlist

If you only want the shortest useful weekly pass, submit these first on Mondays after major updates:

1. `https://gomarketing.net.au/`
2. `https://gomarketing.net.au/services/sydneyBilingualMarketingAgency.html`
3. `https://gomarketing.net.au/services/support.html`
4. `https://gomarketing.net.au/services/advertising.html`
5. `https://gomarketing.net.au/services/digital.html`
6. `https://gomarketing.net.au/services/targetMarket.html`
7. `https://gomarketing.net.au/services/marketingAutomationServicesSydney.html`

## Second priority

Then submit the two newest search-supporting articles:

1. `https://gomarketing.net.au/services/chineseMarketingAgencyVsBilingualMarketingAgencySydney.html`
2. `https://gomarketing.net.au/services/chineseEnglishWebsiteMessagingSydney.html`

## Third priority

Then submit the Chinese equivalents:

1. `https://gomarketing.net.au/cn/`
2. `https://gomarketing.net.au/cn/sydneyBilingualMarketingAgency.html`
3. `https://gomarketing.net.au/cn/targetMarket.html`
4. `https://gomarketing.net.au/cn/chineseCommunityGrowth.html`
5. `https://gomarketing.net.au/cn/bilingualBrandContentStrategy.html`
6. `https://gomarketing.net.au/cn/web.html`
7. `https://gomarketing.net.au/cn/insights.html`
8. `https://gomarketing.net.au/cn/marketingAutomationServicesSydney.html`
9. `https://gomarketing.net.au/cn/support.html`

## Fourth priority

Then submit the Chinese versions of the newest supporting articles:

1. `https://gomarketing.net.au/cn/chineseMarketingAgencyVsBilingualMarketingAgencySydney.html`
2. `https://gomarketing.net.au/cn/chineseEnglishWebsiteMessagingSydney.html`

## How to use this list

In Search Console:

1. Open the property `sc-domain:gomarketing.net.au`
2. Paste one full URL into the top inspection bar
3. Wait for the inspection result
4. Click **Request indexing**
5. Repeat for the next URL in the list

## Notes

- Use this list when a page is newly published, significantly rewritten, or strategically important.
- For bulk discovery, your submitted sitemap should stay as the main source of URL discovery.
- If Google says a page is already indexed, you do not need to request indexing again unless the page changed materially.
- Google notes that indexing can take up to a week or two, there is a daily limit, and sitemap submission remains the best path for many updated pages.
