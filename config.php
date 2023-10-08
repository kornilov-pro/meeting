<?php

use jamesiarmes\PhpEws\Client;

return [
    "ews" => [
        "server" => "https://mail.office-map.ru/EWS/Exchange.asmx",
        "email" => "user1@staffmap.ru",
        "password" => '$y$vwhkA{#Ve',
        "version" => Client::VERSION_2016
    ],
    // E-mail пользователей, для отображения событий, все они должны поделиться своими календарями с юзером указанным в ews.email
    "meetings" => [
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
    ]
];
