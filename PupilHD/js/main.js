window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    TAB_INDEX = 0;
    $("span#modal_container").load("modal.html");
    $("div#preview-player").load("preview-video-player.html");
    APP_CHANNEL_DATA_ARRAY["favorite"] = [];
    set_unset_setting_screen_selection();

    spatial_navigation_program();
    parse_main_feed();
    setTimeout(function () {
        clockTime();
    }, 1000);

    $("span#modal_container").load("modal.html");
    if (PAGE_INDEX == 0) {
        $("div#preview-player").load("preview-video-player.html");
    } else if (PAGE_INDEX == 1) {
        $("div#preview-player").load("preview-video-player.html");
    } else if (PAGE_INDEX == 3) {
        $("div#preview-player").load("preview-video-player.html");
    }

    lunaActivityManager();

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            console.log("App in background");
            clearTimeout(PING_TIMER);
        } else if (!document.hidden) {
            console.log("App in forground");
            userCurrectStatus();
            userStatusPing();
            $(".progress-container").hide();
            $(".player_next_previous_container").hide();
            $(".video-inner").hide();
            $(".preview-video-inner").hide();
        }
    });
};