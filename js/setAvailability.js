/// <reference path="./getHighlightedLocation.js" />
/// <reference path="./selectedStore.js" />

function setAvailability() {
	setLocationsAvailability();
	setActionButtonsAvailability();
	$(".one_time.disable").removeClass("disable");
	if (!selectedStore.length) return;
	var sortedByStart = selectedStore
		.map(({ start, end, ...data }) => ({ ...data, start: new Date(start), end: new Date(end) }))
		.sort((a, b) => a.start.getTime() - b.start.getTime());
	var location = sortedByStart[0].location;
	var start = sortedByStart[0].start.toISOString();
	var end = sortedByStart[sortedByStart.length - 1].end.toISOString();
	$(`.one_time[data-location="${location}"]`).each(function () {
		var elStart = $(this).attr("data-start");
		var elEnd = $(this).attr("data-end");
		var isEnabled = start == elStart || start == elEnd || end == elStart || end == elEnd;
		if (!isEnabled) $(this).addClass("disable");
	});
}

function setActionButtonsAvailability() {
	if (selectedStore.length) $("#btn_1, #btn_can").removeClass("disable");
	else $("#btn_1, #btn_can").addClass("disable");
}

async function setLocationsAvailability() {
	var highlighted = await getHighlightedLocation();
	var selected = selectedStore.length ? selectedStore[0].location : "";
	$(".one_stoke").each(function () {
		$(this).removeClass("disable");
		var elLocation = $(this).attr("data-floor");
		if (highlighted && elLocation != highlighted) return $(this).addClass("disable");
		if (selected && elLocation != selected) return $(this).addClass("disable");
	});
}
