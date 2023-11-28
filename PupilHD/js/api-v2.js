function authToken() {
    $.ajax({
        type: 'POST',
        url: APP_STALKER_URL + "/stalker_portal/auth/token",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US' },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        async: true,
        cache: false,
        data: {
            'grant_type': "password", 'username': localStorage.getItem("pupilhd_app_stalker_login"), 'password': localStorage.getItem("pupilhd_app_stalker_password")
        },
        success: function (response) {
            REFRESH_TOKEN_TIME = response.expires_in;
            STALKER_TOKEN = "Bearer " + response.access_token;
            STALKER_USER_ID = response.user_id;
            userCurrectStatus();
            userStatusPing();

            if (SELECTED_COUNTRY_GENRE == "COUNTRY") {
                getListOfCountries();
            }
            else if (SELECTED_COUNTRY_GENRE == "GENRE") {
                getGenreList();
                numberOfCountries();
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function userCurrectStatus() {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/current",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Authorization": STALKER_TOKEN },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        async: true,
        cache: false,
        success: function (response) {
            if (response.status == "OK") {
                userStatusUpdate();
            }
            else console.log("Inactive", response);

        },
        error: function (xhr, error) {
            console.log("error", error);
            userCurrectStatus();
        }
    });
}

function userStatusUpdate() {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/status",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Authorization": STALKER_TOKEN },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        async: true,
        cache: false,
        success: function (response) {
            if (response.status == "OK") {
                var success = "response.status"
            }
            else console.log("Status update failed.", response);

        },
        error: function (xhr, error) {
            console.log("error", error);
            userStatusUpdate();
        }
    });
}

function userStatusPing() {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/ping",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Authorization": STALKER_TOKEN },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        async: true,
        cache: false,
        success: function (response) {
            if (response.results) {
                api_ping_timer();
                userCurrectStatus();
            }
            else console.log("Status ping failed.", response);

        },
        error: function (xhr, error) {
            console.log("error", error);
            userStatusPing();
        }

    });
}

function sendMediaInfo(type, media_id) {

    if (!type || !media_id) return;

    $.ajax({
        type: 'POST',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/media-info",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Authorization": STALKER_TOKEN },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            'type': type, 'media_id': media_id
        },
        async: true,
        cache: false,
        success: function (response) {
            if (response.status == "OK") {
                var mediaUpdated = "Media updated successfully.";
            }
            else console.log("Media update failed.", response);

        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}
function deleteMediaInfo() {
    var settings = {
        "url": "http://sta.pupilhd.net/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/media-info",
        "method": "DELETE",
        "headers": {
            "Accept": "application/json",
            "Accept-Language": "en-US",
            "Authorization": STALKER_TOKEN
        },
    };

    $.ajax(settings).done(function (response) {
        show_hide_show_deatils(false);
    });
    $.ajax(settings).fail(function (response) {
        console.log("Failed: ", response);
    });
}


function refresh_authToken() {
    $.ajax({
        type: 'POST',
        url: APP_STALKER_URL + "/stalker_portal/auth/token",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US' },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        async: true,
        cache: false,
        data: {
            'grant_type': "password", 'username': localStorage.getItem("pupilhd_app_stalker_login"), 'password': localStorage.getItem("pupilhd_app_stalker_password")
        },
        success: function (response) {
            REFRESH_TOKEN_TIME = response.expires_in;
            STALKER_TOKEN = "Bearer " + response.access_token;
            STALKER_USER_ID = response.user_id;

            setTimeout(function () {
                refresh_authToken();
            }, 30000);
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function checkVideoURL() {
    var errorMsg = "";
    $.ajax({
        type: "GET",
        url: VOD_URL,
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            $(".video_player_error_message").text("").css("display", "none");
            if (PREVIEW_PLAYER != '') {
                console.log("load url only");
                PREVIEW_PLAYER.pause();
                PREVIEW_PLAYER.setSrc(VOD_URL);
                PREVIEW_PLAYER.load();
                setTimeout(function () { PREVIEW_PLAYER.play(); }, 500);
            } else load_preview_player();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 403) errorMsg = "Your Are Not Authorized To View This Content";
            else if (jqXHR.status === 404) errorMsg = "Content Currently Not Available";
            else if (jqXHR.status === 0) errorMsg = NET_CONNECTION_ERR;
            else errorMsg = "Something went wrong";
            if (PREVIEW_PLAYER) PREVIEW_PLAYER.setSrc(" ");
            $(".video_player_error_message").text(errorMsg).css("display", "block");
            $(".mejs__overlay-button").css("display", "none");
            $(".preview-video-inner").hide();
        }
    });
}


function getFavoriteChannelList() {
    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-favorites",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    FAVORITE_LIST = response.results;
                    FAVORITE_LIST.sort(function (a, b) { if (a < b) { return -1; } if (a > b) { return 1; } return 0; });
                    setfavoriteChannlList(0);
                } else {
                    $("#favorite_list").html('<li class="favorite_not_found"><spna>You do not have favorite channel.</span></li>');
                    $("#favorite_list").hide();
                }
            } else {
                console.log("favorite error", response.error);
            }
        },
        error: function (xhr, error) {
            console.log("error", error, xhr.status);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}


function setfavoriteChannlList(index) {

    if (index < _.size(FAVORITE_LIST)) {
        if (index == 0) $("#favorite_list").empty();

        $.ajax({
            type: "GET",
            url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-channels/" + FAVORITE_LIST[index],
            async: true,
            cache: false,
            headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
            crossDomain: true,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (response) {
                if (response.status == "OK") {
                    FAVORITE_DATA[FAVORITE_LIST[index]] = response.results;
                    if (index == 0) APP_CHANNEL_DATA_ARRAY["favorite"] = [];
                    APP_CHANNEL_DATA_ARRAY["favorite"][index] = response.results;
                    var data = response.results;
                    var id = "",
                        rigthFocus = "",
                        leftFocus = "",
                        upFocus = "",
                        downFocus = "",
                        str = "";

                    id = 'fav_channel_' + 0 + '_' + index;
                    if (index == 0) {
                        SELECTED_CHANNEL_NUMBER = data['number'];
                        $("#selected_channel_name").text(data['number'] + ". " + data['name']);
                        $("#selected_channel_country").text(data['country_id']);
                        $("#selected_channel_language").text(data['language_id']);

                        if (data['favorite']) $(".fav").show();
                        else $(".fav").hide();

                        if (data['hd'] != 0) $(".hd").show();
                        else $(".hd").hide();

                        VOD_URL = data['url'];
                        get_channel_epg(data['id']);
                    }
                    var flagImage = 'images/default.png';
                    if (data['logo']) flagImage = APP_IMAGE_URL + data['logo'];

                    upFocus = " data-sn-up='null'";
                    downFocus = " data-sn-down='null'";

                    if (index == _.size(FAVORITE_LIST)) rigthFocus = " data-sn-right='null'";
                    else rigthFocus = " data-sn-right='#fav_channel_" + 0 + '_' + (index + 1) + "'";

                    if (index == 0) leftFocus = "data-sn-left='#tv_channel'";
                    else leftFocus = " data-sn-left='#fav_channel_" + 0 + '_' + (index - 1) + "'";

                    if (index == 0) {
                        str += '<div class="channel_item_list" id="favorite_item_list_' + index + '" >';
                        str += '<h1 class="channel_heading" id="favorite">My Favorite</h1>';
                        str += '<div class="left_half_box" id="left_half_side_favorite"><div class="channel_logo_box"><img src="images/default.png" id="left_half_img_favorite" alt="Default"></div><div class="channel" id="left_half_name_favorite">Favorite</div></div> ';
                        str += '<div class="category_box">';
                        str += '<ul class="channel_thumbnail_box" id="favorite_list_' + index + '" data-name="favorite" data-id="' + index + '">';
                        str += '<li class="focusable" tabindex="17" id="' + id + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' data-id="' + data["id"] + '">';
                        str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + data['name'] + '"></div><div class="channel">' + data['name'] + '</div></div>';
                        str += '</li>';
                        str += '</ul>';
                        str += '</div>';
                        str += '<div class="right_half_box" id="right_half_side_favorite"><div class="channel_logo_box"><img src="images/default.png" id="right_half_img_favorite" alt=""></div><div class="channel" id="right_half_name_favorite"></div></div>';
                        str += '</div>';

                        $("#favorite_list").append(str);

                    } else {

                        str += '<li class="focusable" tabindex="17" id="' + id + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' data-id="' + data["id"] + '">';
                        str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + data['name'] + '"></div><div class="channel">' + data['name'] + '</div></div>';
                        str += '</li>';

                        $("#favorite_list_0").append(str);
                    }
                    addEventListeners();
                    $("#favorite_list").show();
                    index++;
                    if (index < _.size(FAVORITE_LIST)) setfavoriteChannlList(index);
                } else {
                    index++;
                    if (index < _.size(FAVORITE_LIST)) setfavoriteChannlList(index);
                }
            },
            error: function (xhr, error) {
                console.log("error", error, xhr, xhr.status);
                if (xhr.status > 499 && xhr.status < 600) {
                    msg = NET_CONNECTION_ERR;
                    hide_show_modal(true, "RETRY_EXIT", msg);
                } else {
                    FAVORITE_LIST.splice(index, 1); // 2nd parameter means remove one item only
                    index;
                    if (index < _.size(FAVORITE_LIST)) setfavoriteChannlList(index);
                }
            }
        });
    }
}
function numberOfGenres() {
    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-genres",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    APP_GENRE_ARRAY = response.results;;
                    APP_GENRE_LIST = response.results;;
                } else console.log("Data not found.");
            } else console.log(response.error);
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}
function numberOfCountries() {
    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-countries",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var countries = response.results;
                    TOTAL_COUNTRY = response.results.length;
                    for (var i = 0; i < response.results.length; i++) {
                        APP_COUNTRY_ARRAY[i] = countries[i];
                        APP_COUNTRY_LIST[i] = countries[i];
                    }

                } else console.log("Data not found.");
            } else console.log(response.error);
        },
        error: function (xhr, error) {
            console.log("error");
        }
    });
}

function getListOfCountries() {
    reset_favorite_channel_list();
    reset_global_variable();
    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-countries",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var countries = response.results,
                        str = '';
                    TOTAL_COUNTRY = response.results.length;
                    if (_.size(COUNTRY_CHOICE) > 0) {
                        var tempArray = JSON.parse(JSON.stringify(countries));
                        var tempArr = [];
                        for (var c = _.size(COUNTRY_CHOICE) - 1; c > -1; c--) {
                            for (var i = 0; i < _.size(tempArray); i++) {
                                if (tempArray[i]["id"] == COUNTRY_CHOICE[c]) {
                                    tempArr = tempArray[i];
                                    tempArray.splice(i, 1);
                                    tempArray.unshift(tempArr);
                                    tempArr = [];
                                }
                            }
                        }
                        countries = tempArray.slice(0);
                    }

                    for (var i = 0; i < response.results.length; i++) {
                        str = '';
                        APP_COUNTRY_ARRAY[i] = countries[i];
                        APP_GENRE_COUNTRY_LIST[i] = countries[i];
                        APP_COUNTRY_LIST[i] = countries[i];
                        var country = countries[i]['id'];

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
                            getHomeChannelList(countries[i].id);
                        } else $("#channel_list").append(str);
                        addEventListeners();
                    }

                } else {
                    console.log("Data not found.");
                }
            } else {
                console.log(response.error);
            }
        },
        error: function (xhr, error) {
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function getHomeChannelList(country) {
    var url = APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-countries/" + country + "/tv-channels";

    if (country == '') return false;
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var data = response.results;
                    var totalItems = response.results.length;

                    var focusName = "",
                        rigthFocus = "",
                        leftFocus = "",
                        upFocus = "",
                        downFocus = "",
                        str = "",
                        dataId = '';

                    $("#" + country).text(country + '(' + _.size(response.results) + ')');
                    APP_CHANNEL_DATA_ARRAY[country] = [];

                    if (ALPHA_NUMERIC == "ALPHA") {
                        $.each(data, function (index, value) {
                            data.sort(function (a, b) { if (a.name < b.name) { return -1; } if (a.name > b.name) { return 1; } return 0; });
                        });
                    }

                    setTimeout(function () {
                        for (var i = 0; i < totalItems; i++) {
                            APP_CHANNEL_DATA_ARRAY[country][i] = data[i];
                            APP_CHANNEL_DATA[data[i]['number']] = data[i];

                            focusName = 'row_item_' + ROW_INDEX + '_' + i;
                            if (i == 0 && ROW_INDEX == 0 && _.size(FAVORITE_LIST) < 1) {
                                SELECTED_CHANNEL_NUMBER = data[i]['number'];
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
                        $("ul#channel_list_" + ROW_INDEX).html('');
                        $("ul#channel_list_" + ROW_INDEX).append(str);
                        addEventListeners();

                        NAVIGATION_INDEX++;
                        call_home_channel_list();
                        COUNTRY_WISE_CHANNEL_DATA = APP_CHANNEL_DATA_ARRAY;
                    }, 200);
                } else {
                    reset_channel_list(country);
                }

            } else {
                console.log(response.error);
                call_home_channel_list();
            }

        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
            if (xhr.status > 499 && xhr.status < 600) {
                msg = NET_CONNECTION_ERR;
                hide_show_modal(true, "RETRY_EXIT", msg);
            } else call_home_channel_list();
        }
    });
}

function getGenreList() {
    reset_favorite_channel_list();
    reset_global_variable();
    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-genres",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    TOTAL_COUNTRY = response.results.length;

                    var genres = response.results,
                        str = '',
                        APP_GENRE_COUNTRY_LIST = [];

                    APP_GENRE_COUNTRY_LIST = genres;
                    APP_GENRE_ARRAY = genres;
                    APP_GENRE_LIST = genres;

                    for (var i = 0; i < response.results.length; i++) {
                        str = '';
                        var country = genres[i]['id'];

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
                            getGenreOrderItemList(genres[i].id);
                        } else $("#channel_list").append(str);
                        addEventListeners();
                    }
                } else {
                    console.log("Data not found.");
                }
            } else {
                console.log(response.error);
            }
        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}


function getGenreOrderItemList(country) {
    APP_GENRE_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_GENRE_LIST));
    var url = APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-genres/" + country + "/tv-channels";

    if (country == '') return false;
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var data = response.results;
                    var totalItems = response.results.length;

                    var focusName = "",
                        rigthFocus = "",
                        leftFocus = "",
                        upFocus = "",
                        downFocus = "",
                        str = "",
                        dataId = '';

                    $("#" + country).text(country + '(' + _.size(response.results) + ')');
                    APP_CHANNEL_DATA_ARRAY[country] = [];

                    if (ALPHA_NUMERIC == "ALPHA") {
                        $.each(data, function (index, value) {
                            data.sort(function (a, b) { if (a.name < b.name) { return -1; } if (a.name > b.name) { return 1; } return 0; });
                        });
                    }

                    setTimeout(function () {
                        for (var i = 0; i < totalItems; i++) {
                            APP_CHANNEL_DATA_ARRAY[country][i] = data[i];
                            focusName = 'row_item_' + ROW_INDEX + '_' + i;
                            if (i == 0 && ROW_INDEX == 0 && _.size(FAVORITE_LIST) < 1) {
                                SELECTED_CHANNEL_NUMBER = data[i]['number'];
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
                            checkVideoURL();
                            if (_.size(FAVORITE_LIST) > 0) {
                                FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = "fav_channel_0_0";
                                $("#fav_channel_0_0").addClass("selected_channel");
                                SN.focus("favorite_list");
                            } else {
                                FIRST_PAGE_SELECTED_ITEM = FIRST_PAGE_FOCUSED_ITEM = "row_item_0_0";
                                $("#row_item_0_0").addClass("selected_channel");
                                SN.focus("channel_list_0");
                            }
                        }
                        $("ul#channel_list_" + ROW_INDEX).html('');
                        $("ul#channel_list_" + ROW_INDEX).append(str);
                        addEventListeners();

                        NAVIGATION_INDEX++;
                        call_genre_order_channel_list();
                        GENRE_WISE_CHANNEL_DATA = APP_CHANNEL_DATA_ARRAY;
                    }, 200);

                } else {
                    reset_channel_list(country);
                }

            } else {
                call_genre_order_channel_list();
            }

        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
            if (xhr.status > 499 && xhr.status < 600) {
                msg = NET_CONNECTION_ERR;
                hide_show_modal(true, "RETRY_EXIT", msg);
            } else call_genre_order_channel_list();
        }
    });
}

function get_channel_epg(channelId) {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/tv-channels/" + channelId + "/epg?next=4",
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        dataType: "json",
        async: true,
        cache: false,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var epgdata = response.results;
                    var str = '',
                        color = '';
                    for (var i = 0; i < 3; i++) {
                        if (epgdata[i]) {
                            var date = new Date(epgdata[i]['start'] * 1000);
                            if (i == 0) color = 'color';
                            else color = '';
                            str += '<div class="scheduled_programs"><span class="time">' + formatAMPM(date) + '</span><span class="programe_name ' + color + '">- ' + epgdata[i]['name'] + '</span></div>';
                        }
                    }

                    $("#channel_epg").html(str);
                } else {
                    $("#channel_epg").html('');
                    addEventListeners();
                }
            } else {
                console.log("EPG error");
            }
        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
        }
    });
}

function get_video_list_by_category(category, index) {
    var newIndex = index + 1;

    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/video-categories/" + category + "/video",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var data = response.results;
                    data.sort(function (a, b) { if (Number(a.id) > Number(b.id)) { return -1; } if (Number(a.id) < Number(b.id)) { return 1; } return 0; });
                    var totalItems = response.results.length;
                    var focusName = "",
                        rigthFocus = "",
                        leftFocus = "",
                        upFocus = "",
                        downFocus = "",
                        str = "";
                    APP_CAT_VIDEO_ARRAY[category] = {};

                    for (var i = 0; i < totalItems; i++) {
                        APP_CAT_VIDEO_ARRAY[category][i] = data[i];
                        var img = 'images/default.png';

                        focusName = 'video_item_' + newIndex + '_' + i;
                        if (data[i]['cover']) img = APP_IMAGE_URL + data[i]['cover'];
                        else img = 'images/default.png';

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
                    if (index == 0) {
                        $("ul#video_list_" + newIndex).html('');
                        $("ul#video_list_" + newIndex).append(str);
                        $(".main_container").show();
                        $("#home_spinner").hide();
                        if (PAGE_INDEX == 1) $(".video_library_container").addClass("active").show();
                        // set_video_list_focus(0);
                        SECOND_PAGE_FOCUSED_ITEM = "video_item_0_0";
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
                            }, 3000);
                        }
                        SN.focus("#video_item_0_0");

                    } else {
                        $("ul#video_list_" + newIndex).html('');
                        $("ul#video_list_" + newIndex).append(str);
                    }

                    NAVIGATION_INDEX++;
                    if (newIndex < _.size(APP_VIDEO_CATEGORY)) get_video_list_by_category(APP_VIDEO_CATEGORY[newIndex]['id'], newIndex);
                    addEventListeners();
                } else {
                    reset_video_list(APP_VIDEO_CATEGORY[index]['id'], index);
                }

            } else {
                reset_video_list(APP_VIDEO_CATEGORY[index]['id'], index);
            }

        },
        error: function (xhr, error) {
            console.log("error", error);
            if (xhr.status > 499 && xhr.status < 600) {
                msg = NET_CONNECTION_ERR;
                hide_show_modal(true, "RETRY_EXIT", msg);
            } else if (newIndex < _.size(APP_VIDEO_CATEGORY)) get_video_list_by_category(APP_VIDEO_CATEGORY[newIndex]['id'], newIndex);
        }
    });

    if (newIndex == (_.size(APP_VIDEO_CATEGORY) - 1)) {
        set_video_list_focus(0);
        SN.focus("video_list_0");
    }
}


function get_video_categories() {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/video-categories",
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        dataType: "json",
        async: true,
        cache: false,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    APP_VIDEO_CATEGORY = response.results
                    for (var i = 0; i < _.size(APP_VIDEO_CATEGORY); i++) {
                        var str = '';
                        str += '<div class="video_list_box" id="' + APP_VIDEO_CATEGORY[i]["id"] + '" data-category="' + APP_VIDEO_CATEGORY[i]["id"] + '" >';
                        str += '<div class="half_video_left_side" id="half_video_left_side_' + APP_VIDEO_CATEGORY[i]["id"] + '" ><div class="thumbmnail_poster"><img src="images/default.png" id="left_half_img_' + APP_VIDEO_CATEGORY[i]["id"] + '" alt="logo"></div><div class="channel" id="left_half_name_' + APP_VIDEO_CATEGORY[i]["id"] + '"></div></div><h1 class="video_list_heading" id="' + APP_VIDEO_CATEGORY[i]["id"] + '">' + APP_VIDEO_CATEGORY[i]["title"] + '</h1>';
                        str += '<div class="video_category_box"><ul class="video_liberary_thumbnail_box" id="video_list_' + (i + 1) + '" data-id="' + (i + 1) + '" data-name="' + APP_VIDEO_CATEGORY[i]["id"] + '"></ul></div >';
                        str += '<div class="half_video_right_side" id="half_video_right_side_' + APP_VIDEO_CATEGORY[i]["id"] + '"><div class="thumbmnail_poster"><img src="images/default.png" id="right_half_img_' + APP_VIDEO_CATEGORY[i]["id"] + '" alt=""></div><div class="channel" id="right_half_name_' + APP_VIDEO_CATEGORY[i]["id"] + '"></div></div></div >';

                        $("#video_list").append(str);
                        addEventListeners();
                    }
                    get_video_list_by_category(APP_VIDEO_CATEGORY[0]['id'], 0);
                } else {
                    console.log("video-categories not found.");
                }
            } else {
                console.log("video-categories");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}


function get_new_release_video() {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/" + STALKER_USER_ID + "/video",
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        dataType: "json",
        async: true,
        cache: false,
        success: function (response) {
            console.log(response);
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    $("#video_list").html("");

                    var focusName = "",
                        rigthFocus = "",
                        leftFocus = "",
                        upFocus = "",
                        downFocus = "",
                        str = "";

                    str += '<div class="top_hidden_shadow_box"></div>';
                    str += '<div class="video_list_box" id="New-Releases" data-category="New-Releases">';
                    str += '<div class="half_video_left_side" id="half_video_left_side_New-Releases" ><div class="thumbmnail_poster"><img src="images/default.png" id="left_half_img_New-Releases" alt=""></div><div class="channel" id="left_half_name_New-Releases"></div></div><h1 class="video_list_heading" id="New-Releases">New Releases</h1>';
                    str += '<div class="video_category_box"><ul class="video_liberary_thumbnail_box" id="video_list_0" data-id="0">';

                    APP_CAT_VIDEO_ARRAY["New-Releases"] = [];
                    var data = response.results;
                    var totalItems = _.size(response.results);
                    for (var i = 0; i < totalItems; i++) {
                        APP_CAT_VIDEO_ARRAY["New-Releases"][i] = data[i];
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
                    str += '<div class="half_video_right_side" id="half_video_right_side_New-Releases"><div class="thumbmnail_poster"><img src="images/default.png" id="right_half_img_New-Releases" alt=""></div><div class="channel" id="right_half_name_New-Releases"></div></div></div >';
                    $("#video_list").append(str);
                    $(".navbar_sidebar").show();
                    get_video_categories();
                    addEventListeners();
                } else {
                    console.log("video-categories not found.");
                    get_video_categories();
                }
            } else {
                console.log("video-categories");
                get_video_categories();
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (xhr.status > 499 && xhr.status < 600) {
                msg = NET_CONNECTION_ERR;
                hide_show_modal(true, "RETRY_EXIT", msg);
            } else get_video_categories();
        }
    });
}

function get_episode_url(index) {

    if (_.size(SELECTED_VIDEO_DATA["series"]) > 0 && index < _.size(SELECTED_VIDEO_DATA["series"])) {
        $.ajax({
            type: 'GET',
            url: APP_STALKER_URL + "/stalker_portal/api/v2/video-categories/" + SELECTED_VIDEO_DATA["category"] + "/video/" + SELECTED_VIDEO_DATA["id"] + "/episodes/" + SELECTED_VIDEO_DATA["series"][index] + "/link",
            headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
            dataType: "json",
            async: true,
            cache: false,
            success: function (response) {
                var lastURL = response.results;
                var lastEpisode = "s01e" + _.size(SELECTED_VIDEO_DATA["series"]);
                var urlArry = lastURL.split(lastEpisode);
                var str = '',
                    id = '',
                    episode = '',
                    leftFocus = '',
                    rightFocus = '';

                if (response.status == "OK" && response.results) {

                    for (var i = 0; i < _.size(SELECTED_VIDEO_DATA["series"]); i++) {

                        if (i < 9) episode = "s01e0" + (i + 1);
                        else episode = "s01e" + (i + 1);

                        SELECTED_EPISODES[i] = urlArry[0] + episode + urlArry[1];

                        if (PAGE_INDEX == 1) {
                            id = ' id ="episode_' + i + '" ';
                            if (i == 0) leftFocus = ' data-sn-left="#video_library" ';
                            else leftFocus = ' data-sn-left="#episode_' + (i - 1) + '" ';

                            if (i == _.size(SELECTED_VIDEO_DATA["series"])) rightFocus = ' data-sn-right="null" ';
                            else rightFocus = ' data-sn-right="#episode_' + (i + 1) + '" ';

                        } else if (PAGE_INDEX == 3) {
                            id = ' id ="search_episode_' + i + '" ';
                            if (i == 0) leftFocus = ' data-sn-left="null" ';
                            else leftFocus = ' data-sn-left="#search_episode_' + (i - 1) + '" ';

                            if (i == _.size(SELECTED_VIDEO_DATA["series"])) rightFocus = ' data-sn-right="null" ';
                            else rightFocus = ' data-sn-right="#search_episode_' + (i + 1) + '" ';
                        }

                        str += '<li class="focusable" tabindex="12" data-sn-up="null" data-sn-down="null" ' + id + leftFocus + rightFocus + '><div class="episode_image_box">';
                        str += '<div class="episode_thumbnail_image"><img src="' + APP_IMAGE_URL + SELECTED_VIDEO_DATA["poster"] + '" alt="Episode' + (i + 1) + '"></div>';
                        str += '<div class="episode_title">Episode ' + (i + 1) + '</div></div></li>';

                    }

                    if (PAGE_INDEX == 1) {
                        $("#episode_list").append(str);
                        $("#loader").hide();
                        $(".episode_list").show();
                        SN.focus("episode_list");
                    } else if (PAGE_INDEX == 3) {
                        $("#search_result_episode_list").append(str);
                        $("#search_loader").hide();
                        $("#search_tv_channels").hide();
                        $("#search_videos").hide();
                        $("#search_result_episode_container").show();
                        SN.focus("search_result_episode_list");
                    }
                    addEventListeners();
                } else console.log("Error: ", response);
            },
            error: function (xhr, error) {
                console.log("error", error);
                if (xhr.status > 499 && xhr.status < 600) {
                    msg = NET_CONNECTION_ERR;
                    hide_show_modal(true, "RETRY_EXIT", msg);
                }
            }
        });
    }
}

function get_searched_channel() {
    var searchText = get_searched_text();
    if (searchText) {
        $.ajax({
            type: 'GET',
            url: APP_STALKER_URL + "/stalker_portal/api/v2/" + STALKER_USER_ID + "/tv-channels?q=" + searchText,
            headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
            dataType: "json",
            async: true,
            cache: false,
            success: function (response) {
                var str = '',
                    id = '',
                    leftFocus = '',
                    rightFocus = '';

                SEARCHED_TV_CHANNELS_LIST = response.results;

                if ((response.status == "OK") && _.size(response.results) > 0) {

                    for (var i = 0; i < SEARCHED_TV_CHANNELS_LIST.length; i++) {

                        id = 'id ="channel_result_' + i + '"';

                        if (i == 0) leftFocus = 'data-sn-left="#search"';
                        else leftFocus = 'data-sn-left="#channel_result_' + (i - 1) + '"';

                        if (i == SEARCHED_TV_CHANNELS_LIST.length) rightFocus = 'data-sn-right="null"';
                        else rightFocus = 'data-sn-right="#channel_result_' + (i + 1) + '"';
                        var flagImage = 'images/default.png';
                        if (SEARCHED_TV_CHANNELS_LIST[i]["logo"]) flagImage = APP_IMAGE_URL + SEARCHED_TV_CHANNELS_LIST[i]["logo"];

                        str += '<li class="focusable" tabindex="13" data-sn-up="#searchInputText" ' + id + leftFocus + rightFocus + ' data-id="' + SEARCHED_TV_CHANNELS_LIST[i]["id"] + '"><div class="search_image_box">';
                        str += '<div class="logo_box"><img src="' + flagImage + '" alt="' + SEARCHED_TV_CHANNELS_LIST[i]["name"] + '"></div>';
                        str += '<div class="searched_channel_name">' + SEARCHED_TV_CHANNELS_LIST[i]["name"] + '</div></div></li>';

                    }

                    $("#tv_channel_result_heading").text("TV Channels Matching Results(" + SEARCHED_TV_CHANNELS_LIST.length + ")");
                    $("#channel_result").append(str);
                    $(".search_result_container").show();
                    $("#search_tv_channels").show();
                    $("#search_loader").hide();
                    addEventListeners();
                    setTimeout(function () {
                        SN.focus("channel_result");
                        playDefaultSearchChannel("channel_result_0");
                    }, 200);
                    $(".channel_search_details").show();
                    get_searched_vod();
                    // search_screen_next_previous_item("channel_result");
                } else {
                    get_searched_vod();
                    $("#tv_channel_result_heading").text("TV Channels Matching Results(0)");
                    $("#search_result_left_shadow_box_CHA, #search_result_right_shadow_box_CHA").hide();
                    $("#channel_result").html('<div class="search_channel_vod_result_not_found">No match found</div>');
                    $("#search_tv_channels").show();
                }
            },
            error: function (xhr, error) {
                console.log("error", error);
                if (xhr.status > 499 && xhr.status < 600) {
                    msg = NET_CONNECTION_ERR;
                    hide_show_modal(true, "RETRY_EXIT", msg);
                }
            }
        });
    }
}


function get_searched_vod() {
    var searchText = get_searched_text();
    if (searchText) {
        $.ajax({
            type: 'GET',
            url: APP_STALKER_URL + "/stalker_portal/api/v2/" + STALKER_USER_ID + "/video?q=" + searchText,
            headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
            dataType: "json",
            async: true,
            cache: false,
            success: function (response) {
                var str = '',
                    id = '',
                    upFocus = '',
                    leftFocus = '',
                    rightFocus = '';

                SEARCHED_VIDEO_LIST = response.results;

                if ((response.status == "OK") && _.size(response.results) > 0) {

                    for (var i = 0; i < SEARCHED_VIDEO_LIST.length; i++) {

                        id = 'id ="video_result_' + i + '" ';

                        if (i == 0) leftFocus = 'data-sn-left="#search"';
                        else leftFocus = 'data-sn-left="#video_result_' + (i - 1) + '" ';

                        if (i == SEARCHED_VIDEO_LIST.length) rightFocus = 'data-sn-right="null" ';
                        else rightFocus = 'data-sn-right="#video_result_' + (i + 1) + '" ';

                        if (SEARCHED_TV_CHANNELS_LIST.length < 1) upFocus = 'data-sn-up="#searchInputText"';
                        else upFocus = 'data-sn-up="nul"';
                        var flagImage = 'images/default.png';
                        if (SEARCHED_VIDEO_LIST[i]["cover"]) flagImage = APP_IMAGE_URL + SEARCHED_VIDEO_LIST[i]["cover"];

                        str += '<li class="focusable search_video_list" tabindex="14"  data-sn-down="null" ' + id + upFocus + leftFocus + rightFocus + '><div class="search_thumbmnail_poster">';
                        str += '<img src="' + flagImage + '" alt="' + SEARCHED_VIDEO_LIST[i]["name"] + '">';
                        str += '</div></li>';

                    }

                    $("#video_result_heading").text("Video Matching Results(" + SEARCHED_VIDEO_LIST.length + ")");
                    $("#video_result").append(str);
                    $(".search_result_container").show();
                    $("#search_tv_channels").show();
                    $("#search_videos").show();
                    $("#search_loader").hide();
                    addEventListeners();
                    if (_.size(SEARCHED_TV_CHANNELS_LIST) < 1) {
                        SN.focus("video_result");
                        playDefaultSearchVideo("video_result_0")
                    }
                    // search_screen_next_previous_item("video_result");

                } else {
                    $("#video_result_heading").text("Videos Matching Results(0)");
                    $("#search_result_left_shadow_box_VOD, #search_result_right_shadow_box_VOD").hide();
                    $("#video_result").html('<div class="search_channel_vod_result_not_found">No match found</div>');
                    $("#search_tv_channels").show();
                    $("#search_videos").show();
                    $("#search_loader").hide();
                }

                if (_.size(SEARCHED_TV_CHANNELS_LIST) < 1 && _.size(SEARCHED_VIDEO_LIST) < 1) {
                    $(".result_not_found").text("Sorry No Match Found").show();
                    $("#search_loader").hide();
                    SN.focus("#searchInputText");
                }
            },
            error: function (xhr, error) {
                console.log("error", error);
                if (xhr.status > 499 && xhr.status < 600) {
                    msg = NET_CONNECTION_ERR;
                    hide_show_modal(true, "RETRY_EXIT", msg);
                }
            }
        });
    }
}


function get_player_channel_epg(channelId) {
    $.ajax({
        type: 'GET',
        url: APP_STALKER_URL + "/stalker_portal/api/v2/tv-channels/" + channelId + "/epg?next=4",
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN, },
        dataType: "json",
        async: true,
        cache: false,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    var epgdata = response.results;
                    var str = '',
                        color = '';
                    for (var i = 0; i < 2; i++) {
                        if (epgdata[i]) {
                            var date = new Date(epgdata[i]['start'] * 1000);
                            if (i == 0) color = '';
                            else color = 'fade';
                            str += '<div class="channel_scheduled"><span class="time">' + formatAMPM(date) + '</span><span class="' + color + '">- ' + epgdata[i]['name'] + '</span></div>';
                        }
                    }

                    $("#expend_channel_scheduled").html(str);
                    addEventListeners();
                } else {
                    $("#expend_channel_scheduled").html('');
                }
            } else {
                console.log("EPG error", response);
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function add_favorite_channel(ch_id) {
    if (ch_id) {
        $.ajax({
            type: 'POST',
            url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-favorites",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Authorization": STALKER_TOKEN, },
            async: true,
            cache: false,
            data: {
                'ch_id': ch_id
            },
            success: function (response) {
                if (response.results) {
                    $("#player_fav").addClass("added").text("-FAV");
                } else console.log("Not added.");
            },
            error: function (xhr, error) {
                console.log("error", error);
            }
        });
    }
}

function remove_favorite_channel(ch_id) {
    if (ch_id) {
        $.ajax({
            type: 'DELETE',
            url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-favorites/" + ch_id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Authorization": STALKER_TOKEN, },
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: 'json',
            async: true,
            cache: false,
            success: function (response) {
                if (response.results) {
                    $("#player_fav").removeClass("added").text("+ FAV");
                } else console.log("Not removed.");
            },
            error: function (xhr, error) {
                console.log("error", error);
            }
        });
    }
}

function recreateFavoriteChannelList() {
    $.ajax({
        type: "GET",
        url: APP_STALKER_URL + "/stalker_portal/api/v2/users/" + STALKER_USER_ID + "/tv-favorites",
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240, "Authorization": STALKER_TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.status == "OK") {
                if (_.size(response.results) > 0) {
                    FAVORITE_LIST = response.results;
                    if (response.status == "OK") {
                        var id = "",
                            rigthFocus = "",
                            leftFocus = "",
                            upFocus = "",
                            downFocus = "",
                            str = "";
                        $("#favorite_list_0").html("");

                        for (var index = 0; index < _.size(FAVORITE_LIST); index++) {
                            FAVORITE_DATA[FAVORITE_LIST[index]] = APP_CHANNEL_DATA[FAVORITE_LIST[index]];

                            if (APP_CHANNEL_DATA[FAVORITE_LIST[index]] !== undefined) {
                                APP_CHANNEL_DATA_ARRAY["favorite"][index] = APP_CHANNEL_DATA[FAVORITE_LIST[index]];
                                var element = APP_CHANNEL_DATA[FAVORITE_LIST[index]];

                                id = 'fav_channel_' + 0 + '_' + index;
                                var flagImage = 'images/default.png';
                                if (element['logo']) flagImage = APP_IMAGE_URL + element['logo'];

                                upFocus = " data-sn-up='null'";
                                downFocus = " data-sn-down='null'";

                                if (index == _.size(FAVORITE_LIST)) rigthFocus = " data-sn-right='null'";
                                else rigthFocus = " data-sn-right='#fav_channel_" + 0 + '_' + (index + 1) + "'";

                                if (index == 0) leftFocus = "data-sn-left='#tv_channel'";
                                else leftFocus = " data-sn-left='#fav_channel_" + 0 + '_' + (index - 1) + "'";

                                str += '<li class="focusable" tabindex="17" id="' + id + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' data-id="' + element["id"] + '">';
                                str += '<div class="image_box"><div class="channel_logo_box" ><img src="' + flagImage + '" alt="' + element['name'] + '"></div><div class="channel">' + element['name'] + '</div></div>';
                                str += '</li>';
                            }
                        }

                        $("#favorite_list_0").append(str);
                        addEventListeners();
                    } else {
                        console.log("favorite error", response);
                    }
                } else {
                    $("#favorite_list").html('<li class="favorite_not_found"><spna>You do not have favorite channel.</span></li>');
                    $("#favorite_list").hide();
                }
            } else {
                console.log("favorite error", response);
            }
        },
        error: function (xhr, error) {
            console.log("error", error, xhr.status);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}