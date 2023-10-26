/// <reference path="./selectLocationOptionsTemplate.js" />
/// <reference path="./subscribeActions.js" />
/// <reference path="./render.js" />

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

$(document).ready(function () {
	var wh = $(window).height();
	var bh = wh - 320;
	$("#rows-container").height(bh);
});
$(window).resize(function () {
	var wh = $(window).height();
	console.log(wh);
	var bh = wh - 320;
	$("#rows-container").height(bh);
});

$(document).ready(function () {
	const url = new URL(window.location.href);
	var uri = window.location.toString();
	if (url.searchParams.has("highlight")) {
		$("#select_des_right").fadeIn(0);
	}
	$("#select_des_right").click(function () {
		var clean_uri = uri.substring(0, uri.indexOf("?"));
		window.history.replaceState({}, document.title, clean_uri);
		$(".one_stoke").each(function () {
			$(this).removeClass("disable");
		});
	});
	$(".one_time_out").each(function (i) {
		var n = i + 1;
		$(this).attr("alex-num", n);
	});
});
