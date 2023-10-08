<?php

namespace Meeting;

use DateTime;

class CacheEventsFromEWS {

    private IGetEvents $getEvents;
    private SaveEventsToCache $save;

    function __construct(IGetEvents $getEvents, SaveEventsToCache $save) {
        $this->getEvents = $getEvents;
        $this->save = $save;
    }

    /**
     * 
     * @param array<string, string>[] $meetings 
     * @param DateTime $start 
     * @param DateTime $end 
     * @return void
     */
    function __invoke(array $meetings, DateTime $start, DateTime $end) {
        $events = ($this->getEvents)($meetings, $start, $end);
        $events = $this->flat($events);
        ($this->save)($events);
    }

    /**
     * 
     * @param array<string, Event[]> $events 
     * @return Event[] 
     */
    private function flat(array $events): array {
        return array_merge(...array_values($events));
    }
}
