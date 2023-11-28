function parse_main_feed() {
    $("#home_spinner").show();
    $(".main_conatiner").hide();
    $(".home_conatiner").hide();
    console.log("parse_main_feed");
    authToken();
}

function api_ping_timer() {
    if (PING_TIMER) {
        clearTimeout(PING_TIMER); //cancel the previous PING_TIMER.
        PING_TIMER = null;
    }

    PING_TIMER = setTimeout(function () {
        console.log("status ping call");
        userStatusPing();
    }, 120000);
}

function spatial_navigation_program() {
    console.log("spatial_navigation_program");

    manage_spatial_navigation("menu_container") // For left sidebar 

    manage_spatial_navigation("account_container"); //For account page

    manage_spatial_navigation("country_genre_container") // for sorting on setting page

    manage_spatial_navigation("alpha_numeric_container") // for sorting on setting page

    manage_spatial_navigation("country_choice_container") //For selection of countreis on setting page

    manage_spatial_navigation("EXIT") // For exit modal

    manage_spatial_navigation("MANAGE_POPUP") // For MANAGE_POPUP

    manage_spatial_navigation("LOGOUT") // For logout modal

    manage_spatial_navigation("episode_container"); //For episode list

    manage_spatial_navigation("search_container"); //For search input

    manage_spatial_navigation("tv_channel_search_result"); //For tv channel search result

    manage_spatial_navigation("video_search_result"); //For video search result

    manage_spatial_navigation("favorite_container"); //For favorite channel list 

    manage_spatial_navigation("first_country_container"); //For first country list   

    manage_spatial_navigation("second_country_container"); //For second country list   

    manage_spatial_navigation("third_country_container"); //For third country list  

    manage_spatial_navigation("channel_number_container"); //For channel number input

    manage_spatial_navigation("exit_container_box"); //For exit container

}

function set_unset_setting_screen_selection() {
    if (localStorage.getItem("pupilhd_app_country_choice")) {
        COUNTRY_CHOICE = JSON.parse(localStorage.getItem("pupilhd_app_country_choice"));
    }

    if (localStorage.getItem("pupilhd_app_country_genre"))
        SELECTED_COUNTRY_GENRE = localStorage.getItem("pupilhd_app_country_genre");

    if (localStorage.getItem("pupilhd_app_alpha_numeric"))
        ALPHA_NUMERIC = localStorage.getItem("pupilhd_app_alpha_numeric");


    $(".selected_type").removeClass("selected_type");
    $("#genre").find("img").attr("src", "images/genre.png");
    $("#country").find("img").attr("src", "images/countries.png");
    if (SELECTED_COUNTRY_GENRE == "GENRE") {
        $("#genre").addClass("selected_type");
        $("#genre").find("img").attr("src", "images/genre-hover.png");
        $("#genre").attr("data-sn-down", "null");
        $("#country").attr("data-sn-down", "null");
    }
    else if (SELECTED_COUNTRY_GENRE == "COUNTRY") {
        $("#country").addClass("selected_type");
        $("#country").find("img").attr("src", "images/countries-hover.png");
        $("#genre").attr("data-sn-down", "#first_country");
        $("#country").attr("data-sn-down", "#first_country");
    }

    $(".selected_sorting").removeClass("selected_sorting");
    $("#alphabet").find("img").attr("src", "images/alphabetically.png");
    $("#number").find("img").attr("src", "images/numerically.png");
    if (ALPHA_NUMERIC == "ALPHA") {
        $("#alphabet").addClass("selected_sorting");
        $("#alphabet").find("img").attr("src", "images/alphabetically-hover.png");
    }
    else if (ALPHA_NUMERIC == "NUMERIC") {
        $("#number").addClass("selected_sorting");
        $("#number").find("img").attr("src", "images/numerically-hover.png");
    }

}

function show_left_sidebar() {
    console.log("show_left_sidebar");
    $('.menu_container').toggleClass('toggle_menu');
    SN.focus("left_sidebar");
}

function reset_search_result_container() {
    $(".search_result_container").hide();
    $("#channel_search_details").hide();
    $("#video_search_details").hide();
    $("#channel_result").html("");
    $("#video_result").html("");
    $("#channel_result_heading").html("");
    $("#video_result_heading").html("");
}

function hide_left_sidebar() {
    console.log("hide_left_sidebar");
    if ($(".menu_container").is(":visible")) {
        $('.menu_container').addClass('toggle_menu');

        if ($(".home_container").is(":visible") && $(".home_container").hasClass("active")) SN.focus("#" + FIRST_PAGE_FOCUSED_ITEM);
        else if ($(".video_library_container").is(":visible") && $(".video_library_container").hasClass("active")) SN.focus("#" + SECOND_PAGE_FOCUSED_ITEM);
        else if ($(".search_container").is(":visible") && $(".search_container").hasClass("active")) SN.focus("searchBox");
        else if ($(".account_container").is(":visible") && $(".account_container").hasClass("active")) SN.focus("account_btns");
        else if ($(".setting_container").is(":visible") && $(".setting_container").hasClass("active")) SN.focus("alpha_numeric");
    }
}

function set_selected_menu() {
    console.log("set_selected_menu");
    $("ul#left_sidebar li").removeClass("selected_menu_text");

    if (PAGE_INDEX == 0) $("#tv_channel").addClass("selected_menu_text");
    else if (PAGE_INDEX == 1 || PAGE_INDEX == 2) $("#video_library").addClass("selected_menu_text");
    else if (PAGE_INDEX == 3) $("#search").addClass("selected_menu_text");
    else if (PAGE_INDEX == 4) $("#account").addClass("selected_menu_text");
    else if (PAGE_INDEX == 5) $("#setting").addClass("selected_menu_text");

    var id = $(".selected_menu_text").attr("id");
    change_sidebar_focus_image(id);
}

function set_page_index() {
    if ($(".home_container").is(":visible") && $(".home_container").hasClass("active")) MENU_INDEX = TAB_INDEX = PAGE_INDEX = 0;
    else if ($(".video_library_container").is(":visible") && $(".video_library_container").hasClass("active")) MENU_INDEX = TAB_INDEX = PAGE_INDEX = 1;
    else if ($(".video_library_container").hasClass("active") && $(".episode_container").is(":visible")) MENU_INDEX = TAB_INDEX = PAGE_INDEX = 2;
    else if ($(".search_container").is(":visible") && $(".search_container").hasClass("active")) MENU_INDEX = TAB_INDEX = PAGE_INDEX = 3;
    else if ($(".account_container").is(":visible") && $(".account_container").hasClass("active")) MENU_INDEX = TAB_INDEX = PAGE_INDEX = 4;
    else if ($(".setting_container").is(":visible") && $(".setting_container").hasClass("active")) MENU_INDEX = TAB_INDEX = PAGE_INDEX = 5;
}

function signOutApp() {
    console.log('sign out app');
    localStorage.setItem('pupilhd_app_user_name', '');
    localStorage.setItem('pupilhd_app_password', '');
    localStorage.setItem('pupilhd_app_service_name', '');
    localStorage.setItem('pupilhd_app_expiry_date', '');
    localStorage.setItem('pupilhd_app_mac_address', '');
    localStorage.setItem('pupilhd_app_client_id', '');
    localStorage.setItem('pupilhd_app_ip_address', '');
    localStorage.setItem('pupilhd_app_stalker_login', '');
    localStorage.setItem('pupilhd_app_stalker_password', '');
    $(".home_container, .account_container, .setting_container, .search_container, .video_library_container").removeClass("active").hide();
    window.location.href = "login.html";
}

function change_sorting_icon_image(id, index) {
    console.log("change_sorting_icon_image");
    if (index == 0) {
        $("#alphabet").find("img").attr("src", "images/alphabetically.png");
        $("#number").find("img").attr("src", "images/numerically.png");

        if (id == 'alphabet') $("#" + id).find("img").attr("src", "images/alphabetically-hover.png");
        else $("#alphabet").find("img").attr("src", "images/alphabetically.png");

        if (id == 'number') $("#" + id).find("img").attr("src", "images/numerically-hover.png");
        else $("#number").find("img").attr("src", "images/numerically.png");
    } else if (index == 1) {
        $("#genre").find("img").attr("src", "images/genre.png");
        $("#country").find("img").attr("src", "images/countries.png");

        if (id == 'genre') $("#" + id).find("img").attr("src", "images/genre-hover.png");
        else $("#genre").find("img").attr("src", "images/genre.png");

        if (id == 'country') $("#" + id).find("img").attr("src", "images/countries-hover.png");
        else $("#country").find("img").attr("src", "images/countries.png");
    }
}

function change_sorting_selection(id, index) {
    console.log("change_sorting_selection");
    if (index == 0) {
        $("#" + id).parent().find("div.selected_sorting").removeClass("selected_sorting");
        if (id) $("#" + id).addClass("selected_sorting");
    } else if (index == 1) {
        $("#" + id).parent().find("div.selected_type").removeClass("selected_type");
        if (id) $("#" + id).addClass("selected_type");
    }

}

function change_sidebar_focus_image(id) {
    console.log("change_sidebar_focus_image");
    if (id == 'tv_channel') $("#" + id).find("img").attr("src", "images/tv-channel-hover.png");
    else $("#tv_channel").find("img").attr("src", "images/tv-channel.png");

    if (id == 'video_library') $("#" + id).find("img").attr("src", "images/video-library-hover.png");
    else $("#video_library").find("img").attr("src", "images/video-library.png");

    if (id == 'search') $("#" + id).find("img").attr("src", "images/search-hover.png");
    else $("#search").find("img").attr("src", "images/search.png");

    if (id == 'account') $("#" + id).find("img").attr("src", "images/account-hover.png");
    else $("#account").find("img").attr("src", "images/account.png");

    if (id == 'setting') $("#" + id).find("img").attr("src", "images/setting-hover.png");
    else $("#setting").find("img").attr("src", "images/setting.png");

    if (id == 'exit') $("#" + id).find("img").attr("src", "images/exit-hover.png");
    else $("#exit").find("img").attr("src", "images/exit.png");

    $(".selected_menu_text").removeClass("selected_menu_text");
    $("#" + id).addClass("selected_menu_text");
}

function isVisible(elem) {
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    var elemCenter = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    var pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}

function set_first_last_unfocusable_list(parentId, countryIndex) {
    console.log("set_first_last_unfocusable_list");
    var elmList = document.querySelectorAll('#' + parentId + ' li');
    var left = right = -1;
    for (var i = 0; i < elmList.length; i++) {
        var elm = elmList[i];
        if (left !== -1 && !isVisible(elm)) {
            right = i - 1;
            break;
        }
        if (left === -1 && isVisible(elm)) {
            left = i;
        }
        if (i === elmList.length - 1) {
            right = i;
        }
    }

    left = left - 1;
    right = right + 1
    var totalVisibleList = right - left;
    var flagImage = 'images/default.png';

    if ((left + 1 > -1) && (left + 1 >= 1)) {
        if (APP_CHANNEL_DATA_ARRAY[countryIndex][left]['logo']) flagImage = APP_IMAGE_URL + APP_CHANNEL_DATA_ARRAY[countryIndex][left]['logo'];
        else flagImage = 'images/default.png';

        $("#left_half_side_" + countryIndex).show();
        $("#left_half_img_" + countryIndex).attr("src", flagImage);
        $("#left_half_img_" + countryIndex).attr("alt", APP_CHANNEL_DATA_ARRAY[countryIndex][left]['name']);
        $("#left_half_name_" + countryIndex).text(APP_CHANNEL_DATA_ARRAY[countryIndex][left]['name']);
    }
    else {
        $("#left_half_side_" + countryIndex).hide();
    }

    if (right < elmList.length) {
        if (APP_CHANNEL_DATA_ARRAY[countryIndex][right]['logo']) flagImage = APP_IMAGE_URL + APP_CHANNEL_DATA_ARRAY[countryIndex][right]['logo'];
        else flagImage = 'images/default.png';

        $("#right_half_side_" + countryIndex).show();
        $("#right_half_img_" + countryIndex).attr("src", flagImage);
        $("#right_half_img_" + countryIndex).attr("alt", APP_CHANNEL_DATA_ARRAY[countryIndex][right]['name']);
        $("#right_half_name_" + countryIndex).text(APP_CHANNEL_DATA_ARRAY[countryIndex][right]['name']);
    }
    else {
        $("#right_half_side_" + countryIndex).hide();
    }
}

function call_genre_order_channel_list() {
    try {
        console.log("call_genre_order_channel_list");
        if ((ROW_INDEX < _.size(APP_GENRE_COUNTRY_LIST) - 1) && (APP_GENRE_COUNTRY_LIST[ROW_INDEX] != undefined)) {
            ROW_INDEX++;
            getGenreOrderItemList(APP_GENRE_COUNTRY_LIST[ROW_INDEX].id);
        }
    } catch (e) {
        console.log("genre 4" + e);
    }
}

function call_home_channel_list() {
    console.log("call_home_channel_list");
    if ((ROW_INDEX < _.size(APP_GENRE_COUNTRY_LIST) - 1) && (APP_GENRE_COUNTRY_LIST[ROW_INDEX] != undefined)) {
        ROW_INDEX++;
        getHomeChannelList(APP_GENRE_COUNTRY_LIST[ROW_INDEX].id);
    }
}

function append_channel_list(country, index) {
    console.log("append_channel_list");
    if (country == '' || index == '') return false;
    var totalItems = _.size(APP_CHANNEL_DATA_ARRAY[country]);

    var rowIndex = $("#" + country).parent().find("ul").attr("data-id");

    var tabindex = $("#" + country).parent().find("li").attr("tabindex");

    if (index < totalItems) {
        var str = '';
        for (var i = index + 1; i < totalItems; i++) {
            focusName = 'row_item_' + rowIndex + '_' + i;
            var flagImage = 'images/default.png';
            if (APP_CHANNEL_DATA_ARRAY[country][i]['logo'] != '') flagImage = APP_IMAGE_URL + APP_CHANNEL_DATA_ARRAY[country][i]['logo'];

            upFocus = " data-sn-up='null'";
            downFocus = " data-sn-down='null'";

            if (i == (totalItems - 1)) rigthFocus = " data-sn-right='null'";
            else rigthFocus = " data-sn-right='#row_item_" + rowIndex + '_' + (i + 1) + "'";

            if (i > 0) leftFocus = " data-sn-left='#row_item_" + rowIndex + '_' + (i - 1) + "'";
            else leftFocus = "data-sn-left='#tv_channel'";
            dataId = ' data-channel="' + APP_CHANNEL_DATA_ARRAY[country][i]["number"] + '" ';

            str += '<li class="focusable" tabindex="' + tabindex + '" id="' + focusName + '" ' + rigthFocus + leftFocus + upFocus + downFocus + dataId + '>';
            str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + APP_CHANNEL_DATA_ARRAY[country][i]['name'] + '"></div><div class="channel">' + APP_CHANNEL_DATA_ARRAY[country][i]['name'] + '</div></div>';
            str += '</li>';
        }
        $("#channel_list_" + rowIndex).append(str);
    }
}


function reset_channel_list(country) {
    console.log("reset_channel_list");
    var check = false;
    if (country) {
        var tempArray = [],
            j = 0;
        for (var i = 0; i < _.size(APP_GENRE_COUNTRY_LIST); i++) {
            if (country != APP_GENRE_COUNTRY_LIST[i]['id']) {
                tempArray[j] = APP_GENRE_COUNTRY_LIST[i];
                j++;
            }
        }
        APP_GENRE_COUNTRY_LIST = tempArray;
    }

    setTimeout(function () {
        var diffNum = TOTAL_COUNTRY - _.size(APP_GENRE_COUNTRY_LIST);
        var num = _.size(APP_GENRE_COUNTRY_LIST);
        if (diffNum > 0) {
            for (var k = 0; k < diffNum; k++) {
                $("#channel_item_list_" + num).remove();
                num++;
            }
        }
        str = '';
        if (ROW_INDEX > 0) ROW_INDEX = ROW_INDEX;
        else ROW_INDEX = 0;
        for (i = ROW_INDEX; i < _.size(APP_GENRE_COUNTRY_LIST); i++) {
            $("#channel_item_list_" + i).remove();
            if (APP_GENRE_COUNTRY_LIST[i]) {
                var country = APP_GENRE_COUNTRY_LIST[i]['id'];

                str += '<div class="channel_item_list" id="channel_item_list_' + i + '" >';
                str += '<h1 class="channel_heading" id="' + country + '"></h1>';
                str += '<div class="left_half_box" id="left_half_side_' + country + '"><div class="channel_logo_box"><img src="images/default.png" id="left_half_img_' + country + '" alt="Default"></div><div class="channel" id="left_half_name_' + country + '"> AL Rai</div></div> ';
                str += '<div class="category_box">';
                str += '<ul class="channel_thumbnail_box" id="channel_list_' + i + '" data-name="' + country + '" data-id="' + i + '">';
                str += '</ul>';
                str += '</div>';
                str += '<div class="right_half_box" id="right_half_side_' + country + '"><div class="channel_logo_box"><img src="images/default.png" id="right_half_img_' + country + '" alt=""></div><div class="channel" id="right_half_name_' + country + '"></div></div>';
                str += '</div>';
            }
        }
        $("#channel_list").append(str);
        if (ROW_INDEX < _.size(APP_GENRE_COUNTRY_LIST)) {
            if (SELECTED_COUNTRY_GENRE == "COUNTRY") {
                APP_COUNTRY_ARRAY = JSON.parse(JSON.stringify(APP_GENRE_COUNTRY_LIST));
                APP_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_GENRE_COUNTRY_LIST));
                getHomeChannelList(APP_GENRE_COUNTRY_LIST[ROW_INDEX].id);
            } else if (SELECTED_COUNTRY_GENRE == "GENRE") {
                APP_GENRE_LIST = JSON.parse(JSON.stringify(APP_GENRE_COUNTRY_LIST));
                getGenreOrderItemList(APP_GENRE_COUNTRY_LIST[ROW_INDEX].id);
            }
        } else if (ROW_INDEX == _.size(APP_GENRE_COUNTRY_LIST)) {
            if (SELECTED_COUNTRY_GENRE == "COUNTRY") {
                APP_COUNTRY_ARRAY = JSON.parse(JSON.stringify(APP_GENRE_COUNTRY_LIST));
                APP_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_GENRE_COUNTRY_LIST));
            }
            set_channel_list_focus(0);
            $(".main_container").show();
            $("#home_spinner").hide();
            $(".home_container").addClass("active").show();
            checkVideoURL();
            if (_.size(FAVORITE_LIST) > 0) {
                SELECTED_CHANNEL_TYPE = "FAV";
                FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = "fav_channel_0_0";
                $("#fav_channel_0_0").addClass("selected_channel");
                SN.focus("favorite_list");
            } else {
                SELECTED_CHANNEL_TYPE = "CHA";
                FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = "row_item_0_0";
                $("#row_item_0_0").addClass("selected_channel");
                SN.focus("channel_list_0");
            }
        }

    }, 400);


}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


function reset_video_list(category, index) {
    console.log("reset_video_list");
    $("#" + category).remove();
    if (category) {
        APP_VIDEO_CATEGORY = APP_VIDEO_CATEGORY.filter(function (item) {
            return item !== category;
        });
    }
    if ((index == _.size(APP_VIDEO_CATEGORY) - 1)) {
        $("#" + category).remove();
        APP_VIDEO_CATEGORY.splice(category, 1);
        return;
    }

    APP_VIDEO_CATEGORY.splice(category, 1);
    for (i = index; i < _.size(APP_VIDEO_CATEGORY); i++) {
        $("#" + APP_VIDEO_CATEGORY[i]["id"]).remove();
        str = '';
        if (APP_VIDEO_CATEGORY[i]) {
            str += '<div class="video_list_box" id="' + APP_VIDEO_CATEGORY[i]["id"] + '" data-category="' + APP_VIDEO_CATEGORY[i]["id"] + '" >';
            str += '<div class="half_video_left_side" ></div><h1 class="video_list_heading">' + APP_VIDEO_CATEGORY[i]["title"] + '</h1>';
            str += '<div class="video_category_box"><ul class="video_liberary_thumbnail_box" id="video_list_' + (i + 1) + '" data-id="' + (i + 1) + '" data-name="' + APP_VIDEO_CATEGORY[i]["id"] + '"></ul></div >';
            str += '<div class="half_video_right_side"></div></div >';

            $("#video_list").append(str);
        }
    }

    if (index < _.size(APP_VIDEO_CATEGORY)) get_video_list_by_category(APP_VIDEO_CATEGORY[index]['id'], index);
}

function show_hide_screens(className) {
    $(".home_container, .setting_container, .account_container, .search_container, .video_library_container, .episode_container, .exit_container").removeClass("active").hide();
    if (className != '') $("." + className).addClass("active").show();
    else $("#home_spinner").show();
}

function request_search_results() {
    console.log('search results request...');
    searchText = get_searched_text();
    $("#searchResultBox").html("");
    $('#searchInputText').blur();
    if (searchText != "") {
        reset_search_result_container();
        $("#search_loader").show();
        get_searched_channel();
    } else {
        console.log('input text enter');
        $(".result_not_found").text("Please enter text.");
        $('#searchInputText').val("");
        SN.focus('searchBox');
    }
}

function get_searched_text() {
    return $.trim($('#searchInputText').val());
}

function playDefaultSearchChannel(id) {
    var i = 0;
    if (id) {
        $(".selected_searched_item").removeClass("selected_searched_item");
        $("#" + id).addClass("selected_searched_item");
        $("#channel_result_name").text(SEARCHED_TV_CHANNELS_LIST[i]["number"] + ". " + SEARCHED_TV_CHANNELS_LIST[i]["name"]);
        $("#channel_result_country").text(SEARCHED_TV_CHANNELS_LIST[i]["country_id"]);
        $("#channel_result_lang").text(SEARCHED_TV_CHANNELS_LIST[i]["language_id"]);

        if (SEARCHED_TV_CHANNELS_LIST[i]["hd"]) $("#channel_result_hd").css("display", "inline-block");
        else $("#channel_result_hd").css("display", "none");
        if (SEARCHED_TV_CHANNELS_LIST[i]["favorite"]) $("#channel_result_fav").css("display", "inline-block");
        else $("#channel_result_fav").css("display", "none");
        $("#video_searched_series").css("display", "none");

        $("#video_search_details").hide();
        $("#channel_search_details").show();
        $("#" + id).addClass("selected_searched_item");

        $("div#searchpage_player").empty();
        $("div#searchpage_player").load("preview-video-player.html");

        VIDEO_PLAYER.pause();
        VOD_URL = SEARCHED_TV_CHANNELS_LIST[i]["url"];
        checkVideoURL();
    }
}

function playDefaultSearchVideo(id) {
    var i = 0;
    if (id) {
        $(".selected_searched_item").removeClass("selected_searched_item");
        $("#" + id).addClass("selected_searched_item");

        $("#video_result_name").text(SEARCHED_VIDEO_LIST[i]["name"]);

        $("#video_result_year").text(SEARCHED_VIDEO_LIST[i]["year"]);
        $("#video_result_country").text(SEARCHED_VIDEO_LIST[i]["country"]);
        $("#video_result_genre").text(SEARCHED_VIDEO_LIST[i]["genres"]);
        $("#video_result_time").text(SEARCHED_VIDEO_LIST[i]["time"] + "m");
        $("#video_result_rating").text(SEARCHED_VIDEO_LIST[i]["rating_mpaa"]);
        $("#video_result_director").text(SEARCHED_VIDEO_LIST[i]["director"]);

        if (SEARCHED_VIDEO_LIST[i]["hd"]) $("#video_result_quality").css("display", "inline-block");
        else $("#video_result_quality").css("display", "none");
        if (SEARCHED_VIDEO_LIST[i]["favorite"]) $("#channel_result_fav").css("display", "inline-block");
        else $("#channel_result_fav").css("display", "none");
        $("#selected_channel_series").css("display", "none");

        $("#" + id).addClass("selected_searched_item");
        $("div#searchpage_player").empty();
        $("div#searchpage_player").html('<img src="' + APP_IMAGE_URL + SEARCHED_VIDEO_LIST[i]["poster"] + '" alt="' + SEARCHED_VIDEO_LIST[i]["name"] + '"/>');

        if ($("#" + id).hasClass("selected_searched_item")) {
            if (TIMER) {
                clearTimeout(TIMER); //cancel the previous TIMER.
                TIMER = null;
            }
            if (SEARCHED_VIDEO_LIST[i]["promo_url"]) {
                TIMER = setTimeout(function () {
                    $("div#searchpage_player").empty();
                    $("div#searchpage_player").load("preview-video-player.html");
                    VIDEO_PLAYER.pause();
                    VOD_URL = SEARCHED_VIDEO_LIST[i]["promo_url"];
                    load_preview_player();
                }, 4000);
            }
        }
        $("#channel_search_details").hide();
        $("#video_search_details").show();
    }
}


function reset_preview_player(flag) {
    VIDEO_PLAYER.pause();
    VIDEO_PLAYER.remove();
    VOD_URL = "";
    $("div#preview-player").empty();
    $("div#video-preview-player").empty();
    $("div#searchpage_player").empty();

    if (flag) {
        if (PAGE_INDEX == 0) $("div#preview-player").load("preview-video-player.html");
        else if (PAGE_INDEX == 1) $("div#video-preview-player").load("preview-video-player.html");
        else if (PAGE_INDEX == 3) $("div#searchpage_player").load("preview-video-player.html");
    }
}

function clockTime() {
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var session = " AM";

    if (hh == 12) {
        hh = 12;
        session = " PM";
    }

    if (hh > 12) {
        hh = hh - 12;
        session = " PM";
    }

    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    ss = (ss < 10) ? "0" + ss : ss;
    var time = hh + ":" + mm + session;

    var lblTime = document.getElementById("clock_time");
    lblTime.innerHTML = '<span>' + time + '</span>';
}

function show_hide_show_deatils(flag) {
    var str = '';
    if (flag && (PAGE_INDEX == 1 || PAGE_INDEX == 2) && !PREVIEW_PLAYER) {
        str += '<h1 class="about_video_heading">' + SELECTED_VIDEO_DATA["name"] + '</h1>';
        str += '<div class="about_video_meta">';
        str += '<span>' + SELECTED_VIDEO_DATA["year"] + '</span><span>' + SELECTED_VIDEO_DATA["country"] + '</span><span>' + SELECTED_VIDEO_DATA["genres"] + '</span>';
        if (_.size(SELECTED_VIDEO_DATA["series"]) == 0) '<span>' + SELECTED_VIDEO_DATA['time'] + 'm' + '</span>';
        if (SELECTED_VIDEO_DATA['rating_mpaa']) str += '<span>' + SELECTED_VIDEO_DATA['rating_mpaa'] + '</span>';
        if (SELECTED_VIDEO_DATA['hd']) str += '<img src="images/hd.png" alt="hd" id="selected_video_quality" class="video_hd" style="display: inline-block;">';
        // if (SELECTED_VIDEO_DATA['favorite'] != 0) str += '<img src="images/fav.png" alt="fav" id="selected_video_fav" class="video_fav">';
        str += '</div>';
        if (_.size(SELECTED_VIDEO_DATA["series"]) > 0) {
            str += '<div class="video_number">Playing Now Episode ' + SELECTED_EPIOSDE_NUMBER + ' of ' + _.size(SELECTED_VIDEO_DATA["series"]) + '</div>';
        }
        $("#video_player_about_video").empty();
        $("#video_player_about_video").html(str);
        $("#video_player_about_video").show();
    } else {
        $("#video_player_about_video").hide();
    }
}

function reset_home_channel_list() {
    console.log("reset_home_channel_list");

    if (COUNTRY_GENRE == "COUNTRY" && ALPHA_NUMERIC == "NUMERIC") console.log("default");
    else if (COUNTRY_GENRE == "COUNTRY" && ALPHA_NUMERIC == "ALPHA") {
        console.log("alphabatical channel");
    } else if (COUNTRY_GENRE == "GENRE" && ALPHA_NUMERIC == "NUMERIC") console.log("default");
    else if (COUNTRY_GENRE == "GENRE" && ALPHA_NUMERIC == "ALPHA") console.log("default");


}

function set_info_bar() {
    console.log("set_info_bar");
    $("#player_fav").attr("data-id", APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]["id"]);
    $("#player_channel_name").text(APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['number'] + ". " + APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['name']);
    get_player_channel_epg(APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]["id"]);

    $('.selected_channel').removeClass('selected_channel');
    $("#" + FIRST_PAGE_SELECTED_ITEM).addClass("selected_channel");
    $("#selected_channel_name").text(APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['number'] + ". " + APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['name']);
    $("#selected_channel_country").text(APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['country_id']);
    $("#selected_channel_language").text(APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['language_id']);
    $("#channel_logo_expend").html('<img src="' + APP_IMAGE_URL + APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['logo'] + '" alt="' + APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]["name"] + '">');
    get_channel_epg(APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['id']);

    if (APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['favorite']) $(".fav").css("display", "inline-block");
    else $(".fav").hide();

    if (APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['hd'] != 0) $(".hd").css("display", "inline-block");
    else $(".hd").hide();
}

function reset_global_variable() {
    console.log("reset global variable");
    COUNTRY_GENRE = SELECTED_COUNTRY_GENRE;
    ROW_INDEX = 0;
    NAVIGATION_INDEX = 30;
    SELECTED_CHANNEL_INDEX = '';
    SELECTED_CAT_INDEX = '';
}

function reset_favorite_channel_list() {
    APP_CHANNEL_DATA_ARRAY["favorite"] = [];
    getFavoriteChannelList();
}

function set_country_list(index) {
    console.log("set_country_list");
    var initialUpFocus = 'null',
        row = '';
    if (index == 18) {
        row = 1;
        $("#first_country_list").empty();
    } else if (index == 19) {
        row = 2;
        $("#second_country_list").empty();
    } else if (index == 20) {
        row = 3;
        $("#third_country_list").empty();
    }

    var j = 0,
        str = '',
        countryName = '',
        id = '',
        leftFocus = 'data-sn-left= "null"',
        rightFocus = 'data-sn-right="null"',
        upFocus = '',
        downFocus = '';

    for (var i = 0; i <= _.size(APP_COUNTRY_ARRAY); i++) {

        id = ' id = "country_number_' + row + '_' + j + '" ';
        if (i == 0) upFocus = ' data-sn-up="' + initialUpFocus + '" ';
        else upFocus = ' data-sn-up="#country_number_' + row + '_' + (j - 1) + ' "';

        if (i == (_.size(APP_COUNTRY_ARRAY))) downFocus = ' data-sn-down="null" ';
        else downFocus = ' data-sn-down="#country_number_' + row + '_' + (j + 1) + ' "';

        if (i == 0) {
            countryName = 'None';
            countryVal = 'NULL';
        }
        else countryName = countryVal = APP_COUNTRY_ARRAY[i - 1]["id"];

        if (_.size(COUNTRY_CHOICE) > 0) {
            if (COUNTRY_CHOICE.indexOf(countryName) < 0) {
                str += '<li class="focusable" tabindex="' + index + '"' + id + upFocus + downFocus + leftFocus + rightFocus + '  data-name="' + countryVal + '"> ' + countryName + '</li>';
                j++;
            }
        } else {
            str += '<li class="focusable" tabindex="' + index + '"' + id + upFocus + downFocus + leftFocus + rightFocus + '  data-name="' + countryVal + '"> ' + countryName + '</li>';
            j++;
        }

    }

    if (index == 18) {
        $("#first_country_list").html(str);
        $("#first_country_list").show();
        SN.focus("first_country_list")
    } else if (index == 19) {
        $("#second_country_list").html(str);
        $("#second_country_list").show();
        SN.focus("second_country_list");
    } else if (index == 20) {
        $("#third_country_list").html(str);
        $("#third_country_list").show();
        SN.focus("third_country_list");
    }
}


function reset_country_list(old_index, new_index) {
    console.log("reset_country_list");
    while (old_index < 0) {
        old_index += _.size(APP_COUNTRY_LIST);
    }
    while (new_index < 0) {
        new_index += _.size(APP_COUNTRY_LIST);
    }
    if (new_index >= _.size(APP_COUNTRY_LIST)) {
        var k = new_index - (_.size(APP_COUNTRY_LIST) + 1);
        while (k--) {
            APP_COUNTRY_LIST.push(undefined);
        }
    }
    APP_COUNTRY_LIST.splice(new_index, 0, APP_COUNTRY_LIST.splice(old_index, 1)[0]);
}

function reset_home_page_list() {
    console.log("reset_home_page_list");
    if (_.size(APP_GENRE_COUNTRY_LIST) > 0) {

        for (var i = 0; i < _.size(APP_GENRE_COUNTRY_LIST); i++) {
            var str = '';
            var country = APP_GENRE_COUNTRY_LIST[i]['id'];

            str += '<div class="channel_item_list" id="channel_item_list_' + i + '" >';
            str += '<h1 class="channel_heading" id="' + country + '"></h1>';
            str += '<div class="left_half_box" id="left_half_side_' + country + '"><div class="channel_logo_box"><img src="images/default.png" id="left_half_img_' + country + '" alt="Default"></div><div class="channel" id="left_half_name_' + country + '"> AL Rai</div></div> ';
            str += '<div class="category_box">';
            str += '<ul class="channel_thumbnail_box" id="channel_list_' + i + '" data-name="' + country + '" data-id="' + i + '">';
            str += '</ul>';
            str += '</div>';
            str += '<div class="right_half_box" id="right_half_side_' + country + '"><div class="channel_logo_box"><img src="images/default.png" id="right_half_img_' + country + '" alt=""></div><div class="channel" id="right_half_name_' + country + '"></div></div>';
            str += '</div>';

            if (i == 0) {
                $("#channel_list").html('');
                $("#channel_list").html(str);
                if (SELECTED_COUNTRY_GENRE == "COUNTRY") getHomeChannelList(APP_GENRE_COUNTRY_LIST[i].id);
                else if (SELECTED_COUNTRY_GENRE == "GENRE") getGenreOrderItemList(APP_GENRE_COUNTRY_LIST[i].id);
            } else $("#channel_list").append(str);
        }

    } else {
        console.log("Data not found.");
    }
}


function sort_channel_list_1() {
    if (ALPHA_NUMERIC == "ALPHA") {
        console.log("alphabetical");
        var i = 0;
        for (var i = 0; i < $("[id^=channel_list_]").length; i++) {
            var sorted = $.makeArray($('#channel_list_' + i + '>li')).sort(function (a, b) {
                return ($(a).children('div').find(".channel").text() < $(b).children('div').find(".channel").text()) ? -1 : 1;
            });
            $('#channel_list_' + i).html(sorted);

            $('#channel_list_' + i + ' li').each(function (j) {
                if (j == 0) $(this).attr('data-sn-left', "#tv_channel");
                else $(this).attr('data-sn-left', "#row_item_" + i + "_" + (j - 1));

                if (j == $('#channel_list_' + i + ' li').length - 1) $(this).attr('data-sn-right', "null");
                else $(this).attr("data-sn-right", "#row_item_" + i + "_" + (j + 1));

                $(this).attr('id', "row_item_" + i + "_" + j);
            });
        }
    } else if (ALPHA_NUMERIC == "NUMERIC") {
        console.log("numeric");
    }
}

function set_homepage_favorite_channel() {
    console.log("set_homepage_favorite_channel");
    if (_.size(APP_CHANNEL_DATA_ARRAY["favorite"]) > 0) {
        $("#favorite_list").empty();
        var data = APP_CHANNEL_DATA_ARRAY["favorite"];

        var id = "",
            rigthFocus = "",
            leftFocus = "",
            upFocus = "",
            downFocus = "",
            str = "";

        for (var i = 0; i < _.size(data); i++) {
            str = '';
            id = 'fav_channel_' + 0 + '_' + i;
            if (i == 0) {
                $("#selected_channel_name").text(data[i]['number'] + ". " + data[i]['name']);
                $("#selected_channel_country").text(data[i]['country_id']);
                $("#selected_channel_language").text(data[i]['language_id']);

                if (data[i]['favorite']) $(".fav").show();
                else $(".fav").hide();

                if (data[i]['hd'] != 0) $(".hd").show();
                else $(".hd").hide();

                VOD_URL = data[i]['url'];
                get_channel_epg(data[i]['id']);
                load_preview_player();
                // checkVideoURL();
            }
            var flagImage = 'images/default.png';
            if (data[i]['logo']) flagImage = APP_IMAGE_URL + data[i]['logo'];

            upFocus = " data-sn-up='null'";
            downFocus = " data-sn-down='null'";

            if (i == _.size(data)) rigthFocus = " data-sn-right='null'";
            else rigthFocus = " data-sn-right='#fav_channel_" + 0 + '_' + (i + 1) + "'";

            if (i == 0) leftFocus = "data-sn-left='#tv_channel'";
            else leftFocus = " data-sn-left='#fav_channel_" + 0 + '_' + (i - 1) + "'";

            if (i == 0) {
                str += '<div class="channel_item_list" id="favorite_item_list_' + i + '" >';
                str += '<h1 class="channel_heading" id="favorite">My Favorite</h1>';
                str += '<div class="left_half_box" id="left_half_side_favorite"><div class="channel_logo_box"><img src="images/default.png" id="left_half_img_favorite" alt="Default"></div><div class="channel" id="left_half_name_favorite">Favorite</div></div> ';
                str += '<div class="category_box">';
                str += '<ul class="channel_thumbnail_box" id="favorite_list_' + i + '" data-name="favorite" data-id="' + i + '">';
                str += '<li class="focusable" tabindex="17" id="' + id + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' data-id="' + data[i]["id"] + '">';
                str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + data[i]['name'] + '"></div><div class="channel">' + data[i]['name'] + '</div></div>';
                str += '</li>';
                str += '</ul>';
                str += '</div>';
                str += '<div class="right_half_box" id="right_half_side_favorite"><div class="channel_logo_box"><img src="images/default.png" id="right_half_img_favorite" alt=""></div><div class="channel" id="right_half_name_favorite"></div></div>';
                str += '</div>';

                $("#favorite_list").append(str);

            } else {

                str += '<li class="focusable" tabindex="17" id="' + id + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' data-id="' + data[i]["id"] + '">';
                str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + data[i]['name'] + '"></div><div class="channel">' + data[i]['name'] + '</div></div>';
                str += '</li>';

                $("#favorite_list_0").append(str);
            }
        }

    } else {
        console.log("favorite data not found");
    }
}

function set_homepage_genre_country_channel() {
    console.log("set_homepage_genre_country_channel");

    var str = '';
    for (var i = 0; i < _.size(APP_GENRE_COUNTRY_LIST); i++) {
        var country = APP_GENRE_COUNTRY_LIST[i]['id'];

        str += '<div class="channel_item_list" id="channel_item_list_' + i + '" >';
        str += '<h1 class="channel_heading" id="' + country + '">' + country + '</h1>';
        str += '<div class="left_half_box" id="left_half_side_' + country + '"><div class="channel_logo_box"><img src="images/default.png" id="left_half_img_' + country + '" alt="Default"></div><div class="channel" id="left_half_name_' + country + '"> AL Rai</div></div> ';
        str += '<div class="category_box">';
        str += '<ul class="channel_thumbnail_box" id="channel_list_' + i + '" data-name="' + country + '" data-id="' + i + '">';
        str += '</ul>';
        str += '</div>';
        str += '<div class="right_half_box" id="right_half_side_' + country + '"><div class="channel_logo_box"><img src="images/default.png" id="right_half_img_' + country + '" alt=""></div><div class="channel" id="right_half_name_' + country + '"></div></div>';
        str += '</div>';
    }

    $("#channel_list").html('');
    $("#channel_list").html(str);

    set_custom_channel_list(0);
}


function set_custom_channel_list(index) {
    console.log("set_custom_channel_list");
    if (index >= _.size(APP_GENRE_COUNTRY_LIST)) return;
    if (index == 0) {
        var favoriteData = APP_CHANNEL_DATA_ARRAY["favorite"];
        APP_CHANNEL_DATA_ARRAY = {};

        if (SELECTED_COUNTRY_GENRE == "COUNTRY") APP_CHANNEL_DATA_ARRAY = COUNTRY_WISE_CHANNEL_DATA;
        else if (SELECTED_COUNTRY_GENRE == "GENRE") APP_CHANNEL_DATA_ARRAY = GENRE_WISE_CHANNEL_DATA;

        APP_CHANNEL_DATA_ARRAY["favorite"] = [];
        APP_CHANNEL_DATA_ARRAY["favorite"] = favoriteData;
        set_homepage_favorite_channel();
    }

    var country = APP_GENRE_COUNTRY_LIST[index]["id"];
    var focusName = "",
        rigthFocus = "",
        leftFocus = "",
        upFocus = "",
        downFocus = "",
        str = "",
        dataId = '';

    var data = APP_CHANNEL_DATA_ARRAY[country];
    $("#" + country).text(country + "(" + _.size(APP_CHANNEL_DATA_ARRAY[country]) + ")");
    var totalItems = _.size(APP_CHANNEL_DATA_ARRAY[country])
    for (var i = 0; i < totalItems; i++) {
        focusName = 'row_item_' + ROW_INDEX + '_' + i;

        if (i == 0 && ROW_INDEX == 0 && _.size(FAVORITE_LIST) < 1) {
            $("#selected_channel_name").text(data[i]['number'] + ". " + data[i]['name']);
            $("#selected_channel_country").text(data[i]['country_id']);
            $("#selected_channel_language").text(data[i]['language_id']);

            if (data[i]['favorite']) $(".fav").show();
            else $(".fav").hide();

            if (data[i]['hd'] != 0) $(".hd").show();
            else $(".hd").hide();

            if (_.size(FAVORITE_LIST) < 1) VOD_URL = data[i]['url'];
            get_channel_epg(data[i]['id']);
        }
        var flagImage = 'images/default.png';
        if (data[i]['logo']) flagImage = APP_IMAGE_URL + data[i]['logo'];

        upFocus = " data-sn-up='null'";
        downFocus = " data-sn-down='null'";
        dataId = ' data-channel="' + data[i]["number"] + '" ';

        if (i == (totalItems - 1)) rigthFocus = " data-sn-right='null'";
        else rigthFocus = " data-sn-right='#row_item_" + ROW_INDEX + '_' + (i + 1) + "'";

        if (i > 0) leftFocus = " data-sn-left='#row_item_" + ROW_INDEX + '_' + (i - 1) + "'";
        else leftFocus = "data-sn-left='#tv_channel'";

        str += '<li class="focusable" tabindex="' + NAVIGATION_INDEX + '" id="' + focusName + '" ' + rigthFocus + leftFocus + upFocus + downFocus + dataId + '>';
        str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + data[i]['name'] + '"></div><div class="channel">' + data[i]['name'] + '</div></div>';
        str += '</li>';
    }

    if (country == APP_GENRE_COUNTRY_LIST[_.size(APP_GENRE_COUNTRY_LIST) - 1].id) {
        set_channel_list_focus(0);
        $(".main_container").show();
        $("#home_spinner").hide();
        $(".home_container").addClass("active").show();
        setTimeout(function () {
            // load_preview_player();
            checkVideoURL();
        }, 5000);
        if (_.size(FAVORITE_LIST) > 0) {
            FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = "fav_channel_0_0";
            $("#fav_channel_0_0").addClass("selected_channel");
            //SN.focus("favorite_list");
        } else {
            FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = "row_item_0_0";
            $("#row_item_0_0").addClass("selected_channel");
            // SN.focus("channel_list_0");
        }
    }
    $("ul#channel_list_" + ROW_INDEX).html('');
    $("ul#channel_list_" + ROW_INDEX).append(str);

    if (index < _.size(APP_GENRE_COUNTRY_LIST)) {
        ROW_INDEX++;
        NAVIGATION_INDEX++;
        index = index + 1;
        set_custom_channel_list(index);
    }
}


function sort_channel_list() {
    console.log("sort_channel_list");

    if (ALPHA_NUMERIC == "ALPHA") {
        console.log("alphabetical");
        $.each(APP_CHANNEL_DATA_ARRAY, function (index, value) {
            APP_CHANNEL_DATA_ARRAY[index].sort(function (a, b) { if (a.name < b.name) { return -1; } if (a.name > b.name) { return 1; } return 0; });
        });
        APP_CHANNEL_DATA_ARRAY["favorite"].sort(function (a, b) { if (a.name < b.name) { return -1; } if (a.name > b.name) { return 1; } return 0; });
    } else if (ALPHA_NUMERIC == "NUMERIC") {
        console.log("numeric");
        $.each(APP_CHANNEL_DATA_ARRAY, function (index, value) {
            APP_CHANNEL_DATA_ARRAY[index].sort(function (a, b) { if (a.id < b.id) { return -1; } if (a.id > b.id) { return 1; } return 0; });
        });
        APP_CHANNEL_DATA_ARRAY["favorite"].sort(function (a, b) { if (a.id < b.id) { return -1; } if (a.id > b.id) { return 1; } return 0; });
    }
}

function hide_channel_input_box() {
    console.log("hide_channel_input");
    $(".channel_number_container").hide();
    $("#channel_input").val("");
    if (PREVIEW_FULL_DISPLAY) SN.focus("previewVideoPlayer");
}

function show_channel_input_box(num) {
    if (PAGE_INDEX == 0) {
        console.log("show_channel_input");

        SN.focus("#channel_input");

        var value = $("#channel_input").val();

        $(".channel_number_container").show();
        clearTimeout(PLAY_TIMER);
        PLAY_TIMER = setTimeout(function () {
            play_live_by_channel_number();
        }, 10000);

        SN.focus("#channel_input");
    }
}

function play_live_by_channel_number() {
    console.log("play_live_by_channel_number");
    var searchNumber = $("#channel_input").val();
    if ($('#preview_video_container').is(':visible')) {
        if (APP_CHANNEL_DATA[searchNumber] != 'undefined') {
            SELECTED_CHANNEL_NUMBER = searchNumber;
            get_player_channel_epg(APP_CHANNEL_DATA[SELECTED_CHANNEL_NUMBER]["id"]);
            VIDEO_PLAYER.pause();
            VOD_URL = APP_CHANNEL_DATA[SELECTED_CHANNEL_NUMBER]['url'];
            // load_preview_player();
            checkVideoURL();
            var element = document.querySelectorAll('[data-channel="' + SELECTED_CHANNEL_NUMBER + '"]');
            FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = element[0].id;
            SELECTED_CHANNEL_INDEX = $("li#" + FIRST_PAGE_SELECTED_ITEM).index();
            SELECTED_CHANNEL_ROW = $("#" + FIRST_PAGE_SELECTED_ITEM).parent().attr("id");
            SELECTED_CAT_INDEX = $("#" + FIRST_PAGE_SELECTED_ITEM).parent().attr("data-name");
            if (APP_CHANNEL_DATA_ARRAY[SELECTED_CAT_INDEX][SELECTED_CHANNEL_INDEX]['favorite'] || typeof FAVORITE_DATA[SELECTED_CHANNEL_NUMBER] !== 'undefined') {
                $("#player_fav").addClass("added");
                $("#player_fav").text("- FAV");
            }
            else {
                $("#player_fav").removeClass("added");
                $("#player_fav").text("+ FAV");
            }
            set_info_bar();
            $("#video_content_details").show();
            SN.focus("favorite_button");
        }
    }
}

function set_video_library_screen() {
    console.log("set_video_library_screen");
    if (_.size(APP_CAT_VIDEO_ARRAY) > 0) {
        $("#video_list").html("");
        if (_.size(APP_CAT_VIDEO_ARRAY["New-Releases"]) > 0) {
            var focusName = "",
                rigthFocus = "",
                leftFocus = "",
                upFocus = "",
                downFocus = "",
                str = "";

            str += '<div class="top_hidden_shadow_box"></div>';
            str += '<div class="video_list_box" id="New-Releases" data-category="New-Releases">';
            str += '<div class="half_video_left_side" ></div><h1 class="video_list_heading">New Releases</h1>';
            str += '<div class="video_category_box"><ul class="video_liberary_thumbnail_box" id="video_list_0" data-id="0">';

            var totalItems = _.size(APP_CAT_VIDEO_ARRAY["New-Releases"]);
            var data = APP_CAT_VIDEO_ARRAY["New-Releases"];
            for (var i = 0; i < 10; i++) {
                var img = 'images/default.png';

                focusName = 'video_item_' + 0 + '_' + i;
                if (i == 0) {
                    var meta_str = '';
                    meta_str += '<span class="video_meta_data" id="vod_year">' + data[i]["year"] + '</span>';
                    meta_str += '<span class="video_meta_data" id="vod_country">' + data[i]["country"] + '</span>';
                    meta_str += '<span class="video_meta_data" id="vod_genre">' + data[i]["genres"] + '</span>';
                    meta_str += '<span class="video_meta_data" id="vod_time">' + data[i]["time"] + 'm' + '</span>';
                    meta_str += '<span class="video_meta_data" id="vod_rating">' + data[i]["rating_mpaa"] + '</span>';
                    if (data[i]["hd"] == 1) meta_str += '<img src="images/hd.png" alt="hd" id="vod_hd" class="hd" style="display:inline-block;">';
                    else meta_str += '<img src="images/hd.png" alt="hd" id="vod_hd" class="hd" style="display:none;">';
                    if (_.size(data[i]["series"]) > 0) meta_str += ' <img src="images/series.png" alt="series" id="vod_type" class="series" style="display:inline-block;"> ';
                    else meta_str += ' <img src="images/series.png" alt="series" id="vod_type" class="series" style="display:none;"> ';
                    meta_str += '<span class="video_meta_data episode-count" id="count"></span>';

                    if (_.size(data[i]["series"]) > 0) $("#count").text(_.size(data[i]["series"]));
                    else $("#count").text("");

                    $("#video_content_meta").html("");
                    $("#video_content_meta").html(meta_str);

                    $("#video_name").text(data[i]["name"]);
                    $("#director_name").text(data[i]["director"]);
                    $("#actors").text("|" + data[i]["actors"]);
                    $("#video_desc").text(data[i]["description"]);

                    if (data[i]['poster']) img = APP_IMAGE_URL + data[i]['poster'];
                    $("#video-preview-player").find("img").attr("src", img);
                }

                if (data[i]['cover']) img = APP_IMAGE_URL + data[i]['cover'];
                else img = 'images/default.png';

                // if (index == 0) upFocus = " data-sn-up='null'";
                // else upFocus = " data-sn-right='#video_item_" + (index - 1) + '_' + (i + 1) + "'";

                upFocus = " data-sn-up='null'";
                downFocus = " data-sn-down='null'";

                if (i == (totalItems - 1)) rigthFocus = " data-sn-right='null'";
                else rigthFocus = " data-sn-right='#video_item_" + 0 + '_' + (i + 1) + "'";

                if (i > 0) leftFocus = " data-sn-left='#video_item_" + 0 + '_' + (i - 1) + "'";
                else leftFocus = "data-sn-left='#video_library'";

                str += '<li class="focusable" tabindex="' + NAVIGATION_INDEX + '" id="' + focusName + '" ' + rigthFocus + leftFocus + upFocus + downFocus + '>';
                str += '<div class="thumbmnail_poster"><img src="' + img + '" alt="' + data[i]['name'] + '"></div>';
                str += '</li>';
            }
            NAVIGATION_INDEX++;
            str += '</ul></div >';
            str += '<div class="half_video_right_side"></div></div >';
            $("#video_list").append(str);
            // $("#video_list").show();

        } else console.log("new release not found.");

        if (_.size(APP_CAT_VIDEO_ARRAY) > 0) {
            var focusName = "",
                rigthFocus = "",
                leftFocus = "",
                upFocus = "",
                downFocus = "",
                str = "";

            for (var k = 0; k < _.size(APP_VIDEO_CATEGORY); k++) {

                str += '<div class="video_list_box" id="' + APP_VIDEO_CATEGORY[k]["id"] + '" data-category="' + APP_VIDEO_CATEGORY[k]["id"] + '">';
                str += '<div class="half_video_left_side" ></div><h1 class="video_list_heading">' + APP_VIDEO_CATEGORY[k]["title"] + '</h1>';
                str += '<div class="video_category_box"><ul class="video_liberary_thumbnail_box" id="video_list_' + (k + 1) + '" data-id="' + (k + 1) + '">';

                var totalItems = _.size(APP_CAT_VIDEO_ARRAY[APP_VIDEO_CATEGORY[k]["id"]]);
                var data = APP_CAT_VIDEO_ARRAY[APP_VIDEO_CATEGORY[k]["id"]];
                newIndex = k + 1;
                for (var i = 0; i < totalItems; i++) {
                    var img = 'images/default.png';

                    focusName = 'video_item_' + newIndex + '_' + i;
                    if (data[i]['cover']) img = APP_IMAGE_URL + data[i]['cover'];
                    else img = 'images/default.png';

                    // if (index == 0) upFocus = " data-sn-up='null'";
                    // else upFocus = " data-sn-right='#video_item_" + (index - 1) + '_' + (i + 1) + "'";

                    upFocus = " data-sn-up='null'";
                    downFocus = " data-sn-down='null'";

                    if (i == (totalItems - 1)) rigthFocus = " data-sn-right='null'";
                    else rigthFocus = " data-sn-right='#video_item_" + newIndex + '_' + (i + 1) + "'";

                    if (i > 0) leftFocus = " data-sn-left='#video_item_" + newIndex + '_' + (i - 1) + "'";
                    else leftFocus = "data-sn-left='#video_library'";

                    str += '<li class="focusable" tabindex="' + NAVIGATION_INDEX + '" id="' + focusName + '" ' + rigthFocus + leftFocus + upFocus + downFocus + '>';
                    str += '<div class="thumbmnail_poster"><img src="' + img + '" alt="' + data[i]['name'] + '"></div>';
                    str += '</li>';
                }

                if (k == 0) {
                    $("ul#video_list_" + newIndex).html('');
                    $("ul#video_list_" + newIndex).append(str);
                    $(".main_container").show();
                    $("#home_spinner").hide();
                    if (PAGE_INDEX == 1) $(".video_library_container").addClass("active").show();
                    // set_video_list_focus(0);
                    // SN.focus("video_list_0");
                    $("#video_item_0_0").addClass("selected_video");
                    $("div#preview-player").empty();
                    $("div#video-preview-player").html('<img src="' + APP_IMAGE_URL + APP_CAT_VIDEO_ARRAY["New-Releases"][0]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY["New-Releases"][0]["name"] + '">');

                    //play preview video
                    if (APP_CAT_VIDEO_ARRAY["New-Releases"][0]['promo_url']) {
                        setTimeout(function () {
                            $("div#video-preview-player").empty();
                            $("div#video-preview-player").load("preview-video-player.html");
                            VOD_URL = APP_CAT_VIDEO_ARRAY["New-Releases"][0]['promo_url'];
                            if (PAGE_INDEX == 1) load_preview_player();
                            // SN.focus("video_list_0");
                        }, 5000);
                    } else {
                        // $("div#preview-player").empty();
                        $("div#video-preview-player").html('<img src="' + APP_IMAGE_URL + APP_CAT_VIDEO_ARRAY["New-Releases"][0]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY["New-Releases"][0]["name"] + '">');
                        // SN.focus("video_list_0");
                        SECOND_PAGE_FOCUSED_ITEM = "video_item_0_0";
                    }

                }
                NAVIGATION_INDEX++;
                str += '</ul></div >';
                str += '<div class="half_video_right_side"></div></div >';
            }

            $("#video_list").append(str);
            $("#video_list").show();
            set_video_list_focus(0);

        } else console.log("videos not found.");

    } else console.log("video-categories");
}

// var leftmove,rightmove;
function controlLeftArrowKeys() {
    console.log("left move");
    var leftmove;
    var input = document.getElementById('searchInputText');
    if (input.value.length == 0) {
        SN.focus("#searchIcon");
        return;
    } else {
        var currentpos = input.selectionStart; //getting current postion of cursor

        if (currentpos == 0) SN.focus("#search");
        else {
            leftmove = currentpos - 1;
            setCaretPosition(input, leftmove);
        }
    }
}
function controlrightArrowKeys() {
    console.log("right move");
    var rightmove;
    var input = document.getElementById('searchInputText');
    if (input.value.length == 0) {
        return;
    } else {
        var currentpos = input.selectionStart;  //getting current postion of cursor
        rightmove = currentpos + 1;
        setCaretPosition(input, rightmove);
    }
}
function setCaretPosition(ctrl, pos) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);

        // IE8 and below
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}


