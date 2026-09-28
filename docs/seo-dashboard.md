# SEO Dashboard

Updated 28 September 2026.

Business-performance figures are generated locally, not into this tracked document. Run `npm run seo:dashboard` after refreshing Search Console reports.

- Private output: `.search-console/reports/seo-dashboard.md` (Git-ignored).
- The generator compares adjacent equal-length windows. It rejects overlapping snapshots and prints the exact command needed when the previous period is missing.
- Global averages are not fixed Sydney rankings. Use Australia-filtered query/page pairs for the local audience, and retain clicks and impressions beside positions.
- A missing exported query/page row is not evidence that a page is unindexed. Use URL Inspection before requesting indexing.
- Scores suggest review priorities; they do not override recent-release hold periods, low sample sizes or the owner's confidentiality and form boundaries.
- Current manager decisions and source details are in the ignored weekly report `.search-console/reports/2026-09-28-weekly/review.md`.

See `docs/seo-manager-operating-system.md` for execution controls and `docs/seo-execution-log.md` for the public-safe work log. Do not put customer information, credentials or fresh business metrics in this document.
