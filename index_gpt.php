<?php

namespace Meeting;

use DateTime;
use DateTimeZone;
use \jamesiarmes\PhpEws\Client;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__  . "/vendor/autoload.php";

// Configuration
$config = require_once(__DIR__ . "/config.php");

$client = new Client($config["ews"]["server"], $config["ews"]["email"], $config["ews"]["password"], $config["ews"]["version"]);
$getEwsEvents = new GetEwsEvents($client);

$start = new DateTime($_GET["start"] ?? "now", new DateTimeZone('UTC'));
$end = new DateTime($_GET["end"] ?? "now", new DateTimeZone('UTC'));

$result = $getEwsEvents($config["meetings"], $start, $end);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
echo json_encode($result);
