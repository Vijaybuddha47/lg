/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var itemArray = document.getElementsByClassName("focusable");

$(document).ready(function () {
    window.PAGE = window.location.pathname.split("/").pop().split(".")[0];
    console.log("PAGE", PAGE);
    enable_disable_mouse();
});

function addEventListeners() {
    var itemArray = document.getElementsByClassName("focusable");
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    console.log(" _onClickEvent ==>", e);
    var elementId = e.target.id;
    console.log("elementId==>", elementId);

    if (elementId == '') elementId = $(this).attr('id');

    if ($("[class^=mejs_]").is(":focus")) elementId = "video_container";
    console.log("22222==>", elementId);
    // When popup is clicked
    if ($(".modal_container").hasClass("active")) {
        // For Exit popup no button
        if ($('#noButton').is(":focus")) {
            console.log('hide popup');
            hide_show_modal(false, 'EXIT');

            // For Exit popup yes button
        } else if ($("#yesButton").is(":focus")) {
            console.log('exit app');
            window.close();

            // For Retry popup retry button
        } else if ($("#retryButton").is(":focus")) {
            var modalName = "RETRY_CANCEL";
            hide_show_modal(false, modalName);
            SN.focus('videoSection');
            setTimeout(function () { load_video(); }, 1000);

            // For Retry popup cancel button
        } else if ($("#cancelButton").is(":focus")) {
            var modalName = "RETRY_CANCEL";
            hide_show_modal(false, modalName);
            closeVideo();
        }

        // For Home page
    } else if (PAGE == "home") {
        if ($(".menu_container").hasClass("active")) {
            SELECTED_MENU_INDEX = $('#' + elementId).closest('li').index();
            TIME_STAMP = Date.now();
            if (SELECTED_MENU_INDEX == 3) set_logout_menu_data();
            else parse_data(TIME_STAMP);

        } else if ($(".search_box").hasClass("active")) {
            var prefix = get_search_id_prefix();
            $('#' + prefix + 'Searchbox').hide();
            $('#' + prefix + 'SearchInputBox').show();
            SN.focus(prefix + 'SearchInputBox');
            clear_last_selected_id();

        } else if ($(".live_page_container").hasClass("active")) {
            last_selected_item_id(elementId, 0);
            selected_item_list();
            $(".video-title").text('');
            $(".live_page_container, .search_box, #liveList").removeClass('active');

            SN.focus('videoSection');
            $(".video_container").addClass('active');
            VOD_URL = "";
            VOD_COUNTER = 0;
            get_video_details(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX]['channel_id'], true);

        } else if ($(".movie_page_container").hasClass("active")) {
            last_selected_item_id(elementId, 0);
            selected_item_list();
            if (SELECTED_MENU_INDEX == 1) {
                var obj = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX];
                var title = obj['name'],
                    description = obj['description'],
                    img = IMG_PATH + obj['image'];

                get_video_details(obj['id'], playVodFlag = false);

            } else if (SELECTED_MENU_INDEX == 2) {
                //set_shows_episodes();
                set_shows_seasons_episodes(viewType = "seasons");
            }


        } else if ($(".seasons_page_container").hasClass("active")) {
            last_selected_item_id(elementId, 1);
            selected_item_list();
            set_shows_seasons_episodes(viewType = "episode");

        } else if ($(".episode_page_container").hasClass("active")) {
            last_selected_item_id(elementId, 2);
            selected_item_list();
            var obj = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['episodes'][EPISODE_ITEM_INDEX],
                id = "";

            id = obj['id'];
            get_video_details(id, playVodFlag = false);


        } else if ($(".video_details_page_container").hasClass("active")) {
            if ($("#playIcon").is(":focus")) {
                $(".video-title").text('');
                $(".video_details_page_container").removeClass('active');
                SN.focus('videoSection');
                $(".video_container").addClass('active');
                VOD_URL = "";
                id = "";

                if (SELECTED_MENU_INDEX == 1) {
                    id = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['id'];
                    VOD_COUNTER = CAT_ITEM_INDEX;
                } else if (SELECTED_MENU_INDEX == 2) {
                    id = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['episodes'][EPISODE_ITEM_INDEX]['id'];
                    VOD_COUNTER = EPISODE_ITEM_INDEX;
                }

                get_video_details(id, true);

            } else {
                console.log("Add / Remove favourite");

                if (FAVORITE_STATUS) FAVORITE_STATUS = 0;
                else FAVORITE_STATUS = 1;
                add_remove_favorite(FAVORITE_VIDEO_ID, FAVORITE_STATUS);
            }

        } else if ($(".logout_page_container").hasClass("active")) {
            webOS.deviceInfo(function (device) {
                //console.log(device.modelName);
                modalName = device.modelName;
                $.ajax({
                    type: "POST",
                    url: LOGOUT_API,
                    dataType: "JSON",
                    data: jQuery.param({ memberId: localStorage.getItem('memberId'), sn: modalName }),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    async: true,
                    cache: false,
                    timeout: REQUEST_TIMEOUT * 1000,
                    success: function (json) {
                        //console.log(json);
                        if (json.result == 200) {
                            localStorage.setItem('username', '');
                            localStorage.setItem('password', '');
                            localStorage.setItem('token', '');
                            localStorage.setItem('memberId', '');
                            localStorage.setItem('email', '');
                            window.location.href = "login.html";

                        } else {
                            console.log("logout error.");
                        }

                    },
                    error: function (xhr, error) {
                        console.log('logout error', xhr, error);
                    }
                });
            });

        } else if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
            if (SELECTED_MENU_INDEX == 0) $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);

            if ($('.channel_list_container').hasClass('toggle_channel_list') && $("#" + elementId).parent().attr("id") == "live_channel_list") {

                $('.channel_list_container').removeClass('toggle_channel_list');
                $(".video-title").text('');
                $(".live_page_container, .search_box, #liveList").removeClass('active');

                $(".video_container").addClass('active');
                VOD_URL = "";
                VOD_COUNTER = 0;
                CAT_ITEM_INDEX = CHANNEL_ITEM_INDEX = CURRENT_ITEM_INDEX = $('#' + e.target.id).closest('li').index();
                console.log(CAT_ITEM_INDEX, CHANNEL_ITEM_INDEX, e.target.id);
                get_video_details(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX]['channel_id'], true);

                $("ul.live_channel_list_container li").removeClass("blued_img");
                $("#channel_number_" + (CHANNEL_ITEM_INDEX)).addClass("blued_img");
                $('.channel_list_container').removeClass('toggle_channel_list');
                SN.focus('videoSection');
            } else if ($('.custom_control_container').css("display") == "block" && $("#" + elementId).parent().attr("id") == "customControls") {
                if (elementId == "customHome") {
                    if (SELECTED_MENU_INDEX == 0) closeVideo();
                    else goToHomePage();
                } else if (elementId == "customDVR") {
                    SN.remove("[id^=epgList]");
                    $(".custom_control_container").hide();
                    if (CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX]["dvr_enabled"] == "1") parse_epg('allEpg');
                    else createCustomEPG();
                } else if (elementId == "customPause") {
                    if (VIDEO_PLAYER.paused) {
                        $("#customPause").find("img").attr("src", "images/pause_icon.png");
                        VIDEO_PLAYER.play();
                    }
                    else {
                        $("#customPause").find("img").attr("src", "images/custom_play_icon.png");
                        VIDEO_PLAYER.pause();
                    }
                } else if (elementId == "customStartOver") {
                    VIDEO_PLAYER.pause();
                    progress_bar(0);
                    VIDEO_PLAYER.setSrc(VOD_URL);
                    VIDEO_PLAYER.load();
                } else if (elementId == "customAudio") {
                    $("#language_option").show();
                    SN.focus("language_option");
                } else if (elementId == "customClose") {
                    $(".custom_control_container").hide();
                    SN.focus("videoSection");
                }
            } else if ($('.custom_control_container').css("display") == "block" && $("#" + elementId).parent().attr("id") == "programme_details") {
                if (elementId == "customLeft") {
                    if (CURRENT_ITEM_INDEX > 0 && CURRENT_ITEM_INDEX < _.size(CAT_ARRAY[SELECTED_MENU_INDEX])) {
                        CURRENT_ITEM_INDEX = CURRENT_ITEM_INDEX - 1;
                        changeProgrammeDetails();
                    }
                } else if (elementId == "customRight") {
                    if (CURRENT_ITEM_INDEX > -1 && CURRENT_ITEM_INDEX < _.size(CAT_ARRAY[SELECTED_MENU_INDEX])) {
                        CURRENT_ITEM_INDEX = CURRENT_ITEM_INDEX + 1;
                        changeProgrammeDetails();
                    }
                }
                // All EPG
            } else if ($("#epgListContainer").contents().length > 1 && $("#" + elementId).parent().attr("id") == "epgListContainer") {
                if (_.size(All_EPG_OBJ) > 0) {
                    //var elementId = e.target.id,
                    var url = "",
                        transcodeLevels = 5,
                        li = $('#' + elementId).closest('li');

                    rowIndex = li.attr('data-row');
                    itemIndex = li.index() - 1;

                    if (CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]['transcode_levels'] != "undefined") transcodeLevels = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]['transcode_levels'];

                    if (CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]['dvrDir'] != "undefined") url += CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]['dvrDir']; // domain

                    if (_.size(All_EPG_OBJ) > 0) url += All_EPG_OBJ[rowIndex][itemIndex]['filepath'] + "_"; // filepath

                    if (transcodeLevels <= 1) url += 'hi.mp4/master.m3u8';
                    else if (transcodeLevels = 2) url += ',low,hi,.mp4.urlset/master.m3u8';
                    else if (transcodeLevels = 3) url += ',low,med,hi,.mp4.urlset/master.m3u8';

                    $("#epgListContainer").html('');
                    $(".epg_icon_container").hide();

                    console.log("seleted DVR URL", url);

                    $("#programmeTitle").html(All_EPG_OBJ[rowIndex][itemIndex]['program_name']);
                    $("#programmeDesc").html(All_EPG_OBJ[rowIndex][itemIndex]['description']);

                    VOD_URL = url;
                    $(".video-title").text('');
                    load_video();
                }

                // When DVR button clicked/seclected
            } else if ($('#epgIcons').is(':visible') && elementId == "dvr") {
                parse_epg('allEpg');
                // When next/previous button clicked/seclected
            } else if ($('#videoNextPrevious').is(':visible')) {
                if ($("#playPreviousVideo").is(":focus")) {
                    previous_next_video(type = "previous");

                } else if ($("#playPauseVideo").is(":focus")) {
                    if (VIDEO_PLAYER.paused) {
                        $("#customPause").find("img").attr("src", "images/pause_icon.png");
                        VIDEO_PLAYER.play();
                    }
                    else {
                        $("#customPause").find("img").attr("src", "images/custom_play_icon.png");
                        VIDEO_PLAYER.pause();
                    }

                    if (SELECTED_MENU_INDEX == 0) $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);

                } else if ($("#playNextVideo").is(":focus")) {
                    previous_next_video(type = "next");
                }
            } else if ($('#video_container').is(':visible')) {
                if (VIDEO_PLAYER.paused) {
                    $("#customPause").find("img").attr("src", "images/pause_icon.png");
                    VIDEO_PLAYER.play();
                }
                else {
                    $("#customPause").find("img").attr("src", "images/custom_play_icon.png");
                    VIDEO_PLAYER.pause();
                    show_hide_controls();
                }
            }
        }

        // For Login page
    } else if (PAGE == "login") {
        if (!$(".modal_container").hasClass("active")) {
            if (elementId.search("loginButton") > -1) {
                console.log('login button ok');
                if (document.getElementById('username').value == "" || document.getElementById('password').value == "") {
                    loginFormValidation();
                } else if ($("#loginButton").is(":focus")) {
                    loginIntoApp(page = "login");
                }
                LAST_FOCUSED = 3;

                // on password click
            } else if (elementId.search("password") > -1) {
                $("#username, #loginButton").blur().removeClass("active");
                $("#password").focus().addClass("active");
                LAST_FOCUSED = 2;

                // on username click
            } else if (elementId.search("username") > -1) {
                $("#password, #loginButton").blur().removeClass("active");
                $("#username").focus().addClass("active");
                LAST_FOCUSED = 1;

            }
        }
    }
}

function _onMouseOverEvent(e) {
    var elementId = e.target.id;
    console.log("focus container id", elementId);

    if (elementId != "") {
        if (PAGE == "home") {
            prefix = get_search_id_prefix();
            if (!KEYBOARD) {
                unfocus_items();
                if ((elementId.toLowerCase()).search("search") > -1) {
                    if ($("#" + prefix + "SearchButton").is(":visible")) $("#" + prefix + "SearchButton").focus();
                    else $("#" + prefix + "SearchInput").focus();
                } else if (elementId.search("loginButton") > -1) $("#loginButton").focus();
                else if (elementId.search("yesButton") > -1) $("#yesButton").focus();
                else if (elementId.search("noButton") > -1) $("#noButton").focus();
                else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
                else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
                else if (elementId.search("dvr") > -1) $("#dvr").focus();
                else $("#" + elementId).closest('li').focus();
            }

        } else if (PAGE == "login") {
            unfocus_items();
            $("#username, #password, #loginButton").removeClass("active");
            document.getElementById(elementId).focus();
            if ($("#username").is(":focus")) LAST_FOCUSED = 1;
            else if ($("#password").is(":focus")) LAST_FOCUSED = 2;
            else if ($("#loginButton").is(":focus")) LAST_FOCUSED = 3;
        }
    }

    console.log("_onMouseOverEvent ", $(":focus").attr("id"));
}

function unfocus_items() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }
}