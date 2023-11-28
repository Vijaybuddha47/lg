window.APP_NAME = "LamiaFM";

// Variables for modal color setting
window.MODAL_BG_COLOR = "transparent";
window.MODAL_TEXT_COLOR = "#000000";
window.MODAL_ACTIVE_BUTTON_BG_COLOR = "#ec364f";
window.MODAL_ACTIVE_BUTTON_TEXT_COLOR = "#FFFFFF";
window.MODAL_DEACTIVE_BUTTON_BG_COLOR = "#515151";
window.MODAL_DEACTIVE_BUTTON_TEXT_COLOR = "#ffffff";

window.SELECTED_MENU_INDEX = 0;
window.FOCUSED_MENU_INDEX = 0;
window.FOCUSED_CAT_INDEX = 0;
window.SELECTED_CAT_INDEX = 0;

// These all static variables must be overwrite after successfully data parsing
window.NET_CONNECTION_ERR = "Please check your Internet connection and try again.";
window.TIMEOUT_MSG = "Request Timeout";
window.DATA_PARSE_ERR = "Data Parse Error";
window.APP_EXIT_MSG = "Are you sure you want to exit?";
window.PLAYER = "";
window.PLAYER_ERROR = 0;
window.PLAYER_STATE = "";
window.PLAYER_ERROR_STR = "The content is currently unavailable. Please check back later.";
window.MEDIA_OBJ = "";
window.VIDEO_PLAYER = "";

window.DATA_OBJ = {
	0: {
		menuName: "Watch",
		videoUrl: "https://media.upmediatech.com:3715/live/lamiafmlive.m3u8",
		videoTitle: ""
	},
	1: {
		menuName: "Settings",
		items: {
			0: {
				itemTitle: "About Us",
				itemDescription: "LamiaFM is an internet radio station founded by Manuel Gonzalez more than two decades ago. LamiaFM always innovating and keeping up to date in professional equipment despite being an internet radio but a long time ago we realized that the future of radio is this, that is why now we went from traditional radio to visual radio more than 3 years ago years to provide the best music programming in audio and music video <br/><br/>LamiaFM, which has its application for Android and IOS phones, and we have added a new application for Smart TVs to be closer to our users, being one of the first internet radios to create its fully native application for televisions. thanks to our users and follow us on all digital platforms like LamiaFM",
				itemImage: "images/main_au.png",
				itemInnerImage: "images/inner_au.png"
			}
		}
	}
};