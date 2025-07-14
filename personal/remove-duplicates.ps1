# Script para eliminar definiciones duplicadas de btn-refresh
$cssFile = "c:\Users\sotom\Documents\aduanas sistema\css\styles.css"
$content = Get-Content $cssFile -Raw

# Dividir por las secciones de btn-refresh
$btnRefreshPattern = '\/\* Botón de actualización \*\/\s*\.btn-refresh\s*\{[^}]+\}\s*\.btn-refresh:hover\s*\{[^}]+\}\s*\.btn-refresh:active\s*\{[^}]+\}\s*\.btn-refresh\s+i\s*\{[^}]+\}'

# Encontrar todas las coincidencias
$matches = [regex]::Matches($content, $btnRefreshPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

Write-Host "Se encontraron $($matches.Count) definiciones de btn-refresh"

# Si hay más de una, eliminar las adicionales
if ($matches.Count -gt 1) {
    # Mantener la primera, eliminar las demás
    for ($i = $matches.Count - 1; $i -ge 1; $i--) {
        $match = $matches[$i]
        $before = $content.Substring(0, $match.Index)
        $after = $content.Substring($match.Index + $match.Length)
        $content = $before + $after
        Write-Host "Eliminada definición duplicada #$($i + 1)"
    }
    
    # Guardar el archivo limpio
    Set-Content -Path $cssFile -Value $content -Encoding UTF8
    Write-Host "Archivo CSS actualizado sin duplicaciones"
} else {
    Write-Host "No se encontraron duplicaciones para eliminar"
}
