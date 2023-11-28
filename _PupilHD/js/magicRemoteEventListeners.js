/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
document.addEventListener("cursorStateChange", onCursor, false);
document.addEventListener("visibilitychange", visibilitychange, false);
window.addEventListener("blur", function () { console.log("Focus off"); }, false);
window.addEventListener("focus", function () { console.log("Focus on"); }, false);

function onCursor(event) {
    console.log(event);
    if (event.detail.visibility)
        console.log("Cursor on");
    else
        console.log("Cursor off");
}
function visibilitychange(event) {
    console.log(document.visibilityState);
}

function addEventListeners() {
    var itemArray = document.getElementsByClassName("focusable");

    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    var elementId = this.id;
    console.log(elementId + " is clicked!");

    if ($(".modal_container").hasClass("active")) {
        var modalName = $(".modal_container").attr("data-modal-name");
        console.log("modalName", modalName);
        if (modalName == "EXIT") {
            if (elementId == "noButton") {
                console.log('hide popup');
                hide_show_modal(false, 'EXIT');

                var className = '';
                if (PAGE_INDEX == 0) className = 'home_container';
                else if (PAGE_INDEX == 1) className = 'video_library_container';
                else if (PAGE_INDEX == 2) className = 'episode_container';
                else if (PAGE_INDEX == 3) className = 'search_container';
                else if (PAGE_INDEX == 4) className = 'account_container';
                else if (PAGE_INDEX == 5) className = 'setting_container';
                remove_add_active_class(className);
                $(".menu_container").addClass("active");
                $(".menu_container").removeClass("toggle_menu");
                SN.focus("left_sidebar");
            }
            else if (elementId == "yesButton") {
                console.log('hide popup');
                if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                window.close();
            }
        } else if (modalName == "RETRY_CANCEL") {
            hide_show_modal(false, modalName);
            if (elementId == "retryButton") {
                setTimeout(function () { load_video(); }, 100);
            } else if (elementId == "cancelButton") {
                closeVideo();
            }
        } else if (modalName == "RETRY_EXIT") {
            if (elementId == "retryButton") {
                console.log('hide popup');
                hide_show_modal(false, modalName);
            } else if (elementId == "cancelButton") {
                console.log('exit app');
                // if (TAB_INDEX != -1) closeVideo();
                if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                window.close();
            }
        }
    } else if ($(".video_container").hasClass("active") && $("#video_container").css("display") == "block" && (TAB_INDEX == 6)) {
        if (elementId == "playPreviousVideo") {
            previous_next_video(type = "previous");

        } else if (elementId == "playPauseVideo") {
            if ($("#video_container").css('display') == 'block') {
                if (VIDEO_PLAYER.paused) {
                    $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png');
                    $(".video-title").text('');
                    if (VIDEO_PLAYER.paused) {
                        var currentTime = VIDEO_PLAYER.getCurrentTime();
                        var forwardTime = sessionStorage.video_forward_time;
                        var resultant = parseInt(forwardTime) - parseInt(currentTime);
                        var resultantTime = Math.abs(resultant);

                        if (sessionStorage.FWD_RWD_key_press == 1) {
                            if (resultant > 0) {
                                resultantTime = parseInt(resultantTime - 5000);
                                jumpForwardVideo(resultantTime);
                            } else {
                                resultantTime = parseInt(resultantTime + 5000);
                                if (currentTime - resultantTime < 0) resultantTime = currentTime;
                                jumpBackwardVideo(resultantTime);
                            }
                            sessionStorage.FWD_RWD_key_press = 0;
                        } else {
                            if (VIDEO_PLAYER.paused) {
                                try {
                                    playVideo();
                                    VIDEO_PLAYER.play();
                                } catch (e) {
                                    playVideo();
                                    VIDEO_PLAYER.play();
                                    console.log("error in play video: " + e);
                                }
                            } else if (VIDEO_PLAYER.play) {
                                pauseVideo();
                                VIDEO_PLAYER.pause();
                            }
                        }
                    }

                } else if (VIDEO_PLAYER.play) {
                    pauseVideo();
                    VIDEO_PLAYER.pause();
                }
            }

        } else if (elementId == "playNextVideo") {
            previous_next_video(type = "next");
        }
    } else if ($(".login_container").hasClass("active") && (PAGE_INDEX == 0)) {
        console.log("login page", elementId);

        if (elementId == "loginButton") {
            console.log("login button enter");
            var userName = document.getElementById('userName').value;
            var password = document.getElementById('password').value;

            if (userName == '') {
                console.log("USERNAME empty.");
                login_error_message("Username empty", "Username is required.")
            } else if (password == '') {
                console.log("password empty.");
                login_error_message("Password empty", "Password is required.")
            } else if (userName && password) {
                localStorage.setItem('pupilhd_app_user_name', userName);
                localStorage.setItem('pupilhd_app_password', password);
                loginApi();
            }
        } else if (elementId == "forgotPass") {
            $(".pop-up-box").show();
            SN.focus("forgot_pass_popup");
        } else if (elementId == "ok_popup") {
            $(".pop-up-box").hide();
            SN.focus("#forgotPass");
        }
    } else if ($(".home_container").hasClass("active") && PAGE_INDEX == 0) {
        var dataId = $("#" + this.id).attr("data-id");
        FIRST_PAGE_SELECTED_ITEM = elementId;
        PAGE_INDEX = MENU_INDEX = TAB_INDEX = 0;
        SELECTED_CHANNEL_TYPE = "CHA";
        var index = SELECTED_CHANNEL_INDEX = $("#" + elementId).index();
        var countryName = SELECTED_CAT_INDEX = $("#" + elementId).parent().attr("data-name");
        SELECTED_CHANNEL_ROW = $("#" + elementId).parent().attr("id");
        if (TIMER) {
            clearTimeout(TIMER); //cancel the previous TIMER.
            TIMER = null;
        }

        if ((elementId == "channel_input") && $("#searchInputText").is(":focus") && PREVIEW_FULL_DISPLAY) {
            play_live_by_channel_number();
        }
        else if ((elementId == "player_fav") && PREVIEW_FULL_DISPLAY && (SELECTED_CHANNEL_TYPE == "CHA")) {
            var channelId = $("#" + elementId).attr("data-id");
            if ($("#" + elementId).hasClass("added")) remove_favorite_channel(channelId);
            else add_favorite_channel(channelId);
            recreateFavoriteChannelList();
        }
        else if ($('#' + elementId).attr("data-channel")) {
            var channel_id = APP_CHANNEL_DATA_ARRAY[countryName][index]["id"];
            console.log("country item clicked");
            if ($("#" + elementId).hasClass("selected_channel")) {
                console.log($(".videoPlayer").removeClass("video_box").addClass("video_box_expand"));
                PREVIEW_FULL_DISPLAY = true;
                $(".video_gradient_box").css("display", "none");
                $("#preview_video_container").addClass("video_resize");
                $("#preview-player,  #previewVideoPlayer1 video").css({
                    "width": "1920px",
                    "height": "1080px"
                });
                $("#player_fav").attr("data-id", APP_CHANNEL_DATA_ARRAY[countryName][index]["id"]);

                get_player_channel_epg(APP_CHANNEL_DATA_ARRAY[countryName][index]["id"]);

                $("#player_channel_name").text(APP_CHANNEL_DATA_ARRAY[countryName][index]['number'] + ". " + APP_CHANNEL_DATA_ARRAY[countryName][index]['name']);

                if (APP_CHANNEL_DATA_ARRAY[countryName][index]['favorite'] || typeof FAVORITE_DATA[channel_id] !== 'undefined') {
                    $("#player_fav").addClass("added");
                    $("#player_fav").text("- FAV");
                }
                else {
                    $("#player_fav").removeClass("added");
                    $("#player_fav").text("+ FAV");
                }

                if (APP_CHANNEL_DATA_ARRAY[countryName][index]['hd'] != 0) $("#player_hd").show();
                else $("#player_hd").hide();
                var onError = "this.src='./images/default.png'";
                $("#channel_logo_expend").html('<img src="' + APP_STALKER_URL + APP_CHANNEL_DATA_ARRAY[countryName][index]['logo'] + '" alt="' + APP_CHANNEL_DATA_ARRAY[countryName][index]["name"] + '" onerror=' + onError + '><span>' + APP_CHANNEL_DATA_ARRAY[countryName][index]["name"] + '</span>');

                $("#video_content_details").show();
                PREVIEW_FULL_DISPLAY = true;
                SN.focus("favorite_button");

                TIMER = setTimeout(function () {
                    $("#video_content_details").hide();
                    if (PREVIEW_FULL_DISPLAY) SN.focus("previewVideoPlayer");
                }, 3000);
            } else {
                SELECTED_CHANNEL_NUMBER = APP_CHANNEL_DATA_ARRAY[countryName][index]['number'];
                $('.selected_channel').removeClass('selected_channel');
                $("#" + elementId).addClass("selected_channel");
                $("#selected_channel_name").text(APP_CHANNEL_DATA_ARRAY[countryName][index]['number'] + ". " + APP_CHANNEL_DATA_ARRAY[countryName][index]['name']);
                $("#selected_channel_country").text(APP_CHANNEL_DATA_ARRAY[countryName][index]['country_id']);
                $("#selected_channel_language").text(APP_CHANNEL_DATA_ARRAY[countryName][index]['language_id']);
                get_channel_epg(APP_CHANNEL_DATA_ARRAY[countryName][index]['id']);

                if (APP_CHANNEL_DATA_ARRAY[countryName][index]['favorite']) $(".fav").css("display", "inline-block");
                else $(".fav").hide();

                if (APP_CHANNEL_DATA_ARRAY[countryName][index]['hd'] != 0) $(".hd").css("display", "inline-block");
                else $(".hd").hide();

                // VIDEO_PLAYER.pause();
                VOD_URL = APP_CHANNEL_DATA_ARRAY[countryName][index]['url'];
                load_preview_player();
            }

        }
        else if ($('#' + elementId).attr("data-id")) {
            console.log("fav item clicked");
            if ($("#" + elementId).hasClass("selected_channel")) {
                $(".video_gradient_box").css("display", "none");
                $("#preview_video_container").removeClass("video-player-minimize").addClass("video_resize");
                $("#preview-player,  #previewVideoPlayer1 video").css({
                    "width": "1920px",
                    "height": "1080px"
                });

                $("#player_fav").attr("data-id", dataId);

                get_player_channel_epg(dataId);

                $("#player_channel_name").text(FAVORITE_DATA[dataId]['number'] + ". " + FAVORITE_DATA[dataId]['name']);

                if (FAVORITE_DATA[dataId]['favorite'] || typeof FAVORITE_DATA[dataId] !== 'undefined') {
                    $("#player_fav").addClass("added");
                    $("#player_fav").text("- FAV");
                }
                else {
                    $("#player_fav").removeClass("added");
                    $("#player_fav").text("+ FAV");
                }

                if (FAVORITE_DATA[dataId]['hd'] != 0) $("#player_hd").show();
                else $("#player_hd").hide();
                var onError = "this.src='./images/default.png'";
                $("#channel_logo_expend").html('<img src="' + APP_STALKER_URL + FAVORITE_DATA[dataId]['logo'] + '" alt="' + FAVORITE_DATA[dataId]["name"] + '" onerror=' + onError + '><span>' + FAVORITE_DATA[dataId]["name"] + '</span>');

                $("#video_content_details").show();
                PREVIEW_FULL_DISPLAY = true;
                SN.focus("favorite_button");

                TIMER = setTimeout(function () {
                    console.log("hide player bottom bar");
                    $("#video_content_details").hide();
                    if (PREVIEW_FULL_DISPLAY) SN.focus("previewVideoPlayer");
                }, 3000);
            } else {
                $('.selected_channel').removeClass('selected_channel');
                SELECTED_CHANNEL_TYPE = "FAV";
                $("#" + elementId).addClass("selected_channel");
                $("#selected_channel_name").text(FAVORITE_DATA[dataId]['number'] + ". " + FAVORITE_DATA[dataId]['name']);
                $("#selected_channel_country").text(FAVORITE_DATA[dataId]['country_id']);
                $("#selected_channel_language").text(FAVORITE_DATA[dataId]['language_id']);
                get_channel_epg(FAVORITE_DATA[dataId]['id']);

                if (FAVORITE_DATA[dataId]['favorite']) $(".fav").css("display", "inline-block");
                else $(".fav").hide();

                if (FAVORITE_DATA[dataId]['hd'] != 0) $(".hd").css("display", "inline-block");
                else $(".hd").hide();

                // VIDEO_PLAYER.pause();
                VOD_URL = FAVORITE_DATA[dataId]['url'];
                load_preview_player();
            }
        }
    } else if ($(".video_library_container").hasClass("active") && (PAGE_INDEX == 1 || PAGE_INDEX == 2)) {
        if ($('#' + elementId).parent().parent().parent().attr("data-category") && $("#video_list").css("display") == "block") {
            SECOND_PAGE_SELECTED_ITEM = elementId;
            PAGE_INDEX = MENU_INDEX = TAB_INDEX = 1;
            if ($('#' + elementId).is(":focus")) {
                var index = $("li#" + elementId).index();
                var categoryName = $("#" + elementId).parent().parent().parent().attr("data-category");
                if (TIMER) {
                    clearTimeout(TIMER); //cancel the previous TIMER.
                    TIMER = null;
                }
                if ($("#" + elementId).hasClass("selected_video") && (_.size(APP_CAT_VIDEO_ARRAY[categoryName][index]['series']) > 0)) {
                    $("#video_list").hide();
                    $(".episode_container").show();
                    $("#loader").show();
                    SELECTED_VIDEO_DATA = {};
                    SECOND_PAGE_SELECTED_SHOW_CATEGORY = categoryName;
                    SELECTED_VIDEO_DATA = APP_CAT_VIDEO_ARRAY[categoryName][index];
                    video_category_change();
                    $("#episode_list").html("");
                    $(".episode_list").hide();
                    get_episode_url(0);

                } else if ($("#" + elementId).hasClass("selected_video") && (_.size(APP_CAT_VIDEO_ARRAY[categoryName][index]['series']) == 0)) {

                    // VIDEO_PLAYER.pause();
                    VOD_COUNTER = index;
                    VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['url'];
                    SELECTED_VIDEO_DATA = APP_CAT_VIDEO_ARRAY[categoryName][index];
                    show_hide_show_deatils(true);
                    if (PREVIEW_PLAYER) {
                        // PREVIEW_PLAYER.setSrc("");
                        // PREVIEW_PLAYER.pause();
                        // PREVIEW_PLAYER.remove();
                        try {
                            PREVIEW_PLAYER.pause();
                            PREVIEW_PLAYER.remove();
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    setTimeout(function () {
                        PLAYER_STATE = 1;
                        load_video();
                    }, 1000);

                } else if ($('#' + elementId).is(":focus") && PAGE_INDEX == 1 && $("#" + elementId).parent().parent().parent().attr("data-category")) {
                    $(".selected_video").removeClass("selected_video");
                    $("#" + elementId).addClass("selected_video");
                    $("#video_name").text(APP_CAT_VIDEO_ARRAY[categoryName][index]['name']);
                    if (_.size(APP_CAT_VIDEO_ARRAY[categoryName][index]['series']) > 0) {
                        $("#vod_time").hide();
                        $("#vod_type").css("display", "inline-block");
                        $("#count").text(_.size(APP_CAT_VIDEO_ARRAY[categoryName][index]['series']))
                    } else {
                        $("#count").text("");
                        $("#vod_time").show();
                        $("#vod_type").hide();
                        $("#vod_time").text(APP_CAT_VIDEO_ARRAY[categoryName][index]['time'] + "m");
                    }

                    // show_hide_show_deatils(true);
                    $("#vod_year").text(APP_CAT_VIDEO_ARRAY[categoryName][index]['year']);
                    $("#vdo_country").text(APP_CAT_VIDEO_ARRAY[categoryName][index]['country']);
                    $("#vod_genre").text(APP_CAT_VIDEO_ARRAY[categoryName][index]['genres']);
                    $("#vod_rating").text(APP_CAT_VIDEO_ARRAY[categoryName][index]['rating_mpaa']);
                    $("#director_name").text(APP_CAT_VIDEO_ARRAY[categoryName][index]["director"]);
                    $("#actors").text(APP_CAT_VIDEO_ARRAY[categoryName][index]["actors"]);
                    $("#video_desc").text(APP_CAT_VIDEO_ARRAY[categoryName][index]["description"]);

                    if (APP_CAT_VIDEO_ARRAY[categoryName][index]['hd'] != 0) $(".vod_hd").css("display", "inline-block");
                    else $(".vod_hd").hide();

                    if (APP_CAT_VIDEO_ARRAY[categoryName][index]['favorite']) $(".fav").css("display", "inline-block");
                    else $(".fav").hide();

                    $("div#video-preview-player").empty();
                    $("div#video-preview-player").html('<img src="' + APP_STALKER_URL + APP_CAT_VIDEO_ARRAY[categoryName][index]["poster"] + '" alt="' + APP_CAT_VIDEO_ARRAY[categoryName][index]["name"] + '">');

                    //play preview video
                    if (APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url']) {
                        TIMER = setTimeout(function () {
                            PREVIEW_PLAYER = "";
                            $("div#video-preview-player").empty();
                            $("div#video-preview-player").load("preview-video-player.html");
                            VOD_URL = APP_CAT_VIDEO_ARRAY[categoryName][index]['promo_url'];
                            load_preview_player();
                        }, 5000);
                    }
                }
            }
        }
        else if (($(".episode_container").css("display") == "block")) {
            console.log("episode list......");
            PAGE_INDEX = MENU_INDEX = TAB_INDEX = 2;
            THIRD_PAGE_SELECTED_ITEM = elementId;
            var index = $("#" + elementId).index();
            SELECTED_EPIOSDE_NUMBER = index + 1;
            if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
            if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
            VOD_COUNTER = index;
            VOD_URL = SELECTED_EPISODES[index];
            setTimeout(function () {
                PLAYER_STATE = 1;
                load_video();
                show_hide_show_deatils(true);
                sendMediaInfo("video", SELECTED_VIDEO_DATA["id"]);
            }, 1000);
        }
    } else if ($(".search_container").hasClass("active") && PAGE_INDEX == 3) {
        console.log("search result item selected....");
        MENU_INDEX = TAB_INDEX = PAGE_INDEX = 3;
        if (elementId == "searchInputText" && $("#searchInputText").is(":focus")) {
            console.log("Show results.");
            request_search_results();
        }
        else if ($('#' + elementId).parent().attr("id") == "channel_result") {
            console.log("Action on channel search list");
            var i = $("#" + elementId).index();
            SELECTED_CHANNEL_TYPE = "CHA";
            if ($("#" + elementId).hasClass("selected_searched_item")) {
                console.log("go to full screen");
                FOURTH_PAGE_SELECTED_ITEM = elementId;
                $(".searchbar_box").css("display", "none");
                $(".video_gradient_box").css("display", "none");
                PREVIEW_FULL_DISPLAY = true;
                $("#preview_video_container").addClass("video_resize");
                $("#preview-player,  #previewVideoPlayer1 video").css({
                    "width": "1920px",
                    "height": "1080px"
                });
                $("#preview_video_container").removeClass("video-player-minimize").addClass("video-player-expand");
                // $(".preview-video-buffered").removeClass("live-preview-player-loader").addClass("live-main-player-loader");
                $("#previewVideoPlayer1").removeClass("video_box").addClass("video_box_expand");
                $(".video_player_error_message").addClass("expand_preview_error_msg");
                $("#player_fav").attr("data-id", SEARCHED_TV_CHANNELS_LIST[i]["id"]);
                get_player_channel_epg(SEARCHED_TV_CHANNELS_LIST[i]["id"]);

                $("#player_channel_name").text(SEARCHED_TV_CHANNELS_LIST[i]['number'] + ". " + SEARCHED_TV_CHANNELS_LIST[i]['name']);

                if (SEARCHED_TV_CHANNELS_LIST[i]['favorite']) $("#player_fav").text("- FAV");
                else $("#player_fav").text("+ FAV");

                if (SEARCHED_TV_CHANNELS_LIST[i]['hd'] != 0) $("#player_hd").show();
                else $("#player_hd").hide();
                var onError = "this.src='./images/default.png'";
                $("#channel_logo_expend").html('<img src="' + APP_STALKER_URL + SEARCHED_TV_CHANNELS_LIST[i]["logo"] + '" alt="' + APP_CHANNEL_DATA_ARRAY[countryName][index]["name"] + '"  onerror=' + onError + '> <span>' + SEARCHED_TV_CHANNELS_LIST[i]["name"] + '</span>');

                $("#video_content_details").show();
                PREVIEW_FULL_DISPLAY = true;
                SN.focus("favorite_button");
            } else if (!$("#" + elementId).hasClass("selected_searched_item")) {
                console.log("saerch channel item clicked");
                $(".selected_searched_item").removeClass("selected_searched_item");
                $("#" + elementId).addClass("selected_searched_item");
                $("#channel_result_name").text(SEARCHED_TV_CHANNELS_LIST[i]["number"] + ". " + SEARCHED_TV_CHANNELS_LIST[i]["name"]);
                $("#channel_result_country").text(SEARCHED_TV_CHANNELS_LIST[i]["country_id"]);
                $("#channel_result_lang").text(SEARCHED_TV_CHANNELS_LIST[i]["language_id"]);

                if (SEARCHED_TV_CHANNELS_LIST[i]["hd"]) $("#channel_result_hd").css("display", "inline-block");
                else $("#channel_result_hd").css("display", "none");
                if (SEARCHED_TV_CHANNELS_LIST[i]["favorite"]) $("#channel_result_fav").css("display", "inline-block");
                else $("#channel_result_fav").css("display", "none");

                $("#video_search_details").hide();
                $("#channel_search_details").show();
                $("#" + elementId).addClass("selected_searched_item");

                // reset_preview_player(false);
                // $("div#searchpage_player").load("preview-video-player.html");
                if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                VOD_URL = SEARCHED_TV_CHANNELS_LIST[i]["url"];
                load_preview_player();
            }
        } else if ($('#' + elementId).parent().attr("id") == "video_result") {
            console.log("search video library item enter....");

            FOURTH_PAGE_SELECTED_ITEM = elementId;
            var index = $("#" + elementId).index();
            if ($("#" + elementId).hasClass("selected_searched_item") && (_.size(SEARCHED_VIDEO_LIST[index]['series']) == 0)) {
                console.log("load full screen player");
                if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                // reset_preview_player(false);
                VOD_COUNTER = 0;
                VOD_URL = SEARCHED_VIDEO_LIST[index]['url'];
                show_hide_video_container();
                setTimeout(function () {
                    PLAYER_STATE = 1;
                    load_video();
                }, 1000);
            } else if ($("#" + elementId).hasClass("selected_searched_item") && (_.size(SEARCHED_VIDEO_LIST[index]['series']) > 0)) {
                $("#video_list").hide();
                $(".episode_container").show();
                $("#loader").show();
                SELECTED_VIDEO_DATA = {};
                SECOND_PAGE_SELECTED_SHOW_CATEGORY = SEARCHED_VIDEO_LIST[index]["category"];
                SELECTED_VIDEO_DATA = SEARCHED_VIDEO_LIST[index];
                video_category_change();
                $("#search_result_episode_list").html("");
                get_episode_url(0);
            } else if ($('[id^=video_result_]').is(":focus")) {
                $(".selected_searched_item").removeClass("selected_searched_item");
                $("#" + elementId).addClass("selected_searched_item");
                SELECTED_VIDEO_DATA = SEARCHED_VIDEO_LIST[index];

                $("#video_result_name").text(SEARCHED_VIDEO_LIST[index]["name"]);
                if (_.size(SEARCHED_VIDEO_LIST[index]['series']) > 0) {
                    $("#video_result_time").hide();
                    $("#result_vod_type").css("display", "inline-block");
                    $("#result_count").text(_.size(SEARCHED_VIDEO_LIST[index]['series']))
                } else {
                    $("#result_count").text("");
                    $("#vod_time").show();
                    $("#result_vod_type").hide();
                    $("#video_result_time").text(SEARCHED_VIDEO_LIST[index]['time'] + "m").show();
                }

                $("#video_result_year").text(SEARCHED_VIDEO_LIST[index]["year"]);
                $("#video_result_country").text(SEARCHED_VIDEO_LIST[index]["country"]);
                $("#video_result_genre").text(SEARCHED_VIDEO_LIST[index]["genres"]);
                $("#video_result_rating").text(SEARCHED_VIDEO_LIST[index]["rating_mpaa"]);
                $("#video_result_director").text(SEARCHED_VIDEO_LIST[index]["director"]);

                if (SEARCHED_VIDEO_LIST[index]["hd"]) $("#video_result_quality").show();
                else $("#video_result_quality").hide();
                if (SEARCHED_VIDEO_LIST[index]["favorite"]) $("#channel_result_fav").show();
                else $("#channel_result_fav").hide();

                $("#" + elementId).addClass("selected_searched_item");
                $("div#searchpage_player").empty();
                $("div#searchpage_player").html('<img src="' + APP_STALKER_URL + SEARCHED_VIDEO_LIST[index]["poster"] + '" alt="' + SEARCHED_VIDEO_LIST[index]["name"] + '"/>');

                if ($("#" + elementId).hasClass("selected_searched_item")) {
                    if (TIMER) {
                        clearTimeout(TIMER); //cancel the previous TIMER.
                        TIMER = null;
                    }
                    if (SEARCHED_VIDEO_LIST[index]["promo_url"]) {
                        TIMER = setTimeout(function () {
                            PREVIEW_PLAYER = "";
                            $("div#searchpage_player").empty();
                            $("div#searchpage_player").load("preview-video-player.html");
                            if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                            if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                            VOD_URL = SEARCHED_VIDEO_LIST[index]["promo_url"];
                            load_preview_player();
                        }, 5000);
                    }
                }
                $("#channel_search_details").hide();
                $("#video_search_details").show();
            }
        } else if (elementId == "player_fav" && PREVIEW_FULL_DISPLAY) {
            console.log("channel added...");
            if (SELECTED_CHANNEL_TYPE == "CHA") {
                console.log("channel added...");
                var channelId = $("#" + this.id).attr("data-id");
                if ($("#" + this.id).hasClass("added")) remove_favorite_channel(channelId);
                else add_favorite_channel(channelId);
                getFavoriteChannelList();
            } else {
                console.log("it is not CHA");
            }
        } else if (($('#' + elementId).parent().attr("id") == "search_result_episode_list") && $(".search_episode_list_container").css("display") == "block") {
            PAGE_INDEX = MENU_INDEX = TAB_INDEX = 3;
            var index = $("#" + elementId).index();
            SELECTED_EPIOSDE_NUMBER = index + 1;
            if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
            if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
            VOD_COUNTER = index;
            VOD_URL = SELECTED_EPISODES[index];
            setTimeout(function () {
                PLAYER_STATE = 1;
                load_video();
                show_hide_show_deatils(true);
                sendMediaInfo("video", SELECTED_VIDEO_DATA["id"]);
            }, 1000);
        } else {
            console.log("search default.");
        }
    } else if ($(".account_container").hasClass("active") && PAGE_INDEX == 4) {
        console.log("account page show...");
        setTimeout(function () {
            if (elementId == "manage") {
                $("#manage_modal").show();
                SN.focus("manage_modal");
            } else if (elementId == "sign_out") {
                $(".logout_modal").show();
                SN.focus("logout_modal");
            } else if (elementId == "manage_popup") {
                $("#manage_modal").hide();
                SN.focus("account_btns");
            } else if (elementId == "no_logout") {
                console.log("nologout btn enter...");
                $(".logout_modal").hide();
                SN.focus("account_btns");
            } else if (elementId == "yes_logout") {
                console.log("yes logout button enter...");
                signOutApp();
            }
        }, 100);
    } else if ($(".setting_container").hasClass("active")) {
        if (elementId == "alphabet" || elementId == "number") {
            if (elementId == 'alphabet') ALPHA_NUMERIC = "ALPHA";
            else if (elementId == 'number') ALPHA_NUMERIC = "NUMERIC";
            localStorage.setItem('pupilhd_app_alpha_numeric', ALPHA_NUMERIC);
            sort_channel_list();
            change_sorting_selection(elementId, 0);
            change_sorting_icon_image(elementId, 0);
        } else if (elementId == "genre" || elementId == "country") {
            COUNTRY_GENRE = SELECTED_COUNTRY_GENRE;
            if (elementId == 'genre') {
                SELECTED_COUNTRY_GENRE = "GENRE";
                $("#genre").attr("data-sn-down", "null");
                $("#country").attr("data-sn-down", "null");
            }
            else if (elementId == 'country') {
                SELECTED_COUNTRY_GENRE = "COUNTRY";
                $("#genre").attr("data-sn-down", "#first_country");
                $("#country").attr("data-sn-down", "#first_country");
            }
            localStorage.setItem('pupilhd_app_country_genre', SELECTED_COUNTRY_GENRE);
            change_sorting_selection(elementId, 1);
            change_sorting_icon_image(elementId, 1);
        } else if ((elementId == 'first_country') || (elementId == 'second_country') || (elementId == 'third_country')) {
            if (SELECTED_COUNTRY_GENRE == "COUNTRY") {
                $("#country_sub_list").hide();
                if (elementId == 'first_country') {
                    set_country_list(18)
                } else if (elementId == 'second_country') {
                    if (_.size(COUNTRY_CHOICE) > 0) set_country_list(19)
                } else if (elementId == 'third_country') {
                    if (_.size(COUNTRY_CHOICE) > 1) set_country_list(20)
                }
            }
        } else if ($("#" + elementId).parent().attr("id") == "first_country_list") {
            var country = $("#" + elementId).attr("data-name");
            if (country == "NULL") {
                $("#first_country_name").text('---');
                $("#second_country_name").text('---');
                $("#third_country_name").text('---');
                $(".selected_country_choice_text").removeClass("selected_country_choice_text");
                COUNTRY_CHOICE = [];
            } else {
                if (COUNTRY_CHOICE[0] != country && COUNTRY_CHOICE[1] != country && COUNTRY_CHOICE[2] != country) {
                    $("#first_country_name").text(country);
                    $("#first_country_name").addClass("selected_country_choice_text");
                    COUNTRY_CHOICE[0] = country;
                }
            }
            localStorage.setItem("pupilhd_app_country_choice", JSON.stringify(COUNTRY_CHOICE));

        } else if ($("#" + elementId).parent().attr("id") == "second_country_list") {
            if (_.size(COUNTRY_CHOICE) > 0) {
                var country = $("#" + elementId).attr("data-name");
                if (country == "NULL") {
                    $("#second_country_name").text('---');
                    $("#third_country_name").text('---');
                    $("#second_country_name").removeClass("selected_country_choice_text");
                    $("#third_country_name").removeClass("selected_country_choice_text");
                    var temp = COUNTRY_CHOICE[0];
                    COUNTRY_CHOICE = [];
                    COUNTRY_CHOICE[0] = temp;
                } else {
                    if (COUNTRY_CHOICE[0] != country && COUNTRY_CHOICE[1] != country && COUNTRY_CHOICE[2] != country) {
                        $("#second_country_name").text(country);
                        $("#second_country_name").addClass("selected_country_choice_text");
                        COUNTRY_CHOICE[1] = country;
                    }
                }
                localStorage.setItem("pupilhd_app_country_choice", JSON.stringify(COUNTRY_CHOICE));
            }

        } else if ($("#" + elementId).parent().attr("id") == "third_country_list") {
            if (_.size(COUNTRY_CHOICE) > 1) {
                var country = $("#" + elementId).attr("data-name");
                if (country == "NULL") {
                    $("#third_country_name").text('---');
                    $("#third_country_name").rempveClass("selected_country_choice_text");
                    var temp1 = COUNTRY_CHOICE[0];
                    var temp2 = COUNTRY_CHOICE[1];
                    COUNTRY_CHOICE = [];
                    COUNTRY_CHOICE[0] = temp1;
                    COUNTRY_CHOICE[1] = temp2;
                } else {
                    if (COUNTRY_CHOICE[0] != country && COUNTRY_CHOICE[1] != country && COUNTRY_CHOICE[2] != country) {
                        $("#third_country_name").text(country);
                        $("#third_country_name").addClass("selected_country_choice_text");
                        COUNTRY_CHOICE[2] = country;
                    }
                }
                localStorage.setItem("pupilhd_app_country_choice", JSON.stringify(COUNTRY_CHOICE));
            }
        }
    } else if ($(".exit_container").hasClass("active")) {
        if (elementId == "exitOk") {
            console.log('exit app');
            if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
            if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
            window.close();
        }
    }
}


function playpausevideo() {
    console.log("pause video");
    if (VIDEO_PLAYER != "" && PLAY_VIDEO) {
        console.log("Play/Pause Video");
        if (VIDEO_PLAYER.paused) {
            VIDEO_PLAYER.play();
        }
        else {
            VIDEO_PLAYER.pause();
        }
    }
}

function playnextvideo() {
    console.log("playNextVideo");
    totalVideo = get_total_video_or_first_video_index(1);
    if (VOD_COUNTER < totalVideo) {
        if (PAGE_INDEX == 2) {
            VOD_COUNTER = $("#episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").next('li').index();
            VOD_URL = SELECTED_EPISODES[VOD_COUNTER];
            SELECTED_EPIOSDE_NUMBER = SELECTED_EPIOSDE_NUMBER + 1;
            show_hide_show_deatils(true);
            setTimeout(function () {
                PLAYER_STATE = 1;
                load_video();
            }, 1000);
        }
    }

}

function playpreviousvideo() {
    console.log("playPreviousVideo");
    if (VOD_COUNTER > 0) {
        if (PAGE_INDEX == 2) {
            VOD_COUNTER = $("#episode_list li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li').index();
            VOD_URL = SELECTED_EPISODES[VOD_COUNTER];
            SELECTED_EPIOSDE_NUMBER = SELECTED_EPIOSDE_NUMBER - 1;
            show_hide_show_deatils(true);
            setTimeout(function () {
                PLAYER_STATE = 1;
                load_video();
            }, 1000);
        }
    }
}



function _onMouseOverEvent(e) {
    var elementId = this.id;
    console.log("focus container id", elementId);
    var itemArray = document.getElementsByClassName("focusable");

    if (elementId == "preview_video_container" && !PREVIEW_FULL_DISPLAY) return;

    if ($("#" + elementId)[0].tagName != "INPUT") {
        for (var i = 0; i < itemArray.length; i++) {
            itemArray[i].blur();
        }
    }

    if (elementId != "") {
        console.log(elementId, $("#" + elementId));

        if ($("#" + elementId).closest('li.focusable').length > 0) {
            console.log("11111");
            $("#" + elementId).closest('li.focusable').focus();
        }
        else if ($("#" + elementId).closest('div.focusable').length > 0) {
            console.log("22222");
            $("#" + elementId).closest('div.focusable').focus();
        }
        else if ($("#" + elementId).find('button.focusable').length > 0) {
            console.log("33333");
            $("#" + elementId).closest('div.focusable').focus();
        }
        else if ($("#" + elementId).find('span.focusable').length > 0) {
            console.log("444444");
            $("#" + elementId).closest('div').focus();
        }
        else {
            console.log("555555");
            $("#" + elementId).focus();
        }

        if ($(":focus").parent().attr("id") != "left_sidebar") hide_left_sidebar();
    }
}