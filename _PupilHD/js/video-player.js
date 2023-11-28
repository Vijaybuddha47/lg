function load_video() {
	TAB_INDEX = 6;
	if (PREVIEW_PLAYER) {
		try {
			PREVIEW_PLAYER.pause();
			PREVIEW_PLAYER.remove();
		} catch (err) {
			console.log(err);
		}
	}
	VIDEO_PLAYER = "";
	var features = [],
		videoElement = '',
		type = "video/",
		url = "";

	if (PAGE_INDEX != 0) features = ["current", "progress", "duration"];

	if (VOD_URL.toLowerCase().indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";

	show_hide_video_container();
	show_hide_video_next_previous(true);

	console.log("VOD_URL", VOD_URL);

	var totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);

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

	if (PAGE_INDEX == 1) {
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');
		$("#playPauseVideo").attr('data-sn-right', 'null');
	}

	set_focus("videoPlayer", "");
	SN.focus("videoPlayer");

	$('#video_container').html(
		'<video controls id="videoLibraryPlayer" style="max-width:100%;" poster="" preload="none" class="video_box videoPlayer"><source src="" type="' +
		type +
		'" id="videoLibraryURL"></video>'
	);

	$("#videoLibraryURL").attr("src", VOD_URL);

	MEDIA_OBJ = new MediaElementPlayer("videoLibraryPlayer", {
		stretching: "auto",
		features: features,
		customError: "&nbsp;",
		pauseOtherPlayers: true,
		success: function (media) {
			console.log("main player success...");

			$(".mejs__controls").addClass("set_progressbar");
			$(".mejs__controls").addClass("mejs__controls_bottom");
			$(".mejs__time").css("font-size", "26px");
			$(".mejs__time-rail").css("padding-top", "6px");
			$(".mejs__time-handle-content").css({
				"width": "20px",
				"height": "20px"
			});
			$(".mejs__time-total, .mejs__time-buffering, .mejs__time-loaded, .mejs__time-current, .mejs__time-float, .mejs__time-hovered, .mejs__time-float-current, .mejs__time-float-corner, .mejs__time-marker").css("height", "20px");


			media.load();
			media.play();
			VIDEO_PLAYER = media;

			media.addEventListener('loadedmetadata', function (e) {
				console.log('loadedmetadata...');
				show_hide_show_deatils(false);
			});

			media.addEventListener("loadstart", function (e) {
				console.log("loading....");
				show_hide_show_deatils(true);
				SN.focus("videoNextPrevious");
			});

			media.addEventListener("progress", function (e) {
				console.log("progress...");
			});

			media.addEventListener("playing", function (e) {
				console.log("playing...");
				setTimeout(function () {
					show_hide_show_deatils(false);
				}, 3000);
				if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
				$("#playPauseIcon").attr("src", "images/pause.png");
				$(".mejs__controls").addClass("mejs__offscreen").css("opacity", 0);
				$(".preview-video-inner").hide();
				$(".video-inner").hide();
				$(".mejs__overlay-button").css("display", "none");
			});

			media.addEventListener("pause", function (e) {
				console.log("pause...");
				show_hide_show_deatils(true);
				$(".mejs__controls").removeClass("mejs__offscreen").css("opacity", 1);
				$("#playPauseIcon").attr("src", "images/play.png");
				$(".mejs__overlay-button").css("display", "none");
			});


			media.addEventListener('seeking', function (e) {
				console.log("seeking");
				show_hide_show_deatils(true);
				$("#player_next_previous_container").css("display", "block");
				$("#videoNextPrevious").css("display", "block");
				$(".mejs__controls").removeClass("mejs__offscreen").css("opacity", 1);
				$(".mejs__overlay-button").css("display", "none");
			}, true);

			media.addEventListener('seeked', function (e) {
				console.log("seeked");
				show_hide_show_deatils(false);
				$("#player_next_previous_container").css("display", "none");
				$("#videoNextPrevious").css("display", "none");
				$(".mejs__controls").addClass("mejs__offscreen").css("opacity", 0);
				$(".mejs__overlay-button").css("display", "none");
			}, true);

			media.addEventListener('timeupdate', function () {
				console.log("timeupdate playing");
				$(".mejs__overlay-button").css("display", "none");
				var currentTime = VIDEO_PLAYER.getCurrentTime();
			});

			media.addEventListener("ended", function (e) {
				console.log("end video..." + e.message);
				$(".video-inner").hide();
				if (PAGE_INDEX != 0) {
					var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
					var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM)
						.parent()
						.parent()
						.parent()
						.attr("data-category");
					totalVideo = get_total_video_or_first_video_index(1);
					if (VOD_COUNTER < totalVideo) previous_next_video((type = "next"));
					else closeVideo();
					$("div#video-preview-player").empty();
					$("div#video-preview-player").html(
						'<img src="' +
						APP_IMAGE_URL +
						APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] +
						'" alt="' +
						APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] +
						'">'
					);
				}
			});

			media.addEventListener("canplay", function (e) {
				PLAY_VIDEO = true;
				if (APP_GENRE_COUNTRY_LIST == 0) show_hide_programme_details_after_specific_time();
			});

			media.addEventListener("hlsError", function (e) {
				console.log("hlsError in stream: ", e);
				if (!e.data.fatal && PLAYER_STATE) {
					VIDEO_PLAYER.pause();
					VIDEO_PLAYER.play();
				} else if (e.data.fatal && PLAYER_STATE) {
					PLAY_VIDEO = true;
					retry_error_popup(e.message);
					media.pause();
				}
			});

			media.addEventListener("error", function (e) {
				console.log("Error in stream: ", e);
				PLAY_VIDEO = true;
				e.message;
				retry_error_popup(e.message);
				media.pause();
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
			if ($("#playPauseVideo").is(":focus")) $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause_focus.png');
			else $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png')
			VIDEO_PLAYER.play();
			show_hide_progress_bar_after_specific_time();
		} else if ($('#preview_video_container').css('display', 'block')) {
			$(".preview-video-inner").hide();
			VIDEO_PLAYER.play();

		} else {
			closeVideo();
		}
	}
};

var pauseVideo = function () {
	if ($('#video_container').is(':visible')) {
		console.log("pause video");
		if ($("#playPauseVideo").is(":focus")) $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/play_focus.png');
		else $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/play.png');
		VIDEO_PLAYER.pause();
		show_hide_progress_bar_after_specific_time();
	}
};

var closeVideo = function () {
	PLAYER_STATE = 0;
	show_hide_show_deatils(false);
	console.log("close video");
	deleteMediaInfo();
	if (VIDEO_PLAYER.play()) VIDEO_PLAYER.pause();
	if (VIDEO_PLAYER) {
		VIDEO_PLAYER.setSrc("https://arabic.pupilhd.net/pupilhd/ch102xcv9/playlist8jhf.m3u8");
		// VIDEO_PLAYER.load();
	}
	show_hide_show_deatils(false);
	$(".circle_loader").removeClass('circle-loader-middle');
	stopVideo();
	show_hide_video_next_previous(false);
	sessionStorage.FWD_RWD_key_press = 0;
	$("#video_container").css('display', 'none');
	$("#video_container").removeClass("active").hide();
	$("#video_player_about_video").hide();
	$(".video-inner").hide();
	$(".loader").hide();
	// $(".progress-container").hide();
	$(".player_next_previous_container").hide();
	$(".main_container").show();
	if (PAGE_INDEX == 0) $(".home_container").addClass("active").show();
	else if (PAGE_INDEX == 1) {
		PLAYER_STATE = 0;
		show_hide_show_deatils(false);
		$(".video_library_container").addClass("active").show();
		$(".video_list").show();
		var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
		var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM).parent().parent().parent().attr("data-category");
		VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
		$("div#video-preview-player").empty();
		$("div#video-preview-player").html('<img src="' + APP_IMAGE_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');
		SN.focus("#" + SECOND_PAGE_FOCUSED_ITEM);
	} else if (PAGE_INDEX == 2) {
		PLAYER_STATE = 0;
		$(".video_library_container").addClass("active").show();
		$(".episode_container").show();
		var index = $("li#" + SECOND_PAGE_SELECTED_ITEM).index();
		var categoryName = $("#" + SECOND_PAGE_SELECTED_ITEM).parent().parent().parent().attr("data-category");
		VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
		$("div#video-preview-player").empty();
		$("div#video-preview-player").html('<img src="' + APP_IMAGE_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');
		SN.focus("#episode_" + (SELECTED_EPIOSDE_NUMBER - 1));
	} else if (PAGE_INDEX == 3) {
		show_hide_show_deatils(false);
		$(".search_container").addClass("active").show();
		if ($(".search_episode_list_container").css("display") == "block") SN.focus("search_result_episode_list");
		else SN.focus("#" + FOURTH_PAGE_SELECTED_ITEM);
		var i = $(":focus").index();
		$("div#searchpage_player").empty();
		$("div#searchpage_player").html('<img src="' + APP_IMAGE_URL + SEARCHED_VIDEO_LIST[i]["poster"] + '" alt="' + SEARCHED_VIDEO_LIST[i]["name"] + '"/>');
	}

	$("#video_player_about_video").hide();
	$(".video_container").removeClass("active").hide();
	progress_bar(0);
	// document.getElementById("currentTime").innerHTML = "00:00";
};

var stopVideo = function () {
	show_hide_show_deatils(false);
	VIDEO_PLAYER.pause();
	show_hide_video_container();
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
	if (PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 3) show_hide_video_next_previous(true);
	// show_hide_player_next_previous_container(true);
	// if (PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 3) show_hide_show_deatils(true);
	// else show_hide_show_deatils(false);
	totalVideo = get_total_video_or_first_video_index(1);

	hide_progress_bar = setTimeout(function () {
		running = false;
		$(".player_next_previous_container").hide();
		show_hide_player_next_previous_container(false);
		show_hide_show_deatils(false);
		if ($(".video_container").hasClass("active")) SN.focus('videoPlayer');
	}, 10000);
}

function show_hide_video_next_previous(flag) {
	show_hide_player_next_previous_container(flag);
	if (PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 3) show_hide_show_deatils(true);
	else show_hide_show_deatils(false);
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
	}
}

/***************************************
	This is for next / previous video
****************************************/
function previous_next_video(type) {
	var id = "",
		totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);

	$(".player_next_previous_container").hide();
	$(".video-title").text('');

	console.log("totalVideo", totalVideo);

	// hide next video button
	if (VOD_COUNTER == totalVideo) {
		console.log("1", (VOD_COUNTER == totalVideo));
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-right', 'null');
	}
	// hide previous video button
	else if (PAGE_INDEX == 2 && VOD_COUNTER == $("#episodeList li.visible").first().index()) {
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');
	} else if (PAGE_INDEX == 3 && VOD_COUNTER == $("#search_result_episode_list li.visible").first().index()) {
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');
	}

	switch (type) {
		case "previous":
			if (VOD_COUNTER > 0) {
				if (PAGE_INDEX == 2) VOD_COUNTER = $("#episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li').index();
				else if (PAGE_INDEX == 3 && $("#search_result_episode_container").css("display") == "block") VOD_COUNTER = $("#search_result_episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li').index();
				VOD_URL = SELECTED_EPISODES[VOD_COUNTER];
				SELECTED_EPIOSDE_NUMBER = SELECTED_EPIOSDE_NUMBER - 1;
				show_hide_show_deatils(true);
				$("#playNextVideo").css('visibility', 'visible');
				$("#playPauseVideo").attr('data-sn-right', '#playNextVideo');
				setTimeout(function () {
					VIDEO_PLAYER.setSrc(VOD_URL);
					VIDEO_PLAYER.load();
					VIDEO_PLAYER.play();
				}, 1000);
			}

			break;

		case "next":
			if (VOD_COUNTER < totalVideo) {
				if (PAGE_INDEX == 2) VOD_COUNTER = $("#episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").next('li').index();
				else if (PAGE_INDEX == 3 && $("#search_result_episode_container").css("display") == "block") VOD_COUNTER = $("#search_result_episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").next('li').index();
				VOD_URL = SELECTED_EPISODES[VOD_COUNTER];
				SELECTED_EPIOSDE_NUMBER = SELECTED_EPIOSDE_NUMBER + 1;
				show_hide_show_deatils(true);
				$("#playPreviousVideo").css('visibility', 'visible');
				$("#playPauseVideo").attr('data-sn-left', '#playPreviousVideo');
				setTimeout(function () {
					VIDEO_PLAYER.setSrc(VOD_URL);
					VIDEO_PLAYER.load();
					VIDEO_PLAYER.play();
				}, 1000);
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
		case 1: // For first page
			totalVideo = 1;
			firstItem = 0;
			break;

		case 2: // For second page 
			totalVideo = $("#episode_list li").last().index();
			firstItem = $("#episode_list li").first().index();
			break;

		case 3: // For shearch  episode list
			if ($("#search_result_episode_container").css("display") == "block") {
				totalVideo = $("#search_result_episode_list li").last().index();
				firstItem = $("#search_result_episode_list li").first().index();
			}
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
function show_hide_player_next_previous_container(flag) {
	if (flag) {
		$(".player_next_previous_container").show();
		$(".progress-container").show();
		$("#videoNextPrevious").show();
		$("#playPreviousVideo").show();
		$("#playNextVideo").show();
	} else {
		$(".player_next_previous_container").hide();
		$(".progress-container").hide();
		$("#videoNextPrevious").hide();
		if ($(".video_container").hasClass("active")) SN.focus("videoPlayer");
	}
}



