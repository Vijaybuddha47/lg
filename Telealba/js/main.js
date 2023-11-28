window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();

    $("span#modal_container").load("modal.html");
    $("#loader").show();
    spatial_navigation_program();
    set_logout_menu_data();
    parse_main_feed();

    get_live_channel();

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            console.log("App in background");
            APP_PARENTAL_CONTROL = false;
        } else {
            console.log("App in forground");
            $(".progress-container").hide();
            $(".video-inner").hide();
        }
    });
};