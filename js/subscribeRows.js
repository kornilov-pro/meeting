/// <reference path="./selectedStore.js" />

function subscribeRows() {
	$(".one_time").each(function () {
		var a = $(this).width();
		if (a > 20) {
			$(this).height(a);
		} else {
			$(this).height(20);
		}
	});
	$(".one_time").each(function () {
		$(this).click(function () {
			var attrLocation = $(this).attr("data-location");
			var attrStart = $(this).attr("data-start");
			var attrEnd = $(this).attr("data-end");
			var meeting_email = $(this).attr("data-meeting_email");
			var isSelected = selectedStore.filter(
				({ start, location }) => start == attrStart && location == attrLocation
			).length;
			if (isSelected) {
				$(this).removeClass("selecteda");
				selectedStore = selectedStore.filter(
					({ start, location }) => !(start == attrStart && location == attrLocation)
				);
			} else {
				$(this).addClass("selecteda");
				selectedStore = [...selectedStore, { start: attrStart, end: attrEnd, location: attrLocation, meeting_email }];
			}
		});
	});

	$(".one_time").each(function () {
		var n = $(this).attr("data-user");
		if (n != null) {
			$(this).html("<span>" + n + "</span>");
		}
	});

	$(".info_btn").each(function () {
		$(this).click(function () {
			var tit = $(this).attr("data-title");
			$("#title").html(tit);
			$(".bg_bg").fadeIn(0);
		});
	});
}
