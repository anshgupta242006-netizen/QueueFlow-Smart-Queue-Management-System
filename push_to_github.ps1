param (
    [string]$RepoUrl
)

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  QueueLess - Automated GitHub Repository Push Tool" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Enter your GitHub Repository URL (e.g. https://github.com/username/multimodal-chatbot.git)"
}

if (-not $RepoUrl) {
    Write-Host "[ERROR] No GitHub URL provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/4] Preparing Git workspace..." -ForegroundColor Yellow
git add .
$status = git status --porcelain
if ($status) {
    Write-Host "[2/4] Committing pending changes..." -ForegroundColor Yellow
    git commit -m "Complete QueueLess project setup and documentation"
} else {
    Write-Host "[2/4] Working tree clean. Ready to push." -ForegroundColor Green
}

Write-Host "[3/4] Configuring remote origin to $RepoUrl..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "[4/4] Pushing code to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=====================================================" -ForegroundColor Green
    Write-Host "  SUCCESS: Project successfully uploaded to GitHub!" -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Green
} else {
    Write-Host "`n[NOTICE] If prompted for credentials, sign in via browser or provide your GitHub Personal Access Token." -ForegroundColor Magenta
}

