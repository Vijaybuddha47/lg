function load_video() {
	// VOD_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
	VIDEO_PLAYER = "";
	var features = ['progress'],
		type = "video/";

	TAB_INDEX = 6;

	if ((VOD_URL.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";

	hide_show_screens("video_container");
	sessionStorage.FWD_RWD_key_press = 0;

	check_next_and_previous_options();

	// Add vidoe player
	set_focus("videoSection", "video_container");
	SN.focus("videoSection");


	$("#video_container").html('<video class="video_box" controls id="videoPlayer" style="max-width:100%;" preload="none" height="100%" autoplay><source src="" type="' + type + '" id="videoURL"></video>');
	$("#videoURL").attr('src', VOD_URL);

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		iconSprite: '../images/spinner.png',
		stretching: "auto",
		clickToPlayPause: true,
		features: features,
		alwaysShowControls: true,
		customError: "&nbsp;",
		success: function (media, originalNode, instance) {
			$(".mejs__controls").addClass('set_progressbar').attr("id", "mejs__controls");
			$(".mejs__overlay-button").css("background", "none");
			// $(".mejs__overlay-play .mejs__overlay-button").css("display", "none");
			// $(".mejs__playpause-button button").addClass("focusable").attr("id", "Play");
			// $(".mejs__controls").append('<div class="mejs__button mejs__playpause-button mejs__previous"><button class="focusable" type="button" aria-controls="mep_0" id="Previous" title="Previous" aria-label="Previous" tabindex="0"></button></div><div class="mejs__button mejs__playpause-button mejs__next"><button class="focusable" id="Next" type="button" aria-controls="mep_0" title="Next" aria-label="Next" tabindex="0"></button></div>');

			// $(".mejs__controls").append(str);
			// $(".mejs__time-rail").append(str);
			// $(".mejs__time-total").css({ 'width': '86%', 'float': 'right' });
			set_video_details();
			// else $(".mejs__controls").removeClass('set_progressbar');

			// $(".mejs__currenttime, .mejs__duration").css('height', '18px');
			// $(".mejs__time").css({ 'font-size': '20px', 'padding-top': '18px' });

			// $(".mejs__time-total, .mejs__time-buffering, .mejs__time-loaded, .mejs__time-current, .mejs__time-float, .mejs__time-hovered, .mejs__time-float-current, .mejs__time-float-corner, .mejs__time-marker").css('height', '20px');
			// $(".mejs__time-handle-content").css({ "height": "20px", "width": "20px" });
			media.load();
			media.play();

			// set_focus('mejs__controls', 'Play');

			VIDEO_PLAYER = media;
			$("#videoNextPrevious").show();
			// next_previous_navigation();

			media.addEventListener("loadstart", function (e) {
				console.log("loading....");
				// show_hide_video_details_and_control();
				// set_video_details();
				// $("#videoNextPrevious").show();
				// show_hide_video_details(true);
			});
			media.addEventListener('progress', function (e) {
				console.log("progress");
				// $(".mejs__overlay-play").css("display", "none");
				// show_hide_video_details_and_control();
			});

			media.addEventListener('ended', function (e) {
				console.log("end video..............." + e.message);
				closeVideo();
			});

			media.addEventListener('playing', function (e) {
				console.log("playing...............");
				// $(".mejs__overlay-play").css("display", "none");
				// $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
				// $("#playPauseVideo").find("img").attr("src", 'images/pause.png');
				// show_hide_video_details_and_control();
			});

			media.addEventListener('play', function (e) {
				console.log("play...............");
				// $(".mejs__overlay-play").css("display", "none");
				// $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
				$("#playPauseVideo").attr("data-name", "pause");
				$("#playPauseVideo").find("img").attr("src", 'images/pause.png');
				show_hide_progress_bar_after_specific_time();
			});

			media.addEventListener('pause', function (e) {
				console.log("pause...............");
				// $(".mejs__overlay-play").css("display", "none");
				// $(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
				$("#playPauseVideo").attr("data-name", "play");
				$("#playPauseVideo").find("img").attr("src", 'images/play.png');

				$("#video_player_about_video").show();
				$(".set_progressbar").show();
				$(".mejs__controls").show();
				$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
				$(".video_next_previous_container").show();
			});

			media.addEventListener('timeupdate', function (e) { });

			media.addEventListener('canplay', function (e) {
				console.log("canplay");
			});

			media.addEventListener('seeking', function (e) {
				console.log("seeking");
				show_hide_progress_bar_after_specific_time();
			}, true);

			media.addEventListener('seeked', function (e) {
				console.log("seeked");
				$(".video-inner").hide();
			}, true);

			media.addEventListener("hlsError", function (e) {
				console.log("hlsError....", e);
				if (e.data.fatal) {
					retry_error_popup();
					// media.pause();
				}
			});

			media.addEventListener('error', function (e) {
				console.log("error");
				retry_error_popup();
				// media.pause();
			});

		},

		error: function (mediaElement, originalNode, instance) {
			// if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
			retry_error_popup();
		}

	});
}

function retry_error_popup(playerErrorType) {
	var onlineStatus = navigator.onLine;

	var errorMsg = '';
	switch (playerErrorType) {
		case "PLAYER_ERROR_NONE": errorMsg = TXT['PLAYER_COMPLETED']; break;
		case "PLAYER_ERROR_INVALID_PARAMETER": errorMsg = TXT["UNABLE_TO_FIND"]; break;
		case "PLAYER_ERROR_NO_SUCH_FILE": errorMsg = TXT["NOT_FIND_MEDIA"]; break;
		case "PLAYER_ERROR_INVALID_OPERATION": errorMsg = TXT["INVALID_API_CALL"]; break;
		case "PLAYER_ERROR_SEEK_FAILED": errorMsg = TXT["INVALID_SEEK"]; break;
		case "PLAYER_ERROR_INVALID_STATE": errorMsg = TXT["MEDIA_INVALID_STATE"]; break;
		case "PLAYER_ERROR_NOT_SUPPORTED_FILE": errorMsg = TXT["MEDIA_NOT_SUPPORTED"]; break;
		case "PLAYER_ERROR_INVALID_URI": errorMsg = TXT["INPUT_URI_INVALID"]; break;
		case "PLAYER_ERROR_CONNECTION_FAILED": errorMsg = TXT["FAILED_MULTIPLE_ATTEMPT"]; break;
		case "PLAYER_ERROR_GENEREIC": errorMsg = TXT["FAILED_TO_DISPLAY"]; break;

	}

	if (onlineStatus) msg = TXT['UNAVAILABLE'];
	else msg = TXT['CHECK_CONNECTION'];

	if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
		if (errorMsg != "" && onlineStatus) msg = errorMsg;
		hide_show_modal(true, 'RETRY_CANCEL', msg);
	}
}

var closeVideo = function () {
	if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
	$(".circle_loader").removeClass('circle-loader-middle');
	sessionStorage.FWD_RWD_key_press = 0;
	$("#video_container, .video-player-container").css('display', 'none');
	$("#video_container").hide();
	$(".video-inner").hide();
	$(".loader").hide();
	$(".set_progressbar").hide();
	$(".video_container").removeClass("active").hide();
	$(".pause-icon").hide();
	// show_hide_video_details_and_control();
	$(".main-container").show();
	var container = "";
	if (PAGE_INDEX < 2) {
		if (PAGE_INDEX == 0) container = "search_container";
		else if (PAGE_INDEX == 1) container = "home_container";
		hide_show_screens(container);
		SN.focus("#" + FIRST_LEVEL_SELECTED_ITEM);
	} else {
		if (PAGE_INDEX == 5) {
			container = "video_list_container";
			hide_show_screens(container);
			SN.focus("#" + THIRD_LEVEL_SELECTED_ITEM);
		}
	}
};

var playVideo = function () {
	if (document.hidden) {
	} else {
		if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
			$(".pause-icon").hide();
			$("#playPauseIcon").attr('src', 'images/pause.png');
			VIDEO_PLAYER.play();
			show_hide_progress_bar_after_specific_time();

		} else {
			closeVideo();
		}
	}
};

var pauseVideo = function () {
	if (document.hidden) {
	} else {
		if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
			// $(".pause-icon").show();
			$("#playPauseIcon").attr('src', 'images/play.png');
			VIDEO_PLAYER.pause();
			show_hide_progress_bar_after_specific_time();
		}
	}

};


//This function is used to hide progress bar after 10 second
function show_hide_progress_bar_after_specific_time() {
	clearInterval(hide_progress_bar);
	// if (PAGE_INDEX == 5) {
	$("#video_player_about_video").show();
	$(".set_progressbar").show();
	$(".mejs__controls").show();
	$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
	$(".video_next_previous_container").show();
	// }

	totalVideo = get_total_video_or_first_video_index(1);
	if (totalVideo < 1) {
		// $("#videoNextPrevious").hide();
	}

	hide_progress_bar = setTimeout(function () {
		running = false;
		$("#video_player_about_video").hide();
		$(".set_progressbar").hide();
		$(".mejs__controls").hide();
		$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 0);
		$(".video_next_previous_container").hide();
		SN.focus('videoSection');
	}, 3000);
}

function forward_video() {
	if ($(".video_container").hasClass("active")) {
		$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
	}
}

function rewind_video() {
	if ($(".video_container").hasClass("active")) {
		$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
	}
}


function show_hide_video_next_previous(flag) {
	if (flag) {
		$("#videoNextPrevious").css('opacity', 1);
		$("#videoNextPrevious").css('display', 'table');
		SN.focus("#playPauseVideo");
	}
	// else $("#videoNextPrevious").hide();
}

function check_next_and_previous_options() {
	var totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0),
		obj = get_video_obj();


	$(".button-blur").removeClass("button-blur");

	// show next video button
	if (totalVideo > VOD_COUNTER) {
		$("#playNextVideo").removeClass("button-blur");
		// $("#playNextVideo").css('visibility', 'visible');
		// $("#playPauseVideo").attr('data-sn-right', '#playPreviousVideo');
		// $("#playPauseVideo").attr('data-sn-right', '#playNextVideo');
		$("#playPreviousVideo").attr('data-sn-right', '#playNextVideo');
		$("#playPreviousVideo").attr('data-sn-left', '#playPauseVideo');

	} else {
		$("#playNextVideo").addClass("button-blur");
		// $("#playNextVideo").css('visibility', 'hidden');
		// $("#playPauseVideo").attr('data-sn-right', 'null');
		$("#playPreviousVideo").attr('data-sn-right', 'null');
	}

	// show previous video button
	if (VOD_COUNTER > firstItem) {
		$("#playPreviousVideo").removeClass("button-blur");
		// $("#playPreviousVideo").css('visibility', 'visible');
		// $("#playPauseVideo").attr('data-sn-left', 'null');
		$("#playNextVideo").attr('data-sn-left', '#playPreviousVideo');
		$("#playPauseVideo").attr('data-sn-right', '#playPreviousVideo');
	} else {
		$("#playPreviousVideo").addClass("button-blur");
		// $("#playPreviousVideo").css('visibility', 'hidden');
		// $("#playPauseVideo").attr('data-sn-left', 'null');
		$("#playNextVideo").attr('data-sn-left', '#playPauseVideo');
		$("#playPauseVideo").attr('data-sn-right', '#playNextVideo');
	}
}


function show_hide_video_details_and_control() {
	if ($(".mejs__controls").hasClass('mejs__offscreen')) {
		$("#videoNextPrevious").hide();
		$("#video_player_about_video").hide();
	} else {
		$("#videoNextPrevious").show();
		$("#video_player_about_video").show();
	}
}


/***************************************
	This is for next / previous video
****************************************/
function previous_next_video(type) {
	var obj = get_video_obj(),
		totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);

	$(".set_progressbar").hide();
	$(".video-title").text('');

	// hide next video button
	if (VOD_COUNTER == totalVideo) {
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-right', 'null');
	}
	// hide previous video button
	else if (VOD_COUNTER == firstItem) {
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');

	}

	switch (type) {
		case "previous":
			if (VOD_COUNTER > 0) {
				VOD_COUNTER = VOD_COUNTER - 1;
				if (PAGE_INDEX < 2) {
					if (PAGE_INDEX == 0) {
						FIRST_LEVEL_SELECTED_ITEM = $("#" + FIRST_LEVEL_SELECTED_ITEM).prev().attr("id");
						VOD_URL = APP_SEARCH_ARRAY[VOD_COUNTER]["link"];
					}
					else if (PAGE_INDEX == 1) {
						FIRST_LEVEL_SELECTED_ITEM = $("#" + FIRST_LEVEL_SELECTED_ITEM).parent().prev().children().attr("id");
						VOD_URL = APP_DATA_ARRAY[VOD_COUNTER]["link"];
					}
				} else if (PAGE_INDEX == 5) {
					THIRD_LEVEL_SELECTED_ITEM = $("#" + THIRD_LEVEL_SELECTED_ITEM).parent().prev().children().attr("id");
					VOD_URL = APP_VIDEO_ARRAY[VOD_COUNTER]["link"];
				}

				VOD_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
				// load_video();
				VIDEO_PLAYER.setSrc(VOD_URL);
				VIDEO_PLAYER.load();
				check_next_and_previous_options();
			}

			break;

		case "next":
			if (VOD_COUNTER < totalVideo) {
				VOD_COUNTER = VOD_COUNTER + 1;
				if (PAGE_INDEX < 2) {
					if (PAGE_INDEX == 0) {
						FIRST_LEVEL_SELECTED_ITEM = $("#" + FIRST_LEVEL_SELECTED_ITEM).next().attr("id");
						VOD_URL = APP_SEARCH_ARRAY[VOD_COUNTER]["link"];
					}
					else if (PAGE_INDEX == 1) {
						FIRST_LEVEL_SELECTED_ITEM = $("#" + FIRST_LEVEL_SELECTED_ITEM).parent().next().children().attr("id");
						VOD_URL = APP_DATA_ARRAY[VOD_COUNTER]["link"];
					}
				} else if (PAGE_INDEX == 5) {
					THIRD_LEVEL_SELECTED_ITEM = $("#" + THIRD_LEVEL_SELECTED_ITEM).parent().next().children().attr("id");
					VOD_URL = APP_VIDEO_ARRAY[VOD_COUNTER]["link"];
				}

				VOD_URL = "https://player.vimeo.com/progressive_redirect/playback/856322369/rendition/1080p/file.mp4?loc=external&oauth2_token_id=1688804015&signature=588675e4a01e3b004383781321d6392d4450e4f5d51ee45ae52770db7e5a8a65";//"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4";
				// load_video();
				VIDEO_PLAYER.setSrc(VOD_URL);
				VIDEO_PLAYER.load();
				check_next_and_previous_options();
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
		case 0: // For search video list
			totalVideo = $("#search_result li").last().index();
			firstItem = $("#search_result li").first().index();
			break;
		case 1: // For home video list 
			totalVideo = $("#home_items").children().last().index();
			firstItem = $("#home_items").children().first().index();
			break;
		case 5: // For categories or subcategories video list 
			totalVideo = $("#video_list li").last().index();
			firstItem = $("#video_list li").first().index();
			break;
	}

	if (type == 1) return totalVideo;
	else return firstItem;

}

// It returns current vod object while playing video
function get_video_obj() {
	var obj = "";
	switch (PAGE_INDEX) {
		case 0: obj = APP_SEARCH_ARRAY[$("#" + FIRST_LEVEL_SELECTED_ITEM).index()];
			break;

		case 1: obj = APP_DATA_ARRAY[$("#" + FIRST_LEVEL_SELECTED_ITEM).index()];
			break;

		case 5: obj = APP_VIDEO_ARRAY[$("#" + THIRD_LEVEL_SELECTED_ITEM).index()];
			break;
	}

	return obj;
}

//set focus images on next previous buttons

function set_focus_images() {
	console.log("set_focus_images");
	var imgArr = ["play", "previous", "next", "pause"];
	$(".video_next_previous_icon_list li").each(function (i) {
		if (i == 0 && VIDEO_PLAYER.getPaused()) $(this).find("img").attr("src", "images/" + imgArr[3] + ".png");
		else $(this).find("img").attr("src", "images/" + imgArr[i] + ".png");
	});

	let img = $(":focus").attr("data-name");
	if ($(":focus").parent().parent().parent().attr("id") == "videoNextPrevious") {
		if (VIDEO_PLAYER.getPaused() && ($(":focus").attr("id") == "playPauseVideo")) $(":focus").find("img").attr("src", "images/pause_focused.png");
		else if (!VIDEO_PLAYER.getPaused() && ($(":focus").attr("id") == "playPauseVideo")) $(":focus").find("img").attr("src", "images/play_focused.png");
		else $(":focus").find("img").attr("src", "images/" + img + "_focused.png");
	}
}
