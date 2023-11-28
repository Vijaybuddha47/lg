function hide_show_modal(action, name, message) {
    console.log(action, name, message);
    var modalName = $(".modal_container").attr("data-modal-name");


    if (action == true && !modalName) {
        // Set previous depth before open modal box
        if ($(".home_container").hasClass("active")) {
            TAB_INDEX = 0;
        }
        else if ($(".talent_page_container").hasClass("active")) {
            TAB_INDEX = 1;

        } else if ($(".category_container").hasClass("active")) {
            TAB_INDEX = 2;

        } else if ($(".search_container").hasClass("active")) {
            TAB_INDEX = 3;

        } else if ($(".search_result_main_container").hasClass("active")) {
            TAB_INDEX = 4;

        } else if ($(".favorite_page_container").hasClass("active")) {
            TAB_INDEX = 5;

        } else if ($(".detail_page_main_container").hasClass("active")) {
            TAB_INDEX = 6;

        } else if ($(".video_container").hasClass("active")) {
            TAB_INDEX = 7;
        }

        // Remove active class from all container and add to modal box
        remove_add_active_class("modal_container");
        $(".modal_container").addClass("active");

        if (name == "EXIT") {
            $(".exit_modal").addClass("exit_modal_show");
            $('.mod_button_sel').text("לא");
            $('.mod_button_un_sel').text("כן");
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

        } else if (name == "LOGOUT") {
            $(".exit_modal").addClass("exit_modal_show");
            $('.mod_button_sel').text("לא");
            $('.mod_button_un_sel').text("כן");
            $(".mod_text_color").html(message);

        }

        $(".modal_container").attr("data-modal-name", name);
        manage_spatial_navigation(name);

        if (name == "EXIT") {
            //webkitTransitionEnd oTransitionEnd MSTransitionEnd
            $(".exit_modal").one("transitionend", function () {
                manage_spatial_navigation(name);
            });

        } else {
            manage_spatial_navigation(name);
        }

        $(".main_container, .video-player-container").css("pointer-events", "none");

    }
    else if (action == false) {
        $(".main_container, .video-player-container").css("pointer-events", "auto");
        if (name == "EXIT") {
            $(".exit_modal").removeClass("exit_modal_show");

        } else if (name == "RETRY_CANCEL" || name == "RETRY_EXIT") {
            $(".retry_modal").removeClass("popup_new_box");
        } else if (name == "LOGOUT") {
            $(".exit_modal").removeClass("exit_modal_show");
        }

        if (TAB_INDEX > -1) $(".modal_container").removeClass("active"); // this is only for home page
        $(".modal_container").attr("data-modal-name", "");

        // Set focus on previous active container
        if (TAB_INDEX < 7) {
            if (!$(".splash-screen").is(':visible') && TAB_INDEX == 0) {
                // if ($(".home_container").hasClass('active') && TAB_INDEX == 0) {
                $("#loader").hide();
                SN.focus("#hamburger");
                // get_home_page_tags();
                // } else show_page_by_index(TAB_INDEX);
            } else show_page_by_index(PAGE_INDEX);
            //SN.focus("#BackBtn");

        } else if (TAB_INDEX == 7) {
            $(".video_container").addClass("active").show();
            SN.focus('videoSection');
        }
    }
}

function check(evt) {
    if (evt.keyCode === 461) {
        $('.modal_container').removeClass('active').hide();
        $('.home_container').addClass('active');
        SN.focus("#hamburger");
    }
}