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
    function __invoke(DateTime $start, DateTime $end) {
        $events = ($this->getEvents)($start, $end);
        ($this->save)($events);
    }
}
