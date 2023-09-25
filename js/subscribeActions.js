function subscribeActions() {
	// Login

	$("#senda").click(function () {
		$("#first_screen").fadeOut(0);
		var inp = $("#ema").val();
		$("#user_name").text(inp);
	});

	$("#btn_can").click(function () {
		selectedStore = [];
		$(".one_time").each(function () {
			$(this).removeClass("selecteda");
		});
	});

	$("#btn_1").click(function () {
		var events = selectedStore.map(({ start, end, location }) => ({
			eventName: "Бронирование",
			start: new Date(start),
			end: new Date(end),
			location,
		}));
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
