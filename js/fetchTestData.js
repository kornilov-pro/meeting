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
async function fetchTestData(start, end, force) {
	return {
		"Переговорная 7.1": [
			{
				subject: "Dima Smart",
				start: "2023-09-11T12:30:00Z",
				end: "2023-09-11T15:00:00Z",
				location: "Переговорная 7.1 (7-й этаж)",
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
		],
		"Переговорная 7.2 (7-й этаж)": [
			{
				subject: "Ligth Sky",
				start: "2023-09-11T11:30:00Z",
				end: "2023-09-11T12:00:00Z",
				location: "Переговорная 7.2 (7-й этаж)",
			},
		],
		"Переговорная 7.3 (7-й этаж)": [
			{
				subject: "Ivanov Ivan",
				start: "2023-09-11T11:30:00Z",
				end: "2023-09-11T12:00:00Z",
				location: "Переговорная 7.3 (7-й этаж)",
			},
		],
	};
}
