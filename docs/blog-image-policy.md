# Blog Image Policy

Owner requirement, 6 October 2026: different blog articles must not reuse the same image.

- Register every article in `scripts/blog-images.json`. The English and Chinese translations share one entry. Its cover may also appear in homepage thumbnails, Insights cards and social metadata for that same article.
- Use a genuinely different, topic-relevant photograph for every different article. Renaming, recropping or recolouring a used photo is not a new image. Review the whole gallery for visually near-identical photos too.
- Keep covers locally hosted. Preserve existing layout classes and card dimensions. New editorial covers are 1200 x 750 JPEGs; aim for less than 250 KB each.
- Describe the visible image accurately in both languages. Do not label stock models as our staff or clients, infer their nationality, or imply a pictured business endorses Go Marketing.
- Never use private client materials, unapproved case screenshots, pricing documents or competitor-owned images as stock artwork.
- Record the original source identifier, source URL and photographer for new assets. The seven editorial replacements added on 6 October 2026 use the [Pexels License](https://www.pexels.com/license/), checked on that date. Existing `china-safe` assets retain their original Pexels IDs.
- Update article covers, every linked thumbnail, Open Graph, Twitter and BlogPosting images together. `seo:metadata` reads the same manifest. Do not change publication dates merely to make an image refresh look like a new article.
- Run `npm run seo:release-gate`. Blog-image checks reject duplicate paths, duplicate source identifiers, identical bytes under different names, unregistered articles, translation mismatches and stale thumbnails/metadata. They cannot replace human checks of subject matter, licensing or near-duplicate crops.
- Check desktop and mobile image loading and cropping before release; preserve forms, resource links and other page content. Verify deployed pages and images after release.
