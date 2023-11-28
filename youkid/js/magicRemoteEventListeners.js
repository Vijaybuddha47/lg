/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var itemArray = document.getElementsByClassName("focusable");

function addEventListeners() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    var elementId = this.id;
    console.log(elementId + " is clicked!");

    // When popup is clicked
    if ($(".modal_container").hasClass("active")) {
        setTimeout(function () {
            var modalName = $(".modal_container").attr("data-modal-name");
            if (elementId == "noButton") {
                console.log('hide popup');
                hide_show_modal(false, modalName);
                $(".home_container").addClass("active");
                SN.focus("#hamburger");
            } else if (elementId == "yesButton" && modalName == "EXIT") {
                console.log('exit app');
                window.close();
            } else if (elementId == "yesButton" && modalName == "LOGOUT") {
                console.log("localStorage clear.....");
                hide_show_modal(false, 'LOGOUT');
                localStorage.removeItem("youkid_expiry");
                localStorage.removeItem("youkid_id");
                $(".home_container").addClass("active");
                SN.focus("#hamburger");
            } else if (elementId == "retryButton") {
                hide_show_modal(false, modalName);
                if (modalName == "RETRY_CANCEL") {
                    hide_show_modal(false, modalName);
                    if ($("#retryButton").is(":focus")) {
                        console.log("retry button enter....");
                        SN.focus('videoSection');
                        setTimeout(function () { get_video_url(); }, 1000);

                    }
                } else if (modalName == "RETRY_EXIT") {
                    if ($("#retryButton").is(":focus")) {
                        console.log('hide popup');
                        hide_show_modal(false, 'RETRY_EXIT');

                    }
                }
            } else if (elementId == "cancelButton") {
                hide_show_modal(false, modalName);
                if ($("#cancelButton").is(":focus")) {
                    console.log("cancel button enter....");
                    closeVideo();
                } else if (modalName == "RETRY_EXIT") {
                    closeVideo();
                    window.close();
                }
                // }
            }
        }, 100);
        // For home list  is clicked
    } else if ($(".upgrade_container").css("display") == "block") {
        SN.focus("#upgrade")
        if (elementId == "upgrade") window.close();
    } else if ($(".home_container").hasClass("active")) {
        clearTimeout(TIME_OUT);
        TIME_OUT = null;
        TIME_COUNTER_LEFT = 0;
        if ($('[id^=talent_]').is(":focus")) {
            console.log("talent lsit enetr", e);
            SELECTED_TALENT_ID = this.dataset.index;
            $(".home_container").removeClass("active").hide();
            $(".homepage_header").hide();
            get_talent_videos();
        } else if (elementId == "playBtn") {
            console.log("home page play btn enter...");
            PAGE_INDEX = 0;
            VIDEO_ID = this.dataset.id;
            var valid_date = localStorage.getItem("youkid_expiry");
            var todayTime = new Date().getTime();
            if (valid_date > todayTime) {
                set_video_counter();
                get_video_url();
            } else show_instruction_page();
        } else if (elementId == "favBtn") {
            console.log("favorite button enter");
            var id = this.id;
            var DataId = this.dataset.id;
            if (DataId) {
                setTimeout(function () {
                    var check = check_favorite_video_list(DataId, '');

                    if (check) {
                        add_remove_favorite_video(DataId, "SUB", id);
                        $("#favBtn").find('img').attr("src", "images/favorite_button_focus.png");
                    }
                    else {
                        add_remove_favorite_video(DataId, "ADD", id);
                        $("#favBtn").find('img').attr("src", "images/favorite_added_focused.png");
                    }

                }, 200);
            }
        } else if (elementId == "leftArrow") {
            console.log("NEXT button enetr");
            var id = this.id;
            var nextIndex = Number(this.dataset.id);
            var nextDataId = APP_HOME_FEATURED_LIST[nextIndex];
            SELECTED_HOME_FEATURED_DATA_ID = nextDataId;
            if (nextIndex == _.size(APP_HOME_FEATURED_LIST) - 1) $("#" + id).attr("data-id", 0);
            else $("#" + id).attr("data-id", nextIndex + 1);
            $("#background_slider").attr("src", HOME_PAGE_FEATURED_DATA[nextDataId].pictures.sizes[HOME_PAGE_FEATURED_DATA[nextDataId].pictures.sizes.length - 1]['link']);

            if (nextIndex == 0) $("#rightArrow").attr("data-id", _.size(APP_HOME_FEATURED_LIST) - 1);
            else $("#rightArrow").attr("data-id", nextIndex - 1);

            $("#favBtn").attr("data-id", APP_HOME_FEATURED_LIST[nextIndex]);
            $("#playBtn").attr("data-id", APP_HOME_FEATURED_LIST[nextIndex]);
            check_favourate_data();

        } else if (elementId == "rightArrow") {
            console.log("PREVIOUS button enetr");
            var id = this.id;
            var prevIndex = Number(this.dataset.id);
            var prevDataId = APP_HOME_FEATURED_LIST[prevIndex];
            SELECTED_HOME_FEATURED_DATA_ID = prevDataId;
            if (prevIndex == 0) $("#" + id).attr("data-id", _.size(APP_HOME_FEATURED_LIST) - 1);
            else $("#" + id).attr("data-id", prevIndex - 1);
            $("#background_slider").attr("src", HOME_PAGE_FEATURED_DATA[prevDataId].pictures.sizes[HOME_PAGE_FEATURED_DATA[prevDataId].pictures.sizes.length - 1]['link']);

            if (prevIndex == _.size(APP_HOME_FEATURED_LIST) - 1) $("#leftArrow").attr("data-id", 0);
            else $("#leftArrow").attr("data-id", prevIndex + 1);

            $("#favBtn").attr("data-id", APP_HOME_FEATURED_LIST[prevIndex]);
            $("#playBtn").attr("data-id", APP_HOME_FEATURED_LIST[prevIndex]);
            check_favourate_data();

        }
        else if (elementId == "hamburger") {
            console.log("menu open....");
            if (localStorage["youkid_expiry"]) {
                $("#logoutPage").show();
                $("#musicPage").attr('data-sn-down', '#logoutPage');
                $("#exitPage").attr('data-sn-up', '#logoutPage');
            }
            else {
                $("#musicPage").attr('data-sn-down', '#exitPage');
                $("#exitPage").attr('data-sn-up', '#musicPage');
                $("#logoutPage").hide();
            }
            change_focused_menu_image("");
            if (!$(".menulist_container").hasClass("active")) {
                $(".menulist_container").addClass("active");
                $("#menuList").addClass("show_menu");
                $("#menuImg").attr("src", "images/close_menu_focus.png");
            } else if ($(".menulist_container").hasClass("active")) {
                $(".menulist_container").removeClass("active");
                $("#menuList").removeClass("show_menu");
                $("#menuImg").attr("src", "images/menu_focus.png");
            }
        } else if (elementId == "searchInputText") {
            show_hide_page_header(false);
            $(".homepage_header").hide();
            $(".search_container").addClass("active").show();
            SN.focus("#searchText");
        }
        else if ($(".menulist_container").hasClass("active")) {
            console.log("menu left side list enter");
            var id = this.id;
            SELECTED_MENU_TYPE = this.dataset.type;
            if (SELECTED_MENU_TYPE == "HOME") {
                // authetication_time_clear();
                $(".home_page_menu_wise_list_box").hide();
                $(".home_page_list_box").show();
                get_home_page_featured_data();
                $(".menulist_container").removeClass("active");
                $("#menuList").removeClass("show_menu");
                $("#hamburgerMenuClose").css("display", "none");
                $("#hamburgerMenu").css("display", "block");
                // set focus on home page button
                SN.focus("homepageButton");
            } else if (SELECTED_MENU_TYPE == "FAVORITE") {
                console.log("favorite page");
                show_hide_page_header(false);
                $(".homepage_header").hide();
                $(".menulist_container").removeClass("active");
                $("#menuList").removeClass("show_menu");
                show_favorite_video_list();

            } else if (elementId == "logoutPage") {
                $("#hamburger").find("img").attr("src", "./images/menu.png");
                $(".menulist_container").removeClass("active");
                $("#menuList").removeClass("show_menu");
                setTimeout(function () {
                    hide_show_modal(true, 'LOGOUT', APP_LOGOUT_MSG);
                    SN.focus("#noButton");
                }, 100);
            } else if (elementId == "exitPage") {
                $("#hamburger").find("img").attr("src", "./images/menu.png");
                $(".menulist_container").removeClass("active");
                $("#menuList").removeClass("show_menu");
                setTimeout(function () {
                    hide_show_modal(true, "EXIT", APP_EXIT_MSG);
                    SN.focus("#noButton");
                }, 100);
            } else {
                $(".menulist_container").removeClass("active");
                $("#menuList").removeClass("show_menu");
                $("#hamburgerMenuClose").css("display", "none");
                $("#hamburgerMenu").css("display", "block");

                // set focus on home page button
                set_home_page_by_menu();
                get_home_page_featured_data();
            }
        }
        else if ($("#" + elementId).closest("li").attr("data-id") && $(".home_page_list_box").css("display") == "block") {
            FIRST_PAGE_SELECTED_ITEM = this.id;
            console.log('category operation');
            VOD_COUNTER = $("#" + elementId).closest("li").index();
            PLAY_LIST_ELEMENT_ID = $("#" + elementId).closest("li").parent().attr("id");
            FIRST_PAGE_SELECTED_DATA_ID = SELECTED_VIDEO_ID = this.dataset.id;
            $("#detail_play_btn").attr("data-id", FIRST_PAGE_SELECTED_DATA_ID);
            $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);
            $("#category_detail_heading").text(e.target.parentElement.parentElement.parentElement.childNodes[0].innerText);
            $("#category_page_heading").text(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].name);
            $("#category_page_desc").text(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].description);
            $("#category_page_duration").text(convertSeconds(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].duration));
            $("#background_slider").attr("src", APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].pictures.sizes[APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].pictures.sizes.length - 1]['link']);
            show_video_details();
        }
        else if ($("#" + elementId).hasClass('tile-grid') && $(".home_page_list_box").css("display") == "block") {
            var row = $(":focus").parent().parent().attr("data-row");
            $("#screen_name").text($("#" + elementId).parent().parent().find("span.category_list_heading").text());
            show_category_page(row, elementId);
        }

        else if ($("#" + elementId).closest("li").attr("data-id") && $(".home_page_menu_wise_list_box").css("display") == "block") {
            VOD_COUNTER = $("#" + id).index();
            PLAY_LIST_ELEMENT_ID = $("#" + id).parent().attr("id");
            FIRST_PAGE_SELECTED_DATA_ID = SELECTED_VIDEO_ID = e.target.dataset.id;
            $("#detail_play_btn").attr("data-id", FIRST_PAGE_SELECTED_DATA_ID);
            $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);

            $("#category_detail_heading").text(e.target.parentElement.parentElement.parentElement.childNodes[0].innerText);
            $("#category_page_heading").text(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].name);
            $("#category_page_desc").text(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].description);
            $("#category_page_duration").text(convertSeconds(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].duration));
            $("#background_slider").attr("src", APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].pictures.sizes[APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].pictures.sizes.length - 1]['link']);
            show_video_details();
        }
        else if ($("#" + elementId).hasClass('tile-grid') && $(".home_page_menu_wise_list_box").css("display") == "block") {
            var id = this.id;
            console.log("show category page.");
            var row = $(":focus").parent().parent().attr("data-row");
            $("#screen_name").text($("#" + elementId).parent().parent().find("span.category_list_heading").text());
            show_category_page(row, id);
        }
    } else if (elementId == "searchEnter") {
        console.log("search text selected");
        request_search_results();
    } else if (elementId == "home_icon") {
        show_page_by_index(0);
    } else if (elementId == "BackBtn") {
        if ($(".talent_page_container").hasClass("active")) {
            $(".talent_page_container").removeClass("active").hide();
            $(".common_header").hide();
            set_home_background();
            $(".home_container").addClass("active").show();
            $(".homepage_header").show();
            $("#" + this.id).attr("src", "images/close.png");
            SN.focus("homepage_header");
        } else if ($(".detail_page_main_container").hasClass("active")) {
            set_background("");
            $(".detail_page_main_container").removeClass("active").hide();
            $(".common_header").hide();
            THIRD_PAGE_SELECTED_DATA_ARRAY = {};
            THIRD_PAGE_SELECTED_DATA_ID = '';
            show_page_by_index(PAGE_INDEX);

        } else if ($(".category_container").hasClass("active")) {
            $(".category_container").removeClass("active").hide();
            $(".common_header").hide();
            set_home_background();
            $(".home_container").addClass("active").show();
            $(".homepage_header").show();
            if ($(".home_page_list_box").css("display") != "none") SN.focus("homePageItem");
            else if ($(".home_page_menu_wise_list_box").css("display") != "none") SN.focus("homePageMenuWiseItem");

        } else if ($(".search_result_main_container").hasClass("active")) {
            $(".search_result_main_container").removeClass("active").hide();
            $(".common_header").hide();
            $(".screen_name_box").hide();
            $("#searchResultList").html("");
            set_background("");
            $(".search_container").addClass("active").show();
            APP_SEARCH_DATA_ARRAY = {};
            SN.focus("searchPage");

        } else if ($(".favorite_page_container").hasClass("active")) {
            console.log("favourite container page....");
            $(".favorite_page_container").removeClass("active").hide();
            $(".common_header").hide();
            $(".screen_name_box").hide();
            $(".no_favorite_msg").hide();
            $("#favoriteList").html("");
            $(".home_container").addClass("active").show();
            $(".homepage_header").show();
            set_home_background();
            SN.focus("homepage_header");

        } else if ($(".instruction_main_container").hasClass("active")) {
            set_home_background();
            $(".instruction_main_container").removeClass("active").hide();
            $("#screen_name").hide();
            $(".common_header").hide();
            $("#auth_code").html("");
            TIME_COUNTER_LEFT = 0;
            countdown("count_down", 10, 0, false);
            hide_instruction_screen();

        }
    } else if ($(".category_container").hasClass("active")) {
        console.log("category items..........");
        console.log("category items focus");
        var id = this.id;
        SELECTED_VIDEO_ID = this.dataset.id;
        VOD_COUNTER = $("#" + id).index();
        PLAY_LIST_ELEMENT_ID = $("#" + id).parent().attr("id");

        $("#detail_play_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#category_page_heading").text(APP_HOME_PAGE_MIXED_DATA[SELECTED_VIDEO_ID].name);
        $("#category_page_desc").text(APP_HOME_PAGE_MIXED_DATA[SELECTED_VIDEO_ID].description);
        $("#category_page_duration").text(convertSeconds(APP_HOME_PAGE_MIXED_DATA[SELECTED_VIDEO_ID].duration));
        $("#background_slider").attr("src", APP_HOME_PAGE_MIXED_DATA[SELECTED_VIDEO_ID].pictures.sizes[APP_HOME_PAGE_MIXED_DATA[SELECTED_VIDEO_ID].pictures.sizes.length - 1]['link']);
        show_video_details();

    } else if ($(".favorite_page_container").hasClass("active")) {
        var id = this.id;
        SELECTED_VIDEO_ID = this.dataset.id;
        var favoriteData = JSON.parse(localStorage["id_" + SELECTED_VIDEO_ID]);

        VOD_COUNTER = $("#" + id).index();
        PLAY_LIST_ELEMENT_ID = $("#" + id).parent().attr("id");

        $("#detail_play_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#category_page_heading").text(favoriteData.name);
        $("#category_page_desc").text(favoriteData.description);
        $("#category_page_duration").text(convertSeconds(favoriteData.duration));
        $("#background_slider").attr("src", favoriteData.pictures.sizes[favoriteData.pictures.sizes.length - 1]['link']);
        show_video_details();
    } else if ($(".detail_page_main_container").hasClass("active")) {
        if (elementId == "detail_play_btn") {
            console.log("detail play button enter.");
            var id = this.id;
            VIDEO_ID = this.dataset.id;
            PAGE_INDEX = 0;

            var valid_date = localStorage.getItem("youkid_expiry");
            var todayTime = new Date().getTime();
            if (valid_date > todayTime) {
                get_video_url();
            }
            else show_instruction_page();
        }
        else if (elementId == "detail_fav_btn") {
            console.log("detail fav btn enter");
            var favoriteId = $("#detail_fav_btn").attr("data-id");
            check_favorite_video_list(favoriteId, "detail_fav_btn");
            var id = this.id;
            var DataId = this.dataset.id;
            if (DataId) {
                setTimeout(function () {
                    var check = check_favorite_video_list(DataId, '');
                    if (check) add_remove_favorite_video(DataId, "SUB", id)
                    else add_remove_favorite_video(DataId, "ADD", id)

                }, 200);
            }
        }
        else if ($("#" + elementId).hasClass('focusable')) {
            $(".detail_video_list_box").addClass("active");
            console.log("detail page video item selected");
            THIRD_PAGE_SELECTED_ID = this.id;
            THIRD_PAGE_SELECTED_DATA_ID = this.dataset.id;
            $("#detail_fav_btn").attr("data-id", THIRD_PAGE_SELECTED_DATA_ID);
            $("#detail_play_btn").attr("data-id", THIRD_PAGE_SELECTED_DATA_ID);
            check_favorite_video_list(THIRD_PAGE_SELECTED_DATA_ID, "detail_fav_btn");
            if (_.size(THIRD_PAGE_SELECTED_DATA_ARRAY) > 0 && THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID]) {
                $("#category_page_heading").text(THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].name);
                $("#category_page_desc").text(THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].description);
                $("#category_page_duration").text(convertSeconds(THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].duration));
                $("#background_slider").attr("src", THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].pictures.sizes[THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].pictures.sizes.length - 1]['link']);
            }
            show_inner_video_details();
        }
    } else if ($(".search_result_main_container").hasClass("active")) {
        console.log("search item enter...");
        var id = this.id;
        SELECTED_VIDEO_ID = this.dataset.id;
        VOD_COUNTER = $("#" + id).index();
        PLAY_LIST_ELEMENT_ID = $("#" + id).parent().attr("id");

        $("#detail_play_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#category_page_heading").text(APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].name);
        $("#category_page_desc").text(APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].description);
        $("#category_page_duration").text(convertSeconds(APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].duration));
        $("#background_slider").attr("src", APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].pictures.sizes[APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].pictures.sizes.length - 1]['link']);
        show_video_details();
    } else if ($(".talent_page_container").hasClass("active")) {
        console.log("creator video enter");
        var id = this.id;
        VOD_COUNTER = $("#" + id).index();
        PLAY_LIST_ELEMENT_ID = $("#" + id).parent().attr("id");
        SELECTED_VIDEO_ID = this.dataset.id;

        $("#detail_play_btn").attr("data-id", SELECTED_VIDEO_ID);
        $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);

        $("#category_page_heading").text(SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].name);
        $("#category_page_desc").text(SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].description);
        $("#category_page_duration").text(convertSeconds(SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].duration));
        $("#background_slider").attr("src", SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].pictures.sizes[SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].pictures.sizes.length - 1]['link']);
        show_video_details();
    } else if ($(".video_container").hasClass("active")) {
        if (elementId == "playPauseVideo") {
            console.log("video pause......");
            if (VIDEO_PLAYER != "" && PLAY_VIDEO) {
                console.log("Play/Pause Video");
                if (VIDEO_PLAYER.paused) VIDEO_PLAYER.play();
                else VIDEO_PLAYER.pause();
            }
        } else if (elementId == "playNextVideo") {
            previous_next_video(type = "next");
        } else if (elementId == "playPreviousVideo") {
            previous_next_video(type = "previous");
        } else if (elementId == "video_container") {
            console.log("video container");
            $(".video_next_previous_container").show();
            $(".progress-container").show();
            hide_progress_bar = setTimeout(function () {
                running = false;
                $(".video_next_previous_container").hide();
                $(".progress-container").hide();
            }, 10000);
            SN.focus('videoSection');
        }
    }
}


function _onMouseOverEvent(e) {
    var elementId = this.id;
    console.log("focus container id", elementId);

    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }

    if (elementId != "") {
        if ($('#modal_container').hasClass("active")) {
            if (elementId.search("yesButton") > -1) $("#yesButton").focus();
            else if (elementId.search("noButton") > -1) $("#noButton").focus();
            else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
            else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
            if ($(".exit_modal_show").parent().attr("data-modal-name") == "EXIT") SN.focus("exitModal");
            else SN.focus("retryModal");

        } else {
            if (elementId.search("upgrade") > -1) $("#upgrade").focus();
            if (elementId.search("searchInputText") > -1) $("#searchInputText").focus();
            else if (elementId.search("about") > -1) $("#aboutBox").focus();
            else if (elementId.search("hamburger") > -1) $("#hamburger").focus();
            else if (elementId.search("rightArrow") > -1) $("#rightArrow").focus();
            else if (elementId.search("leftArrow") > -1) $("#leftArrow").focus();
            else if (elementId.search("favBtn") > -1) $("#favBtn").focus();
            else if (elementId.search("playBtn") > -1) $("#playBtn").focus();
            else if (elementId.search("BackBtn") > -1) $("#BackBtn").focus();
            else if (elementId.search("home_icon") > -1) $("#home_icon").focus();
            else if (elementId.search("searchEnter") > -1) $("#searchEnter").focus();
            else if ($("#" + elementId).closest('li').length > 0) $("#" + elementId).closest('li').focus();
        }
    }
}

function enable_disable_mouse() {
    console.log("mouse pointer handling");
    if ($('#modal_container').hasClass("active")) {
        $(".modal_container").css("pointer-events", "auto");
        $(".main_container").css("pointer-events", "none");
        $(".header_container").css("pointer-events", "none");
        $(".talent_page_container").css("pointer-events", "none");
        $(".category_container").css("pointer-events", "none");
        $(".detail_page_main_container").css("pointer-events", "none");
        $(".search_container").css("pointer-events", "none");
        $(".search_result_main_container").css("pointer-events", "none");
        $(".favorite_page_container").css("pointer-events", "none");
        $(".instruction_main_container").css("pointer-events", "none");
        $(".video_container").css("pointer-events", "none");
    }
    else if ($('.home_container').hasClass("active")) {
        $(".main_container").css("pointer-events", "auto");
        $(".home_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");
    } else if ($('.talent_page_container').hasClass("active")) {
        $(".talent_page_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");
    } else if ($('.category_container').hasClass("active")) {
        $(".category_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");
    } else if ($('.detail_page_main_container').hasClass("active")) {
        $(".detail_page_main_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");

    } else if ($('.search_container').hasClass("active")) {
        $(".search_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");

    } else if ($('.search_result_main_container').hasClass("active")) {
        $(".search_result_main_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");

    } else if ($('.favorite_page_container').hasClass("active")) {
        $(".favorite_page_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");

    } else if ($('.instruction_main_container').hasClass("active")) {
        $(".instruction_main_container").css("pointer-events", "auto");
        $(".header_container").css("pointer-events", "auto");

    }
    else if ($('.video_container').hasClass("active")) {
        $(".main_container").css("pointer-events", "none");
        $(".video_container").css("pointer-events", "auto");
        $(".player_icon_box").css("pointer-events", "auto");
        $(".video-player-container").css("pointer-events", "auto");

    }
}