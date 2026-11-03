# Creates the Google Play upload key for Nabeeh on Windows and prepares the GitHub secrets.
#
# Run in PowerShell from any folder:
#   powershell -ExecutionPolicy Bypass -File make-upload-key.ps1
#
# You type the password yourself; it never leaves your computer except as the GitHub secret you paste.
# Keep upload.jks and the password somewhere safe (e.g. a password manager + a USB/cloud backup).
# Losing them means asking Google for an upload-key reset.

$ErrorActionPreference = "Stop"
$alias = "nabeeh"
$dir   = Join-Path $env:USERPROFILE "Documents\nabeeh-upload-key"
$jks   = Join-Path $dir "upload.jks"
$b64   = Join-Path $dir "upload.jks.base64.txt"

# 1. Java's keytool (comes with any JDK)
$keytool = (Get-Command keytool -ErrorAction SilentlyContinue).Source
if (-not $keytool) {
  $found = Get-ChildItem "C:\Program Files\Eclipse Adoptium","C:\Program Files\Java","C:\Program Files\Microsoft" `
           -Recurse -Filter keytool.exe -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found) { $keytool = $found.FullName }
}
if (-not $keytool) {
  Write-Host "Java is not installed. Installing Temurin JDK 21 with winget..." -ForegroundColor Yellow
  winget install --id EclipseAdoptium.Temurin.21.JDK -e --accept-package-agreements --accept-source-agreements
  $found = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Recurse -Filter keytool.exe -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $found) { throw "keytool not found after install. Close PowerShell, open it again and re-run this script." }
  $keytool = $found.FullName
}

if (Test-Path $jks) { throw "$jks already exists. Do NOT make a second key; use the one you have." }
New-Item -ItemType Directory -Force -Path $dir | Out-Null

# 2. Password (typed twice, hidden)
$p1 = Read-Host "Choose a key password (at least 6 characters)" -AsSecureString
$p2 = Read-Host "Type it again" -AsSecureString
$plain1 = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($p1))
$plain2 = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($p2))
if ($plain1 -ne $plain2) { throw "The two passwords are different. Run the script again." }
if ($plain1.Length -lt 6) { throw "Password must be at least 6 characters." }

# 3. Create the key (valid ~27 years). Same password for keystore and key.
& $keytool -genkeypair -v -keystore $jks -storetype PKCS12 -keyalg RSA -keysize 2048 -validity 10000 `
  -alias $alias -storepass $plain1 -keypass $plain1 `
  -dname "CN=Abdulaziz Bukhari, O=YaSalam, L=Madinah, C=SA"
$plain1 = $null; $plain2 = $null

# 4. Base64 for GitHub
[Convert]::ToBase64String([IO.File]::ReadAllBytes($jks)) | Set-Content -NoNewline $b64
Get-Content $b64 -Raw | Set-Clipboard

Write-Host ""
Write-Host "Done. Key saved in: $dir" -ForegroundColor Green
Write-Host "The base64 text is already copied to your clipboard."
Write-Host ""
Write-Host "Now open https://github.com/bukhaa0s-cyber/nabeeh/settings/secrets/actions and add 4 secrets:"
Write-Host "  ANDROID_KEYSTORE_BASE64   = paste (Ctrl+V) - also saved in upload.jks.base64.txt"
Write-Host "  ANDROID_KEYSTORE_PASSWORD = the password you just chose"
Write-Host "  ANDROID_KEY_ALIAS         = $alias"
Write-Host "  ANDROID_KEY_PASSWORD      = the same password"
Write-Host ""
Write-Host "Back up upload.jks + the password. Then delete upload.jks.base64.txt." -ForegroundColor Yellow
