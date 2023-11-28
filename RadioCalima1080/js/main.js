window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();

    $("span#modal_container").load("modal.html");
    spatial_navigation_program();
    parse_main_feed();

    // $('.marquee').marquee({
    //     //speed in milliseconds of the marquee
    //     duration: 3000,
    //     // gap in pixels between the tickers
    //     gap: 10,
    //     //time in milliseconds before the marquee will start animating
    //     delayBeforeStart: 0,
    //     //'left' or 'right'
    //     direction: 'left',
    //     // true or false - should the marquee be duplicated to show an effect of continues flow
    //     duplicated: true
    // });
};