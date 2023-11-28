function manage_spatial_navigation(containerClass, favoriteStatus, vodId) {
    switch (containerClass) {
        case "menu_container":
            set_focus('menu_items', 'menu_0');
            // When menu foucs
            $('#menu_items').on('sn:focused', function (e) {
                SELECTED_MENU = e.target.id;
                $("li.nav_box").removeClass("selected_menu");
                $("#" + SELECTED_MENU).addClass("selected_menu");
                if (SELECTED_MENU == "menu_0") {
                    PAGE_INDEX = TAB_INDEX = 0;
                    hide_show_screens("home_container");
                } else if (SELECTED_MENU == "menu_1") {
                    PAGE_INDEX = TAB_INDEX = 2;
                    hide_show_screens("about_container");
                }
            });

            // Menu button selection
            $('#menu_items').on('sn:enter-down', function (e) {
            });
            break;

        case "home_container":
            set_focus('homeBtn', 'home_0');
            // Home button foucs
            $('#homeBtn').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 0;
            });

            // Home button selection
            $('#homeBtn').on('sn:enter-down', function (e) {
            });

            // radio button selection
            $('#home_0').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });

            $('#home_1').on('sn:enter-down', function (e) {
                $("#" + e.target.id).click();
            });
            break;

        case "music_container":
            set_focus('musicList', 'music_0');
            // music list foucs
            $('#musicList').on('sn:focused', function (e) {
                PAGE_INDEX = TAB_INDEX = 1;
            });

            // music list selection
            $('#musicList').on('sn:enter-down', function (e) {
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