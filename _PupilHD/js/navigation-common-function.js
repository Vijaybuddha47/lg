function manage_spatial_navigation(containerClass, favoriteStatus, vodId) {
    switch (containerClass) {
        case "menu_container":
            set_focus('left_sidebar', 'tv_channel');

            // When menu foucs
            $('#left_sidebar').on('sn:focused', function (e) {
                console.log("left sidebar focus...");
                if ($(".menu_container").hasClass("toggle_menu")) $(".menu_container").removeClass("toggle_menu");
                set_page_index();
                PREVIEW_FULL_DISPLAY = false;
                change_sidebar_focus_image(e.target.id);
                stopBackgroundVideoPlayer()
            });

            $('#left_sidebar').on('sn:enter-down', function (e) {
                console.log("left sidebar button enter...");
            });

            $('#tv_channel').on('sn:focused', function (e) {
                console.log("tv channel button focused...");
                if (!$(".home_container").hasClass("active")) {
                    $("#home_spinner").show();
                    if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                    if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                    PLAYER_STATE = 0;
                    MENU_INDEX = TAB_INDEX = PAGE_INDEX = 0;
                    reset_preview_player(true);
                    $('.menu_container').removeClass('toggle_menu');
                    $(".home_container, .account_container, .setting_container, .search_container, .video_library_container, .video_container, .exit_container").removeClass("active").hide();
                    if ((SELECTED_COUNTRY_GENRE == COUNTRY_GENRE) && (SELECTED_ALPHA_NUMERIC == ALPHA_NUMERIC)) {
                        reset_global_variable();
                        if (_.size(COUNTRY_CHOICE) > 0) {
                            var tempArray = JSON.parse(JSON.stringify(APP_COUNTRY_ARRAY));
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
                            APP_GENRE_COUNTRY_LIST = tempArray.slice(0);
                        } else {
                            APP_GENRE_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_COUNTRY_ARRAY));
                        }
                        if (SELECTED_COUNTRY_GENRE == "GENRE") APP_GENRE_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_GENRE_LIST));
                        set_homepage_genre_country_channel();
                    } else {
                        if (SELECTED_COUNTRY_GENRE == "COUNTRY") {
                            if (_.size(COUNTRY_WISE_CHANNEL_DATA) > 0) {
                                reset_global_variable();
                                if (_.size(COUNTRY_CHOICE) > 0) {
                                    var tempArray = APP_COUNTRY_ARRAY.slice(0);
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
                                    APP_GENRE_COUNTRY_LIST = tempArray.slice(0);
                                } else {
                                    APP_GENRE_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_COUNTRY_ARRAY));
                                }
                                set_homepage_genre_country_channel();
                            }
                            else getListOfCountries();

                        } else if (SELECTED_COUNTRY_GENRE == "GENRE") {
                            if (_.size(APP_GENRE_LIST) > 0) {
                                reset_global_variable();
                                APP_GENRE_COUNTRY_LIST = JSON.parse(JSON.stringify(APP_GENRE_LIST));
                                set_homepage_genre_country_channel();
                            } else getGenreList();

                        }
                    }
                }
            });

            $('#video_library').on('sn:focused', function (e) {
                console.log("video library button enter...");
                if (!$(".video_library_container").hasClass("active")) {
                    $("#home_spinner").show();
                    if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                    if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                    MENU_INDEX = TAB_INDEX = PAGE_INDEX = 1;
                    PLAYER_STATE = 0;
                    SECOND_PAGE_FOCUSED_ITEM = "video_item_0_0";
                    $('.menu_container').removeClass('toggle_menu');
                    reset_preview_player(true);
                    $(".home_container, .setting_container, .search_container, .account_container, .video_library_container, .video_container, .exit_container").removeClass("active").hide();
                    $(".episode_container").hide();
                    if (_.size(APP_VIDEO_CATEGORY) > 0) set_video_library_screen();
                    else get_new_release_video();
                }
            });


            $('#search').on('sn:focused', function (e) {
                console.log("search button enter...");
                if (!$(".search_container").hasClass("active")) {
                    $("#home_spinner").show();
                    if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                    if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                    PLAYER_STATE = 0;
                    MENU_INDEX = TAB_INDEX = PAGE_INDEX = 3;
                    reset_preview_player(true);
                    reset_search_result_container();
                    $('.menu_container').addClass('toggle_menu');
                    show_hide_screens("search_container");
                    $(".result_not_found").text("");
                    $('#searchInputText').val("");
                    $("#home_spinner").hide();
                }
            });

            $('#account').on('sn:focused', function (e) {
                console.log("account button enter...");
                if (!$(".account_container").hasClass("active")) {
                    $("#home_spinner").show();
                    if (PREVIEW_PLAYER) PREVIEW_PLAYER.pause();
                    if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                    reset_preview_player(false);
                    PLAYER_STATE = 0;
                    MENU_INDEX = TAB_INDEX = PAGE_INDEX = 4;
                    show_hide_screens("account_container");
                    $("#expiry_date").text(localStorage.getItem('pupilhd_app_expiry_date'));
                    $("#service_name").text(localStorage.getItem('pupilhd_app_service_name'));
                    $("#user_name").text(localStorage.getItem('pupilhd_app_user_name'));
                    $("#mac_address").text(localStorage.getItem('pupilhd_app_mac_address'));
                    $("#system_ip").text(localStorage.getItem('pupilhd_app_ip_address'));
                    $("#home_spinner").hide();
                }
            });

            $('#setting').on('sn:focused', function (e) {
                console.log("setting button enter...");
                if (!$(".setting_container").hasClass("active")) {
                    $("#home_spinner").show();
                    reset_preview_player(false);
                    PLAYER_STATE = 0;
                    MENU_INDEX = TAB_INDEX = PAGE_INDEX = 5;
                    $(".country_sub_list").css("display", "none");

                    if (_.size(COUNTRY_CHOICE) > 0) {
                        for (var i = 0; i < _.size(COUNTRY_CHOICE); i++) {
                            if (i == 0) {
                                $("#first_country_name").text(COUNTRY_CHOICE[i]);
                                $("#first_country_name").addClass("selected_country_choice_text");
                            } else if (i == 1) {
                                $("#second_country_name").text(COUNTRY_CHOICE[i]);
                                $("#second_country_name").addClass("selected_country_choice_text");
                            } else if (i == 2) {
                                $("#third_country_name").text(COUNTRY_CHOICE[i]);
                                $("#third_country_name").addClass("selected_country_choice_text");
                            }
                        }
                    }
                    show_hide_screens("setting_container");
                    $("#home_spinner").hide();
                }
            });

            $('#exit').on('sn:focused', function (e) {
                console.log("exit button enter...");
                $("#home_spinner").show();
                PLAYER_STATE = 0;
                show_hide_screens("exit_container");
                $("#home_spinner").hide();
            });

            break;

        case "account_container":
            set_focus('account_btns', 'manage');

            // When menu foucs
            $('#account_btns').on('sn:focused', function (e) {
                console.log("account btn focus...");
            });

            $('#manage').on('sn:enter-down', function (e) {
                console.log("account button enter...");
                $("#" + e.target.id).click();
            });

            //Sign out button clicked
            $('#sign_out').on('sn:enter-down', function (e) {
                console.log("account button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "alpha_numeric_container":
            set_focus('alpha_numeric', 'alphabet');

            // When menu foucs
            $('#alpha_numeric').on('sn:focused', function (e) {
                console.log("alpha_numeric btn focus...");
            });

            $('#alpha_numeric').on('sn:enter-down', function (e) {
                console.log("alpha_numeric button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "country_genre_container":
            set_focus('country_genre', 'genre');

            // When menu foucs
            $('#country_genre').on('sn:focused', function (e) {
                console.log("country_genre btn focus...");
            });

            $('#country_genre').on('sn:enter-down', function (e) {
                console.log("country_genre button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "country_choice_container":
            set_focus('country_choice', 'first_country');

            // When menu foucs
            $('#country_choice').on('sn:focused', function (e) {
                console.log("country_choice btn focus...");
            });

            $('#country_choice').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;

        case "first_country_container":
            set_focus('first_country_list', 'country_number_1_0');

            // When menu foucs
            $('#first_country_list').on('sn:focused', function (e) {
                console.log("first_country_list btn focus...");
            });

            $('#first_country_list').on('sn:enter-down', function (e) {
                console.log("first_country_list button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "second_country_container":
            set_focus('second_country_list', 'country_number_2_0');

            // When menu foucs
            $('#second_country_list').on('sn:focused', function (e) {
                console.log("second_country_list btn focus...");
            });

            $('#second_country_list').on('sn:enter-down', function (e) {
                console.log("second_country_list button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "third_country_container":
            set_focus('third_country_list', 'country_number_3_0');

            // When menu foucs
            $('#third_country_list').on('sn:focused', function (e) {
                console.log("third_country_list btn focus...");
            });

            $('#third_country_list').on('sn:enter-down', function (e) {
                console.log("third_country_list button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "tv_channel_search_result":
            set_focus('channel_result', 'channel_result_0');

            // When menu foucs
            $('#channel_result').on('sn:focused', function (e) {
                MENU_INDEX = TAB_INDEX = PAGE_INDEX = 3;
                console.log("channel_result item focus...");
                FOURTH_PAGE_FOCUSED_ITEM = e.target.id;
                SELECTED_CHANNEL_TYPE = "CHA";
                var parentId = $("#" + FOURTH_PAGE_FOCUSED_ITEM).parent().attr('id');
                search_screen_next_previous_item(parentId);
                stopBackgroundVideoPlayer();
            });

            $('#channel_result').on('sn:enter-down', function (e) {
                console.log("channel_result item enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "video_search_result":
            set_focus('video_result', 'video_result_0');

            // When menu foucs
            $('#video_result').on('sn:focused', function (e) {
                console.log("video_result item focus...");
                MENU_INDEX = TAB_INDEX = PAGE_INDEX = 3;
                FOURTH_PAGE_FOCUSED_ITEM = e.target.id;
                SELECTED_CHANNEL_TYPE = "VOD";
                var parentId = $("#" + FOURTH_PAGE_FOCUSED_ITEM).parent().attr('id');
                search_screen_next_previous_item(parentId);
                stopBackgroundVideoPlayer();
            });

            $('#video_result').on('sn:enter-down', function (e) {
                console.log("video_result item enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "LOGOUT":
            set_focus('logout_modal', 'no_logout');

            // When menu foucs
            $('#logout_modal').on('sn:focused', function (e) {
                console.log("logout_modal btn focus...");
            });

            $('#no_logout').on('sn:enter-down', function (e) {
                console.log("nologout btn enter...");
                $("#" + e.target.id).click();
            });

            $('#yes_logout').on('sn:enter-down', function (e) {
                console.log("yes logout button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "MANAGE_POPUP":
            set_focus('manage_modal', 'manage_popup');

            // When menu foucs
            $('#manage_modal').on('sn:focused', function (e) {
                console.log("manage_modal btn focus...");
            });

            $('#manage_modal').on('sn:enter-down', function (e) {
                console.log("OK manage_modal button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "Favorite_button":
            set_focus('favorite_button', 'player_fav');

            // When menu foucs
            $('#favorite_button').on('sn:focused', function (e) {
                console.log("favorite button btn focus...");
                $("#video_content_details").show();
                if (TIMER) {
                    clearTimeout(TIMER); //cancel the previous TIMER.
                    TIMER = null;
                }

                TIMER = setTimeout(function () {
                    $("#video_content_details").hide();
                    if (PREVIEW_FULL_DISPLAY) SN.focus("previewVideoPlayer");
                }, 3000);
            });

            $('#favorite_button').on('sn:enter-down', function (e) {
                console.log("OK favorite button button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "favorite_container":
            set_focus('favorite_list', 'fav_channel_0_0');

            // When menu foucs
            $('#favorite_list').on('sn:focused', function (e) {
                console.log("favorite item focus...");
                PAGE_INDEX = MENU_INDEX = TAB_INDEX = 0;
                FIRST_PAGE_FOCUSED_ITEM = e.target.id;
                var parentId = $("#" + FIRST_PAGE_FOCUSED_ITEM).parent().attr('id');
                var countryIndex = $("#" + FIRST_PAGE_FOCUSED_ITEM).parent().parent().parent().find("h1").attr('id');
                set_first_last_unfocusable_list(parentId, countryIndex);
                stopBackgroundVideoPlayer();
            });

            $('#favorite_list').on('sn:enter-down', function (e) {
                console.log("favorite item  enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "episode_container":
            set_focus('episode_list', 'episode_0');

            // When menu foucs
            $('#episode_list').on('sn:focused', function (e) {
                console.log("episode focus...");
                PAGE_INDEX = MENU_INDEX = TAB_INDEX = 2;
                THIRD_PAGE_FOCUS_ITEM = e.target.id;
                set_next_previous_episodes();
                if ($("#" + THIRD_PAGE_FOCUS_ITEM).index() == 0) $("#episode_left_shadow_box").hide();
                if ($("#" + THIRD_PAGE_FOCUS_ITEM + "li:last").is(':last-child')) $("#episode_right_shadow_box").hide();
                stopBackgroundVideoPlayer();

            });

            $('#episode_list').on('sn:enter-down', function (e) {
                console.log("open video player for episode");
                $("#" + e.target.id).click();
                // PAGE_INDEX = MENU_INDEX = TAB_INDEX = 2;
                // var index = $("#" + e.target.id).index();
                // SELECTED_EPIOSDE_NUMBER = index + 1;
                // if (VIDEO_PLAYER) VIDEO_PLAYER.pause();
                // VOD_COUNTER = index;
                // VOD_URL = SELECTED_EPISODES[index];
                // setTimeout(function () {
                //     PLAYER_STATE = 1;
                //     load_video();
                //     show_hide_show_deatils(true);
                //     sendMediaInfo("video", SELECTED_VIDEO_DATA["id"]);
                // }, 1000);
            });
            break;

        case "result_episode_container":
            set_focus('search_result_episode_list', 'search_episode_0');

            // When menu foucs
            $('#search_result_episode_list').on('sn:focused', function (e) {
                console.log("episode focus...");
                PAGE_INDEX = MENU_INDEX = TAB_INDEX = 3;
                set_next_previous_searched_result_episodes();
                stopBackgroundVideoPlayer();
                if ($("#" + e.target.id).index() == 0) $("#result_episode_left_shadow_box").hide();
                if ($("#" + e.target.id + "li:last").is(':last-child')) $("#result_episode_right_shadow_box").hide();

            });

            $('#search_result_episode_list').on('sn:enter-down', function (e) {
                console.log("open video player for episode");
                $("#" + e.target.id).click();
            });
            break;

        case "search_container":
            set_focus('searchBox', 'searchInputText');

            // When menu foucs
            $('#searchBox').on('sn:focused', function (e) {
                $(".menu_container").addClass("toggle_menu");
                console.log("searchBox btn focus...");
            });

            $('#searchBox').on('sn:enter-down', function (e) {
                console.log("searchBox button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "channel_number_container":
            set_focus('channel_input_box', 'channel_input');

            $('#channel_input_box').on('sn:focused', function (e) {
                console.log("channel search input box focus.");
                clearTimeout(TIME_OUT_FIRST);
                TIME_OUT_FIRST = setTimeout(function () {
                    hide_channel_input_box();
                }, 10000);
            });

            $('#channel_input_box').on('sn:enter-down', function (e) {
                console.log("channel search input box enter.");
                $("#" + e.target.id).click();
            });

            break;

        case "exit_container_box":
            set_focus('exit_container', 'exitOk');

            // When menu foucs
            $('#exit_container').on('sn:focused', function (e) {
                console.log("exit_ok btn focus...");
            });

            $('#exit_container').on('sn:enter-down', function (e) {
                console.log("exit_ok button enter...");
                $("#" + e.target.id).click();
            });
            break;

        case "EXIT":
            set_focus('exitModal', 'noButton');
            SN.focus("exitModal");

            $('#exitModal').on('sn:focused', function (e) {
                console.log("exitModal focus");
            });

            $('#noButton').on('sn:enter-down', function (e) {
                console.log('hide popup');
                $("#" + e.target.id).click();
            });

            $('#yesButton').on('sn:enter-down', function (e) {
                console.log('exit app');
                $("#" + e.target.id).click();
            });
            break;

        case "RETRY_CANCEL":
            set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryButton').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            $('#cancelButton').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            $('#retryModal').on('sn:enter-down', function (e) {
                console.log("RETRY_CANCEL sn:enter-down");
                $("#" + e.target.id).click();
            });
            break;

        case "RETRY_EXIT":
            set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').on('sn:enter-down', function (e) {
                console.log("RETRY_EXIT sn:enter-down");
                $("#" + e.target.id).click();
            });
            break;
    }
}

function set_focus(containerId, itemId) {
    console.log("set focus");
    var restrictVal = "self-first";
    if (containerId == "EXIT" || containerId == "RETRY_CANCEL") restrictVal = "self-only";

    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        restrict: restrictVal,
        defaultElement: '#' + itemId,
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
}

function focus_channel_list() {
    console.log("set channel_list focus");
    var restrictVal = "self-first";
    var containerId = "channel_list_" + ROW_INDEX;
    var itemId = "row_item_" + ROW_INDEX + "_0";
    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        restrict: restrictVal,
        defaultElement: '#' + itemId,
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
}

function set_channel_list_focus(row_num) {
    console.log("set country focus");
    var restrictVal = "self-first";
    var total = 0;
    if (SELECTED_COUNTRY_GENRE == "COUNTRY") total = _.size(APP_COUNTRY_LIST);
    else if (SELECTED_COUNTRY_GENRE == "GENRE") total = _.size(APP_GENRE_LIST);
    for (i = row_num; i < total; i++) {
        var containerId = "channel_list_" + i;
        var itemId = "row_item_" + i + "_0";
        SN.remove(containerId);
        SN.add({
            id: containerId,
            selector: '#' + containerId + ' .focusable',
            restrict: restrictVal,
            defaultElement: '#' + itemId,
            enterTo: 'last-focused'
        });
        SN.makeFocusable();
    }

    // When menu foucs
    $('[id^=channel_list_]').on('sn:focused', function (e) {
        console.log("country_list item focus...");
        PAGE_INDEX = MENU_INDEX = TAB_INDEX = 0;
        var id = FIRST_PAGE_FOCUSED_ITEM = e.target.id;
        if (!$('.menu_container').hasClass("toggle_menu")) $('.menu_container').toggleClass('toggle_menu');
        var parentId = $("#" + id).parent().attr('id');
        var countryIndex = $("#" + id).parent().parent().parent().find("h1").attr('id');
        set_first_last_unfocusable_list(parentId, countryIndex);
    });

    $('[id^=channel_list_]').on('sn:enter-down', function (e) {
        console.log("country_list item enter...");
        $("#" + e.target.id).click();
    });
}



function focus_video_list(index) {
    console.log("set video_list focus");
    var restrictVal = "self-first";
    var containerId = "video_list_" + index;
    var itemId = "video_item_" + index + "_0";
    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        restrict: restrictVal,
        defaultElement: '#' + itemId,
        enterTo: 'last-focused',
    });
    SN.makeFocusable();
}


function set_video_list_focus(index) {
    console.log("set video list focus");
    var restrictVal = "self-first";
    var containerId = "video_list_" + index;
    var itemId = "video_item_" + index + "_0";
    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        restrict: restrictVal,
        defaultElement: '#' + itemId,
        enterTo: 'last-focused',
    });
    SN.makeFocusable();


    // When menu foucs
    $('[id^=video_list_]').on('sn:focused', function (e) {
        console.log("video_list item focus...");
        PAGE_INDEX = MENU_INDEX = TAB_INDEX = 1;
        if (!$('.menu_container').hasClass("toggle_menu")) $('.menu_container').toggleClass('toggle_menu');
        SECOND_PAGE_FOCUSED_ITEM = e.target.id;
        var parentId = $("#" + SECOND_PAGE_FOCUSED_ITEM).parent().attr('id');
        var countryIndex = $("#" + SECOND_PAGE_FOCUSED_ITEM).parent().parent().parent().find("h1").attr('id');
        set_video_library_next_previous_list(parentId, countryIndex);
        if ($("#" + SECOND_PAGE_FOCUSED_ITEM).index() == 0) $("#half_video_left_side_" + countryIndex).hide();
        if ($("#" + SECOND_PAGE_FOCUSED_ITEM + "li:last").is(':last-child')) $("#half_video_right_side_" + countryIndex).hide();

    });

    $('[id^=video_list_]').on('sn:enter-down', function (e) {
        console.log("video_list item enter...");
        $("#" + e.target.id).click();
    });

}