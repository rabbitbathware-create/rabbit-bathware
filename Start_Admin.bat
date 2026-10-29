@echo off
echo Starting Bridge Server for CeramicInfo Integration...
start /b bridge.exe

echo Opening Admin Portal...
start admin.html

echo Done! You can close this window.
timeout /t 3
