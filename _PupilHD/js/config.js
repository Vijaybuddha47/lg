window.APP_NAME = "PupilHD";

window.APP_DOMAIN = "https://billing.pupilhd.com";
window.APP_BLESTA_URL = "https://billing.pupilhd.com/portal/api";
window.TOKEN = "Basic dXNlcjI6MzA5MzU4NjY4NTIwNTJlY2QxNTI2YjA1Y2E4NjEyNjA=";

window.APP_STALKER_URL = "http://sta.pupilhd.net";
window.APP_IMAGE_URL = "https://images.pupilhd.net";
window.STALKER_TOKEN = '';
window.STALKER_USER_ID = '';
window.GET_MAC_ADDRESS = '';

//All global array
window.APP_CHANNEL_DATA_ARRAY = {};
window.APP_CAT_VIDEO_ARRAY = {};
window.APP_VIDEO_CATEGORY = [];
window.FAVORITE_LIST = {};
window.FAVORITE_DATA = {};
window.SLECTED_VIDEO_DATA = {};
window.VIDEO_PLAYER = '';
window.PLAY_VIDEO = false;
window.PLAYER_STATE = 0;


//Countries/Genres related variables
window.APP_GENRE_COUNTRY_LIST = [];

//Countries related variables
window.APP_COUNTRY_ARRAY = [];
window.APP_COUNTRY_LIST = [];
window.COUNTRY_WISE_CHANNEL_DATA = {};

//Genres related variables
window.APP_GENRE_ARRAY = [];
window.APP_GENRE_LIST = [];
window.GENRE_WISE_CHANNEL_DATA = {};


//First page(Live tv channel) common variables used in app
window.FIRST_PAGE_SELECTED_ITEM = '';
window.FIRST_PAGE_FOCUSED_ITEM = '';
window.SELECTED_CHANNEL_NUMBER = '';
window.SELECTED_CHANNEL_ROW = '';
window.APP_CHANNEL_DATA = [];
window.SELECTED_CHANNEL_TYPE = 'FAV';

//Second page(video library) common variables used in app
window.SECOND_PAGE_SELECTED_ITEM = 'video_item_0_1';
window.SECOND_PAGE_FOCUSED_ITEM = '';
window.SECOND_PAGE_SELECTED_SHOW_CATEGORY = '';
window.EPISODE_LIST = '';

//Third page(episode) common variables used in app
window.THIRD_PAGE_SELECTED_ITEM = '';
window.THIRD_PAGE_FOCUS_ITEM = '';
window.SELECTED_EPISODES = {};
window.SELECTED_VIDEO_DATA = '';

//Fourth page (Search) variables used in app
window.FOURTH_PAGE_SELECTED_ITEM = '';
window.FOURTH_PAGE_FOCUSED_ITEM = '';
window.SEARCHED_TV_CHANNELS_LIST = {};
window.SEARCHED_VIDEO_LIST = {};

//Setting page variables
window.ALPHA_NUMERIC = 'NUMERIC'; //or ALPHA/NUMERIC
window.COUNTRY_GENRE = 'COUNTRY';// or GENRE/COUNTRY
window.COUNTRY_CHOICE = []; //Three country array
window.SELECTED_ALPHA_NUMERIC = 'NUMERIC'; //or ALPHA/NUMERIC
window.SELECTED_COUNTRY_GENRE = 'COUNTRY';// or GENRE/COUNTRY

//Common variables used in app
window.MENU_INDEX = 0;
window.TAB_INDEX = -1;
window.PAGE_INDEX = 0;
window.LOGIN_HIDE_SHOW_ERROR = "";
window.NAVIGATION_INDEX = 30;
window.ROW_INDEX = 0;
window.five_row_channel_list = true;
window.TIMER = null;
window.VOD_COUNTER = 0;
window.PREVIEW_FULL_DISPLAY = false;
window.REFRESH_TOKEN_TIME = 0;
window.SELECTED_CHANNEL_INDEX = '';
window.SELECTED_CAT_INDEX = '';
window.TOTAL_COUNTRY = '';
window.SYSTEM_PUBLIC_IP = '';
window.PLAY_TIMER = '';
window.TIME_OUT_FIRST = 0;
window.SELECTED_EPIOSDE_NUMBER = 0;
window.PING_TIMER = 0;

// Preview player related variable
window.PREVIEW_PLAYER = '';
window.PREVIEW_VOD_URL = '';
window.PREVIEW_MEDIA_OBJ = '';
window.VOD_URL = '';

//Static last tabindex 21

// Forward/Backward interval
window.MEDIA_FORWARD_INTERVAL = 15;
window.MEDIA_REWIND_INTERVAL = 10;
window.hide_progress_bar = "";
window.hide_programme_details = "";

//Error messages
window.REQUEST_TIMEOUT = 90; // In second
window.NET_CONNECTION_ERR = "Please check your Internet connection and try again.";
window.TIMEOUT_MSG = "Request Timeout";
window.DATA_PARSE_ERR = "Data Parse Error";
window.APP_EXIT_MSG = "Are you sure you want to exit?";
window.PLAYER_ERR = "The content is currently unavailable. Please check back later.";
window.CONTENT_NOT_AVAILABLE = "Content Currently Not Available";
window.TIME_STAMP = "";
window.NO_RECORD_MSG = "No record found.";
window.SOMETHING_WENT_WRONG = "Something went wrong. Please check back later.";