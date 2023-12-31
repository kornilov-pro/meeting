/// <reference path="./makeIcsFile.js" />
/// <reference path="./selectedStore.js" />
/// <reference path="./render.js" />

function subscribeActions() {
	function cancel() {
		selectedStore = [];
		$(".one_time").each(function () {
			$(this).removeClass("selecteda");
		});
		setAvailability();
	}

	$("#btn_can").click(cancel);

	$("#btn_1").click(function () {
		if ($("#btn_1").hasClass("disable")) return;
		var events = selectedStore.map(({ start, end, location, meeting_email }) => ({
			eventName: "Бронирование",
			start: new Date(start),
			end: new Date(end),
			location,
			meeting_email,
		}));
		cancel();
		var link = document.createElement("a");
		link.href = makeIcsFile(events);
		link.download = "events.ics";
		link.click();
	});

	$("#sel_floor").change(function () {
		render();
	});

	$("#date_select").change(function () {
		render();
	});

	$(".time-refresh").click(render);

	$(".time-left").click(function () {
		var date = new Date($("#date_select").val());
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 1));
		document.getElementById("date_select").valueAsDate = date;
		render();
	});

	$(".time-right").click(function () {
		var date = new Date($("#date_select").val());
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1));
		document.getElementById("date_select").valueAsDate = date;
		render();
	});

	$("#close_btn").click(function () {
		$(".bg_bg").fadeOut(0);
	});

	// $("#create").click(function () {
	// 	var link = document.querySelector("#downloadLink");
	// 	link.href = makeIcsFile();
	// 	link.classList.remove("hide");
	// 	link.click();
	// 	$(this).fadeOut(0);
	// });
}
