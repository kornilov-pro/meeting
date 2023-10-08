<?php

namespace Meeting;

use DateTime;

interface IGetEvents {

    /**
     * 
     * @param array<string, string>[] $meetings 
     * @param DateTime $start 
     * @param DateTime $end 
     * @return array<string, array[]> MeetingName => MeetingEvents
     */
    function __invoke(array $meetings, DateTime $start, DateTime $end): array;
}
