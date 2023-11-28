var Player = {
	streams: [],url :''
};
var media = '',catgIndex  = 0,liveChnlIndex = 0,playObj = {},previousFocus = '';
var sType = 1,firstTime = true;
var dur = '';
var reconnectInt = -1;
var LiveVideoLink ='';
var flowPlayerH = null;
var jwplayerH = null;
var backPressed = false;
var playerReleased = false;
var playerPrepared = false;
var html5Player;
var fullscreen = false;
var currentStreamId = -1;
var isplaying = false;
var counter = 0;
var ispaused = false;
//var preparing = false;
var isclosed = true;

function getTimeText(t) {
	t = t / 1000;
	var pt = new Number(t) ;
	var hh = Math.floor(pt / 3600);
	var mm = Math.floor((pt % 3600) / 60);
	
	return "" + (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm);
}

function progressIconHandle(event, action) {
	log(event.type)
	switch (action) {
	case 'over':
		$("#seek-picker-runtime").show();
		moveSeekBall(event);
		addEvent(document, "mousemove", moveSeekBall);
		break;
	case 'out':
		$("#seek-picker-runtime").hide();
		removeEvent(document, "mousemove", moveSeekBall);
		break;
	case 'click':
		playAtPos(event);
		break;
	case 'down':
		playAtPos(event);
		break;
	default:
		break;
	}
}

function addEvent(object, eventStr, func) {
	try {
		object.addEventListener(eventStr, func, false);
	} catch (e) {
	}
}

function removeEvent(object, eventStr, func) {
	try {
		object.removeEventListener(eventStr, func);
	} catch (e) {
	}
}
function playAtPos(event){
	var x = event.clientX - $("#flix-seekbar").offset().left - 8 ;
	
	dur = media.getDuration();
	try{
		if(media.getDuration() == -1){
			if(singleMoviePage && singleMoviePage.vendorInfo && singleMoviePage.vendorInfo.duration){
				dur = singleMoviePage.vendorInfo.duration;
				dur = dur*1000;
			}
				
		}
	}catch(e){}
	
	var totalWidth = $("#flix-seekbar").width();
	var seekPercent = 0;
	if(x > 0){
          seekPercent = ((x) / totalWidth);
          var offSet = 280;
          if(window.innerWidth == "1280")
               offSet = 100;
          else 
               offSet = 280;

		$("#seek-picker-runtime").css("left",event.clientX - ($("#flix-seekbar").offset().left ) + offSet);
		var pos = dur * seekPercent;
		$("#seek-picker-runtime").html(getTimeHMS(pos));
		media.seekTo(pos);
		
	}
	
}
function moveSeekBall(event) {
	log(event.type);
	
	dur = media.getDuration();
	try{
		if(media.getDuration() == -1){
			if(singleMoviePage && singleMoviePage.vendorInfo && singleMoviePage.vendorInfo.duration){
				dur = singleMoviePage.vendorInfo.duration;
				dur = dur*1000;
			}
				
		}
	}catch(e){}
	
	var x = event.clientX - $('#flix-seekbar').position().left - 8 ;
	var totalWidth = $("#flix-seekbar").width();
	var seekPercent = ((x) / totalWidth);
	var pos  = seekPercent * dur;
	if(x > 0 && x <= totalWidth){
		$("#seek-picker-runtime").css("left",(event.clientX - ($("#flix-seekbar").offset().left) ) + 280);
		$("#seek-picker-runtime").html(getTimeHMS(pos));
	}
	else
		$("#seek-picker-runtime").hide();
}

/*
(function (window) {
 	var platform = cordova.require('cordova/platform');
 	window.getMediaOption = function() {
 		var drmOptions = {};
 		var customdata;
// 		alert(platform.id);
 		switch (platform.id)
 		{
 			case 'sectv-orsay':
 			case 'sectv-tizen':
 				drmOptions = {
 					BITRATES : 'yourBitRates',
 					STARTBITRATE : 'yourStartBitRate',
 					SKIPBITRATE : 'yourSkipBitRate'
 				};
 				break;
 			case 'tv-webos':
 				var options = {};
 				options.option = {};
 				options.option.mediaFormat.type = 'audio';

 				drmOptions = {
 					OPTIONS : JSON.stringify(options),
 				};
 			break;
 		}
 		return drmOptions;
 	};
 })(this);
*/

function getTimeHMS(t) {
	t = t / 1000;
	var pt = new Number(t) ;
	var hh = Math.floor(pt / 3600);
	var mm = Math.floor((pt % 3600) / 60);
	var ss = Math.floor(pt % 60);
	return "" + (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm)
			+ ":" + (ss < 10 ? "0" + ss : ss);
}

function compareString(needle,arrayData){
    for(var j=0;j<arrayData.length;j++){
        var str = arrayData[j];
        var lowerCase = needle.toLowerCase();
        var regex = RegExp(str);
        var result = regex.test(lowerCase)
        if(result == true){
         return true;
        }

    }
    return false;

}

var curX = 0;
var curY = 0;
var curWidth = 0;
var curHeight = 0;
var curItem;
var sizeUpdated = false;

function updatePlayerSize() {
	var streamInfo = webapis.avplay.getCurrentStreamInfo();
	for (var i = 0; i < streamInfo.length; i++) {
		log(streamInfo[i]);
		var extra_info = JSON.parse(streamInfo[i].extra_info);
		if (streamInfo[i].type === 'VIDEO' && extra_info.Width) {
			log("new width=" + curWidth + ",new height=" + (curWidth * extra_info.Height)/extra_info.Width);
			curHeight = (curWidth * extra_info.Height)/extra_info.Width;
			curItem.height(curHeight);
			var ratio = 1;//Main.screenWidth / 1920;//window.document.documentElement.clientWidth;
			webapis.avplay.setDisplayRect(
				curY * ratio,
				curX * ratio,
				curWidth * ratio,
				curHeight * ratio
			);
			break;
		}
	}
	var trackInfo = webapis.avplay.getTotalTrackInfo();
	for (var i = 0; i < trackInfo.length; i++) {
		log(trackInfo[i]);
		var extra_info = JSON.parse(streamInfo[i].extra_info);
		if (trackInfo[i].type === 'VIDEO' && extra_info.Width) {
			log("new width=" + curWidth + ",new height=" + (curWidth * extra_info.Height)/extra_info.Width);
			curHeight = (curWidth * extra_info.Height)/extra_info.Width;
			curItem.height(curHeight);
			var ratio = 1;//Main.screenWidth / 1920;//window.document.documentElement.clientWidth;
			webapis.avplay.setDisplayRect(
				curY * ratio,
				curX * ratio,
				curWidth * ratio,
				curHeight * ratio
			);
			break;
		}
	}
}

function tizen_reconnect(inc) {
	if (inc)
		counter++;

	Main.HideLoading();

	if (Player.type === 'live') {
		var showText = counter;
		var PlayerDIvSelector = $('#player-wrapper');
		if (isTizen)
			webapis.avplay.stop();
		if (!fullscreen) {
			$('#videoHtml').css('background', 'black');
			PlayerDIvSelector.html('');
			PlayerDIvSelector.css('text-align', 'center');
			PlayerDIvSelector.css('background', 'none');
			PlayerDIvSelector.html('<div class="erroronplayer"><span>Playback error, reconnects in 5s ('+showText+'/5)</span></div>');
		} else {
			$('#error_fullscreen').html('Playback error, reconnects in 5s ('+showText+'/5)');
			$('.erroronplayer_fullscreen').show();
		}
		if (counter <= 5) {
			if (reconnectInt != -1)
				clearTimeout(reconnectInt);
			reconnectInt = setTimeout(function() {
				reconnectInt = -1;
				if (isTizen)
					tizen_playstream(LiveVideoLink, false);
				else
					html5_playstream(LiveVideoLink, false);
			}, 5000);
		} else {
			if (!fullscreen) {
				PlayerDIvSelector.html('<div class="erroronplayer"><span>Sorry, this channel can not be played.<br> Please try again or pick another channel.</span></div>');
			} else {
				$('#error_fullscreen').html('Sorry, this channel can not be played.<br> Please try again or pick another channel.');
				$('.erroronplayer_fullscreen').show();
			}
		}
	} else if (Player.type === 'catchup') {
		var showText = counter;
		if (isTizen)
			webapis.avplay.stop();
		$('#error_fullscreen').html('Playback error, reconnects in 5s ('+showText+'/5)');
		$('.erroronplayer_fullscreen').show();

		if (counter <= 5) {
			if (reconnectInt != -1)
				clearTimeout(reconnectInt);
			reconnectInt = setTimeout(function() {
				reconnectInt = -1;
				if (isTizen)
					tizen_playstream(LiveVideoLink, true);
				else
					html5_playstream(LiveVideoLink, true);
			}, 5000);
		} else { 
			$('#error_fullscreen').html('Sorry, this video can not be played.<br> Please try again or pick another video.');
			$('.erroronplayer_fullscreen').show();
		}
	} else {
		var showText = counter;
		if (isTizen)
			webapis.avplay.stop();
		$('#error_fullscreen').html('Playback error, reconnects in 5s ('+showText+'/5)');
		$('.erroronplayer_fullscreen').show();

		if (counter <= 5) {
			if (reconnectInt != -1)
				clearTimeout(reconnectInt);
			reconnectInt = setTimeout(function() {
				reconnectInt = -1;
				if (isTizen)
					tizen_playstream(LiveVideoLink, true);
				else
					html5_playstream(LiveVideoLink, true);
			}, 5000);
		} else { 
			$('#error_fullscreen').html('Sorry, this video can not be played.<br> Please try again or pick another video.');
			$('.erroronplayer_fullscreen').show();
		}
	}
}

function preparedCallback() {
	//preparing = false;
	if (isclosed)
		return;
	webapis.avplay.play();
	isplaying = true;
	tizen_onplaying();
	counter = 0;
	if (reconnectInt != -1)
		clearTimeout(reconnectInt);
	reconnectInt = -1;
	doSwitchDisplayMethod();
}

function errorPrepareCallback(err) {
	//preparing = false;
	if (isclosed)
		return;
	log('errorPrepareCallback: ' + err);
	tizen_reconnect(true);
}

var displayMode = 0;
function doSwitchDisplayMethod() {
	if (isTizen) {
		switch(displayMode) {
		case 1:
			webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
			break;
		case 2:
			webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_AUTO_ASPECT_RATIO');
			break;
		default:
			webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
			break;
		}
	} else {
		switch(displayMode) {
		case 1:
			curItem.css('object-fit', 'contain');
			break;
		case 2:
			curItem.css('object-fit', 'cover');
			break;
		case 3:
			curItem.css('object-fit', 'none');
			break;
		case 4:
			curItem.css('object-fit', 'scale-down');
			break;
		default:
			curItem.css('object-fit', 'fill');
			break;
		}
	}
}
Player.switchDisplayMethod = function() {
	displayMode++;

	if (isTizen) {
		if (displayMode>2)
			displayMode = 0;
	} else {
		if (displayMode>4)
			displayMode = 0;
	}
	
	doSwitchDisplayMethod();
};

function tizen_onplaying()
{
	var idx = -1;
	var totalTrackInfo = webapis.avplay.getTotalTrackInfo();
	for (var i=0; i<totalTrackInfo.length; i++) {
		var trackInfo = totalTrackInfo[i];
		log("index " + trackInfo.index + " track type " + trackInfo.type);
		if (trackInfo.type == "TEXT") {
			if (idx == -1 || trackInfo.extra_info.track_lang == "eng")
				idx = trackInfo.index;
			log('subtitle track index is' + trackInfo.index);
			log('subtitle track language is' + trackInfo.extra_info.track_lang);
		}
	}
	if (idx != -1)
		webapis.avplay.setSelectTrack('TEXT',idx);
}

function set_tizenplayer($movieVideoLink){

	backPressed = false;
	playerReleased = false;
	playerPrepared = false;

	if (webapis.avplay.getState() !== 'NONE') {
		webapis.avplay.stop();
		webapis.avplay.close();
	}

	$('.erroronplayer_fullscreen').hide();
	Main.ShowLoading2();

	var container = document.getElementById("player-holder");
	$(document).find('#player-holder').removeClass('hideOnLoad');

	var listener = {
		onbufferingstart: function () {
			log("Buffering start. " + webapis.avplay.getState());
			counter = 0;
			if (reconnectInt != -1)
				clearTimeout(reconnectInt);
			reconnectInt = -1;
			if (!isplaying) {
				if (webapis.avplay.getState() === "PLAYING") {
					isplaying = true;
					tizen_onplaying();
				}
			}
		},
		onbufferingprogress: function (percent) {
			log("Buffering progress data : " + percent + " " + webapis.avplay.getState());
			if (!isplaying) {
				if (webapis.avplay.getState() === "PLAYING") {
					isplaying = true;
					tizen_onplaying();
				}
			}
		},
		onbufferingcomplete: function () {
			log("Buffering complete." + webapis.avplay.getState());
			Main.HideLoading();
		},
		onsubtitlechange: function(duration, text, type, attriCount, attributes) {
			log(text);
		},
		oncurrentplaytime: function (currentTime) {
		},
		onevent: function (eventType, eventData) {
			log("event type: " + eventType + ", data: " + eventData + " " + webapis.avplay.getState());
		},
		onstreamcompleted: function () {
			log("Stream Completed");
			this.stop();
			isplaying = false;
			setTimeout(function() {
				view = "playerEnded";
				Main.processNext();
			}, 1);
		}.bind(this),
		onerror: function (eventType) {
			log("event type error : " + eventType + " " + webapis.avplay.getState());
			isplaying = false;
			if (isclosed)
				return;
			tizen_reconnect(true);
		}
	};

	curX = 0;
	curY = 0;
	curWidth = 1920;
	curHeight = 1080;
	curItem = $('#movie-player');
	curItem.offset({top:curX, left:curY});
	curItem.width(curWidth);
	curItem.height(curHeight);
	displayMode = 0;
	webapis.tvinfo.registerInAppCaptionControl(true);
	webapis.tvinfo.showCaption(true);

	var ratio = 1;//Main.screenWidth / 1920 /*window.document.documentElement.clientWidth*/;
	log('videoPlayer open: ' + $movieVideoLink + ";x=" + curX + ";y=" + curY + ";width=" + curWidth + ";height=" + curHeight + ";ratio=" + ratio);
	try {
		fullscreen = false;
		
		webapis.avplay.open($movieVideoLink);
		webapis.avplay.setStreamingProperty("USER_AGENT", "TAMASHA-TVتماشاPlayer");
		webapis.avplay.setDisplayRect(
			curY * ratio,
			curX * ratio,
			curWidth /* * ratio*/,
			curHeight /* * ratio*/
		);
		webapis.avplay.setListener(listener);
		if (webapis.avplay.getState() === 'IDLE') {
			webapis.avplay.prepareAsync(preparedCallback, errorPrepareCallback);
		} else if(webapis.avplay.getState() === 'PAUSED'){
			webapis.avplay.play();
		}
	} catch (e) {
		log(e);
	}
}

function set_html5player($movieVideoLink){
	backPressed = false;
	playerReleased = false;
	playerPrepared = false;

	var container = document.getElementById("player-holder");
	$(document).find('#player-holder').html('');
	$(document).find('#player-holder').removeClass('hideOnLoad');
	//  $(document).find('.poster-details').addClass('hideOnLoad');

	$('.erroronplayer_fullscreen').hide();
	Main.ShowLoading2();

	if (html5Player) {
		html5Player.src = '';
		html5Player = null;
	}
	var _player = document.createElement('video');
	_player.userAgent = "TAMASHA-TVتماشاPlayer";
		
	//_player.poster = posters[currentSource];
	fullscreen = false;

	_player.addEventListener('loadeddata', function () {
		log("Movie loaded.");
		/*
		playerPrepared = true;
		log("load ready run");
		if(backPressed){
			backPressed = false;
			playerReleased = true;
			log("load ready released");
			$("#HTML5Div").hide();
			setTimeout(function(){
						$("#HTML5Div").html('');
			}, 2000);
		}else{
			_player.play();
			playerReleased = false;
			if (reconnectInt != -1)
				clearInterval(reconnectInt);
			reconnectInt = -1;
		}
		*/
		_player.play();
		_player.subtitleOn = true;
		playerReleased = false;
		if (reconnectInt != -1)
			clearTimeout(reconnectInt);
		reconnectInt = -1;
		doSwitchDisplayMethod();
	});
	_player.addEventListener('loadedmetadata', function () {
		log("Meta data loaded.");
	});
	_player.addEventListener('timeupdate', function () {
		//log("Current time: " + _player.currentTime);
		//progress.updateProgress(_player.currentTime, _player.duration);
	});
	_player.addEventListener('play', function () {
		log("Playback started.");
		counter = 0;
		if (reconnectInt != -1)
			clearTimeout(reconnectInt);
		reconnectInt = -1;
		isplaying = true;
		Main.HideLoading();
	});
	_player.addEventListener('pause', function () {
		log("Playback paused.");
	});
	_player.addEventListener('ended', function () {
		log("Playback finished.");
		//init();
		isplaying = false;
		setTimeout(function() {
			view = "playerEnded";
			Main.processNext();
		}, 1);
	});
	_player.addEventListener('error', function (e) {
		log("Playback error " + e);
		//$(".fp-message").html(e);
		isplaying = false;
		if (isclosed)
			return false;
		tizen_reconnect(true);
		return false;
	});

	var placeHolder = document.getElementById('player-holder');
	//placeHolder.height = (placeHolder.width * 16) / 9;
	$('#player-holder').offset({top:0, left:0});
	$('#player-holder').width(1920);
	$('#player-holder').height(1080);
	placeHolder.appendChild(_player);
	_player.src = $movieVideoLink;
	_player.load();
	displayMode = 0;

	html5Player = _player;
}

function log(msg) {
	console.log(msg);
	app.sendlog(msg);
}

Player.getFullscreen = function() {
	return fullscreen;
};

var displayMode = 0;

Player.setFullscreen = function(f) {
	fullscreen = f;
	if (fullscreen) {
		if (isTizen) {
			webapis.avplay.setDisplayRect(
				0,
				0,
				1920,
				1080
			);
			if ($('#tv-player').length == 0) {
				$('#player-wrapper').html('<object id="tv-player" type="application/avplayer" style="position:relative"></object>');
				curItem = $('#tv-player');
			}
			curItem.offset({top:0, left:0});
			curItem.width(1920);
			curItem.height(1080);
			if (counter>0) {
				tizen_reconnect(false);
			}
		} else {
			//if (html5Player.webkitRequestFullScreen)
			//	html5Player.webkitRequestFullScreen();
			if ($('#tv-player').length == 0) {
				$('#player-wrapper').html('<video id="tv-player" style="width:100%; height:100%"></video>');
				curItem = $('#tv-player');
			}
			curItem.offset({top:0, left:0});
			curItem.width(1920);
			curItem.height(1080);
			//curItem.css('object-fit', 'fill');
			//html5Player.videoWidth = 1920;
			//html5Player.videoHeight = 1080;
			if (counter>0) {
				tizen_reconnect(false);
			}
		}
	} else {
		if (isTizen) {
			var ratio = 1;//Main.screenWidth / 1920;//window.document.documentElement.clientWidth;
			webapis.avplay.setDisplayRect(
				curY * ratio,
				curX * ratio,
				curWidth /* * ratio*/,
				curHeight /* * ratio*/
			);
			curItem.offset({top:curX, left:curY});
			curItem.width(curWidth);
			curItem.height(curHeight);
			if (counter>0) {
				$('.erroronplayer_fullscreen').hide();
				tizen_reconnect(false);
			}
		} else {
			//if (html5Player.webkitExitFullScreen)
			//	html5Player.webkitExitFullScreen();
			curItem.offset({top:curX, left:curY});
			curItem.width(curWidth);
			curItem.height(curHeight);
			//curItem.css('object-fit', 'fill');
			//html5Player.videoWidth = curWidth;
			//html5Player.videoHeight = curHeight;
			if (counter>0) {
				$('.erroronplayer_fullscreen').hide();
				tizen_reconnect(false);
			}
		}
	}
};

Player.isPreparing = function() {
	//return preparing;
	return false;
};

Player.isPlaying = function() {
	return isplaying;
};

Player.setStreamId = function(streamId) {
	currentStreamId = streamId;
};

Player.getStreamId = function() {
	return currentStreamId; 
};

var seekTimeout = -1;
var seekCounter = 0;

function seekToRunnable() {
	if (seekTimeout != -1)
		clearTimeout(seekTimeout);
	
	seekTimeout = setTimeout(function() {
		if (seekCounter > 0) {
			if (isTizen)
				webapis.avplay.jumpForward(10000 * seekCounter);
			else
				html5Player.currentTime += (10 * seekCounter);
		} else if (seekCounter < 0) {
			if (isTizen)
				webapis.avplay.jumpBackward(-10000 * seekCounter);
			else
				html5Player.currentTime += (10 * seekCounter);
		}

		seekCounter = 0;
		seekTimeout = -1;
	}, 1000);
}

Player.ffwd = function() {
	if (isplaying) {
		seekCounter++;
		seekToRunnable();
	}
};

Player.rwnd = function() {
	if (isplaying) {
		seekCounter--;
		seekToRunnable();
	}
};

Player.getDuration = function() {
	if (!isplaying)
		return 0;
	
	if (isTizen) {
		return webapis.avplay.getDuration()/1000;
	}

	return html5Player.duration;
};

Player.getCurrentPosition = function() {
	if (!isplaying)
		return 0;

	if (isTizen) {
		return (webapis.avplay.getCurrentTime() + (seekCounter * 10000))/1000;
	}

	return html5Player.currentTime  + (seekCounter * 10);
};

Player.pause = function() {
	if (isplaying) {
		if (isTizen) {
			if (webapis.avplay.getState() === 'PLAYING')
				webapis.avplay.pause();
		} else {
			if (!html5Player.paused)
				html5Player.pause();
		}
		ispaused = true;
	}
};

Player.resume = function() {
	if (isplaying) {
		if (isTizen) {
			if (webapis.avplay.getState() === 'PAUSED') {
				webapis.avplay.play();
			} else if (webapis.avplay.getState() === 'IDLE') {
				webapis.avplay.prepareAsync(preparedCallback, errorPrepareCallback);
				//preparing = true;
			}
		} else {
			if (html5Player.paused)
				html5Player.play();
		}
		ispaused = false;
	}
};

Player.isPaused = function() {
	return ispaused;
};

Player.onMediaPlayPause = function() {
	if (ispaused)
		Player.resume();
	else
		Player.pause();
};

Player.stop = function() {
	if (isTizen) {
		if (webapis.avplay.getState() !== 'NONE')
			webapis.avplay.stop();
	} else {
		if (html5Player != null) {
			html5Player.pause();
			html5Player.currentTime = 0;
		}
	}
};

function html5_playstream(LiveVideoLink, catchup)
{
	var PlayerDIvSelector = $('#player-wrapper');
	if (html5Player) {
		html5Player = null;
	}

	PlayerDIvSelector.html('');

	var _player = document.createElement('video');
	_player.id = "tv-player";
	_player.userAgent = "TAMASHA-TVتماشاPlayer";

	if (fullscreen || catchup) {
		$('.erroronplayer_fullscreen').hide();
	}
	//_player.poster = posters[currentSource];
	_player.src = LiveVideoLink;
	_player.load();

	_player.addEventListener('loadeddata', function () {
		log("Movie loaded.");
		counter = 0;
		_player.play();
		_player.subtitleOn = true;
		if (reconnectInt != -1)
			clearTimeout(reconnectInt);
		reconnectInt = -1;
		doSwitchDisplayMethod();
	});
	_player.addEventListener('loadedmetadata', function () {
		log("Meta data loaded.");
	});
	_player.addEventListener('timeupdate', function () {
		//log("Current time: " + _player.currentTime);
		//progress.updateProgress(_player.currentTime, _player.duration);
	});
	_player.addEventListener('play', function () {
		log("Playback started.");
		counter = 0;
		if (reconnectInt != -1)
			clearTimeout(reconnectInt);
		reconnectInt = -1;
		isplaying = true;
		Main.HideLoading();
	});
	_player.addEventListener('pause', function () {
		log("Playback paused.");
	});
	_player.addEventListener('ended', function () {
		log("Playback finished.");
		//init();
		isplaying = false;
	});
	_player.addEventListener('error', function (e) {
		log("Playback error " + e);
		/*
		var showText = Number(counter)+Number(1);
		var PlayerDIvSelector = $('#player-wrapper');
		$('#videoHtml').css('background', 'black');
		PlayerDIvSelector.html('');
		PlayerDIvSelector.css('text-align', 'center');
		PlayerDIvSelector.css('background', 'none');
		PlayerDIvSelector.html('<div class="erroronplayer"><span>Playback error, reconnects in 5s ('+showText+'/5)</span></div>');
		html5Player.src = null;
		html5Player = null;
		TizenReconnect(LiveVideoLink,FailCounter);
		*/
		isplaying = false;
		if (isclosed)
			return false;
		tizen_reconnect(true);
		return false;
	});

	var placeHolder = document.getElementById('player-wrapper');
	placeHolder.appendChild(_player);
	if (catchup) {
		PlayerDIvSelector.offset({top:0, left:0});
		PlayerDIvSelector.width(1920);
		PlayerDIvSelector.height(1080);
		curItem = $("#tv-player");
		curItem.offset({top:0, left:0});
		curItem.width(1920);
		curItem.height(1080);
		curX = 0;
		curY = 0;
		curWidth = 1920;
		curHeight = 1080;
		//curItem.css('object-fit', 'fill');
	} else {
		curX = $("#player-wrapper").offset().top;
		curY = $("#player-wrapper").offset().left;
		curWidth = $("#player-wrapper").width();
		if (curWidth < 100) {
			curWidth = 1920;
		}
		curHeight = (9 * curWidth)/16;
		curItem = $("#tv-player");
		if (!fullscreen) {
			curItem.width(curWidth);
			curItem.height(curHeight);
			//_player.videoWidth = curWidth;
			//_player.videoHeight = curHeight;
		} else {
			curItem.offset({top:0, left:0});
			curItem.width(1920);
			curItem.height(1080);
			//_player.videoWidth = 1920;
			//_player.videoHeight = 1080;
		}
		//curItem.css('object-fit', 'fill');
	}
	//placeHolder.height = (placeHolder.width * 16) / 9;
	displayMode = 0;
	html5Player = _player;
}

function tizen_playstream(LiveVideoLink, catchup)
{
	if (webapis.avplay.getState() !== 'NONE') {
		webapis.avplay.stop();
		webapis.avplay.close();
	}

	if (fullscreen || catchup) {
		$('.erroronplayer_fullscreen').hide();
	}
	Main.ShowLoading();

	if (!catchup && $('#tv-player').length == 0) {
		$('#player-wrapper').html('<object id="tv-player" type="application/avplayer" style="position:relative"></object>');
	}

	var listener = {
		onbufferingstart: function () {
			log("Buffering start.");
			counter = 0;
			if (reconnectInt != -1)
				clearTimeout(reconnectInt);
			reconnectInt = -1;
			if (!isplaying) {
				if (webapis.avplay.getState() === "PLAYING") {
					isplaying = true;
					tizen_onplaying();
				}
			}
		},
		onbufferingprogress: function (percent) {
			log("Buffering progress data : " + percent);
			if (!isplaying) {
				if (webapis.avplay.getState() === "PLAYING") {
					isplaying = true;
					tizen_onplaying();
				}
			}
		},
		onbufferingcomplete: function () {
			log("Buffering complete.");
			Main.HideLoading();
		},
		oncurrentplaytime: function (currentTime) {
			//log("Current playtime: " + currentTime);
			//if (!sizeUpdated) {
			//	setTimeout(updatePlayerSize, 1);
			//	sizeUpdated = true;
			//}
		},
		onsubtitlechange: function(duration, text, type, attriCount, attributes) {
			log(text);
		},
		onevent: function (eventType, eventData) {
			log("event type: " + eventType + ", data: " + eventData);
		},
		onstreamcompleted: function () {
			log("Stream Completed");
			this.stop();
			isplaying = false;
		}.bind(this),
		onerror: function (eventType) {
			log("event type error : " + eventType);
			isplaying = false;
			//preparing = false;
			if (isclosed)
				return;
			tizen_reconnect(true);
		}
	};

	if (!catchup) {
		curX = $("#player-wrapper").offset().top;
		curY = $("#player-wrapper").offset().left;
		curWidth = $("#player-wrapper").width();
		if (curWidth < 100) {
			curWidth = 1920;
		}
		curHeight = (9 * curWidth)/16;
		curItem = $('#tv-player');
		if (!fullscreen) {
			curItem.width(curWidth);
			curItem.height(curHeight);
		} else {
			curItem.offset({top:0, left:0});
			curItem.width(1920);
			curItem.height(1080);
		}
		displayMode = 1;
	} else {
		curX = 0;
		curY = 0;
		curWidth = 1920;
		curHeight = 1080;
		curItem = $('#tv-player');
		curItem.offset({top:curX, left:curY});
		curItem.width(curWidth);
		curItem.height(curHeight);
		displayMode = 0;
	}
	
	//sizeUpdated = false;
	webapis.tvinfo.registerInAppCaptionControl(true);
	webapis.tvinfo.showCaption(true);
	var ratio = 1;//Main.screenWidth / 1920;//window.document.documentElement.clientWidth;
	log('videoPlayer open: ' + LiveVideoLink + ";x=" + curX + ";y=" + curY + ";width=" + curWidth + ";height=" + curHeight + ";ratio=" + ratio);
	try {
		//fullscreen = false;
		
		webapis.avplay.open(LiveVideoLink);
		webapis.avplay.setStreamingProperty("USER_AGENT", "TAMASHA-TVتماشاPlayer");
		if (!fullscreen) {
			webapis.avplay.setDisplayRect(
				curY * ratio,
				curX * ratio,
				curWidth /* * ratio*/,
				curHeight /* * ratio*/
			);
		} else
			webapis.avplay.setDisplayRect(0, 0, 1920, 1080);

		webapis.avplay.setListener(listener);
		if (webapis.avplay.getState() === 'IDLE') {
			webapis.avplay.prepareAsync(preparedCallback, errorPrepareCallback);
			//preparing = true;
		} else if(webapis.avplay.getState() === 'PAUSED'){
			webapis.avplay.play();
		}
	} catch (e) {
		log(e);
	}
}

Player.playStream = function(url,short){
	isclosed = false;
	
	if(intervalNetwork){
		clearInterval(intervalNetwork);
		intervalNetwork = '';
		obj = {};
		loadingTimeArray = [];
	}
	reconnectDone = 0;
	try{
		if(media){
			clearPlayerValues();
		}
	}
	catch(e){}

	counter = 0;
	isplaying = false;
	LiveVideoLink = url;
	if (isTizen)
		log('Playing url=' + url + ' avplay-state=' + webapis.avplay.getState());

	$(".playerReconnecting").html('').hide();
	$("#notification").html('').hide();
	var FailCounter = "";

	if(reconnectInt != -1){
		clearTimeout(reconnectInt);
		reconnectInt = -1;
	}


   	if(view == "seriesPlayer"){

		if (isTizen)
			set_tizenplayer(LiveVideoLink);
		else
			set_html5player(LiveVideoLink);

   	} else {
		var flag = false;
//     alert(JSON.stringify(liveSectionDetails));
		var cID="";
		var cName="";
		if(parentPin){
		 	for(var i=0;i<liveSectionDetails.length;i++){
		   		if(liveSectionDetails[i].stream_id == Player.data.stream_id){
			  		cID = liveSectionDetails[i].category_id;
			  		break;
		   		}
		 	}

		 	if(cID!=""){
			   	for(var j=0;j<sectionData.length;j++){
				   	if(sectionData[j].category_id == cID){
					   	cName = sectionData[j].category_name;
					  	break;
				   	}
			   	}
		 	}

   //          alert(Player.data.stream_id);
   //
		 	if(cName!="" && parentPin){
			  	if(compareString(cName,adultArray)){
				   	flag = true;

				   	pushState(view,$(".imageFocus").attr("id"));
				   	$(".imageFocus").removeClass("imageFocus");
				   	view = "enterPin";
				   	$("#customMessage").html(Util.confirmPin());
				   	$("#customMessage").show();

			  	}
		 	}
	 	}

		if(!flag){
			if (isTizen)
				tizen_playstream(LiveVideoLink, view === "catchupPlayer");
			else
				html5_playstream(LiveVideoLink, view === "catchupPlayer");
		}

			/*
			var player = jwplayer('player-wrapper');
			// Set up the player with an HLS stream that includes timed metadata
			player.setup({
		  		"file": LiveVideoLink,
		  		"width":"100%",
		  		"aspectratio": "16:9"
			});




			player.on('play',function(){
		   		counter = 0;
		   		clearInterval(reconnectInt);
		 	});

		 	player.on('error', function() {
		 		var showText = 1;
				var PlayerDIvSelector = $('#player-wrapper');
				$('#videoHtml').css('background', 'black');
				PlayerDIvSelector.html('');
				PlayerDIvSelector.css('text-align', 'center');
				PlayerDIvSelector.css('background', 'none');
				PlayerDIvSelector.html('<div class="erroronplayer"><span>Playback error, reconnects in 5s ('+showText+'/5)</span></div>');
				jWPlayerReconnect(LiveVideoLink,FailCounter);
				return false;
			});
		}*/
	}
};

var playBarInterval = '',seekTime = 0,seekTimer = '';
var jumpNum = 30000;
var loadingTimeArray = [];var intervalNetwork = '';
function chknetwork(){
               if(media){
                    var player = media;
                    var obj = {};
                    
                   // if(player.paused == undefined){
                    player.paused = getMedia().paused;
                    //}

				if (!player.paused) {
					loadingTimeArray.push(media.getCurrentPosition());
					if (loadingTimeArray.length > 20) {
						loadingTimeArray.shift();
					}
				}
				for (var i = 0, j = loadingTimeArray.length; i < j; i++) {
					obj[loadingTimeArray[i]] = (obj[loadingTimeArray[i]] || 0) + 1;
				}
			
				if (obj[media.getCurrentPosition()] > 5) {/* 
                         if( (reconnectDone == 0 && obj[media.getCurrentPosition()] > 10 )  || obj[media.getCurrentPosition()] > 5){
                              console.log("obj[media.getCurrentPosition()] = "+obj[media.getCurrentPosition()]);
                              if(Player.type == "live"){

                                   if( reconnectDone == 5){
                                        if(view == "liveChannels"){
                                             media.stop();
                                             $(".playerReconnecting").html("<b style='center'>Sorry this video can not be played , Please try again or pick another video</b>").show();
                                             
                                        }
                                        else{
                                             media.stop();
                                             Main.showFailure("Sorry this video can not be played , Please try again or pick another video");
                                             callBack = function(){
                                                  if(!short){
                                                       Player.processBack();
                                                  }
                                             }
                                             
                                        }
                                       reconnectDone = 0;
                                   }
                                   else{
                                        if(view == "liveChannels"){
                                             $(".playerReconnecting").html("<b style='center'>Playback error, reconnects in 5s ( "+reconnectDone+" / 5 ) </b>").show();
                                             if(reconnectDone != 4)
                                                  setTimeout(function(){$(".playerReconnecting").hide();},2000);
                                        }
                                        else{
                                             $("#notification").html("<b style='center'>Playback error, reconnects in 5s ( "+reconnectDone+" / 5 ) </b>").show();
                                             setTimeout(function(){$("#notification").hide();},2000);
                                        
                                        }
                                        reconnect(mainPlayUrl);
                                   }
                                   obj = {};
                                   loadingTimeArray = [];
                              }
                             
                         } */
                         
					Main.ShowLoading();
				} else {
					Main.HideLoading();
				}
			}
			else{
				Main.HideLoading();
			}
}
var short = true;

Player.resize = function(){
     Main.HideLoading();
    // Main.ShowLoading();

     if(short){
          $("#renderarea").css("width","100%");
          $("#renderarea").css("height","100%");
          $("#renderarea").css("left","0px");
          $("#renderarea").css("top","0px");
          $("#renderarea").css("position","fixed");
          
          pushState(view,$(".imageFocus").attr("id"));
          $('.imageFocus').removeClass("imageFocus");

          $(".playerReconnecting").html('').hide();
          view = "player";
          $("#HTML5Div").html(Util.playerBody());
          $("#HTML5Div").show();
          $("#play-2").addClass("imageFocus");
          if(Player.type == "live"){
               $(".playRewind").hide();
               $(".playForward").hide();
               $(".play-icons").show();
               $(".playRewindR").show();
               $(".playForwardF").show();
              // $(".playerDivision").hide();
               $(".playerBottomDiv").hide();
               
           }
           else{
               $(".playRewindR").hide();
               $(".playForwardF").hide();
               $(".play-icons").show();
               $(".playerDivision").show();
               //Main.getSubTitles("show",Player.season,Player.eps);
          }
          if(playBarInterval){
               clearInterval(playBarInterval);playBarInterval = '';
          }		
          playBarInterval = setInterval(function(){
                
               $(".playerDivision").hide();
               $(".play-icons").hide();
               if($('.imageFocus').attr("source") != "listSubs")
                    $('.imageFocus').removeClass("imageFocus");

          },5000);

          short = false;

     }
     else{
          $("#renderarea").css("width","100%");
          $("#renderarea").css("height","100%");
          $("#renderarea").css("left","0%");
          $("#renderarea").css("top","0%");
          $("#renderarea").css("position","relative");

          var obj = popState();
          view = obj.view;
          short = true;
          $("#"+obj.focus).addClass("imageFocus");
         
          $("#notification").html('').hide();
     }
     
};

var reconnecting = false,reconnectDone = 0;
function reconnect(url) {
     reconnecting= true;
     media.stop();
     media = toast.Media.getInstance();
     media.open(url);
     media.play();
     reconnecting = false;
     reconnectDone++;
}
var playerLiveIndex = 0;
Player.playKeydown = function(e)
{
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
	
	
	function showPlayerBar(){

		
		if($(".play-icons").css("display") == "block"){
			if(playBarInterval){
				clearInterval(playBarInterval);playBarInterval = '';
			}
			playBarInterval = setInterval(function(){
			
			if($('.imageFocus').attr("source") != "listSubs")
				$('.imageFocus').removeClass("imageFocus");
		
			$('.play-icons').hide();
               $('.playerDivision').hide();
               
			},5000);
			return false;
		}
		else{
			$(".playerDivision").show();
			$('.play-icons').show();
			if($('.imageFocus').attr("source") != "listSubs")
				$('.imageFocus').removeClass("imageFocus");
			$('.play-icon').addClass("imageFocus");
               if(Player.type == "live"){
                    $(".playRewind").hide();
                    $(".playForward").hide();
                    $('.playerBottomDiv').hide();
                }
                else{
                    $(".playRewindR").hide();
                    $(".playForwardF").hide();
                    $(".playerBottomDiv").show();
                }
			 
			if(playBarInterval){
				clearInterval(playBarInterval);playBarInterval = '';
			}		
			playBarInterval = setInterval(function(){
				 
				$(".playerDivision").hide();
				$(".play-icons").hide();
				if($('.imageFocus').attr("source") != "listSubs")
					$('.imageFocus').removeClass("imageFocus");

			},5000);
			return true;
		}
	}
	var source = $(".imageFocus").attr("source");
	if(showPlayerBar()){
		//showPlayerDetails();
	}
	else { //if($("#beforePlayer").css("display") != "block"){
		
		switch (keycode) {
		case tvKeyCode.MediaPlayPause:{
			if($(".play-icon").css("display") == "block"){
				if(document.visibilityState != "hidden")
					media.play();
					$(".play-icon").html('<i class="fas fa-pause"></i>');
				 
			}
			else{
				media.pause();
		        $(".play-icon").html('<i class="fas fa-play"></i>');
		        
			}
			break;
		}
		case tvKeyCode.ArrowLeft: {
			
			if(source == "playIcons")
			{
                    if(Player.type == "live"){
                         if(index == 2){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.playRewindR').addClass("imageFocus");
                         }
                         else if(index == 4){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.play-icon').addClass("imageFocus");
                         }
                        
                    }
                    else{
                         if(index == 2){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.playRewind').addClass("imageFocus");
                         }
                         else if(index == 3 ){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.play-icon').addClass("imageFocus");
                         }
                        
                    }
				
			}
			
			//seekToPosition("prev");
			break;
		}
		case tvKeyCode.ArrowRight: {
			
			
			if(source == "playIcons")
			{
                    if(Player.type == "live"){
                         if(index == 2){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.playForwardF').addClass("imageFocus");
                         }
                         else if(index == 0){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.play-icon').addClass("imageFocus");
                         }
                    }
                    else{
                         if(index == 2){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.playForward').addClass("imageFocus");
                         }
                         else if(index == 1){
                              $('.imageFocus').removeClass("imageFocus");
                              $('.play-icon').addClass("imageFocus");
                         }
                    }

			}
			
			
			break;
		}case tvKeyCode.ArrowUp: {

			if($(".play-icons").css("display") == "block"){

                    $(".playerDivision").hide();
                    $('.play-icons').hide();
                    $('.imageFocus').removeClass("imageFocus");
				
				
			}
			else {
                    $(".playerDivision").show();
                    if(Player.type == "live")
                         $(".playerBottomDiv").hide();
				$('.play-icons').show();
				$('.imageFocus').removeClass("imageFocus");
				$('.play-icon').addClass("imageFocus");
			}
			break;
		}
		case tvKeyCode.Enter: {
			Player.playEnterKeydown($('.imageFocus'));
			break;
		}
		case tvKeyCode.MediaPlay:{
			if(document.visibilityState != "hidden")
				//media.play();
				if (isTizen) {
					if (webapis.avplay.getState() === 'IDLE') {
						webapis.avplay.prepare();                
						webapis.avplay.play();
					} else if(webapis.avplay.getState() === 'PAUSED'){
						webapis.avplay.play();
					}
				} else {
					if (html5Player)
						html5Player.play();
				}
				$(".play-icon").html('<i class="fas fa-pause"></i>');
			break;
		}
		case tvKeyCode.MediaStop:{
			Player.processBack();
			log("tvKeyCode.MediaStop " + keycode);
			break;
		}
		case tvKeyCode.MediaPause:{
			$(".playerDivision").show();$('.play-icons').show();
			//media.pause();
			if (isTizen)
				webapis.avplay.pause();
			else
				if (html5Player)
					html5Player.pause();
			$(".play-icon").html('<i class="fas fa-play"></i>');
	        
			break;
		}
		case tvKeyCode.MediaFastForward:{
			$(".playerDivision").show();$('.play-icons').show();
			$('.imageFocus').removeClass("imageFocus");
			$('.playForward').addClass("imageFocus");
			seekToPosition("next");
			break;
		}
		case  tvKeyCode.MediaRewind:
		case tvKeyCode.MediaBackward:{
			$(".playerDivision").show();$('.play-icons').show();
			$('.imageFocus').removeClass("imageFocus");
			$('.playRewind').addClass("imageFocus");
			seekToPosition("prev");
			break;
		}
		case tvKeyCode.ArrowDown: {

			if(source == "listSubs"){
				var count = Object.keys(Main.subTitles).length;
				index ++;
				if(index <= count){
					$('.imageFocus').removeClass("imageFocus");
					$('#subsList-'+index).addClass("imageFocus");
				}
				
			}
			else if($(".player").css("display") == "block"){
				if(Player.type == "live"){
					
				}else{
					$(".player").hide();$('.play-icons').hide();
					$('.imageFocus').removeClass("imageFocus");
				}
				
				
				
			}
			else {
				$(".player").show();$('.play-icons').show();
				$('.imageFocus').removeClass("imageFocus");
				$('.play-icon').addClass("imageFocus");
			}
			break;
		}
		
		case 461:
		case tvKeyCode.Return: 
		case 8:{
				Player.processBack();
			    break;
		}
		case 1536:{
			
		}
		default:{
			break;
		}
		}
	}
};
var liveCatChannelArray = '';
function getMedia(){
     return document.getElementsByTagName('video')[0];
}
Player.playEnterKeydown = function(curFocus){
	var source = curFocus.attr("source");
	var index = parseInt(curFocus.attr("index"));


     if(playBarInterval){
          clearInterval(playBarInterval);playBarInterval = '';
     }		
     playBarInterval = setInterval(function(){
           
          $(".playerDivision").hide();
          $(".play-icons").hide();
          if($('.imageFocus').attr("source") != "listSubs")
               $('.imageFocus').removeClass("imageFocus");

     },5000);

	if($(".playerDivision").css("display") == "block"){
		if(source == "playIcons"){
			if(index == 2){
				playOrPause();
			}
			else if(index == 1 ){
				seekToPosition("prev");
			}
			else if(index == 3){
				seekToPosition("next");
               }
               else if(index == 0 ){
                    if(playerLiveIndex > 0){
                         playerLiveIndex --;
                         Player.data = liveSectionDetails[playerLiveIndex];
                         var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[playerLiveIndex].stream_id+".ts";
                         Player.playStream(playUrl,false);
                    }
                   
			}
			else if(index == 4){
                    if(playerLiveIndex < liveSectionDetails.length-1){
                         playerLiveIndex ++;
                         Player.data = liveSectionDetails[playerLiveIndex];
                         var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[playerLiveIndex].stream_id+".ts";
                         Player.playStream(playUrl,false);
                    }
                    
			}
		}
		
	}
	else {
		$(".player").show();
	}
	
};
var beaconInterval = '';
function clearPlayerValues(){
	media.stop();
	media.unsetListener();
	media.reset();
	/*
	if (html5Player) {
		html5Player.pause();
		html5Player.currentTime = 0;
		html5Player.src = null;
		html5Player = null;
	}
	*/
	if (isTizen) {
		webapis.avplay.stop();
	} else {
		html5Player.src = '';
		html5Player = null;
	}
	$("#videoDiv").hide();
	$("#videoDiv").html('');
	isplaying = false;
}

Player.close = function() {
	log('Player.close()');
	isclosed = true;
	if(reconnectInt != -1){
		clearTimeout(reconnectInt);
		reconnectInt = -1;
	}

	if (isTizen) {
		webapis.avplay.stop();
		webapis.avplay.close();
	} else {
		if (html5Player) {
			html5Player.src = '';
			html5Player = null;
		}
	}
	isplaying = false;
	//preparing = false;
	Main.HideLoading();
	/*
	if (html5Player) {
		//if (Player.getFullscreen()) {
		//	Player.setFullscreen(false);
		//} else {
			html5Player.pause();
			html5Player.currentTime = 0;
			//html5Player.src = null;
			html5Player = null;
			isplaying = false;
		//}
	}
	*/
	currentStreamId = -1;
};

Player.processBack = function(){

     if(Player.type == "live")
          Player.resize();
     
     $("#HTML5Div").hide();
     if(playBarInterval){
		clearInterval(playBarInterval);playBarInterval = '';
     }
     if(intervalNetwork){
          clearInterval(intervalNetwork);intervalNetwork = '';
          obj = {};
          loadingTimeArray = [];
     }
     $('.play-icons').hide();
     if(Player.type != "live"){
		 /*
		if (html5Player) {
			html5Player.pause();
			html5Player.currentTime = 0;
			html5Player.src = null;
			html5Player = null;
		} else {
          	media.stop();
			  jwplayerH.stop();
		}
		*/
		if (isTizen) {
			webapis.avplay.stop();
		} else {
			html5Player.src = '';
			html5Player = null;
		}
		isplaying = false;
		var obj = popState();
		view = obj.view;
		previousFocus = obj.focus;
		$("#loadingText").html("Loading..");
		$("#videoDiv").hide();$("#HTML5Div").hide();
		$('.imageFocus').removeClass("imageFocus");
	
          try{
        	  $('.play-icons').hide();
              Main.HideLoading();
              Main.playerHideLoading();
          }
          catch(e){
        	  
          }
          
	     Main.processNext();
     }
     else{
		 /*
		if (html5Player) {
			//if (Player.getFullscreen()) {
			//	Player.setFullscreen(false);
			//} else {
				html5Player.pause();
				html5Player.currentTime = 0;
				html5Player.src = null;
				html5Player = null;
				isplaying = false;
			//}
			currentStreamId = -1;
		}
		*/
		currentStreamId = -1;
		isplaying = false;
		if (isTizen) {
			webapis.avplay.stop();
		} else {
			html5Player.src = '';
			html5Player = null;
		}
    	try{
       	     $('.play-icons').hide();
             Main.HideLoading();
             Main.playerHideLoading();
        }
         catch(e){
       	  
        }
     }
	/* media.stop();
	var obj = popState();
	view = obj.view;
	previousFocus = obj.focus;
	$("#loadingText").html("Loading..");
	$("#videoDiv").hide();$("#HTML5Div").hide();
	if(playBarInterval){
		clearInterval(playBarInterval);playBarInterval = '';
	}	
	$("#videoDiv").html('');
	$('.imageFocus').removeClass("imageFocus");
	
	$('.play-icons').hide();

	$(".waterMark").hide();
	$("#beforePlayer").hide();
	
	clearTimeout(ival);ival = '';
	$(".srt").hide();
	Main.HideLoading();
	Main.processNext(); */
};
var seekTimeNext = 0;
var seekTimePrev = 0;
function seekToPosition(params){
	var cur = media.getCurrentPosition(); 
	var dur = '';
	media.pause();
	dur = media.getDuration();
	try{
		if(media.getDuration() == -1){
			if(singleMoviePage && singleMoviePage.vendorInfo && singleMoviePage.vendorInfo.duration){
				dur = singleMoviePage.vendorInfo.duration;
				dur = dur*1000;
			}
		}
	}catch(e){}
	
	//if((cur + jumpNum) < media.getDuration() && (cur + jumpNum) > 0){
		if(params == "next"){
			
			if(( (cur+seekTimePrev) + seekTimeNext ) < (dur-20000)){
				seekTimeNext = seekTimeNext + jumpNum;
				seekTime = seekTime + jumpNum;
				log("Next" + (dur + seekTimeNext) );
			}
			else{
				seekTimeNext = dur-media.getCurrentPosition();
				seekTime = dur-media.getCurrentPosition();
			}
		}
		else{
			
			if( (seekTimePrev + (cur+seekTimeNext)) > 20000){
				seekTimePrev = seekTimePrev - jumpNum;
				seekTime = seekTime - jumpNum;
				log("prev" + (media.getCurrentPosition() + seekTimePrev));
			}
			else{
				seekTimePrev = -media.getCurrentPosition();
				seekTime = -media.getCurrentPosition();
			}	
		}
			
		var y = '';
		var offsetPos = '';
		var pickerX = parseInt($("#seek-picker").css("left").replace("px",''));
		
		if( $("#flix-seekbar-run").css("width").indexOf("px") != -1){
			
			offsetPos = parseInt($("#flix-seekbar-run").css("width").replace("px",''));
			
			y = (  (cur + seekTime) / dur ) * 100;
			
			var totalMove = (($("#flix-seekbar").width() * y) / 100);
			$("#flix-seekbar-run").css("width",totalMove+"px");
			$("#seek-picker").css("left",(totalMove-15)+"px");
			
               var offsetForRuntime  = $("#seek-picker").offset().left - ($("#seek-picker-runtime").width() / 2)
               
			$("#seek-picker-runtime").css("left",(offsetForRuntime)+ "px" );
			$("#seek-picker-runtime").html(getTimeHMS(cur + seekTime));
			$("#seek-picker-runtime").show();
		}
		
		
		if(seekTimer)
			clearTimeout(seekTimer);

		seekTimer = setTimeout(function(){ seekTime = Math.abs(seekTime);$("#seek-picker-runtime").hide(); 
		log("SeekTime before - "+seekTime);seekTo(params);clearTimeout(seekTimer);seekTimer = '';},1000);
	    log("SeekTime in seeker- "+seekTime);
		
		
//		}	
}


function seekTo(param) {

log("seekTo function");

	if(seekTime){
		curPos = media.getCurrentPosition();
	     var dur = media.getDuration();
	     if(media.getDuration() == -1){
				if(singleMoviePage && singleMoviePage.vendorInfo && singleMoviePage.vendorInfo.duration){
					dur = singleMoviePage.vendorInfo.duration;
					dur = dur*1000;
				}
		 }
	     if((curPos + (seekTimeNext + seekTimePrev)) < dur){
	     	media.seekTo(curPos + (seekTimeNext + seekTimePrev));
	     }
	     else{
	     	media.seekTo(dur - 2000);
	     }
	     
	     seekTime = 0;
		 seekTimeNext = 0;
		 seekTimePrev = 0;
	}
	if($(".play-icon").css("display") != "block")
		media.play();
		
}
var mediaState = true;
function playOrPause() {

log("playOrPause");

if(mediaState) {
	media.pause();
	
	$(".play-icon").html('<i class="fas fa-play"></i>');
	mediaState = false;

	//You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
}
else {
	if(document.visibilityState != "hidden")
		media.play();
	$(".play-icon").html('<i class="fas fa-pause"></i>');
	

	mediaState = true;
	//You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
}
}



/// Subs


function toSeconds(t) {
    var s = 0.0
    if(t) {
      var p = t.split(':');
      for(i=0;i<p.length;i++)
        s = s * 60 + parseFloat(p[i].replace(',', '.'))
    }
    return s;
  }
  function strip(s) {
    return s.replace(/^\s+|\s+$/g,"");
  }
  var ival = '';
  function playSubtitles(subtitleElement) {
   
    var srt = subtitleElement.text();
	subtitleElement.text('');
	
    srt = srt.replace(/\r\n|\r|\n/g, '\n')
    
    var subtitles = {};
    srt = strip(srt);
    var srt_ = srt.split('\n\n');
    for(s in srt_) {
        st = srt_[s].split('\n');
        if(st.length >=2) {
          n = st[0];
          i = strip(st[1].split(' --> ')[0]);
          o = strip(st[1].split(' --> ')[1]);
          t = st[2];
          if(st.length > 2) {
            for(j=3; j<st.length;j++)
              t += '\n'+st[j];
          }
          is = toSeconds(i);
          os = toSeconds(o);
          subtitles[is] = {i:is, o: os, t: t};
        }
    }
    var currentSubtitle = -1;
    ival = setInterval(function() {
      var currentTime = media.getCurrentPosition()  / (1000);
	  var subtitle = -1;
	  
	  
	  var Okeys = Object.keys(subtitles);

	  var Values = [];
	 
	  for(var i=0;i<Okeys.length;i++){
		Values.push(subtitles[Okeys[i]]);
	  }
	  
	  //Object.values(subtitles);
	  var funC = function(a, b){return parseInt(a)-parseInt(b)}
	  Okeys.sort(funC);
	  Values.sort(funC);

      for(var i = 0;i<Values.length;i++) {
		//  console.log("s = "+keys + " current Time = "+ currentTime);
        if(Okeys[i] > currentTime)
          break;
        subtitle =  Okeys[i];
      }
      if(subtitle != -1) {
        if(subtitle != currentSubtitle) {
          subtitleElement.html(subtitles[subtitle].t);
          currentSubtitle=subtitle;
        } else if(subtitles[subtitle] && subtitles[subtitle].o < currentTime) {
          subtitleElement.html('');
        }
      }
    }, 100);
  }


  function playSubs(srtUrl) {
	$(".srt").html('');
	$(".srt").show();
    var subtitleElement = $(".srt");
    var videoId = $("#renderarea video");
    if(!videoId) return;
	//var srtUrl = "http://subs.89to.com/movies/tt3778644/tt3778644.he.srt";
	try{
		if(srtUrl) {
			$(".srt").load(srtUrl, function (responseText, textStatus, req) { 
			  playSubtitles(subtitleElement);
			})
		} else {
		  playSubtitles(subtitleElement);
		}
	}
	catch(e){

	}
    
  }
