# Variables
$Owner = "nfdi4plants"
$Repo = "Swate"
$TagName = "1.0.1"
$AssetName = "SwateClient.zip"
$DownloadUrl = "https://github.com/$Owner/$Repo/releases/download/$TagName/$AssetName"
$DestDir = "./resources/swate"

# Create directory if it does not exist
if (-not (Test-Path $DestDir)) {
    New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
}

# Download file
Invoke-WebRequest -Uri $DownloadUrl -OutFile "$DestDir/$AssetName"

# Unzip file (requires PowerShell 5+)
Expand-Archive -Path "$DestDir/$AssetName" -DestinationPath $DestDir -Force

Write-Host "Downloaded $AssetName successfully!"
