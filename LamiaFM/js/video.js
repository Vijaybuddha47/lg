function load_video() {
	var features = [], type = "video/";
	var url = (DATA_OBJ[0].videoUrl).toLowerCase();
	if (url.indexOf(".m3u") < 0) features = ['current', 'progress', 'duration'];

	if (url.indexOf(".m3u") > -1) type = type + "hls";
	else type = type + "mp4";

	show_hide_video_container();
	// SN.focus("videoSection");

	$("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" crossorigin="anonymous" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');
	var url = DATA_OBJ[0].videoUrl;
	$("#videoURL").attr('src', url);

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		features: features,
		clickToPlayPause: false,
		alwaysShowControls: false,
		stretching: 'fill',
		success: function (media) {
			VIDEO_PLAYER = media;
			media.load();
			media.play();

			media.addEventListener('progress', function (e) {
				console.log("progress...");
			});

			media.addEventListener('pause', function (e) {
				console.log("pause...");
				$(".mejs__overlay-button").css("display", "block");
			});

			media.addEventListener('play', function (e) {
				console.log("play...");
				$(".mejs__overlay-button").css("display", "none");
			});

			media.addEventListener("hlsError", function (e) {
				console.log("hlsError....");
			});

			media.addEventListener('error', function (e) {
				console.log("error.............");
				retry_error_popup();
				media.pause();
			});

			media.addEventListener('ended', function (e) {
				console.log("end video..............." + e.message);
				closeVideo();
			});

			media.addEventListener('timeupdate', function (e) {
				console.log("timeupdate...");
			});
		}
	});
}

var closeVideo = function () {
	console.log("close video");
	$(".circle_loader").removeClass('circle-loader-middle');
	VIDEO_PLAYER.pause();
	$("#video_container").html('');
	//MEDIA_OBJ.remove();
	$("#video_container").hide();

	$(".menu_container").show();//.addClass('active');
	$(".cat_container").show();
	$(".video_container").removeClass('active');
	SN.focus("catList");
};