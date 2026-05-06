@echo off
echo ========================================
echo   设置开机自启 - AI 跨境电商助手
echo ========================================
echo.
echo 将创建开机自启任务，每次登录时自动启动开发服务器
echo.

:: Get the script directory
set "SCRIPT_DIR=%~dp0"
set "START_BAT=%SCRIPT_DIR%start.bat"

:: Create scheduled task using PowerShell
powershell -Command ^
    $action = New-ScheduledTaskAction -Execute "%START_BAT%" -WorkingDirectory "%SCRIPT_DIR%"; ^
    $trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME; ^
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; ^
    $task = New-ScheduledTask -Action $action -Trigger $trigger -Settings $settings; ^
    Register-ScheduledTask -TaskName "AIEcommerceDevServer" -InputObject $task -Force; ^
    if ($?) { Write-Host "开机自启设置成功！" -ForegroundColor Green } else { Write-Host "设置失败" -ForegroundColor Red }

echo.
echo 你可以通过「任务计划程序」查看和管理此任务
echo 任务名称：AIEcommerceDevServer
echo.
echo 如果想取消开机自启，运行：unstart.bat
echo.
pause
