# Script PowerShell para rebuild local (Windows)

Write-Host "🔨 Construindo nova imagem lab01-atualizado..." -ForegroundColor Cyan

Set-Location "DarkAccess\Labs\xss-challenge"

# Build da nova imagem
docker build -t lab01-atualizado .\tech-horizon

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Imagem lab01-atualizado criada com sucesso!" -ForegroundColor Green
    
    # Mostrar a imagem
    Write-Host ""
    Write-Host "📋 Informações da imagem:" -ForegroundColor Yellow
    docker images lab01-atualizado
    
    # Verificar CSS verde
    Write-Host ""
    Write-Host "🎨 Verificando tema verde na imagem:" -ForegroundColor Yellow
    $cssCheck = docker run --rm lab01-atualizado sh -c "cat /usr/share/nginx/html/assets/*.css" | Select-String "142 76%"
    
    if ($cssCheck) {
        Write-Host "✅ Tema verde confirmado!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Tema verde não encontrado" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ Erro ao criar imagem" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completo! Commit as alterações:" -ForegroundColor Green
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'Update lab01 to use lab01-atualizado image'" -ForegroundColor Cyan
Write-Host "   git push" -ForegroundColor Cyan
