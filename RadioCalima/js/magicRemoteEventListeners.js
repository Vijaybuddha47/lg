/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var itemArray = document.getElementsByClassName("focusable");

function addEventListeners() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {

    var elementId = this.id;

    // When popup is clicked
    if ($(".modal_container").hasClass("active")) {
        if (!$(".modal_container").find("#" + elementId)) {
            if ($(".exit_modal_show").parent().attr("data-modal-name") == "EXIT") SN.focus("exitModal");
            else SN.focus("retryModal");
            return;
        } else {
            var modalName = $(".modal_container").attr("data-modal-name");
            if (elementId == "noButton" && PAGE_INDEX == 0) {
                hide_show_modal(false, 'EXIT');
                $(".home_container").addClass("active").show();
                SN.focus("menu_items");

            } else if (elementId == "yesButton" && PAGE_INDEX == 0) {
                window.close();
            }
            else if (elementId == "retryButton") {
                hide_show_modal(false, modalName);
                if (elementId == "retryButton") {
                    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) load_video();
                    else if (AUDIO_PLAYER != "") {
                        AUDIO_PLAYER.pause();
                        AUDIO_PLAYER = "";
                        $("#audio_container").html('');
                        $("#audio_container").hide();

                        $(".audio_container").removeClass('active');

                        $(".subcat_container").addClass("active").show();
                        SN.focus("subcatList");
                        load_audio();
                    }

                } else if (modalName == "RETRY_EXIT") {
                    // get_app_dynamic_val();
                    // get_home_page_tags();
                }
            } else if (elementId == "cancelButton") {
                hide_show_modal(false, modalName);
                if (modalName == "RETRY_CANCEL") {
                    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) closeVideo();
                    else if (AUDIO_PLAYER != "") closeAudio();

                } else if (modalName == "RETRY_EXIT") {
                    window.close();
                }
            }
        }
        // For home list  is clicked
    }
    else if ($(".home_container").hasClass("active")) {
        if (elementId == "home_0") {
            FOCUSED_ITEM = this.id;
            $(".main-container").hide();
            $(".video_container").addClass("active");
            $("#video_container").show();
            $("#loader").show();
            checkVideoURL();

        } else if (elementId == "home_1") {
            hide_show_screens("radio_container");
            FOCUSED_ITEM = this.id;
            SN.focus("musicList");

        }
    } else if ($(".radio_container").hasClass("active")) {
        var index = $("#" + this.id).index();
        var id = this.id;
        var play = '';
        RADIO_PAGE_FOCUSED_ITEM = id;
        play = true;
        if (SELECTED_ITEM == id) play = false;
        SELECTED_ITEM = id;
        play_icon_focus(id);
        if (index > -1 && index <= _.size(APP_MUSIC_URL_ARRAY) && play) {
            console.log("icecast....");
            // setTimeout(function () {
            if (ICECAST_PLAY) ICECAST_PLAY.stop();
            AOD_URL = APP_MUSIC_URL_ARRAY[index]["stream_url"];
            $(".img_box").empty()
            var index = $("#" + SELECTED_ITEM).index();
            var options = APP_MUSIC_URL_ARRAY[index];
            SELECTED_IMG = $("#" + SELECTED_ITEM).find(".list_thumbnail").attr("src");
            load_audio();
            fetchMetadata(options);
            if (ICECAST_PLAY) ICECAST_PLAY.start();
            // }, 500);
        } else if ($(".audio_container").hasClass("active")) {
            setTimeout(function () {
                if (AUDIO_PLAYER.play && PLAY_AUDIO) {
                    console.log("pause....");
                    pauseAudio();
                } else if (AUDIO_PLAYER.paused && !PLAY_AUDIO) {
                    console.log("play.....");
                    playAudio();
                }
            }, 500);
        }
    }
}


function _onMouseOverEvent(e) {
    var elementId = this.id;

    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }

    if (elementId != "") {
        if ($('#modal_container').hasClass("active")) {
            if (elementId.search("yesButton") > -1) $("#yesButton").focus();
            else if (elementId.search("noButton") > -1) $("#noButton").focus();
            else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
            else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
            if ($(".exit_modal_show").parent().attr("data-modal-name") == "EXIT") SN.focus("exitModal");
            else SN.focus("retryModal");

        } else {
            if ($("#" + elementId).closest('li').length > 0) $("#" + elementId).closest('li').focus();
        }
    }
}