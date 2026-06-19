# Production Incident: Stylesheet Links Removed From Site HTML

Incident date: 2026-06-11
Site: `https://gomarketing.net.au/`
Severity: Critical production incident
Status: Fixed and monitored

## Summary

The live site rendered as unstyled HTML because stylesheet links were missing from normal HTML pages. The content was still present, but the browser did not load the CSS files that define the site's layout, typography, spacing, and visual structure.

This happened during SEO-related HTML updates. SEO work changed page head metadata and page structure without a hard release gate that verified visual stylesheet links were still present.

## Root Cause

The earliest confirmed commit that removed the homepage stylesheet block was:

- `46ed4e5` on 2026-05-25 23:34:33 +1000
- Commit message: `Localize remote assets for China-friendly delivery`

Later SEO commits continued from that broken baseline and pushed the missing stylesheet state forward.

## Impact

- The homepage and many service/content pages loaded without site styling.
- The issue damaged the public presentation of the website.
- SEO checks did not catch the issue at the time because the previous checks focused on metadata, links, H1s, sitemap, hreflang, structured data, and local targets, but did not require a stylesheet link on indexable pages.

## Fix

The production fix was shipped in:

- `741b053` on 2026-06-11 23:43:06 +1000
- Commit message: `fix: restore site stylesheet links`

The fix restored stylesheet/font/favicon blocks across the affected normal HTML pages and added a stylesheet guard to `scripts/seo-check.js`.

Live verification completed after deployment:

- `https://gomarketing.net.au/` includes `css/style.css`
- `https://gomarketing.net.au/cn/` includes `../css/style.css`
- `https://gomarketing.net.au/services/digital.html` includes `css/index.css`
- `https://gomarketing.net.au/services/chineseCommunityGrowth.html` includes `css/index.css`
- `https://gomarketing.net.au/services/howToReachChineseConsumersInSydney.html` includes `./css/advertise.css`

## Permanent Corrective Actions

These rules are mandatory for every future SEO or HTML change.

1. Treat SEO HTML edits as production releases, not copy-only changes.
2. Run `npm run seo:release-gate` before committing or pushing any SEO, HTML, metadata, sitemap, or page-generation change.
3. Do not publish if any indexable page is missing a `<link rel="stylesheet">`.
4. Do not remove CSS/font/favicon head blocks while changing SEO metadata.
5. After pushing to `main`, run `npm run seo:live-check` and verify priority pages are loading stylesheet links from production.
6. When HTML, head, stylesheet, script, layout, or safety rules change, run `npm run seo:visual-check` and inspect the generated screenshot report before treating the release as safe.
7. Record material SEO actions in `docs/seo-execution-log.md`.
8. If a future automated script rewrites HTML head content, it must preserve existing resource links unless the change is explicitly reviewed as a visual/frontend change.
9. Before and after every commit/push, verify priority pages do not contain mojibake, broken encoding markers, insecure `http://` production URLs, or non-HTTPS production assets.

## Release Blockers

Any of the following must block release:

- `npm run seo:release-gate` fails.
- a normal indexable HTML page has no stylesheet link.
- a priority production URL has no stylesheet link after deployment.
- a CSS asset referenced by a priority production URL returns a non-2xx HTTP status.
- a page-generation script changes `<head>` resource links while the intended task is SEO metadata only.
- an indexable page contains mojibake, broken encoding markers, or an insecure `http://` production URL.
- a priority production page or stylesheet resolves to a non-HTTPS final URL.

## Owner Note

This incident is recorded so it is not treated as a one-off memory. It is part of the Go Marketing SEO operating system and must be checked before future ranking work continues.
