<?php

class EncryptionStore {

    private static $filename_prefix = __DIR__ . "/encrypted/";

    public static function write($key, $data) {
        file_put_contents(EncryptionStore::filename($key), Encryption::encrypt($data));
    }

    public static function read($key) {
        return Encryption::decrypt(file_get_contents(EncryptionStore::filename($key)));
    }

    private static function filename($key) {
        return EncryptionStore::$filename_prefix . $key;
    }
}

class Encryption {

    static function encrypt($data) {
        openssl_public_encrypt($data, $result, RSA_PUBLIC_KEY);
        return $result;
    }

    static function decrypt($decrypted) {
        openssl_private_decrypt($decrypted, $result, RSA_PRIVATE_KEY);
        return $result;
    }
}

const RSA_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH383QUTS/Q0UfC3x/Oh4gwryyhD
JmmG3xgvw9lhk6QxcaaMGzmtnhWxQT42VeDiCEJ17zX9AoyLw/lr3d4qBUGxkSSu
y3k/NJkpajKlc7ybDhYdjGD3jGO3cr+VzprLWeBTbEVS0m+7GK4Q4rrt7U1bkA6i
PD5oeSouCP1DMyK1AgMBAAE=
-----END PUBLIC KEY-----";

const RSA_PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgH383QUTS/Q0UfC3x/Oh4gwryyhDJmmG3xgvw9lhk6QxcaaMGzmt
nhWxQT42VeDiCEJ17zX9AoyLw/lr3d4qBUGxkSSuy3k/NJkpajKlc7ybDhYdjGD3
jGO3cr+VzprLWeBTbEVS0m+7GK4Q4rrt7U1bkA6iPD5oeSouCP1DMyK1AgMBAAEC
gYAEL18kKQTv4sEKDwDMXgdFQjsoZjqjbMCCbCvET9J4tM/CqYrJ+rNyowW4zFND
+h4uHv7IO1RXWNk0stmW5Kxx+ww40xTDkEzHJ/DRyiJVaj+Mnq0x1ajc2ard+mBZ
nhBzccm4R1wnUQOYbsOdDPMPXoWIzL/dI00ZTcT/8Kth7QJBANpMILpbkioWj7ow
sB01dO+n1huMtcz58KZ1rZEffJVt/VwqL56ORukidCsOLx1PzjTVK/JHYaMVWfIh
3upL0x8CQQCTv1PDzVA0AQ4r2MM2vKC8knsDUGUZFhf8rZ6DaSag7EwQ38Toi1de
BoThPRuuvETBupzNv0DSxIV11yj4NEOrAkAS3OcrE0STDHYI8bIWJAththADO2pu
Nt67k4mW87CRPPranu6UddjcxlRhcA1ULBQ2boEoo1Blhi/Kg3C+sCSjAkAZkTlg
n83qQeh+4/LcLQYvu7V33FiyX6Vk/3J30SFzJZEANojvqPVEeyJRi+6XbVMEp1Nt
M1R3ZLSnsMURNpIjAkAFFnR0+XPo2UF1t3YPl6kmgXG4QRBkuQLaS1Ys1NONxN2l
qPr95J5Zfe46PG93VZCuNsvHhZ/V205/YBTL1sJN
-----END RSA PRIVATE KEY-----";
