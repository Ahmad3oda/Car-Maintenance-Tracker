@echo off

rem Paths are relative to this script, so the repo can live anywhere.
set "ROOT=%~dp0"

start "Backend" cmd /k "cd /d "%ROOT%Backend\app" && npm run start:dev"

start "Frontend" cmd /k "cd /d "%ROOT%Frontend" && npm start -- --host 0.0.0.0"

timeout /t 5 /nobreak >nul

start http://localhost:4200
