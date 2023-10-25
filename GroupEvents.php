<?php

namespace Meeting;

class GroupEvents {

    private array $meetings;

    function __construct(array $meetings) {
        $this->meetings = $meetings;
    }

    /**
     * 
     * @param Event[] $events 
     * @return array<string, Event[]> location => Event[]
     */
    public function __invoke(array $events): array {
        return array_reduce($this->meetings, function (array $result, array $meeting) use ($events) {
            $location = $meeting["location"];
            $meetingEvents = array_filter($events, function (Event $event) use ($location) {
                return $event->location == $location;
            });
            $result[$location] = array_values($meetingEvents);
            return $result;
        }, []);
    }
}
