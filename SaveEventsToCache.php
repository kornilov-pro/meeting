<?php

namespace Meeting;

use PDO;

class SaveEventsToCache {

    private const SQL_DATETIME_FORMAT = "Y-m-d H:i:s";
    private const OPTIONS = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];

    private PDO $pdo;
    private string $table;

    function __construct(PDO $pdo, string $table) {
        $this->pdo = $pdo;
        $this->table = $table;
    }

    /**
     * 
     * @param Event[] $events 
     * @return void 
     */
    function __invoke(array $events) {
        $this->truncate();
        foreach ($events as $event) {
            $this->insert($event);
        }
    }

    private function truncate(): void {
        $this->pdo->prepare("TRUNCATE $this->table", self::OPTIONS)->execute();
    }

    private function insert(Event $event): void {
        $sql = "INSERT INTO $this->table (subject, start, end, location) VALUES (:subject, :start, :end, :location)";
        $this->pdo->prepare($sql, self::OPTIONS)->execute($event->array(self::SQL_DATETIME_FORMAT));
    }
}
