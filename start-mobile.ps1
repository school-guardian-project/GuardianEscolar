# Levanta los túneles públicos, escribe sus URLs en el .env móvil y reinicia Expo.
# Funciona desde cualquier red: no depende de la IP local. Ejecutar desde la raíz del proyecto.
$ErrorActionPreference = 'Continue'
$envFile = Join-Path $PSScriptRoot 'dvlp-front\dvlp-movil\guardian-escolar\.env'

docker compose up -d cloudflared cloudflared-forgot | Out-Null

function Get-TunnelUrl($container) {
    for ($i = 0; $i -lt 40; $i++) {
        $m = (docker logs $container 2>&1 | Out-String) |
            Select-String -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches
        if ($m) { return $m.Matches[-1].Value }
        Start-Sleep -Seconds 2
    }
    throw "No se obtuvo la URL de $container"
}

$api = Get-TunnelUrl 'sg-cloudflared'
$forgot = Get-TunnelUrl 'sg-cloudflared-forgot'

$lines = Get-Content $envFile | Where-Object { $_ -notmatch '^(EXPO_PUBLIC_API_URL|EXPO_PUBLIC_FORGOT_INFORMATION_API_URL)=' }
$lines += "EXPO_PUBLIC_API_URL=$api"
$lines += "EXPO_PUBLIC_FORGOT_INFORMATION_API_URL=$forgot"
[IO.File]::WriteAllLines($envFile, [string[]]$lines)

docker compose up -d --force-recreate expo | Out-Null
Write-Host "API:    $api"
Write-Host "Forgot: $forgot"


