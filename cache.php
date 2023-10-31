<?php

namespace Meeting;

use DateTime;
use EncryptionStore;
use \jamesiarmes\PhpEws\Client;
use PDO;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__  . "/vendor/autoload.php";
require_once __DIR__  . "/Encryption.php";

$config = require_once(__DIR__ . "/config.php");

if (!$config["cache"]["enable"]) die("Cache disabled");

$ewsPassword = EncryptionStore::read("ews-password") ?? $config["ews"]["password"];
$client = new Client($config["ews"]["server"], $config["ews"]["email"], $ewsPassword, $config["ews"]["version"]);
$getEwsEvents = new GetEwsEvents($client, $config["meetings"]);
$cachePassword = EncryptionStore::read("cache-password") ?? $config["cache"]["password"];
$pdo = new PDO($config["cache"]["dsn"], $config["cache"]["username"], $cachePassword);
$saveEventsToCache = new SaveEventsToCache($pdo, $config["cache"]["table"]);
$cacheEvents = new CacheEventsFromEWS($getEwsEvents, $saveEventsToCache);

$cacheStart = new DateTime($config["cache"]["start"]);
$cacheEnd = new DateTime($config["cache"]["end"]);

$cacheEvents($cacheStart, $cacheEnd);
