Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  🚀 Instalador Automático RP CRIA RJ"
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se o Node está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Baixe e instale de: https://nodejs.org/"
    exit 1
}

# Verifica se o Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não encontrado. Baixe e instale de: https://git-scm.com/"
    exit 1
}

# Instala dependências
Write-Host "📦 Instalando dependências do projeto..."
npm install

# Solicita o token do Discord via prompt
$token = Read-Host -Prompt "🛡 Digite seu TOKEN_DISCORD"

$envPath = ".env"
if (Test-Path $envPath) {
    Write-Host "⚠️  .env já existe. Será substituído."
    Remove-Item $envPath
}

Set-Content -Path $envPath -Value "TOKEN_DISCORD=$token"
Write-Host "✅ .env criado com sucesso!"

# Inicia o projeto
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "     🟢 Iniciando o projeto..."
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
npm run start
