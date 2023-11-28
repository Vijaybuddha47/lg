function hide_show_modal(action, name, message) {
    console.log(action, name, message);
    var modalName = $(".modal_container").attr("data-modal-name");

    if (action == true && name != '') {

        // Set previous depth before open modal box
        // if ($(".search_container").hasClass("active")) {
        //     TAB_INDEX = 0;
        // }
        // else if ($(".home_container").hasClass("active")) {
        //     TAB_INDEX = 1;
        // }
        // else if ($(".dashboard_container").hasClass("active")) {
        //     TAB_INDEX = 2;

        // } else if ($(".setting_container").hasClass("active")) {
        //     TAB_INDEX = 3;

        // } else if ($(".subcategory_container").hasClass("active")) {
        //     TAB_INDEX = 4;

        // } else if ($(".video_list_container").hasClass("active")) {
        //     TAB_INDEX = 5;

        // } else if ($(".video_container").hasClass("active")) {
        //     TAB_INDEX = 6;

        // }


        // Remove active class from all container and add to modal box
        // hide_show_screens("");
        $(".active").removeClass("active");
        $(".modal_container").addClass("active").show();

        if (name == "EXIT" || name == "LOGOUT") {
            $(".exit_modal").addClass("exit_modal_show");
            $('.mod_button_sel').text(TXT["NO"]);
            $('.mod_button_un_sel').text(TXT["YES"]);
            $(".mod_text_color").html(message);

        } else if (name == "RETRY_CANCEL") {
            $(".retry_modal").addClass("popup_new_box");
            $(".mod_text_color").html(message);
            $(".mod_name").html(APP_NAME);
            $('.mod_button_sel').text(TXT["RETRY"]);
            $('.mod_button_un_sel').text(TXT["CANCEL"]);

        } else if (name == "RETRY_EXIT") {
            $(".retry_modal").addClass("popup_new_box");
            $(".mod_text_color").html(message);
            $(".mod_name").html(APP_NAME);
            $('.mod_button_sel').text(TXT["RETRY"]);
            $('.mod_button_un_sel').text(TXT["EXIT"]);
        } else if (name == "LANGUAGE") {
            $(".language_modal").addClass("popup_new_box");
            // $(".mod_text_color").html(message);
            // $(".mod_name").html(APP_NAME);
            // $('.mod_button_sel').text("RETRY");
            // $('.mod_button_un_sel').text("EXIT");
        }

        $(".modal_container").attr("data-modal-name", name);

        if (name == "LOGOUT") manage_spatial_navigation("EXIT");
        else manage_spatial_navigation(name);

        if (name == "LANGUAGE") SN.focus("languageChange");
        else if (name == "EXIT" || name == "LOGOUT") SN.focus("exitModal");
        else SN.focus("retryModal");

    }
    else if (action == false) {

        $(".exit_modal").removeClass("exit_modal_show");
        $(".retry_modal, .language_modal").removeClass("popup_new_box");

        $(".modal_container").attr("data-modal-name", "");

        // Set focus on previous active container
        if (TAB_INDEX < 4) {
            var container = "";
            if (TAB_INDEX == 0) container = "search_container";
            else if (TAB_INDEX == 1) container = "home_container";
            else if (TAB_INDEX == 2) container = "dashboard_container";
            else if (TAB_INDEX == 3) container = "setting_container";

            hide_show_screens(container);

            if (name == "LOGOUT") SN.focus("#menu_4");
            else SN.focus("#" + FIRST_LEVEL_FOCUSED_ITEM);
        } else if (TAB_INDEX == 4) {
            hide_show_screens("subcategory_container");
            SN.focus("subcategories");
        } else if (TAB_INDEX == 5) {
            hide_show_screens("video_list_container");
            SN.focus("videolist");
        } else if (TAB_INDEX == 6) {
            hide_show_screens("video_container");
            SN.focus("videoPlayer");
        }
    }
}