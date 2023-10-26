/**
 *
 * @param {Date} start
 * @param {Date} end
 * @param {boolean} [force]
 * @returns {Promise<Record<string, {
 *  meeting_email: string,
 *  events: {
 *    subject: string;
 *    start: string;
 *    end: string;
 *    location: string;
 *    meeting_email: string;
 * }[]
 * }>>}
 */
async function fetchTestData(start, end, force) {
	return {
		"Переговорная 7.1": {
			meeting_email: "user7.1@staffmap.ru",
			events: [
				{
					subject: "Dima Smart",
					start: "2023-09-11T12:30:00Z",
					end: "2023-09-11T15:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Harry",
					start: "2023-09-12T11:30:00Z",
					end: "2023-09-12T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Primus",
					start: "2023-09-10T11:30:00Z",
					end: "2023-09-10T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Ivanov Ivan",
					start: "2023-09-03T11:30:00Z",
					end: "2023-09-03T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Dima Smart",
					start: "2023-09-11T11:30:00Z",
					end: "2023-09-11T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Ligth Sky",
					start: "2023-09-03T11:30:00Z",
					end: "2023-09-03T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Harry",
					start: "2023-09-03T11:30:00Z",
					end: "2023-09-03T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
				{
					subject: "Primus",
					start: "2023-09-03T11:30:00Z",
					end: "2023-09-03T12:00:00Z",
					location: "Переговорная 7.1 (7-й этаж)",
					meeting_email: "user7.1@staffmap.ru",
				},
			],
		},
		"Переговорная 7.2 (7-й этаж)": {
			meeting_email: "user7.2@staffmap.ru",
			events: [
				{
					subject: "Ligth Sky",
					start: "2023-09-11T11:30:00Z",
					end: "2023-09-11T12:00:00Z",
					location: "Переговорная 7.2 (7-й этаж)",
					meeting_email: "user7.2@staffmap.ru",
				},
			],
		},
		"Переговорная 7.3 (7-й этаж)": {
			meeting_email: "user7.3@staffmap.ru",
			events: [
				{
					subject: "Ivanov Ivan",
					start: "2023-09-11T11:30:00Z",
					end: "2023-09-11T12:00:00Z",
					location: "Переговорная 7.3 (7-й этаж)",
					meeting_email: "user7.3@staffmap.ru",
				},
			],
		},
	};
}
