window.BASE_URL = "https://uhunt.org/api/rest/";

window.OAUTH_TOKEN_ATTR_KEY = "oauth_token";
window.OAUTH_SECRET_ATTR_KEY = "oauth_secret";

window.OAUTH_CONSUMER_KEY = "227h4fl05ztj31ql8l10msyotzsoyiie";
window.OAUTH_CONSUMER_SECRET = "0rzny8ahdvw8x053x7tq5mx46jojv3w4";
window.APPEND_AT_THE_END_OF_URL = "&language=en&oauth_consumer_key=" + OAUTH_CONSUMER_KEY + "&oauth_consumer_secret=" + OAUTH_CONSUMER_SECRET;

window.PER_PAGE_LIMIT = 20;
window.PER_FEATURED_LIMIT = 20;

// API called on All videos menu
window.ALL_VIDEO_URL = BASE_URL + "advancedvideos/browse";

// API called on Channel and Shows menu
window.CHANNEL_AND_SHOWS_URL = BASE_URL + "advancedvideos/channel/browse";

// API called on Video category menu
window.VIDEO_FIRST_PAGE_URL = BASE_URL + "advancedvideos/categories?showCount=1&limit=" + PER_PAGE_LIMIT + APPEND_AT_THE_END_OF_URL;
window.VIDEO_SECOND_PAGE_URL = BASE_URL + "advancedvideos/categories?limit=" + PER_PAGE_LIMIT + "&category_id=";

// API called on Channel category menu
window.CHANNEL_FIRST_PAGE_URL = BASE_URL + "advancedvideos/channel/categories?showCount=1&limit=" + PER_PAGE_LIMIT + APPEND_AT_THE_END_OF_URL;
window.CHANNEL_SECOND_PAGE_URL = BASE_URL + "advancedvideos/channel/categories?limit=" + PER_PAGE_LIMIT + "&category_id=";
window.CHANNEL_THRID_PAGE_URL = BASE_URL + "advancedvideo/channel/videos/";

// API called on Search page
window.SEARCH_URL = BASE_URL + "advancedvideos/browse?&limit=" + PER_PAGE_LIMIT + "&search=";

//Increase video count on every video play
window.VIDEO_COUNT_URL = BASE_URL + "videos/view/";

// App Name
window.APP_NAME = "Uhunt - Hunting & Fishing";

// Menu object
window.MENU_ARRAY = [
    { 'name': "Search", 'id': 'SE', 'image': "search-menu-icon.png" },
    { 'name': "Channels and Shows", 'id': 'CAS', 'image': "channel-menu-icon.png" },
    { 'name': "Channels Categories", 'id': 'CC', 'image': "channel-category-menu-icon.png" },
    { 'name': "All Videos", 'id': 'AL', 'image': "all-video-menu-icon.png" },
    { 'name': "Video Categories", 'id': 'VC', 'image': "video-category-menu-icon.png" },
    { 'name': "Login/sign out", 'id': 'SO', 'image': "logout-menu-icon.png" },
    { 'name': "Support/Help", 'id': 'SU', 'image': "support-help-menu-icon.png" }
];

window.CAT_ARRAY = {}; // It is hold hole app data.

//Error messages
window.REQUEST_TIMEOUT = 90; // In second
window.NET_CONNECTION_ERR = "Please check your Internet connection and try again.";
window.TIMEOUT_MSG = "Request Timeout";
window.DATA_PARSE_ERR = "Data Parse Error";
window.APP_EXIT_MSG = "Are you sure you want to exit?";
window.PLAYER_ERR = "The content is currently unavailable. Please check back later.";
window.EMPTY_CATSET = "No channels to display";
window.EMPTY_VOD_LIST = "No video items to display";
window.EMPTY_DATA_SOURCE = "Sorry, this app is currently unavailable. Please check back later.";
window.UPGRADE_ACCOUNT_INFO_TEXT = "Please upgrade to view this content, visit www.uhunt.org for more information";

// Forward/Backward interval
window.MEDIA_FORWARD_INTERVAL = 15;
window.MEDIA_REWIND_INTERVAL = 10;

// Menus' related common variable
window.MENU_LOAD_TIMER = "";
window.FOCUSED_MENU_INDEX = 3;
window.SELECTED_MENU_INDEX = 3;
window.MENU_ID = "AL";

// Page's related common variable
window.FIRST_PAGE_COUNTER = 1;
window.SECOND_PAGE_COUNTER = 1;
window.THIRD_PAGE_COUNTER = 1;

window.FIRST_PAGE_ITEM_COUNTER = 0;
window.SECOND_PAGE_ITEM_COUNTER = 0;
window.THIRD_PAGE_ITEM_COUNTER = 0;

window.FIRST_ROW_ITEM_COUNTER = 1;
window.SECOND_ROW_ITEM_COUNTER = 1;
window.THIRD_ROW_ITEM_COUNTER = 1;

window.TIME_STAMP = 0;
window.LOAD_NEXT_PAGE = 0;

window.FEATURE_ROW_FLAG = 0;
window.FEATURED_ROW_COUNTER = 0;
window.FEATURED_PAGE_COUNTER = 1;

window.FIRST_PAGE_ITEM_INDEX = 0;
window.SECOND_PAGE_ITEM_INDEX = 0;
window.THIRD_PAGE_ITEM_INDEX = 0;

window.IP_ADDRESS = "";
window.TOGGLE_MENU = 0;

// Player's related common variable
window.VOD_URL = "";
window.VIDEO_ID = "";
window.status = -1;
window.INTERVAL = "";
window.hide_progress_bar = "";
window.VIDEO_PLAYER = "";
window.MEDIA_OBJ = "";
// for input text cursor
window.TEXT_LENGTH = 0;
window.LENGTH = 0;
window.S_START = 0;

// Scroll up-down related common variable
window.SCROLL_DOWN = false;