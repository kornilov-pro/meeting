/// <reference path="../config.js" />

async function getToken() {
	return localStorage.getItem(CONFIG.token_local_storage_key) ?? "";
}
