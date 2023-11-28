function load_video() {
	VIDEO_PLAYER = "";
	var features = [],
		type = "video/",
		url = "";

	features = ['current', 'progress', 'duration'];

	if ((VOD_URL.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp4";

	TAB_INDEX = 7;

	show_hide_video_container();
	sessionStorage.FWD_RWD_key_press = 0;

	$("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');
	$("#videoURL").attr('src', VOD_URL);

	SN.focus("videoSection");

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		stretching: "auto",
		clickToPlayPause: false,
		features: features,
		customError: "&nbsp;",
		success: function (media) {

			if (PAGE_INDEX == 5) $(".mejs__controls").addClass('progress-container'); // Progressbar Shift upside 
			else $(".mejs__controls").removeClass('progress-container');

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
				// console.log("3333333333333");
			});

			media.addEventListener('error', function (e) {
				PLAY_VIDEO = true;
				retry_error_popup();
				VIDEO_PLAYER.pause();
			});

			media.addEventListener('ended', function (e) {
				console.log("end video..............." + e.message);
				closeVideo();
			});

			media.addEventListener("loadstart", function (e) {
				console.log("loading....");
				$(".video-inner").show();
				$(".circle_loader").css("display", "block");
			});

			media.addEventListener('playing', function (e) {
				console.log("playing...............");
				$("#playPauseIcon").attr('src', 'images/pause.png');
				setTimeout(function () {
					$(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
					$(".mejs__controls").hide();
					$("#videoNextPrevious").hide();
				}, 5000);
				$(".video-inner").hide();

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
				$(".video-inner").show();
				$(".circle_loader").css("display", "block");
			}, true);

			media.addEventListener('seeked', function (e) {
				console.log("seeked");
				$(".video-inner").hide();
			}, true);

		}
	});
}



var playVideo = function () {
	if (document.hidden) {
	} else {
		if ($('#video_container').css('display', 'block')) {
			$(".pause-icon").hide();
			$("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png');
			VIDEO_PLAYER.play();
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
	}
};

var closeVideo = function () {
	VIDEO_PLAYER.pause();
	$(".main-container").show();
	hide_show_screens("home_container");
	SN.focus("#" + FOCUSED_ITEM);
	$(".circle_loader").removeClass('circle-loader-middle');
	sessionStorage.FWD_RWD_key_press = 0;
	$("#video_container").css('display', 'none');
	$("#video_container").hide();
	$(".video-inner").hide();
	$(".loader").hide();
	$(".progress-container").hide();
	$(".video_container").removeClass("active").hide();
	$(".pause-icon").hide();
	$(".video_next_previous_container").hide();
	SN.focus("#" + FOCUSED_ITEM);
	PLAY_AUDIO = false;
	AOD_URL = "";
	SELECTED_ITEM = '';
};

var stopVideo = function () {
	VIDEO_PLAYER.pause();
	show_hide_video_container();
	closeVideo();
};

var successForwardCallback = function (time) {
	console.log("success in jump forward");
};

var errorForwardCallback = function (time) {
	console.log("error in jump forward");
};

var jumpBackwardVideo = function (time) {
	VIDEO_PLAYER.jumpBackward(time);

	if (VIDEO_PLAYER.paused) {
		VIDEO_PLAYER.play();
	}
};

var jumpForwardVideo = function (time) {
	VIDEO_PLAYER.pause();
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

function show_hide_video_next_previous(flag) {
	if (flag) $("#videoNextPrevious").css('display', 'table');
	else $("#videoNextPrevious").hide();
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

//This function is used to hide progress bar after 10 second
function show_hide_programme_details_after_specific_time() {
	clearInterval(hide_programme_details);

	hide_programme_details = setTimeout(function () {
		running = false;
		if ($(".video_container").hasClass("active")) SN.focus('videoPlayer');
	}, 10000);
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