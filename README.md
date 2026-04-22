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

Regenerate `sitemap.xml` and `robots.txt` after adding or removing primary HTML pages:

```bash
npm run seo:sitemap
```

The SEO content roadmap is maintained in:

- `docs/seo-content-map.md`

GitHub Actions also runs the SEO check on pushes to `main` and on a weekly schedule.

## Search Console API

Local Search Console tooling is available for authenticated reporting.

1. Copy `search-console.config.example.json` to `.search-console/config.json`
2. Add your Google OAuth desktop-app credentials
3. Run local auth:

```bash
npm run search-console:auth
```

Useful follow-up commands:

```bash
npm run search-console:import-client -- /path/to/client_secret_xxx.json
npm run search-console:doctor
npm run search-console:sites
npm run search-console:sitemaps
npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml
npm run search-console:delete-sitemap -- --feedpath=https://gomarketing.net.au/
npm run search-console:snapshot -- --days=28
npm run search-console:report -- --days=28
```

Detailed setup steps are documented in:

- `docs/search-console-local-setup.md`
