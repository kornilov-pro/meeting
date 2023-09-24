@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../vendor/phan/phan/phan_client
php "%BIN_TARGET%" %*
