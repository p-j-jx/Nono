@echo off
echo ========================================
echo   取消开机自启 - AI 跨境电商助手
echo ========================================
echo.
powershell -Command ^
    Unregister-ScheduledTask -TaskName "AIEcommerceDevServer" -Confirm:$false; ^
    if ($?) { Write-Host "已取消开机自启" -ForegroundColor Green } else { Write-Host "未找到自启任务" -ForegroundColor Yellow }
echo.
pause
