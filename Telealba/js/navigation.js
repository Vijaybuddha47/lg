window.addEventListener('load', function () {
    set_focus('videoSection', 'video_container');
    // When search input focus
    $('#videoSection').on('sn:focused', function (e) {
        TAB_INDEX = 7;
    });
    set_focus('videoNextPrevious', 'playPauseVideo');

    $('#videoNextPrevious').on('sn:focused', function (e) {
        $(".video_next_previous_container").show();
        clearInterval(hide_progress_bar);
        hide_progress_bar = setTimeout(function () {
            $(".video_next_previous_container").hide();
            SN.focus('videoSection');
        }, 10000);
    });

    // Next/Previous Video
    $('#videoNextPrevious').on('sn:enter-down', function (e) {
        if ($("#playPreviousVideo").is(":focus")) {
            previous_next_video(type = "previous");

        } else if ($("#playPauseVideo").is(":focus")) {
            if ($("#video_container").css('display') == 'block') {
                if (VIDEO_PLAYER.paused) {
                    $(".pause-icon").hide();
                    $("#videoNextPreviousPlayPauseIcon").attr('src', 'images/pause.png');
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
            previous_next_video(type = "next");
        }
    });

    // When something press from remote keys
    $(window).keydown(function (evt) {
        console.log("key event", evt.keyCode);

        switch (evt.keyCode) {
            case 13: // Ok
                console.log("Ok key");
                if ($(".video_container").hasClass("active") && PAGE_INDEX !== 2) {
                    if ((VIDEO_PLAYER != "") && $("#video_container").is(":focus") && PLAY_VIDEO) {
                        if (VIDEO_PLAYER.paused) VIDEO_PLAYER.play();
                        else VIDEO_PLAYER.pause();
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
                if ($(".video_container").hasClass("active")) {
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) VIDEO_PLAYER.play();
                    playVideo();
                }
                break;

            case 19: // Pause 102
                console.log("pause key");
                if ($(".video_container").hasClass("active")) {
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) VIDEO_PLAYER.pause();
                    pauseVideo();

                }
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
                } else if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
                    closeVideo();
                } else if ($(".home_container").hasClass("active") && $(".home_container").is(":visible") && ($(":focus").attr("id") == 'menu_0')) {
                    PAGE_INDEX = TAB_INDEX = 0;
                    hide_show_modal(true, "EXIT", APP_EXIT_MSG);
                    //Exit app
                } else if ($(".home_container").hasClass("active") && $(".home_container").is(":visible") && ($(":focus").parent().attr("id") == 'homepage_items')) {
                    SN.focus("#menu_0");
                } else if ($(".logout_container").hasClass("active") && $(".logout_container").is(":visible") && ($(":focus").attr("id") != 'menu_0')) {
                    hide_show_screens("home_container");
                    SN.focus("#menu_0");
                    SELECTED_MENU = $(":focus").attr("id");
                    //Back from item focus to menu vod page
                } else if ($(".on_demand_container").hasClass("active") && $(".on_demand_container").is(":visible")) {
                    hide_show_screens("home_container");
                    SN.focus("#" + SELECTED_HOME_ITEM);
                } else if ($(".live_channel_container").hasClass("active") && $(".live_channel_container").is(":visible")) {
                    hide_show_screens("home_container");
                    SN.focus("#" + SELECTED_HOME_ITEM);
                } else if ($(".epg_container").hasClass("active") && $(".epg_container").is(":visible")) {
                    if ($("[id^=date_list_]").is(":focus")) {
                        $("#date_list").css("display", "none");
                        SN.focus("selected_date");
                    } else {
                        hide_show_screens("live_channel_container");
                        document.getElementById("unlock_password").value = "";
                        $("#parentalcontrol_popup").hide();
                        SN.focus("channel_number_box");
                    }
                } else if ($(".sub_category_container").hasClass("active") && $(".sub_category_container").is(":visible")) {
                    hide_show_screens("on_demand_container");
                    SN.focus("ondemand_items");
                } else if ($(".video_list_container").hasClass("active") && $(".video_list_container").is(":visible") && _.size(CAT_VOD_LIST) > 0) {
                    $("#searchTextShow").text("");
                    $("#searchInputText").val("");
                    hide_show_screens("on_demand_container");
                    SN.focus("ondemand_items");
                } else if ($(".video_list_container").hasClass("active") && $(".video_list_container").is(":visible") && _.size(CAT_VOD_LIST) < 1) {
                    $("#searchTextShow").text("");
                    $("#searchInputText").val("");
                    hide_show_screens("sub_category_container");
                    VOD_BREADCRUMB.pop();
                    SN.focus("sub_category_list");
                } else if ($(".logout_container").hasClass("active") && $(".logout_container").is(":visible")) {
                    hide_show_screens("home_container");
                    SN.focus("menu_items");
                }

                break;

            case 37: // LEFT arrow
                console.log("left key");
                if ($('.epg_container').hasClass('active') && $("[id^='program_']").is(":focus")) {
                    SN.focus("channel_slider");
                } else if ($("#searchInputText").is(":focus")) {
                    controlLeftArrowKeys();
                }
                break;

            case 39: // RIGHT arrow
                console.log("right key");
                if ($('.epg_container').hasClass('active') && $("[id^='live_']").is(":focus")) {
                    SN.focus("program_container");
                } else if ($("#searchInputText").is(":focus")) {
                    controlrightArrowKeys();
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
                if ($(".video_container").hasClass("active")) {
                    if (PAGE_INDEX == 5) {
                        $(".video_next_previous_container").show();
                        SN.focus("videoNextPrevious");
                    }
                }
                else if ($(".home_container").hasClass("active") && $(".home_container").is(":visible")) {
                    SN.focus("homepage_items");
                }
                else if ($(".on_demand_container").hasClass("active") && $(".on_demand_container").is(":visible")) {
                    SN.focus("ondemand_items");
                } else if ($(".video_list_container ").hasClass("active") && $(".video_list_container ").is(":visible") && $("[id^='menu_']").is(":focus")) {
                    SN.focus("search_bar");
                } else if ($(".sub_category_container").hasClass("active") && $(".sub_category_container").is(":visible") && $("[id^='menu_']").is(":focus")) {
                    SN.focus("sub_category_list");
                } else if ($(".video_list_container").hasClass("active") && $(".video_list_container").is(":visible") && $("#searchInputText").is(":focus")) {
                    SN.focus("video_list");
                } else if ($(".logout_container").hasClass("active") && $(".logout_container").is(":visible") && $("[id^='menu_']").is(":focus")) {
                    console.log("logout app.");
                    SN.focus("manage_btn");
                } else if ($(".epg_container").hasClass("active") && $(".epg_container").is(":visible") && $("[id^='menu_']").is(":focus")) {
                    SN.focus("channel_slider");
                } else if ($(".live_channel_container").hasClass("active") && $(".live_channel_container").is(":visible") && $("[id^='menu_']").is(":focus")) {
                    SN.focus("channel_number_box");
                }
                break;

            case 38: //Up key
                console.log("up key");
                if ($(".home_container").hasClass("active") && $(".home_container").is(":visible")) {
                    SN.focus("menu_items");
                }
                break;

            case 33:    //ChannelUp key
                console.log("channelUp");
                if ($(".epg_container").hasClass("active") && $(".epg_container").is(":visible")) {
                    var id = $(":focus").attr("id");
                    var i = $(":focus").index();
                    var len = $(":focus").parent().children().length - 5;
                    if ($(":focus").parent().attr("id") == "program_container" && i < len) SN.focus("#program_" + (i + 5));
                    else if ($(":focus").parent().attr("id") == "channel_slider" && i < len) SN.focus("#live_0_" + (i + 5));
                }
                break;

            case 34:    //ChannelDown key
                console.log("channelDown");
                if ($(".epg_container").hasClass("active") && $(".epg_container").is(":visible")) {
                    var id = $(":focus").attr("id");
                    var i = $(":focus").index();
                    if ($(":focus").parent().attr("id") == "program_container" && i > 5) SN.focus("#program_" + (i - 5));
                    else if ($(":focus").parent().attr("id") == "channel_slider" && i > 5) SN.focus("#live_0_" + (i - 5));
                }
                break;


            case 65376: // Done from IME keyboard
                console.log("OK from keyboard...");
                if ($(".video_list_container").hasClass("active")) {
                    if (!$('#searchInputText').is(":focus")) $('#searchInputText').focus();
                    else request_search_results();
                }
                break;

            case 65385: // Cancel from IME keyboard
                console.log("Cancel from keyboard...");
                break;

            default:
                console.log("Key code : " + evt.keyCode);
                break;
        }
    });
});