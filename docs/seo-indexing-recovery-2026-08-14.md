# Search Console Indexing Recovery Queue

Prepared: 2026-08-14 (Australia/Sydney)

## Purpose

Use this queue immediately after Search Console OAuth is restored. The listed pages are already crawlable and production-safe; the blocked step is authenticated sitemap submission and URL Inspection, not a live-site defect.

## Pre-submission verification

- All eight English/Chinese URLs below returned `200` over HTTPS on 2026-08-14.
- All eight responses declared `text/html; charset=utf-8`.
- `robots.txt` allows all crawlers and declares `https://gomarketing.net.au/sitemap.xml`.
- The release gate confirmed canonical, hreflang, stylesheet, encoding and secure-URL requirements across the site.
- Each English/Chinese page pair is present in `sitemap.xml` with reciprocal hreflang entries.
- Local crawl-path audit found 16 HTML files linking to the marketing-automation slug, 7 to the Chinese-consumer guide slug, 7 to the Xiaohongshu restaurant guide slug and 6 to the digital-services guide slug.

## Priority queue

| Priority | URL pair | Reason | Recovery action | Validation trigger |
| --- | --- | --- | --- | --- |
| 1 | `/services/xiaohongshuMarketingForSydneyRestaurants.html` and `/cn/xiaohongshuMarketingForSydneyRestaurants.html` | Chinese page was materially expanded on 2026-08-12; updated content, visible date and `dateModified` are live | Submit sitemap once, inspect the Chinese URL first, request indexing if Google shows an older crawl or the material update is not indexed; inspect the English alternate for pair health | Recheck coverage and the first fresh 28-day report on 2026-08-17 or the next SEO session after OAuth recovery |
| 2 | `/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` and `/cn/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html` | Material bilingual improvement and corrected crawl signals remain absent from the stale local page report | Inspect both URLs and request indexing where the last crawl predates 2026-08-03 or the page is excluded | Recheck coverage and page/query rows after a fresh snapshot |
| 3 | `/services/howToReachChineseConsumersInSydney.html` and `/cn/howToReachChineseConsumersInSydney.html` | Improved bilingual content and reciprocal owner-page crawl paths remain absent from the stale local page report | Inspect both URLs; request indexing only if coverage or last-crawl evidence warrants it | Recheck coverage and page/query rows after a fresh snapshot |
| 4 | `/services/marketingAutomationServicesSydney.html` and `/cn/marketingAutomationServicesSydney.html` | No row in the latest local page export despite strong internal-link coverage; no recent material edit | Inspect both URLs before requesting indexing; if indexed and canonical is selected correctly, hold rather than resubmit | Escalate only if URL Inspection shows exclusion, canonical mismatch or a crawl problem |

## Exact recovery sequence

1. Run `npm run search-console:auth` and complete Google sign-in and consent.
2. Run `node scripts/search-console.js doctor`.
3. Run `node scripts/search-console.js snapshot --days=28`.
4. Run `npm run seo:dashboard`.
5. Submit `https://gomarketing.net.au/sitemap.xml` once with `npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml`.
6. Use URL Inspection in the priority order above. Do not repeatedly request indexing when Google already reports the current version indexed with the correct canonical.
7. Record inspection status, Google-selected canonical, last crawl and any request-indexing action in `docs/seo-execution-log.md`.

## Live queue revalidation — 2026-08-21

- All eight queued URLs returned `200` from their HTTPS canonical URL with `text/html; charset=utf-8`.
- Each page retained its self-referencing canonical and two stylesheet links.
- All eight URLs remain in the live sitemap. The restaurant-guide pair has `lastmod` 2026-08-17, the digital-services guide pair 2026-08-03, the Chinese-consumer guide pair 2026-07-03, and the marketing-automation pair 2026-06-11.
- The live `robots.txt` still allows crawling and declares `https://gomarketing.net.au/sitemap.xml`.
- Search Console token refresh still returns `Bad Request`, so sitemap submission and URL Inspection remain blocked. No crawl, canonical, resource or sitemap defect was found that would justify changing production pages.
- Next action remains the exact recovery sequence above. Inspect the restaurant-guide pair first because it contains the newest material change; request indexing only if Google lacks the current canonical version, then submit the sitemap once.

## Live queue revalidation — 2026-08-28

- Rechecked all eight queued URLs with cache-busted live requests. Every URL returned `200` over HTTPS with `text/html; charset=utf-8`, its expected self-referencing canonical and two stylesheet links.
- The live sitemap still contains all eight URLs. The restaurant-guide pair retains `lastmod` 2026-08-17, the digital-services guide pair 2026-08-03, the Chinese-consumer guide pair 2026-07-03 and the marketing-automation pair 2026-06-11.
- Live `robots.txt` still allows crawling and declares `https://gomarketing.net.au/sitemap.xml`.
- The current local crawl-path audit found 29 links to the marketing-automation slug, 9 to the Chinese-consumer guide slug, 9 to the Xiaohongshu restaurant guide slug and 8 to the digital-services guide slug, including bilingual alternates. Contextual owner/support-page anchors remain descriptive; no internal-link defect justifies another production edit.
- Search Console token refresh still returns `Bad Request`. Sitemap submission, current-canonical inspection and request-indexing actions remain blocked on account-holder OAuth. Run the exact recovery sequence above, inspect the restaurant-guide pair first and request indexing only where Google lacks the current material version.

## Authentication recovery check — 2026-09-02

- Production remained safe: the release gate passed across 123 HTML files and 55 bilingual pairs, the live check passed for 14 priority pages and five stylesheet URLs, and 28 desktop/mobile renders passed (`.seo-visual/20260901T233225Z/report.md`).
- `npm run search-console:auth` successfully started a localhost OAuth callback listener and generated a Google consent URL. Completing consent requires the account holder's signed-in browser session; no authorization was completed during the unattended run.
- Token refresh, the fresh 28-day snapshot and authenticated sitemap submission still fail with `Bad Request`. The dashboard therefore uses the 2026-06-07 to 2026-07-04 window, now 59 days stale.
- Keep all four bilingual pairs in `request indexing`. After consent, run the exact recovery sequence above, submit the sitemap once and inspect the restaurant-guide pair first. Do not change ranking copy or sitemap dates to work around an authentication failure.

## Escalation rule

If a URL is excluded or Google selects a different canonical, stop snippet edits and diagnose the reported coverage/canonical reason first. If all URLs are indexed correctly, use the fresh page/query export to decide `edit` or `hold`; do not infer a ranking-copy problem from the old 2026-07-04 report.
