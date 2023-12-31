window.TAB_INDEX = 0;
function hide_show_modal(action, name, message)
{
	var modalName = $(".modal_container").attr("data-modal-name");
	
	if (action == true && !modalName) {
		$(document.body).addClass('pointer_disable');
		// Set previous depth before open modal box
		if ($(".menu_container").hasClass("active")) {
			$("#menuList > li:nth("+ FOCUSED_MENU_INDEX +")").addClass("menu_border");
			TAB_INDEX = 0;
			
		} else if ($(".cat_container").hasClass("active") || $(".search_container").hasClass("active")) {
			TAB_INDEX = 1;
			
		} else if ($(".video_details_container").hasClass("active")) {
			TAB_INDEX = 4;
			
		} else if ($(".video_container").hasClass("active")) {
			TAB_INDEX = 5;
			
		}
		
		// Remove active class from all container and add to modal box
		$(".menu_container, .cat_container, .search_container, .video_details_container, .video_container").removeClass("active");
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
		if (name == "EXIT") {
			//webkitTransitionEnd oTransitionEnd MSTransitionEnd
			$(".exit_modal").one("transitionend", function() {
				SN.remove("exitModal");
				SN.add({
					id: 'exitModal',
					selector: '#exitModal .focusable',
					restrict: 'self-only',
					defaultElement: '#noButton',
					enterTo: 'last-focused'
				});
				SN.makeFocusable();
				SN.focus("exitModal");

				$('#exitModal').on('sn:enter-down', function(e) {
					console.log("exitModal sn:enter-down", e.target.id);
					$("#"+ e.target.id).click();
				});
			});

		} else {
			SN.remove("retryModal");
			SN.add({
				id: 'retryModal',
				selector: '#retryModal .focusable',
				restrict: 'self-only',
				defaultElement: '#retryButton',
				enterTo: 'last-focused'
			});
			SN.makeFocusable();
			SN.focus("retryModal");

			$('#retryModal').on('sn:enter-down', function(e) {
				console.log("retryModal sn:enter-down");
				$("#"+ e.target.id).click();				
			});
		}
		
	} else if (action == false) {
		$(document.body).removeClass('pointer_disable');

		if (name == "EXIT") $(".exit_modal").removeClass("exit_modal_show");
		else if (name == "RETRY_CANCEL" || name == "RETRY_EXIT") $(".retry_modal").removeClass("popup_new_box");
		
		$(".modal_container").removeClass("active");
		$(".modal_container").attr("data-modal-name", "");
		
		// Set focus on previous active container
		if (TAB_INDEX == 0) {
			if (!$(".splash-screen").is(':visible')) {
				$("#menuList > li").removeClass("menu_border");
				$(".menu_container").addClass("active");
				SN.focus("menuList");
			}
		
		} else if (TAB_INDEX == 1) {
			$(".cat_container, .search_container").addClass("active");
			
		} else if (TAB_INDEX == 4) {
			$(".video_details_container").addClass("active");
			
		} else if (TAB_INDEX == 5) {
			$(".video_container").addClass("active");

		}
	}	
}