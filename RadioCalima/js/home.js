function parse_main_feed() {
    $("#login_loader").hide();
    $(".home_container").show();
    $("#loader").hide();
    SN.focus("menu_items");
    addEventListeners();
}

function change_menu_focus(id) {
    if (id == 'menu_0') $("#" + id).find("img").attr("src", "./images/menu_border.png");

    if (id == 'menu_1') $("#" + id).find("img").attr("src", "./images/menu_border.png");

    if (id != '') {
        $("li.nav_box").removeClass("selected_menu");
        $("#" + id).addClass("selected_menu");
    }

}

function hide_show_screens(className) {
    $(".home_container, .radio_container, .about_container, .video_container").removeClass("active").hide();
    if (className != '') $("." + className).addClass("active").show();
    else $("#loader").show();
}


function spatial_navigation_program() {

    manage_spatial_navigation("menu_container") // For menu item

    manage_spatial_navigation("home_container") // For home button

    manage_spatial_navigation("music_container") // For music list

}

function remove_add_active_class(className) {
    if ($("body").find(".active").length > 0) {
        $("body").find(".active").each(function () {
            if ($(this).className != className) $(this).removeClass("active");
        });
    }
    if (className != "modal_container") {
        $(".home_container").addClass("active");
    }
    $("." + className).addClass("active");
}

function show_hide_video_container() {
    $(".pause-icon").hide();
    $(".video-inner").show();
    $(".video-loader").show();
    $(".main-container").hide();
    $("#video_container").show();
    $("#av-player").css("display", "block");
}

//This function is used for display two digit number from 1-9
function min_two_digits(number) {
    return (number < 10 ? '0' : '') + number;
}


function play_icon_focus(id) {
    if (id == 'music_0') $("#" + id).find(".play_icon").attr("src", "./images/pause_audio.png");
    else $("#music_0").find(".play_icon").attr("src", "");

    if (id == 'music_1') $("#" + id).find(".play_icon").attr("src", "./images/pause_audio.png");
    else $("#music_1").find(".play_icon").attr("src", "");

    if (id == 'music_2') $("#" + id).find(".play_icon").attr("src", "./images/pause_audio.png");
    else $("#music_2").find(".play_icon").attr("src", "");

    if (id == 'music_3') $("#" + id).find(".play_icon").attr("src", "./images/pause_audio.png");
    else $("#music_3").find(".play_icon").attr("src", "");

}