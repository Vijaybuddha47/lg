function manage_spatial_navigation(containerClass, favoriteStatus, vodId) {
    switch (containerClass) {
        case "menu_container":
            set_focus('menu_items', 'menu_0');

            // When menu foucs
            $('#menu_items').on('sn:focused', function (e) {
                $(".search_input_container").find("img").attr("src", "images/search_icon.png");
                $("#search_bar").hide();
                $("#search_bar_box").show();
                $("li.nav_box").removeClass("selected_menu");
                $("li.home_content_box").removeClass("selected_home_item");
                change_menu_focus(e.target.id);
            });

            // Menu button selection
            $('#menu_items').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "homepage_container":
            set_focus('homepage_items', 'live_guide');

            // When home page item foucs
            $('#homepage_items').on('sn:focused', function (e) {
                TAB_INDEX = PAGE_INDEX = 0;
                $("#" + SELECTED_MENU).addClass("selected_menu");
                change_menu_focus(SELECTED_MENU);
            });

            // Home page item selection
            $('#homepage_items').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();

            });

            break;

        case "on_demand_container":
            set_focus('ondemand_items', 'vod_cat_0');

            // When home page item foucs
            $('#ondemand_items').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 3;
                change_menu_focus(SELECTED_MENU);
                CAT_VOD_LIST = {};
                VOD_BREADCRUMB = [];
            });

            // Home page item selection
            $('#ondemand_items').on('sn:enter-down', function (e) {
                setTimeout(function () {
                    $("#" + e.target.id).click();
                }, 200);
            });

            break;

        case "sub_category_container":
            set_focus('sub_category_list', 'sub_cat_0');

            // When home page item foucs
            $('#sub_category_list').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 4;
                change_menu_focus(SELECTED_MENU);
                create_bread_crumb();
            });

            // Home page item selection
            $('#sub_category_list').on('sn:enter-down', function (e) {
                setTimeout(function () {
                    $("#" + e.target.id).click();
                }, 200);
            });

            break;


        case "video_list_container":
            set_focus('video_list', 'video_0');

            // When home page item foucs
            $('#video_list').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 5;
                FOCUSED_VIDEO_INDEX = $("#" + e.target.id).index();
                change_menu_focus(SELECTED_MENU);
                $(".search_input_container").find("img").attr("src", "images/search_icon.png");
                $("#search_bar").hide();
                $("#search_bar_box").show();
                set_video_details();
                create_bread_crumb();
            });

            // Home page item selection
            $('#video_list').on('sn:enter-down', function (e) {
                setTimeout(function () {
                    $("#" + e.target.id).click();
                }, 200);
            });

            break;

        case "listing_box_programs":
            set_focus('channel_slider', 'live_0_0');

            // When live guide item foucs
            $('#channel_slider').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 2;
                SECOND_PAGE_FOCUSED_ITEM = e.target.id;
            });


            // live guide item selection
            $('#channel_slider').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "channel_container":
            set_focus('channel_number_box', 'channel_box_0');

            // When home page item foucs
            $('#channel_number_box').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 1;
                change_menu_focus(SELECTED_MENU);
            });

            // Home page item selection
            $('#channel_number_box').on('sn:enter-down', function (e) {
                SELECTED_CHANNEL_BOX = Number(e.target.dataset.index);
                $("#" + e.target.id).click();
            });

            break;

        case "program_time_container":
            set_focus('program_container', 'program_1');

            // When home page item foucs
            $('#program_container').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 2;
                SECOND_PAGE_FOCUSED_ITEM = e.target.id;
            });

            // Home page item selection
            $('#program_container').on('sn:enter-down', function (e) {
                LIVE_CATCHUP = false;
                $("#" + e.target.id).click();
            });

            break;

        case "parental_control_box":
            set_focus('parentalcontrol_popup', 'unlock_password');

            $('#unlock_cancel').on('sn:enter-down', function (e) {
                document.getElementById("unlock_password").value = "";
                $("#parentalcontrol_popup").hide();
                SN.focus("#" + SECOND_PAGE_FOCUSED_ITEM);

            });
            $('#unlock_ok').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "logout_container":
            set_focus('manage_btn', 'logout_btn');

            // When logout button foucs
            $('#manage_btn').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 6;
                $("#" + SELECTED_MENU).addClass("selected_menu");
                change_menu_focus(SELECTED_MENU);
            });

            // logout buttn selection
            $('#logout_btn').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "search_bar_box":
            set_focus('search_bar_box', 'searchBox');

            // When search box foucs
            $('#search_bar_box').on('sn:focused', function (e) {
                $(".search_input_container").find("img").attr("src", "images/search_icon_focused.png");
            });

            // search box selection
            $('#search_bar_box').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "search_bar":
            set_focus('search_bar', 'searchInputText');

            // When search box foucs
            $('#search_bar').on('sn:focused', function (e) {
                $(".search_bar").addClass("active");
                $(".search_input_container").find("img").attr("src", "images/search_icon_focused.png");
            });

            // search box selection
            $('#search_bar').on('sn:enter-down', function (e) {
                request_search_results();
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

        case "RETRY_CANCEL":
            set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;

        case "RETRY_EXIT":
            set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;
    }
}

function set_focus(containerId, itemId) {
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