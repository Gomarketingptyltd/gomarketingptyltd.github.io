"""Read-only public-asset preview; never exposes credentials or sends forms."""
import http.server
from pathlib import Path
import subprocess
import urllib.parse

ROOT = Path(__file__).resolve().parent.parent
tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
allowed = {
    name for name in tracked
    if name and not any(part.startswith(".") for part in Path(name).parts)
    and Path(name).suffix.lower() in {
        ".html", ".css", ".js", ".jpg", ".jpeg", ".png", ".svg", ".webp",
        ".gif", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".mp4"
    }
    and Path(name).parts[0] not in {"scripts", "docs", "agency-os"}
}
allowed.update({"js/enquiry.js", "css/enquiry.css"})


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path).lstrip("/")
        if not path or path.endswith("/"):
            path += "index.html"
        candidate = (ROOT / path).resolve()
        if path not in allowed or not candidate.is_relative_to(ROOT):
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)

    def do_POST(self):
        self.send_error(405)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; form-action 'none'; frame-src 'none'; base-uri 'self'")
        super().end_headers()

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    print(f"Public-only preview: http://127.0.0.1:{server.server_port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
