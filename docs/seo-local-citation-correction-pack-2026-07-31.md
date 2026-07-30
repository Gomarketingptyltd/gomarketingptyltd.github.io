# Local Citation Correction Pack

Date: 2026-07-31
Owner page supported: `https://gomarketing.net.au/`
Query family supported: `marketing agency sydney`
Status: ready for business-owner confirmation; do not submit corrections until the source-of-truth fields below are approved

## Why this is the Friday growth action

Fresh Search Console data is unavailable because OAuth token refresh returns `Bad Request`. The latest local performance window ends 2026-07-04, so ranking-copy changes are not justified. A current branded/citation review instead found conflicting address, phone and industry signals across the website and third-party profiles. Resolving these identity inconsistencies is a safer local-authority action than rewriting an owner page on stale data.

## Evidence captured on 2026-07-31

| Source | Current public signal | Risk / interpretation | Required action after approval |
| --- | --- | --- | --- |
| Go Marketing homepage | `Suite 201, 276 Pitt Street, NSW 2000`; `02 9909 6785`; `info@gomarketing.net.au` | Treat as the likely customer-facing source, but the business owner must confirm it | Approve or correct the canonical customer-facing address and phone |
| Indexed `/cn/index.html` result | `Level 35, International Tower One, 100 Barangaroo Ave, Barangaroo NSW 2000`; `02 9127 9857` | Conflicts with the current homepage and can confuse customers/search engines | After confirmation, align the live Chinese contact details and request recrawl; do not change before approval |
| Australian Business Register, ABN 35 657 068 721 | Active entity; main business location `NSW 2037` | Postcode-only legal signal may legitimately differ from the customer-facing location | Confirm the role of the registered/principal address; update only through the proper legal channel if actually outdated |
| Dun & Bradstreet | `UNIT 101 170 ROSS STREET, FOREST LODGE NSW 2037`; industry shown as lawn/garden retail | Address and industry conflict with the site's current marketing-agency positioning | Claim/correct the profile with approved legal/contact details and an accurate marketing-services classification |
| Birdeye | Barangaroo address | Conflicts with the current homepage | Claim the profile, align approved NAP and ensure the website target uses HTTPS |
| Sydney Today | Barangaroo address and promotional listing | Conflicts with the current homepage; claims also need an approval check | Confirm ownership, then update NAP, HTTPS URL and evidence-safe description |

Evidence URLs:

- Australian Business Register: `https://abr.business.gov.au/ABN/View?id=35657068721`
- Dun & Bradstreet: `https://www.dnb.com/business-directory/company-profiles.go_marketing_pty_ltd.5291322cb401dddf60ab65a63790f81d.html`
- Birdeye: `https://reviews.birdeye.com/go-marketing-pty-ltd-171652776095640`
- Sydney Today: `https://www.sydneytoday.com/print1124517855095001`

## Owner confirmation — one response unlocks the corrections

Complete these fields before any website or profile mutation:

- Approved public business name:
- Approved customer-facing street address:
- Is that address staffed/eligible to be shown publicly? `yes / no`
- Approved customer-facing phone:
- Approved website URL: `https://gomarketing.net.au/` or correction:
- Registered/principal address role and whether ABR needs an update:
- Approved primary category: `Marketing agency` or correction:
- Profiles the business can access: `D&B / Birdeye / Sydney Today / Google Business Profile / other`
- Approved by:
- Approval date:

## Correction sequence

1. Confirm the source-of-truth fields above. Do not force the legal and customer-facing addresses to match when they have legitimate different roles.
2. Audit the English and Chinese live contact/footer pages and align only the approved customer-facing details.
3. Run `npm run seo:release-gate`, inspect changed head/resource blocks, deploy, then run `npm run seo:live-check` and `npm run seo:visual-check`.
4. Correct the owned Google Business Profile first, then D&B, Birdeye and Sydney Today using the same approved public details and HTTPS homepage URL.
5. Record each submission date, account owner, provider ticket and expected processing time below.
6. Recheck the live profiles after provider processing. Save the final URL and verification date; do not count a submitted change as corrected until it is public.

## Submission tracker

| Profile / asset | Owner | Submitted | Ticket / evidence | Live verification | Status |
| --- | --- | --- | --- | --- | --- |
| English website contact details |  |  |  |  | waiting for approval |
| Chinese website contact details |  |  |  |  | waiting for approval |
| Google Business Profile |  |  |  |  | access not confirmed |
| Dun & Bradstreet |  |  |  |  | access not confirmed |
| Birdeye |  |  |  |  | access not confirmed |
| Sydney Today |  |  |  |  | access not confirmed |

## Completion and next trigger

- `execute`: the source-of-truth block is completed and approved.
- `verify`: a provider reports that a correction is live.
- `escalate`: a provider rejects the correction; preserve its reason and required evidence before resubmitting.
- `measure`: Search Console authorization is restored and two comparable reports can test branded/local discovery after correction.
