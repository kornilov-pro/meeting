<?php

namespace Meeting;

use DateTime;
use DateTimeZone;
use \jamesiarmes\PhpEws\Client;
use PDO;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__  . "/vendor/autoload.php";

// Configuration
$config = require_once(__DIR__ . "/config.php");

$meetings = $config["meetings"];
$cacheEnable = $config["cache"]["enable"];
$client = new Client($config["ews"]["server"], $config["ews"]["email"], $config["ews"]["password"], $config["ews"]["version"]);
$getEwsEvents = new GetEwsEvents($client);
$pdo = $cacheEnable ? new PDO($config["cache"]["dsn"], $config["cache"]["username"], $config["cache"]["password"]) : new NullPDO();
$getCachedEvents = new GetCachedEvents($pdo, $config["cache"]["table"]);
$saveEventsToCache = new SaveEventsToCache($pdo, $config["cache"]["table"]);
$cacheEvents = new CacheEventsFromEWS($getEwsEvents, $saveEventsToCache);
$cacheStart = new DateTime($config["cache"]["start"]);
$cacheEnd = new DateTime($config["cache"]["end"]);

// Query
$start = new DateTime($_GET["start"] ?? "now", new DateTimeZone('UTC'));
$end = new DateTime($_GET["end"] ?? "now", new DateTimeZone('UTC'));
$force = ($_GET["force"] ?? "false") === "true" || ($_GET["force"] ?? "false") === "1";

$isInCacheRange = $cacheStart <= $start && $end <= $cacheEnd;
$useCache = $cacheEnable && $isInCacheRange;

if ($useCache && $force) $cacheEvents($meetings, $cacheStart, $cacheEnd);

$result = $useCache ? $getCachedEvents($meetings, $start, $end) : $getEwsEvents($meetings, $start, $end);
$result = array_map(function (array $events) {
    return array_map(function (Event $event) {
        return $event->array("c");
    }, $events);
}, $result);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
echo json_encode($result);
