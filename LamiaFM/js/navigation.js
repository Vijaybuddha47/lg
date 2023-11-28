window.addEventListener('load', function () {
	window.SN = SpatialNavigation;
	SN.init();

	// Add menu List
	SN.add({
		id: 'menuList',
		selector: '#menuList .item',
		restrict: 'self-only',
		defaultElement: '#menu0',
		enterTo: 'last-focused'
	});

	// Add content list
	SN.add({
		id: 'catList',
		selector: '#catList .item',
		//enterTo: 'last-focused',
		//straightOnly: true,
		//straightOverlapThreshold: 0,
		//restrict: 'self-only',
		//defaultElement: '#content0',
	});

	SN.add({
		id: 'aboutDesc',
		selector: '#aboutDesc .item',
		defaultElement: '#aboutDescText',
		//restrict: 'self-only',
	});

	SN.add({
		id: 'videoSection',
		selector: '#videoSection .focusable',
		restrict: 'self-only',
		defaultElement: '#video_container',
	});

	// Add exit popup
	SN.add({
		id: 'exit_modal',
		selector: '#exit_modal .item',
		defaultElement: '#exitbtn0',
		enterTo: 'default-element',
		restrict: 'self-only',
	});

	// Add retry popup
	SN.add({
		id: 'retryCancelModal',
		selector: '#retryCancelModal .item',
		defaultElement: '#retryButton',
		restrict: 'self-only',
	});

	$('#videoSection').on('sn:focused', function () {
		console.log("video_container focused");
		$("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
		$(".pause-icon").hide();
		$("#video_container").show().addClass('active');
		$(".menu_container").hide().removeClass('active');
		$(".cat_container").removeClass('active');

	});

	$('#menuList').on('sn:focused', function (e) {
		console.log("menu focused");
		FOCUSED_MENU_INDEX = $('#menuList li#' + e.target.id).index();
		$("ul#menuList li").removeClass("menu_border");
		$(".menu_container").addClass("active");
		$(".cat_container").removeClass("active");
		$("#contentPlayVideoImg").attr('src', "images/linear_live_image.png");
	});

	$('#catList').on('sn:focused', function (e) {
		FOCUSED_CAT_INDEX = $('#catList li#' + e.target.id).index();
		console.log("catList focused", FOCUSED_CAT_INDEX, FOCUSED_MENU_INDEX);
		$("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
		$("div.about_desc_container").removeClass("about_desc_container").addClass("cat_container");
		$("div.cat_container").addClass("active");
		$(".menu_container").removeClass("active");
		if ($("ul#catList li:nth-child(" + (FOCUSED_CAT_INDEX + 1) + ")").hasClass("livevideo")) {
			$("#contentPlayVideoImg").attr('src', "images/linear_live_image_hover.png");
		}
	});

	$('#menuList').on('sn:enter-down', function () {
		console.log("menuList enter-down");
		$("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").click();
	});

	$('#catList').on('sn:enter-down', function () {
		console.log("catList enter-down");
		$("ul#catList li:nth-child(" + (FOCUSED_CAT_INDEX + 1) + ")").click();
	});

	$('#aboutDesc').on('sn:focused', function () {
		console.log("aboutDesc focused");
		$("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
		$("div.cat_container").removeClass("cat_container").addClass("about_desc_container active");
		$(".menu_container").removeClass("active");
	});

	SN.makeFocusable();

	$(window).keydown(function (evt) {
		var modalName = $(".modal_container").attr("data-modal-name");
		switch (evt.keyCode) {
			case 13: // Ok
				/*if ($(".exit_modal").hasClass("exit_modal_show") && $('#exitbtn0').is(":focus")) {
						console.log('hide popup');
						hide_show_modal(false, 'EXIT');
				} else if ($(".exit_modal").hasClass("exit_modal_show") && $("#exitbtn1").is(":focus")) {
						 console.log('exit app');
						 window.close();
				}*/
				break;

			case 415: // Play 100
				if ($(".video_container").hasClass("active")) {
					VIDEO_PLAYER.play();
				}
				break;

			case 19: // Pause 102
				if ($(".video_container").hasClass("active")) {
					VIDEO_PLAYER.pause();
				}
				break;

			// Return key
			case 461:
				if ($(".video_container").hasClass("active")) {
					closeVideo();

				} else if ($(".modal_container").hasClass("active")) {
					// When exit modal selected
					hide_show_modal(false, modalName);
					if (modalName == "RETRY_CANCEL") {
						closeVideo();
					}

				} else if ($(".about_desc_container").hasClass("active")) {
					$(".about-desc").html("");
					$("div.about_desc_container").removeClass("about_desc_container").addClass("cat_container");
					SN.remove('catList');
					set_setting_list();
					SN.add({
						id: 'catList',
						selector: '#catList .item',
						defaultElement: '#content' + SELECTED_CAT_INDEX,
						//restrict: 'self-only',
					});
					SN.makeFocusable();
					SN.focus("catList");

				} else if ($(".cat_container").hasClass("active")) {
					console.log("back from category");
					SN.focus('menuList');

				} else if ($(".menu_container").hasClass("active")) {
					$(".menu_container").removeClass("active");
					$(".cat_container").removeClass("active");
					$(".about-border").removeClass("about-active");
					evt.preventDefault();
					hide_show_modal(true, "EXIT");
				}
				break;

			// Right key
			case 39:
				if ($(".menu_container").hasClass("active")) {
					if ($("#catList li").length > 0) {
						SN.remove('catList');
						SN.add({
							id: 'catList',
							selector: '#catList .item',
							defaultElement: '#content0',
							//restrict: 'self-only',
						});
						SN.makeFocusable();
						SN.focus("catList");

					} else if ($("#aboutDescText").length > 0) {
						SN.focus("aboutDesc");
					}
				}
				break;

			// Left key
			case 37:
				break;

			default:
				console.log("Key code : " + evt.keyCode);
				break;
		}
	});
});