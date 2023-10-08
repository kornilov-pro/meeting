<?php

namespace Meeting;

use DateTime;
use PDO;

class GetCachedEvents implements IGetEvents {

    private const SQL_DATETIME_FORMAT = "Y-m-d H:i:s";
    private const OPTIONS = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];

    private PDO $pdo;
    private string $table;

    function __construct(PDO $pdo, string $table) {
        $this->pdo = $pdo;
        $this->table = $table;
    }

    public function __invoke(array $meetings, DateTime $start, DateTime $end): array {
        $query = "SELECT location, subject, start, end, location FROM $this->table WHERE start <= :end AND end >= :start";
        $stmt = $this->pdo->prepare($query, self::OPTIONS);
        $stmt->execute([
            "start" => $start->format(self::SQL_DATETIME_FORMAT),
            "end" => $end->format(self::SQL_DATETIME_FORMAT),
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_FUNC | PDO::FETCH_GROUP, function ($subject, $start, $end, $location) {
            return new Event($subject, new DateTime($start), new DateTime($end), $location);
        });
        $locations = array_map(function (array $meeting) {
            return $meeting["location"];
        }, $meetings);
        return array_merge(array_fill_keys($locations, []), $result);
    }
}
