# Senior SEO Manager Operating System

Last updated: 2026-10-08

## Decision and recovery protocol

Read `docs/seo-decision-and-recovery.md` before choosing the next intervention. Its evidence gates supersede historical score-to-edit shortcuts in this document and in dashboard suggestions. A dashboard `edit` label is a review candidate, not authorization or proof that an edit is needed.

Each active workstream needs a falsifiable hypothesis, comparable baseline, observed release/recrawl state, primary outcome, guardrails, next review date and a preselected fallback. Keep the detailed register and business results in ignored local reports. The current private handoff is `.search-console/reports/2026-10-08-strategy/recovery-register.md`; if it is unavailable, reconstruct the evidence rather than inventing its status.

Do not wait for a second bad monthly report to investigate a clear regression. Conversely, do not treat a small click count, low CTR, multiple ranking URLs or an unrecrawled release as proof that the content failed. A page-level hold must not freeze approved distribution, diagnosis and preparation elsewhere.

Owner priority, confirmed 2026-10-08: concentrate discretionary growth work on commercially relevant, non-brand query/page opportunities already near page one, rather than spending most effort on broad difficult terms or the largest historical decline. Use observed relevant impressions, buyer intent, service fit, current result types and effort to prioritize. A position around 8-20 is a candidate signal, not proof of low difficulty or a guaranteed first-page result. Preserve useful existing top-ten visibility and validate small samples before expanding. Keep far-ranking terms on maintenance/diagnosis unless new evidence makes them competitive opportunities; safety and factual repairs remain mandatory. Current private shortlist is in `.search-console/reports/2026-10-08-strategy/seo-ai-growth-plan.md`.

## Current owner boundaries

- Client work is not for public case studies, even anonymised. Do not publish client names, project context, screenshots, results or a disguised client story on the website or social channels. Earlier case-study briefs and proof/outreach plans are superseded by this instruction.
- Public alternatives are service process explanations and independently created, explicitly fictional demonstrations. Do not relabel confidential project material as a demonstration.
- Selected real material may be discussed privately only after the owner confirms the exact excerpt, recipient and permissions under the relevant agreement. Store any such material outside the public repository and website; `noindex` is not access control.
- Keep the existing form unchanged. Form changes and delivery tests are paused. Do not require them before continuing safe content and promotion work.
- Internal enquiry and ranking data stay in ignored local reports. Do not publish the recent enquiry as a client story, testimonial or proof of SEO attribution.
- Dashboard output is `.search-console/reports/seo-dashboard.md`, not the tracked documentation pointer. Compare adjacent equal-length final-data windows; overlapping snapshots are freshness pulses, not period-over-period growth.
- A missing performance row is not an indexing failure. Inspect the URL before asking for indexing. Do not repeat requests already queued for the same release.
- Social publishing uses a weekly owner approval gate. Setup approval is not approval of unseen future copy, assets or destinations. Keep drafts and approval records in `.search-console/reports/social-pilot-2026-09-28/`, outside the public repository.
- Use verified company accounts and official platform scheduling only. Do not expand permissions, connect accounts, change bios, buy subscriptions or boost posts without the required owner confirmation. Check the existing post queue before scheduling; verify the platform result and stop uncertain retries.
- Prefer verified outcomes to time spent. The historical mandatory one-hour session and minimum-duration guard do not apply to the current cadence. A documented hold is a valid result; do not manufacture edits or blockers to satisfy a timer.
- For the 2026-09-25 release, the full post-release window is 2026-09-26 to 2026-10-23; retrieve final data around 2026-10-26. For the 2026-09-28 title release, use 2026-09-29 to 2026-10-26 and retrieve around 2026-10-29. The 2026-10-09 pulse is an early check, not a complete 28-day outcome. Verify actual crawl dates and reporting availability before attributing results.

## Role mission

The SEO manager owns qualified-enquiry visibility, production safety, and execution accountability for gomarketing.net.au.

The mission is not to "check SEO". The mission is to move priority pages toward page one by making the best available decision on each review cycle, then proving the action was safe, live, and logged.

## Non-negotiable operating principles

- Protect production before ranking work. If the site has CSS, encoding, HTTPS, unsafe URL, deploy, or indexing issues, fix/report that before copy or metadata optimization.
- Use Search Console data as the primary ranking signal, but interpret it with business judgment. Clicks, impressions, CTR, average position, and query-to-page match matter together.
- Give each commercial intent a primary service page while preserving genuinely different guide/comparison intents. Multiple URLs for a query are a diagnostic clue, not proof of cannibalisation; establish harmful overlap before consolidation or redirects.
- Prefer evidence-backed, scoped actions. Page edits, legitimate distribution, diagnosis and measurement are all valid work. Identify the bottleneck before selecting title, body, links, indexing or off-site work; do not manufacture website edits to demonstrate activity.
- Do not publish generic content. Every article or service-process explanation must support a named owner page and a named query family. Client case pages are not permitted.
- Do not repeatedly rewrite the same page before Google has had time to recrawl and collect fresh data, unless there is a technical, indexing, or cannibalisation problem.
- Every action must leave an audit trail in `docs/seo-execution-log.md`.

## Source standards

Use these as standing references when making judgment calls:

- Google Search Essentials: `https://developers.google.com/search/docs/essentials`
- Google SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Helpful, reliable, people-first content: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Debugging Search traffic drops: `https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops`
- Search Console performance analysis: `https://developers.google.com/search/docs/monitor-debug/bubble-chart-analysis`
- Page experience and Core Web Vitals: `https://developers.google.com/search/docs/appearance/page-experience`
- AI features and Google Search: `https://developers.google.com/search/docs/appearance/ai-features`

## Senior review workflow

Every scheduled SEO manager run must follow this order.

1. Production safety
   Run `npm run seo:release-gate` and `npm run seo:live-check` for the scoped review. Verify affected desktop/mobile layouts before publishing website edits, using authorised browser tools. Do not invoke legacy browser automation scripts when tool instructions require a different browser-control surface. If a deterministic safety check fails, stop ranking edits and treat the run as a production safety incident. If it is an environment fetch/browser blocker, record it and complete independent safe work; do not call the website broken without evidence.
2. Data freshness
   Run `node scripts/search-console.js doctor` and fetch a fresh snapshot when needed. Reuse the same day's completed final-data report if its window and scope match. Fetch the immediately preceding equal-length window with explicit start/end dates before comparing. Do not compare against the last overlapping snapshot.
3. Page scoring
   Run `npm run seo:dashboard` to create the ignored local report, then score every priority page using the opportunity score below. Override automated suggestions when a recent release needs time to be crawled or the sample is too small.
4. Decision
   Assign exactly one legacy page action to every priority page: `edit`, `hold`, or `request indexing`. Also record the workstream state (`diagnose`, `prepare`, `waiting_for_recrawl`, `evaluate`, `continue`, `switch`, `rollback`, or `close`). A `hold` on page mutation can coexist with active diagnosis or approved distribution.
5. Execution
   If one or more edits are justified, ship only the highest-confidence action first unless multiple edits are tightly connected and low risk.
6. Release gate
   Before commit, run `npm run seo:release-gate` again. Inspect any changed HTML head blocks for lost CSS, canonical, hreflang, favicon, script, and structured data.
7. Deploy and live check
   Push only after appropriate checks pass. After a website deployment, verify GitHub results, live affected pages and desktop/mobile rendering with authorised browser tools. Documentation-only releases do not require a new website rewrite or a new indexing request.
8. Logging
   Update `docs/seo-execution-log.md` with data source, decision, action, reason, validation date, safety checks, and next action.

## Weekly optimization cadence

The existing SEO manager runs Monday, Wednesday and Friday at 09:30 Australia/Sydney. The schedule is unchanged; the work is bounded by useful verified outcomes, not a minimum elapsed time. Local execution requires the host and app to be available; account login may still require the owner.

| Day | Run type | Required output |
| --- | --- | --- |
| Monday | Full strategy and data review | Comparable final-data windows, Australian query/page review, priority-page decisions and the weekly buyer-focused priority |
| Wednesday | Targeted execution or hold | Verify recrawls and execute at most one justified content/internal-link action, or record the next evidence trigger |
| Friday | Verification and promotion planning | Verify changes, review available enquiry/platform signals and prepare the following week's social copy for owner review |
| Every two weeks | Blog decision | One substantial article or useful update when a distinct buyer need is established; preserve original dates and avoid filler |
| Monthly | Outcome review | Compare adjacent 28-day windows and qualified enquiries, not daily position noise or like counts alone |

Every run must produce one of these outputs:

- a shipped `edit`
- a shipped internal-link or support-content action
- a `request indexing` / sitemap action
- a production safety fix
- a documented blocker with the exact recovery step
- a reviewed promotion draft awaiting owner approval
- a documented `hold` with sufficient evidence and the next validation trigger

Do not record a run as complete with only "checked data" unless every priority page has a decision and the next action trigger is written down.

## Four-week social pilot

The initial pilot covers 28 September to 25 October 2026. Proposed cadence: two LinkedIn company posts, one Google Business Profile update and two adapted Facebook/Instagram topics weekly. These are content targets, not permission to publish unreviewed material or catch up with a burst of posts.

1. Draft copy and asset briefs from confirmed services or existing useful articles. Record the intended company account, exact destination, local proposed time and status privately.
2. Obtain the owner's approval of the exact first-week material. A visual brief is not a finished or approved image. Verify company identity and required account access separately.
3. Schedule only approved, complete material with an available official platform scheduler. Inspect the queue first, verify the confirmed date/time, and record it. Do not equate a draft, button click or proposed date with scheduled status.
4. Verify publication, record the live permalink and distinguish platform reach/clicks from organic search and qualified enquiries. Do not change the existing privacy-first Analytics setup or add misleading UTM tracking.
5. If approval or access is missing when a slot passes, mark it missed and propose a new slot. No backdating, blind retries, bulk private messages, paid promotion or automatic bio changes.
6. Review the pilot after 25 October before extending the publishing cadence. Do not automatically repeat this four-week calendar.

The owner can review the weekly batch in one short session. Keep client material out of both public channels and the public repository. Use general service education or clearly labelled independent fictional demonstrations, never an anonymised confidential project.

## Ranking growth accountability

Google rankings cannot be guaranteed by command, but the manager is accountable for the control loop that gives the site the best chance to rise.

Apply the trigger matrix in `docs/seo-decision-and-recovery.md`. Separate safety failures, missing data, stale crawling, insufficient exposure, ranking/intent loss, click-through issues, enquiry quality and AI citation issues. Investigate meaningful regressions during the next available run; do not wait for a generic two-report deadline.

Before switching a content strategy, check that it was actually deployed, retrieved by the relevant engine and exposed to enough relevant searches for the intended conclusion. If these conditions are not met, fix discovery or reallocate effort to an independent approved workstream. Never write "the change failed" solely because its calendar deadline passed.

Every hold needs a next evidence trigger and bounded review date. After two consecutive reviews without new evidence, change the diagnostic approach or complete an independent acquisition deliverable; repeating the same status is not progress. At the monthly review, explicitly choose continue, revise, switch or stop for each workstream and preserve the reason.

## Opportunity score

Use this score only to prioritize investigation. Scores do not establish causation, sample sufficiency or permission to mutate a page. CTR expectations must account for query intent, brand, device, position and result type; fixed percentages below are legacy discovery heuristics, not pass/fail targets.

| Factor | Score | Senior interpretation |
| --- | ---: | --- |
| Position 4-10 with CTR below 2% | 5 | Review actual SERP and comparable segments; low counts alone do not justify a snippet edit |
| Position 11-15 with CTR below 1.5% | 5 | Review commercial fit and available evidence; no fast page-one promise |
| Position 16-25 with impressions rising at least 15% vs previous comparable report | 4 | Check demand and query mix before choosing an intervention |
| Position 26-40 with rising impressions and strong commercial intent | 3 | Diagnose the limiting factor; do not assume another article is needed |
| Unexpected page ranking for intended service query | 5 | Check intent, canonical and overlap; no automatic merge, redirect or deletion |
| Indexed page has no exported impressions after 14 days | 3 | Check exposure, demand, reporting limits and discovery; not proof of failure |
| Important new or updated page with verified stale/missing indexing | 4 | Inspect eligibility and the request ledger; request once only if warranted, with sitemap submission only when appropriate |
| Any CSS, encoding, HTTPS, or unsafe URL issue | 5 | Production safety incident, not an SEO copy task |

When two pages tie, choose the page closest to revenue and closest to page one.

## Action rules

### Edit

Use `edit` only when a specific evidence-backed hypothesis and safe scoped fix are recorded. A score of 4 or 5 alone is not sufficient. Technical or factual defects can justify an edit regardless of the opportunity score.

Select the intervention that matches the diagnosed bottleneck, not a mandatory title-first order:

- title and meta description when position is decent but CTR is weak
- H1, first-screen copy, and FAQ when query intent is close but landing-page promise is weak
- internal links and anchor text when the right page is not receiving enough authority
- support content when the owner page needs topical reinforcement
- cannibalisation cleanup when the wrong page owns the query

### Hold

Use `hold` when fresh data is not enough, the last material edit is too recent, or the signal is flat.

Holding still requires work:

- record the checked data
- confirm safety checks passed
- set the next validation date
- name the signal that would trigger the next edit

### Request indexing

Use `request indexing` only after URL Inspection and technical checks establish that an important deployed page has a significant update newer than its last crawl, or a real indexing issue. A missing Performance row is not sufficient. Apply `docs/search-console-priority-urls.md` and skip already queued requests.

Always combine this with:

- sitemap submission when appropriate
- a verified request confirmation or a precise pending owner action, never a false success claim
- next validation date

## Content quality bar

Every new or materially edited SEO page must answer these questions before publishing:

- Who is the exact buyer or searcher?
- What commercial problem are they trying to solve?
- Why is Go Marketing a stronger answer than a generic agency?
- What proof, examples, process, or local market insight makes the page non-commodity?
- What should the visitor do next?
- Which owner page does this content support?
- Which page should not rank for this keyword family?

If these questions are not answered, the page is not ready.

## Reporting format

Every SEO manager report should include:

- Data window and source files reviewed
- Private link to `.search-console/reports/seo-dashboard.md`; the tracked documentation file is only a pointer
- Priority-page table with clicks, impressions, CTR, average position, and movement
- Query-to-page ownership assessment
- Decision per page: `edit`, `hold`, or `request indexing`
- Action shipped, if any
- Commit hash and deployment status, if any
- Production safety result
- Visual check report path when screenshots are captured
- Next validation date and trigger for the next action
- Active hypothesis, evidence confidence, selected fallback and conditions for switching
- Actual workstream outcome versus task completion; unknowns must remain unknown
- An independent acquisition action while a page waits, or the exact approval/access condition preventing it

## SERP review

Search Console is not enough by itself. Every Monday review must include a current SERP review for:

- `marketing agency sydney`
- `digital marketing services sydney`
- `chinese marketing agency sydney`
- `chinese marketing sydney`
- `xiaohongshu marketing sydney`

The SERP review should identify:

- which page types are ranking
- which trust signals competitors show
- whether directories are crowding the result
- which intent gaps Go Marketing can close
- whether the next action should be page copy, service/process explanations, internal links, accurate local citations or no action

The current seed review is `docs/seo-serp-review-2026-06-19.md`.

## Escalation rules

Stop normal SEO work and escalate if any of these happen:

- live production loses styling or expected page structure
- live production shows mojibake, broken encoding, insecure `http://` production URLs, or non-HTTPS final URLs
- Search Console auth or snapshot generation fails
- sitemap submission fails after a material publish
- clicks drop materially across adjacent equal-length final-data windows; account for the small sample before attributing a cause
- a priority keyword loses more than 5 average positions and impressions are also falling
- the homepage starts absorbing multiple service-intent keyword families again

## Anti-patterns

- Do not say "monitor" without naming the next validation date and trigger.
- Do not give SEO advice that cannot become a page edit, content brief, indexing action, internal-link change, or safety fix.
- Do not publish AI-generated filler articles.
- Do not chase daily average-position noise without checking impressions and query ownership.
- Do not make broad visual changes as part of SEO.
- Do not push without release gate and live production verification.
