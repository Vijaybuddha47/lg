function manage_spatial_navigation(containerClass, favoriteStatus, vodId) {
    FAVORITE_STATUS = favoriteStatus;
    FAVORITE_VIDEO_ID = vodId;
    switch (containerClass) {
        case "menu_container":
            set_focus('menuList', 'menu0');

            // When menu foucs
            $('#menuList').on('sn:focused', function (e) {
                console.log("menu focused ...");
                FOCUSED_MENU_INDEX = $('#' + e.target.id).closest('li').index();

                $("#menuList > li").removeClass("menu_border");
                $(".menu_container").addClass("active");
                $(".live_page_container, #liveList, [id=movieList], .logout_page_container, .video_details_page_container, .search_box").removeClass("active");

                set_search_default_ui();
                turn_off_list_item_overlay();

            });

            $('#menuList').on('sn:enter-down', function (e) {
                console.log("menu selected ...");
                SELECTED_MENU_INDEX = $('#' + e.target.id).closest('li').index();
                console.log("SELECTED_MENU_INDEX  ", SELECTED_MENU_INDEX);
                $("ul#menuList li:nth-child(" + (SELECTED_MENU_INDEX + 1) + ")").click();
            });
            break;

        case "live_page_container":
            set_focus('liveList', 'live_menu_item_0');
            set_search_focus();

            $('#liveList').on('sn:focused', function (e) {
                console.log("liveList focused ...");
                CAT_ITEM_INDEX = CHANNEL_ITEM_INDEX = CURRENT_ITEM_INDEX = $('#' + e.target.id).closest('li').index();
                $(".custom_control_container").hide();

                $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
                $(".menu_container, .video_container, .search_box").removeClass("active");
                $("." + containerClass + ", #liveList").addClass("active");

                set_search_default_ui();
                turn_off_list_item_overlay();
                turn_on_list_item_overlay(e.target.id);
            });

            $('#liveList').on('sn:enter-down', function (e) {
                console.log("liveList selected ...");
                $("ul#liveList li:nth-child(" + (CAT_ITEM_INDEX + 1) + ")").click();
            });

            break;

        case "live_channel_list_container":
            set_focus('live_channel_list', 'channel_number_0');

            // When menu foucs
            $('#live_channel_list').on('sn:focused', function (e) {
                if (!$('.channel_list_container').hasClass('toggle_channel_list')) {
                    SN.focus("#video_container");
                } else {
                    console.log("channel list focused ...");
                    $(".custom_control_container").hide();
                    var index = $('#' + e.target.id).closest('li').index();
                    console.log(index);

                    clearTimeout(TIME_OUT_SECOND);
                    TIME_OUT_SECOND = setTimeout(function () {
                        $('.channel_list_container').removeClass('toggle_channel_list');
                        SN.focus("#video_container");
                    }, 10000);
                }

            });

            $("#live_channel_list").on('sn:enter-down', function (e) {
                console.log("channel list enter ...");
                $("#" + e.target.id).click();
            });
            break;

        case "movie_page_container":
            SN.remove("[id^=movieList]");
            SN.add({
                id: '[id^=movieList]',
                selector: '[id^=movieList] .focusable',
                defaultElement: '#movie_item_0_0',
                enterTo: 'last-focused'
            });
            SN.makeFocusable();

            set_search_focus();

            $('[id^=movieList]').on('sn:focused', function (e) {
                console.log("movieList focused ...");
                var elementId = e.target.id;
                CAT_ROW_INDEX = $('#' + elementId).attr('data-row');
                CAT_ITEM_INDEX = $('#' + elementId).closest('li').index();

                $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
                $(".menu_container, .search_box, [id=movieList]").removeClass("active");
                $("." + containerClass + " #movieList" + CAT_ROW_INDEX).addClass("active");
                $("." + containerClass).addClass("active");

                set_search_default_ui();
                turn_off_list_item_overlay();
                turn_on_list_item_overlay(elementId);
            });

            $('[id^=movieList]').on('sn:enter-down', function (e) {
                console.log("movieList selcted ...");
                $("ul#movieList" + CAT_ROW_INDEX + " li:nth-child(" + (CAT_ITEM_INDEX + 1) + ")").click();
            });

            break;

        case "seasons_page_container":
            set_focus('seasonsList', 'seasons_item_0');
            SN.focus("seasonsList");

            $(".episode_listbox li:nth-child(1)").find('.thumbnail_overlay').css('display', 'table');

            $('#seasonsList').on('sn:focused', function (e) {
                console.log("seasons List focused ...");
                var elementId = e.target.id;
                SEASONS_ITEM_INDEX = $('#' + elementId).closest('li').index();

                $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
                $(".menu_container, #seasonsList").removeClass("active");
                $("." + containerClass + ", #seasonsList").addClass("active");

                turn_off_list_item_overlay();
                turn_on_list_item_overlay(elementId);
            });

            $('#seasonsList').on('sn:enter-down', function (e) {
                console.log("seasonsList selcted ...");
                $("ul#seasonsList li:nth-child(" + (SEASONS_ITEM_INDEX + 1) + ")").click();
            });
            break;

        case "episode_page_container":
            set_focus('episodeList', 'episode_item_0');
            SN.focus("episodeList");

            $(".episode_listbox li:nth-child(1)").find('.thumbnail_overlay').css('display', 'table');

            $('#episodeList').on('sn:focused', function (e) {
                console.log("movieList focused ...");
                var elementId = e.target.id;
                EPISODE_ITEM_INDEX = $('#' + elementId).closest('li').index();

                $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
                $(".menu_container, #episodeList").removeClass("active");
                $("." + containerClass + ", #episodeList").addClass("active");

                turn_off_list_item_overlay();
                turn_on_list_item_overlay(elementId);
            });

            $('#episodeList').on('sn:enter-down', function (e) {
                console.log("episodeList selcted ...");
                $("ul#episodeList li:nth-child(" + (EPISODE_ITEM_INDEX + 1) + ")").click();
            });

            break;

        case "logout_page_container":
            set_focus('logoutButtonContainer', 'loginButton');

            $('#logoutButtonContainer').on('sn:focused', function (e) {
                console.log("Logout page focused ...");
                $(".menu_container").removeClass("active");
                $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
                $("." + containerClass).addClass("active");
            });

            $('#logoutButtonContainer').on('sn:enter-down', function (e) {
                console.log("logoutButton selcted ...");
                $("#loginButton").click();
            });

            break;

        case "video_details_page_container":
            set_focus('videoDetailsPageIcons', 'playIcon');
            SN.focus("videoDetailsPageIcons");

            $('#videoDetailsPageIcons').on('sn:focused', function (e) {
                console.log("Video details page focused ...");
                $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");

                $(".custom_control_container").hide();
                $(".menu_container, .video_container").removeClass("active");
                $(".video_details_page_container").addClass("active");
            });

            $('#videoDetailsPageIcons').on('sn:enter-down', function (e) {
                console.log("videoDetails selcted ...", e.target.id);
                $("#" + e.target.id).click();
            });

            break;

        case "EXIT":
            set_focus('exitModal', 'noButton');
            SN.focus("exitModal");
            $('#exitModal').off('sn:enter-down');
            $('#exitModal').on('sn:enter-down', function (e) {
                console.log("exitModal sn:enter-down");
                $("#" + e.target.id).click();
            });
            break;

        case "LOGOUT":
            set_focus('exitModal', 'noButton');
            SN.focus("exitModal");
            $('#exitModal').off('sn:enter-down');
            $('#exitModal').on('sn:enter-down', function (e) {
                console.log("exitModal sn:enter-down");
                $("#" + e.target.id).click();
            });
            break;

        case "RETRY_CANCEL":
            set_focus('retryModal', 'retryButton');
            SN.focus("retryModal");

            $('#retryModal').off('sn:enter-down');
            $('#retryModal').on('sn:enter-down', function (e) {
                console.log("retryModal sn:enter-down");
                $("#" + e.target.id).click();
            });
            break;

        case "epg_icon_container":
            set_focus('epgIcons', 'dvr');
            $('#epgIcons').on('sn:enter-down', function (e) {
                console.log("epgIcons sn:enter-down");
                if ($('#dvr').is(":focus")) {
                    console.log('open All EPG..');
                    $('#dvr').click();
                }
            });
            break;

        case "channel_number_container":
            set_focus('channel_number_container', 'search_channel_number');

            $('#channel_number_container').on('sn:focused', function (e) {
                console.log("channel search input box focus.");
                clearTimeout(TIME_OUT_FIRST);
                TIME_OUT_FIRST = setTimeout(function () {
                    hide_channel_input_box();
                }, 2000);
            });

            $('#channel_number_container').on('sn:enter-down', function (e) {
                console.log("channel search input box enter.");
                play_live_by_channel_number();
            });
            break;

        case "language_option":
            set_focus('language_option', 'language_0');

            $('#language_option').on('sn:focused', function (e) {
                console.log("language_option focus.");
                $(".custom_control_container").show();
                show_hide_programme_details_after_specific_time();
            });

            $('#language_option').on('sn:unfocused', function (e) {
                console.log("language_option unfocus.");
                $('#language_option').hide();
            });

            $('#language_option').on('sn:enter-down', function (e) {
                console.log("language_option enter.");
                $('#language_option').hide();
                SN.focus("#customAudio");
                // var index = Number($("#" + e.target.id).attr("data-value"));
                // webapis.avplay.setSelectTrack('AUDIO', index);
            });
            break;

        case "custom_control_container":
            set_focus('customControls', 'customHome');

            $('#customControls').on('sn:focused', function (e) {
                console.log("customControls focus.");
                CURRENT_ITEM_INDEX = CHANNEL_ITEM_INDEX;
                $(".custom_control_container").show();
                changeProgrammeDetails();
                $('.channel_list_container').removeClass('toggle_channel_list');
                show_hide_programme_details_after_specific_time();
            });

            $('#customControls').on('sn:enter-down', function (e) {
                console.log("customControls enter.");
                $("#" + e.target.id).click();
            });

            break;

        case "programme_details":
            set_focus('programme_details', 'customLeft');

            $('#programme_details').on('sn:focused', function (e) {
                console.log("programme_details focus.");
                $(".custom_control_container").show();
                show_hide_programme_details_after_specific_time();
            });

            $('#programme_details').on('sn:enter-down', function (e) {
                console.log("programme_details enter.");
                $("#" + e.target.id).click();
            });

            break;

    }
}

function set_search_focus() {
    var prefix = get_search_id_prefix();
    set_focus(prefix + 'Searchbox', prefix + 'SearchButton');
    set_focus(prefix + 'SearchInputBox', prefix + 'SearchInput');

    $('#' + prefix + 'Searchbox, #' + prefix + 'SearchInputBox').on('sn:focused', function (e) {
        console.log(prefix + 'Searchbox focused ...');
        $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");

        turn_off_list_item_overlay();
        $(".search_box").addClass("active");
        $(".menu_container, .live_page_container, #liveList, [id=movieList], .logout_page_container, .video_details_page_container").removeClass("active");
    });

    $('#' + prefix + 'Searchbox').on('sn:enter-down', function (e) {
        prefix = get_search_id_prefix();
        console.log(prefix + 'Searchbox enter-down ...');
        $("#" + prefix + "SearchButton").click();
    });
}

function set_focus(containerId, itemId) {
    var restrictVal = "self-first";
    if (containerId == "EXIT" || containerId == "RETRY_CANCEL") restrictVal = "self-only";

    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        restrict: restrictVal,
        defaultElement: '#' + itemId,
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
}

function set_search_default_ui() {
    var prefix = get_search_id_prefix();
    $('#' + prefix + 'SearchInputBox').hide();
    $('#' + prefix + 'Searchbox').show();
}