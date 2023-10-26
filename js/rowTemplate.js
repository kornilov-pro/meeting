/// <reference path="./TIME_COLUMNS.js" />
/// <reference path="./utils.js" />

/**
 *
 * @param {string} location
 * @param {string} meeting_email
 * @param {Date} start
 * @param {Date} end
 * @param {string} user
 * @param {{start: string, end: string, location: string}[]} selected
 * @returns {string}
 */
function columnTemplate(location, meeting_email, start, end, user = "", selected = []) {
	var isoStart = start.toISOString();
	var isSelected = selected.filter(({ start, location: l }) => isoStart == start && location == l).length;
	var className = "one_time" + (user ? " another" : "") + (isSelected ? " selecteda" : "");
	var classAttribute = `class="${className}"`;
	var locationAttribute = `data-location="${location}"`;
	var startAttribute = `data-start="${isoStart}"`;
	var endAttribute = `data-end="${end.toISOString()}"`;
	var userAttribute = user ? ` data-user="${user}"` : "";
	var meetingEmailAttribute = `data-meeting_email=${meeting_email}`;
	var attributes = `${classAttribute} ${locationAttribute} ${endAttribute} ${startAttribute}${userAttribute}`;
	attributes += ` ${meetingEmailAttribute}`;
	return /*html*/ `<div ${attributes}></div>`;
}

/**
 *
 * @param {string} location
 * @param {string} meeting_email
 * @param {Date} date
 * @param {{user: string, start: Date, end: Date, meeting_email: string}[]} events
 * @param {{start: string, end: string, location: string, meeting_email: string}[]} selected
 * @param {boolean} disable
 * @returns {string}
 */
function rowTemplate(location, meeting_email, date, events, selected, disable) {
	var maxDate = withTime(date, 23, 59, 59);
	var columns = TIME_COLUMNS.map(([h, m]) => withTime(date, h, m))
		.concat([maxDate])
		.map(pairwise)
		.filter(([last]) => last)
		.map(([start, end]) => [start, end, events.find(isInInterval({ start, end }))])
		.map(([start, end, event]) => [start, end, event ? event.user : ""])
		.map(([start, end, user]) => columnTemplate(location, meeting_email, start, end, user, selected))
		.join("");
	var disableClass = disable ? " disable" : "";
	return /*html*/ `<div class="one_stoke${disableClass}" data-floor="${location}">
	<div class="row">
		<div class="col l4">
			<div class="info_btn" data-title="${location}">
				<i class="mdi mdi-information-outline"></i>
			</div>
			<div class="pereg_title">${location}</div>
		</div>
		<div class="col l8">
			<div class="stroke_time">
				${columns}
			</div>
		</div>
	</div>
</div>`;
}
