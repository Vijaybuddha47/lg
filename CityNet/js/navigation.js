window.addEventListener('load', function () {
    manage_spatial_navigation("custom_control_container");
    // manage_spatial_navigation("programme_details");
    manage_spatial_navigation("language_option");
    manage_spatial_navigation("epg_icon_container");
    set_focus('videoSection', 'video_container');
    set_focus('videoNextPrevious', 'playPauseVideo');

    $("#videoNextPrevious").on('sn:focused', function (e) {
        show_hide_controls();
    });

    $("#video_container").on('sn:focused', function (e) {
        $('.channel_list_container').removeClass('toggle_channel_list');
        $(".custom_control_container").hide();
        show_hide_controls();
    });

    // EPG list
    $('[id^=epgList]').on('sn:enter-down', function (e) {
        console.log('EPG List sn:enter-down');
        $("#" + e.target.id).closest('li').click();
    });

    // Next/Previous Video
    $('#videoNextPrevious').on('sn:enter-down', function (e) {
        $("#" + e.target.id).click();
    });

    // When something press from remote keys
    $(window).keydown(function (evt) {

        // When number key pressed
        if (evt.keyCode <= 57 && evt.keyCode >= 48) {
            console.log("Number key pressed...");
            show_channel_input_box(evt.key);
        }

        var modalName = $(".modal_container").attr("data-modal-name");
        switch (evt.keyCode) {
            case 13: // Ok
                if ($(".video_container").hasClass("active")) {
                    if ((VIDEO_PLAYER != "") && $("#video_container").is(":focus") && PLAY_VIDEO) {
                        if (VIDEO_PLAYER.paused) VIDEO_PLAYER.play();
                        else VIDEO_PLAYER.pause();
                    }
                }
                else if (KEYBOARD) { // for search videos
                    console.log("OK from keyboard...");
                    var prefix = get_search_id_prefix(),
                        visible = false,
                        searchText = get_search_input_value(),
                        containerClass = "",
                        tabindex = 1,
                        row = 0;

                    if (SELECTED_MENU_INDEX > 0) $('.movie_container').show();

                    $(".movie_list li, .live_list li").each(function () {
                        title = $(this).find(".thumbnail_overlay_text").text().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036F]/g, "");
                        if (title.indexOf(searchText.toLowerCase()) != -1) {
                            $(this).show().removeClass('unvisible').addClass('visible');
                            $(".no-record-box").remove();
                            visible = true;
                        } else {
                            $(this).hide().removeClass('visible').addClass('unvisible');
                        }
                        clear_last_selected_id();
                    });

                    if (SELECTED_MENU_INDEX > 0) {
                        $(".movie_container").each(function () {
                            var htmlObj = $(this).find("ul.movie_list li.visible");
                            if (htmlObj.length == 0) $(this).hide();
                            else {
                                htmlObj.removeAttr('data-sn-right');
                                htmlObj.removeAttr('data-sn-left');
                                htmlObj.first().attr('data-sn-left', 'null');
                                htmlObj.last().attr('data-sn-right', 'null');
                            }
                        });

                    } else {
                        $("ul.live_list li.visible").removeAttr('data-sn-right');
                        $("ul.live_list li.visible").last().attr('data-sn-right', 'null');
                    }

                    if (!visible) {
                        if (SELECTED_MENU_INDEX == 0) containerClass = "live_page_container";
                        else containerClass = "movie_page_container";
                        set_error_message(containerClass, tabindex)
                    }

                } else if ($("ul.video_next_previous_icon_list li:focus").size() < 1 && !$("#dvr").is(":focus") && $("#epgListContainer").html().length < 1 && SELECTED_MENU_INDEX == 0 && PLAY_VIDEO) {
                    // For live menu only
                    show_hide_programme_details_after_specific_time();
                    //SN.focus('epgIcons');							
                }
                selected_menu_list();
                break;

            case 415: // Play
                if ($(".video_container").hasClass("active")) {
                    console.log("Play Video");
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) VIDEO_PLAYER.play();
                }
                break;

            case 19: // Pause 102
                if ($(".video_container").hasClass("active")) {
                    console.log("Pause Video");
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) VIDEO_PLAYER.pause();

                }

                break;

            case 412: // Rewind 82
                rewind_video();
                break;

            case 417: // FastForward
                forward_video();
                break;


            case 461: // Return key
                // Back from menu
                if ($(".modal_container").hasClass("active")) {
                    var name = $(".modal_container").attr("data-modal-name");
                    hide_show_modal(false, name);
                    SN.focus('#loginButton');
                    //Exit app
                } else if ($(".menu_container").hasClass("active") && !$(".splash-screen").is(':visible')) {
                    console.log("show exit popup...");
                    hide_show_modal(true, "EXIT", APP_EXIT_MSG);
                    // Return from search box
                } else if ($(".search_box").hasClass("active")) {
                    var prefix = get_search_id_prefix();
                    if (!KEYBOARD) {
                        $('#' + prefix + 'Searchbox').show();
                        $('#' + prefix + 'SearchInputBox').hide();
                        SN.focus('menuList');
                    }
                    // Return from video screen
                } else if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                    // return back from EPG
                    if ($('#epgListContainer').html().length > 0) {
                        $("#epgListContainer").html('');
                        //$(".epg_icon_container").show();
                        //SN.focus('epgIcons');
                    } else if ($(".channel_dvr_box").is(':visible') && ($("[id^=time_]").is(":focus") || $("[id^=day_]").is(":focus"))) {
                        $(".channel_dvr_box").hide();
                        $(".custom_control_container").show();
                        SN.focus("#customDVR");
                    } else if ($(".custom_control_container").is(':visible') && ($(":focus").parent().attr("id") == "customControls" || $(":focus").parent().attr("id") == "programme_details")) {
                        $(".custom_control_container").hide();
                        SN.focus("videoSection");
                    } else if ($(".custom_control_container").is(':visible') && $(":focus").parent().attr("id") == "language_option") {
                        $("#language_option").hide();
                        $(".custom_control_container").show();
                        SN.focus("#customAudio");
                    } else if ($('.channel_list_container').hasClass("toggle_channel_list") && ($(":focus").parent().attr("id") == "live_channel_list")) {
                        hide_channel_list();
                        SN.focus('videoSection');
                    } else {
                        closeVideo();
                    }

                    selected_item_list();

                    // Back to menu from first page items
                } else if ($(".live_page_container").hasClass("active") || $(".movie_page_container").hasClass("active") || $(".logout_page_container").hasClass("active")) {
                    $(".live_page_container, .movie_page_container, .logout_page_container, #liveList, [id^=movieList]").removeClass("active");
                    $(".menu_container").addClass("active");
                    SN.focus("menuList");

                    // Back from season page to shows page
                } else if ($(".seasons_page_container").hasClass('active')) {
                    $(".seasons_page_container").removeClass('active').html('');
                    $(".movie_page_container").show().addClass("active");
                    SN.focus('[id^=movieList]');

                    // Back from episode page to season page
                } else if ($(".episode_page_container").hasClass('active')) {
                    $(".episode_page_container").removeClass('active').html('');
                    $(".seasons_page_container").show().addClass("active");
                    SN.focus('seasonsList');

                    // Back to items from detials page
                } else if ($(".video_details_page_container").hasClass("active")) {
                    // Back to Movies
                    if ($('[id^=movieList]').hasClass("active") || SELECTED_MENU_INDEX == 1) {
                        $(".video_details_page_container").removeClass('active').html('');
                        $(".movie_page_container").show().addClass("active");
                        SN.focus('[id^=movieList]');
                        selected_item_list();

                        // Back to episodes
                    } else if ($('#episodeList').hasClass("active") || SELECTED_MENU_INDEX == 2) {
                        $(".video_details_page_container").removeClass('active').html('');
                        $(".episode_page_container").show().addClass("active");
                        SN.focus('episodeList');
                    }

                    // Return from popup to channel list
                } else if ($(".modal_container").hasClass("active")) {
                    // When exit modal selected
                    if (modalName == "EXIT") {
                        hide_show_modal(false, modalName);

                    } else if (modalName == "RETRY_CANCEL") {
                        hide_show_modal(false, modalName);
                        closeVideo();
                    }
                }
                selected_item_list();
                // remove_menu_focus();
                enable_disable_mouse();
                break;

            case 37: // LEFT arrow
                if ($('.search_box').hasClass('active') && ($("#liveSearchInput").is(":focus") || $("#moviesSearchInput").is(":focus") || $("#showsSearchInput").is(":focus"))) {
                    console.log("pointer move left ");
                    var textEntered = get_search_input_value();
                    if (textEntered) controlLeftArrowKeys();
                }
                else if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && $('.channel_list_container').hasClass("toggle_channel_list")) {
                    SN.focus("#channel_number_" + (CHANNEL_ITEM_INDEX));
                } else if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && !$('.channel_list_container').hasClass("toggle_channel_list")) {
                    console.log("show channel list");
                    var leftId = "#channel_number_" + CAT_ITEM_INDEX;
                    $("#customHome").attr("data-sn-left", leftId);
                    $("#customLeft").attr("data-sn-left", leftId);
                    if ($('#video_container').is(':focus')) show_channel_list();
                }
                //  else if ($("ul.video_next_previous_icon_list li:focus").size() < 1) { rewind_video(); }
                else if ($('#video_container').is(':visible') && $('#video_container').hasClass('active') && $("#video_container").is(":focus")) { rewind_video(); }
                // remove_menu_focus();
                break;

            case 39: // RIGHT arrow
                if ($('.search_box').hasClass('active') && ($("#liveSearchInput").is(":focus") || $("#moviesSearchInput").is(":focus") || $("#showsSearchInput").is(":focus"))) {
                    console.log("pointer move right ");
                    var textEntered = get_search_input_value();
                    if (textEntered) controlrightArrowKeys();
                }
                // else if ($("ul.video_next_previous_icon_list li:focus").size() < 1) { forward_video(); }
                else if ($('#video_container').is(':visible') && $('#video_container').hasClass('active') && $("#video_container").is(":focus")) { forward_video(); }
                // remove_menu_focus();
                break;

            case 413: // Stop button
                if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                    closeVideo();
                }
                break;

            case 40: //Down key
                if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && $("#video_container").is(":focus")) {
                    console.log("show custom control");
                    $(".custom_control_container").show();
                    SN.focus("customControls");
                } else if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX != 0) && (SELECTED_MENU_INDEX != 1) && $("#video_container").is(":focus")) {
                    $("#videoNextPrevious").show();
                    // SN.focus("videoNextPrevious");
                    SN.focus("#playPauseVideo");
                }
                // remove_menu_focus();
                break;

            case 38: //Up key
                // remove_menu_focus();
                break;

            case 33:    //ChannelUp key
                console.log("channelUp", evt.keyCode);
                if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && $('.channel_list_container').hasClass("toggle_channel_list")) {
                    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                        CHANNEL_ITEM_INDEX = CHANNEL_ITEM_INDEX - 1;
                        SN.focus("#channel_number_" + (CHANNEL_ITEM_INDEX));

                        clearTimeout(CHANNEL_TIME_OUT_SECOND);
                        CHANNEL_TIME_OUT_SECOND = setTimeout(function () {
                            console.log("channel click up");
                            VOD_URL = "";
                            VOD_COUNTER = 0;
                            CAT_ITEM_INDEX = CURRENT_ITEM_INDEX = CHANNEL_ITEM_INDEX;
                            get_video_details(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX]['channel_id'], true);
                            $("ul.live_channel_list_container li").removeClass("blued_img");
                            $("#channel_number_" + (CHANNEL_ITEM_INDEX)).addClass("blued_img");
                            $('.channel_list_container').removeClass('toggle_channel_list');
                            SN.focus('videoSection');
                        }, 1000);
                    }
                } else if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && !$('.channel_list_container').hasClass("toggle_channel_list")) {
                    console.log("show channel list");
                    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                        show_channel_list();
                    }
                }
                break;

            case 34:    //ChannelDown key
                console.log("channelDown", evt.keyCode);
                if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && $('.channel_list_container').hasClass("toggle_channel_list")) {
                    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                        CHANNEL_ITEM_INDEX = CHANNEL_ITEM_INDEX + 1;
                        SN.focus("#channel_number_" + (CHANNEL_ITEM_INDEX));

                        clearTimeout(CHANNEL_TIME_OUT_SECOND);
                        CHANNEL_TIME_OUT_SECOND = setTimeout(function () {
                            console.log("channel click down");
                            VOD_URL = "";
                            VOD_COUNTER = 0;
                            CAT_ITEM_INDEX = CURRENT_ITEM_INDEX = CHANNEL_ITEM_INDEX;
                            get_video_details(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX]['channel_id'], true);
                            $("ul.live_channel_list_container li").removeClass("blued_img");
                            $("#channel_number_" + (CHANNEL_ITEM_INDEX)).addClass("blued_img");
                            $('.channel_list_container').removeClass('toggle_channel_list');
                            SN.focus('videoSection');
                        }, 1000);
                    }
                } else if ($(".video_container").hasClass("active") && (SELECTED_MENU_INDEX == 0) && !$('.channel_list_container').hasClass("toggle_channel_list")) {
                    console.log("show channel list");
                    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                        show_channel_list();
                    }
                }
                break;

            case 1536: //magic remote up scroller
                if (SELECTED_MENU_INDEX == 0) $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
                break;

            case 1537: //magic remote down scroller
                if (SELECTED_MENU_INDEX == 0) $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
                break;


            default:
                console.log("Key code : " + evt.keyCode);
                break;
        }
    });
});