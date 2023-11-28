function manage_spatial_navigation(containerClass) {
    switch (containerClass) {
        case "menu_container":
            set_focus('menu_items', 'menu_0');

            // When menu focus
            $('#menu_items').on('sn:focused', function (e) {
                console.log("menu items focused");
                $(".menu_container").addClass("maximize-sidebar");
                $(".menu_container").removeClass("minimize-sidebar");
            });

            // Menu button selection
            $('#menu_items').on('sn:enter-down', function (e) {
                console.log("menu items enter down");
                $("#" + e.target.id).click();
                $(".menu").removeClass("selected_menu");
                $("#" + e.target.id).addClass("selected_menu");
            });

            // When menu unfocus
            $('#menu_items').on('sn:unfocused', function (e) {
                console.log("menu items unfocused");
                $(".menu_container").removeClass("maximize-sidebar");
                $(".menu_container").addClass("minimize-sidebar");
            });

            break;

        case "category_container":
            set_focus('category_list', 'cat_0');

            // When category list  item foucs
            $('#category_list').on('sn:focused', function (e) {
                console.log("category items focus");
                TAB_INDEX = PAGE_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // category list item selection
            $('#category_list').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "home_video_list":
            set_focus('home_items', 'item_0');

            // When home page item foucs
            $('#home_items').on('sn:focused', function (e) {
                console.log("home items focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // Home page item selection
            $('#home_items').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "dashboard_container":
            set_focus('activities', 'activity_0');

            // When dashboard item foucs
            $('#activities').on('sn:focused', function (e) {
                console.log("activity items focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // dashboard item selection
            $('#activities').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            break;

        case "subcategory_container":
            set_focus('subcategories', 'subcat_0');

            // When subcategories list  item foucs
            $('#subcategories').on('sn:focused', function (e) {
                console.log("subcategories items focus");
                PAGE_INDEX = TAB_INDEX = 4;
                SECOND_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // subcategories list item selection
            $('#subcategories').on('sn:enter-down', function (e) {
                console.log("subcategories items focus");
                $("#" + e.target.id).click();
            });

            break;

        case "video_list_container":
            set_focus('videolist', 'video_0');

            // When videolist list  item foucs
            $('#videolist').on('sn:focused', function (e) {
                console.log("videolist items focus");
                PAGE_INDEX = TAB_INDEX = 5;
            });

            // videolist list item selection
            $('#videolist').on('sn:enter-down', function (e) {
                console.log("videolist items focus");
                $("#" + e.target.id).click();
            });

            break;

        case "language_container":
            set_focus('languages', 'lang_0');

            // When languages list  item foucs
            $('#languages').on('sn:focused', function (e) {
                console.log("languages items focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // languages list item selection
            $('#languages').on('sn:enter-down', function (e) {
                console.log("languages items focus");
                $("#" + e.target.id).click();
            });

            break;

        case "keyboard_container":
            set_focus('keyboard', 'key_q');

            // When keyboard container  item foucs
            $('#keyboard').on('sn:focused', function (e) {
                console.log("keyboard  focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // keyboard container item selection
            $('#keyboard').on('sn:enter-down', function (e) {
                console.log("keyboard enter");
                $("#" + e.target.id).click();
            });

            break;

        case "category_selection":
            set_focus('category_selection', 'category_filter');

            // When category selection  foucs
            $('#category_selection').on('sn:focused', function (e) {
                console.log("category selection  focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // category selection selection
            $('#category_selection').on('sn:enter-down', function (e) {
                console.log("category selection enter");
                $("#" + e.target.id).click();
            });

            break;

        case "subcategory_selection":
            set_focus('subcategory_selection', 'subcategory_filter');

            // When subcategory selection foucs
            $('#subcategory_selection').on('sn:focused', function (e) {
                console.log("subcategory selection  focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // subcategory  selection enter
            $('#subcategory_selection').on('sn:enter-down', function (e) {
                console.log("subcategory selection enter");
                $("#" + e.target.id).click();
            });

            break;

        case "intensity_selection":
            set_focus('intensity_selection', 'intensity_filter');

            // When intensity foucs
            $('#intensity_selection').on('sn:focused', function (e) {
                console.log("intensity selection  focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // intensity  selection
            $('#intensity_selection').on('sn:enter-down', function (e) {
                console.log("intensity selection enter");
                $("#" + e.target.id).click();
            });

            break;


        case "duration_selection":
            set_focus('duration_selection', 'duration_filter');

            // When duration selection focus
            $('#duration_selection').on('sn:focused', function (e) {
                console.log("duration selection  focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // duration selection selection
            $('#duration_selection').on('sn:enter-down', function (e) {
                console.log("duration selection enter");
                $("#" + e.target.id).click();
            });

            break;

        case "filter_keys":
            set_focus('filter_keys', 'apply_filter');

            // When search button focus
            $('#filter_keys').on('sn:focused', function (e) {
                console.log("search button focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;
            });

            // search button selection
            $('#filter_keys').on('sn:enter-down', function (e) {
                console.log("search button enter");
                $("#" + e.target.id).click();
            });

            break;

        case "search_result_container":
            set_focus('search_result', 'search_0');

            // When item button focus
            $('#search_result').on('sn:focused', function (e) {
                console.log("search item focus");
                PAGE_INDEX = TAB_INDEX = MENU_INDEX;
                FIRST_LEVEL_FOCUSED_ITEM = e.target.id;

                if ($("#" + e.target.id).index() == ($("#search_result li").length - 3) || $("#" + e.target.id).index() == ($("#search_result li").length - 2)) {
                    console.log("update list 1111");
                    if (APP_SEARCH_ARRAY["hasMetadata"] !== undefined && APP_SEARCH_ARRAY["hasMetadata"]["hasNextPage"]) {
                        console.log("update list 22222");
                        getFilteredVideo();
                    }
                }
            });

            // search item selection
            $('#search_result').on('sn:enter-down', function (e) {
                console.log("search item enter");
                $("#" + e.target.id).click();
            });

            break;

        case "category_filter_options":
            set_focus('category_options', 'cat_option_0');

            // When category_filter_options focus
            $('#category_options').on('sn:focused', function (e) {
                console.log("category_filter_options  focus");
            });

            // category_filter_options selection
            $('#category_options').on('sn:enter-down', function (e) {
                console.log("category_filter_options enter");
                $("#" + e.target.id).click();
            });

            // $('#category_options').on('sn:unfocused', function (e) {
            //     $(".category_filter_options").hide();
            // });

            break;

        case "subcategory_filter_options":
            set_focus('subcategory_options', 'subcat_option_0');

            // When subcategory_filter_options focus
            $('#subcategory_options').on('sn:focused', function (e) {
                console.log("subcategory_filter_options focus");
            });

            // subcategory_filter_options selection
            $('#subcategory_options').on('sn:enter-down', function (e) {
                console.log("subcategory_filter_options enter");
                $("#" + e.target.id).click();
            });

            // $('#subcategory_options').on('sn:unfocused', function (e) {
            //     $(".subcategory_filter_options").hide();
            // });

            break;

        case "intensity_filter_options":
            set_focus('intensity_options', 'intensity_option_0');

            // When intensity_filter_options focus
            $('#intensity_options').on('sn:focused', function (e) {
                console.log("intensity_filter_options focus");
            });

            // intensity_filter_options selection
            $('#intensity_options').on('sn:enter-down', function (e) {
                console.log("intensity_options enter");
                $("#" + e.target.id).click();
            });

            // $('#intensity_options').on('sn:unfocused', function (e) {
            //     $(".intensity_filter_options").hide();
            // });

            break;

        case "duration_filter_options":
            set_focus('duration_options', 'duration_option_0');

            // When duration_filter_options focus
            $('#duration_options').on('sn:focused', function (e) {
                console.log("duration_filter_options focus");
            });

            // duration_filter_options selection
            $('#duration_options').on('sn:enter-down', function (e) {
                console.log("duration_filter_options enter");
                $("#" + e.target.id).click();
            });

            // $('#duration_options').on('sn:unfocused', function (e) {
            //     $(".duration_filter_options").hide();
            // });

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

        case "LANGUAGE":
            set_focus('languageChange', 'confirm');
            SN.focus("languageChange");

            $('#languageChange').on('sn:enter-down', function (e) {
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