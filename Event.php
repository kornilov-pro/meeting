<?php

namespace Meeting;

use DateTime;

class Event {
    public string $subject;
    public DateTime $start;
    public DateTime $end;
    public string $location;
    public string $meeting_email;

    function __construct(string $subject, DateTime $start, DateTime $end, string $location, string $meeting_email) {
        $this->subject = $subject;
        $this->start = $start;
        $this->end = $end;
        $this->location = $location;
        $this->meeting_email = $meeting_email;
    }

    public function array(string $dateFormat): array {
        return [
            "subject" => $this->subject,
            "start" => $this->start->format($dateFormat),
            "end" => $this->end->format($dateFormat),
            "location" => $this->location,
            "meeting_email" => $this->meeting_email,
        ];
    }

    public static function fromArray(array $array): Event {
        return new Event(
            $array["subject"] ?? "",
            new DateTime($array["start"]),
            new DateTime($array["end"]),
            $array["location"],
            $array["meeting_email"],
        );
    }
}
