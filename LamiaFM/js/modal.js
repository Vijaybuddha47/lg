function set_modal_color(name) {
	$('.mod_bg_color').css('background', 'url("images/exit.png")');
	if (name == "EXIT") {
		$(".mod_text_color").css("color", MODAL_TEXT_COLOR).html(APP_EXIT_MSG);

	} else {
		$(".mod_text_color").css("color", MODAL_TEXT_COLOR);
	}
}

function hide_show_modal(action, name, message) {
	var modalName = $(".modal_container").attr("data-modal-name");
	if (action == true && !modalName) {
		console.log('show popup');
		$(".modal_container").addClass("active");
		set_modal_color(name);
		if (name == 'EXIT') {
			$(".main-container").addClass("pointer");
			$(".exit_modal").addClass("exit_modal_show");
			$(".selected_btn").css("pointer-events", "auto");
			$("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");

			$(".exit_modal").one("transitionend", function () {
				console.log('show exit popup');
				SN.focus('exit_modal');
				$('#exit_modal').on('sn:enter-down', function () {
					$('.popup_btn button#' + e.target.id).click();
				});
			});

		} else if (name == "RETRY_CANCEL") {
			$(".video-container").removeClass("active");
			$(".retry_modal").addClass("popup_new_box");
			$(".mod_text_color").html(message);
			$(".mod_name").html(APP_NAME);

			SN.focus('retryCancelModal');
			$('#retryCancelModal').on('sn:enter-down', function (e) {
				//buttonIndex = $('.popup_btn button#'+ e.target.id).index();
				$('.popup_btn button#' + e.target.id).click();
			});

		}
		$(".modal_container").attr("data-modal-name", name);

	} else if (action == false) {
		console.log('hide popup');
		$(".modal_container").removeClass("active");
		$(".modal_container").attr("data-modal-name", "");

		if (name == 'EXIT') {
			$(".menu_container").addClass("active");
			//$(".about-border").addClass("about-active");
			$(".main-container").removeClass("pointer");
			//$(".exit_modal").removeClass("pointer");

			$(".exit_modal").removeClass("exit_modal_show");
			SN.focus('menuList');
			console.log('hide exit popup');

		} else if (name == "RETRY_CANCEL") {
			$(".retry_modal").removeClass("popup_new_box");
		}
	}
}