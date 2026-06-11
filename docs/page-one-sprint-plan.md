# Page-1 SEO Compression Plan

Last updated: 2026-06-11

## Mission

- Replace conservative rolling edits with a compressed ranking sprint.
- Finish the main structural SEO work inside 10 days, then validate before making another major direction change.
- Use one owner page per keyword family so Google is not asked to guess between overlapping pages.

## Current baseline

Data window: 2026-05-12 to 2026-06-08

- Site clicks: 20
- Site impressions: 2,017
- Site CTR: 0.99%
- Site average position: 30.58

Primary pages:

- Homepage `/`: 14 clicks, 492 impressions, CTR 2.85%, position 12.8
- `services/digital.html`: 0 clicks, 128 impressions, CTR 0.00%, position 14.5
- `services/chineseCommunityGrowth.html`: 1 click, 250 impressions, CTR 0.40%, position 20.3
- `services/sydneyBilingualMarketingAgency.html`: no material visibility yet in the latest export

Hold pages:

- `services/support.html`: 1 click, 562 impressions, CTR 0.18%, position 27.0
- `services/advertising.html`: 0 clicks, 182 impressions, CTR 0.00%, position 37.1

Important context:

- The previous material page publish happened on 2026-06-02.
- The compressed strategy began on 2026-06-08.
- The two-week page-one push began on 2026-06-11.
- Do not judge the 2026-06-11 page-one push until Search Console has at least one fresh post-publish window.

## Keyword ownership map

Each keyword family has one owner page only.

| Owner page | Primary keyword family | Supporting keyword family | Page job |
| --- | --- | --- | --- |
| Homepage `/` | `marketing agency sydney` | `digital marketing agency sydney`, `multicultural marketing agency` | Brand trust and main entry point |
| `services/digital.html` | `digital marketing services sydney` | `seo`, `google ads`, `social media marketing sydney` | Sydney digital services page |
| `services/sydneyBilingualMarketingAgency.html` | `chinese marketing agency sydney` | `bilingual marketing agency sydney`, `chinese digital marketing agency` | Chinese-market agency positioning page |
| `services/chineseCommunityGrowth.html` | `chinese marketing sydney` | `xiaohongshu marketing sydney`, `wechat marketing australia` | Chinese-community growth page |

Rules:

- A keyword family can have only one owner page.
- The homepage can mention the service themes, but it must not try to become the main ranking page for all of them.
- `support.html` and `advertising.html` are not active rewrite targets during this sprint.
- Two-week exception: from 2026-06-11 to 2026-06-25, the homepage may carry `Chinese & Multicultural Marketing Agency Sydney` because GSC already showed page-one positions for `chinese marketing agency sydney` and `chinese marketing sydney` from the homepage. The tactical goal is to capture page-one demand fastest while strengthening exact-match internal links to `services/sydneyBilingualMarketingAgency.html`.

## Active and inactive pages

Active ranking pages:

1. Homepage `/`
2. `services/digital.html`
3. `services/sydneyBilingualMarketingAgency.html`
4. `services/chineseCommunityGrowth.html`

Observation-only pages:

1. `services/support.html`
2. `services/advertising.html`

Indexing and support pages:

1. `services/marketingAutomationServicesSydney.html`
2. `services/targetMarket.html`
3. sector pages and support insights that can pass internal-link relevance

## Compression timeline

### Phase 1: 10-day rebuild

Window: 2026-06-08 to 2026-06-17

1. 2026-06-08
   Freeze keyword ownership and page responsibilities.
2. 2026-06-08 to 2026-06-09
   Rebuild `services/digital.html` around `digital marketing services sydney`.
3. 2026-06-11 to 2026-06-12
   Rebuild `services/sydneyBilingualMarketingAgency.html` around `chinese marketing agency sydney`.
4. 2026-06-13
   Rebuild `services/chineseCommunityGrowth.html` around `chinese marketing sydney`, `xiaohongshu marketing sydney`, and `wechat marketing australia`.
5. 2026-06-14
   Make a homepage internal-link and anchor-text pass. The homepage should clearly link to:
   - `Digital Marketing Services Sydney`
   - `Chinese Marketing Agency Sydney`
   - `Chinese Community Growth`
6. 2026-06-15 to 2026-06-17
   Publish 3 supporting articles:
   - `How to Reach Chinese Consumers in Sydney`
   - `Xiaohongshu Marketing for Sydney Restaurants`
   - `Digital Marketing Services Sydney: What Small Businesses Actually Need`

### Phase 2: high-frequency validation

Window: 2026-06-18 to 2026-07-07

- Do a technical and data pulse every 2-3 days during the first two weeks after a material publish.
- Do not run another full page rewrite within 14 days of its last material edit unless there is a technical issue or clear cannibalisation.
- Allow a smaller title, meta, first-screen, FAQ, or internal-link edit after 7-10 days if data clearly shows weak CTR, query mismatch, or the wrong owner page taking a keyword family.
- Use high-frequency checks to judge:
  - impressions
  - clicks
  - CTR
  - average position
  - query-to-page match
- Use these checkpoints after the 2026-06-08 publish:
  - 2026-06-10
  - 2026-06-12
  - 2026-06-15
  - 2026-06-17
  - 2026-06-19
  - 2026-06-22
  - 2026-06-29
  - 2026-07-06

### Phase 3: 60-day acceleration

Window: 2026-07-08 to 2026-08-06

- Publish 2 support articles per week.
- Add case-study pages with direct commercial relevance.
- Strengthen Google Business Profile and local brand citations.
- Keep pushing only the pages that show clean query ownership and improving visibility.

## Build standard for every active page

Before an active page is published, it must have:

- a working stylesheet link preserved from the site design system
- one keyword family owner
- a unique title with the main keyword and a clear differentiator
- a unique meta description with a real click reason
- one clear H1
- first-screen copy that explains audience, offer, and market context quickly
- H2 sections that match search intent instead of generic agency filler
- FAQ items that answer real objections
- clear internal links in and out
- a clear CTA

If one of these is missing, the page is not ready for publish.

## Production safety gate

SEO changes are production releases. No SEO, HTML, metadata, sitemap, internal-link, or page-generation change can be pushed unless the release gate passes.

Required before commit or push:

- Run `npm run seo:release-gate`.
- Confirm normal indexable pages still include `<link rel="stylesheet">`.
- Confirm SEO metadata edits did not remove CSS, font, favicon, script, canonical, hreflang, or structured-data blocks.
- For high-priority pages, inspect the `<head>` diff before publishing.

Required after push to `main`:

- Run `npm run seo:live-check`.
- Verify production homepage, Chinese homepage, active owner pages, and newest support articles include stylesheet links.
- If production does not show the expected stylesheet links after deployment, stop SEO work and fix production first.

Critical incident reference:

- `docs/production-incident-2026-06-11-stylesheet-removal.md`

## Decision rules

Use only these actions in reviews: `edit`, `hold`, `request indexing`.

### `edit`

Use `edit` when any of these are true:

- the owner page sits in positions 8-15 and CTR is weak
- the owner page sits in positions 15-25 and impressions are rising
- the wrong page is collecting the intended query family

Preferred edit scope:

- title
- meta description
- first-screen copy
- headings
- first two FAQ items
- internal-link anchors

Do not rewrite the whole page unless the page ownership is wrong.

### `hold`

Use `hold` when:

- the page had a material edit in the last 14 days
- there is no meaningful fresh post-publish data
- the signal is flat and there is no new query direction

Holding is not inactivity. It means:

- keep collecting data
- keep the keyword ownership stable
- do not send mixed signals with frequent rewrites

### `request indexing`

Use `request indexing` when:

- a page had a material content update
- a new support article was published
- a support page is still not showing impressions

Manual URL Inspection should happen on the same day as a material publish.

### Cannibalisation rule

If the wrong page starts taking the target query family:

- reduce repeated phrase usage on the non-owner page
- strengthen internal links to the owner page
- improve anchor-text clarity from the homepage and service overview pages
- do not try to make both pages rank for the same core phrase

## Logging rule

Every material action must be recorded in:

- `docs/seo-execution-log.md`

Each log line must include:

- action date
- page
- target keyword family
- what changed
- why it changed
- validation date
- current status

## SEO manager review cadence

The SEO manager must:

- run a light pulse every 2-3 days during the active sprint
- check technical health, sitemap state, Search Console auth, and fresh GSC reports before recommending edits
- review the 4 active owner pages first
- report whether the next action is `edit`, `hold`, or `request indexing`
- state whether query ownership is clean or confused
- mention if the homepage is still overreaching into service-intent terms
- keep `support.html` and `advertising.html` on observation unless new data clearly upgrades them
- remind the user of priority URLs after any material publish
- keep content production moving at 1-2 focused support articles per week once the first support cluster is indexed or showing impressions

## Two-week daily operating schedule

Window: 2026-06-12 to 2026-06-25

Timezone: Australia/Sydney

Daily fixed rhythm:

- 09:00: check Search Console auth, newest available GSC report, sitemap state, and whether the latest GitHub Pages deploy is live.
- 10:30: classify each priority page as `edit`, `hold`, or `request indexing`.
- 14:00: implement only the highest-leverage action for that day, if data or deployment status justifies it.
- 16:30: run `npm run seo:check`, submit sitemap after material changes, and update the execution log.

Daily sprint plan:

| Date | Main target | Action | Success check |
| --- | --- | --- | --- |
| 2026-06-12 | Homepage and `sydneyBilingualMarketingAgency.html` | Confirm the 2026-06-11 page-one push is live, submit sitemap, and verify title/meta/FAQ online | Online pages show the new Chinese agency titles and sitemap has 0 errors |
| 2026-06-13 | `chineseCommunityGrowth.html` | Review whether it needs a small title/meta/internal-link pass for `chinese marketing sydney` and Xiaohongshu/WeChat terms | Action is `edit` only if the page still has weak CTR or confused query ownership |
| 2026-06-14 | Internal links | Add or strengthen homepage, services overview, insights, and article links into `sydneyBilingualMarketingAgency.html` if crawl paths look weak | Exact-match anchors exist from the highest-authority internal pages |
| 2026-06-15 | Data pulse | Pull the newest 28-day GSC report and compare against the 2026-06-08 baseline | Decide whether homepage, agency page, support page, or digital page is the strongest next push |
| 2026-06-16 | Support article brief | Draft the next support article only if GSC shows a clear query direction; otherwise prepare a short case-study page outline | Article or case target is chosen from live impressions, not guesswork |
| 2026-06-17 | Publish or hold | Publish one focused support article/case page if ready, otherwise hold and keep internal-link improvements only | No generic content is published |
| 2026-06-18 | First formal validation | Run full GSC review: query-page ownership, CTR, average position, impressions, sitemap, and online metadata | Report whether each priority page is `edit`, `hold`, or `request indexing` |
| 2026-06-19 | Tactical correction | If `chinese marketing agency sydney` still lands only on homepage, strengthen service-page links; if CTR is weak, adjust title/meta | One targeted correction, not a full rewrite |
| 2026-06-20 | Weekend light pulse | Check live pages, sitemap, and Search Console availability only | No edits unless a technical issue appears |
| 2026-06-21 | Weekend content prep | Prepare the next article/case draft for the strongest signal from 2026-06-18 | Draft ready, but publish only if it supports a live ranking opportunity |
| 2026-06-22 | Second formal validation | Pull GSC report and compare owner pages, especially support, agency, digital, and community pages | Decide the next page-one push for 2026-06-23 to 2026-06-25 |
| 2026-06-23 | Second push action | Execute the strongest validated action: title/meta, FAQ, internal links, or support content | One high-confidence action shipped and logged |
| 2026-06-24 | Indexing and deployment | Verify the 2026-06-23 action is live, run SEO check, resubmit sitemap if needed | No technical blockers remain before the two-week review |
| 2026-06-25 | Two-week review | Compare rankings and query ownership against baseline; decide whether to continue, intensify with content, or correct cannibalisation | Final two-week report with next 14-day plan |

Two-week success targets:

- `chinese marketing agency sydney`: keep a top-10 signal and improve CTR from 0%.
- `chinese marketing sydney`: keep or regain a top-10 signal and reduce homepage-only dependency.
- `marketing support services`: move from positions 14-15 toward top 10-12.
- `sydneyBilingualMarketingAgency.html`: gain impressions for the Chinese agency keyword family.

## Priority manual indexing URLs

1. `https://gomarketing.net.au/`
2. `https://gomarketing.net.au/services/digital.html`
3. `https://gomarketing.net.au/services/sydneyBilingualMarketingAgency.html`
4. `https://gomarketing.net.au/services/chineseCommunityGrowth.html`
5. `https://gomarketing.net.au/services/howToReachChineseConsumersInSydney.html`
6. `https://gomarketing.net.au/services/xiaohongshuMarketingForSydneyRestaurants.html`
7. `https://gomarketing.net.au/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html`
8. `https://gomarketing.net.au/cn/howToReachChineseConsumersInSydney.html`
9. `https://gomarketing.net.au/cn/xiaohongshuMarketingForSydneyRestaurants.html`
10. `https://gomarketing.net.au/cn/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html`
11. `https://gomarketing.net.au/services/support.html`
12. `https://gomarketing.net.au/services/advertising.html`
13. `https://gomarketing.net.au/services/marketingAutomationServicesSydney.html`

## Next execution checkpoints

1. 2026-06-10
   Run a technical and indexing pulse: `seo:check`, Search Console auth, sitemap state, and whether the new support URLs are visible in the latest exports. Primary action should usually be `hold` or `request indexing`.
2. 2026-06-12
   Check sitemap processing, Search Console auth, and early impressions for new support articles. Primary action should usually be `hold` unless a technical issue appears.
3. 2026-06-15
   Run an early read on the 2026-06-08 publish. Check whether the new support articles are appearing in Search Console, whether owner-page query ownership is cleaner, and which second-batch article should be drafted next.
4. 2026-06-17
   If indexing is clean or early impressions appear, publish or prepare the next focused support article for the strongest owner-page signal. If signals are still absent, keep the action as `request indexing` and technical follow-up.
5. 2026-06-19
   Run a content and query-ownership pulse. Decide whether a small title/meta/internal-link edit is justified before the 2026-06-22 checkpoint.
6. 2026-06-22
   Run the first meaningful validation checkpoint for the owner-page sprint. Decide whether `digital.html`, `sydneyBilingualMarketingAgency.html`, or `chineseCommunityGrowth.html` deserves the next targeted edit.

## What not to do

- Do not reopen every service page at once.
- Do not keep changing a title every few days.
- Do not turn the homepage into a keyword warehouse.
- Do not publish generic low-intent blog posts.
- Do not treat tiny average-position moves as the whole story.
- Do not let multiple pages compete for the same owner keyword family.
