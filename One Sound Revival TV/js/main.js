window.onload = function () {
	$('title').text(APP_NAME);
	$('meta[name=description]').attr('content', APP_NAME);

	// TODO:: Do your initialization job
	$("body").removeAttr("style");
	$(".splash-screen").show();

	// Load html files
	$("span#modal_container").load("modal.html");
	$(".splash-screen").css({ 'position': 'absolute', 'z-index': '100' });

	setTimeout(function () { load_main_screen(); }, 5000);
};

function load_main_screen() {
	if (navigator.onLine) {
		load_video();
	} else {
		hide_show_modal(true, "RETRY_EXIT", NET_CONNECTION_ERR);
	}
}

// Open error popup when error will occur during video playing.
function retry_error_popup() {
	var onlineStatus = navigator.onLine;

	if (onlineStatus) msg = "The content is currently unavailable. Please check back later.";
	else msg = NET_CONNECTION_ERR;

	if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
		hide_show_modal(true, 'RETRY_CANCEL', msg);
	}
}

function show_hide_video_container() {
	$("#video_container").show().addClass('active');
}

function remove_add_active_class(className) {
	console.log("remove add active class");
	if ($("body").find(".active").length > 0) {
		$("body").find(".active").each(function () {
			if ($(this).className != className) $(this).removeClass("active");
		});
	}
	$("." + className).addClass("active");
}