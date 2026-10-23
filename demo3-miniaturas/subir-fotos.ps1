# Sube todas las imágenes de una carpeta al bucket de originales.
# Uso: .\subir-fotos.ps1 <nombre-del-stack> [carpeta]
# Ej.: .\subir-fotos.ps1 miniaturas-demo .\fotos
param(
    [Parameter(Mandatory = $true)][string]$Stack,
    [string]$Carpeta = ".\fotos"
)
$ErrorActionPreference = "Stop"

$Cuenta = aws sts get-caller-identity --query Account --output text
$Originales = "$Stack-originales-$Cuenta"

Write-Host "Subiendo $Carpeta a s3://$Originales/ ..."
aws s3 cp $Carpeta "s3://$Originales/" --recursive `
    --exclude "*" --include "*.jpg" --include "*.jpeg" --include "*.png"

Write-Host "Listo. Miniaturas en s3://$Stack-miniaturas-$Cuenta/"
