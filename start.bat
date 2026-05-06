@echo off
title AI 跨境电商助手 - 开发服务器
cd /d "%~dp0"
echo ========================================
echo   AI 跨境电商助手 - 开发服务器
echo ========================================
echo.
echo 项目: %cd%
echo.
echo 启动中...
echo.
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo 启动失败，请确保已执行 npm install
    pause
)
