<?php

namespace Meeting;

use DateTime;
use Exception;
use jamesiarmes\PhpEws\Client;
use \jamesiarmes\PhpEws\Request\FindItemType;
use \jamesiarmes\PhpEws\ArrayType\NonEmptyArrayOfBaseFolderIdsType;
use \jamesiarmes\PhpEws\Enumeration\DefaultShapeNamesType;
use \jamesiarmes\PhpEws\Enumeration\DistinguishedFolderIdNameType;
use \jamesiarmes\PhpEws\Type\DistinguishedFolderIdType;
use \jamesiarmes\PhpEws\Type\CalendarViewType;
use jamesiarmes\PhpEws\Type\EmailAddressType;
use jamesiarmes\PhpEws\Enumeration\ItemQueryTraversalType;

class GetEwsEvents implements IGetEvents {

    private Client $client;
    private array $meetings;

    function __construct(
        Client $client,
        array $meetings
    ) {
        $this->client = $client;
        $this->meetings = $meetings;
    }

    public function __invoke(DateTime $start, DateTime $end): array {
        $request = new FindItemType();
        $request->Traversal = ItemQueryTraversalType::SHALLOW;
        $request->ItemShape = new \jamesiarmes\PhpEws\Type\ItemResponseShapeType();
        $request->ItemShape->BaseShape = DefaultShapeNamesType::ALL_PROPERTIES;
        $request->ParentFolderIds = new NonEmptyArrayOfBaseFolderIdsType();

        $request->CalendarView = new CalendarViewType();
        $request->CalendarView->StartDate = $start->format('c');
        $request->CalendarView->EndDate = $end->format('c');

        return array_reduce($this->meetings, function (array $result, array $meeting) use ($request) {
            $location = $meeting["location"];
            $user = $meeting["user"];
            return array_merge($result, $this->getMeetingEvents($request, $location, $user));
        }, []);
    }

    /**
     * 
     * @param FindItemType $request 
     * @param string $location 
     * @param string $user 
     * @return Event[] 
     */
    private function getMeetingEvents(FindItemType $request, string $location, string $user): array {
        $folder_id = new DistinguishedFolderIdType();
        $folder_id->Id = DistinguishedFolderIdNameType::CALENDAR;
        $folder_id->Mailbox = new EmailAddressType();
        $folder_id->Mailbox->EmailAddress = $user;

        $request->ParentFolderIds->DistinguishedFolderId = $folder_id;

        $response = $this->client->FindItem($request);
        $result = [];
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
                try {
                    $result[] = new Event(
                        $event->Subject,
                        new DateTime($event->Start),
                        new DateTime($event->End),
                        $location,
                        $user
                    );
                } catch (\Throwable $e) {
                }
            }
        } catch (\Throwable $e) {
        }

        return $result;
    }
}
