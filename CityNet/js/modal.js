function hide_show_modal(action, name, message) {
	//var modalName = $(".modal_container").attr("data-modal-name");
	//if (action == true && !modalName) {
	if (action == true) {
		$(".main_container, .video-player-container").addClass('pointer_disable');
		// Set previous depth before open modal box
		if ($(".menu_container").hasClass("active")) {
			$("#menuList > li:nth(" + FOCUSED_MENU_INDEX + ")").addClass("menu_border");
			TAB_INDEX = 0;

		} else if ($(".cat_container").hasClass("active") || $(".search_container").hasClass("active")) {
			TAB_INDEX = 1;

		} else if ($(".video_details_page_container").hasClass("active")) {
			TAB_INDEX = 4;

		} else if ($(".video_container").hasClass("active")) {
			TAB_INDEX = 5;

		}

		// Remove active class from all container and add to modal box
		$(".menu_container, .cat_container, .search_container, .video_details_page_container, .video_container").removeClass("active");
		$(".modal_container").addClass("active");

		if (name == "EXIT" || name == "LOGOUT") {
			$(".exit_modal").addClass("exit_modal_show");
			$('.mod_button_sel').text("NO");
			$('.mod_button_un_sel').text("Sí");
			$(".mod_text_color").html(message);

		} else if (name == "RETRY_CANCEL") {
			$(".retry_modal").addClass("popup_new_box");
			$(".mod_text_color").html(message);
			$(".mod_name").html(APP_NAME);
			$('.mod_button_sel').text("Intentar de nuevo");
			$('.mod_button_un_sel').text("Cancelar");
		}

		$(".modal_container").attr("data-modal-name", name);
		manage_spatial_navigation(name);

	} else if (action == false) {
		$(".main_container, .video-player-container").removeClass('pointer_disable');
		if (name == "EXIT" || name == "LOGOUT") {
			$(".exit_modal").removeClass("exit_modal_show");

		} else if (name == "RETRY_CANCEL") {
			$(".retry_modal").removeClass("popup_new_box");
		}

		$(".modal_container").removeClass("active"); // this is only for home page
		$(".modal_container").attr("data-modal-name", "");

		if (TAB_INDEX == -1) {
			setTimeout(function () { set_form_focus(); }, 500);

			// Set focus on previous active container
		} else if (TAB_INDEX == 0) {
			if (!$(".splash-screen").is(':visible')) {
				$("#menuList > li").removeClass("menu_border");
				$(".menu_container").addClass("active");
				SN.focus("menuList");
			}

		} else if (TAB_INDEX == 5) {
			$(".video_container").addClass("active");
		}
	}
}