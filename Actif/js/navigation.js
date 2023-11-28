window.addEventListener('load', function () {
    //Video player focus
    set_focus('videoSection', 'video_container');
    $('#videoSection').on('sn:focused', function (e) {
        TAB_INDEX = 7;
    });

    // $('#video_container').on('sn:enter-down', function (e) {
    //     TAB_INDEX = 7;
    //     console.log("clicked", e.target.id);
    //     if (VIDEO_PLAYER.getPaused()) {
    //         console.log("play now");
    //         // $("#playPauseIcon").attr('src', 'images/pause.png');
    //         // $(".pause-icon").hide();
    //         // playVideo();
    //     } else {
    //         console.log("pause now");
    //         // $(".pause-icon").show();
    //         // pauseVideo();
    //     }
    // });

    //video player button control action
    set_focus('videoNextPrevious', 'playPauseVideo');
    $('#videoNextPrevious').on('sn:focused', function (e) {
        console.log("videoNextPrevious")
        set_focus_images();
        // show_hide_progress_bar_after_specific_time();
    });

    // Next/Previous Video
    $('#videoNextPrevious').on('sn:enter-down', function (e) {
        if ($("#playPreviousVideo").is(":focus")) {
            previous_next_video("previous");
        } else if ($("#playPauseVideo").is(":focus")) {
            if ($("#video_container").css('display') == 'block') {
                if (VIDEO_PLAYER.paused) {
                    $(".pause-icon").hide();
                    $("#playPauseIcon").attr('src', 'images/pause.png');
                    $(".video-title").text('');
                    if (VIDEO_PLAYER.paused) {
                        var currentTime = VIDEO_PLAYER.getCurrentTime();
                        var forwardTime = sessionStorage.video_forward_time;
                        var resultant = parseInt(forwardTime) - parseInt(currentTime);
                        var resultantTime = Math.abs(resultant);

                        if (sessionStorage.FWD_RWD_key_press == 1) {
                            $(".video-inner").show();
                            $(".circle_loader").addClass('circle-loader-middle');

                            if (resultant > 0) {
                                resultantTime = parseInt(resultantTime - 5000);
                                jumpForwardVideo(resultantTime);
                            } else {
                                resultantTime = parseInt(resultantTime + 5000);
                                if (currentTime - resultantTime < 0) resultantTime = currentTime;
                                jumpBackwardVideo(resultantTime);
                            }
                            sessionStorage.FWD_RWD_key_press = 0;
                        } else {
                            if (VIDEO_PLAYER.paused) {
                                try {
                                    playVideo();
                                } catch (e) {
                                    playVideo();
                                    console.log("error in play video: " + e);
                                }
                            } else {
                                $(".pause-icon").show();
                                pauseVideo();
                                VIDEO_PLAYER.pause();
                            }
                        }
                    }

                } else {
                    $(".pause-icon").show();
                    pauseVideo();
                    VIDEO_PLAYER.pause();
                }
            }

        } else if ($("#playNextVideo").is(":focus")) {
            previous_next_video("next");
        }
    });

    $('#videoNextPrevious').on('sn:unfocused', function (e) {
        console.log("videoNextPrevious unfocused")
        set_focus_images();
    });


    // When something press from remote keys
    $(window).keydown(function (evt) {
        console.log("key event", evt.keyCode);

        if (MENU_INDEX == 0) deactivateFilterButtons();

        if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
            if (($(":focus").attr("id") == "mep_1") || ($(":focus").attr("id") == "mep_0")) SN.focus("#video_container");
        }

        switch (evt.keyCode) {
            case 13: // Ok
                console.log("Ok key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if ((VIDEO_PLAYER != "") && $("#video_container").is(":focus")) {
                        console.log(VIDEO_PLAYER, VIDEO_PLAYER.getPaused());
                        if (VIDEO_PLAYER.getPaused()) VIDEO_PLAYER.play();
                        else if (!VIDEO_PLAYER.getPaused()) {
                            VIDEO_PLAYER.pause();
                            // show_hide_video_details_and_control();
                        }
                    }
                }
                break;

            case 13: // ok from keyboard
                console.log("OK from keyboard...");
                if ($(".login_container").hasClass("active")) {
                    if ($('#userName').is(":focus")) SN.focus('#password');
                    else if ($('#password').is(":focus")) SN.focus('#loginButton');
                }
                break;

            case 415: // Play
                console.log("play key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if (VIDEO_PLAYER.getPaused()) playVideo();
                }
                break;

            case 19: // Pause 102
                console.log("pause key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if (!VIDEO_PLAYER.getPaused()) pauseVideo();

                }
                break;

            case 412: // Rewind 82
                console.log("rewind key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if ($("#video_container").is(":focus")) rewind_video();
                }
                break;

            case 417: // FastForward
                console.log("fastForward key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if ($("#video_container").is(":focus")) forward_video();
                }
                break;


            case 461: // Return key
                console.log("return key");
                if ($(".menu_container").hasClass("maximize-sidebar") && $(":focus").parent().attr("id") == "menu_items") {
                    hide_show_modal(true, "EXIT", TXT['WANT_TO_EXIT']);
                } else if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    closeVideo();
                } else if ($(".modal_container").hasClass("active")) {
                    var modalName = $(".modal_container").attr("data-modal-name");
                    hide_show_modal(false, modalName);
                } else if ($(".search_container").hasClass("active") && $(".search_container").is(":visible")) {
                    if ($(":focus").attr("id").search("_option_") > -1) {
                        $(":focus").parent().parent().hide();
                        $(".right-arrow-box").find("img").css("transform", "rotate(0deg)");
                        SN.focus($(":focus").parent().parent().parent().children(':first-child').attr("id"));
                    } else SN.focus("menu_items");
                } else if ($(".home_container").hasClass("active") && $(".home_container").is(":visible")) {
                    SN.focus("menu_items");
                } else if ($(".dashboard_container").hasClass("active") && $(".dashboard_container").is(":visible")) {
                    SN.focus("menu_items");
                } else if ($(".setting_container").hasClass("active") && $(".setting_container").is(":visible")) {
                    SN.focus("menu_items");
                } else if ($(".subcategory_container").hasClass("active") && $(".subcategory_container").is(":visible")) {
                    hide_show_screens("home_container");
                    SN.focus("category_list");
                } else if ($(".video_list_container").hasClass("active") && $(".video_list_container").is(":visible")) {
                    if ($("#videolist_heading h2").text().search(">") > -1) {
                        hide_show_screens("subcategory_container");
                        SN.focus("subcategories");
                    } else {
                        hide_show_screens("home_container");
                        SN.focus("category_list");
                    }
                }

                break;

            case 37: // LEFT arrow
                console.log("left key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if ($("#video_container").is(":focus")) rewind_video();
                    // else if ($("#playPreviousVideo").is(":focus")) SN.focus("#playPauseVideo");
                    // else if ($("#playNextVideo").is(":focus")) SN.focus("#playPreviousVideo");
                }
                break;

            case 39: // RIGHT arrow
                console.log("right key");
                if ($('.menu_container').hasClass('maximize-sidebar') && $("[id^='menu_']").is(":focus")) {
                    if (MENU_INDEX == 1 || MENU_INDEX == 0) SN.focus("#" + FIRST_LEVEL_FOCUSED_ITEM);
                    else if (MENU_INDEX == 2) SN.focus("activities");
                    else if (MENU_INDEX == 3) SN.focus("languages");
                    else if (MENU_INDEX == 5) SN.focus("subcategories");
                    else if (MENU_INDEX == 6) SN.focus("videolist");
                } else if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if ($("#video_container").is(":focus")) forward_video();
                    // else if ($("#playPauseVideo").is(":focus")) SN.focus("#playPreviousVideo");
                    // else if ($("#playPreviousVideo").is(":focus")) SN.focus("#playNextVideo");
                }
                break;

            case 413: // Stop button
                console.log("stop key");
                if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                    closeVideo();
                }
                break;

            case 40: //Down key
                console.log("down key");
                if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    if ($("#video_container").is(":focus")) {
                        console.log("focus element", $(":focus"));
                        show_hide_progress_bar_after_specific_time();
                        SN.focus("#playPauseVideo");
                    }
                }
                break;

            case 38: //Up key
                console.log("up key");
                break;

            default:
                console.log("Key code : " + evt.keyCode);
                break;
        }
    });
});