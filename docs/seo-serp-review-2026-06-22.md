# SERP Review

Date: 2026-06-22

## Purpose

Monday full-review refresh for the priority query families. Search Console reauthorization is still required, so this review is used as market context only; it should not override fresh GSC query/page ownership once auth is restored.

## Current competitor pattern

| Query family | Visible competitor examples | What Google appears to reward | Implication for Go Marketing |
| --- | --- | --- | --- |
| `marketing agency sydney` / `digital marketing services sydney` | Sydney Digital Marketing, The Collective Co, Sparro, RGC Digital Marketing, Digital Nomads HQ, Clutch, Semrush, Sortlist | Sydney-local agency positioning, service breadth, proof/reviews, directories, lead-generation language, established trust signals | Keep homepage and `services/digital.html` stable until fresh GSC returns; next non-copy action should strengthen third-party/local proof and case-style evidence |
| `chinese marketing agency sydney` / `chinese marketing agency australia` | Brand Asia, Ignite Search, Vantage Digital, BE BOLDER, S&J Media Group | Chinese-market specialization, bilingual/localisation credibility, platform knowledge, client/industry proof, market-entry framing | `services/sydneyBilingualMarketingAgency.html` still needs more compact proof/examples once fresh data confirms query ownership; do not rewrite before GSC auth is fixed |
| `xiaohongshu marketing sydney` / `xiaohongshu marketing australia` | Brand Asia RedNote page, OZClicks, VisionVivo, Trafficon, LOC'X, Chinese influencer agencies | RedNote/Xiaohongshu specificity, creator/UGC language, Australia-China bridge, category examples in hospitality, wellness, beauty and property | Improve support content depth and connect it back to `services/chineseCommunityGrowth.html`; restaurant-specific examples are a safe support action while GSC is stale |
| `marketing support services` | Mixed agency, business support and consulting pages | Clear scope and fast service definition help because the intent is ambiguous | Keep `services/support.html` on hold until fresh GSC shows whether the 2026-06-16 snippet edit improved CTR |

## Tactical content gaps

| Gap | Priority | Recommended action |
| --- | --- | --- |
| Fresh Search Console data is unavailable | Critical | Run `npm run search-console:auth`, then `node scripts/search-console.js snapshot --days=28` before the next major ranking edit |
| Restaurant Xiaohongshu article was too thin versus current SERP | High | Add Sydney restaurant scenarios, UGC/creator evaluation criteria, and a stronger internal link to `chineseCommunityGrowth.html` |
| Chinese agency proof is still thinner than competitors | High | Prepare compact industry/example proof block for `sydneyBilingualMarketingAgency.html`, but only ship after fresh query ownership data or indexing confirmation |
| Third-party local trust is a recurring gap | Medium | Prepare a local citation/review/profile checklist for Google Business Profile, Clutch/Semrush-style directories, LinkedIn, and partner mentions |

## Decision

- Highest-confidence action today: support-content improvement on `services/xiaohongshuMarketingForSydneyRestaurants.html`.
- Reason: it closes a current SERP gap without changing page ownership or relying on stale GSC positions.
- Indexing action required: request indexing for the updated article and resubmit `https://gomarketing.net.au/sitemap.xml` after deployment.

## Sources Checked

- Sydney Digital Marketing: `https://sydneydigitalmarketing.com.au/`
- The Collective Co: `https://www.thecollectiveco.com.au/`
- Sparro: `https://sparro.com.au/`
- RGC Digital Marketing: `https://rgcdigitalmarketing.com.au/`
- Digital Nomads HQ: `https://digitalnomadshq.com.au/digital-marketing-sydney/`
- Clutch Sydney digital marketing list: `https://clutch.co/au/agencies/digital-marketing/sydney`
- Semrush Sydney agency list: `https://agencies.semrush.com/list/sydney/`
- Brand Asia: `https://brandasia.com.au/`
- Brand Asia RedNote page: `https://brandasia.com.au/rednote-little-red-book-marketing/`
- Ignite Search Chinese marketing page: `https://www.ignitesearch.com.au/chinese-marketing-agency/`
- Vantage Digital: `https://vantagedigital.com.au/`
- BE BOLDER Chinese marketing page: `https://bebolder.com.au/chinese-marketing/`
- S&J Media Group China Digital: `https://sjmediagroup.com.au/china-digital/`
- OZClicks Xiaohongshu marketing: `https://ozclicks.com.au/xiaohongshu-marketing/`
- VisionVivo Xiaohongshu marketing: `https://visionvivo.com/marketing-with-xiaohongshu/`
- Trafficon Xiaohongshu marketing: `https://trafficon.com.au/xiaohongshu-marketing/`
- LOC'X Xiaohongshu guide: `https://locx.com.au/blog/xiaohongshu-marketing-guide`
