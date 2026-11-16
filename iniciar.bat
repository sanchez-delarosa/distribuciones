@echo off
cd /d "%~dp0"
echo Iniciando servidor en http://localhost:8080 ...
start "" "http://localhost:8080"
C:\Python315\python.exe servidor.py
pause
