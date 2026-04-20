# Go Marketing Website

URL: https://gomarketing.net.au

## SEO Operations

Run the local SEO check before pushing website updates:

```bash
npm run seo:check
```

Regenerate managed social metadata and structured data after changing page titles, descriptions, canonicals or core contact details:

```bash
npm run seo:metadata
```

The SEO content roadmap is maintained in:

- `docs/seo-content-map.md`

GitHub Actions also runs the SEO check on pushes to `main` and on a weekly schedule.
