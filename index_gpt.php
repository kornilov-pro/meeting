<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

use \jamesiarmes\PhpEws\Client;
use \jamesiarmes\PhpEws\Request\FindItemType;
use \jamesiarmes\PhpEws\ArrayType\NonEmptyArrayOfBaseFolderIdsType;
use \jamesiarmes\PhpEws\Enumeration\DefaultShapeNamesType;
use \jamesiarmes\PhpEws\Enumeration\DistinguishedFolderIdNameType;
use \jamesiarmes\PhpEws\Type\DistinguishedFolderIdType;
use \jamesiarmes\PhpEws\Type\CalendarViewType;
use jamesiarmes\PhpEws\Type\ContactsViewType;
use jamesiarmes\PhpEws\Type\EmailAddressType;
use jamesiarmes\PhpEws\Enumeration\ItemQueryTraversalType;

// Configuration
$config = require_once(__DIR__ . "/config.php");

$client = new Client($config["ews"]["server"], $config["ews"]["email"], $config["ews"]["password"], $config["ews"]["version"]);

// Set the start and end date for fetching events
$start_date = new DateTime($_GET["start"] ?? "now", new DateTimeZone('UTC'));
$end_date = new DateTime($_GET["end"] ?? "now", new DateTimeZone('UTC'));

$request = new FindItemType();
$request->Traversal = ItemQueryTraversalType::SHALLOW;
$request->ItemShape = new \jamesiarmes\PhpEws\Type\ItemResponseShapeType();  // Modified line
$request->ItemShape->BaseShape = DefaultShapeNamesType::ALL_PROPERTIES;  // Modified line
$request->ParentFolderIds = new NonEmptyArrayOfBaseFolderIdsType();

$request->CalendarView = new CalendarViewType();
$request->CalendarView->StartDate = $start_date->format('c');
$request->CalendarView->EndDate = $end_date->format('c');

$meetings = $config["meetings"];
$result = [];
foreach ($meetings as $meeting) {
    $folder_id = new DistinguishedFolderIdType();
    $folder_id->Id = DistinguishedFolderIdNameType::CALENDAR;
    $folder_id->Mailbox = new EmailAddressType();
    $folder_id->Mailbox->EmailAddress = $meeting['user'];

    $location = $meeting['location'];
    $result[$location] = [];

    $request->ParentFolderIds->DistinguishedFolderId = $folder_id;

    $response = $client->FindItem($request);
    try {
        if (!property_exists($response, "ResponseMessages") && !is_object($response->ResponseMessages))
            throw new Exception("ResponseMessages not exists");
        if (
            !property_exists($response->ResponseMessages, "FindItemResponseMessage")
            || !is_array($response->ResponseMessages->FindItemResponseMessage)
        )
            throw new Exception("FindItemResponseMessage not exists");
        if (
            !array_key_exists(0, $response->ResponseMessages->FindItemResponseMessage)
            || !is_object($response->ResponseMessages->FindItemResponseMessage[0])
        )
            throw new Exception("FindItemResponseMessage is empty");
        if (
            !property_exists($response->ResponseMessages->FindItemResponseMessage[0], "RootFolder")
            || !is_object($response->ResponseMessages->FindItemResponseMessage[0]->RootFolder)
        )
            throw new Exception("RootFolder not exists");
        if (
            !property_exists($response->ResponseMessages->FindItemResponseMessage[0]->RootFolder, "Items")
            || !is_object($response->ResponseMessages->FindItemResponseMessage[0]->RootFolder->Items)
        )
            throw new Exception("Items not exists");
        if (
            !property_exists($response->ResponseMessages->FindItemResponseMessage[0]->RootFolder->Items, "CalendarItem")
        )
            throw new Exception("CalendarItem not exists");

        foreach ($response->ResponseMessages->FindItemResponseMessage[0]->RootFolder->Items->CalendarItem as $event) {
            $result[$location][] = [
                "subject" => $event->Subject,
                "start" => $event->Start,
                "end" => $event->End,
                "location" => $location,
            ];
        }
    } catch (\Throwable $e) {
    }
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
echo json_encode($result);
