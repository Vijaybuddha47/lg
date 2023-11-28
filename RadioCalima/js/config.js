window.APP_NAME = "Radio Calima";

window.APP_DOMAIN = "https://billing.radiocalima.com";
window.VOD_URL = "https://585b674743bbb.streamlock.net:443/calimafm/calimafm/playlist.m3u8";


//All global array
window.APP_DATA_ARRAY = {};
window.APP_MUSIC_URL_ARRAY = {
    0: {
        stream_url: "https://escucha.calima.fm/stream",
        metadataType: "",
    },
    1: {
        stream_url: "https://escucha.calima.fm/stream-tf",
        metadataType: "",
    },
    2: {
        stream_url: "https://escucha.calima.fm/stream-fl",
        metadataType: "",
    },
    3: {
        stream_url: "https://escucha.calima.fm/cero",
        metadataType: "",
    }
};



//Common variables used in app
window.MENU_INDEX = 0;
window.TAB_INDEX = 0;
window.PAGE_INDEX = 0;
window.VOD_COUNTER = 0;
window.AOD_URL = '';
window.FOCUSED_ITEM = '';
window.SELECTED_ITEM = '';
window.RADIO_PAGE_FOCUSED_ITEM = '';
window.AUDIO_PLAYER = '';
window.PLAY_AUDIO = false;
window.PLAY_VIDEO = false;
window.SELECTED_IMG = '';
window.ICECAST_PLAY = '';

// Forward/Backward interval
window.MEDIA_FORWARD_INTERVAL = 15000;
window.MEDIA_REWIND_INTERVAL = 10000;
window.hide_progress_bar = "";
window.hide_programme_details = "";
window.icecast_time_interval = "";

//Error messages
window.REQUEST_TIMEOUT = 90; // In second
window.NET_CONNECTION_ERR = "Please check your Internet connection and try again.";
window.TIMEOUT_MSG = "Request Timeout";
window.DATA_PARSE_ERR = "Data Parse Error";
window.APP_EXIT_MSG = "Are you sure you want to exit?";
window.PLAYER_ERR = "The content is currently unavailable. Please check back later.";
window.TIME_STAMP = "";
window.NO_RECORD_MSG = "No record found.";
window.SOMETHING_WENT_WRONG = "Something went wrong. Please check back later.";