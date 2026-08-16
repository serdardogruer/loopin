@echo off
chcp 65001 > nul
echo ===================================================
echo     Loopin Uygulama Prototipi Baslatiliyor...
echo ===================================================
echo.

set PORT=8080
set URL=http://localhost:%PORT%

echo Sunucu konumu: %~dp0prototype
echo Adres: %URL%
echo.

cd /d "%~dp0prototype"

echo Python kurulumu kontrol ediliyor...
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Python bulundu. HTTP sunucusu baslatiliyor...
    :: Sunucuyu ayri bir komut penceresinde baslat
    start "Loopin Server" cmd /c "python -m http.server %PORT%"
    
    :: Sunucunun hazir olmasi icin 2 saniye bekle
    timeout /t 2 /nobreak >nul
    
    :: Tarayiciyi ac
    start %URL%
) else (
    echo.
    echo Python bulunamadi, dogrudan HTML dosyasi tarayicida aciliyor...
    start index.html
)

pause
