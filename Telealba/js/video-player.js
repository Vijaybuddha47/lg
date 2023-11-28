function load_video() {
	VIDEO_PLAYER = "";
	var features = [],
		type = "video/",
		live_player = "";

	TAB_INDEX = 7;

	if (PAGE_INDEX == 5) features = ['current', 'progress', 'duration', 'stop'];
	if (PAGE_INDEX == 2) live_player = false;
	else {
		live_player = true;
		forceLive = true;
	}

	if ((VOD_URL.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";
	// type = "application/vnd.apple.mpegurl";

	show_hide_video_container();
	sessionStorage.FWD_RWD_key_press = 0;

	if (PAGE_INDEX == 5) show_hide_video_next_previous(true);
	else show_hide_video_next_previous(false);

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

	// Add vidoe player
	set_focus("videoSection", "");
	SN.focus("videoSection");


	$("#video_container").html('<video class="video_box" controls id="videoPlayer" style="max-width:100%;" preload="none" autoplay><source src="" type="' + type + '" id="videoURL"></video>');
	$("#videoURL").attr('src', VOD_URL);

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		stretching: "auto",
		clickToPlayPause: live_player,
		features: features,
		customError: "&nbsp;",
		success: function (media, originalNode, instance) {
			if (PAGE_INDEX == 5) $(".mejs__controls").addClass('set_progressbar'); // Progressbar Shift upside 
			else $(".mejs__controls").removeClass('set_progressbar');

			$(".mejs__currenttime, .mejs__duration").css('height', '18px');
			$(".mejs__time").css({ 'font-size': '20px', 'padding-top': '18px' });

			$(".mejs__time-total, .mejs__time-buffering, .mejs__time-loaded, .mejs__time-current, .mejs__time-float, .mejs__time-hovered, .mejs__time-float-current, .mejs__time-float-corner, .mejs__time-marker").css('height', '20px');
			$(".mejs__time-handle-content").css({ "height": "20px", "width": "20px" });

			media.load();
			media.play();

			VIDEO_PLAYER = media;

			media.addEventListener("loadstart", function (e) {
				console.log("loading....");
				if (PAGE_INDEX == 5) SN.focus("#playPauseVideo");
			});

			media.addEventListener('progress', function (e) {
				// console.log("progress");
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
				console.log("canplay");
				PLAY_VIDEO = true;
				if (PAGE_INDEX == 5) show_hide_programme_details_after_specific_time();
			});

			media.addEventListener('seeking', function (e) {
				console.log("seeking");
			}, true);

			media.addEventListener('seeked', function (e) {
				console.log("seeked");
				$(".video-inner").hide();
			}, true);

			media.addEventListener("hlsError", function (e) {
				console.log("hlsError....", e);
				if (e.data.fatal && PLAY_VIDEO) {
					PLAY_VIDEO = true;
					retry_error_popup();
					media.pause();
				}
			});

			media.addEventListener('error', function (e) {
				console.log("error");
				PLAY_VIDEO = true;
				retry_error_popup();
				media.pause();
			});

		},

		error: function (mediaElement, originalNode, instance) {
			if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
			PLAY_VIDEO = true;
			retry_error_popup();
		}

	});
}

function retry_error_popup(playerErrorType) {
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
		if (errorMsg != "" && onlineStatus) msg = errorMsg;
		hide_show_modal(true, 'RETRY_CANCEL', msg);
	}
}

var closeVideo = function () {
	show_hide_video_next_previous(false);
	if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
	LIVE_CATCHUP = false;
	$(".circle_loader").removeClass('circle-loader-middle');
	sessionStorage.FWD_RWD_key_press = 0;
	$("#video_container").css('display', 'none');
	$("#video_container").hide();
	$(".video-inner").hide();
	$(".loader").hide();
	$(".set_progressbar").hide();
	$(".video_container").removeClass("active").hide();
	$(".pause-icon").hide();
	$(".video_next_previous_container").hide();
	$(".main-container").show();
	if (PAGE_INDEX == 2) {
		show_hide_video_next_previous(false);
		hide_show_screens("epg_container");
		SN.focus("#" + SECOND_PAGE_SELECTED_ITEM);
	} else if (PAGE_INDEX == 5) {
		hide_show_screens("video_list_container");
		SN.focus("#" + SELECTED_VIDEO_ITEM);
	}
};

var playVideo = function () {
	if (document.hidden) {
	} else {
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
		$(".pause-icon").show();
		$("#videoNextPreviousPlayPauseIcon").attr('src', 'images/play.png');
		VIDEO_PLAYER.pause();
		show_hide_progress_bar_after_specific_time();
	}
};


//This function is used to hide progress bar after 10 second
function show_hide_progress_bar_after_specific_time() {
	clearInterval(hide_progress_bar);
	if (PAGE_INDEX == 5 || LIVE_CATCHUP) {
		show_hide_video_next_previous(true);
		$(".set_progressbar").show();
		$(".mejs__controls").show();
		$(".video_next_previous_container").show();
	}
	else if (PAGE_INDEX == 2) {
		show_hide_video_next_previous(false);
		$(".set_progressbar").hide();
	}

	totalVideo = get_total_video_or_first_video_index(1);
	if (totalVideo < 1) {
		$("#videoNextPrevious").hide();
	}

	hide_progress_bar = setTimeout(function () {
		running = false;
		$(".video_next_previous_container").hide();
		$(".set_progressbar").hide();
		$(".mejs__controls").show();
		$(".video_next_previous_container").show();
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
		case 2: // For video list menu
			totalVideo = 0;
			firstItem = 0;
			break;
		case 5: // For video list menu
			totalVideo = $("#video_list li").last().index();
			firstItem = $("#video_list li").first().index();
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

	$(".set_progressbar").hide();
	$(".video-title").text('');

	// hide next video button
	if (VOD_COUNTER == totalVideo) {
		$("#playNextVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-right', 'null');
	}
	// hide previous video button
	else if (VOD_COUNTER == $("#video_list li.visible").first().index()) {
		$("#playPreviousVideo").css('visibility', 'hidden');
		$("#playPauseVideo").attr('data-sn-left', 'null');

	}

	switch (type) {
		case "previous":
			if (VOD_COUNTER > 0) {
				if (PAGE_INDEX == 5) {
					VOD_COUNTER = $("#video_list li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li').index();
					SELECTED_VIDEO_ITEM = $("#video_list li:nth-child(" + (VOD_COUNTER + 1) + ")").attr('id');
					if (_.size(CAT_VOD_LIST) > 0) VOD_URL = CAT_VOD_LIST[VOD_COUNTER]["vsFile"];
					else if (typeof SUB_CAT_VOD_ARRAY[VOD_COUNTER] === 'undefined') VOD_URL = SUB_CAT_VOD_ARRAY["vsFile"];
					else VOD_URL = SUB_CAT_VOD_ARRAY[VOD_COUNTER]["vsFile"];
					setTimeout(function () {
						load_video();
					}, 300);
				}
			}

			break;

		case "next":
			if (VOD_COUNTER < totalVideo) {
				if (PAGE_INDEX == 5) {
					VOD_COUNTER = $("#video_list li:nth-child(" + (VOD_COUNTER + 1) + ")").next('li').index();
					SELECTED_VIDEO_ITEM = $("#video_list li:nth-child(" + (VOD_COUNTER + 1) + ")").attr('id');
					if (_.size(CAT_VOD_LIST) > 0) VOD_URL = CAT_VOD_LIST[VOD_COUNTER]["vsFile"];
					else if (typeof SUB_CAT_VOD_ARRAY[VOD_COUNTER] === 'undefined') VOD_URL = SUB_CAT_VOD_ARRAY["vsFile"];
					else VOD_URL = SUB_CAT_VOD_ARRAY[VOD_COUNTER]["vsFile"];
					setTimeout(function () {
						load_video();
					}, 500);
				}
			}
			break;
	}
}

// It returns current vod object while playing video
function get_video_obj() {
	var obj = "";
	switch (PAGE_INDEX) {
		case 2: obj = APP_LIVE_CHANNEL[0];
			break;

		case 3: obj = SUB_CAT_VOD_ARRAY[SELECTED_VIDEO_INDEX];
			break;
	}

	return obj;
}
