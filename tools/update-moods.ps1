param(
  [Parameter(Mandatory = $true)]
  [string]$MusicFolder
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath $MusicFolder
$manifestPath = Join-Path $root "moods.json"
$copyrightPath = Join-Path $root "COPYRIGHT.txt"

$moods = @(
  "All",
  "Love",
  "Ballads",
  "Bossa",
  "Louche Jazz",
  "Balearic",
  "Rock",
  "Night Drive",
  "Sunny",
  "Melancholy",
  "Ridiculous",
  "High Energy",
  "After Hours"
)

$keywordMap = [ordered]@{
  "Love"        = @("love", "lover", "heart", "kiss", "romance", "darling", "baby")
  "Ballads"     = @("ballad", "slow", "waltz", "lullaby", "lament", "tender")
  "Bossa"       = @("bossa", "samba", "ipanema", "rio", "latin")
  "Louche Jazz" = @("jazz", "louche", "swing", "smoky", "blue note", "sax", "trumpet")
  "Balearic"    = @("balearic", "ibiza", "sunset", "beach", "island", "drift")
  "Rock"        = @("rock", "riff", "guitar", "garage", "motor", "tvr")
  "Night Drive" = @("night", "drive", "neon", "midnight", "road", "cruise")
  "Sunny"       = @("sun", "sunny", "summer", "gold", "daylight", "bright")
  "Melancholy"  = @("melancholy", "sad", "rain", "ghost", "ache", "lonely")
  "Ridiculous"  = @("ridiculous", "daft", "silly", "mad", "mental", "nonsense")
  "High Energy" = @("fast", "hot", "wild", "energy", "dance", "storm", "fire")
  "After Hours" = @("after hours", "late", "dusk", "velvet", "cocktail", "lounge")
}

function Get-ExistingTrackEntry($manifest, [string]$relativePath, [string]$fileName) {
  if (-not $manifest -or -not $manifest.tracks) {
    return $null
  }

  $byRelative = $manifest.tracks.PSObject.Properties[$relativePath]
  if ($byRelative) {
    return $byRelative.Value
  }

  $byName = $manifest.tracks.PSObject.Properties[$fileName]
  if ($byName) {
    return $byName.Value
  }

  return $null
}

function Get-MoodGuess([string]$relativePath) {
  $text = $relativePath.ToLowerInvariant()
  $scores = @{}

  foreach ($mood in $keywordMap.Keys) {
    $score = 0
    foreach ($keyword in $keywordMap[$mood]) {
      if ($text.Contains($keyword)) {
        $score += 1
      }
    }
    if ($score -gt 0) {
      $scores[$mood] = $score
    }
  }

  if ($scores.Count -eq 0) {
    return @{
      Primary = "All"
      Moods = @("All")
      Confidence = 0.1
      Notes = "No strong filename or folder hint yet. Review manually or add production notes later."
    }
  }

  $ranked = $scores.GetEnumerator() | Sort-Object -Property Value -Descending
  $primary = $ranked[0].Key
  $moodList = @($primary)
  foreach ($item in $ranked | Select-Object -Skip 1 -First 2) {
    $moodList += $item.Key
  }

  return @{
    Primary = $primary
    Moods = $moodList
    Confidence = [Math]::Min(0.85, 0.35 + ($ranked[0].Value * 0.18))
    Notes = "Best-effort local classification from filename and folder path."
  }
}

function Get-RelativeLibraryPath([string]$basePath, [string]$filePath) {
  $baseUri = New-Object System.Uri(($basePath.TrimEnd("\") + "\"))
  $fileUri = New-Object System.Uri($filePath)
  return [System.Uri]::UnescapeDataString(
    $baseUri.MakeRelativeUri($fileUri).ToString()
  )
}

$existing = $null
if (Test-Path -LiteralPath $manifestPath) {
  $existing = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
}

$tracks = [ordered]@{}
$review = New-Object System.Collections.Generic.List[string]
$newCount = 0
$preservedCount = 0

Get-ChildItem -LiteralPath $root -Recurse -File -Filter *.wav | Sort-Object FullName | ForEach-Object {
  $relativePath = Get-RelativeLibraryPath $root $_.FullName
  $existingEntry = Get-ExistingTrackEntry $existing $relativePath $_.Name

  if ($existingEntry) {
    $tracks[$relativePath] = $existingEntry
    $preservedCount += 1
    return
  }

  $guess = Get-MoodGuess $relativePath
  $tracks[$relativePath] = [ordered]@{
    title = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    primaryMood = $guess.Primary
    moods = $guess.Moods
    confidence = $guess.Confidence
    notes = $guess.Notes
  }
  $newCount += 1

  if ($guess.Confidence -lt 0.5) {
    $review.Add($relativePath) | Out-Null
  }
}

$manifest = [ordered]@{
  version = 1
  updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  moods = $moods
  tracks = $tracks
  review = $review.ToArray()
}

$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

if (-not (Test-Path -LiteralPath $copyrightPath)) {
  @"
Copyright notice

All songs in this folder are original works by AndyJMyers unless explicitly marked otherwise.

You may listen privately and share links to the associated Substack post.
You may not redistribute, re-host, sample, synchronise, sell, train models on,
or incorporate these recordings into another work without written permission.

For permissions, licensing, collaboration or ceremonial disputes over authorship,
contact AndyJMyers through the Substack or GitHub project page.
"@ | Set-Content -LiteralPath $copyrightPath -Encoding UTF8
}

Write-Host "Updated moods manifest:"
Write-Host $manifestPath
Write-Host "$newCount new track(s), $preservedCount preserved, $($review.Count) suggested for review."
