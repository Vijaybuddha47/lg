window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    spatial_navigation_program();
    $(".splash-screen").show();
    $("span#modal_container").load("modal.html");
    get_app_dynamic_val();
    $('.marquee').marquee();

    $('.marquee').marquee({
        //speed in milliseconds of the marquee
        duration: 3000,
        // gap in pixels between the tickers
        gap: 10,
        //time in milliseconds before the marquee will start animating
        delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'left',
        // true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            console.log("App in background");
            if (VIDEO_PLAYER.play) {
                VIDEO_PLAYER.pause();
                PLAY_VIDEO = false;
            }
        } else {
            console.log("App in forground");
        }
    });

    document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);

    function keyboardVisibilityChange(event) {
        if (event.detail.visibility) {
            KEYBOARD = true;
            console.log("Virtual keyboard appeared");
            $("body").css("pointer-events", "none");

        } else {
            // set_search_text();
            KEYBOARD = false;
            console.log("Virtual keyboard disappeared");
            $("body").removeAttr("style");
        }
    }
};