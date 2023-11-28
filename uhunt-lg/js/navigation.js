/*
	For search, search results and popup navigation have been used where these created.
	Such as for search: set_search_screen function in home.js,
				search results: request_search_results in home.js
				popup: popup.js
*/

window.addEventListener('load', function() {
	window.SN = SpatialNavigation;
	SN.init();
	
	// When menu foucs
	$('#menuList').on('sn:focused', function(e) {
		console.log("menu focused ...");
		FOCUSED_MENU_INDEX = $('#'+ e.target.id).closest('li').index();
		if (!$(".menu_container").hasClass("active")) manageSlideBetweenChannelMenu();

		if ($(".search_container").hasClass("active") && $("#searchList").children().length < 1) document.getElementById('searchInputText').value = "";
		
		$("#menuList > li").removeClass("menu_border");
		$(".menu_container").addClass("active");
		$(".cat_container, .channel_video_categories_menu_second_page_container, .channel_third_page_container, .video_details_container, .search_container").removeClass("active");

		if ($("ul#featuredRow").hasClass('active')) $("ul#featuredRow").addClass('lastActive');
		else $("ul#allVideosGrid").addClass('lastActive');
		
		if ($("ul#catList").hasClass('active') && !$("ul#subcatList").hasClass('active')) $("ul#catList").addClass('lastActive');

		if ($("ul#subcatList").hasClass('active')) $("ul#subcatList").addClass('lastActive');
		
		$("ul#featuredRow, ul#catList, ul#allVideosGrid, ul#subcatList").removeClass('active').removeAttr('style');
		
		$(".loader").removeClass("set_loader_center");
	});
	
	// When menu selection
	$('#menuList').on('sn:enter-down', function(e) {
		console.log("menu selected ...");
		$("ul#menuList li:nth-child("+ (FOCUSED_MENU_INDEX+ 1) +")").click();
	});
	
	// When All videos / channels and shows items focus
	$('#featuredRow, #allVideosGrid').on('sn:focused', function(e) {
		console.log("featuredRow / allVideosGrid focused");
		
		FIRST_PAGE_ITEM_INDEX = $('#'+ e.currentTarget.id +' li#'+ e.target.id +', #featuredRow li#'+ e.target.id).index();
		$("ul#featuredRow, ul#allVideosGrid").removeClass('lastActive');
		$('#featuredRow, #allVideosGrid').removeClass("active");
		$('#'+ e.currentTarget.id).addClass("active");
		
		if (!$(".cat_container").hasClass("active")) moveFocusToRightSide();
		//$(".loader").addClass("set_loader_center");

		// When first page focused
		if ($(".cat_container").hasClass("active")) {
			if ($("ul#allVideosGrid").hasClass("active") && $("ul#allVideosGrid li:nth-last-child(-n+12)").is(":focus") && LOAD_NEXT_PAGE && MENU_ID != "AV" && MENU_ID != "CAS") {
				call_next_page(CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'], 1);
			}
		}
	});
	
	// When second page focused
	$('#catList').on('sn:focused', function(e) {
		console.log("second page row focused ...");

		SECOND_PAGE_ITEM_INDEX = $('#catList li#'+ e.target.id).index();
		$("#catList").addClass("active").removeClass("lastActive");
		
		if (!$(".channel_video_categories_menu_second_page_container").hasClass("active")) moveFocusToRightSide();
		
		if ($(".channel_video_categories_menu_second_page_container").hasClass("active")) {
			if ($("ul#catList").hasClass("active") && $("ul#catList li:nth-last-child(-n+12)").is(":focus") && SECOND_PAGE_ITEM_INDEX > 0  && LOAD_NEXT_PAGE) {
				if (MENU_ID == "CC") totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat']['totalItemCount'];
				else totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video']['totalItemCount'];
				
				call_next_page(totalItemCount, 2);
			}
		}
	});
	
	// When third page focused
	$('#subcatList').on('sn:focused', function(e) {
		console.log("third page row focused ...");

		THIRD_PAGE_ITEM_INDEX = $('#subcatList li#'+ e.target.id).index();
		$("#subcatList").addClass("active").removeClass("lastActive");
		
		if (!$(".channel_third_page_container").hasClass("active")) moveFocusToRightSide();
		
		if ($(".channel_third_page_container").hasClass("active")) {
			if ($("ul#subcatList").hasClass("active") && $("ul#subcatList li:nth-last-child(-n+12)").is(":focus") && THIRD_PAGE_ITEM_INDEX > 0  && LOAD_NEXT_PAGE) {
				totalItemCount = 0;
				
				if (MENU_ID == "CAS") {
					if ($("ul#featuredRow").hasClass("active")) {
						totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'];

					} else if ($("ul#allVideosGrid").hasClass("active")) {
						totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'];
					}

				} else {
					totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['totalItemCount'];
				}
				call_next_page(totalItemCount, 3);
			}
		}
	});

	// When video details page focused
	$('#videoDetails').on('sn:focused', function(e) {
		console.log("video details page focused ...");
		if (!$(".video_details_container").hasClass("active")) moveFocusToRightSide();
	});
	
	// When video details page selected
	$('#videoDetails').on('sn:enter-down', function(e) {
		console.log("video details page selected ...");

		if ($("#videoDescriptionImgBox").is(":focus")) $("#videoDescriptionImgBox").click();
		else console.log("currently focus on description...");
	});
	
	// When first, second and third page selcted
	$('#featuredRow, #allVideosGrid, #catList, #subcatList').on('sn:enter-down', function(e) {
		console.log("First, second or third page item selected ...");
		$("#"+ e.currentTarget.id +" li#"+ e.target.id).click();
	});
	
	// When something press from remote keys
	$(window).keydown(function(evt) {
		var modalName = $(".modal_container").attr("data-modal-name");
		switch(evt.keyCode) {
			case 13:	// Ok
						if ($(".youtube_video_container").hasClass("active")) {
							if (status == 1) {
								Youtube_Player.pauseVideo();
								$(".pause-icon").show();
								$("iframe").contents().find(".ytp-pause-overlay").remove();

							} else if (status == 2) {
								Youtube_Player.playVideo();
								$(".pause-icon").hide();
							}
						} else if ($(".video_container").hasClass("active")) {
							//console.log("VIDEO_PLAYER", VIDEO_PLAYER);
							if (VIDEO_PLAYER != "") {
								if (VIDEO_PLAYER.paused) VIDEO_PLAYER.play();
								else VIDEO_PLAYER.pause();
							}
						
						} else if ($(".search_container").hasClass("active") && !$(".menu_container").hasClass("active")) {
							if (!$('#searchInputText').is(":focus")) $('#searchInputText').focus();
							else if (!$("#searchList").hasClass('active')) request_search_results();
						}
						
						break;

			case 415:	// Play
						if ($(".youtube_video_container").hasClass("active")) {
							console.log('play button');
							if (status == 2	) {
								Youtube_Player.playVideo();
								$(".pause-icon").hide();
							}

						} else if ($(".video_container").hasClass("active")) VIDEO_PLAYER.play();

						break;
			
			case 19:	// Pause 102
						if ($(".youtube_video_container").hasClass("active")) {
							console.log('pause button');
							if (status == 1) {
								Youtube_Player.pauseVideo();
								$(".pause-icon").show();
								$("iframe").contents().find(".ytp-pause-overlay").remove();
							}

						} else if ($(".video_container").hasClass("active")) VIDEO_PLAYER.pause();
						
						break;

			case 412:	// Rewind 82
						rewind_video();
						break;

			case 417:	// FastForward
						forward_video();
						break;
			
			case 461:	// Return key
						SN.resume();
						// Back from menu
						if ($(".menu_container").hasClass("active") && !$(".splash-screen").is(':visible')) {
							console.log("show exit popup...");
							hide_show_modal(true, "EXIT", APP_EXIT_MSG);			
						
						// Return from items to menu
						} else if ($(".cat_container").hasClass("active")) {
							$("#menuList > li").removeClass("menu_border");
							$(".menu_container").addClass("active");
							$(".cat_container").removeClass("active");
							$("ul#featuredRow").removeClass('active');
							$("ul#allVideosGrid").removeClass('active');
							
							$("ul#allVideosGrid").removeAttr('style');
							$("ul#featuredRow").removeAttr('style');

							$(".loader").removeClass("set_loader_center");
							
							manageSlideBetweenChannelMenu();
							SN.focus('menu');
							$("#menuList li:nth-child("+ (FOCUSED_MENU_INDEX + 1) +")").focus();
						
						// Return from search
						} else if ($(".search_container").hasClass("active")) {
							TIME_STAMP = jQuery.now();
							$(".loader, .error_msg").remove();
							$(".search_container").removeClass("active");
							$("#searchList").removeClass("active").removeAttr('style');
							if ($("#searchList").children().length < 1) document.getElementById('searchInputText').value = "";
							document.getElementById('searchInputText').blur();
							$("#menuList > li").removeClass("menu_border");
							$(".menu_container").addClass("active");
							
							manageSlideBetweenChannelMenu();

							SN.focus('menu');
							$("#menuList li:nth-child("+ (FOCUSED_MENU_INDEX + 1) +")").focus();
							
						// Back to channels categories / video categories menu first page from second page
						} else if ($(".channel_video_categories_menu_second_page_container").hasClass("active")) {
							$(".error_msg").remove();
							$(".channel_video_categories_menu_second_page_container").removeClass('active').hide();
							$("#catList").html("").removeClass("active").removeAttr('style');
							$("#catName").text("");
							$(".cat_container").show().addClass("active");
							SN.focus("allVideosGrid");
						
						// Back to channels categories menu third page from second page
						} else if ($(".channel_third_page_container").hasClass("active")) {
							// Back to channels and shows menu first page
							$(".error_msg").remove();
							$("#third_page_header").text('');
							if (MENU_ID == "CAS" && ($("ul#featuredRow").hasClass("active") || $("ul#featuredRow").hasClass("lastActive") || $("ul#allVideosGrid").hasClass("active") || $("ul#allVideosGrid").hasClass("lastActive"))) {
								$(".channel_third_page_container").removeClass("active").hide();
								$(".cat_container").addClass('active').show();
								$("#subcatList").html("").removeClass("active").removeAttr('style');
								if ($("ul#featuredRow").hasClass("active") || $("ul#featuredRow").hasClass("lastActive")) SN.focus("featuredRow");
								else SN.focus("allVideosGrid");
							
							} else {
								$(".channel_third_page_container").removeClass("active").hide();
								$(".channel_video_categories_menu_second_page_container").addClass('active').show();
								$("#subcatList").html("").removeClass("active").removeAttr('style');
								SN.focus("catList");
							}
						
						// Back to items from detials page
						} else if ($(".video_details_container").hasClass("active")) {
							// Back to search results page
							if ($("#searchList").hasClass("active")) {
								$(".video_details_container").removeClass('active').html('');
								$(".search_container").show().addClass("active");
								SN.focus("searchList");

							// Back to second page for channel category and video category menu
							} else if (($("#catList").hasClass("active") || $("#catList").hasClass("lastActive")) && !$("#subcatList").hasClass("active")) {
								$(".video_details_container").removeClass('active').html('');
								$(".channel_video_categories_menu_second_page_container").show().addClass("active");
								SN.focus("catList");
							
							// Back to categories menu third page OR channels and shows menu first page
							} else if (($("#subcatList").hasClass("active") || $("#subcatList").hasClass("lastActive")) || (MENU_ID == "CAS" && (($("ul#featuredRow").hasClass("active") || $("ul#featuredRow").hasClass("lastActive")) || ($("ul#allVideosGrid").hasClass("active") || $("ul#allVideosGrid").hasClass("lastActive"))))) {
								$(".video_details_container").removeClass('active').html('');
								$(".channel_third_page_container").addClass('active').show();
								SN.focus("subcatList");

							// Back to first page
							} else {
								$(".video_details_container").removeClass('active').html('');
								$(".cat_container").show().addClass("active");
								if ($("ul#featuredRow").hasClass("active") || $("ul#featuredRow").hasClass('lastActive')) {
									$("ul#featuredRow li:nth-child("+ (FIRST_PAGE_ITEM_INDEX + 1) +")").focus();
									SN.focus("featuredRow");
								} else SN.focus("allVideosGrid");
							}

						// Return from video screen
						} else if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
							closeVideo();
							

						// Return from video screen
						} else if ($('#youtube_video_container').is(':visible') && $('#youtube_video_container').hasClass('active')) {
							stopVideo();

						// Return from popup to channel list
						} else if ($(".modal_container").hasClass("active")) {
							var modalName = $(".modal_container").attr("data-modal-name");
							// When exit modal selected
							if (modalName == "EXIT") {
								hide_show_modal(false, modalName);

							} else if (modalName == "RETRY_CANCEL") {
								hide_show_modal(false, modalName);
								closeVideo();
							}
						}
						break;
			
			case 37:	// LEFT arrow
						rewind_video();
						break;
				
			case 39:	// RIGHT arrow
						forward_video();
						break;
			
			case 413 :	// Stop button
						if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
							closeVideo();

						} else if ($('#youtube_video_container').is(':visible') && $('#youtube_video_container').hasClass('active')) {
							stopVideo();
						}

						break;
			
			case 40:    //Down key
						if ($("#videoDescriptionContentBox").is(":focus")) {
							SN.pause();
							var scroll = -5;
							scrollUpDown(scroll);
						}
						break;

			case 38:    //Up key
						if ($("#videoDescriptionContentBox").is(":focus")) {
                            var top = $('.video_description').position().top;
	                        var textTop = $('#videoDescriptionContent').position().top;
	                        if (top == textTop){
	                        	SN.resume();
	                        	SN.focus('videoDetails');
	                        	$("#videoDescriptionImgBox").focus();
	                        }
							var scroll = 5;
							scrollUpDown(scroll);
						}
						break;
				
			default:	console.log("Key code : " + evt.keyCode);
						break;
		}
	});
});