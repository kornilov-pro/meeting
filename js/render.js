/// <reference path="./fetchTestData.js" />
/// <reference path="./fetchData.js" />
/// <reference path="./selectLocationOptionsTemplate.js" />
/// <reference path="./rowTemplate.js" />
/// <reference path="./utils.js" />
/// <reference path="./subscribeRows.js" />

/**
 *
 * @param {Date} start
 * @param {Date} end
 * @param {boolean} [force]
 * @returns {Promise<Record<string, {
 *  meeting_email: string,
 *  events: {
 *    user: string;
 *    start: Date;
 *    end: Date;
 *    location: string;
 *    meeting_email: string;
 *  }[]}>>}
 */
async function loadGroupedData(start, end, force) {
	var data = CONFIG["use_test_data"] ? await fetchTestData(start, end, force) : await fetchData(start, end, force);
	var entries = Object.entries(data).map(([location, { meeting_email, events }]) => [
		location,
		{
			meeting_email,
			events: events.map(({ subject, start, end }) => ({
				location,
				meeting_email,
				user: subject,
				start: new Date(start),
				end: new Date(end),
			})),
		},
	]);
	return Object.fromEntries(entries);
}

function doNum() {
	$(".stroke_time").each(function (i) {
		var l = i + 1;
		$(this).attr("alex-numer-row", l);
		$(".one_time").each(function (i) {
			var n = i + 1;
			var k = $(this).parent(".stroke_time").attr("alex-numer-row");
			var s = n - 28 * k + 28;
			$(this).attr("alex-numer", s);
		});
	});
	$(".one_time").hover(function () {
		var nnn = $(this).attr("alex-numer");
		$(".one_time_out").each(function () {
			var ooo = $(this).attr("alex-num");
			if (nnn === ooo) {
				$(this).addClass("didi");
			} else {
				$(this).removeClass("didi");
			}
		});
	});
}

/**
 *
 * @param {boolean} [force]
 * @returns
 */
async function render(force) {
	var selectedDate = new Date($("#date_select").val());
	var selectedLocation = $("#sel_floor").val() || "all";

	$(".time_now").html(selectedDate.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }));

	document.getElementById("rows-container").innerHTML = "Загрузка...";

	var groupedData = await loadGroupedData(withTime(selectedDate), withTime(selectedDate, 23, 59, 59), force);
	var currentSelectedDate = new Date($("#date_select").val());
	var currentSelectedLocation = $("#sel_floor").val() || "all";
	// если различаются, значит пользователь успел выбрать другие фильтры
	if (selectedDate.getTime() != currentSelectedDate.getTime()) return;
	if (selectedLocation != currentSelectedLocation) return;

	var locations = Object.keys(groupedData);
	document.getElementById("sel_floor").innerHTML = selectLocationOptionsTemplate(locations, selectedLocation);
	$("select").material_select();

	var highlighted = await getHighlightedLocation();
	var html = Object.entries(groupedData)
		.filter(([location]) => selectedLocation == "all" || location == selectedLocation)
		.map(([location, { meeting_email, events }]) => {
			var disable = highlighted && location != highlighted;
			return rowTemplate(location, meeting_email, selectedDate, events, selectedStore, disable);
		})
		.join("");

	document.getElementById("rows-container").innerHTML = html;

	subscribeRows();
	doNum();
}
