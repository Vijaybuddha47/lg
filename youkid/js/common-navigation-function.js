function manage_spatial_navigation(containerClass, favoriteStatus, vodId) {
    switch (containerClass) {
        case "homepage_header":
            set_focus('homepage_header', 'hamburger');

            // When menu foucs
            $('#homepage_header').on('sn:focused', function (e) {
                console.log("homepage_header focus...");
                set_default_widget_image();
                change_focused_homepage_button('');
                LAST_FOCUSED_ITEM = e.target.id;

                var elmList = $('ul#talentList li');

                if (isVisible(elmList[0])) $(".talent_right").hide();
                else $(".talent_right").show();

                if (isVisible(elmList[$("ul#talentList li").last().index() - 1])) $(".talent_left").hide();
                else $(".talent_left").show();

                if ($('[id^=talent_]').is(":focus")) {
                    // When talent focus
                    console.log("talent list focus");
                    $("#" + e.target.id).index();
                    FOCUSED_TALENT_ID = e.target.dataset.id;
                    $("#talentBox").css("width", "1048px");
                } else if ($("#hamburger").is(":focus")) {
                    $(".talent_right").hide();
                    $("#homePage").find("img").attr("src", "images/home_icon.png");
                    if ($(".menulist_container").hasClass("active")) $("#menuImg").attr("src", "images/close_menu_focus.png");
                    else $("#menuImg").attr("src", "images/menu_focus.png");

                    $("#talentBox").css("width", "1048px");
                    // When search input focus
                } else if ($("#searchInputText").is(":focus")) {
                    console.log("search input focus");
                    $(".talent_right").hide();
                    $(".menulist_container").removeClass("active");
                    $("#menuList").removeClass("show_menu");
                    $('#searchText').val("");
                    $("#menuImg").attr("src", "images/menu.png");
                    $("#talentBox").css("width", "905px");
                }

            });

            // When search button selection
            $('#homepage_header').on('sn:enter-down', function (e) {
                console.log("homepage_header enter...");
                $("#" + e.target.id).click();
            });

            break;

        case "hamburger_menu_close":
            set_focus('hamburgerMenuClose', 'hamburgerClose');

            // When menu foucs
            $('#hamburgerMenuClose').on('sn:focused', function (e) {
                console.log("hamburger focus...");
                PAGE_INDEX = 0;
                $("#closeMenuImg").attr("src", "images/close_menu_focus.png");
                if (!$(".menulist_container").hasClass("active")) {
                    $(".menulist_container").addClass("active");
                    $("#menuList").addClass("show_menu");
                    $("#hamburgerMenu").css("display", "none");
                }
            });

            // When search button selection
            $('#hamburgerMenuClose').on('sn:enter-down', function (e) {
                console.log("hamburger close enter...");
                $("#" + e.target.id).click();
            });

            break;

        case "home_page_item_container":
            set_focus("homePageItem", "home_page_item_0_1");

            $('#homePageItem').on('sn:focused', function (e) {
                console.log("home page item focus");
                PAGE_INDEX = 0;
                LAST_FOCUSED_ITEM = e.target.id;
                FIRST_PAGE_FOCUSED_ITEM = e.target.id;
                CURRENT_ROW = Number($("#" + FIRST_PAGE_FOCUSED_ITEM).parent().parent().attr("data-row"));

                $("#menuImg").attr("src", "images/menu.png");
                change_focused_homepage_button('');

                $(".tile-grid").find('img').attr("src", "images/tile_button.png");
                if ($("#" + FIRST_PAGE_FOCUSED_ITEM).hasClass('tile-grid')) {
                    $("#" + FIRST_PAGE_FOCUSED_ITEM).find("img").attr("src", "images/tile_button_focus.png");
                }
                var row = $(":focus").parent().parent().parent().parent().attr("data-row");
                if (row == 0) MOVE_UP_FOCUS = true;
                else MOVE_UP_FOCUS = false;
                var ulID = $("#" + FIRST_PAGE_FOCUSED_ITEM).parent().attr("id");
                var lastLi = $("#" + ulID + " li").last().index();
                if ($("#" + FIRST_PAGE_FOCUSED_ITEM).index() == (lastLi - 1) && $("#" + FIRST_PAGE_FOCUSED_ITEM).index() < _.size(HOME_PAGE_DATA[row])) {
                    console.log("append li");
                    lazy_load_items(row, lastLi);
                }
            });

            // When watchlist button focus
            $('#homePageItem').on('sn:enter-down', function (e) {
                console.log("home page item enter");
                $("#" + e.target.id).click();
            });

            break;

        case "home_page_menu_wise_item_container":
            set_focus("homePageMenuWiseItem", "home_page_menu_wise_item_0_1");

            $('#homePageMenuWiseItem').on('sn:focused', function (e) {
                console.log("home page item focus");
                PAGE_INDEX = 0;
                LAST_FOCUSED_ITEM = e.target.id;
                FIRST_PAGE_FOCUSED_ITEM = e.target.id;
                CURRENT_ROW = Number($("#" + FIRST_PAGE_FOCUSED_ITEM).parent().parent().attr("data-row"));

                $("#menuImg").attr("src", "images/menu.png");
                change_focused_homepage_button('');

                $(".tile-grid").find('img').attr("src", "images/tile_button.png");
                if ($("#" + FIRST_PAGE_FOCUSED_ITEM).hasClass('tile-grid')) {
                    $("#" + FIRST_PAGE_FOCUSED_ITEM).find("img").attr("src", "images/tile_button_focus.png");
                }
            });

            // When watchlist button focus
            $('#homePageMenuWiseItem').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "menulist_container":
            console.log("set menulist_container");
            set_focus('home_tablist', 'homePage');

            // When talent focus
            $('#home_tablist').on('sn:focused', function (e) {
                console.log("menu list focus");
                PAGE_INDEX = 0;
                $("#closeMenuImg").attr("src", "images/close_menu.png");
                let id = e.target.id;
                change_focused_menu_image(id);
            });

            // When talent enter
            $('#home_tablist').on('sn:enter-down', function (e) {
                console.log("menu left side list enter");
                $("#" + e.target.id).click();
            });

            break;

        case "homepage_button":
            set_focus('homepageButton', 'playBtn');

            // When home page button focus
            $('#homepageButton').on('sn:focused', function (e) {
                console.log("home page button focus");
                var id = e.target.id;
                PAGE_INDEX = 0;
                LAST_FOCUSED_ITEM = e.target.id;
                PLAY_PAGE_INDEX = 1;
                $("#hamburger").find("img").attr("src", "images/menu.png");
                $(".tile-grid").find('img').attr("src", "images/tile_button.png");
                change_focused_homepage_button(id);
                $("#talentBox").css("width", "1048px");
            });

            // When home page button enter
            $('#homepageButton').on('sn:enter-down', function (e) {
                console.log("home page buttons focus");
                $("#" + e.target.id).click();
            });

            // When Play button enter
            $('#playBtn').on('sn:enter-down', function (e) {
                console.log("home page play btn enter...");
                $("#" + e.target.id).click();
            });

            // When fav button enter
            $('#favBtn').on('sn:enter-down', function (e) {
                console.log("favorite button enter");
                $("#" + e.target.id).click();
            });

            // When NEXT button enter
            $('#leftArrow').on('sn:enter-down', function (e) {
                console.log("NEXT button enetr");
                $("#" + e.target.id).click();
            });

            // When PREVIOUS button enter
            $('#rightArrow').on('sn:enter-down', function (e) {
                console.log("PREVIOUS button enetr");
                $("#" + e.target.id).click();
            });

            break;

        case "cancel_button_container":
            console.log("set cancel button");
            set_focus('CancelButton', 'BackBtn');

            // When cancel button focus
            $('#CancelButton').on('sn:focused', function (e) {
                if (e.target.id == 'BackBtn') {
                    $("#home_icon").attr("src", "images/home_top.png");
                    $("#" + e.target.id).attr("src", "images/close_focus.png");
                } else if (e.target.id == 'home_icon') {
                    $("#BackBtn").attr("src", "images/close.png");
                    $("#" + e.target.id).attr("src", "images/home_top_focus.png");
                }

            });

            // When cancel button enter
            $('#CancelButton').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "talent_page_container":
            set_focus('creator_video_list', 'creator_video_list_0');

            // When talent focus
            $('#creator_video_list').on('sn:focused', function (e) {
                console.log("creator video focus");
                PAGE_INDEX = TAB_INDEX = 1;

                var dataId = e.target.dataset.id;
                $("#background_slider").attr("src", SELECTED_TALENT_DATA[dataId].pictures.sizes[SELECTED_TALENT_DATA[dataId].pictures.sizes.length - 1]['link']);
                $("#focused_talent_video_name").text(SELECTED_TALENT_DATA[dataId].name);
                $("#focused_talent_video_desc").text(SELECTED_TALENT_DATA[dataId].description);
                $("#focused_talent_video_time").text(convertSeconds(SELECTED_TALENT_DATA[dataId].duration));
                $("#BackBtn").attr("src", "images/close.png");
                if ($("#home_icon").hasClass('focusable')) {
                    $("#home_icon").attr("src", "images/home_top.png");
                }
            });

            // When talent enter
            $('#creator_video_list').on('sn:enter-down', function (e) {
                console.log("creator video enter");
                $("#" + e.target.id).click();
            });

            break;

        case "search_container":
            set_focus('searchPage', 'searchText');

            // When search input focus
            $('#searchPage').on('sn:focused', function (e) {
                console.log("search input focus");
                PAGE_INDEX = 3;
                $("#background_slider").attr("src", "images/bg.png");
                SN.remove("searchResultList");
            });

            $('#searchText').on('sn:enter-down', function (e) {
                console.log("search input selected");

            });

            $('#searchEnter').on('sn:enter-down', function (e) {
                console.log("search input selected");
                // request_search_results();

            });

            break;

        case "search_result_main_container":
            set_focus('searchResultList', 'search_item_0');

            $('#searchResultList').on('sn:focused', function (e) {
                console.log("search item focus...");
                PAGE_INDEX = 4;
                $("#BackBtn").attr("src", "images/close.png");
                var dataId = e.target.dataset.id;
                $("#background_slider").attr("src", APP_SEARCH_DATA_ARRAY[dataId].pictures.sizes[APP_SEARCH_DATA_ARRAY[dataId].pictures.sizes.length - 1]['link']);
                $("#search_page_heading").text(APP_SEARCH_DATA_ARRAY[dataId].name);
                $("#search_page_desc").text(APP_SEARCH_DATA_ARRAY[dataId].description);
                $("#search_page_duration").text(convertSeconds(APP_SEARCH_DATA_ARRAY[dataId].duration));

            });

            $('#searchResultList').on('sn:enter-down', function (e) {
                console.log("search item enter...");
                $("#" + e.target.id).click();
            });

            break;

        case "favorite_page_container":
            set_focus('favoriteList', 'search_item_0');

            $('#favoriteList').on('sn:focused', function (e) {
                console.log("favorite item focus...");
                PAGE_INDEX = TAB_INDEX = 5;
                $("#BackBtn").attr("src", "images/close.png");
                var dataId = e.target.dataset.id;
                var favoriteData = JSON.parse(localStorage["id_" + dataId]);
                $("#background_slider").attr("src", favoriteData.pictures.sizes[favoriteData.pictures.sizes.length - 1]['link']);
            });

            $('#favoriteList').on('sn:enter-down', function (e) {
                console.log("favorite item enter...");
                $("#" + e.target.id).click();
            });

            break;

        case "category_container":
            set_focus('categoryitems', 'category_row_video_list_0');

            $('#categoryitems').on('sn:focused', function (e) {
                console.log("category matrix page focus.");
                PAGE_INDEX = TAB_INDEX = 2;
                $("#BackBtn").attr("src", "images/close.png");
                var id = e.target.dataset.id;
                $("#catVideoTitle").text(APP_HOME_PAGE_MIXED_DATA[id].name);
                $("#catVideoDesc").text(APP_HOME_PAGE_MIXED_DATA[id].description);
                $("#catVideoDuration").text(convertSeconds(APP_HOME_PAGE_MIXED_DATA[id].duration));
                $("#background_slider").attr("src", APP_HOME_PAGE_MIXED_DATA[id].pictures.sizes[APP_HOME_PAGE_MIXED_DATA[id].pictures.sizes.length - 1]['link']);
                if ($("#home_icon").hasClass('focusable')) {
                    $("#home_icon").attr("src", "images/home_top.png");
                }
            });

            $('#categoryitems').on('sn:enter-down', function (e) {
                console.log("category items focus");
                $("#" + e.target.id).click();
            });

            break;

        case "detail_page_buttons":
            set_focus('DetailPageButton', 'detail_play_btn');

            $('#detail_play_btn').on('sn:focused', function (e) {
                console.log("deatil page button focus");
                PLAY_PAGE_INDEX = 2;
                PAGE_INDEX = 6;
                $("#home_icon").attr("src", "images/home_top.png");
                $("#BackBtn").attr("src", "images/close.png");
                var favoriteId = $("#detail_fav_btn").attr("data-id");
                check_favorite_video_list(favoriteId, "detail_fav_btn");

                if (THIRD_PAGE_SELECTED_DATA_ID == '' && PAGE_INDEX == 1) {
                    $("#detail_play_btn").attr("data-id", SELECTED_VIDEO_ID);
                    $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);
                    $("#category_page_heading").text(SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].name);
                    $("#category_page_desc").text(SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].description);
                    $("#category_page_duration").text(convertSeconds(SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].duration));
                    $("#background_slider").attr("src", SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].pictures.sizes[SELECTED_TALENT_DATA[SELECTED_VIDEO_ID].pictures.sizes.length - 1]['link']);
                } else if (THIRD_PAGE_SELECTED_DATA_ID == '' && PAGE_INDEX == 4) {
                    $("#detail_play_btn").attr("data-id", SELECTED_VIDEO_ID);
                    $("#detail_fav_btn").attr("data-id", SELECTED_VIDEO_ID);
                    $("#category_page_heading").text(APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].name);
                    $("#category_page_desc").text(APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].description);
                    $("#category_page_duration").text(convertSeconds(APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID].duration));
                    $("#background_slider").attr("src", APP_SEARCH_DATA_ARRAY[SELECTED_VIDEO_ID]['image']);

                } else if (THIRD_PAGE_SELECTED_DATA_ID == '' && PAGE_INDEX == 0) {
                    $("#category_page_desc").text(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].description);
                    $("#category_page_duration").text(convertSeconds(APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].duration));
                    $("#background_slider").attr("src", APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].pictures.sizes[APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID].pictures.sizes.length - 1]['link']);
                    $("#detail_fav_btn").attr("data-id", FIRST_PAGE_SELECTED_DATA_ID);
                    $("#detail_play_btn").attr("data-id", FIRST_PAGE_SELECTED_DATA_ID);
                } else if (THIRD_PAGE_SELECTED_DATA_ID != '') {
                    $("#category_page_desc").text(THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].description);
                    $("#category_page_duration").text(convertSeconds(THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].duration));
                    $("#background_slider").attr("src", THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].pictures.sizes[THIRD_PAGE_SELECTED_DATA_ARRAY[THIRD_PAGE_SELECTED_DATA_ID].pictures.sizes.length - 1]['link']);
                    $("#detail_fav_btn").attr("data-id", THIRD_PAGE_SELECTED_DATA_ID);
                    $("#detail_play_btn").attr("data-id", THIRD_PAGE_SELECTED_DATA_ID);
                }
            });

            $('#detail_fav_btn').on('sn:enter-down', function (e) {
                console.log("detail fav btn enter");
                $("#" + e.target.id).click();
            });

            $('#detail_play_btn').on('sn:enter-down', function (e) {
                console.log("detail play button enter.");
                $("#" + e.target.id).click();
            });

            break;

        case "detail_page_video_items":
            set_focus('deatilPageVideoList', 'deatil_page_video_item_0');

            // When search input focus
            $('#deatilPageVideoList').on('sn:focused', function (e) {
                PAGE_INDEX = 6;
            });

            // When search input enter
            $('#deatilPageVideoList').on('sn:enter-down', function (e) {
                console.log("detail page video item selected");
                $("#" + e.target.id).click();
            });

            break;

        case "EXIT":
            set_focus('exitModal', 'noButton');

            SN.focus("exitModal");
            $('#exitModal').off('sn:enter-down');
            $('#exitModal').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;

        case "LOGOUT": set_focus('exitModal', 'noButton');
            SN.focus("exitModal");

            $('#noButton').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();

            });

            $('#yesButton').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;

        case "RETRY_CANCEL": set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;

        case "RETRY_EXIT": set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                console.log("retryModal sn:enter-down");
                $("#" + e.target.id).click();
            });
            break;
    }
}

function set_search_focus() {
    var prefix = get_search_id_prefix();
    set_focus(prefix + 'Searchbox', prefix + 'menu_button_1');
    set_focus(prefix + 'SearchInputBox', prefix + 'SearchInput');

    $('#' + prefix + 'Searchbox, #' + prefix + 'SearchInputBox').on('sn:focused', function (e) {
        console.log(prefix + 'Searchbox focused ...');
        $("#menuList li:nth-child(" + (MENU_INDEX + 1) + ")").addClass("menu_border");

        turn_off_list_item_overlay();
        $(".search_box").addClass("active");
        $(".menu_container, .live_page_container, #liveList, [id=movieList], .logout_page_container, .video_details_page_container").removeClass("active");
    });

    $('#' + prefix + 'Searchbox').on('sn:enter-down', function (e) {
        var prefix = get_search_id_prefix();
        console.log(prefix + 'Searchbox enter-down ...');

        $('#' + prefix + 'Searchbox').hide();
        $('#' + prefix + 'SearchInputBox').show();
        SN.focus(prefix + 'SearchInputBox');
    });
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

function set_search_default_ui() {
    var prefix = get_search_id_prefix();
    $('#' + prefix + 'SearchInputBox').hide();
    $('#' + prefix + 'Searchbox').show();
}