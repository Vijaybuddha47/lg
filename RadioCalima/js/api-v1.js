function checkVideoURL() {
    var errorMsg = "";
    $.ajax({
        type: "GET",
        url: VOD_URL,
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240 },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            load_video();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 403) errorMsg = "Your Are Not Authorized To View This Content";
            else if (jqXHR.status === 404) errorMsg = "Content Currently Not Available";
            else if (jqXHR.status === 0) errorMsg = NET_CONNECTION_ERR;
            else errorMsg = "Something went wrong";
            $(".video_container").addClass("active");
            $("#loader").hide();
            $("#error_text").text(errorMsg);
            $(".video-inner").hide();
            $(".video_player_error_message").show();
        }
    });

}

function fetchMetadata(options) {
    // if (PLAY_AUDIO) $("#" + SELECTED_ITEM).find(".img_box").html('<img class="play_icon" src="./images/pause_audio.png" alt="Pause" />');
    console.log(options);
    if (options.metadataType === "shout") {
        console.log("11111111");
        getShoutMetadata(options);
    }
    else {
        try {
            if (ICECAST_PLAY) ICECAST_PLAY.stop();
            ICECAST_PLAY = new IcecastMetadataStats(APP_MUSIC_URL_ARRAY[$("#" + SELECTED_ITEM).index()].stream_url, {
                interval: 60,
                sources: ["icy"],
                onStats: function (stat) {
                    console.log("IcecastMetadataStats...", stat);
                    searchSong(stat.icy);
                },
            });
        } catch (error) {
            console.log("error....", error);
            onerror();
        }
    }
}

function getShoutMetadata(options) {
    var requestUrl = options.stream_url + "/statistics?json=1";
    try {
        $.getJSON(requestUrl, function (data, jqXHR) {
            if (jqXHR === "success") {
                if (data.streams && data.streams[0]) {
                    searchSong({ StreamTitle: data.streams[0].songtitle });
                }
            }
        });
    } catch (e) {
        console.log("fetch Shout radio station error", e);
    }

}


function searchSong(metadata) {
    try {
        $.getJSON(getArtURL(metadata), function (data, textStatus) {
            if (textStatus === "success" && PLAY_AUDIO) {
                updateUI($.extend(metadata, data));
            } else if (metadata.length == 0) {
                onerror();
            }
        });
    } catch (error) {
        console.log("Search song error", error);
        onerror();
    }

}

// call API METADATA
function updateUI(songData) {
    var data = songData.results;
    if (data[0]) {
        var artwork = data[0].artworkUrl100;
        var newArtWork = artwork.replace("100x100bb", "600x600bb");
        $("#music_cover").attr("src", newArtWork);
        $("#current_music_title").text(songData.StreamTitle);
    }
    else if (data.length == 0 || songData.length == 0) {
        onerror();
    }
}


function getArtURL(metadata) {
    var itunesSearchEndpoint =
        "https://itunes.apple.com/search?limit=1&version=2";
    var streamtitleArr = metadata.StreamTitle.split("-");
    var artist = encodeURIComponent(streamtitleArr[0]);
    var track = encodeURIComponent(streamtitleArr.pop());
    return itunesSearchEndpoint + "&term=" + artist + track + "&entity=song";
}

function onerror() {
    console.log("onerror....");
    $("#music_cover").attr("src", SELECTED_IMG);
    $("#current_music_title").text("CALIMA TV - " + $("#" + SELECTED_ITEM)[0].innerText);
}