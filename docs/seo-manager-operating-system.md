# Senior SEO Manager Operating System

Last updated: 2026-06-16

## Role mission

The SEO manager owns ranking growth, production safety, and execution accountability for gomarketing.net.au.

The mission is not to "check SEO". The mission is to move priority pages toward page one by making the best available decision on each review cycle, then proving the action was safe, live, and logged.

## Non-negotiable operating principles

- Protect production before ranking work. If the site has CSS, encoding, HTTPS, unsafe URL, deploy, or indexing issues, fix/report that before copy or metadata optimization.
- Use Search Console data as the primary ranking signal, but interpret it with business judgment. Clicks, impressions, CTR, average position, and query-to-page match matter together.
- One keyword family has one owner page. If two pages fight for the same query, fix ownership before adding more content.
- Prefer decisive small edits over slow vague advice. A good SEO action should change a real ranking lever: title, meta description, H1, first screen, FAQ, internal links, support content, sitemap, indexing, or cannibalisation.
- Do not publish generic content. Every article or case page must support a named owner page and a named query family.
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
   Run `npm run seo:release-gate`, `npm run seo:live-check`, and `npm run seo:visual-check` first. If a deterministic safety check fails, stop ranking edits and treat the run as a production safety incident. If the failure is clearly an environment fetch/browser blocker, record the blocker and rerun from a network-enabled environment before ranking edits.
2. Data freshness
   Run `node scripts/search-console.js doctor` and `node scripts/search-console.js snapshot --days=28`. Use the newest report and compare it to the previous report.
3. Page scoring
   Run `npm run seo:dashboard`, then score every priority page using the opportunity score below.
4. Decision
   Assign exactly one action to every priority page: `edit`, `hold`, or `request indexing`.
5. Execution
   If one or more edits are justified, ship only the highest-confidence action first unless multiple edits are tightly connected and low risk.
6. Release gate
   Before commit, run `npm run seo:release-gate` again. Inspect any changed HTML head blocks for lost CSS, canonical, hreflang, favicon, script, and structured data.
7. Deploy and live check
   Push only after checks pass. After deployment, run `npm run seo:live-check` and `npm run seo:visual-check`.
8. Logging
   Update `docs/seo-execution-log.md` with data source, decision, action, reason, validation date, safety checks, and next action.

## Weekly optimization cadence

The SEO manager runs three optimization sessions per week at 09:30 Australia/Sydney.

| Day | Run type | Required output |
| --- | --- | --- |
| Monday | Full strategy and data review | Fresh Search Console snapshot when auth works, refreshed dashboard, SERP review, priority-page scoring, and the highest-confidence weekly action |
| Wednesday | Tactical optimization sprint | One targeted ranking action if justified: snippet edit, first-screen/FAQ refinement, internal-link anchor change, indexing follow-up, or support-content improvement |
| Friday | Growth and correction pass | Validate prior changes, fix blockers, submit sitemap or request-indexing reminders, and prepare/ship the next support content or authority action |

Every run must produce one of these outputs:

- a shipped `edit`
- a shipped internal-link or support-content action
- a `request indexing` / sitemap action
- a production safety fix
- a documented blocker with the exact recovery step

Do not record a run as complete with only "checked data" unless every priority page has a decision and the next action trigger is written down.

## Ranking growth accountability

Google rankings cannot be guaranteed by command, but the manager is accountable for the control loop that gives the site the best chance to rise.

If priority rankings do not improve after two fresh comparable GSC reports:

- check whether the target query is landing on the wrong page
- compare the owner page against the current SERP
- add missing proof, examples, FAQ depth, or internal links
- create or improve a support article/case page for the owner page
- strengthen local authority signals such as Google Business Profile, directories, partner mentions, or case-study references
- document the reason the prior action did not move the metric and choose the next escalation

## Opportunity score

Use this score to decide what deserves action first.

| Factor | Score | Senior interpretation |
| --- | ---: | --- |
| Position 4-10 with CTR below 2% | 5 | Immediate SERP snippet opportunity |
| Position 11-15 with CTR below 1.5% | 5 | Fast page-one push candidate |
| Position 16-25 with impressions rising at least 15% vs previous comparable report | 4 | Intent is emerging; refine title, first screen, FAQ, or internal links |
| Position 26-40 with rising impressions and strong commercial intent | 3 | Usually needs support content or stronger internal links before page copy edits |
| Wrong page ranking for owner keyword | 5 | Cannibalisation fix has priority over new content |
| Indexed page has 0 impressions after 14 days | 3 | Check crawl path, sitemap, internal links, and content depth |
| New or updated page not submitted for indexing | 4 | Request indexing and submit sitemap |
| Any CSS, encoding, HTTPS, or unsafe URL issue | 5 | Production safety incident, not an SEO copy task |

When two pages tie, choose the page closest to revenue and closest to page one.

## Action rules

### Edit

Use `edit` when the opportunity score is 4 or 5 and the fix is clear.

Preferred edit order:

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

Use `request indexing` when a material page or support article has changed, a new article is published, or Search Console has not yet reflected a page that should be visible.

Always combine this with:

- sitemap submission when appropriate
- manual URL Inspection reminder for priority URLs
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
- Link to `docs/seo-dashboard.md`
- Priority-page table with clicks, impressions, CTR, average position, and movement
- Query-to-page ownership assessment
- Decision per page: `edit`, `hold`, or `request indexing`
- Action shipped, if any
- Commit hash and deployment status, if any
- Production safety result
- Visual check report path when screenshots are captured
- Next validation date and trigger for the next action

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
- whether the next action should be page copy, proof/case content, internal links, local citations, or no action

The current seed review is `docs/seo-serp-review-2026-06-19.md`.

## Escalation rules

Stop normal SEO work and escalate if any of these happen:

- live production loses styling or expected page structure
- live production shows mojibake, broken encoding, insecure `http://` production URLs, or non-HTTPS final URLs
- Search Console auth or snapshot generation fails
- sitemap submission fails after a material publish
- clicks drop more than 25% week over week on the same 28-day comparison basis
- a priority keyword loses more than 5 average positions and impressions are also falling
- the homepage starts absorbing multiple service-intent keyword families again

## Anti-patterns

- Do not say "monitor" without naming the next validation date and trigger.
- Do not give SEO advice that cannot become a page edit, content brief, indexing action, internal-link change, or safety fix.
- Do not publish AI-generated filler articles.
- Do not chase daily average-position noise without checking impressions and query ownership.
- Do not make broad visual changes as part of SEO.
- Do not push without release gate and live production verification.
