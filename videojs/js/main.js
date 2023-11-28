/* eslint-env browser */
// var APP_ID = 'com.bitmovin.demo.webapp';
var APP_ID = 'com.wikitv.app-webos';
var PLAYER_KEY = '625f2e62-1e46-4716-a16c-3095bb67b3aa';

var player;
var source = {
  // AVC Stream
  // dash : "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
  // HEVC Stream
  // dash : "https://bitmovin-a.akamaihd.net/content/multi-codec/hevc/stream.mpd"
  // Widevine Stream
  // dash: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
  hls: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
  // drm: {
  //   widevine: {
  //     LA_URL: 'https://widevine-proxy.appspot.com/proxy'
  //   }
  // }
};

window.onload = function () {
  setupControllerEvents();
  setupPlayer();

  var keySystem = webOSDev && webOSDev.DRM.Type.WIDEVINE;
  var webosDrmAgent = getDrmAgent(keySystem);

  // In the app is started shortly after webOS is rebooted the DRM system and CMD
  // might not be fully ready to use for DRM playback. Therefore we should await
  // drmAgents onsuccess callback before we try to load DRM source.
  // if (webosDrmAgent) {
  //   isDrmLoaded(webosDrmAgent)
  //     .then(function () {
  //       return loadSource(source);
  //     })
  //     .catch(function (e) {
  //       console.log('Error while loading drm Agent', e);
  //     });
  //   return;
  // }

  // In case we don't have drmAgent available, just load the source normal way.
  loadSource(source);
};

function setupPlayer () {
  // add all necessary (and loaded) modules to the player core
  bitmovin.player.core.Player.addModule(window.bitmovin.player.polyfill.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player['engine-bitmovin'].default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player['container-mp4'].default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player['container-ts'].default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.mserenderer.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.abr.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.drm.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.xml.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.dash.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.hls.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.style.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.webos.default);

  var conf = {
    key: PLAYER_KEY,
    playback: {
      autoplay: true,
      preferredTech: [{
        player: 'html5',
        streaming: 'dash'
      }]
    },
    style: {
      ux: false
    },
    tweaks: {
      file_protocol: true,
      app_id: APP_ID,
      BACKWARD_BUFFER_PURGE_INTERVAL: 10
    },
    buffer: {
      video: {
        forwardduration: 30,
        backwardduration: 10
      },
      audio: {
        forwardduration: 30,
        backwardduration: 10
      }
    }
  };

  var container = document.getElementById('player')
  player = new bitmovin.player.core.Player(container, conf);
}

function loadSource(source) {
  player.on(bitmovin.player.core.PlayerEvent.Warning, function (data) {
    console.log('On Warning: ' + JSON.stringify(data));
  });

  player.on(bitmovin.player.core.PlayerEvent.Error, function (data) {
    console.log('On Error: ' + JSON.stringify(data));
  });

  player.on(bitmovin.player.core.PlayerEvent.Play, function (data) {
    console.log('On Play: ' + JSON.stringify(data));
  });

  player.on(bitmovin.player.core.PlayerEvent.Playing, function (data) {
    console.log('On Playing: ' + JSON.stringify(data));
  });

  player.on(bitmovin.player.core.PlayerEvent.Pause, function (data) {
    console.log('On Pause: ' + JSON.stringify(data));
  });

  player.on(bitmovin.player.core.PlayerEvent.End, function (data) {
    console.log('On End: ' + JSON.stringify(data));
  });

  return player
    .load(source)
    .then(function () {
      // Success
      console.log('Successfully created bitmovin player instance');
    })
    .catch(function (err) {
      // Error!
      console.error('Error while creating bitmovin player instance', err);
    });
}

function setupControllerEvents () {
  document.addEventListener('keydown', function (inEvent) {
    var keycode;

    if (window.event) {
      keycode = inEvent.keyCode;
    } else if (inEvent.which) {
      keycode = inEvent.which;
    }
    switch (keycode) {
      case 13: // Ok
        console.log("Okay");
        tooglePlayPause();
        break;
      case 415:
        // Play Button Pressed
        console.log("Play");
        player.play();
        break;
      case 19:
        // Pause BUtton Pressed
        console.log("Pause");
        player.pause();
        break;
      case 412:
        // Jump Back 30 Seconds
        console.log("Backword");
        player.seek(player.getCurrentTime() - 30);
        break;
      case 417:
        // Jump Forward 30 Seconds
        console.log("Forword");
        player.seek(player.getCurrentTime() + 30);
        break;
      case 413: // Stop button
        // Unload Player
        console.log("Stop");
        player.unload();
        break;
      default:
        console.log('Key Pressed: ' + keycode);
    }
  });
}

function tooglePlayPause () {
  if (player.isPaused()) {
    player.play();
  } else {
    player.pause();
  }
}

function getDrmAgent (keySystem) {
  return webOSDev && keySystem && webOSDev.drmAgent(keySystem);
}

function loadDrm (drmAgent) {
  return new Promise(function (resolve, reject) {
    try {
      drmAgent.load({
        onSuccess: function (res) {
          resolve(res);
        },
        onFailure: function (e) {
          reject(e);
        }
      })
    } catch (e) {
      reject('Error while loading DRM manager', e);
    }
  })
}

function isDrmLoaded (drmAgent) {
  return new Promise(function (resolve, reject) {
    if (!drmAgent) {
      return reject('No drmAgent');
    }

    drmAgent.isLoaded({
      onSuccess: function (response) {
        if (response.loadStatus === true) {
          resolve(response);
        } else {
          loadDrm(drmAgent)
            .then(function (result) {
              resolve(result);
            })
            .catch(function (err) {
              reject(err);
            })
        }
      },
      onFailure: function (err) {
        reject(err);
      }
    })
  })
}
