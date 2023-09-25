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
$ews_server = 'https://mail.office-map.ru/EWS/Exchange.asmx';
$ews_email = 'user1@staffmap.ru';
$ews_password = '$y$vwhkA{#Ve';

// E-mail пользователей, для отображения событий, все они должны поделиться своими календарями с юзером указанным в $ews_email
$meetings = [
    ['location' => 'Переговорная 1', 'user' => 'user1@staffmap.ru'],
    ['location' => 'Переговорная 2', 'user' => 'user2@staffmap.ru'],
    ['location' => 'Переговорная 3', 'user' => 'user3@staffmap.ru'],
    ['location' => 'Переговорная 4', 'user' => 'user4@staffmap.ru'],
    ['location' => 'Переговорная 5', 'user' => 'user5@staffmap.ru'],
    ['location' => 'Переговорная 6', 'user' => 'user6@staffmap.ru'],
    ['location' => 'Переговорная 7', 'user' => 'user7@staffmap.ru'],
    ['location' => 'Переговорная 8', 'user' => 'user8@staffmap.ru'],
    ['location' => 'Переговорная 9', 'user' => 'user9@staffmap.ru'],
    ['location' => 'Переговорная 10', 'user' => 'user10@staffmap.ru']
];


$client = new Client($ews_server, $ews_email, $ews_password, Client::VERSION_2016);

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
