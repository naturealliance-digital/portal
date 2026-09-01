import argparse
import http.server
import os
import threading
import webbrowser


ROUTES = {
    "dashboard",
    "dashbaord",
    "manpower",
    "expenses",
    "expenes",
    "microsoft-365",
}


class DigitalHubHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        route = self.path.split("?", 1)[0].strip("/").lower()
        if route in ROUTES:
            self.path = "/index.html"
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--port", type=int, default=8787)
    args = parser.parse_args()
    root = os.path.abspath(args.root)

    def handler(*handler_args, **handler_kwargs):
        return DigitalHubHandler(
            *handler_args, directory=root, **handler_kwargs
        )

    server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    url = f"http://localhost:{args.port}/"
    print(f"Nature A Digital Hub: {url}", flush=True)
    print("Keep this window open. Press Ctrl+C to stop.", flush=True)
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    server.serve_forever()


if __name__ == "__main__":
    main()
