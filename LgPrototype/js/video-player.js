function load_video() {
	// enable_disable_mouse();
	VIDEO_PLAYER = "";
	var features = [],
		type = "video/",
		url = "";

	if (APP_GENRE_COUNTRY_LIST > 0) features = ['current', 'progress', 'duration'];
	else if (APP_GENRE_COUNTRY_LIST == 0) features = ['current', 'progress'];

	if ((VOD_URL.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";

	// show_hide_video_container();

	if (APP_GENRE_COUNTRY_LIST == 2) show_hide_video_next_previous(true);
	else show_hide_video_next_previous(false);

	console.log("VOD_URL", VOD_URL);

	var totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);
	// obj = get_video_obj();

	// show next video button
	if (totalVideo > VOD_COUNTER) {
		$("#playNextVideo").css('visibility', 'visible');
		$("#playPauseVideo").attr('data-sn-right', '#playNextVideo');

	} else {
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-right', 'null');
	}

	// show previous video button
	if (VOD_COUNTER > firstItem) {
		$("#playPreviousVideo").css('visibility', 'visible');
		$("#playPauseVideo").attr('data-sn-left', '#playPreviousVideo');
	} else {
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');
	}

	// Add vidoe player
	set_focus("videoSection", "");
	SN.focus("videoSection");

	if (PAGE_INDEX == 10 || PAGE_INDEX == 12) {
		$("#preview_video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box videoPlayer"><source src="" type="' + type + '" id="videoURL"></video>');
		console.log("home page", PAGE_INDEX);
		console.log($("#preview_video_container"));
	}
	else {
		console.log("video library page");
		$("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');
		console.log($("#video_container"));
	}

	$("#videoURL").attr('src', VOD_URL);

	console.log(VOD_URL);

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		stretching: "auto",
		features: features,
		customError: "&nbsp;",
		success: function (media) {
			console.log("media player");

			if (APP_GENRE_COUNTRY_LIST == 2) $(".mejs__controls").addClass('set_progressbar'); // Progressbar Shift upside 
			else $(".mejs__controls").removeClass('set_progressbar');

			$(".mejs__time-total").css('height', '18px');
			$(".mejs__currenttime").css('height', '18px');
			$(".mejs__duration").css('height', '18px');

			$(".mejs__time-loaded").css('height', '18px');
			$(".mejs__time-current").css('height', '18px');
			$(".mejs__time-buffering").css('height', '18px');

			$(".mejs__time").css('font-size', '20px');
			$(".mejs__time").css('padding-top', '18px');

			media.load();
			media.play();
			VIDEO_PLAYER = media;

			media.addEventListener('progress', function () {
				//console.log("3333333333333");
			});

			media.addEventListener('error', function (e) {
				PLAY_VIDEO = true;
				retry_error_popup();
				media.pause();
			});

			media.addEventListener('ended', function (e) {
				console.log("end video..............." + e.message);
				totalVideo = get_total_video_or_first_video_index(1);
				if (VOD_COUNTER < totalVideo) previous_next_video(type = "next");
				else closeVideo();
			});

			media.addEventListener('playing', function (e) {
				console.log("playing...............");
				$("#playPauseIcon").attr('src', 'images/pause.png');
				$(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);

			});

			media.addEventListener('pause', function (e) {
				console.log("pause...............");
				$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
				$("#playPauseIcon").attr('src', 'images/play.png');
			});

			media.addEventListener('timeupdate', function (e) { });

			media.addEventListener('canplay', function (e) {
				PLAY_VIDEO = true;
				if (APP_GENRE_COUNTRY_LIST == 0) show_hide_programme_details_after_specific_time();
			});

		}
	});
}

var playVideo = function () {
	if (document.hidden) {
		console.log("App in background");
	} else {
		console.log("play video");
		if ($('#video_container').css('display', 'block')) {
			$(".pause-icon").hide();
			$("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png');
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
		$("#videoNextPreviousPlayPauseIcon").attr('src', 'images/play.png');
		VIDEO_PLAYER.pause();
		show_hide_progress_bar_after_specific_time();
	}
};

var closeVideo = function () {
	console.log("close video");
	show_hide_show_deatils(false);
	$("#video_player_about_video").hide();
	$(".circle_loader").removeClass('circle-loader-middle');
	// VIDEO_PLAYER.stop();
	// VIDEO_PLAYER.remove();
	stopVideo();
	// stop();
	// closeVideo();
	// unregister_mediakey();
	// VIDEO_PLAYER.pause();
	// VIDEO_PLAYER.close();
	// webapis.appcommon.setScreenSaver(webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_ON);
	show_hide_video_next_previous(false);
	sessionStorage.FWD_RWD_key_press = 0;
	$("#video_container").css('display', 'none');
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
		reset_preview_player(true);
		var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
		var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM).parent().parent().parent().attr("data-category");
		VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
		$("div#video-preview-player").empty();
		$("div#video-preview-player").html('<img src="' + APP_STALKER_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');
		console.log(index, categoryName);
		// load_preview_player();
		SN.focus("#" + SECOND_PAGE_FOCUSED_ITEM);
	} else if (PAGE_INDEX == 2) {
		$(".video_library_container").addClass("active").show();
		$(".episode_containerr").show();
		// reset_preview_player(true);
		var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
		var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM).parent().parent().parent().attr("data-category");
		VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
		$("div#video-preview-player").empty();
		$("div#video-preview-player").html('<img src="' + APP_STALKER_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');
		// load_preview_player();
		SN.focus("#episode_" + (SELECTED_EPIOSDE_NUMBER - 1));
	} else if (PAGE_INDEX == 3) {
		$(".search_container").addClass("active").show();
		var i = $("#" + FOURTH_PAGE_SELECTED_ITEM).index();
		$("div#searchpage_player").empty();
		$("div#searchpage_player").html('<img src="' + APP_STALKER_URL + SEARCHED_VIDEO_LIST[i]["poster"] + '" alt="' + SEARCHED_VIDEO_LIST[i]["name"] + '"/>');
		SN.focus("#" + FOURTH_PAGE_SELECTED_ITEM);
	}
	$("#video_player_about_video").hide();
	$(".video_container").removeClass("active").hide();
	$(".pause-icon").hide();
	// $(".video_next_previous_container").hide();
	// progress_bar(0);
	// document.getElementById("currentTime").innerHTML = "00:00";
};

var updateDuration = function () {
	try {
		if ($(".video_container").hasClass('active') && $('.video_container').is(':visible')) {
			var duration = VIDEO_PLAYER.getDuration();

			if (Math.floor(duration / 3600000) >= 1)
				document.getElementById("totalTime").innerHTML = "/" + min_two_digits(Math.floor(duration / 3600000)) + ":" + min_two_digits(Math.floor((duration / 60000) % 60)) + ":" + min_two_digits(Math.floor((duration / 1000) % 60));
			else
				document.getElementById("totalTime").innerHTML = "/" + min_two_digits(Math.floor((duration / 60000) % 60)) + ":" + min_two_digits(Math.floor((duration / 1000) % 60));
		}
	} catch (e) {
		console.log("Error in update duration");
	}
};

var updateCurrentTime = function (currentTime) {
	try {
		if ($(".video_container").hasClass('active') && $('.video_container').is(':visible')) {
			if (currentTime == null)
				currentTime = VIDEO_PLAYER.getCurrentTime();

			if (Math.floor(currentTime / 3600000) >= 1)
				document.getElementById("currentTime").innerHTML = min_two_digits(Math.floor(currentTime / 3600000)) + ":" + min_two_digits(Math.floor((currentTime / 60000) % 60)) + ":" + min_two_digits(Math.floor((currentTime / 1000) % 60));
			else
				document.getElementById("currentTime").innerHTML = min_two_digits(Math.floor((currentTime / 60000) % 60)) + ":" + min_two_digits(Math.floor((currentTime / 1000) % 60));

			var time = VIDEO_PLAYER.getCurrentTime();
			var duration = VIDEO_PLAYER.getDuration();
			var time = ((Math.floor(currentTime / 3600000) * 3600) + Math.floor((currentTime / 60000) % 60) * 60 + (Math.floor((currentTime / 1000) % 60)));
			var totalTime = ((Math.floor(duration / 3600000) * 3600) + Math.floor((duration / 60000) % 60) * 60 + Math.floor((duration / 1000) % 60));
			var percentageCompleted = (time / totalTime);
			var percentge = Math.round(percentageCompleted * (100));
			progress_bar(percentge);
		}
	} catch (e) {
		console.log("Error in update current time");
	}
};

var stopVideo = function () {
	// VIDEO_PLAYER.stop();
	// updateCurrentTime();
	show_hide_video_container();
	// closeVideo();
	// VIDEO_PLAYER.remove();
};

function forward_video() {
	if ($(".video_container").hasClass("active") && SELECTED_MENU_INDEX > 0) {
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
	}
}

function rewind_video() {
	if ($(".video_container").hasClass("active") && SELECTED_MENU_INDEX > 0) {
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
	}
}

function show_hide_video_next_previous(flag) {
	if (flag) $("#videoNextPrevious").css('display', 'table');
	else $("#videoNextPrevious").hide();
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
			totalVideo = 1;//$("#episodeList li.visible").last().index();
			firstItem = 0;//$("#episodeList li.visible").first().index();
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

/***************************************
	This is for next / previous video
****************************************/
function previous_next_video(type) {
	var obj = get_video_obj(),
		id = "",
		totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);

	// $(".progress-container").hide();
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

function show_hide_progress_bar_after_specific_time() {

	clearInterval(hide_progress_bar);
	if (VIDEO_PLAYER.getDuration() > 0 && (VIDEO_PLAYER.paused || VIDEO_PLAYER.play)) {
		if (PAGE_INDEX == 1 || PAGE_INDEX == 4 || PAGE_INDEX == 5) show_hide_video_next_previous(true);
		show_hide_player_progress(true);
		if (PAGE_INDEX == 1 || PAGE_INDEX == 2) show_hide_show_deatils(true);
		else show_hide_show_deatils(false);
		totalVideo = get_total_video_or_first_video_index(1);
		console.log(totalVideo);
		if (totalVideo < 1) {
			// $("#videoNextPrevious").hide();
		}

		hide_progress_bar = setTimeout(function () {
			running = false;
			// $(".progress-container").hide();
			$(".player_progress").hide();
			show_hide_player_progress(false);
			show_hide_show_deatils(false);
			if ($(".video_container").hasClass("active")) SN.focus('videoPlayer');
		}, 10000);
	}
}

function show_hide_player_progress(flag) {
	if (flag) {
		$(".player_progress").show();
		$(".progress-container").show();
		$("#videoNextPrevious").show();
	} else {
		$(".player_progress").hide();
		$(".progress-container").hide();
		$("#videoNextPrevious").hide();
		if ($(".video_container").hasClass("active")) SN.focus("videoPlayer");
	}
}