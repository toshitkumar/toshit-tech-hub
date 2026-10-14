# Deploy script for Toshit.Tech to GitHub Pages
Write-Host "🚀 Building Toshit.Tech for GitHub Pages..." -ForegroundColor Cyan

# Temporarily move API routes during static HTML export
if (Test-Path "app\api") { 
    Move-Item app\api .\api-backup -Force 
}

$env:GITHUB_PAGES = 'true'
npm run build

# Restore API routes
if (Test-Path ".\api-backup") { 
    Move-Item .\api-backup app\api -Force 
}

# Add .nojekyll so GitHub Pages doesn't ignore _next folder
New-Item -ItemType File -Force -Path "out\.nojekyll" | Out-Null

Write-Host "🌐 Pushing to GitHub Pages (gh-pages branch)..." -ForegroundColor Cyan
Push-Location out
git init | Out-Null
git config user.name "Toshit Kumar"
git config user.email "toshitkumar@users.noreply.github.com"
git checkout -B gh-pages | Out-Null
git add -A
git commit -m "deploy: update live site on GitHub Pages" | Out-Null
git remote add origin https://github.com/toshitkumar/toshit-tech-hub.git 2>$null
git push -u -f origin gh-pages

Pop-Location

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🔗 Your website is LIVE at: https://toshitkumar.github.io/toshit-tech-hub/" -ForegroundColor Green
