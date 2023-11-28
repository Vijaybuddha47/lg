function load_audio() {
	var features = [], type = "audio/", url = AOD_URL;

	if ((url.toLowerCase()).indexOf(".m3u") < 0) features = ['current', 'progress', 'duration', 'tracks'];

	if ((url.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp3";

	$(".video-inner").css("display", "block").show();
	// $(".mejs__currenttime").removeClass("off_screen");
	// $(".mejs__currenttime").addClass("onn_screen");
	$(".poster_heading").show();
	$(".mejs__offscreen").text("");
	$("#current_music_title").text("");
	$(".circle_loader").css("display", "block");
	$("#music_cover").attr("src", "./images/music-bg.png");
	$("#" + SELECTED_ITEM).find(".img_box").html('<img class="play_icon" src="./images/pause_audio.png" alt="Play" />');
	$("#music_img_change").attr("src", "");

	$(".audio_container").addClass('active').show();

	// Add audio player
	set_focus("audioSection", "audio_container");
	SN.focus("audioSection");

	$("#audio_container").html('<audio controls id="audioPlayer" style="max-width:100%;" poster="" preload="none" class="audio_box" height="38px"><source src="" type="' + type + '" id="audioURL"></audio>');

	$("#audioURL").attr('src', url);

	MEDIA_OBJ = new MediaElementPlayer("audioPlayer", {
		stretching: "auto",
		pluginPath: 'player/',
		features: features,
		clickToPlayPause: true,

		success: function (media) {

			$(".sidescroll_time").css("display", "block");
			$(".mejs__currenttime-container").addClass('sidescroll_time');
			AUDIO_PLAYER = media;
			media.load();
			media.play();

			media.addEventListener('progress', function () {
				console.log("progress..");
				ICECAST_PLAY.start();
			});

			media.addEventListener("loadstart", function (e) {
				console.log("loadstart..");
			});

			media.addEventListener('error', function (e) {
				console.log("error.............");
				retry_error_popup();
				media.pause();
			});

			media.addEventListener('ended', function (e) {
				console.log("end audio..............." + e.message);
				closeAudio();
			});

			media.addEventListener('timeupdate', function (e) {

			});

			media.addEventListener('play', function (e) {
				console.log("play");
				PLAY_AUDIO = true;
				$(".video-inner").hide();
				$(".sidescroll_time").css("display", "block");
				$(".poster_heading").show();
				$("#current_music_title").show();
				// $("#" + SELECTED_ITEM).find(".img_box").html('<img class="play_icon" src="./images/pause_audio.png" alt="Pause" />');
			});

			media.addEventListener('pause', function (e) {
				console.log("pause");
				PLAY_AUDIO = false;
				// $("#" + SELECTED_ITEM).find(".img_box").html('<img class="play_icon" src="./images/play_audio.png" alt="Play" />');
				if (ICECAST_PLAY) ICECAST_PLAY.stop();
			});

			media.addEventListener('canplay', function (e) {
				PLAY_AUDIO = true;
			});

			media.addEventListener('seeking', function (e) {
				$(".video-inner").css("display", "block").show();
			}, true);

			media.addEventListener('seeked', function (e) {
				$(".video-inner").hide();
			}, true);
		}
	});
}

var closeAudio = function (keyCode) {
	$(".circle_loader").hide();
	if (ICECAST_PLAY) ICECAST_PLAY.stop();
	AUDIO_PLAYER.pause();
	$(".img_box").empty();
	$(".poster_heading").hide();
	$("#current_music_title").text("");
	$(".mejs__currenttime").addClass("off_screen");
	$("#music_img_change").attr("src", "");
	$("#" + SELECTED_ITEM).find(".play_icon").attr("src", "").hide();
	SELECTED_ITEM = "";
	PLAY_AUDIO = false;
	AOD_URL = "";
};

function forward_audio() {
	if ($(".audio_container").hasClass("active")) {
		AUDIO_PLAYER.setCurrentTime(AUDIO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
	}
}

function rewind_audio() {
	if ($(".audio_container").hasClass("active")) {
		AUDIO_PLAYER.setCurrentTime(AUDIO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
	}
}

var playAudio = function () {
	PLAY_AUDIO = true;
	$(".mejs__currenttime").removeClass("off_screen");
	$(".mejs__currenttime").addClass("onn_screen");
	$(".poster_heading").show();
	$(".sidescroll_time").css("display", "block");
	$("#" + SELECTED_ITEM).find(".img_box").html('<img class="play_icon" src="./images/pause_audio.png" alt="Pause" />');
	AUDIO_PLAYER.play();
};

var pauseAudio = function () {
	PLAY_AUDIO = false;
	if (ICECAST_PLAY) ICECAST_PLAY.stop();
	clearInterval(icecast_time_interval);
	$("#" + SELECTED_ITEM).find(".img_box").html('<img class="play_icon" src="./images/play_audio.png" alt="Play" />');
	AUDIO_PLAYER.pause();
};
