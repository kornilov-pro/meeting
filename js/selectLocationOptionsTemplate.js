/**
 *
 * @param {string[]} locations
 * @returns {string}
 */
function selectLocationOptionsTemplate(locations, selected = "all") {
	return locations
		.map((location) => [location, location])
		.reverse()
		.concat([["Все этажи", "all"]])
		.reverse()
		.map(([title, value]) =>
			selected == value
				? /*html*/ `<option value="${value}" selected>${title}</option>`
				: /*html*/ `<option value="${value}">${title}</option>`
		);
}
