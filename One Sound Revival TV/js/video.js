function load_video() {
	var features = [], type = "video/";
	if (((DATA_OBJ[0].videoUrl).toLowerCase()).indexOf(".m3u") < 0) features = ['current', 'progress', 'duration'];

	if (((DATA_OBJ[0].videoUrl).toLowerCase()).indexOf(".m3u") > -1) type = type + "hls";
	else type = type + "mp4";

	show_hide_video_container();
	SN.focus("videoSection");

	$("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');

	$("#videoURL").attr('src', DATA_OBJ[0].videoUrl);

	MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
		stretching: "auto",
		pluginPath: 'player/',
		features: features, //['playpause','current','progress','duration'],
		clickToPlayPause: true,
		alwaysShowControls: true,
		success: function (media) {
			VIDEO_PLAYER = media;
			media.load();
			media.play();

			media.addEventListener('progress', function () {
				//console.log("3333333333333");
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
			});
		}
	});
}

var closeVideo = function () {
	console.log("close video");
	$(".circle_loader").removeClass('circle-loader-middle');
	VIDEO_PLAYER.pause();
	$("#video_container").html('');
	$("#video_container").hide();
};