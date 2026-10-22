$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $repoRoot "android/app/src/main/assets/www"

New-Item -ItemType Directory -Force -Path $assetRoot | Out-Null

Copy-Item -LiteralPath (Join-Path $repoRoot "index.html") -Destination (Join-Path $assetRoot "index.html") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "styles.css") -Destination (Join-Path $assetRoot "styles.css") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "app.js") -Destination (Join-Path $assetRoot "app.js") -Force

Copy-Item -LiteralPath (Join-Path $repoRoot "autumn.js") -Destination (Join-Path $assetRoot "autumn.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "toadstools.js") -Destination (Join-Path $assetRoot "toadstools.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "cobweb.js") -Destination (Join-Path $assetRoot "cobweb.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "last-mow.js") -Destination (Join-Path $assetRoot "last-mow.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "squirrel.js") -Destination (Join-Path $assetRoot "squirrel.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "driving.js") -Destination (Join-Path $assetRoot "driving.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "harvest.js") -Destination (Join-Path $assetRoot "harvest.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "rat-race.js") -Destination (Join-Path $assetRoot "rat-race.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "starry-night.js") -Destination (Join-Path $assetRoot "starry-night.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "water-lilies.js") -Destination (Join-Path $assetRoot "water-lilies.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "the-scream.js") -Destination (Join-Path $assetRoot "the-scream.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "mondrian.js") -Destination (Join-Path $assetRoot "mondrian.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "pollocks.js") -Destination (Join-Path $assetRoot "pollocks.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "your-call.js") -Destination (Join-Path $assetRoot "your-call.js") -Force

Write-Host "Synced web assets into android/app/src/main/assets/www"
