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

$(window).ready(function () {
	var initialDate = new Date();
	initialDate = new Date(Date.UTC(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate()));
	document.getElementById("date_select").valueAsDate = initialDate;
	document.getElementById("sel_floor").innerHTML = selectLocationOptionsTemplate([]);
	$("select").material_select();
	subscribeActions();
	render();
});
