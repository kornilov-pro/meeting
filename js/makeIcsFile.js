/**
 *
 * @param {Date} date
 * @returns {string}
 */
function icsDateTime(date) {
	return date.toISOString().slice(0, -5).concat("Z").replaceAll("-", "").replaceAll(":", "");
}

/**
 *
 * @param {{
 *  eventName: string,
 *  start: Date,
 *  end: Date,
 *  meeting_email: string,
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}} data
 * @param {number} i?
 * @returns {string}
 */
function icsEvent(
	{ eventName, start, end, meeting_email, description, location, organizer, status, priority } = data,
	i = 0
) {
	return `BEGIN:VEVENT
SUMMARY:${eventName}
DTSTART:${icsDateTime(start)}
DTEND:${icsDateTime(end)}
DTSTAMP:${icsDateTime(new Date())}
UID:${new Date().getTime()}${i}-${eventName}
DESCRIPTION:${description || ""}
LOCATION:${location || ""}
ORGANIZER:${organizer || ""}
STATUS:${status || "CONFIRMED"}
PRIORITY:${priority || 0}
ATTENDEE;CN="${meeting_email}";CUTYPE=INDIVIDUAL;EMAIL="${meeting_email}";PARTSTAT=ACCEPTED;ROLE=REQ-PARTICIPANT
END:VEVENT
`;
}

/**
 * Возвращает хеш данных события без учета времени
 *
 * @param {{
 *  eventName: string,
 *  start: Date,
 *  end: Date,
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}} event
 */
function eventPayloadHash(event) {
	return (
		"" +
		(event.eventName ?? "") +
		(event.description ?? "") +
		(event.location ?? "") +
		(event.organizer ?? "") +
		(event.status ?? "") +
		(event.priority ?? "")
	);
}

/**
 * Проверят, идет ли события b сразу после a
 *
 * @param {{
 *  eventName: string,
 *  start: Date,
 *  end: Date,
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}} a
 * @param {{
 *  eventName: string,
 *  start: Date,
 *  end: Date,
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}} b
 * @returns {boolean}
 */
function isSequentialEvents(a, b) {
	return a.end.getTime() == b.start.getTime();
}

/**
 *
 * @param {{
 *  eventName: string,
 *  start: Date,
 *  end: Date,
 *  meeting_email: string,
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}[]} events
 * @returns {string}
 */
function makeIcsFile(events) {
	var hash = eventPayloadHash;
	events = events
		.sort((a, b) => (hash(a) < hash(b) ? -1 : hash(a) > hash(b) ? 1 : a.start.getTime() - b.start.getTime()))
		.reduce((acc, event) => {
			var last = acc[acc.length - 1];
			return last && isSequentialEvents(last, event) && hash(last) == hash(event)
				? [...acc.slice(0, -1), { ...last, end: event.end }]
				: [...acc, event];
		}, [])
		.map(icsEvent)
		.join("");
	var data = `BEGIN:VCALENDAR\nVERSION:2.0\n${events}END:VCALENDAR\n`;
	var file = new File([data], { type: "text/plain" });

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (!makeIcsFile.icsFile) {
		window.URL.revokeObjectURL(makeIcsFile.icsFile);
	}

	makeIcsFile.icsFile = window.URL.createObjectURL(file);

	return makeIcsFile.icsFile;
}
makeIcsFile.icsFile = null;
