@echo off
chcp 65001 > nul
title 3D Strom — Webový Prohlížeč (Blender NPR)
echo ===================================================================
echo   3D MODEL STROMU — WEBOVÝ PROHLÍŽEČ (Blender EEVEE Replikace)
echo ===================================================================
echo.
echo 1. Zjišťuji dostupnou verzi Pythonu...
set PYCMD=python
py -3.12 --version >nul 2>nul
if %errorlevel% equ 0 (
    set PYCMD=py -3.12
)

echo 2. Spouštím lokální webový server na portu 8080...
start "Strom 3D Web Server" /min %PYCMD% -m http.server 8080 --directory "%~dp0."

echo 3. Čekám na spuštění serveru...
timeout /t 1 > nul

echo 4. Otevírám 3D model ve webovém prohlížeči...
set "STROM_CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%STROM_CHROME%" set "STROM_CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%STROM_CHROME%" set "STROM_CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if exist "%STROM_CHROME%" (
    start "" "%STROM_CHROME%" "http://localhost:8080/web_viewer/index.html"
) else (
    echo Google Chrome nebyl nalezen. Otevrete v Chrome: http://localhost:8080/web_viewer/index.html
)

echo.
echo ===================================================================
echo   HOTOVO! Webový prohlížeč se nyní otevřel.
echo   Model obsahuje:
echo     - 9 932 listů se sezónními odstíny (zelená, zlatá, podzimní)
echo     - Kompletní kmen a kořenový systém
echo     - Slunce, rocni obdobi a spolecnou vodni bilanci
echo     - Kapitoly: fotosynteza, transpirace, koreny, semenace
echo ===================================================================
echo.
echo Pro ukončení serveru zavřete toto okno nebo minimalizované okno serveru.
pause
