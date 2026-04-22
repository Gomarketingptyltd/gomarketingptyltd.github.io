# Local Google Search Console API Setup

This project includes local scripts for Google Search Console API authentication and reporting. Tokens and exported data are stored in `.search-console/`, which is ignored by git.

## 1. Create OAuth credentials in Google Cloud

1. Open the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials)
2. Create or select a Google Cloud project
3. Enable the [Search Console API](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)
4. Configure the OAuth consent screen if Google asks you to
5. Create an **OAuth client ID**
6. Choose **Desktop app**
7. Copy the generated `client ID` and `client secret`

## 2. Add local config

Copy the example config:

```bash
mkdir -p .search-console
cp search-console.config.example.json .search-console/config.json
```

Then edit `.search-console/config.json`:

- `clientId`: your Google OAuth client ID
- `clientSecret`: your Google OAuth client secret
- `redirectUri`: keep `http://127.0.0.1:8788` unless you have a reason to change it
- `siteUrl`: use the exact property identifier from Search Console

Examples:

- Domain property: `sc-domain:gomarketing.net.au`
- URL-prefix property: `https://gomarketing.net.au/`

### Faster option: import the downloaded Google OAuth JSON

If you download the OAuth client JSON from Google Cloud, you do not need to copy values manually.

Run:

```bash
npm run search-console:import-client -- /absolute/path/to/client_secret_xxx.json
```

This will safely extract:

- `clientId`
- `clientSecret`
- `redirectUri`

and write them into:

- `.search-console/config.json`

## 3. Authorize locally

Run:

```bash
npm run search-console:auth
```

The script will print a Google authorization URL. Open it in your browser, sign in with the Google account that has access to the Search Console property, and approve the request.

On success, the token is saved locally to:

- `.search-console/token.json`

You can run a quick local health check at any time:

```bash
npm run search-console:doctor
```

## 4. Check accessible properties

Run:

```bash
npm run search-console:sites
```

This prints the Search Console properties your Google account can access and the permission level on each property.

If your configured `siteUrl` is wrong, update `.search-console/config.json` with the exact property string returned here.

## 5. Fetch sitemap and performance data

List submitted sitemaps:

```bash
npm run search-console:sitemaps
```

Submit the current sitemap:

```bash
npm run search-console:submit-sitemap -- --feedpath=https://gomarketing.net.au/sitemap.xml
```

Delete an old sitemap entry:

```bash
npm run search-console:delete-sitemap -- --feedpath=https://gomarketing.net.au/
```

Generate a one-command local SEO snapshot:

```bash
npm run search-console:snapshot -- --days=28
```

Install a weekly local snapshot on this Mac:

```bash
npm run search-console:install-weekly
```

Remove it later if needed:

```bash
npm run search-console:uninstall-weekly
```

Fetch a default performance bundle:

```bash
npm run search-console:report -- --days=28
```

Or specify an exact range:

```bash
npm run search-console:report -- --start=2026-03-01 --end=2026-03-31
```

Reports are written to:

- `.search-console/reports/<start>_to_<end>/summary.json`
- `.search-console/reports/<start>_to_<end>/snapshot.md`
- `.search-console/reports/<start>_to_<end>/queries.csv`
- `.search-console/reports/<start>_to_<end>/pages.csv`
- `.search-console/reports/<start>_to_<end>/countries.csv`
- `.search-console/reports/<start>_to_<end>/devices.csv`
- `.search-console/reports/<start>_to_<end>/dates.csv`

Weekly automation logs are written to:

- `.search-console/logs/weekly.out.log`
- `.search-console/logs/weekly.err.log`

## Notes

- The scripts use the official Search Console API with OAuth 2.0.
- The local auth flow requests Search Console scope: `https://www.googleapis.com/auth/webmasters`
- The default report range skips the most recent few days because Search Console data can lag behind the current date.
- The Google account you authorize must already have access to the Search Console property.
- The weekly launch agent runs every Monday at 09:00 using the local timezone on this Mac.

## Official references

- [Authorize Requests | Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)
- [Search Analytics: query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Sites: list](https://developers.google.com/webmaster-tools/v1/sites/list)
- [Sitemaps: submit](https://developers.google.com/webmaster-tools/v1/sitemaps/submit)
- [Sitemaps: delete](https://developers.google.com/webmaster-tools/v1/sitemaps/delete)
- [Sitemaps: list](https://developers.google.com/webmaster-tools/v1/sitemaps/list)
