$(window).resize(function () {
	$(".one_time").each(function () {
		var a = $(this).width();
		if (a > 20) {
			$(this).height(a);
		} else {
			$(this).height(20);
		}
	});
});

async function loadGroupedData() {
	var data = await fetchData();
	var sortedData = [...data].sort(function ({ location: a }, { location: b }) {
		return a < b ? -1 : a > b ? 1 : 0;
	});
	return sortedData
		.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end) }))
		.map(({ subject, ...event }) => ({ ...event, user: subject }))
		.reduce(
			groupByReducer(({ location }) => location),
			{}
		);
}

$(window).ready(function () {
	loadGroupedData().then(function (groupedData) {
		var initialDate = new Date();
		initialDate = new Date(Date.UTC(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate()));
		var locations = Object.keys(groupedData);
		document.getElementById("sel_floor").innerHTML = selectLocationOptionsTemplate(locations);
		document.getElementById("date_select").valueAsDate = initialDate;
		$("select").material_select();
		render(groupedData);
		subscribeActions(groupedData);
	});
});
