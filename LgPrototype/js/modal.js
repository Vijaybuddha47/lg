function hide_show_modal(action, name, message) {
    console.log(action, name, message);
    var modalName = $(".modal_container").attr("data-modal-name");

    if (action == true && !modalName) {
        // Set previous depth before open modal box
        if ($(".home_container").hasClass("active")) {
            TAB_INDEX = 0;
        }
        else if ($(".video_library_container").hasClass("active")) {
            TAB_INDEX = 1;

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

        if (name == "EXIT") {
            //webkitTransitionEnd oTransitionEnd MSTransitionEnd
            SN.focus("exitModal");
            $(".exit_modal").one("transitionend", function () {
                // manage_spatial_navigation(name);
            });

        } else {
            manage_spatial_navigation(name);
        }

    }
    else if (action == false) {
        console.log("action=>", action, name);
        if (name == "EXIT") {
            $(".exit_modal").removeClass("exit_modal_show");
        } else if (name == "RETRY_CANCEL" || name == "RETRY_EXIT") {
            $(".retry_modal").removeClass("popup_new_box");
        }

        $(".modal_container").removeClass("active"); // this is only for home page
        $(".modal_container").attr("data-modal-name", "");

        // Set focus on previous active container
        // if (TAB_INDEX == 0) {
        //     if (!$(".splash-screen").is(':visible')) {
        //         // SN.focus("menuButton");
        //         // get_all_albums();
        //     }
        // } else if (TAB_INDEX == 5) {
        //     // $(".video_container").addClass("active");
        // }
    }
}