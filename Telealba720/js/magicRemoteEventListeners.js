/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var lastFocusedElementId;
document.addEventListener('cursorStateChange', cursorVisibilityChange, false);
document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);

function cursorVisibilityChange(event) {
    var visibility = event.detail.visibility;
    if ($(":focus").length > 0) lastFocusedElementId = $(":focus").attr("id");
    if (visibility) {
        console.log("Cursor appeared");
        // Do something.
    }
    else {
        console.log("Cursor disappeared");
        SN.focus("#" + lastFocusedElementId);
    }
}

function keyboardVisibilityChange(event) {
    var visibility = event.detail.visibility;
    console.log(event, visibility);
    if (visibility) {
        $(".login_container").addClass("cursor_disabled");
        $(".video_list_container").addClass("cursor_disabled");
        $(".header").addClass("cursor_disabled");
        console.log("Virtual keyboard appeared");
    }
    else {
        $(".login_container").removeClass("cursor_disabled");
        $(".video_list_container").removeClass("cursor_disabled");
        $(".header").removeClass("cursor_disabled");
        console.log("Virtual keyboard disappeared");
    }
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
    console.log(elementId + " is Clicked.");
    if (elementId != "") {
        // When popup is clicked
        if ($(".modal_container").hasClass("active")) {
            var modalName = $(".modal_container").attr("data-modal-name");
            if (elementId == "noButton") {
                if (PAGE_INDEX == 0) {
                    hide_show_modal(false, 'EXIT');
                } else if (PAGE_INDEX == 6) {
                    hide_show_modal(false, 'EXIT');
                }
            } else if (elementId == "yesButton") {
                if (PAGE_INDEX == 0) window.close();
                else if (PAGE_INDEX == 6) {
                    window.localStorage.removeItem("ip_address");
                    window.localStorage.removeItem("telealba_app_user_name");
                    window.localStorage.removeItem("mac_address");
                    window.location.href = "login.html";
                }
            } else if (elementId == "retryButton") {
                if (modalName == "RETRY_CANCEL") {
                    if ($("#retryButton").is(":focus")) {
                        hide_show_modal(false, modalName);
                        // SN.focus('videoPlayer');
                        load_video();
                    }
                } else if (modalName == "RETRY_EXIT") {
                    hide_show_modal(false, modalName);
                    if ($("#retryButton").is(":focus")) {
                        hide_show_modal(false, 'EXIT');
                    }
                }
            } else if (elementId == "cancelButton") {
                hide_show_modal(false, modalName);
                if (modalName == "RETRY_CANCEL") {
                    if ($("#cancelButton").is(":focus")) closeVideo();
                } else if (modalName == "RETRY_EXIT") {
                    if ($("#cancelButton").is(":focus")) {
                        closeVideo();
                        window.close();
                    }
                }
            } else if ($(".exit_modal_show").parent().attr("data-modal-name") == "EXIT") SN.focus("exitModal");
            else SN.focus("retryModal");

        } else if ($("#" + elementId).parent().attr("id") == "menu_items") {
            SELECTED_MENU = elementId;
            change_menu_focus(SELECTED_MENU);
            $("li.nav_box").removeClass("selected_menu");
            $("#" + SELECTED_MENU).addClass("selected_menu");
            if (SELECTED_MENU == "menu_0") {
                PAGE_INDEX = TAB_INDEX = 0;
                if (!$(".home_container").hasClass("active")) {
                    $("#loader").hide();
                    hide_show_screens("home_container");
                }
            } else if (SELECTED_MENU == "menu_1") {
                PAGE_INDEX = TAB_INDEX = 6;
                if (!$(".logout_container").hasClass("active") && localStorage.getItem("telealba_app_user_name") == null) {
                    hide_show_screens("logout_container");
                } else {
                    $("#login_username").text(localStorage.getItem("telealba_app_user_name"));
                    hide_show_screens("logout_container");
                }
            }
            // For home list  is clicked
        } else if ($(".home_container").hasClass("active")) {
            $("li.home_content_box").removeClass("selected_home_item");
            SELECTED_HOME_ITEM = elementId;
            $("#" + SELECTED_HOME_ITEM).addClass("selected_home_item");
            if (SELECTED_HOME_ITEM == 'on_demand') {
                $("#loader").show();
                if (_.size(APP_VOD_CONTENT) > 0) {
                    $("#loader").show();
                    hide_show_screens("on_demand_container");
                    $("#loader").hide();
                    SN.focus("ondemand_items");
                } else {
                    NUM = 0;
                    hide_show_screens("");
                    $("#loader").show();
                    content_list_Api_size_1000();
                }
            } else if (SELECTED_HOME_ITEM == 'live_guide') {
                $("#loader").show();
                hide_show_screens("live_channel_container");
                $("#loader").hide();
                SN.focus("channel_number_box");
            }
        } else if ($(".live_channel_container").hasClass("active") && PAGE_INDEX == 1) {
            elementId = $("#" + elementId).closest('li').attr("id");
            PAGE_INDEX = TAB_INDEX = 1;
            var index = $("#" + elementId).index();
            change_menu_focus(SELECTED_MENU);
            if ($('#' + elementId).attr("data-index")) {
                SELECTED_CHANNEL_BOX = $("#" + elementId).attr("data-index");
                if (_.size(APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX]) > 0) {
                    $("#program_container").html("");
                    hide_show_screens("");
                    set_tv_guide_screen();
                } else {
                    console.log("channel box is empty.");
                }
            }
        } else if ($(".epg_container").hasClass("active") && PAGE_INDEX == 2) {
            $(".video_next_previous_container").hide();
            if ($("[id^='live_']").is(":focus")) {
                elementId = $("#" + elementId).closest('li').attr("id");
                SELECTED_CHANNEL_INDEX = $("#" + elementId).attr("data-index");
                SECOND_PAGE_SELECTED_ITEM = elementId;
                var url = "", restrictedContent = '';
                VOD_URL = "";

                for (var i = 0; i < _.size(APP_LIVE_CHANNEL); i++) {
                    if (APP_LIVE_CHANNEL[i]["number"] == APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][SELECTED_CHANNEL_INDEX]) {
                        url = APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[i]["children"] + "/?page=0&restricted=false&showAdultContent=true&size=2000";
                        VOD_URL = APP_LIVE_CHANNEL[i]["hlsUrl"];
                        SELECTED_CHANNEL_NUMBER = APP_LIVE_CHANNEL[i]["number"];
                        $("#channel_title").text(APP_LIVE_CHANNEL[i]["callSign"]);
                        $("#channel_logo_img").attr("src", APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[i]['thumbnail']);
                        restrictedContent = APP_LIVE_CHANNEL[i]["parentalLevel"]["restricted"];
                        break;
                    }
                }

                // if (APP_PARENTAL_CONTROL) APP_PARENTAL_CONTROL = false;

                if ($("#" + elementId).hasClass("current")) {
                    if (VOD_URL != '') {
                        if (APP_PARENTAL_CONTROL || !restrictedContent) {
                            checkVideoURL();
                        } else {
                            $("#parentalcontrol_popup").show();
                            SN.focus("#unlock_password");
                        }
                    }
                } else if (!$("#" + elementId).hasClass("current")) {
                    if (url != '') {
                        $(".current").removeClass("current");
                        $("#" + elementId).addClass("current");
                        set_program_list(SELECTED_CHANNEL_NUMBER, url);
                    }
                }
            }
            else if ($("#" + $("#" + elementId).closest('li').attr("data-index")) && $("[id^='program_']").is(":focus")) {
                elementId = $("#" + elementId).closest('li').attr("id");
                LIVE_CATCHUP = false;
                var index = $(":focus").index();
                var programIndex = $("#" + elementId).attr("data-index");
                var restrictedContent = '';
                if (APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER] !== undefined) {
                    var start = APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER][programIndex]["startDateTime"];
                    var end = APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER][programIndex]["endDateTime"];
                    $("#current_program").text(APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER][programIndex]["title"]);
                    var dayTime = moment(start).format('dddd') + ", " + moment(start).format('LL') + " " + moment(start).format('HH:mm');
                    $("#current_program_time").text(dayTime + " - " + moment(end).format('HH:mm'));
                    var rating = APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER][programIndex]["parentalLevel"]["rating"];
                    var info = convertSecondsToHM(APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER][programIndex]["duration"]);
                    info += rating ? "<b>" + rating + "</b>" : "";
                    $("#programInfo").html(info);
                    $("#current_program_desc").text(APP_PROGRAM_LIST[SELECTED_CHANNEL_NUMBER][programIndex]["description"]);
                }

                VOD_URL = '';
                for (var i = 0; i < _.size(APP_LIVE_CHANNEL); i++) {
                    if (APP_LIVE_CHANNEL[i]["number"] == APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][SELECTED_CHANNEL_INDEX]) {
                        VOD_URL = APP_LIVE_CHANNEL[i]["hlsUrl"];
                        SELECTED_CHANNEL_NUMBER = APP_LIVE_CHANNEL[i]["number"];
                        restrictedContent = APP_LIVE_CHANNEL[i]["parentalLevel"]["restricted"];
                        break;
                    }
                }
                // if (!restrictedContent) APP_PARENTAL_CONTROL = true;

                SECOND_PAGE_SELECTED_ITEM = elementId;
                if ($("#" + elementId).hasClass("live")) {
                    if (VOD_URL != '') {
                        if (APP_PARENTAL_CONTROL || !restrictedContent) {
                            checkVideoURL();
                        } else {
                            $("#parentalcontrol_popup").show();
                            SN.focus("#unlock_password");
                        }
                    }
                } else if ($("#" + elementId).hasClass("live_catchup")) {
                    VOD_URL = APP_PROGRAM_LIST[APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][SELECTED_CHANNEL_INDEX]][index]["cuTvUrl"];
                    SELECTED_CHANNEL_NUMBER = APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][SELECTED_CHANNEL_INDEX];
                    if (VOD_URL !== '') {
                        if (APP_PARENTAL_CONTROL || !restrictedContent) {
                            LIVE_CATCHUP = true;
                            checkVideoURL();
                        } else {
                            $("#parentalcontrol_popup").show();
                            SN.focus("#unlock_password");
                        }
                    }
                }
            } else if (elementId == "unlock_cancel") {
                document.getElementById("unlock_password").value = "";
                $("#parentalcontrol_popup").hide();
                SN.focus("#" + SECOND_PAGE_FOCUSED_ITEM);

            } else if (elementId == "unlock_ok") {
                var text = $.trim($('#unlock_password').val());
                if (text != "") {
                    if (text == localStorage.getItem("telealba_app_password")) {
                        $("#parentalcontrol_popup").hide();
                        hide_show_screens("video_container");
                        load_video();
                        APP_PARENTAL_CONTROL = true;
                        setTimeout(function () {
                            APP_PARENTAL_CONTROL = false;
                            document.getElementById("unlock_password").value = "";
                        }, 600000);
                    } else {
                        $("#password_incorrect").show();
                        SN.focus("#unlock_password");
                        setTimeout(function () {
                            $("#password_incorrect").hide();
                        }, 5000);
                    }
                } else if (text == "") {
                    $("#password_empty").show();
                    SN.focus("#unlock_password");
                    setTimeout(function () {
                        $("#password_empty").hide();
                    }, 5000);
                }

            }
        } else if ($(".on_demand_container").hasClass("active")) {
            elementId = $("#" + elementId).closest('li').attr("id");
            var index = $("#" + elementId).index();
            VOD_BREADCRUMB[0] = $("#" + elementId).find(".demand_name").text();
            set_category_screen(index);
            $(".result_not_found").hide();
            $("#searchInputText").val("");
        } else if ($(".sub_category_container").hasClass("active")) {
            $(".result_not_found").hide();
            $("#searchInputText").val("");
            elementId = $("#" + elementId).closest('li').attr("id");
            var index = $("#" + elementId).index();
            VIDEO_TYPE = $("#" + elementId).attr("data-type");
            VOD_BREADCRUMB[1] = $("#" + elementId).find(".demand_name").text();
            if (VIDEO_TYPE == "SUB") get_sub_category_videos(index);
            else if (VIDEO_TYPE == "CAT") set_video_list_screen();
        } else if ($(".video_list_container").hasClass("active")) {
            if (elementId == "searchBox") {
                $("#search_bar_box").hide();
                $("#search_bar").show();
                SN.focus("search_bar");

            } else {
                SELECTED_VIDEO_ITEM = elementId;
                SELECTED_VIDEO_INDEX = $("#" + elementId).index();

                if (_.size(CAT_VOD_LIST) > 0) VOD_URL = CAT_VOD_LIST[SELECTED_VIDEO_INDEX]["vsFile"];
                else if (typeof SUB_CAT_VOD_ARRAY[SELECTED_VIDEO_INDEX] === 'undefined') VOD_URL = SUB_CAT_VOD_ARRAY["vsFile"];
                else if (VIDEO_TYPE == "SUB") VOD_URL = SUB_CAT_VOD_ARRAY[SELECTED_VIDEO_INDEX]["vsFile"];

                hide_show_screens("video_container");
                VOD_COUNTER = SELECTED_VIDEO_INDEX;
                load_video();
            }
        } else if ($(".logout_container").hasClass("active")) {
            if (elementId == "logout_btn") {
                setTimeout(function () {
                    hide_show_modal(true, 'EXIT', APP_LOGOUT_MSG);
                }, 100);
            }
        } else if ($(".login_container").hasClass("active")) {
            if (elementId == "loginButton") {
                var userName = document.getElementById('userName').value;
                var password = document.getElementById('password').value;
                if (userName == '') login_error_message("Username is required.")
                else if (password == '') login_error_message("Password is required.")
                else if (userName && password) {
                    $("#login_container").hide();
                    $("#login_loader").show();
                    setTimeout(function () {
                        var user_name = document.getElementById('userName').value;
                        var user_pswd = document.getElementById('password').value;
                        localStorage.setItem("telealba_app_user_id", user_name);
                        localStorage.setItem("telealba_app_password", user_pswd);
                        loginApi();
                    }, 200);
                }
            } else if (elementId == "first_time") {
                if (FIRST_TIME == 0) {
                    FIRST_TIME = 1;
                    $("img.checkbox_image").attr("src", './images/checkbox_selected.png');
                }
                else if (FIRST_TIME == 1) {
                    FIRST_TIME = 0;
                    $("img.checkbox_image").attr("src", './images/checkbox.png');
                }
            }
        } else if ($(".video_container").hasClass("active")) {
            if (elementId == "playPauseVideo") {
                if (VIDEO_PLAYER.play) {
                    $(".pause-icon").show();
                    pauseVideo();
                    VIDEO_PLAYER.pause();
                } else {
                    $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png');
                    $(".pause-icon").hide();
                    playVideo();
                    VIDEO_PLAYER.play();
                }

            } else if (elementId == "playPreviousVideo") {
                previous_next_video(type = "previous");

            } else if (elementId == "playNextVideo") {
                previous_next_video(type = "next");
            }
        }
    }

}


function _onMouseOverEvent(e) {
    var elementId = this.id;
    console.log("MouseOver is " + elementId);

    var itemArray = document.getElementsByClassName("focusable");

    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }

    if (elementId != "") {
        if ($('#modal_container').hasClass("active")) {
            if (elementId.search("yesButton") > -1) $("#yesButton").focus();
            else if (elementId.search("noButton") > -1) $("#noButton").focus();
            else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
            else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
            else if ($(".exit_modal_show").parent().attr("data-modal-name") == "EXIT") SN.focus("exitModal");
            else SN.focus("retryModal");

        } else {
            if (elementId.search("searchInputText") > -1) $("#searchInputText").focus();
            else if (elementId.search("userName") > -1) $("#userName").focus();
            else if (elementId.search("password") > -1) $("#password").focus();
            else if (elementId.search("loginButton") > -1) $("#loginButton").focus();
            else if (elementId.search("first_time") > -1) $("#first_time").focus();
            else if (elementId.search("unlock_password") > -1) $("#unlock_password").focus();
            else if (elementId.search("searchBox") > -1) $("#searchBox").focus();
            else if (elementId.search("unlock_ok") > -1) $("#unlock_ok").focus();
            else if (elementId.search("unlock_cancel") > -1) $("#unlock_cancel").focus();
            else if (elementId.search("about") > -1) $("#aboutBox").focus();
            else if (elementId.search("logout_btn") > -1) $("#logout_btn").focus();
            else if ($("#" + elementId).closest('li').length > 0) $("#" + elementId).closest('li').focus();
        }
    }
    if ($(":focus").length > 0) lastFocusedElementId = $(":focus").attr("id");
}