function hide_show_modal(action, name, message) {
    console.log(action, name, message);
    var modalName = $(".modal_container").attr("data-modal-name");

    if (action == true && !modalName) {
        // Set previous depth before open modal box
        if ($(".home_container").hasClass("active")) {
            TAB_INDEX = 0;
        }
        else if ($(".live_channel_container").hasClass("active")) {
            TAB_INDEX = 1;
        }
        else if ($(".epg_container").hasClass("active")) {
            TAB_INDEX = 2;

        } else if ($(".on_demand_container").hasClass("active")) {
            TAB_INDEX = 3;

        } else if ($(".sub_category_container").hasClass("active")) {
            TAB_INDEX = 4;

        } else if ($(".video_list_container").hasClass("active")) {
            TAB_INDEX = 5;

        } else if ($(".logout_container").hasClass("active")) {
            TAB_INDEX = 6;

        } else if ($(".video_container").hasClass("active")) {
            TAB_INDEX = 7;
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
            $(".exit_modal").one("transitionend", function () {
                manage_spatial_navigation(name);
                SN.focus("exitModal");
            });

        } else {
            manage_spatial_navigation(name);
            SN.focus("retryModal");
        }

    }
    else if (action == false) {
        if (name == "EXIT") {
            $(".exit_modal").removeClass("exit_modal_show");

        } else if (name == "RETRY_CANCEL" || name == "RETRY_EXIT") {
            $(".retry_modal").removeClass("popup_new_box");
        }

        if (TAB_INDEX > -1) $(".modal_container").removeClass("active"); // this is only for home page
        $(".modal_container").attr("data-modal-name", "");

        // Set focus on previous active container
        if (TAB_INDEX == 0) {
            if (!$(".splash-screen").is(':visible')) {
                hide_show_screens("home_container");
                SN.focus("menu_items");
            }
        } else if (TAB_INDEX == 1) {
            hide_show_screens("live_channel_container");
            SN.focus("channel_number_box");
        } else if (TAB_INDEX == 2) {
            hide_show_screens("epg_container");
            SN.focus("channel_slider");
        } else if (TAB_INDEX == 3) {
            hide_show_screens("on_demand_container");
            SN.focus("ondemand_items");
        } else if (TAB_INDEX == 4) {
            hide_show_screens("sub_category_container");
            SN.focus("sub_category_list");
        } else if (TAB_INDEX == 5) {
            hide_show_screens("video_list_container");
            SN.focus("video_list");
        } else if (TAB_INDEX == 6) {
            hide_show_screens("logout_container");
            SN.focus("manage_btn");
        } else if (TAB_INDEX == 7) {
            $(".video_container").addClass("active");
            SN.focus("videoPlayer");
        }
    }
}