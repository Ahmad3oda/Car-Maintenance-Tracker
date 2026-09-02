@echo off

start "Backend" cmd /k "cd /d E:\Playground\dev-nestjs\Car-Maintenance-Tracker\Backend\app && npm run start:dev"

start "Frontend" cmd /k "cd /d E:\Playground\dev-nestjs\Car-Maintenance-Tracker\Frontend && ng s --host 0.0.0.0"

timeout /t 5 /nobreak >nul

start http://localhost:4200a