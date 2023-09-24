@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../vendor/phan/phan/phan
php "%BIN_TARGET%" %*
