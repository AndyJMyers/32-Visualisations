$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $repoRoot "android/app/src/main/assets/www"
$sampleMusicRoot = Join-Path $repoRoot "sample-music"
$sampleMusicAssetRoot = Join-Path $repoRoot "android/app/src/main/assets/sample-music"

New-Item -ItemType Directory -Force -Path $assetRoot | Out-Null

Copy-Item -LiteralPath (Join-Path $repoRoot "index.html") -Destination (Join-Path $assetRoot "index.html") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "styles.css") -Destination (Join-Path $assetRoot "styles.css") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "app.js") -Destination (Join-Path $assetRoot "app.js") -Force

if (Test-Path -LiteralPath $sampleMusicRoot) {
  New-Item -ItemType Directory -Force -Path $sampleMusicAssetRoot | Out-Null
  Copy-Item -Path (Join-Path $sampleMusicRoot "*.wav") -Destination $sampleMusicAssetRoot -Force
}

Write-Host "Synced web assets into android/app/src/main/assets/www"
