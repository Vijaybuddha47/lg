/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var itemArray = document.getElementsByClassName("focusable");

$(document).ready(function() {
    window.PAGE = window.location.pathname.split("/").pop().split(".")[0];
    console.log("PAGE", PAGE);
});

function addEventListeners() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    elementId = e.target.id;
    //console.log(elementId + " is clicked!", PAGE);

    if (PAGE == "home") {
        // When popup is clicked
        if (elementId.search("Button") > -1) {
            if ($('#noButton').is(":focus")) {
                console.log('hide popup');
                hide_show_modal(false, 'EXIT');

            } else if ($("#yesButton").is(":focus")) {
                console.log('exit app');
                window.close();

            } else if ($("#retryButton").is(":focus")) {
                var modalName = "RETRY_CANCEL";
                hide_show_modal(false, modalName);
                if (VOD_URL.indexOf('youtube') !== -1) playVideo();
                else load_video();

            } else if ($("#cancelButton").is(":focus")) {
                var modalName = "RETRY_CANCEL";
                hide_show_modal(false, modalName);
                closeVideo();
            }

            // For menu is clicked
        } else if ($(".menu_container").hasClass("active")) {
            SELECTED_MENU_INDEX = $('#' + e.target.id).closest('li').index();

            $("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");

            MENU_ID = MENU_ARRAY[SELECTED_MENU_INDEX]['id'];
            clearInterval(MENU_LOAD_TIMER);
            $("#allVideoRowHeading, #featuredRowHeading, #catName").text("");
            $("ul#allVideosGrid, ul#featuredRow, .search_container, ul#catList, ul#subcatList, #channelDetails, #videoDetails").html('');
            $(".featuredRowContainer, .allVideosGridContainer").hide();
            $(".support_main_container, .loader, .error_msg").remove();
            $(".cat_container").show();
            if (MENU_ID == "VC" || MENU_ID == "CC") $(".allVideosGridContainer").append(add_loader("categoty_loader"));
            else $(".allVideosGridContainer").append(add_loader());
            $(".search_container, .cat_container, .channel_video_categories_menu_second_page_container, .channel_third_page_container, .video_details_container").removeClass("active");
            $(".channel_video_categories_menu_second_page_container, .channel_third_page_container").hide();
            $("#third_page_header").text("");
            $('#allVideosGrid').closest("div.channel_small_fullbox").removeClass("channel_small_full_height");

            FEATURE_ROW_FLAG = 0;

            FIRST_PAGE_ITEM_INDEX = 0;
            FIRST_PAGE_ITEM_COUNTER = 0;
            FIRST_PAGE_COUNTER = 1;
            FIRST_ROW_ITEM_COUNTER = 1;

            FEATURED_ROW_COUNTER = 0;
            FEATURED_PAGE_COUNTER = 1;
            LOAD_NEXT_PAGE = 0;

            time = 500;
            TIME_STAMP = jQuery.now();
            switch (true) {
                case MENU_ID == "AL":
                    MENU_LOAD_TIMER = setTimeout(function() {
                        $(".featuredRowContainer, .allVideosGridContainer").show();
                        set_all_videos_and_channels_shows_screen(MENU_ID, TIME_STAMP);
                    }, time);
                    break;

                case MENU_ID == "CAS":
                    MENU_LOAD_TIMER = setTimeout(function() {
                        $(".featuredRowContainer, .allVideosGridContainer").show();
                        set_all_videos_and_channels_shows_screen(MENU_ID, TIME_STAMP);
                    }, time);
                    break;

                case MENU_ID == "VC" || MENU_ID == "CC":
                    MENU_LOAD_TIMER = setTimeout(function() {
                        $(".allVideosGridContainer, .loader").show();
                        set_channels_and_video_category(TIME_STAMP, MENU_ID, 1);
                    }, time);
                    break;

                case MENU_ID == "SU":
                    MENU_LOAD_TIMER = setTimeout(function() { set_support_screen(); }, time);
                    break;

                case MENU_ID == "SO":
                    window.location.href = "login.html";

                case MENU_ID == "SE":
                    MENU_LOAD_TIMER = setTimeout(function() { set_search_screen(); }, time);
                    break;

                default:
                    break;
            }

            // For grid is clicked
        } else if ($(".cat_container").hasClass("active") || ($(".search_container").hasClass("active") && $("#searchList").hasClass("active"))) {
            //MENU_ID = MENU_ARRAY[SELECTED_MENU_INDEX]['id'];
            if (MENU_ID == "AL" || MENU_ID == "SE") {
                set_video_details_screen();

                // open second page of channels and shows category menu
            } else if (MENU_ID == "CAS") {
                if ($("ul#featuredRow").hasClass("active"))
                    channelId = CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['channel_id'];
                else if ($("ul#allVideosGrid").hasClass("active"))
                    channelId = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['channel_id'];

                THIRD_PAGE_COUNTER = 1;
                THIRD_ROW_ITEM_COUNTER = 1;
                THIRD_PAGE_ITEM_COUNTER = 0;
                LOAD_NEXT_PAGE = 0;
                TIME_STAMP = jQuery.now();

                set_categories_menu_third_page(channelId, MENU_ID, TIME_STAMP, 1);

                // open second page for channel category and video category menu // open channels categories / video categories menu first page
            } else if (MENU_ID == "CC" || MENU_ID == "VC") {
                SECOND_PAGE_COUNTER = 1;
                SECOND_ROW_ITEM_COUNTER = 1;
                SECOND_PAGE_ITEM_COUNTER = 0;
                TIME_STAMP = jQuery.now();
                LOAD_NEXT_PAGE = 0;
                set_categories_video_menu_second_page(MENU_ID, TIME_STAMP, 1);
            }

            // channels categories / video categories menu second page
        } else if ($(".channel_video_categories_menu_second_page_container").hasClass("active") && !$(".error_msg").hasClass("active")) {
            // move to video detail page from video categories menu second page
            if (MENU_ID == "VC") set_video_details_screen();
            else if (MENU_ID == "CC") {
                THIRD_PAGE_COUNTER = 1;
                THIRD_ROW_ITEM_COUNTER = 1;
                THIRD_PAGE_ITEM_COUNTER = 0;
                LOAD_NEXT_PAGE = 0;
                TIME_STAMP = jQuery.now();

                var categoryId = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['channel_id'];
                set_categories_menu_third_page(categoryId, MENU_ID, TIME_STAMP, 1);
            }

            // move to categories menu third page
        } else if ($(".channel_third_page_container").hasClass('active')) {
            set_video_details_screen();

        } else if ($(".video_details_container").hasClass("active")) {
            if (elementId.search("videoDescriptionImg") > -1) {
                if ($(".video_description_play_icon").is(":visible")) {
                    $(".video_details_container").removeClass("active");

                    if (validURL(VOD_URL) == false) {
                        console.log("Incorrect URL", VOD_URL);
                        VOD_URL = "INVALID";
                    }

                    if (VOD_URL.indexOf('youtube') !== -1) {
                        $(".video_container").addClass('active');
                        show_hide_video_container();
                        playVideo();

                    } else {
                        $(".video_container").addClass('active');
                        load_video();
                    }

                } else {
                    $("#videoDescriptionImgBox").focus();
                    console.log("Need to upgrade account to watch video");
                }
            } else {
                $("#videoDescriptionContentBox").focus();
                console.log("currently focus on description...");
            }
        }

        // For Login page
    } else if (PAGE == "login") {
        if (elementId.search("loginButton") > -1) {
            console.log('clicked logout and login');
            manageLoginLogout();

        } else if (elementId.search("browseContentButton") > -1) {
            moveToHomePageWithoutLogin();
        }
    }
}

function _onMouseOverEvent(e) {
    var elementId = e.target.id;
    console.log("focus container id", elementId);

    if (elementId != "") {
        if (PAGE == "home") {
            SN.resume();
            unfocus_items();
            if (elementId.search("videoDescriptionContent") > -1) $("#videoDescriptionContentBox").focus();
            else if (elementId.search("videoDescriptionImg") > -1) $("#videoDescriptionImgBox").focus();
            else if (elementId.search("yesButton") > -1) $("#yesButton").focus();
            else if (elementId.search("noButton") > -1) $("#noButton").focus();
            else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
            else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
            else if (elementId.search("searchInputText") > -1) $("#searchInputText").focus();
            else $("#" + elementId).closest('li').focus();

            focus_video_desc();

        } else if (PAGE == "login") {
            if (!$("#userName").is(":focus") && !$("#userPwd").is(":focus")) {
                unfocus_items();
                document.getElementById(elementId).focus();
            }
        }
    }
}

function unfocus_items() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }
}

function focus_video_desc() {
    if ($("#videoDescriptionContentBox").is(":focus")) {
        SN.pause();
        SCROLL_DOWN = true;
    } else {
        SN.resume();
        SCROLL_DOWN = false;
    }
}