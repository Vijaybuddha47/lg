window.APP_NAME = "CityNet";

window.APP_DOMAIN = "http://wikitv.comcast-sa.com/";
window.API_COMMON_PATH = APP_DOMAIN + "OTT/index.php/WebserviceController/";

window.LIVE_MENU_API = API_COMMON_PATH + "serviceLoadChannel";
window.MOVIES_AND_SHOWS_MENU_API = API_COMMON_PATH + "serviceLoadVod";
window.SHOWS_EPISODE_API = API_COMMON_PATH + "serviceGetShowInfo";
window.AUTHENTICATE_VOD_API = API_COMMON_PATH + "authenticateVod";
window.AUTHENTICATE_LIVE_API = API_COMMON_PATH + "authenticateChannel";
window.LOGOUT_API = API_COMMON_PATH + "serviceLogout";
window.LOGIN_API = API_COMMON_PATH + "serviceLogin";
window.FAVORITE_API = API_COMMON_PATH + "serviceToggleFavoriteVod";
window.IMG_PATH = APP_DOMAIN + "OTT/";
window.DVR_URL = "http://138.97.141.100/hls/";

//Error messages
window.REQUEST_TIMEOUT = 90; // In second
window.NET_CONNECTION_ERR = "Se ha producido un error. Por favor, inténtelo de nuevo más tarde.";
window.TIMEOUT_MSG = "La solicitud ha expirado";
window.DATA_PARSE_ERR = "Error al analizar datos";
window.APP_EXIT_MSG = "¿Seguro que quiere salir?";
window.PLAYER_ERR = "El contenido no está disponible actualmente. Por favor, vuelva más tarde.";
window.EMPTY_CATSET = "No hay contenido";
window.TIME_STAMP = "";
window.APP_LOGOUT_MSG = "¿Seguro que quiere cerrar sesión?";

// favorite img
window.FAVORITE_IMG = "images/fav.png";
window.FAVORITE_FOCUSED_IMG = "images/fav_selcted.png";

// favorite text
window.FAVORITE_TEXT = "Favorito";
window.FAVORITE_FOCUSED_TEXT = "Eliminar favorito";

// Forward/Backward interval
window.MEDIA_FORWARD_INTERVAL = 15;
window.MEDIA_REWIND_INTERVAL = 10;

window.hide_progress_bar = "";
window.hide_programme_details = "";

// for login page
window.HIDE_SHOW_ERROR = "";

window.DAY_ARRAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
window.MENU_ARRAY = [
    { 'name': "TV En Vivo", 'id': 'LT' },
    { 'name': "Películas", 'id': 'MO' },
    { 'name': "Series", 'id': 'SH' },
    { 'name': "Salir", 'id': 'LO' },
];

window.CAT_ARRAY = new Array(); // It is hold hole app data.
window.CHANNEL_ITEM_INDEX = 0;
window.CURRENT_ITEM_INDEX = 0;
window.TIME_OUT_FIRST = 0;
window.TIME_OUT_SECOND = 0;
window.GLOBAL_TIME_OUT = 0;
window.CHANNEL_TIME_OUT_SECOND = 0;
window.MENU_INDEX = 0;
window.FOCUSED_MENU_INDEX = 0;
window.SELECTED_MENU_INDEX = 0;
window.CAT_ITEM_INDEX = 0;
window.CAT_ROW_INDEX = 0;
window.EPISODE_ITEM_INDEX = 0;
window.SEASONS_ITEM_INDEX = 0;
window.TAB_INDEX = 0;
window.VOD_URL = "";
window.PAGE = "";
window.VOD_COUNTER = 0;
window.All_EPG_OBJ = {};
window.PLAY_TIMER = '';
window.LAST_FOCUSED = 0;
window.KEYBOARD = false;
window.FAVORITE_STATUS = 0;
window.FAVORITE_VIDEO_ID = "";
window.VIDEO_PLAYER = "";
window.PLAY_VIDEO = false;
window.LAST_SELECTED_ITEM_ID = "";
window.LAST_SELECTED_SEASON_ID = "";
window.LAST_SELECTED_EPISODE_ID = "";