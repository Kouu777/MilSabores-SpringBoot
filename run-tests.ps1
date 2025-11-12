#!/usr/bin/env powershell
# Script para ejecutar tests de integración del proyecto MilSabores

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("perfil", "resenas", "todos")]
    [string]$TestType = "todos",
    
    [switch]$Verbose
)

$backendPath = "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend"

Write-Host "=== MilSabores Test Runner ===" -ForegroundColor Cyan
Write-Host "Tipo de test: $TestType" -ForegroundColor Yellow
Write-Host ""

Set-Location $backendPath

switch ($TestType) {
    "perfil" {
        Write-Host "Ejecutando tests de PERFIL DE USUARIO..." -ForegroundColor Green
        if ($Verbose) {
            .\mvnw.cmd test -Dtest=UsuarioControllerTest
        } else {
            .\mvnw.cmd test -Dtest=UsuarioControllerTest -q
        }
    }
    "resenas" {
        Write-Host "Ejecutando tests de RESEÑAS..." -ForegroundColor Green
        if ($Verbose) {
            .\mvnw.cmd test -Dtest=ReviewControllerTest
        } else {
            .\mvnw.cmd test -Dtest=ReviewControllerTest -q
        }
    }
    "todos" {
        Write-Host "Ejecutando TODOS los tests..." -ForegroundColor Green
        if ($Verbose) {
            .\mvnw.cmd test -Dtest=UsuarioControllerTest,ReviewControllerTest
        } else {
            .\mvnw.cmd test -Dtest=UsuarioControllerTest,ReviewControllerTest -q
        }
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Tests completados exitosamente" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Tests fallaron. Revisa los errores arriba." -ForegroundColor Red
}
