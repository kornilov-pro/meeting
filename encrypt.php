<?php

require_once __DIR__ . "/Encryption.php";

$key = "ews-password";
$value = "\$y\$vwhkA{#Ve";

EncryptionStore::write($key, $value);
