window.addEventListener('load', function () {
    set_focus('videoPlayer', 'video_container');
    // When search input focus
    $('#videoPlayer').on('sn:focused', function (e) {
        TAB_INDEX = 7;
    });

    // When something press from remote keys
    $(window).keydown(function (evt) {
        var elementId = evt.target.id;

        if (evt.keyCode == "37" || evt.keyCode == "39") {
            if ($(".navigation_box").hasClass("active")) {
                TIME_STAMP = Date.now();
                if (id == "menu_1") set_logout_menu_data();
                else parse_data(TIME_STAMP);
            }
        }


        switch (evt.keyCode) {
            case 13: // Ok
                console.log("Ok key", evt);
                break;

            case 415: // Play
                console.log("play key");
                break;

            case 19: // Pause 102
                console.log("pause key");
                break;

            case 412: // Rewind 82
                console.log("rewind key");
                rewind_video();
                break;

            case 417: // FastForward
                console.log("fastForward key");
                forward_video();
                break;


            case 461: // Return key parentalcontrol_popup
                console.log("return key");
                if ($(".modal_container").hasClass("active")) {
                    var name = $(".modal_container").attr("data-modal-name");
                    hide_show_modal(false, name);
                    //Exit app
                } else if ($(".home_container").hasClass("active") && $(".home_container").is(":visible") && ($(":focus").attr("id") == 'menu_0')) {
                    PAGE_INDEX = TAB_INDEX = 0;
                    hide_show_modal(true, "EXIT", APP_EXIT_MSG);
                    //Exit app
                } else if ($(".home_container").hasClass("active") && $(".home_container").is(":visible") && ($(":focus").parent().attr("id") == 'homeBtn')) {
                    SN.focus("#menu_0");
                } else if ($(".radio_container").hasClass("active")) {
                    hide_show_screens("home_container");
                    $(".mejs__currenttime").addClass("off_screen");
                    $("#music_cover").attr("src", "./images/splash_screen.png");
                    $("#current_music_title").css("display", "none").text("");
                    $(".sidescroll_time").css("display", "none");
                    $("#music_img_change").attr("src", "");
                    $("#" + SELECTED_ITEM).find(".play_icon").attr("src", "");
                    closeAudio();
                    SN.focus("#" + FOCUSED_ITEM);
                } else if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    closeVideo();
                }

                break;

            case 37: // LEFT arrow
                console.log("left key");
                break;

            case 39: // RIGHT arrow
                console.log("right key");
                break;

            case 413: // Stop button
                console.log("stop key");
                if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                    closeVideo();
                }
                break;

            case 40: //Down key
                console.log("down key");
                break;

            case 38: //Up key
                console.log("up key");

                break;

            case 427:    //ChannelUp key
                console.log("channelUp");
                break;

            case 428:    //ChannelDown key
                console.log("channelDown");
                break;


            case 65376: // Done from IME keyboard
                console.log("OK from keyboard...");
                break;

            case 65385: // Cancel from IME keyboard
                console.log("Cancel from keyboard...");
                // set search text in hidden div
                // document.getElementById('searchInputText').blur();
                break;

            default:
                console.log("Key code : " + evt.keyCode);
                break;
        }
    });
});