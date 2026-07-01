$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $repoRoot "android"
$gradleWrapper = Join-Path $androidRoot "gradlew.bat"
$androidStudioJbr = "C:\Program Files\Android\Android Studio\jbr"
$androidSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"

if (Test-Path -LiteralPath $androidStudioJbr) {
  $env:JAVA_HOME = $androidStudioJbr
}

if (Test-Path -LiteralPath $androidSdk) {
  $env:ANDROID_HOME = $androidSdk
  $env:ANDROID_SDK_ROOT = $androidSdk
}

& (Join-Path $PSScriptRoot "sync-android-assets.ps1")
& $gradleWrapper -p $androidRoot assembleDebug

$apk = Join-Path $androidRoot "app\build\outputs\apk\debug\app-debug.apk"
Write-Host "Built Android debug APK:"
Write-Host $apk
