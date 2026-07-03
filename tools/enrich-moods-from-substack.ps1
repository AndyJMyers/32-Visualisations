param(
  [Parameter(Mandatory = $true)]
  [string]$MusicFolder,

  [string]$ArchiveUrl = "https://andyjmyers.substack.com/api/v1/archive?sort=new&search=",

  [int]$SectionId = 339579,

  [int]$PageSize = 12,

  [int]$MaxPages = 40
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath $MusicFolder
$manifestPath = Join-Path $root "moods.json"

if (-not (Test-Path -LiteralPath $manifestPath)) {
  throw "No moods.json found at $manifestPath. Run tools/update-moods.ps1 first."
}

function Get-NormalizedKey([string]$value) {
  if (-not $value) {
    return ""
  }

  $text = $value.ToLowerInvariant()
  $text = [System.IO.Path]::GetFileNameWithoutExtension($text)
  $text = $text -replace "[^a-z0-9]+", " "
  $text = $text -replace "\b(copy|take|side|best|cut|suno|aisong|ai|wav)\b", " "
  $text = $text -replace "\s+", " "
  return $text.Trim()
}

function Add-MoodScore($scores, [string]$mood, [double]$amount) {
  if (-not $scores.ContainsKey($mood)) {
    $scores[$mood] = 0.0
  }
  $scores[$mood] += $amount
}

function Add-MoodEvidence($scores, [string]$text) {
  $haystack = " " + $text.ToLowerInvariant() + " "

  $rules = [ordered]@{
    "Love"        = @(" love ", " lover ", " lovers ", " darling ", " desire ", " kiss ", " heart ", " romance ")
    "Ballads"     = @(" ballad ", " waltz ", " lullaby ", " lament ", " tender ", " folk ")
    "Bossa"       = @(" bossa ", " samba ", " rio ", " latin ", " raga ")
    "Louche Jazz" = @(" jazz ", " louche ", " lounge ", " sax ", " saxophone ", " trumpet ", " smoky ", " brushed drums ", " upright bass ", " chanteuse ", " cabaret ")
    "Balearic"    = @(" balearic ", " sunset ", " island ", " beach ", " drift ", " moonlit ")
    "Rock"        = @(" rock ", " guitar ", " riff ", " garage ", " v8 ", " tvr ", " motor ", " engine ")
    "Night Drive" = @(" night ", " midnight ", " neon ", " road ", " drive ", " highway ", " headlight ", " noir ")
    "Sunny"       = @(" sun ", " sunny ", " summer ", " gold ", " daylight ", " warm ", " afternoon ")
    "Melancholy"  = @(" melancholy ", " rain ", " ghost ", " sorrow ", " lonely ", " grief ", " dead ", " wound ", " no sign of the moon ")
    "Ridiculous"  = @(" ridiculous ", " absurd ", " comic ", " nonsense ", " gonzo ", " cabaret ", " plot piracy ")
    "High Energy" = @(" fast ", " fire ", " thunder ", " storm ", " cocaine ", " high pressure ", " action ", " return ")
    "After Hours" = @(" after hours ", " late ", " dusk ", " velvet ", " cocktail ", " cabernet ", " smoke ", " brandy ", " midnight ")
  }

  foreach ($mood in $rules.Keys) {
    foreach ($needle in $rules[$mood]) {
      if ($haystack.Contains($needle)) {
        Add-MoodScore $scores $mood 1.0
      }
    }
  }

  if ($haystack.Contains("sultry")) {
    Add-MoodScore $scores "Louche Jazz" 1.0
    Add-MoodScore $scores "After Hours" 0.75
  }
  if ($haystack.Contains("bluegrass") -or $haystack.Contains("travelling")) {
    Add-MoodScore $scores "Sunny" 1.0
    Add-MoodScore $scores "Night Drive" 0.75
  }
  if ($haystack.Contains("reggae")) {
    Add-MoodScore $scores "Sunny" 1.5
  }
}

function Get-MoodGuessFromSubstack($post) {
  $scores = @{}
  $evidenceText = @(
    $post.title
    $post.subtitle
    $post.description
    $post.truncated_body_text
    $post.podcastUpload.name
  ) -join " "

  Add-MoodEvidence $scores $evidenceText

  if ($scores.Count -eq 0) {
    return @{
      Primary = "All"
      Moods = @("All")
      Confidence = 0.55
    }
  }

  $ranked = $scores.GetEnumerator() | Sort-Object -Property Value -Descending
  $moods = @($ranked[0].Key)
  foreach ($item in $ranked | Select-Object -Skip 1 -First 2) {
    if ($item.Value -ge 1.0) {
      $moods += $item.Key
    }
  }

  return @{
    Primary = $ranked[0].Key
    Moods = $moods
    Confidence = [Math]::Min(0.95, 0.65 + ($ranked[0].Value * 0.08))
  }
}

function Get-ArchivePage([int]$offset) {
  $separator = if ($ArchiveUrl.Contains("?")) { "&" } else { "?" }
  $url = "$ArchiveUrl${separator}offset=$offset"
  $content = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
  return ($content | ConvertFrom-Json)
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$trackProperties = @($manifest.tracks.PSObject.Properties)
$tracksByName = @{}
$tracksByKey = @{}

foreach ($property in $trackProperties) {
  $fileName = [System.IO.Path]::GetFileName($property.Name)
  $tracksByName[$fileName.ToLowerInvariant()] = $property

  $key = Get-NormalizedKey $fileName
  if ($key -and -not $tracksByKey.ContainsKey($key)) {
    $tracksByKey[$key] = New-Object System.Collections.Generic.List[object]
  }
  if ($key) {
    $tracksByKey[$key].Add($property)
  }
}

$matched = 0
$seenPostIds = @{}
$postsSeen = 0

for ($page = 0; $page -lt $MaxPages; $page += 1) {
  $offset = $page * $PageSize
  $posts = @(Get-ArchivePage $offset)
  if ($posts.Count -eq 0) {
    break
  }

  foreach ($post in $posts) {
    if ($seenPostIds.ContainsKey([string]$post.id)) {
      continue
    }
    $seenPostIds[[string]$post.id] = $true

    if (($post.section_id -ne $SectionId -and $post.section_slug -ne "songs-and-audio") -or $post.type -ne "podcast") {
      continue
    }

    $postsSeen += 1
    $uploadName = $post.podcastUpload.name
    $property = $null

    if ($uploadName -and $tracksByName.ContainsKey($uploadName.ToLowerInvariant())) {
      $property = $tracksByName[$uploadName.ToLowerInvariant()]
    } else {
      $key = Get-NormalizedKey $post.title
      if ($key -and $tracksByKey.ContainsKey($key) -and $tracksByKey[$key].Count -eq 1) {
        $property = $tracksByKey[$key][0]
      }
    }

    if (-not $property) {
      continue
    }

    $guess = Get-MoodGuessFromSubstack $post
    $entry = $property.Value
    $entry.primaryMood = $guess.Primary
    $entry.moods = $guess.Moods
    $entry.confidence = $guess.Confidence
    $entry.notes = "Substack-informed classification from public post '$($post.title)'."
    $entry | Add-Member -NotePropertyName substack -NotePropertyValue ([ordered]@{
      title = $post.title
      subtitle = $post.subtitle
      url = $post.canonical_url
      publishedAt = $post.post_date
      uploadName = $uploadName
      duration = $post.podcast_duration
    }) -Force

    $matched += 1
  }

  if ($posts.Count -lt $PageSize) {
    break
  }
}

$review = New-Object System.Collections.Generic.List[string]
foreach ($property in $manifest.tracks.PSObject.Properties) {
  if ($property.Value.confidence -lt 0.5) {
    $review.Add($property.Name) | Out-Null
  }
}

$manifest.review = $review.ToArray()
$manifest.updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$manifest | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Host "Substack posts inspected: $postsSeen"
Write-Host "Tracks enriched: $matched"
Write-Host "Review count now: $($review.Count)"
