
const manifestUri = "http://158.69.162.119:8080/McNjA38dfuhahf/index.m3u8";
// 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

// "http://158.69.162.119:8080/kLANneWSjgfojgpd/index.m3u8";
// "http://158.69.162.119:8080/FAxNewShgiahsifh/index.m3u8";
// "http://158.69.162.119:8080/McNjA38dfuhahf/index.m3u8";
// "http://158.69.162.123/live/localdisk/ViZioNPlusgdg/SA/ViZioNPlusgdg.m3u8";


function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer();
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

async function initPlayer() {
    const handleError = (error) => {
        console.log("error", error);
        if (error instanceof Error) {
            console.log(" unhandled native error");
            // shaka crashed with an unhandled native error
        }

        if (error.severity === shaka.util.Error.Severity.CRITICAL) {
            console.log(" CRITICAL  error");
            // handle fatal error, playback can not continue
        } else {
            console.log(" non-fatal  error");
            // handle non-fatal error, playback can continue
        }
    };

    // Create a Player instance.
    const video = document.getElementById('video');
    const player = new shaka.Player(video);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
        await player.load(manifestUri);
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
    } catch (e) {
        // onError is executed if the asynchronous load fails.
        onError(e);
        handleError(e);
    }
}

function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event);
}

function onError(error) {
    // Log the error.
    console.error('Error code: ', error);
}

document.addEventListener('DOMContentLoaded', initApp);