<?php

namespace Meeting;

use DateTime;
use \jamesiarmes\PhpEws\Client;
use PDO;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__  . "/vendor/autoload.php";

$config = require_once(__DIR__ . "/config.php");

if (!$config["cache"]["enable"]) die("Cache disabled");

$client = new Client($config["ews"]["server"], $config["ews"]["email"], $config["ews"]["password"], $config["ews"]["version"]);
$getEwsEvents = new GetEwsEvents($client);
$pdo = new PDO($config["cache"]["dsn"], $config["cache"]["username"], $config["cache"]["password"]);
$saveEventsToCache = new SaveEventsToCache($pdo, $config["cache"]["table"]);
$cacheEvents = new CacheEventsFromEWS($getEwsEvents, $saveEventsToCache);

$cacheStart = new DateTime($config["cache"]["start"]);
$cacheEnd = new DateTime($config["cache"]["end"]);

$cacheEvents($config["meetings"], $cacheStart, $cacheEnd);
