function set_menu() {
    var str = '',
        classFocused = '',
        containerClass = 'menu_container',
        totalMenu = MENU_ARRAY.length;

    if (totalMenu > 0) {
        for (var i = 0; i < totalMenu; i++) {
            var iconClass = (create_menu_icon_class(MENU_ARRAY[i]['name']) + "_icon").toLowerCase(),
                menuBorderClass = '',
                tabindex = 0,
                leftFocus = '',
                rightFocus = '',
                downFocus = '',
                upFocus = ' data-sn-up="null"';

            // Actual Menu
            if (i == 0) {
                leftFocus = ' data-sn-left="null"';
                menuBorderClass = 'menu_border';
            }

            if (i == (totalMenu - 1)) rightFocus = ' data-sn-right="null"';

            str += '<li class="focusable ' + menuBorderClass + '" tabindex="' + tabindex + '" id="menu' + i + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>';
            str += '<span class="menu_icon ' + iconClass + '" id="menu_icon_' + i + '"></span><span class="menu_title" id="menu_title_' + i + '">' + MENU_ARRAY[i]['name'] + '</span>';
            str += '</li>';
        }

        $("#menuList").html(str);
        addEventListeners();
        $("." + containerClass).addClass("active");

        manage_spatial_navigation(containerClass);
        SN.focus("menuList");

        TIME_STAMP = Date.now();
        parse_data(TIME_STAMP);
    }
}

function create_menu_icon_class(menuName) {
    if (menuName == undefined && menuName == "") return "";
    return menuName.replace(/[ /]/g, "_");
}


function parse_data(timestamp) {
    $("#loader").show();
    $(".live_page_container, .movie_page_container, #liveList, .video_details_page_container, .logout_page_container, .seasons_page_container, .episode_page_container").html("").show();
    $("#pageTitle").text("");
    $(".no-record-box").remove();

    var param = { memberId: localStorage.getItem('memberId') };
    if (SELECTED_MENU_INDEX == 0) {
        url = LIVE_MENU_API;
        param.keyword = "";
        param.sort = 0;
        param.isFav = false;

    } else if (SELECTED_MENU_INDEX == 1 || SELECTED_MENU_INDEX == 2) {
        url = MOVIES_AND_SHOWS_MENU_API;
        if (SELECTED_MENU_INDEX == 1) param.type = 0;
        else if (SELECTED_MENU_INDEX == 2) param.type = 1;
    }
    selected_menu_list();
    console.log(param, jQuery.param(param), url);
    $.ajax({
        type: "GET",
        url: url,
        data: jQuery.param(param),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "JSON",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (json) {
            console.log(json);
            if (timestamp == TIME_STAMP) {
                if (SELECTED_MENU_INDEX == 0) set_home_menu_data(json);
                else if (SELECTED_MENU_INDEX == 1 || SELECTED_MENU_INDEX == 2) set_movies_and_shows_menu_data(json);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            if (timestamp == TIME_STAMP) {
                if (SELECTED_MENU_INDEX == 0) set_home_menu_data({});
                else if (SELECTED_MENU_INDEX == 1 || SELECTED_MENU_INDEX == 2) set_movies_and_shows_menu_data({});
            }
        }
    });
}

function set_home_menu_data(json) {
    $(".live_page_container").show();
    CAT_ARRAY[SELECTED_MENU_INDEX] = new Array();

    var j = 0,
        str = "",
        tabindex = 1,
        leftFocus = '',
        rightFocus = '',
        downFocus = '',
        upFocus = '',
        containerClass = "live_page_container";

    if (_.size(json) > 0) {
        if (json.result == 200) {
            if (json.channels.length > 0) {
                // CAT_ARRAY[SELECTED_MENU_INDEX] = json.channels;

                //str +=	'<div class="page_title" id="pageTitle">'+ MENU_ARRAY[SELECTED_MENU_INDEX]['name'] +'</div>'
                str += search_html(tabindex);
                str += '<div class="live_list_container">'
                str += '<ul class="live_list" id="liveList">'

                for (i = 0; i < json.channels.length; i++) {
                    if (json.channels[i]['has_access']) {
                        CAT_ARRAY[SELECTED_MENU_INDEX][j] = json.channels[i];
                        rightFocus = "";
                        leftFocus = "";
                        if (i == (json.channels.length - 1)) rightFocus = ' data-sn-right="null"';

                        leftFocus = "";
                        if (j == 0) leftFocus = ' data-sn-left="null"';

                        str += '<li class="visible focusable" tabindex="' + tabindex + '" id="live_menu_item_' + j + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>'
                        str += '<div class="item_img_container" id="live_menu_item_img_container_' + j + '">';
                        str += '<img src="' + IMG_PATH + json.channels[i]['image'] + '" class="item_img" id="live_menu_item_img_' + j + '">';
                        str += set_overlay_on_list_item(json.channels[i]['name'], containerClass, 0, j);
                        str += '</div>';
                        str += '</li>';

                        j++;
                    }
                }
                str += '</ul>';
                str += '</div>';

                $("." + containerClass).html(str);
                $("#loader").hide();
                addEventListeners();

                manage_spatial_navigation(containerClass);
                set_live_channel_list();
            } else {
                $("#loader").hide();
                console.log("set_home_menu_data, no chennels");
                set_error_message(containerClass, tabindex);
            }

        } else {
            $("#loader").hide();
            console.log("set_home_menu_data, status is not 200");
            set_error_message(containerClass, tabindex);
        }
    } else {
        $("#loader").hide();
        console.log("set_home_menu_data, there is 0 items");
        set_error_message(containerClass, tabindex);
    }
}

function set_movies_and_shows_menu_data(json) {
    $(".live_page_container").hide();
    CAT_ARRAY[SELECTED_MENU_INDEX] = new Array();
    var str = "",
        img = "",
        totalRow = 0,
        totalItem = 0,
        tabindex = 1,
        leftFocus = '',
        rightFocus = '',
        downFocus = '',
        upFocus = '',
        counter = 0,
        name = "",
        containerClass = "movie_page_container";

    if (_.size(json) > 0) {
        if (json.result == 200) {
            totalRow = json.vods.length;
            if (totalRow > 0) {
                str += search_html(tabindex);
                str += '<div class="movie_container_box">';

                for (i = 0; i < totalRow; i++) {
                    if (SELECTED_MENU_INDEX == 1) obj = json.vods[i]['movies'];
                    else obj = json.vods[i]['shows'];

                    totalItem = obj.length;
                    if (totalItem > 0) {
                        CAT_ARRAY[SELECTED_MENU_INDEX][counter] = new Array();
                        CAT_ARRAY[SELECTED_MENU_INDEX][counter] = obj;
                        CAT_ARRAY[SELECTED_MENU_INDEX][counter]['category_name'] = json.vods[i]['category_name'];

                        str += '<div class="movie_container">';
                        str += '<div class="movie_titlebox">' + json.vods[i]['category_name'] + '</div>';
                        str += '<div class="listbox_movie">';
                        str += '<ul class="movie_list" id="movieList' + counter + '">';

                        for (j = 0; j < totalItem; j++) {
                            rightFocus = "";
                            if (j == (totalItem - 1)) rightFocus = ' data-sn-right="null"';

                            leftFocus = "";
                            if (j == 0) leftFocus = ' data-sn-left="null"';

                            name = "";
                            if (SELECTED_MENU_INDEX == 1) name = obj[j]['name'];
                            else name = obj[j]['show_name'];

                            img = IMG_PATH + obj[j]['image'];
                            str += '<li class="visible focusable" data-row="' + counter + '" tabindex="' + tabindex + '" id="movie_item_' + i + '_' + j + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>';
                            str += '<div class="movie_imgbox" id="movie_item_imgbox_' + i + '_' + j + '">';
                            str += '<img src="' + img + '" class="img_movie" id="movie_item_img_' + i + '_' + j + '">';
                            str += set_overlay_on_list_item(name, containerClass, i, j);
                            str += '</div>';
                            str += '</li>';
                        }

                        str += '</ul>';
                        str += '</div>';
                        str += '</div>';

                        if (totalRow == i + 1)
                            str += '</div>';

                        $("." + containerClass).html(str);
                        addEventListeners();
                        counter++;
                    }
                }

                $("#loader").hide();

                manage_spatial_navigation(containerClass);

            } else {
                $("#loader").hide();
                console.log("set_movies_and_shows_menu_data, no rows");
                set_error_message(containerClass, tabindex);
            }


        } else {
            $("#loader").hide();
            console.log("set_movies_and_shows_menu_data, status is not 200");
            set_error_message(containerClass, tabindex);
        }

    } else {
        $("#loader").hide();
        console.log("set_movies_and_shows_menu_data, there is 0 items");
        set_error_message(containerClass, tabindex);
    }
}

function set_shows_seasons_episodes(viewType) {
    var param = { showId: CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['show_id'] },
        containerClass = "",
        tabindex = 0,
        str = "",
        leftFocus = '',
        rightFocus = '',
        downFocus = '',
        upFocus = '',
        nav = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX]['category_name'] + ' <img src="images/episode_arrow_icon.png"> ' + CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['show_name'],
        thumbnail = "",
        thumbnailTitle = "",
        totalItem = 0;

    if (viewType == "seasons") {
        $(".movie_page_container").hide();
        $(".movie_page_container, [id=movieList]").removeClass("active");
        CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'] = {};
        tabindex = 2;
        containerClass = "seasons_page_container";

    } else {
        $(".movie_page_container, .seasons_page_container").hide();
        $(".movie_page_container, [id=movieList], .seasons_page_container, #seasonsList").removeClass("active");
        CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['episodes'] = {};

        param.season = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['season'];
        tabindex = 3;
        containerClass = "episode_page_container";

    }
    $("#loader").show();

    $.ajax({
        type: "POST",
        url: SHOWS_EPISODE_API,
        dataType: "JSON",
        data: jQuery.param(param),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (json) {
            if (json.result == 200) {
                if (viewType == "seasons") {
                    totalItem = json.seasons.length;
                    CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'] = json.seasons;

                } else {
                    totalItem = json.vods.length;
                    CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['episodes'] = json.vods;
                    nav += ' <img src="images/episode_arrow_icon.png"> Season ' + CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['season'];
                }

                if (totalItem > 0) {
                    str = '<div class="episode_navigation_path"> ' + nav + '</div>';

                    str += '<div class="episode_innercontainer">';
                    str += '<ul class="episode_listbox" id="' + viewType + 'List">';
                    for (i = 0; i < totalItem; i++) {
                        rightFocus = "";
                        leftFocus = "";
                        if (i == (totalItem - 1)) rightFocus = ' data-sn-right="null"';

                        leftFocus = "";
                        if (i == 0) leftFocus = ' data-sn-left="null"';

                        if (viewType == "seasons") {
                            thumbnail = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['image'];
                            thumbnailTitle = "Season " + json.seasons[i]['season'];

                        } else {
                            thumbnail = json.vods[i]['image'];
                            thumbnailTitle = json.vods[i]['name'];
                        }

                        str += '<li class="episode_img focusable visible" tabindex="' + tabindex + '" id="' + viewType + '_item_' + i + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>'
                        str += '<div class="episode_img" id="' + viewType + '_item_imgbox_' + i + '">';
                        str += '<img src="' + IMG_PATH + thumbnail + '" class="img_episode" id="' + viewType + '_item_img_' + i + '">';
                        str += set_overlay_on_list_item(thumbnailTitle, containerClass, 0, i);
                        str += '</div>';
                        str += '</li>';
                    }
                    str += '</ul>';
                    str += '</div>';

                    $("." + containerClass).html(str).addClass('active').show();
                    addEventListeners();
                    $("#" + viewType + "List").addClass('active');
                    $("#loader").hide();

                    manage_spatial_navigation(containerClass);

                } else {
                    console.log("season error.");
                    set_error_message(containerClass, tabindex);
                }

            } else {
                console.log("season error.");
                set_error_message(containerClass, tabindex);
            }

        },
        error: function (xhr, error) {
            console.log('season error', xhr, error);
            set_error_message(containerClass, tabindex);
        }
    });
}

function set_logout_menu_data() {
    $("#loader").hide();
    $(".live_page_container, .movie_page_container, #liveList, .video_details_page_container, .seasons_page_container, .episode_page_container").html("").show();
    $("#pageTitle").text("");
    $(".no-record-box").remove();

    var str = '',
        containerClass = "logout_page_container";

    str += '<div class="logout_containerbox">';
    str += '<div class="logout_screen" id="logoutButtonContainer">';
    str += '<div class="logout_para">Bienvenidos ' + localStorage.getItem('email') + '</div>';
    str += '<div class="logout_btn button_box focusable" id="loginButton" tabindex="1" data-sn-right="null" data-sn-left="null" data-sn-down="null">Salir</div>';
    str += '</div>';
    str += '</div>';

    $("." + containerClass).html(str);
    addEventListeners();

    manage_spatial_navigation(containerClass);
}

// get video detail page OR play video
function get_video_details(id, playVodFlag) {
    var url = "",
        param = { memberId: localStorage.getItem('memberId'), token: localStorage.getItem('token'), box: "yes" },
        videoTitle = "";

    // when video play
    if (playVodFlag) {
        VOD_URL = "";
        show_hide_video_container();
        // For live menu only
        if (SELECTED_MENU_INDEX == 0) {
            parse_epg("singleEpg");
        }

        // when video details page open
    } else {
        var obj = "";
        // when Movies menu
        if (SELECTED_MENU_INDEX == 1) {
            obj = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX];

            // when shows menu 
        } else if (SELECTED_MENU_INDEX == 2) {
            obj = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['episodes'][EPISODE_ITEM_INDEX];
        }

        var img = IMG_PATH + obj['image'],
            title = obj['name'],
            description = obj['description'],
            favorite = 0;

        $(".movie_page_container, .episode_page_container").hide();
        $("#loader").show();
    }

    // when live menu
    if (SELECTED_MENU_INDEX == 0) {
        url = AUTHENTICATE_LIVE_API;
        param.channelId = id;

        // when rest menu
    } else {
        url = AUTHENTICATE_VOD_API;
        param.vodId = id;
    }

    $.ajax({
        type: "GET",
        url: url,
        data: param,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "JSON",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (json) {
            //console.log(json);
            localStorage.setItem('token', json.token);

            // when video play
            if (playVodFlag) {
                // for live menu
                if (SELECTED_MENU_INDEX == 0) {
                    VOD_URL = json.channel.stream_url;
                    videoTitle = json.channel.name;
                } else {
                    VOD_URL = json.vod.stream_url;
                    videoTitle = json.vod.name;
                }
                $(".video-title").text(videoTitle);
                load_video();

                // when video details page open
            } else {
                img = IMG_PATH + json.vod.image;
                title = json.vod.name;
                description = json.vod.description;
                favorite = json.vod.favorite;
                set_video_details_page(img, title, description, favorite, id);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("get_video_details error", xhr);
            if (playVodFlag) load_video();
            else set_video_details_page(img, title, description, favorite, id);
        }
    });
}

function set_video_details_page(img, title, description, favoriteStatus, id) {
    var str = "",
        favoriteImg = FAVORITE_IMG,
        favoriteText = FAVORITE_TEXT,
        containerClass = "video_details_page_container";

    if (favoriteStatus) {
        favoriteImg = FAVORITE_FOCUSED_IMG;
        favoriteText = FAVORITE_FOCUSED_TEXT;
    }

    str = '<img src="' + img + '" class="movie_detailbox">';
    str += '<div class="movie_detail_panelbox">';
    str += '<img src="' + img + '" class="movie_detailimg">';
    str += '<h4 class="movie_titleview">' + title + '</h4>';
    str += '<p>' + description + '</p>';
    str += '<ul class="movie_listbox" id="videoDetailsPageIcons">';
    str += '<li id="playIcon" class="focusable" tabindex="4" data-sn-right="#favIcon" data-sn-left="null" data-sn-down="null">';
    str += '<a id="playAnchor"><img src="images/play_icon.png" class="play_icon" id="playImg"><span class="addtofav" id="playIconText">Reproducir</span><a/>';
    str += '</li>';
    str += '<li id="favIcon" class="focusable fav-icon" tabindex="4" data-sn-right="null" data-sn-left="#playIcon" data-sn-down="null">';
    str += '<a id="favAnchor"><img src="' + favoriteImg + '" class="star_icon" id="favIconImg"><span class="addtofav" id="favText">' + favoriteText + '</span></a>';
    str += '</li>';
    str += '</ul>';
    str += '</div>';

    $("#loader").hide();
    $(".movie_page_container, [id^=movieList], .menu_container, .episode_page_container, #episodeList").removeClass("active");
    $("." + containerClass).html(str).addClass("active");
    addEventListeners();

    manage_spatial_navigation(containerClass, favoriteStatus, id);
}

function add_remove_favorite(id, favoriteStatus) {
    $.ajax({
        type: "POST",
        url: FAVORITE_API,
        data: jQuery.param({ content_id: id, member_id: localStorage.getItem('memberId'), status: favoriteStatus }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "JSON",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (json) {
            var favoriteImg = FAVORITE_IMG,
                favoriteText = FAVORITE_TEXT;

            if (favoriteStatus) {
                favoriteImg = FAVORITE_FOCUSED_IMG;
                favoriteText = FAVORITE_FOCUSED_TEXT;
            }

            $("#favIconImg").attr('src', favoriteImg);
            $("#favText").text(favoriteText);

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Error in favorite API and status is", favoriteStatus);
        }
    });
}

function set_error_message(containerClass, tabindex) {
    $("#loader").hide();
    str = '<div class="no-record-box" id="noRecordMsg"><div class="no_record focusable" id="noRecordMsgText" tabindex="' + tabindex + '">' + EMPTY_CATSET + '</div></div>';

    $("." + containerClass).append(str);

    if (containerClass == "episode_page_container" || containerClass == "seasons_page_container") {
        $("." + containerClass).addClass("active");
        $(".menu_container").removeClass("active");
        $("#menuList li:nth-child(" + (SELECTED_MENU_INDEX + 1) + ")").addClass("menu_border");

        SN.remove("noRecordMsg");
        SN.add({
            id: 'noRecordMsg',
            selector: '#noRecordMsg .focusable',
            defaultElement: '#noRecordMsgText',
            restrict: 'self-only',
            enterTo: 'last-focused'
        });
        SN.makeFocusable();
        SN.focus('noRecordMsg');
    }
}

// Open video screen
function show_hide_video_container() {
    $(".main_container").hide();
    $("#video_container").show();
}

// Open error popup when error will occur during video playing.
function retry_error_popup() {
    var onlineStatus = navigator.onLine,
        msg = "";
    $("#epgListContainer").html('');
    $(".epg_icon_container").hide();

    $(".epg_icon_container").hide();
    show_hide_video_next_previous(false);

    if (onlineStatus) msg = PLAYER_ERR;
    else msg = NET_CONNECTION_ERR;

    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
        if (msg != "" && onlineStatus) msg = msg;
        hide_show_modal(true, 'RETRY_CANCEL', msg);
    }
}

//This function is used for display two digit number from 1-9
function min_two_digits(number) {
    return (number < 10 ? '0' : '') + number;
}

function set_live_channel_list() {
    console.log("set_live_channel_list");

    var str = "",
        channelLength = _.size(CAT_ARRAY[SELECTED_MENU_INDEX]);
    tabindex = 10,
        leftFocus = '',
        rightFocus = '',
        downFocus = '',
        upFocus = '',
        activeChannel = '',
        containerClass = "live_channel_list_container";

    if (channelLength > 0) {

        for (i = 0; i < channelLength; i++) {
            if (CAT_ARRAY[SELECTED_MENU_INDEX][i]) {
                rightFocus = "";
                leftFocus = "";
                var j = i + 1;

                if (i == (channelLength - 1)) downFocus = ' data-sn-down="null"';
                else downFocus = ' data-sn-down="#channel_number_' + (i + 1) + '"';

                upFocus = "";
                if (i == 0) upFocus = ' data-sn-up="null"';
                else upFocus = ' data-sn-up="#channel_number_' + (i - 1) + '"';

                // activeChannel = '';
                // if (i == 0) activeChannel = "blued_img";

                str += '<li class="visible focusable" tabindex="' + tabindex + '" id="channel_number_' + i + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>'
                str += j + ' <img class="channel_list_image" src="' + IMG_PATH + CAT_ARRAY[SELECTED_MENU_INDEX][i]['image'] + '"><span class="video_title">' + CAT_ARRAY[SELECTED_MENU_INDEX][i]['name'] + '</span>'
                str += '</li>';
            }
        }
        $("." + containerClass).html('');
        $("." + containerClass).append(str);
        manage_spatial_navigation(containerClass);
        addEventListeners();
    } else {
        console.log("Hide vertical channel list");
    }
}

function show_channel_list() {
    if (SELECTED_MENU_INDEX == 0) {
        console.log("show_channel_list");
        $("ul.live_channel_list_container li").removeClass("blued_img");
        $("#channel_number_" + (CHANNEL_ITEM_INDEX)).addClass("blued_img");
        $('.channel_list_container').addClass('toggle_channel_list');
        SN.focus("#channel_number_" + (CHANNEL_ITEM_INDEX));
    }

}


// Login Process
function loginIntoApp(page) {
    $(".error_overlay").css({ "display": "none" });
    if (page == "login") $(".login_loader").css({ "display": "inline-table" });

    var date = new Date(),
        un = "",
        pwd = "",
        modalName = "";

    if (page == "login") {
        un = document.getElementById('username').value;
        pwd = document.getElementById('password').value;
    } else {
        un = localStorage.getItem('username');
        pwd = localStorage.getItem('password');
    }

    webOS.deviceInfo(function (device) {
        //console.log(device.modelName);
        modalName = device.modelName;
        $.ajax({
            type: "POST",
            url: LOGIN_API,
            dataType: "JSON",
            data: jQuery.param({ user: un, pw: calcMD5(pwd), sn: modalName, device_name: "Webos", push_token: "", login_type: "email", user_timezone: date.getTimezoneOffset() }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            async: true,
            cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (json) {
                console.log(json);
                if (page == "login") $(".login_loader").hide();

                if (json.result == 200) {
                    localStorage.setItem('username', un);
                    localStorage.setItem('password', pwd);
                    localStorage.setItem('token', json.token);
                    localStorage.setItem('memberId', json.userInfo.member_id);
                    localStorage.setItem('email', json.userInfo.email);
                    localStorage.setItem('timezoneDifference', json.timezone_difference);
                    window.location.href = "home.html";

                } else {
                    if (page == "login") hideShowError(json.message);
                    else window.location.href = "login.html";
                    console.log("login error.");
                }

            },
            error: function (xhr, error) {
                console.log(xhr, error);
                if (page == "login") {
                    $(".login_loader").hide();
                    hideShowError(xhr.statusText);
                } else {
                    window.location.href = "login.html";
                }
            }
        });
    });
}

// It returns current vod object while playing video
function get_video_obj() {
    var obj = "";
    switch (SELECTED_MENU_INDEX) {
        case 0:
            obj = CAT_ARRAY[SELECTED_MENU_INDEX];
            break;

        case 1:
            obj = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX];
            break;

        case 2:
            obj = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ROW_INDEX][CAT_ITEM_INDEX]['seasons'][SEASONS_ITEM_INDEX]['episodes'];
            break;
    }

    return obj;
}

function set_overlay_on_list_item(thumbnailTitle, containerClass, rowIndex, itemIndex) {
    var movieOveryClass = "",
        movieOverlayText = "",
        title = "",
        overlayId = containerClass.replace("_container", '');

    if (containerClass == "movie_page_container") overlayId += "_row_" + rowIndex + "_item_" + itemIndex;
    else overlayId += "_item_" + itemIndex;

    overlayId += "_overlay";

    if (containerClass == "movie_page_container" || containerClass == "episode_page_container" || containerClass == "seasons_page_container") {
        movieOveryClass = "movie_overlay";
        movieOverlayText = "movie_overlay_text";
    }

    if (thumbnailTitle != undefined && thumbnailTitle != "") {
        title = thumbnailTitle;
    }

    return '<div class="thumbnail_overlay ' + movieOveryClass + '" id="' + overlayId + '_container"><span class="thumbnail_overlay_text_container" id="' + overlayId + '_text_container"><span class="thumbnail_overlay_text ' + movieOverlayText + '" id="' + overlayId + '_text">' + title + '</span></span></div>';
}

function turn_on_list_item_overlay(elementId) {
    $('#' + elementId).find('.thumbnail_overlay').css('display', 'table');
}

function turn_off_list_item_overlay() {
    $('.thumbnail_overlay').css('display', 'none');
}

function search_html(tabindex) {
    var prefix = get_search_id_prefix(),
        menuName = MENU_ARRAY[SELECTED_MENU_INDEX]['name'],
        str = "";

    str = '<div class="search_box">';
    str += '<div class="search_input_container" id="' + prefix + 'Searchbox">';
    str += '<div class="search_input focusable" id="' + prefix + 'SearchButton" tabindex="' + tabindex + '" data-sn-left="null" data-sn-right="null">';
    str += '<div id="' + prefix + 'SearchText">Buscar ' + menuName + '</div>';
    str += '</div>';
    str += '</div>';
    str += '<div class="search_input_container" id="' + prefix + 'SearchInputBox" style="display:none;">';
    str += '<input type="text" placeholder="Buscar ' + menuName + '" class="search_input focusable" id="' + prefix + 'SearchInput" tabindex="' + tabindex + '" data-sn-left="null" data-sn-right="null">';
    str += '</div>';
    str += '</div>';

    return str;
}

function get_search_id_prefix() {
    var prefix = "";
    switch (SELECTED_MENU_INDEX) {
        case 0:
            prefix = "live";
            break;
        case 1:
            prefix = "movies";
            break;
        case 2:
            prefix = "shows";
            break;
    }
    return prefix;
}

function get_search_input_value() {
    var prefix = get_search_id_prefix();
    return $("#" + prefix + "SearchInput").val();
}

// set search text in hidden div
function set_search_text() {
    var prefix = get_search_id_prefix(),
        searchText = get_search_input_value(),
        menuName = MENU_ARRAY[SELECTED_MENU_INDEX]['name'];

    if (searchText == "") $('#' + prefix + 'SearchText').text('Search ' + menuName);
    else $('#' + prefix + 'SearchText').text(searchText);
}

// epg for single epg and allEpg for all epg
function parse_epg(viewType) {
    var url = API_COMMON_PATH,
        channelId = CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]['channel_id'],
        timestamp = Math.floor(Date.now() / 1000),
        obj = {},
        timestampParam = "",
        timezoneDifference = localStorage.getItem('timezoneDifference');

    $("#epgListContainer").html('');
    if (viewType == "allEpg") {
        url += "serviceGetPastDailyEpgInfo";
        All_EPG_OBJ = {};
        timestampParam += "&date=" + timestamp;

    } else {
        url += "serviceGetEpgInfo";
        $("#programmeTitle, #programmeDesc").html('&nbsp;');
        timestampParam += "&timeNow=" + (timestamp - (timezoneDifference * 1000));
    }

    //channelId = 103;
    //timestamp = 1622332800;

    url += "?channelId=" + channelId + timestampParam;
    //console.log("epg url", url);
    $.ajax({
        type: "GET",
        url: url,
        dataType: "JSON",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (json) {
            if (json.result == 200) {
                if (viewType == "allEpg") {
                    set_allEpg(json);
                } else {
                    if (json.epgs.length) {
                        $("#programmeTitle").html(json.epgs[0]['program_name']);
                        $("#programmeDesc").html(json.epgs[0]['description']);
                    }
                }
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            if (viewType == "allEpg") set_no_epg_msg();
        }
    });
}

function set_allEpg(json) {
    var epgObj = json.allEpg,
        epgDetailObj = '',
        totalEpgRow = 0,
        totalEpgRowItem = 0,
        str = '',
        date = new Date(),
        dayName = "Today",
        monthNamesArr = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        weekDayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        hasEpg = false;

    totalEpgRow = epgObj.length;

    if (totalEpgRow > 0) {
        str = '<h4 class="channel_dvr_title">' + CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]['name'] + '</h4>';
        str += '<div class="epg_right_side_time">' + format_AM_PM(date) + '</div>';
        str += '<div class="epgUlContainer">';

        for (var i = 0; i < totalEpgRow; i++) {
            epgDetailObj = epgObj[i];
            totalEpgRowItem = epgDetailObj.length;
            //date = new Date();

            if (totalEpgRowItem > 0) {
                hasEpg = true;
                if (i > 0) {
                    date.setDate(date.getDate() - i);
                    dayName = i == 1 ? "Yesterday" : weekDayArr[date.getDay()]; // Days name
                }

                monthName = monthNamesArr[date.getMonth()]; // month name
                monthDate = min_two_digits(date.getDate()); // date of the day

                str += '<ul class="dvr_list" id="epgList' + i + '">';
                str += '<li>';
                str += '<div class="dvr_bluebox">' + dayName + ' (' + monthName + ' ' + monthDate + ')</div>';
                str += '</li>';

                for (var j = 0; j < totalEpgRowItem; j++) {
                    str += '<li class="focusable" id="epg_item_' + i + '_' + j + '" tabindex="9" data-row="' + i + '">';
                    str += '<div class="dvr_bluebox" id="epg_item_container_' + i + '_' + j + '">';
                    str += '<div class="time_list" id="epg_item_time_' + i + '_' + j + '">' + get_time(epgDetailObj[j]['show_time'] * 1000) + ' - ' + get_time((epgDetailObj[j]['show_time'] * 1000) + (epgDetailObj[j]['duration'] * 1000)) + '</div>'
                    str += '<div class="time_text" id="epg_item_programme_title_' + i + '_' + j + '">' + epgDetailObj[j]['program_name'] + '</div>';
                    str += '</div>';
                    str += '</li>';
                }

                str += '</ul>';
            }
        }
        str += '</div>';
        if (hasEpg) {
            All_EPG_OBJ = epgObj;
            $(".channel_dvr_box").show();
            $("#epgListContainer").append(str);
            $($("ul.dvr_list").last()).find("li").attr('data-sn-down', 'null');
            $($("ul.dvr_list").first()).find("li").attr('data-sn-up', 'null');
            $("ul.dvr_list li:last-child").attr('data-sn-right', 'null');
            $("ul.dvr_list li:first-child").attr('data-sn-left', 'null');

            SN.remove("[id^=epgList]");
            SN.add({
                id: '[id^=epgList]',
                selector: '[id^=epgList] .focusable',
                defaultElement: '#epg_item_0_0',
                enterTo: 'last-focused'
            });
            SN.makeFocusable();
            SN.focus("[id^=epgList]");
            addEventListeners();

        } else {
            set_no_epg_msg();
        }

    } else {
        set_no_epg_msg();
    }
}

function set_no_epg_msg() {
    $("#epgListContainer").append('<div class="no_epg" id="noEpg"><span class="focusable" id="noEpgMsg" data-sn-right="null" data-sn-left="null" data-sn-up="null" data-sn-down="null" tabindex="9">' + EMPTY_CATSET + '<span></div>');
    $(".channel_dvr_box").show();
    set_focus('noEpg', 'noEpgMsg');
    SN.focus("noEpg");
}

function format_AM_PM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function get_time(timestamp) {
    var date = new Date(timestamp);
    return min_two_digits(date.getHours()) + ":" + min_two_digits(date.getMinutes());
}

function selected_menu_list() {
    $(".menu_container").find("li").each(function (i) {
        if (i == SELECTED_MENU_INDEX) {
            $(this).addClass("selected");
            // set_focus('menuList', $(this).attr("id"));
        } else $(this).removeClass("selected");
    });
}

function selected_item_list() {
    if (SELECTED_MENU_INDEX == 0) {
        if ($(".live_page_container").hasClass("active")) {
            $("[id^=live_menu_item_img_container]").removeClass("selected");
            $("#" + LAST_SELECTED_ITEM_ID).find(".item_img_container").addClass("selected");
        }
    }

    if (SELECTED_MENU_INDEX == 1 || SELECTED_MENU_INDEX == 2) {
        if ($(".movie_page_container").hasClass("active")) {
            $("[id^=movie_item]").removeClass("selected");
            $("#" + LAST_SELECTED_ITEM_ID).addClass("selected");
        }

        if ($(".seasons_page_container").hasClass("active")) {
            console.log("season page");
            $("[id^=seasons_item]").removeClass("selected");
            $("#" + LAST_SELECTED_SEASON_ID).addClass("selected");
        }

        if ($(".episode_page_container").hasClass("active")) {
            $("[id^=episode_item]").removeClass("selected");
            $("#" + LAST_SELECTED_EPISODE_ID).addClass("selected");
        }

    }
}

function last_selected_item_id(elementId, firstPage) {
    if (firstPage == 0) {
        if ($('#' + elementId).prop("tagName") == "LI") LAST_SELECTED_ITEM_ID = elementId;
        else LAST_SELECTED_ITEM_ID = $('#' + elementId).closest('li').attr("id");
    }

    if (firstPage == 1) {
        if ($('#' + elementId).prop("tagName") == "LI") LAST_SELECTED_SEASON_ID = elementId;
        else LAST_SELECTED_SEASON_ID = $('#' + elementId).closest('li').attr("id");
    }

    if (firstPage == 2) {
        if ($('#' + elementId).prop("tagName") == "LI") LAST_SELECTED_EPISODE_ID = elementId;
        else LAST_SELECTED_EPISODE_ID = $('#' + elementId).closest('li').attr("id");
    }

}

function clear_last_selected_id() {
    LAST_SELECTED_ITEM_ID = '';
    LAST_SELECTED_SEASON_ID = '';
    LAST_SELECTED_EPISODE_ID = '';
    $("[id^=live_menu_item_img_container]").removeClass("selected");
    $("[id^=movie_item]").removeClass("selected");
    $("[id^=seasons_item]").removeClass("selected");
    $("[id^=episode_item]").removeClass("selected");
    console.log("clear selected id");
}

//This function is used for remove focus color from menu
function remove_menu_focus() {
    console.log("remove menu focus border");
    if ($(":focus").length) {
        if ($(":focus")[0].parentElement.id != 'menuList') $("#menuList > li").removeClass("menu_border");
        if ($(":focus")[0].parentElement.id == 'menuList') $("#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
    }
}

//This function will enable and disable mouse 
function enable_disable_mouse() {
    // console.log("mouse pointer handling");
    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active'))
        $("body").css("pointer-events", "auto");
    // else $("body").css("pointer-events", "none");
}


function hide_channel_list() {
    console.log("hide_channel_list");
    if ($(".channel_list_container").is(":visible") && !$("#live_channel_list").is(":focus")) {
        $('.channel_list_container').removeClass('toggle_channel_list');
    }
}

function hide_channel_input_box() {
    console.log("hide_channel_input");
    $(".channel_number_container").hide();
    $("#search_channel_number").val("");
    SN.focus('videoSection');
}

function show_channel_input_box(num) {
    if (SELECTED_MENU_INDEX == 0) {
        console.log("show_channel_input");

        manage_spatial_navigation("channel_number_container");
        SN.focus("#search_channel_number");

        var value = $("#search_channel_number").val();
        if (value.length == 0) manage_spatial_navigation("channel_number_container");

        if (value.length < 3) {
            if (value.length > 0) $("#search_channel_number").val("" + value + num);
            else $("#search_channel_number").val("" + num);
        }

        $(".channel_number_container").show();
        clearTimeout(PLAY_TIMER);
        PLAY_TIMER = setTimeout(function () {
            play_live_by_channel_number();
        }, 2000);

        SN.focus("#search_channel_number");
    }
}

function play_live_by_channel_number() {
    console.log("play_live_by_channel_number");
    var channelNumber = Number($("#search_channel_number").val());
    console.log("channelNumber", channelNumber);
    if ((channelNumber > 0) && (channelNumber < CAT_ARRAY[SELECTED_MENU_INDEX].length)) {
        if (CAT_ARRAY[SELECTED_MENU_INDEX][channelNumber]['channel_id']) {
            VOD_COUNTER = 0;
            CAT_ITEM_INDEX = CHANNEL_ITEM_INDEX = CURRENT_ITEM_INDEX = channelNumber;
            get_video_details(CAT_ARRAY[SELECTED_MENU_INDEX][VOD_COUNTER]['channel_id'], true);
            hide_channel_input_box();
        }
    } else {
        $(".channel_number_container").hide();
        $("#search_channel_number").val("");
        $(".channel_number_error_mesg").show();
        setTimeout(function () {
            $(".channel_number_error_mesg").hide();
        }, 2000);
    }
}

function createCustomEPG() {
    console.log("createCustomEPG");
    $(".channel_dvr_box").hide();
    var str = "",
        tabindex = 16,
        leftFocus = '',
        rightFocus = '',
        downFocus = '',
        upFocus = '',
        activeChannel = '',
        containerClass = "live_channel_list_container";
    $("#epgListContainer").html("");
    $("#customTimeSlotContainer").html("");
    str += '<div class="date-selection-container" id="dateContainer"><div class="dropText focusable" tabindex="17" id="day_0" data-sn-up="null" data-sn-right="null" data-sn-left="null" data-sn-down="#time_0" data-index="0">Select Day</div>';
    str += '<ul class="date_Options">';
    for (var k = 0; k < 10; k++) {
        var d = new Date();
        d.setDate(d.getDate() - k);
        var l = k + 1;

        var indexVal = ' data-index ="' + k + '" ';

        if (l == 10) downFocus = ' data-sn-down="null"';
        else downFocus = ' data-sn-down="#day_' + (l + 1) + '"';

        if (l == 1) upFocus = ' data-sn-up="null"';
        else upFocus = ' data-sn-up="#day_' + (l - 1) + '"';

        str += '<li class="focusable" tabindex="17" id="day_' + l + '"  data-sn-right="null" data-sn-left="null" ' + downFocus + upFocus + indexVal + '>' + formatDate(d) + '</li>';
    }
    str += '</ul></div>';
    str += '<ul class="timeSlotContainer" id="timeSlotContainer">';

    for (var i = 0; i < 24; i++) {
        rightFocus = "";
        leftFocus = "";
        var j = i + 1;

        if (j == 24) j = 0;
        var time = (i < 10 ? '0' + i + ':00 - ' : i + ':00 - ') + (j < 10 ? '0' + j + ':00' : j + ':00');

        if (i < 24) rightFocus = ' data-sn-right="#time_' + (i + 1) + '"';
        else rightFocus = ' data-sn-right="null"';

        if (i == 0) leftFocus = ' data-sn-left="null"';
        else leftFocus = ' data-sn-left="#time_' + (i - 1) + '"';

        if (i < 21) downFocus = ' data-sn-down="#time_' + (i + 4) + '"';
        else downFocus = ' data-sn-down="null"';

        upFocus = "";
        if (i < 4) upFocus = ' data-sn-up="#day_0"';
        else upFocus = ' data-sn-up="#time_' + (i - 4) + '"';

        str += '<li class="timeSlotBox focusable" tabindex="' + tabindex + '" id="time_' + i + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>';
        str += '<p> ' + time + '</p>';
        str += '</li>';

    }
    str += '</ul>';
    $("#customTimeSlotContainer").html(str);
    $(".channel_dvr_box").show();
    $("#day_0").text(formatDate(new Date()));
    setFocusDayList();
    addEventListeners();

    SN.remove("timeSlotContainer");
    SN.add({
        id: 'timeSlotContainer',
        selector: '#timeSlotContainer .focusable',
        defaultElement: '#time_0',
        restrict: 'self-only',
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
    SN.focus("timeSlotContainer");

    $('#timeSlotContainer').on('sn:focused', function (e) {
        console.log("timeSlotContainer focus.");
        clearTimeout(GLOBAL_TIME_OUT);
        GLOBAL_TIME_OUT = setTimeout(function () {
            $(".channel_dvr_box").hide();
            SN.focus("videoSection");
        }, 5000);
    });

    $('#timeSlotContainer').on('sn:enter-down', function (e) {
        console.log("timeSlotContainer enter.");
        var index = $("#" + e.target.id).index();
        var i = $("#day_0").attr("data-index");
        var d = new Date();
        d.setDate(d.getDate() - i);
        playCustomeEPG(index, d);
    });

}

function formatDate(date) {
    var dd = date.getDate();
    var day = date.getDay();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    date = DAY_ARRAY[day] + " (" + mm + '/' + dd + ")";
    return date
}


function changeProgrammeDetails() {
    console.log("changeProgrammeDetails");
    if (SELECTED_MENU_INDEX == 0) {
        $(".channel-img").attr("src", IMG_PATH + CAT_ARRAY[SELECTED_MENU_INDEX][CURRENT_ITEM_INDEX].image);
        $("#programmeTitle").text(CAT_ARRAY[SELECTED_MENU_INDEX][CURRENT_ITEM_INDEX].name);
        // $("#programmeDesc").text(CAT_ARRAY[SELECTED_MENU_INDEX][CHANNEL_ITEM_INDEX].description);
    }
}

function goToHomePage() {
    console.log("Go to home page");

    $(".circle_loader").removeClass('circle-loader-middle');

    VIDEO_PLAYER.pause();
    PLAY_VIDEO = false;

    $("#video_container").html('');
    $("#video_container").hide();

    $(".container_box").show();
    $(".video_container").removeClass('active').hide();;
    $(".main_container").show();

    $("#epgListContainer").html('');
    $(".epg_icon_container").hide();
    $(".custom_control_container").hide();
    $(".channel_dvr_box").hide();
    $(".loader").hide();
    $(".progress-container").hide();
    $(".language").hide();
    $(".live_page_container").addClass('active');
    show_hide_video_next_previous(false);
    if (SELECTED_MENU_INDEX == 0) SN.focus('liveList');
}

function playCustomeEPG(selectedIndex, selectedDate) {
    console.log("playCustomeEPG", selectedIndex, selectedDate);
    var time = "";
    if (selectedIndex < 10) time = '_0' + selectedIndex + "-00";
    else time = '_' + selectedIndex + "-00";

    var adaptive = "_hi.mp4/master.m3u8";
    if (CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]["transcode_levels"] == 2)
        adaptive = "_,low,hi,.mp4.urlset/master.m3u8";
    else if (CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]["transcode_levels"] == 3)
        adaptive = "_,low,med,hi,.mp4.urlset/master.m3u8";

    var currentDate = new Date();
    var month = (selectedDate.getMonth() + 1) < 10 ? '0' + (selectedDate.getMonth() + 1) : '' + (selectedDate.getMonth() + 1);
    var date = selectedDate.getDate() < 10 ? '0' + selectedDate.getDate() : '' + selectedDate.getDate();

    var urlDate = "_" + selectedDate.getFullYear() + "-" + month + "-" + date + time;
    var dvrUrl = DVR_URL + CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]["dvrDir"] + "/channel-" + CAT_ARRAY[SELECTED_MENU_INDEX][CAT_ITEM_INDEX]["channel_id"] + urlDate + adaptive;

    console.log(dvrUrl, time);
    $(".channel_dvr_box").hide();
    VOD_URL = dvrUrl;
    // console.log(dvrUrl);
    load_video();
}

function setFocusDayList() {
    SN.remove("dateContainer");
    SN.add({
        id: 'dateContainer',
        selector: '#dateContainer .focusable',
        defaultElement: '#day_0',
        restrict: 'self-only',
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
    SN.focus("dateContainer");

    $('#dateContainer').on('sn:focused', function (e) {
        console.log("dateContainer focus.");
        clearTimeout(GLOBAL_TIME_OUT);
        GLOBAL_TIME_OUT = setTimeout(function () {
            $(".channel_dvr_box").hide();
            SN.focus("videoSection");
        }, 5000);
    });

    $('#dateContainer').on('sn:enter-down', function (e) {
        console.log("dateContainer enter.");
        // var index = $("#" + e.target.id).index();
        if (e.target.id == "day_0") {
            $(".date_Options").show();
            SN.focus("#day_1");
        } else {
            console.log("date selected");
            var dateText = $("#" + e.target.id).text();
            var i = $("#" + e.target.id).index();
            $("#day_0").text(dateText);
            $("#day_0").attr("data-index", i);
            $(".date_Options").hide();
            SN.focus("#day_0");
        }

    });
}

function Muted() {
    // One-time call
    var request = webOS.service.request('luna://com.webos.audio', {
        method: 'setMuted',
        parameters: { muted: true },
        onSuccess: function (inResponse) {
            console.log('TV is muted');
            // To-Do something
        },
        onFailure: function (inError) {
            console.log('Failed to set muted');
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            // To-Do something
            return;
        },
    });
}

function unMuted() {
    // One-time call
    var request = webOS.service.request('luna://com.webos.audio', {
        method: 'volumeDown',
        onSuccess: function (inResponse) {
            VIDEO_PLAYER.setVolume(0);
            console.log('The volume is decreased by 1.');
            // To-Do something
        },
        onFailure: function (inError) {
            console.log('Failed to decrease volume by 1.');
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            // To-Do something
            return;
        }
    });
}