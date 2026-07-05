$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $repoRoot "android"
$gradleWrapper = Join-Path $androidRoot "gradlew.bat"
$keystoreProperties = Join-Path $androidRoot "keystore.properties"
$androidStudioJbr = "C:\Program Files\Android\Android Studio\jbr"
$androidSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"

if (-not (Test-Path -LiteralPath $keystoreProperties)) {
  Write-Host "Missing android\keystore.properties."
  Write-Host "Create it from android\keystore.properties.example after creating the upload keystore."
  Write-Host "See docs\android-release.md for the exact steps."
  exit 1
}

if (Test-Path -LiteralPath $androidStudioJbr) {
  $env:JAVA_HOME = $androidStudioJbr
}

if (Test-Path -LiteralPath $androidSdk) {
  $env:ANDROID_HOME = $androidSdk
  $env:ANDROID_SDK_ROOT = $androidSdk
}

& (Join-Path $PSScriptRoot "sync-android-assets.ps1")
& $gradleWrapper -p $androidRoot assembleRelease bundleRelease
if ($LASTEXITCODE -ne 0) {
  Write-Host "Android release build failed."
  exit $LASTEXITCODE
}

$apk = Join-Path $androidRoot "app\build\outputs\apk\release\app-release.apk"
$aab = Join-Path $androidRoot "app\build\outputs\bundle\release\app-release.aab"

Write-Host "Built Android release APK:"
Write-Host $apk
Write-Host "Built Android release AAB:"
Write-Host $aab
