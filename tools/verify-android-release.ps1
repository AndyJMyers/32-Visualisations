$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $repoRoot "android"
$aab = Join-Path $androidRoot "app\build\outputs\bundle\release\app-release.aab"
$apk = Join-Path $androidRoot "app\build\outputs\apk\release\app-release.apk"

function Resolve-Node {
  $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
  if ($nodeCommand) {
    return $nodeCommand.Source
  }

  $bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  if (Test-Path -LiteralPath $bundledNode) {
    return $bundledNode
  }

  throw "Node.js was not found. Install Node.js or run from an environment where node is on PATH."
}

Write-Host "Running 32 Visualisations system tests..."
$node = Resolve-Node
& $node (Join-Path $PSScriptRoot "system-test.js")
if ($LASTEXITCODE -ne 0) {
  Write-Host "System tests failed."
  exit $LASTEXITCODE
}

Write-Host "Checking Android release artifacts..."
foreach ($artifact in @($aab, $apk)) {
  if (-not (Test-Path -LiteralPath $artifact)) {
    Write-Host "Missing release artifact: $artifact"
    exit 1
  }

  $item = Get-Item -LiteralPath $artifact
  if ($item.Length -le 0) {
    Write-Host "Release artifact is empty: $artifact"
    exit 1
  }

  Write-Host "$($item.FullName) ($($item.Length) bytes)"
}

Write-Host "Android release verification passed."
