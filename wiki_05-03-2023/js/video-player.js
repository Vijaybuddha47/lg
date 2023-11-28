function load_video() {
    enable_disable_mouse();
    VIDEO_PLAYER = "";
    var features = [],
        type = "video/",
        url = "";

    if (SELECTED_MENU_INDEX > 0) features = ['current', 'progress', 'duration'];
    else if (SELECTED_MENU_INDEX == 0) features = ['current', 'progress'];

    if ((VOD_URL.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
    else type += "mp4";

    show_hide_video_container();

    if (SELECTED_MENU_INDEX == 2) show_hide_video_next_previous(true);
    else show_hide_video_next_previous(false);

    if (SELECTED_MENU_INDEX == 0) {

        if (CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX]["dvr_enabled"] == "0") {
            $("#customDVR").css("display", "none");
            $("#customHome").attr("data-sn-right", "#customPause");
            $("#customPause").attr("data-sn-left", "#customHome");
        } else {
            $("#customDVR").css("display", "block");
            $("#customHome").attr("data-sn-right", "#customDVR");
            $("#customPause").attr("data-sn-left", "#customDVR");
        }

        CURRENT_ITEM_INDEX = CHANNEL_ITEM_INDEX;
        $(".custom_control_container").show();
        $(".channel-img").attr("src", IMG_PATH + CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX].image);
        $("#programmeTitle").text(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX].name);
        $(".mejs__controls").hide();
        // $("#programmeDesc").text(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX].description);
    } else {
        $(".custom_control_container").hide();
    }

    console.log("VOD_URL", VOD_URL);

    var totalVideo = get_total_video_or_first_video_index(1),
        firstItem = get_total_video_or_first_video_index(0),
        obj = get_video_obj();

    // show next video button
    if (totalVideo > VOD_COUNTER) {
        $("#playNextVideo").css('visibility', 'visible');
        $("#playPauseVideo").attr('data-sn-right', '#playNextVideo');

    } else {
        $("#playNextVideo").css('visibility', 'hidden');
        $("#playPauseVideo").attr('data-sn-right', 'null');
    }

    // show previous video button
    if (VOD_COUNTER > firstItem) {
        $("#playPreviousVideo").css('visibility', 'visible');
        $("#playPauseVideo").attr('data-sn-left', '#playPreviousVideo');
    } else {
        $("#playPreviousVideo").css('visibility', 'hidden');
        $("#playPauseVideo").attr('data-sn-left', 'null');
    }

    // Add vidoe player
    set_focus("videoSection", "");
    SN.focus("videoSection");

    $("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');

    $("#videoURL").attr('src', VOD_URL);

    console.log(VOD_URL);

    MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
        stretching: "auto",
        features: features,
        customError: "&nbsp;",
        clickToPlayPause: false,
        success: function (media) {

            if (SELECTED_MENU_INDEX == 2) $(".mejs__controls").addClass('set_progressbar'); // Progressbar Shift upside 
            else $(".mejs__controls").removeClass('set_progressbar');

            $(".mejs__time-total").css('height', '18px');
            $(".mejs__currenttime").css('height', '18px');
            $(".mejs__duration").css('height', '18px');

            $(".mejs__time-loaded").css('height', '18px');
            $(".mejs__time-current").css('height', '18px');
            $(".mejs__time-buffering").css('height', '18px');

            $(".mejs__time").css('font-size', '20px');
            $(".mejs__time").css('padding-top', '18px');

            if (SELECTED_MENU_INDEX == 0) {
                $(".custom_control_container").show();
                $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
            } else {
                $(".custom_control_container").hide();
                $(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
            }

            media.load();
            media.play();
            VIDEO_PLAYER = media;

            media.addEventListener('progress', function () {
                //console.log("3333333333333");
                if (SELECTED_MENU_INDEX == 0) $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
            });

            media.addEventListener('error', function (e) {
                PLAY_VIDEO = true;
                retry_error_popup();
                media.pause();
            });

            media.addEventListener('ended', function (e) {
                console.log("end video..............." + e.message);
                totalVideo = get_total_video_or_first_video_index(1);
                if (VOD_COUNTER < totalVideo) previous_next_video(type = "next");
                else closeVideo();
            });

            media.addEventListener('playing', function (e) {
                console.log("playing...............");
                $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
                $("#playPauseIcon").attr('src', 'images/pause.png');
                if (SELECTED_MENU_INDEX == 0) {
                    $("#customPause").find("img").attr("src", "images/pause_icon.png");
                    $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
                }

            });

            media.addEventListener('pause', function (e) {
                console.log("pause...............");
                $("#playPauseIcon").attr('src', 'images/play.png');
                if (SELECTED_MENU_INDEX == 0) {
                    $("#customPause").find("img").attr("src", "images/custom_play_icon.png");
                    $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
                } else {
                    $(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 1);
                }
            });

            media.addEventListener('timeupdate', function (e) {
                if (SELECTED_MENU_INDEX == 0) $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
            });

            media.addEventListener('canplay', function (e) {
                PLAY_VIDEO = true;
                if (SELECTED_MENU_INDEX == 0) {
                    show_hide_programme_details_after_specific_time();
                    $(".mejs__controls").addClass('mejs__offscreen').css('opacity', 0);
                }
            });

        }
    });
}

var closeVideo = function () {
    console.log("close video");
    $(".circle_loader").removeClass('circle-loader-middle');
    VOD_URL = "";
    VIDEO_PLAYER.pause();
    VIDEO_PLAYER.setSrc("http://wikitv.comcast-sa.com/wrong-url");
    VIDEO_PLAYER.pause();
    PLAY_VIDEO = false;

    $("#video_container").html('');
    $("#video_container").hide();

    $(".container_box").show();
    $(".video_container").removeClass('active').hide();;
    $(".main_container").show();

    $("#epgListContainer").html('');
    $(".epg_icon_container").hide();
    show_hide_video_next_previous(false);

    if (SELECTED_MENU_INDEX == 0) SN.focus('#live_menu_item_' + CAT_ITEM_INDEX);
    else SN.focus("videoDetailsPageIcons");
};

function forward_video() {
    if ($(".video_container").hasClass("active") && SELECTED_MENU_INDEX > 0) {
        VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
    }
}

function rewind_video() {
    if ($(".video_container").hasClass("active") && SELECTED_MENU_INDEX > 0) {
        VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
    }
}

function show_hide_video_next_previous(flag) {
    if (flag) $("#videoNextPrevious").css('display', 'table');
    else $("#videoNextPrevious").hide();
}

/*************************************
    if type is 1 return total video
    else first li item index
**************************************/
function get_total_video_or_first_video_index(type) {
    var totalVideo = 0,
        firstItem = 0;

    switch (SELECTED_MENU_INDEX) {
        case 0: // for live menu
            totalVideo = $("#liveList li.visible").last().index();
            firstItem = $("#movieList" + CAT_ROW_INDEX + " li.visible").first().index();
            break;

        case 1: // For Movies menu
            totalVideo = $("#movieList" + CAT_ROW_INDEX + " li.visible").last().index();
            firstItem = $("#movieList" + CAT_ROW_INDEX + " li.visible").first().index();
            break;

        case 2: // For Show menu
            totalVideo = $("#episodeList li.visible").last().index();
            firstItem = $("#episodeList li.visible").first().index();
            break;

    }

    if (type == 1) return totalVideo;
    else return firstItem;

}

//This function is used to hide progress bar after 10 second
function show_hide_programme_details_after_specific_time() {
    clearInterval(hide_programme_details);

    if ($('.epg_icon_container').css('display') == 'none') {
        $(".epg_icon_container").show();
        if (SELECTED_MENU_INDEX == 0) {
            $(".custom_control_container").show();
            $(".custom_control_container").css("display", "block");
            $(".customProgressBar").hide();
        } else {
            $(".custom_control_container").hide();
            $(".custom_control_container").css("display", "none");
            $(".customProgressBar").show();
        }
    }

    hide_programme_details = setTimeout(function () {
        running = false;
        $(".epg_icon_container").hide();
        $(".custom_control_container").hide();
        $("#language_option").hide();
        if ($(".video_container").hasClass("active") && !$(".channel_dvr_box").is(":visible")) SN.focus('videoSection');
    }, 10000);
}

/***************************************
    This is for next / previous video
****************************************/
function previous_next_video(type) {
    var obj = get_video_obj(),
        id = "",
        totalVideo = get_total_video_or_first_video_index(1),
        firstItem = get_total_video_or_first_video_index(0);

    $(".progress-container").hide();
    $(".video-title").text('');

    // hide next video button
    if (totalVideo == VOD_COUNTER) {
        $("#playNextVideo").css('visibility', 'hidden');
        $("#playPauseVideo").attr('data-sn-right', 'null');
    }

    // hide previous video button
    if (VOD_COUNTER == $("#movieList" + CAT_ROW_INDEX + " li.visible").first().index()) {
        $("#playPreviousVideo").css('visibility', 'hidden');
        $("#playPauseVideo").attr('data-sn-left', 'null');
    }

    switch (type) {
        case "previous":
            if (VOD_COUNTER > 0) {
                if (SELECTED_MENU_INDEX == 0) {
                    VOD_COUNTER = $("#liveList li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li.visible').index();

                } else if (SELECTED_MENU_INDEX == 1) {
                    VOD_COUNTER = $("#movieList" + CAT_ROW_INDEX + " li:nth-child(" + (VOD_COUNTER + 1) + ")").prevAll('li.visible').index();

                } else VOD_COUNTER = VOD_COUNTER - 1;

                if (SELECTED_MENU_INDEX == 0) id = obj[VOD_COUNTER]['channel_id'];
                else id = obj[VOD_COUNTER]['id'];

                get_video_details(id, true);
            }

            break;

        case "next":
            if (VOD_COUNTER < totalVideo) {
                if (SELECTED_MENU_INDEX == 0) {
                    VOD_COUNTER = $("#liveList li:nth-child(" + (VOD_COUNTER + 1) + ")").nextAll('li.visible').index();

                } else if (SELECTED_MENU_INDEX == 1) {
                    VOD_COUNTER = $("#movieList" + CAT_ROW_INDEX + " li:nth-child(" + (VOD_COUNTER + 1) + ")").nextAll('li.visible').index();

                } else VOD_COUNTER = VOD_COUNTER + 1;

                if (SELECTED_MENU_INDEX == 0) id = obj[VOD_COUNTER]['channel_id'];
                else id = obj[VOD_COUNTER]['id'];

                get_video_details(id, true);
            }
            break;
    }
}

function show_hide_controls() {
    if (SELECTED_MENU_INDEX == 2) $("#videoNextPrevious").show();
    clearTimeout(HIDE_SHOW_ERROR);
    HIDE_SHOW_ERROR = setTimeout(function () {
        $("#videoNextPrevious").hide();
    }, 3000);
}