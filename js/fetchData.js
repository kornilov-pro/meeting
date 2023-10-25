/// <reference path="../config.js" />
/// <reference path="./utils.js" />
/// <reference path="./redirectToLogin.js" />
/// <reference path="./getToken.js" />

var INITIAL_TIMEOUT = 1000;
var INITIAL_FORCE_TIMEOUT = 5000;
var MAX_TIMEOUT = 150000;
var TIMEOUT_MULTIPLIER = 3;

/**
 *
 * @param {Date} start
 * @param {Date} end
 * @param {boolean} [force]
 * @returns {Promise<Record<string, {
 *  subject: string;
 *  start: string;
 *  end: string;
 *  location: string;
 *  meeting_email: string;
 * }[]>>}
 */
async function fetchData(start, end, force) {
	var url = `index_gpt.php?start=${start.toISOString()}&end=${end.toISOString()}&force=${force ? "true" : "false"}`;
	var token = await getToken();
	var headers = { [CONFIG.header_token_fieldname]: token };
	return retry(
		(repeat, timeout) =>
			fetchWithTimeout(url, { timeout, headers })
				.catch((e) => {
					if (timeout < MAX_TIMEOUT && e.name === "AbortError") repeat(timeout * TIMEOUT_MULTIPLIER);
					else throw e;
				})
				.then((response) => {
					if (response.status === 403) redirectToLogin();
					return response.json();
				}),
		force ? INITIAL_FORCE_TIMEOUT : INITIAL_TIMEOUT
	);
}
