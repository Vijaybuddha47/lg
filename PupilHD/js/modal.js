function hide_show_modal(action, name, message) {
    console.log("hide_show_modal ", action, name, message);
    var modalName = $(".modal_container").attr("data-modal-name");

    if (action == true && !modalName) {
        // Set previous depth before open modal box
        if ($(".home_container").hasClass("active")) {
            TAB_INDEX = 0;
        }
        else if ($(".video_library_container").hasClass("active")) {
            if ($(".episode_container").hasClass("active")) TAB_INDEX = 2;
            else TAB_INDEX = 1;

        } else if ($(".search_container").hasClass("active")) {
            TAB_INDEX = 3;

        } else if ($(".account_container").hasClass("active")) {
            TAB_INDEX = 4;

        } else if ($(".setting_container").hasClass("active")) {
            TAB_INDEX = 5;

        } else if ($(".video_container").hasClass("active")) {
            TAB_INDEX = 6;
        }

        // Remove active class from all container and add to modal box
        remove_add_active_class("modal_container");

        $(".modal_container").addClass("active");

        if (name == "EXIT") {
            $(".exit_modal").addClass("exit_modal_show");
            $('.mod_button_sel').text("NO");
            $('.mod_button_un_sel').text("YES");
            $(".mod_text_color").html(message);

        } else if (name == "RETRY_CANCEL") {
            $(".retry_modal").addClass("popup_new_box");
            $(".mod_text_color").html(message);
            $(".mod_name").html(APP_NAME);
            $('.mod_button_sel').text("RETRY");
            $('.mod_button_un_sel').text("CANCEL");

        } else if (name == "RETRY_EXIT") {
            $(".retry_modal").addClass("popup_new_box");
            $(".mod_text_color").html(message);
            $(".mod_name").html(APP_NAME);

            $('.mod_button_sel').text("RETRY");
            $('.mod_button_un_sel').text("EXIT");

        }

        $(".modal_container").attr("data-modal-name", name);

        manage_spatial_navigation(name);

        // if (name == "EXIT") {
        //     //webkitTransitionEnd oTransitionEnd MSTransitionEnd
        //     SN.focus("exitModal");
        //     $(".exit_modal").one("transitionend", function () {
        //         // manage_spatial_navigation(name);
        //     });

        // } else {
        //     manage_spatial_navigation(name);
        // }

    }
    else if (action == false) {
        console.log("action=>", action, name);
        if (name == "EXIT") {
            $(".exit_modal").removeClass("exit_modal_show");
            SN.focus("#" + FIRST_PAGE_FOCUSED_ITEM);
        } else if (name == "RETRY_CANCEL" || name == "RETRY_EXIT") {
            $(".retry_modal").removeClass("popup_new_box");
            if (TAB_INDEX == -1) {
                $(".login_loader").css("display", "none");
                $(".login_container").addClass("active").show();
                SN.focus("login_container");
                // window.location.href = "login.html";
            } else if (TAB_INDEX == 0 && name == "RETRY_EXIT") {
                window.location.href = "home.html";
            } else if (TAB_INDEX == 1) {
                $('.menu_container').removeClass('toggle_menu');
                reset_preview_player(true);
                $(".home_container, .setting_container, .search_container, .account_container, .video_library_container").removeClass("active").hide();
                $(".main_container").show();
                $("#home_spinner").show();
                if (_.size(APP_VIDEO_CATEGORY) > 0) set_video_library_screen();
                else get_new_release_video();
            } else if (TAB_INDEX == 2) {
                $("#video_list").hide();
                $(".video_library_container").addClass("active").show();
                $(".episode_container").show();
                $("#loader").show();
                SELECTED_VIDEO_DATA = {};
                SECOND_PAGE_SELECTED_SHOW_CATEGORY = categoryName;
                SELECTED_VIDEO_DATA = APP_CAT_VIDEO_ARRAY[categoryName][index];
                $("#episode_list").html("");
                $(".episode_list").hide();
                get_episode_url(0);
            } else if (TAB_INDEX == 3) {
                reset_preview_player(true);
                reset_search_result_container();
                $('.menu_container').addClass('toggle_menu');
                $(".home_container, .setting_container, .account_container, .video_library_container").removeClass("active").hide();
                $(".search_container").addClass("active").show();
                $(".result_not_found").text("");
                $('#searchInputText').val("");
                SN.focus("searchBox");
            } else if (TAB_INDEX == 4) {
                remove_add_active_class("account_container");
                SN.focus("account_btns")
            } else if (TAB_INDEX == 5) {
                remove_add_active_class("setting_container");
                SN.focus("alpha_numeric")
            } else if (TAB_INDEX == 6) {
                remove_add_active_class("video-container");
                SN.focus("videoPlayer")
            }
        }

        $(".modal_container").removeClass("active"); // this is only for home page
        $(".modal_container").attr("data-modal-name", "");
    }
}

function remove_add_active_class(className) {
    console.log("remove add active class");
    if ($("body").find(".active").length > 0) {
        $("body").find(".active").each(function () {
            if ($(this).className != className) $(this).removeClass("active");
        });
    }
    if (className != "modal_container" && PAGE_INDEX == 0) {
        $(".home_container").addClass("active");
    }
    if (className == "episode_container") $(".video_library_container").addClass("active");
    $("." + className).addClass("active");
}