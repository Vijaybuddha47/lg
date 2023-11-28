function load_video() {
	VIDEO_PLAYER = "";
	var features = [],
		type = "video/",
		url = "";

	features = ['current', 'progress', 'duration'];

	if ((VOD_URL.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";

	show_hide_video_container();
	sessionStorage.FWD_RWD_key_press = 0;
	// $(".progress-container").hide();
	// $(".video_next_previous_container").hide();

	var totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0),
		obj = get_video_obj();

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

	// Add vide player
	show_hide_video_next_previous(true);

	$("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');
	$("#videoURL").attr('src', VOD_URL);

	SN.focus("videoSection");

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		stretching: "auto",
		features: features,
		customError: "&nbsp;",
		success: function (media) {

			$(".mejs__controls").addClass('progress-container'); // Progressbar Shift upside 
			// else $(".mejs__controls").removeClass('progress-container');

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
				VIDEO_PLAYER.pause();
			});

			media.addEventListener('ended', function (e) {
				console.log("end video..............." + e.message);
				totalVideo = get_total_video_or_first_video_index(1);
				if (VIDEO_COUNT < 4) {
					VIDEO_COUNT++;
					previous_next_video(type = "next");
				} else closeVideo();
			});

			media.addEventListener('playing', function (e) {
				console.log("playing...............");
				$("#playPauseIcon").attr('src', 'images/pause.png');
				setTimeout(function () {
					$(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
					$(".mejs__controls").hide();
					$("#videoNextPrevious").hide();
				}, 5000);

			});

			media.addEventListener('pause', function (e) {
				console.log("pause...............");
				$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
				$(".mejs__controls").show();
				$("#playPauseIcon").attr('src', 'images/play.png');
				$("#videoNextPrevious").show();
			});

			media.addEventListener('timeupdate', function (e) { });

			media.addEventListener('canplay', function (e) {
				PLAY_VIDEO = true;
				show_hide_programme_details_after_specific_time();
			});

			media.addEventListener('seeking', function (e) {
				console.log("seeking");
			}, true);

			media.addEventListener('seeked', function (e) {
				console.log("seeked");
				VIDEO_PLAYER.play();
			}, true);

		}
	});
}

function retry_error_popup(playerErrorType) {
	console.log("retry_error_popup() ", playerErrorType);
	var onlineStatus = navigator.onLine;

	var errorMsg = '';
	switch (playerErrorType) {
		case "PLAYER_ERROR_NONE": errorMsg = "Operation has successfully completed."; break;
		case "PLAYER_ERROR_INVALID_PARAMETER": errorMsg = "Unable to find the parameter"; break;
		case "PLAYER_ERROR_NO_SUCH_FILE": errorMsg = "Unable to find the specified media content"; break;
		case "PLAYER_ERROR_INVALID_OPERATION": errorMsg = "Invalid API Call at the moment"; break;
		case "PLAYER_ERROR_SEEK_FAILED": errorMsg = "Failed to perform seek operation, or seek operation called during an invalid state"; break;
		case "PLAYER_ERROR_INVALID_STATE": errorMsg = "AVPlay API method was called during an invalid state"; break;
		case "PLAYER_ERROR_NOT_SUPPORTED_FILE": errorMsg = "Multimedia file format not supported"; break;
		case "PLAYER_ERROR_INVALID_URI": errorMsg = "Input URI is in an invalid format"; break;
		case "PLAYER_ERROR_CONNECTION_FAILED": errorMsg = "Failed multiple attempts to connect to the specified content server"; break;
		case "PLAYER_ERROR_GENEREIC": errorMsg = "Failed to create the display window"; break;
	}

	if (onlineStatus) msg = "The content is currently unavailable. Please check back later.";
	else msg = NET_CONNECTION_ERR;

	if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
		console.log("hide show modal");
		if (errorMsg != "" && onlineStatus) msg = errorMsg;
		hide_show_modal(true, 'RETRY_CANCEL', msg);
	}
	// }
}

var closeVideo = function () {
	console.log("close video");
	$(".circle_loader").removeClass('circle-loader-middle');
	if (VIDEO_COUNT != 0) VIDEO_COUNT = 0;
	VIDEO_PLAYER.pause();
	PLAY_VIDEO = false;
	show_hide_video_next_previous(false);
	sessionStorage.FWD_RWD_key_press = 0;
	$("#video_container").html('');
	$("#video_container").hide();
	$(".video-inner").hide();
	$(".loader").hide();
	$(".progress-container").hide();

	if (PAGE_INDEX == 0 && PLAY_PAGE_INDEX == 1) {
		console.log("home page show");
		hide_video_player_screens(PAGE_INDEX);
	}
	else {
		console.log("detail page show");
		$(".video_container").removeClass("active").hide();
		$(".main_container").show();
		$(".homepage_header").hide();
		$(".detail_page_main_container").addClass("active").show();
		$(".header_container").show();
		$(".common_header").show();
		SN.focus("DetailPageButton");
	}

	$(".video_container").removeClass("active").hide();
	$(".pause-icon").hide();
	$(".video_next_previous_container").hide();
	// progress_bar(0);
	// document.getElementById("currentTime").innerHTML = "00:00";
};

var playVideo = function () {
	console.log("playVideo");
	if (document.hidden) {
		console.log("App in background");
	} else {
		console.log("play video");
		if ($('#video_container').css('display', 'block')) {
			$(".pause-icon").hide();
			$("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png');
			VIDEO_PLAYER.play();
			show_hide_progress_bar_after_specific_time();

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


//This function is used to hide progress bar after 10 second
function show_hide_progress_bar_after_specific_time() {
	console.log("show_hide_progress_bar_after_specific_time focus");
	clearInterval(hide_progress_bar);
	if (VIDEO_PLAYER.getDuration() > 0 && (VIDEO_PLAYER == "pause" || VIDEO_PLAYER == "playing")) {
		if (PAGE_INDEX == 1 || PAGE_INDEX == 4 || PAGE_INDEX == 5) show_hide_video_next_previous(true);
		if ($('.progress-container').css('display') == 'none') {
			$(".progress-container").show();
			$(".mejs__controls").show();
			$(".video_next_previous_container").show();
		}

		totalVideo = get_total_video_or_first_video_index(1);
		if (totalVideo < 1) {
			$("#videoNextPrevious").hide();
		}

		hide_progress_bar = setTimeout(function () {
			running = false;
			$(".video_next_previous_container").hide();
			$(".progress-container").hide();
			$(".mejs__controls").hide();
			SN.focus('videoSection');
		}, 10000);
	}
}

function forward_video() {
	if ($(".video_container").hasClass("active")) {
		console.log("forward video");
		$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
	}
}

function rewind_video() {
	if ($(".video_container").hasClass("active")) {
		console.log("rewind video");
		$(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
		VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
	}
}

function show_hide_video_next_previous(flag) {
	if (flag) {
		$("#videoNextPrevious").css('opacity', 1);
		$("#videoNextPrevious").css('display', 'table');
	}
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
		case 0:
			if (PLAY_PAGE_INDEX == 1) {
				totalVideo = _.size(APP_HOME_FEATURED_LIST) - 1;
				firstItem = 0;
			} else if (PLAY_PAGE_INDEX == 2) {
				totalVideo = $("#" + PLAY_LIST_ELEMENT_ID + " li").last().index();
				firstItem = $("#" + PLAY_LIST_ELEMENT_ID + " li").first().index();
			}
			break;

		case 1:
			if (PLAY_PAGE_INDEX == 2) {
				totalVideo = $("#" + PLAY_LIST_ELEMENT_ID + " li").last().index();
				firstItem = $("#" + PLAY_LIST_ELEMENT_ID + " li").first().index();
			}
			break;

		case 2:
			if (PLAY_PAGE_INDEX == 2) {
				totalVideo = $("#" + PLAY_LIST_ELEMENT_ID + " li").last().index();
				firstItem = $("#" + PLAY_LIST_ELEMENT_ID + " li").first().index();
			}
			break;

		case 4:
			if (PLAY_PAGE_INDEX == 2) {
				totalVideo = $("#" + PLAY_LIST_ELEMENT_ID + " li").last().index();
				firstItem = $("#" + PLAY_LIST_ELEMENT_ID + " li").first().index();
			}
			break;

		case 5:
			if (PLAY_PAGE_INDEX == 2) {
				totalVideo = $("#" + PLAY_LIST_ELEMENT_ID + " li").last().index();
				firstItem = $("#" + PLAY_LIST_ELEMENT_ID + " li").first().index();
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
		if ($(".video_container").hasClass("active")) SN.focus('videoSection');
	}, 10000);
}

/***************************************
	This is for next / previous video
****************************************/
function previous_next_video(type) {

	var id = "",
		totalVideo = get_total_video_or_first_video_index(1),
		firstItem = get_total_video_or_first_video_index(0);

	// $(".progress-container").hide();
	$(".progress-container").hide();
	$(".video-title").text('');

	// hide next video button
	if (VOD_COUNTER == totalVideo) {
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-right', 'null');

		// $("#playPreviousVideo").css('visibility', 'visible');
		// $("#playPauseVideo").attr('data-sn-left', '#playPreviousVideo');

	} else if (PLAY_PAGE_INDEX == 1) {  // hide previous video button
		if (VOD_COUNTER == 0) {
			$("#playPreviousVideo").css('visibility', 'hidden');
			$("#playPauseVideo").attr('data-sn-left', 'null');
		}

	} else if (PLAY_PAGE_INDEX == 2) { // hide previous video button
		if (VOD_COUNTER == $("#" + PLAY_LIST_ELEMENT_ID + " li").first().index()) {
			$("#playPreviousVideo").css('visibility', 'hidden');
			$("#playPauseVideo").attr('data-sn-left', 'null');

			// $("#playNextVideo").css('visibility', 'visible');
			// $("#playPauseVideo").attr('data-sn-right', '#playNextVideo');
		}
	}

	switch (type) {
		case "previous":
			if (VOD_COUNTER > 0) {
				if (PLAY_PAGE_INDEX == 1) {
					set_video_counter();
					VOD_COUNTER = VOD_COUNTER - 1;
					VIDEO_ID = APP_HOME_FEATURED_LIST[VOD_COUNTER];
				} else if (PLAY_PAGE_INDEX == 2) {

					if (PAGE_INDEX == 0 || PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 4 || PAGE_INDEX == 5) {
						VOD_COUNTER = $("#" + PLAY_LIST_ELEMENT_ID + " li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li').index();
						VIDEO_ID = $("#" + PLAY_LIST_ELEMENT_ID + " li:nth-child(" + (VOD_COUNTER + 1) + ")").attr('data-id');
					}

				}
				get_video_url();
			}

			break;

		case "next":
			if (VOD_COUNTER < totalVideo) {
				if (PLAY_PAGE_INDEX == 1) {
					set_video_counter();
					VOD_COUNTER = VOD_COUNTER + 1;
					VIDEO_ID = APP_HOME_FEATURED_LIST[VOD_COUNTER];

				} else if (PLAY_PAGE_INDEX == 2) {

					if (PAGE_INDEX == 0 || PAGE_INDEX == 1 || PAGE_INDEX == 2 || PAGE_INDEX == 4 || PAGE_INDEX == 5) {
						VOD_COUNTER = $("#" + PLAY_LIST_ELEMENT_ID + " li:nth-child(" + (VOD_COUNTER + 1) + ")").next('li').index();
						VIDEO_ID = $("#" + PLAY_LIST_ELEMENT_ID + " li:nth-child(" + (VOD_COUNTER + 1) + ")").attr('data-id');
					}
				}
				get_video_url();
			}
			break;
	}

	var obj = get_video_obj();
}

// It returns current vod object while playing video
function get_video_obj() {
	var obj = "";
	switch (PAGE_INDEX) {
		case 0:
			if (PLAY_PAGE_INDEX == 1) obj = HOME_PAGE_FEATURED_DATA[VIDEO_ID];
			else if (PLAY_PAGE_INDEX == 2) obj = APP_HOME_PAGE_MIXED_DATA[VIDEO_ID];
			break;

		case 1: obj = SELECTED_TALENT_DATA[VIDEO_ID];
			break;

		case 2: obj = APP_HOME_PAGE_MIXED_DATA[VIDEO_ID];
			break;

		case 4: obj = APP_SEARCH_DATA_ARRAY[VIDEO_ID];
			break;

		case 5: obj = JSON.parse(localStorage["id_" + VIDEO_ID]);
			break;
	}

	return obj;
}

function show_hide_video_container() {
	$(".pause-icon").hide();
	$(".video-inner").show();
	$(".video-loader").show();
	$(".header_container").hide();
	$(".home_container, .talent_page_container, .category_container, .detail_page_main_container, .search_result_main_container, .search_container, .favorite_page_container, .instruction_main_container").removeClass("active").hide();
	$(".main_container").hide();
	$("#video_container").addClass("active").show();
	$("#video_container").css("display", "block");
}