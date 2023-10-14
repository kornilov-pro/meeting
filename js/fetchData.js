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
	return [
		{
			subject: "Ivanov Ivan",
			start: "2023-09-11T11:30:00Z",
			end: "2023-09-11T12:00:00Z",
			location: "Переговорная 7.3 (7-й этаж)",
		},
		{
			subject: "Dima Smart",
			start: "2023-09-11T12:30:00Z",
			end: "2023-09-11T15:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Ligth Sky",
			start: "2023-09-11T11:30:00Z",
			end: "2023-09-11T12:00:00Z",
			location: "Переговорная 7.2 (7-й этаж)",
		},
		{
			subject: "Harry",
			start: "2023-09-12T11:30:00Z",
			end: "2023-09-12T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Primus",
			start: "2023-09-10T11:30:00Z",
			end: "2023-09-10T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Ivanov Ivan",
			start: "2023-09-03T11:30:00Z",
			end: "2023-09-03T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Dima Smart",
			start: "2023-09-11T11:30:00Z",
			end: "2023-09-11T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Ligth Sky",
			start: "2023-09-03T11:30:00Z",
			end: "2023-09-03T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Harry",
			start: "2023-09-03T11:30:00Z",
			end: "2023-09-03T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
		{
			subject: "Primus",
			start: "2023-09-03T11:30:00Z",
			end: "2023-09-03T12:00:00Z",
			location: "Переговорная 7.1 (7-й этаж)",
		},
	];
}
