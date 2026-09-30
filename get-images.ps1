# Downloads every photo listed in items.json from Wikimedia Commons into the images folder.
# Run from the miffy-fan-website folder:  powershell -ExecutionPolicy Bypass -File get-images.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path "images" | Out-Null

$items = Get-Content "items.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$headers = @{ "User-Agent" = "miffy-fan-website image fetcher (personal fan site)" }

foreach ($item in $items) {
    if (-not $item.image -or -not $item.credit -or -not $item.credit.download) { continue }
    $target = Join-Path "images" $item.image
    if (Test-Path $target) {
        Write-Host "Already have $($item.image)"
        continue
    }
    Write-Host "Downloading $($item.image)..."
    try {
        Invoke-WebRequest -Uri $item.credit.download -OutFile $target -Headers $headers -UseBasicParsing
    } catch {
        Write-Warning "Could not download $($item.image): $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "Done."
