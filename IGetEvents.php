<?php

namespace Meeting;

use DateTime;

interface IGetEvents {

    /**
     * 
     * @param DateTime $start 
     * @param DateTime $end 
     * @return array<string, Event[]> MeetingName => MeetingEvents
     */
    function __invoke(DateTime $start, DateTime $end): array;
}
