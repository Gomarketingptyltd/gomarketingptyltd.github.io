# IndexNow Release Notifications

This helper notifies participating search engines about recently changed public pages. It does not submit Google indexing requests, guarantee crawling/ranking or establish AI citations. It never modifies website pages or sends customer information.

Use the verified production checkout, after the release gate and successful deployment. Pass the full SHA immediately before the material HTML release, not an old baseline used to backfill the entire site:

```sh
npm run seo:indexnow -- --since=<full-pre-release-commit>
npm run seo:indexnow -- --since=<full-pre-release-commit> --submit
```

The first command is offline and dry-run only. Review its exact URLs before submission. The second verifies the live public key, unchanged allow-all robots policy, live sitemap, indexing directives, canonical and exact page bytes before sending one batch to the official IndexNow endpoint. It permits at most 20 changed pages and never submits drafts, brochure paths, parameters, private reports or arbitrary hosts. Deletions and redirects require separate manual review and are not submitted by this initial helper.

The root verification text file is required to be publicly accessible by the protocol. It is not a Google, hosting, email or repository credential; it cannot edit the website. No new search-engine account, OAuth scope, DNS entry, cookie or frontend JavaScript is required.

Receipts and a content-version ledger remain in ignored `.search-console/reports/indexnow/`. Keep that directory between release checkouts. One lock prevents concurrent submissions, identical content versions are held, and changed versions have a 24-hour per-URL cooldown. Failed or uncertain submissions require manual receipt review, not automatic retries. A stale lock must be investigated rather than removed while a submission may be running.

HTTP 200 means received; HTTP 202 means received with key verification pending. Neither means indexed. Re-run the dry-run to confirm unchanged content is skipped. Do not send a daily full sitemap or retry merely because search visibility has not changed. This version is an explicit release command, not a newly installed scheduler or GitHub publishing workflow.

Official sources checked 26 October 2026:
- https://www.indexnow.org/documentation
- https://www.bing.com/indexnow/getstarted
