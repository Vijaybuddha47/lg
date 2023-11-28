window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    changeDynamicText();

    $("span#modal_container").load("modal.html");
    $("#loader").show();
    parse_main_feed();

    document.addEventListener('visibilitychange', function () {
        $(".progress-container").hide();
        $(".video-inner").hide();
        if (document.hidden) {
            console.log("App in background");
            if (VIDEO_PLAYER != "") VIDEO_PLAYER.pause();
        } else {
            console.log("App in forground");
        }
    });
};