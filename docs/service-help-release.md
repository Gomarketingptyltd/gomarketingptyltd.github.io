# Service Help and Shareable Brochure

Release scope: 6 October 2026.

## Subsequent Website Integration, 6 October 2026

The owner subsequently approved integrating the public-safe brochure content into the main website. The existing indexed pages `/services/xiaohongshuWeChatContentSupport.html` and `/cn/xiaohongshuWeChatContentSupport.html` remain the primary service URLs; do not create another competing landing page or mark these service pages noindex.

- Both homepages now introduce account management and company-channel promotion, linking to the language-matched service page. The service overview and community-growth pages use concrete descriptions of those routes.
- Service pages retain the shared site navigation/footer, show four expandable service families, and provide seven visible FAQs mirrored in structured data. Quotes link to the existing homepage form or official WhatsApp, without sending any message automatically.
- Approved stock photos from the brochure illustrate the same service on home, service and brochure pages. They are not case studies. Confidential examples, price lists, original brochures, audience-size claims, numerical outcome promises and unconfirmed refund percentages remain excluded.
- The shareable brochure URL remains available and noindex; it now links back to both service languages. Its original exclusions still apply. The standalone help tool is unchanged.
- `css/xhs-services.css` is loaded only by the two homepages and two service pages and is scoped to `.xhs-home`/`.xhs-page` descendants. Shared styles, menu/enquiry/analytics scripts and forms are unchanged. Only the two service descriptions/FAQ metadata and eight actually changed sitemap dates are refreshed.
- The checks below describe the earlier standalone release. Integration verification: 101 tests, 125 HTML files, 55 bilingual pairs, 40 browser renders at five desktop/mobile widths, and both home-to-service-to-form journeys. No test enquiry is submitted. Evidence remains under ignored `.seo-visual/xhs-integration-20261006/`; production verification follows deployment separately.

## Public Routes

- `/help/?lang=en` and `/help/?lang=zh`: the same standalone, bilingual FAQ. These links are in the corresponding homepage footers.
- `/brochure/xiaohongshu/`: a shareable service brochure. It is not in the main navigation or sitemap.

Both pages request `noindex,nofollow,noarchive`. This is not authentication or a confidentiality guarantee: anyone with a link can read or forward the public content. Prices, customer cases, protected screenshots and source documents are excluded entirely, not merely hidden with CSS.

## Boundaries

- Existing forms, submission provider, analytics, homepage scripts, stylesheets, SEO metadata, article dates and sitemap are unchanged.
- The FAQ uses 30 reviewed English/Chinese answers. It is not an AI model or live support inbox. Unknown requests are directed to the team.
- Search runs in the browser. No search history, transcript storage, external inference, telemetry or prefilled contact messages are added. Opening WhatsApp, email or phone uses that service separately.
- Everyday: three posts over three months, five over five months; total quantities, not monthly allowances.
- Included basic reports apply to promotion on the company channel, normally around two weeks after publication. Reporting for a client's managed account is scoped separately.
- Management allows up to three revision rounds per post within the agreed brief. Client delays are coordinated without automatically reducing monthly fees; silence is not publication approval.
- Premium includes paid platform advertising. Public pages defer numeric targets, metric definition, assessment window and shortfall arrangements to written agreement. No unconfirmed refund percentage is published.
- Private example discussions still require the relevant agreement and permission. No publicly displayed client work is part of this release.

## File Allowlist

`help/` contains only `index.html`, `help.css`, `help.js`, `faq-data.js`, `search.js` and `logo.jpeg`.

`brochure/xiaohongshu/` contains only `index.html`, `brochure-v2.css` and four assets: `assets/logo.jpeg`, `assets/restaurant.jpg`, `assets/planning.jpg`, `assets/cafe.jpg`.

Never upload the source brochure folder, consultation-assistant server, review pack, reports, OAuth files or customer materials as part of a site release.

## Verification and Rollback

- `npm run seo:release-gate`: 86 tests, 125 HTML files and 55 bilingual page pairs at preparation time.
- Local Chrome: FAQ interactions and both languages at 320, 390, 768, 1024 and 1440 pixels; no-script contact fallback; brochure imagery, anchors and aligned offer rows at the same widths.
- Homepage comparison against pre-release commit `60be15c`: only one footer link added per language, with form markup byte-for-byte unchanged.
- After deployment, verify both new routes, every allowlisted asset, FAQ language and contact behaviour, original homepages and the GitHub checks. Local tests alone do not establish deployment success.
- To roll back, revert only the release commit after reviewing newer changes. Do not reset the worktree or touch unrelated work. Re-run the release gate and live checks after rollback.

Social drafts and account settings are not included in this website release.
