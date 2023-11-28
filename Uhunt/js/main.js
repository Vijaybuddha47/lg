window.onload = function () {
	timeout = 500;
	if (sessionStorage.move_to_login_sign_out_menu != undefined && sessionStorage.move_to_login_sign_out_menu == 0) {
		FOCUSED_MENU_INDEX = 5;
		SELECTED_MENU_INDEX = 5;
		MENU_ID = "SO";
	}

	sessionStorage.move_to_login_sign_out_menu = 1;
	$(".container_box").show();
	$(".loader").removeClass("set_loader_center").hide();
	$("span#modal_container").load("popup.html");
	
	setTimeout(function(){
		set_menu();
		$(".loader").show();
		if (FOCUSED_MENU_INDEX == 5) {
			$("#allVideoRowHeading, #featuredRowHeading").text("");
			$("ul#allVideosGrid, ul#featuredRow, .search_container").html('');
			$(".featuredRowContainer, .allVideosGridContainer").hide();
			$(".loader").removeClass("set_loader_center").show();
			$(".support_main_container, .loader").remove();
			$(".cat_container").show();
			$(".search_container, .cat_container").removeClass("active");
			FIRST_PAGE_ITEM_COUNTER = 0;
			FIRST_PAGE_COUNTER = 1;
			set_support_screen();

		} else {
			TIME_STAMP = jQuery.now();
			set_all_videos_and_channels_shows_screen(MENU_ID, TIME_STAMP);
		}
		
	}, timeout);
}