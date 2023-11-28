function getYouTubeID(url)
{
	var ID = '';
	url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		ID = url[2].split(/[^0-9a-z_\-]/i);
		ID = ID[0];
	} else {
		ID = url;
	}
	return ID;
}

function load_youtube_video()
{
	// Add vidoe player
	SN.remove("youtubeSection");
	SN.add({
		id: 'youtubeSection',
		selector: '#youtubeSection .focusable',
		restrict: 'self-only',
		defaultElement: '#youtube_video_container',
	});
	SN.makeFocusable();
	SN.focus("youtubeSection");

	status = -1;
	if (Youtube_Player) {
		Youtube_Player.stopVideo();
		Youtube_Player.destroy();
		Youtube_Player = null;
	}
	onYouTubeIframeAPIReady();
}

function onYouTubeIframeAPIReady()
{
	if ($(".youtube_video_container").hasClass("active")) {		
		$.getScript("js/youtube-api.js").done(function(script, textStatus) {
			Youtube_Player = new YT.Player('player', {
									height: '1080',
									width: '1920',
									videoId: getYouTubeID(VOD_URL),
									playerVars: {'modestbranding' : 1, 'fs' : 0, vq: 'hd1080'},
									events: {
										'onStateChange': onPlayerStateChange,
										'onReady': onPlayerReady,
										'onError': onError
									}
								});
		});
	}
}

function onError(event)
{
	if ($(".youtube_video_container").hasClass("active")) {
		$(".video-loader").hide();
		if (navigator.onLine) {
			errorMsg = PLAYER_ERR;
		} else {
			errorMsg = NET_CONNECTION_ERR;
		}
		hide_show_modal(true, 'RETRY_CANCEL', errorMsg);
	}
}

function onPlayerStateChange(event)
{
	if ($(".youtube_video_container").hasClass("active")) {
		status = event.data;
		if (event.data == 0) {
			stopVideo();

		} else if (event.data == 1) {
			$(".video-loader").hide();
			$(".pause-icon").hide();

		} else if (event.data == 3) {
			$(".video-loader").show();
		}
	}
}

function stopVideo()
{	
	if ($(".youtube_video_container").hasClass("active")) {
		Youtube_Player.stopVideo();
		$(".circle_loader").removeClass('circle-loader-middle');
		$(".youtube_video_container").hide();
		$(".video-inner").hide();
		$(".loader").hide();
		
		$(".video_details_container").addClass("active");
		$(".main-container").show();
		$(".youtube_video_container").removeClass('active');
		$(".pause-icon").hide();
		
		SN.focus("videoDetails");
	}
}

function onPlayerReady(event)
{
	if ($(".youtube_video_container").hasClass("active")) {
		$("iframe").contents().find(".ytp-spinner").remove();
		$(".video-loader").hide();
		event.target.playVideo();
		INTERVAL = setInterval(check_net_connection_on_video, 1000);
		increase_video_count();
	}
}

// Check net connection when playing video
function check_net_connection_on_video()
{
	if (!navigator.onLine) {
		if ($(".youtube_video_container").hasClass("active")) {
			if (status != 2) {
				Youtube_Player.pauseVideo();
				YOUTUBE_PLAYER_STATE = 2;
			}
			clearInterval(INTERVAL);
			hide_show_modal(true, "RETRY_CANCEL", NET_CONNECTION_ERR);
		}
	}
}