param([int]$Port = 8787)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = 'C:\Users\KhaingZawShein\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'

if (-not (Test-Path -LiteralPath $python)) {
    $pythonCommand = Get-Command python.exe -ErrorAction SilentlyContinue
    if (-not $pythonCommand) { throw 'Python is required to start the local website server.' }
    $python = $pythonCommand.Source
}

$serverCode = @'
import http.server
import os
import sys

root = os.path.abspath(sys.argv[1])
port = int(sys.argv[2])
routes = {"dashboard", "dashbaord", "manpower", "expenses", "expenes", "microsoft-365"}

class DigitalHubHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root, **kwargs)

    def do_GET(self):
        route = self.path.split("?", 1)[0].strip("/").lower()
        if route in routes:
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

server = http.server.ThreadingHTTPServer(("127.0.0.1", port), DigitalHubHandler)
print(f"Nature A Digital Hub: http://localhost:{port}/", flush=True)
print("Keep this window open. Press Ctrl+C to stop.", flush=True)
server.serve_forever()
'@

$url = "http://localhost:$Port/"
Write-Host "Starting Nature A Digital Hub at $url" -ForegroundColor Green
try { Start-Process $url } catch { Write-Host "Open $url in your browser." -ForegroundColor Yellow }
& $python -c $serverCode $root $Port
