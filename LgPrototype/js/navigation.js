window.addEventListener('load', function () {
    set_focus('videoPlayer', 'video_container');
    $('#videoPlayer').on('sn:focused', function (e) {
        console.log("videoPlayer player focus");
    });

    set_focus('videoNextPrevious', 'playPauseVideo');

    $('#videoNextPrevious').on('sn:focused', function (e) {
        console.log("videoNextPrevious player focus");
        $("#playPreviousVideo").find("img").attr("src", "images/previous_video.png");
        $("#playPauseVideo").find("img").attr("src", "images/pause.png");
        $("#playNextVideo").find("img").attr("src", "images/next_video.png");

        if (e.target.id == "playPreviousVideo") $("#playPreviousVideo").find("img").attr("src", "images/previous_video_focus.png");
        if (e.target.id == "playNextVideo") $("#playNextVideo").find("img").attr("src", "images/next_video_focus.png");
        if (TIMER) {
            clearTimeout(TIMER); //cancel the previous TIMER.
            TIMER = null;
        }
        TIMER = setTimeout(function () {
            show_hide_player_progress(false);
            show_hide_show_deatils(false);
        }, 3000);

    });

    // Next/Previous Video
    $('#videoNextPrevious').on('sn:enter-down', function (e) {
        if ($("#playPreviousVideo").is(":focus")) {
            previous_next_video(type = "previous");

        } else if ($("#playPauseVideo").is(":focus")) {
            if ($("#av-player").css('display') == 'block') {
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
                            } else if (VIDEO_PLAYER.play) {
                                $(".pause-icon").show();
                                pauseVideo();
                                VIDEO_PLAYER.pause();
                            }
                        }
                    }

                } else if (VIDEO_PLAYER.play) {
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
    });
});