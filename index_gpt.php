<?php

namespace Meeting;

use DateTime;
use DateTimeZone;
use EncryptionStore;
use \jamesiarmes\PhpEws\Client;
use PDO;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__  . "/vendor/autoload.php";
require_once __DIR__  . "/Encryption.php";

// Configuration
$config = require_once(__DIR__ . "/config.php");
$authConfig = $config["auth"];

$meetings = $config["meetings"];
$cacheEnable = $config["cache"]["enable"];
$ewsPassword = EncryptionStore::read("ews-password") ?? $config["ews"]["password"];
$client = new Client($config["ews"]["server"], $config["ews"]["email"], $ewsPassword, $config["ews"]["version"]);
$getEwsEvents = new GetEwsEvents($client, $meetings);
$cachePassword = EncryptionStore::read("cache-password") ?? $config["cache"]["password"];
$pdo = $cacheEnable ? new PDO($config["cache"]["dsn"], $config["cache"]["username"], $cachePassword) : new NullPDO();
$getCachedEvents = new GetCachedEvents($pdo, $config["cache"]["table"]);
$saveEventsToCache = new SaveEventsToCache($pdo, $config["cache"]["table"]);
$cacheEvents = new CacheEventsFromEWS($getEwsEvents, $saveEventsToCache);
$cacheStart = new DateTime($config["cache"]["start"]);
$cacheEnd = new DateTime($config["cache"]["end"]);
$isLeaderMapTokenValid = new IsLeaderMapTokenValid(
    $authConfig["leadermap_workspace_id"],
    $authConfig["leadermap_bootstrap_filename"]
);
$groupEvents = new GroupEvents($meetings);

// Query
$start = new DateTime($_GET["start"] ?? "now", new DateTimeZone('UTC'));
$end = new DateTime($_GET["end"] ?? "now", new DateTimeZone('UTC'));
$force = ($_GET["force"] ?? "false") === "true" || ($_GET["force"] ?? "false") === "1";

$url_token_fieldname = $authConfig["url_token_fieldname"];
$header_token_fieldname = $authConfig["header_token_fieldname"];
$headers = getallheaders() ?? [];
$urlToken = $url_token_fieldname && array_key_exists($url_token_fieldname, $_GET) ? $_GET[$url_token_fieldname] : "";
$headerToken = $header_token_fieldname && array_key_exists($header_token_fieldname, $headers) ? $headers[$header_token_fieldname] : "";
$token = $urlToken ? $urlToken : $headerToken;

if ($authConfig["enable"] && !$isLeaderMapTokenValid($token)) {
    header("HTTP/1.1 403 Forbidden");
    die();
}

$isInCacheRange = $cacheStart <= $start && $end <= $cacheEnd;
$useCache = $cacheEnable && $isInCacheRange;

if ($useCache && $force) $cacheEvents($cacheStart, $cacheEnd);

$result = $useCache ? $getCachedEvents($start, $end) : $getEwsEvents($start, $end);
usort($result, function (Event $a, Event $b) { // sort by start
    return $a->start->getTimestamp() - $b->end->getTimestamp();
});
$result = $groupEvents($result);
$result = array_map(function (array $data) { // to array
    return [
        "meeting_email" => $data["meeting_email"],
        "events" => array_map(function (Event $event) {
            return $event->array("c");
        }, $data["events"])
    ];
}, $result);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
echo json_encode($result);
