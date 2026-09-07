param([int]$Port = 8787)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = 'C:\Users\KhaingZawShein\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'

if (-not (Test-Path -LiteralPath $python)) {
    $pythonCommand = Get-Command python.exe -ErrorAction SilentlyContinue
    if (-not $pythonCommand) { throw 'Python is required to start the local website server.' }
    $python = $pythonCommand.Source
}

$url = "http://localhost:$Port/"
$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Nature A Digital Hub is already running at $url" -ForegroundColor Green
    Start-Process $url
    exit 0
}

Write-Host "Starting Nature A Digital Hub at $url" -ForegroundColor Green
$serverScript = Join-Path $root 'local_server.py'
if (-not (Test-Path -LiteralPath $serverScript)) {
    throw "Local server file was not found: $serverScript"
}

& $python $serverScript --root $root --port $Port
if ($LASTEXITCODE -ne 0) {
    throw "The local website server stopped with exit code $LASTEXITCODE."
}
