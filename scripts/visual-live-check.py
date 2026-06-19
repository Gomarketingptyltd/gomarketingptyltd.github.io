#!/usr/bin/env python3

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin


SITE_URL = os.environ.get("SITE_URL", "https://gomarketing.net.au").rstrip("/")
ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = Path(os.environ.get("VISUAL_OUTPUT_DIR", ROOT / ".seo-visual"))
PRIORITY_PATHS = [
    "/",
    "/cn/",
    "/services/",
    "/services/digital.html",
    "/cn/digital.html",
    "/services/sydneyBilingualMarketingAgency.html",
    "/cn/sydneyBilingualMarketingAgency.html",
    "/services/chineseCommunityGrowth.html",
    "/cn/chineseCommunityGrowth.html",
    "/services/support.html",
    "/services/advertising.html",
    "/services/howToReachChineseConsumersInSydney.html",
    "/services/xiaohongshuMarketingForSydneyRestaurants.html",
    "/services/digitalMarketingServicesSydneyWhatSmallBusinessesActuallyNeed.html",
]
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 1100},
    "mobile": {"width": 390, "height": 844},
}
MOJIBAKE_RE = re.compile(r"\ufffd|(?:Ã[\x80-\xbf]|Â[\x80-\xbf]?|â[€\x80-\xbf]|[äåæç][\x80-\xbf])")
INSECURE_HTTP_RE = re.compile(r"http://(?!127\.0\.0\.1(?::\d+)?(?:[/\"'\s]|$)|localhost(?::\d+)?(?:[/\"'\s]|$))", re.I)


def selected_paths():
    override = os.environ.get("VISUAL_PATHS", "").strip()
    if not override:
        return PRIORITY_PATHS
    return [item.strip() for item in override.split(",") if item.strip()]


def safe_name(path, viewport):
    cleaned = path.strip("/") or "home"
    cleaned = cleaned.replace("/", "__").replace(".", "-")
    return f"{viewport}__{cleaned}.png"


def write_markdown_report(run_dir, rows, issues):
    lines = [
        "# Visual Live Check",
        "",
        f"- Generated: {datetime.now(timezone.utc).isoformat()}",
        f"- Site URL: {SITE_URL}",
        f"- Pages: {len(selected_paths())}",
        f"- Viewports: {', '.join(VIEWPORTS)}",
        f"- Status: {'failed' if issues else 'passed'}",
        "",
        "## Screenshots",
        "",
        "| Viewport | URL | Title | H1 | Screenshot |",
        "| --- | --- | --- | --- | --- |",
    ]

    for row in rows:
        title = row["title"].replace("|", "\\|")
        h1 = row["h1"].replace("|", "\\|")
        screenshot = Path(row["screenshot"]).name
        lines.append(f"| {row['viewport']} | {row['url']} | {title} | {h1} | `{screenshot}` |")

    if issues:
        lines.extend(["", "## Issues", ""])
        for issue in issues:
            lines.append(f"- {issue}")

    (run_dir / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def render_with_retry(page, url, attempts=3):
    last_error = None

    for attempt in range(1, attempts + 1):
        try:
            response = page.goto(url, wait_until="networkidle", timeout=45000)
            page.wait_for_timeout(600)
            if response is None or response.status < 500 or attempt == attempts:
                return response, attempt, None
            last_error = f"HTTP {response.status}"
        except Exception as exc:
            last_error = str(exc)
            if attempt == attempts:
                return None, attempt, last_error

        page.wait_for_timeout(1000 * attempt)

    return None, attempts, last_error


def main():
    try:
        from playwright.sync_api import sync_playwright
    except Exception as exc:
        print("Visual check requires Python Playwright.", file=sys.stderr)
        print("Install or repair it with: python3 -m pip install playwright && python3 -m playwright install chromium", file=sys.stderr)
        print(f"Import error: {exc}", file=sys.stderr)
        return 2

    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    run_dir = OUTPUT_ROOT / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    issues = []
    rows = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for viewport_name, viewport in VIEWPORTS.items():
            context = browser.new_context(
                viewport=viewport,
                device_scale_factor=1,
                locale="en-AU",
                timezone_id="Australia/Sydney",
            )

            for path in selected_paths():
                url = urljoin(f"{SITE_URL}/", path.lstrip("/"))
                page = context.new_page()
                console_errors = []
                page_errors = []
                page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
                page.on("pageerror", lambda error: page_errors.append(str(error)))

                response, attempts, render_error = render_with_retry(page, url)
                if render_error:
                    issues.append(f"{viewport_name} {url}: failed to render page after {attempts} attempt(s): {render_error}")
                    page.close()
                    continue

                if response is None:
                    issues.append(f"{viewport_name} {url}: no navigation response")
                elif response.status >= 400:
                    issues.append(f"{viewport_name} {url}: HTTP {response.status}")

                final_url = page.url
                if not final_url.startswith("https://"):
                    issues.append(f"{viewport_name} {url}: final URL is not HTTPS: {final_url}")

                metrics = page.evaluate(
                    """() => {
                      const h1 = document.querySelector('h1');
                      const hero = document.querySelector('main, header, section, .hero, .hero-section');
                      const bodyText = document.body ? document.body.innerText : '';
                      const bodyStyle = document.body ? window.getComputedStyle(document.body) : null;
                      const heroBox = hero ? hero.getBoundingClientRect() : null;
                      return {
                        title: document.title || '',
                        h1: h1 ? h1.innerText.trim() : '',
                        bodyTextLength: bodyText.length,
                        stylesheetLinks: document.querySelectorAll('link[rel~="stylesheet"]').length,
                        styleSheets: document.styleSheets.length,
                        bodyWidth: document.body ? document.body.scrollWidth : 0,
                        bodyHeight: document.body ? document.body.scrollHeight : 0,
                        bodyFontFamily: bodyStyle ? bodyStyle.fontFamily : '',
                        heroVisible: heroBox ? heroBox.width > 100 && heroBox.height > 80 : false,
                        html: document.documentElement.outerHTML.slice(0, 500000)
                      };
                    }"""
                )

                if metrics["stylesheetLinks"] < 1:
                    issues.append(f"{viewport_name} {url}: no stylesheet link rendered")
                if metrics["styleSheets"] < 1:
                    issues.append(f"{viewport_name} {url}: browser loaded zero stylesheets")
                if metrics["bodyTextLength"] < 250:
                    issues.append(f"{viewport_name} {url}: body text looks too short ({metrics['bodyTextLength']} chars)")
                if metrics["bodyHeight"] < viewport["height"]:
                    issues.append(f"{viewport_name} {url}: page height looks suspiciously short ({metrics['bodyHeight']}px)")
                if not metrics["heroVisible"]:
                    issues.append(f"{viewport_name} {url}: no visible main/header/hero section detected")
                if MOJIBAKE_RE.search(metrics["html"]):
                    issues.append(f"{viewport_name} {url}: possible mojibake or broken encoding in rendered HTML")
                if INSECURE_HTTP_RE.search(metrics["html"]):
                    issues.append(f"{viewport_name} {url}: rendered HTML contains insecure http:// URL")
                if page_errors:
                    issues.append(f"{viewport_name} {url}: page error: {page_errors[0]}")

                screenshot_path = run_dir / safe_name(path, viewport_name)
                page.screenshot(path=str(screenshot_path), full_page=True)
                if screenshot_path.stat().st_size < 15000:
                    issues.append(f"{viewport_name} {url}: screenshot file is suspiciously small")

                rows.append({
                    "viewport": viewport_name,
                    "url": url,
                    "finalUrl": final_url,
                    "title": metrics["title"],
                    "h1": metrics["h1"],
                    "bodyTextLength": metrics["bodyTextLength"],
                    "bodyHeight": metrics["bodyHeight"],
                    "stylesheetLinks": metrics["stylesheetLinks"],
                    "styleSheets": metrics["styleSheets"],
                    "bodyFontFamily": metrics["bodyFontFamily"],
                    "screenshot": str(screenshot_path),
                    "consoleErrorCount": len(console_errors),
                    "attempts": attempts,
                })

                page.close()
            context.close()
        browser.close()

    manifest = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "siteUrl": SITE_URL,
        "status": "failed" if issues else "passed",
        "issues": issues,
        "results": rows,
    }
    (run_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    write_markdown_report(run_dir, rows, issues)

    if issues:
        print(f"Visual live check failed with {len(issues)} issue(s).")
        print(f"Report: {run_dir / 'report.md'}")
        for issue in issues[:20]:
            print(f"- {issue}")
        if len(issues) > 20:
            print(f"- ...and {len(issues) - 20} more")
        return 1

    print("Visual live check passed.")
    print(f"Captured {len(rows)} screenshots.")
    print(f"Report: {run_dir / 'report.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
