@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../vendor/phan/phan/tocheckstyle
php "%BIN_TARGET%" %*
