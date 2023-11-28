function load_video() {
	if (PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 3) {
		show_hide_show_deatils(false);
		// show_hide_show_deatils(true);
	}

	// $("div#preview-player").empty();
	// $("div#video-preview-player").empty();
	// $("div#searchpage_player").empty();

	// if (true) {
	// 	if (PAGE_INDEX == 0) $("div#preview-player").load("preview-video-player.html");
	// 	else if (PAGE_INDEX == 1) $("div#video-preview-player").load("preview-video-player.html");
	// 	else if (PAGE_INDEX == 3) $("div#searchpage_player").load("preview-video-player.html");
	// }

	VIDEO_PLAYER = "";
	var features = [],
		type = "video/",
		url = "";

	if (APP_GENRE_COUNTRY_LIST > 0)
		features = ["current", "progress", "duration"];
	else if (APP_GENRE_COUNTRY_LIST == 0) features = ["current", "progress"];

	if (VOD_URL.toLowerCase().indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";

	if (APP_GENRE_COUNTRY_LIST == 2) show_hide_video_next_previous(true);
	else show_hide_video_next_previous(false);

	console.log("VOD_URL", VOD_URL);

	var totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);
	// obj = get_video_obj();

	// show next video button
	if (totalVideo > VOD_COUNTER) {
		$("#playNextVideo").css("visibility", "visible");
		$("#playPauseVideo").attr("data-sn-right", "#playNextVideo");
	} else {
		$("#playNextVideo").css("visibility", "hidden");
		$("#playPauseVideo").attr("data-sn-right", "null");
	}

	// show previous video button
	if (VOD_COUNTER > firstItem) {
		$("#playPreviousVideo").css("visibility", "visible");
		$("#playPauseVideo").attr("data-sn-left", "#playPreviousVideo");
	} else {
		$("#playPreviousVideo").css("visibility", "hidden");
		$("#playPauseVideo").attr("data-sn-left", "null");
	}

	// Add vidoe player
	set_focus("videoSection", "");
	SN.focus("videoSection");

	try {
		if (PAGE_INDEX == 0 || PAGE_INDEX == 1 || PAGE_INDEX == 3) {
			console.log("home page", PAGE_INDEX);
			console.log($("#preview_video_container"));
			$("#preview_video_container").html("");
			$("#preview_video_container").append(
				'<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box videoPlayer"><source src="" type="' + type + '" id="videoURL"></video>'
			);
		}
	} catch (error) {
		console.log(error);
	}
	console.log($("#preview_video_container"));
	$("#videoURL").attr("src", VOD_URL);

	console.log(VOD_URL);

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		stretching: "auto",
		features: features,
		customError: "&nbsp;",
		success: function (media) {
			if (PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 3) {
				show_hide_show_deatils(true);
			}
			console.log("media player");

			if (APP_GENRE_COUNTRY_LIST == 2)
				$(".mejs__controls").addClass("set_progressbar");

			// Progressbar Shift upside
			else $(".mejs__controls").removeClass("set_progressbar");

			$(".mejs__time-total").css("height", "18px");
			$(".mejs__currenttime").css("height", "18px");
			$(".mejs__duration").css("height", "18px");

			$(".mejs__time-loaded").css("height", "18px");
			$(".mejs__time-current").css("height", "18px");
			$(".mejs__time-buffering").css("height", "18px");

			$(".mejs__time").css("font-size", "20px");
			$(".mejs__time").css("padding-top", "18px");

			media.load();
			media.play();
			VIDEO_PLAYER = media;

			media.addEventListener("progress", function (e) {
			});

			media.addEventListener("error", function (eventType) {
				PLAY_VIDEO = true;
				//   retry_error_popup();
				media.pause();
				if (TAB_INDEX == 0 || TAB_INDEX == 1) {
					$(".preview-video-inner").hide();
					$(".video_player_error_message")
						.show()
						.text("Content Currently Not Available");
					if (PREVIEW_FULL_DISPLAY)
						$(".video_player_error_message").addClass(
							"expand_preview_error_msg"
						);
				}
				console.log("Error in stream: " + eventType);
			});

			media.addEventListener("ended", function (e) {
				var id = SECOND_PAGE_SELECTED_ITEM;
				var index = $("li#" + id).index();
				var categoryName = $("#" + id)
					.parent()
					.parent()
					.parent()
					.attr("data-category");
				console.log("end video..............." + e.message);
				// totalVideo = get_total_video_or_first_video_index(1);
				// if (VOD_COUNTER < totalVideo) previous_next_video((type = "next"));
				// else
				closeVideo();
				console.log("load preview player....");
				$("div#video-preview-player").empty();
				$("div#video-preview-player").html(
					'<img src="' +
					APP_IMAGE_URL +
					APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] +
					'" alt="' +
					APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] +
					'">'
				);
			});

			media.addEventListener("loadstart", function (e) {
				console.log("loading....");
				$(".preview-video-inner").show();
			});

			media.addEventListener("playing", function (e) {
				console.log("playing...............");
				$("#playPauseIcon").attr("src", "images/pause.png");
				$(".mejs__controls").addClass("mejs__offscreen").css("opacity", 0);
				$(".preview-video-inner").hide();
			});

			media.addEventListener("pause", function (e) {
				console.log("pause...............");
				$(".mejs__controls").removeClass("mejs__offscreen").css("opacity", 1);
				$("#playPauseIcon").attr("src", "images/play.png");
			});


			// media.addEventListener("hlsError", function (e) {
			//   console.log("buffering....");
			//   $(".preview-video-inner").show();
			// });

			media.addEventListener('seeking', function (e) {
				console.log("seeking");
				$(".preview-video-inner").show();
			}, true);

			media.addEventListener('seeked', function (e) {
				console.log("seeked");
				$(".preview-video-inner").hide();
				// VIDEO_PLAYER.play();
			}, true);

			media.addEventListener("timeupdate", function (e) { });

			media.addEventListener("canplay", function (e) {
				PLAY_VIDEO = true;
				if (APP_GENRE_COUNTRY_LIST == 0)
					show_hide_programme_details_after_specific_time();
			});
		},
	});
}


var playVideo = function () {
	if (document.hidden) {
		console.log("App in background");
	} else {
		console.log("play video");
		if ($('#video_container').css('display', 'block')) {
			$(".pause-icon").hide();
			if ($("#playPauseVideo").is(":focus")) $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause_focus.png');
			else $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png')
			VIDEO_PLAYER.play();
			show_hide_progress_bar_after_specific_time();
		} else if ($('#preview_video_container').css('display', 'block')) {
			$(".preview-video-inner").hide();
			$(".pause-icon").hide();
			VIDEO_PLAYER.play();

		} else {
			closeVideo();
		}
	}
};

var pauseVideo = function () {
	if ($('#video_container').is(':visible')) {
		console.log("pause video");
		$(".pause-icon").show();
		if ($("#playPauseVideo").is(":focus")) $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/play_focus.png');
		else $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/play.png');
		VIDEO_PLAYER.pause();
		show_hide_progress_bar_after_specific_time();
	}
};

var closeVideo = function () {
	console.log("close video");
	show_hide_show_deatils(false);
	deleteMediaInfo();
	$("#video_player_about_video").hide();
	$(".circle_loader").removeClass('circle-loader-middle');
	VIDEO_PLAYER.pause();
	// webapis.appcommon.setScreenSaver(webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_ON);
	show_hide_video_next_previous(false);
	sessionStorage.FWD_RWD_key_press = 0;
	$("#av-player").css('display', 'none');
	$("#video_container").removeClass("active").hide();
	$(".video-inner").hide();
	$(".loader").hide();
	// $(".progress-container").hide();
	$(".player_progress").hide();

	$(".main_container").show();
	if (PAGE_INDEX == 0) $(".home_container").addClass("active").show();
	else if (PAGE_INDEX == 1) {
		$(".video_library_container").addClass("active").show();
		$(".video_list").show();
		// reset_preview_player(true);
		var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
		var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM).parent().parent().parent().attr("data-category");
		VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
		$("div#video-preview-player").empty();
		$("div#video-preview-player").html('<img src="' + APP_IMAGE_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');
		SN.focus("#" + SECOND_PAGE_FOCUSED_ITEM);
	} else if (PAGE_INDEX == 2) {
		$(".video_library_container").addClass("active").show();
		$(".episode_containerr").show();
		var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
		var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM).parent().parent().parent().attr("data-category");
		VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
		$("div#video-preview-player").empty();
		$("div#video-preview-player").html('<img src="' + APP_IMAGE_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');
		SN.focus("#episode_" + (SELECTED_EPIOSDE_NUMBER - 1));
	} else if (PAGE_INDEX == 3) {
		$(".search_container").addClass("active").show();
		var i = $("#" + FOURTH_PAGE_SELECTED_ITEM).index();
		$("div#searchpage_player").empty();
		$("div#searchpage_player").html('<img src="' + APP_IMAGE_URL + SEARCHED_VIDEO_LIST[i]["poster"] + '" alt="' + SEARCHED_VIDEO_LIST[i]["name"] + '"/>');
		SN.focus("#" + FOURTH_PAGE_SELECTED_ITEM);
	}

	$("#video_player_about_video").hide();
	$(".video_container").removeClass("active").hide();
	$(".pause-icon").hide();
	progress_bar(0);
	document.getElementById("currentTime").innerHTML = "00:00";
};

var stopVideo = function () {
	VIDEO_PLAYER.pause();
	show_hide_video_container();
	closeVideo();
};

var jumpBackwardVideo = function (time) {
	show_hide_progress_bar_after_specific_time();
	VIDEO_PLAYER.jumpBackward(time);

	if (VIDEO_PLAYER.paused) {
		VIDEO_PLAYER.play();
	}
};

var jumpForwardVideo = function (time) {
	VIDEO_PLAYER.pause();
	show_hide_progress_bar_after_specific_time();
	VIDEO_PLAYER.play();
	VIDEO_PLAYER.jumpForward(time, successForwardCallback, errorForwardCallback);

	if (VIDEO_PLAYER.paused) {
		VIDEO_PLAYER.play();
	}
};

//This function increase/decrease position of progress bar
function progress_bar(percentage) {
	$('.progress-bar').css('width', percentage + "%");
}

//This function is used to hide progress bar after 10 second
function show_hide_progress_bar_after_specific_time() {

	clearInterval(hide_progress_bar);
	// if (webapis.avplay.getDuration() > 0 && (webapis.avplay.getState() == "PAUSED" || webapis.avplay.getState() == "PLAYING")) {
	if (PAGE_INDEX == 1 || PAGE_INDEX == 2) show_hide_video_next_previous(true);
	show_hide_player_progress(true);
	if (PAGE_INDEX == 1 || PAGE_INDEX == 2) show_hide_show_deatils(true);
	else show_hide_show_deatils(false);
	totalVideo = get_total_video_or_first_video_index(1);

	hide_progress_bar = setTimeout(function () {
		running = false;
		// $(".progress-container").hide();
		$(".player_progress").hide();
		show_hide_player_progress(false);
		show_hide_show_deatils(false);
		if ($(".video_container").hasClass("active")) SN.focus('videoPlayer');
	}, 10000);
	// }
}

function show_hide_video_next_previous(flag) {
	show_hide_player_progress(flag);
	if (PAGE_INDEX == 1 || PAGE_INDEX == 2) show_hide_show_deatils(true);
}

function forward_video() {
	if ($(".video_container").hasClass("active")) {
		console.log("forward video");
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
	}
}

function rewind_video() {
	if ($(".video_container").hasClass("active")) {
		console.log("rewind video");
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
		console.log(VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL));
	}
}

/***************************************
	This is for next / previous video
****************************************/
function previous_next_video(type) {
	var obj = get_video_obj(),
		id = "",
		totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);

	$(".player_progress").hide();
	$(".video-title").text('');

	console.log("totalVideo", totalVideo);

	// hide next video button
	if (VOD_COUNTER == totalVideo) {
		console.log("1", (VOD_COUNTER == totalVideo));
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-right', 'null');
	}
	// hide previous video button
	else if (VOD_COUNTER == $("#episodeList li.visible").first().index()) {
		console.log("2", (VOD_COUNTER == $("#episodeList" + " li.visible").first().index()));
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');
	}

	console.log("next previous fun =>", VOD_COUNTER, totalVideo);

	switch (type) {
		case "previous":
			if (VOD_COUNTER > 0) {
				if (PAGE_INDEX == 2) {
					VOD_COUNTER = $("#episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li').index();
					VOD_URL = SELECTED_EPISODES[VOD_COUNTER];
					SELECTED_EPIOSDE_NUMBER = SELECTED_EPIOSDE_NUMBER - 1;
					show_hide_show_deatils(true);
					load_main_player();
				}
			}

			break;

		case "next":
			if (VOD_COUNTER < totalVideo) {
				if (PAGE_INDEX == 2) {
					VOD_COUNTER = $("#episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").next('li').index();
					VOD_URL = SELECTED_EPISODES[VOD_COUNTER];
					SELECTED_EPIOSDE_NUMBER = SELECTED_EPIOSDE_NUMBER + 1;
					show_hide_show_deatils(true);
					load_main_player();
				}
			}
			break;
	}

}

/*************************************
	if type is 1 return total video
	else first li item index
**************************************/
function get_total_video_or_first_video_index(type) {
	var totalVideo = 0,
		firstItem = 0;

	switch (PAGE_INDEX) {
		case 1: // For Show menu
			totalVideo = 1;
			firstItem = 0;
			break;

		case 2: // For Show menu
			totalVideo = $("#episode_list li").last().index();
			firstItem = $("#episode_list li").first().index();
			break;
	}

	if (type == 1) return totalVideo;
	else return firstItem;

}

//This function is used to hide progress bar after 10 second
function show_hide_programme_details_after_specific_time() {
	clearInterval(hide_programme_details);

	hide_programme_details = setTimeout(function () {
		running = false;
		if ($(".video_container").hasClass("active")) SN.focus('videoPlayer');
	}, 10000);
}

//show player progress and button
function show_hide_player_progress(flag) {
	if (flag) {
		$(".player_progress").show();
		$(".progress-container").show();
		$("#videoNextPrevious").show();
		if (PAGE_INDEX == 3) {
			$("#playPreviousVideo").hide();
			$("#playNextVideo").hide();
		} else {
			$("#playPreviousVideo").show();
			$("#playNextVideo").show();
		}
	} else {
		$(".player_progress").hide();
		$(".progress-container").hide();
		$("#videoNextPrevious").hide();
		if ($(".video_container").hasClass("active")) SN.focus("videoPlayer");
	}
}



