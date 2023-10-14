<?php

namespace Meeting;

class IsLeaderMapTokenValid {

    private int $workspace_id;
    private string $leadermap_bootstrap_filename;

    function __construct(int $workspace_id, string $leadermap_bootstrap_filename) {
        $this->workspace_id = $workspace_id;
        $this->leadermap_bootstrap_filename = $leadermap_bootstrap_filename;
    }

    function __invoke(string $token): bool {
        /**
         * Для проверки токена через \LeaderMap\WSToken\WSToken, токен должен быть либо в куке, либо в заголовке
         * Также после отработки \LeaderMap\WSToken\WSToken будет создана кука (и заголовок?) с токеном
         */
        $_COOKIE[$this->cookieName()] = $token;
        require_once($this->leadermap_bootstrap_filename);
        $wsToken = \LeaderMap\WSToken\WSToken::F($this->workspace_id);
        return $wsToken->valid;
    }

    private function cookieName(): string {
        return "x-ws-auth-{$this->workspace_id}";
    }
}
