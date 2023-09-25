/**
 *
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<Record<string, {
 *  user: string;
 *  start: Date;
 *  end: Date;
 *  location: string;
 * }[]>>}
 */
async function loadGroupedData(start, end) {
	var data = await fetchData(start, end);
	var entries = Object.entries(data).map(([location, events]) => [
		location,
		events.map(({ subject, start, end }) => ({
			location,
			user: subject,
			start: new Date(start),
			end: new Date(end),
		})),
	]);
	return Object.fromEntries(entries);
}

async function render() {
	var selectedDate = new Date($("#date_select").val());
	var selectedLocation = $("#sel_floor").val() || "all";

	$(".time_now").html(selectedDate.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }));

	document.getElementById("rows-container").innerHTML = "Загрузка...";

	var groupedData = await loadGroupedData(withTime(selectedDate), withTime(selectedDate, 23, 59, 59));
	var currentSelectedDate = new Date($("#date_select").val());
	var currentSelectedLocation = $("#sel_floor").val() || "all";
	// если различаются, значит пользователь успел выбрать другие фильтры
	if (selectedDate.getTime() != currentSelectedDate.getTime()) return;
	if (selectedLocation != currentSelectedLocation) return;

	var locations = Object.keys(groupedData);
	document.getElementById("sel_floor").innerHTML = selectLocationOptionsTemplate(locations, selectedLocation);
	$("select").material_select();

	var html = Object.entries(groupedData)
		.filter(([location]) => selectedLocation == "all" || location == selectedLocation)
		.map(([location, events]) => rowTemplate(location, selectedDate, events, selectedStore))
		.join("");

	document.getElementById("rows-container").innerHTML = html;

	subscribeRows();
}
