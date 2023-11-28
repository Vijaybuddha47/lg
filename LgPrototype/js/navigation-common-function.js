function manage_spatial_navigation(containerClass, favoriteStatus, vodId) {
    switch (containerClass) {
        case "menu_container":
            set_focus('left_sidebar', 'tv_channel');

            // When menu foucs
            $('#left_sidebar').on('sn:focused', function (e) {
                console.log("left sidebar focus...");
            });

            $('#left_sidebar').on('sn:enter-down', function (e) {
                console.log("left sidebar button enter...");
            });

            break;

        case "EXIT":
            set_focus('exitModal', 'noButton');

            $('#exitModal').on('sn:focused', function (e) {
                console.log("exitModal focus");
            });
            $('#exitModal').on('sn:enter-down', function (e) {
                console.log("exitModal enter down");
            });
            // $('#exitModal').off('sn:enter-down');
            $('#noButton').on('sn:enter-down', function (e) {
                console.log("no button enter");
                console.log('hide popup');
                hide_show_modal(false, 'EXIT');

                var className = '';
                if (PAGE_INDEX == 0) className = 'home_container';
                else if (PAGE_INDEX == 1) className = 'video_library_container';
                else if (PAGE_INDEX == 2) className = 'search_container';
                else if (PAGE_INDEX == 3) className = 'account_container';
                else if (PAGE_INDEX == 4) className = 'setting_container';
                remove_add_active_class(className);
                $(".menu_container").addClass("active");
                // set_selected_menu();
                $(".menu_container").removeClass("toggle_menu");
                SN.focus("left_sidebar");
            });

            $('#yesButton').on('sn:enter-down', function (e) {
                console.log('exit app');
                // closeVideo();
                // tizen.application.getCurrentApplication().exit();
                window.close();
            });
            break;

        case "RETRY_CANCEL": set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                console.log("retryModal sn:enter-down");
                var modalName = "RETRY_CANCEL";
                hide_show_modal(false, modalName);
                if ($("#retryButton").is(":focus")) {
                    if (PREVIEW_FULL_DISPLAY) SN.focus("previewVideoPlayer");
                    setTimeout(function () { load_video(); }, 1000);
                } else if ($("#cancelButton").is(":focus")) {
                    closeVideo();
                }
            });
            break;

        case "RETRY_EXIT": set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                console.log("retryModal sn:enter-down");
                var modalName = "RETRY_CANCEL";
                hide_show_modal(false, modalName);
                if ($("#retryButton").is(":focus")) {
                    console.log('hide popup');
                    hide_show_modal(false, 'EXIT');

                } else if ($("#cancelButton").is(":focus")) {
                    console.log('exit app');
                    closeVideo();
                    // tizen.application.getCurrentApplication().exit();
                    window.close();
                }
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