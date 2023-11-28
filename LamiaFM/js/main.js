window.onload = function () {
	$('title').text(APP_NAME);
	$('meta[name=description]').attr('content', APP_NAME);

	// TODO:: Do your initialization job
	$("body").removeAttr("style");
	$(".splash-screen").show();

	// Load html files
	$("span#modal_container").load("modal.html", function () { addEventListeners(); });
	$(".splash-screen").css({ 'position': 'absolute', 'z-index': '100' });
	set_linear_list();

	setTimeout(function () { load_main_screen(); }, 5000);
};

function load_main_screen() {
	if (navigator.onLine) {
		set_menu_list();
		set_linear_list();
		setTimeout(function () { load_video(); }, 10000);
	} else {
		hide_show_modal(true, "RETRY_EXIT", NET_CONNECTION_ERR);
	}
}
function checkVideoURL() {
	console.log("checkVideoURL");
	$.ajax({
		type: "GET",
		url: DATA_OBJ[0].videoUrl,
		async: true,
		cache: false,
		crossDomain: true,
		timeout: 90000,
		success: function (response) {
			console.log(response);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}

function set_menu_list() {
	var str = "";
	$(".splash-screen").hide();
	$(".container").show();
	var menuGapClass = "";

	try {
		var length = _.size(DATA_OBJ);

		for (i = 0; i < length; i++) {
			upFocus = "";
			downFocus = "";

			if (i == 0) upFocus = " data-sn-up='#menu1'";
			if (i == length - 1) downFocus = " data-sn-down='#menu0'";

			str += "<li class='item' tabindex='0' id='menu" + i + "'" + upFocus + downFocus + ">" + DATA_OBJ[i]['menuName'] + "</li>";

		}
	} catch (e) {
		if (window.console && console.error("Error in set menu list: " + e));
	}

	$("ul#menuList").html(str);
	addEventListeners();
	SpatialNavigation.focus('menuList');
	console.log("===================== Menu Loaded =====================");
}

function set_linear_list() {
	if (SELECTED_MENU_INDEX == 0) {
		$(".about-desc").html("");
		$("ul#searchList").attr('id', 'catList');
		$(".loader").hide();

		$("h1#header_title").text(DATA_OBJ[SELECTED_MENU_INDEX]['menuName']);
		str = "<li class='left-none livevideo item' id='content0' tabindex='1' data-sn-up='null' data-sn-down='null' data-sn-right='null'>" +
			"<div class='watch-live-box' id='contentPlayVideoContainer'>" +
			"<div class='watch-live' id='contentPlayVideoImgContainer'>" +
			"<img id='contentPlayVideoImg' src='images/linear_live_image.png'>" +
			"</div>" +
			"</div>" +
			"</li>";

		$("ul#catList").html(str);
		addEventListeners();
	}
}

function set_setting_list(focusedIndex) {
	if (SELECTED_MENU_INDEX == 1) {
		str = "";

		$(".about-desc").html("");
		$("ul#catList").html('');
		$("h1#header_title").text(DATA_OBJ[SELECTED_MENU_INDEX]['menuName']);
		var totalSettingItems = _.size(DATA_OBJ[SELECTED_MENU_INDEX]['items']);

		for (i = 0; i < totalSettingItems; i++) {
			var src = DATA_OBJ[SELECTED_MENU_INDEX]['items'][i]['itemImage'],
				title = DATA_OBJ[SELECTED_MENU_INDEX]['items'][i]['itemTitle'];


			str += "<li class='item' id='content" + i + "' tabindex='1' data-sn-up='null' data-sn-down='null' data-sn-right='null'>" +
				"<div class='category-list' id='contentListContainer" + i + "'>" +
				"<div class='about-box' id='contentBox" + i + "'>" +
				"<div class='about-border' id='contentBorder" + i + "'>" +
				"<div class='about-img' id='contentImgContainer" + i + "'>" +
				"<img id='contentImg" + i + "' src='" + src + "'>" +
				"</div>" +
				"</div>" +
				"<div class='about-grid-title' id='contentTitle" + i + "'>" + title + "</div>" +
				"</div>" +
				"</div>" +
				"</li>";
		}

		$("ul#catList").html(str);
		addEventListeners();
	}
}

function set_setting_content() {
	try {
		SETTING_DESC_SCROLLED = 0;
		$("ul#catList").html("");
		$("h1#header_title").text(DATA_OBJ[SELECTED_MENU_INDEX]['items'][SELECTED_CAT_INDEX]['itemTitle']);

		str = "";
		var img = DATA_OBJ[SELECTED_MENU_INDEX]['items'][SELECTED_CAT_INDEX]['itemInnerImage'];
		var description = DATA_OBJ[SELECTED_MENU_INDEX]['items'][SELECTED_CAT_INDEX]['itemDescription'];

		str = '<div class="about-content-img">' +
			'<img src="' + img + '">' +
			'</div>';

		str += '<div class="about-scroll">' +
			'<div class="about-text item" id="aboutDescText" tabindex="1" data-sn-up="null" data-sn-down="null" data-sn-right="null">' + description + '</div>' +
			'</div>';

		$(".about-desc").html(str);
		addEventListeners();
	}
	catch (e) {
		console.log("About content has error : " + e);
	}
}

// Open error popup when error will occur during video playing.
function retry_error_popup() {
	var onlineStatus = navigator.onLine;

	if (onlineStatus) msg = "The content is currently unavailable. Please check back later.";
	else msg = NET_CONNECTION_ERR;

	if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
		hide_show_modal(true, 'RETRY_CANCEL', msg);
	}
}

function show_hide_video_container() {
	$("#video_container").show().addClass('active');
	$(".menu_container").hide().removeClass('active');
}