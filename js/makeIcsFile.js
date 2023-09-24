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
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}} data
 * @param {number} i?
 * @returns {string}
 */
function icsEvent({ eventName, start, end, description, location, organizer, status, priority } = data, i = 0) {
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
END:VEVENT
`;
}

/**
 *
 * @param {{
 *  eventName: string,
 *  start: Date,
 *  end: Date,
 *  description?: string,
 *  location?: string,
 *  organizer?: string,
 *  status?: string,
 *  priority?: number}[]} events
 * @returns {string}
 */
function makeIcsFile(events) {
	var data = `BEGIN:VCALENDAR
VERSION:2.0
${events.map(icsEvent).join("")}END:VCALENDAR
`;
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
