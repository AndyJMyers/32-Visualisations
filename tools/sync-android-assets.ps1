$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $repoRoot "android/app/src/main/assets/www"

New-Item -ItemType Directory -Force -Path $assetRoot | Out-Null

Copy-Item -LiteralPath (Join-Path $repoRoot "index.html") -Destination (Join-Path $assetRoot "index.html") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "styles.css") -Destination (Join-Path $assetRoot "styles.css") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "app.js") -Destination (Join-Path $assetRoot "app.js") -Force

Write-Host "Synced web assets into android/app/src/main/assets/www"
