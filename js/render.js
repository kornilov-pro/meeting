/**
 * @param {Record<string, {
 *  user: string;
 *  start: Date;
 *  end: Date;
 *  location: string;
 * }[]>} groupedData
 */
function render(groupedData) {
	var selectedDate = new Date($("#date_select").val());
	var selectedLocation = $("#sel_floor").val();

	var html = Object.entries(groupedData)
		.filter(([location]) => selectedLocation == "all" || location == selectedLocation)
		.map(([location, events]) => rowTemplate(location, selectedDate, events, selectedStore))
		.join("");

	document.getElementById("rows-container").innerHTML = html;

	subscribeRows();

	$(".time_now").html(selectedDate.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }));
}
