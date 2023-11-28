// Set oauth token and scret key
function get_oauth_attr() {
    var oauth_token = "";
    if (localStorage.getItem('oauth_token') != null && localStorage.getItem('oauth_token') != "") oauth_token = localStorage.getItem('oauth_token');

    var oauth_secret = "";
    if (localStorage.getItem('oauth_secret') != null && localStorage.getItem('oauth_secret') != "") oauth_secret = localStorage.getItem('oauth_secret');

    var str = "&" + OAUTH_TOKEN_ATTR_KEY + "=" + oauth_token + "&" + OAUTH_SECRET_ATTR_KEY + "=" + oauth_secret;
    return str;
}

// Create Menu here
function set_menu() {
    $(".menu_container").hide();
    var str = '',
        classFocused = '',
        totalMenu = MENU_ARRAY.length;

    if (totalMenu > 0) {
        for (var i = 0; i < totalMenu; i++) {
            var menuName = (create_menu_name(MENU_ARRAY[i]['name'])).toLowerCase(),
                tabindex = 0,
                leftFocus = ' data-sn-left="null"',
                rightFocus = '',
                downFocus = '',
                upFocus = '';

            // Actual Menu
            if (i == 0) upFocus = 'data-sn-up="null"';
            if (i == (totalMenu - 1)) downFocus = ' data-sn-down="null"';

            str += '<li class="focusable" tabindex="' + tabindex + '" id="' + menuName + '" ' + leftFocus + rightFocus + downFocus + upFocus + '>'
            str += '<img src="images/' + MENU_ARRAY[i]['image'] + '" class="navbar_icon" id="' + menuName + '_img"><span class="navbar_text" id="' + menuName + '_span" onerror="image_error(this, ' + tabindex + ');">' + MENU_ARRAY[i]['name'] + '</span>';
            str += '</li>';
        }

        $(".splash-screen").hide();
        $(".container_box").show();
        $("#menuList").html(str);
        $(".menu_container").show();
        $(".menu_container").addClass("active");
        addEventListeners();

        SN.add({
            id: 'menuList',
            selector: '#menuList .focusable',
            defaultElement: '#all_videos_menu',
            enterTo: 'last-focused'
        });
        SN.focus('menuList');
        $("#menuList li:nth-child(" + (SELECTED_MENU_INDEX + 1) + ")").focus();
    }
}

function create_menu_name(menuName) {
    if (menuName == undefined && menuName == "") return "";
    return menuName.replace(/[ /]/g, "_");
}

function create_object() {
    CAT_ARRAY[SELECTED_MENU_INDEX] = {};
    CAT_ARRAY[SELECTED_MENU_INDEX]['featured'] = new Array();
    CAT_ARRAY[SELECTED_MENU_INDEX]['featured']['totalItemCount'] = {};
    CAT_ARRAY[SELECTED_MENU_INDEX]['featured']['totalItemCount'] = 0;
    CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'] = new Array();
    CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'] = {};
    CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'] = 0;
    CAT_ARRAY[SELECTED_MENU_INDEX]['category'] = new Array();
    return;
}

function set_all_videos_and_channels_shows_screen(menuId, timestamp) {
    var oauth = get_oauth_attr(),
        url = "",
        totalItemCount = 0,
        data = [];

    if (FEATURED_ROW_COUNTER == 0) create_object();

    if (menuId == "AL") url = ALL_VIDEO_URL;
    else url = CHANNEL_AND_SHOWS_URL;

    url += "?limit=" + PER_FEATURED_LIMIT + "&orderby=featured&page=" + FEATURED_PAGE_COUNTER + APPEND_AT_THE_END_OF_URL + oauth;

    //console.log("Featured URL", url);

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (featuredJson) {
            if (featuredJson.body !== undefined && featuredJson.body.response.length > 0) {
                data = featuredJson.body.response;
                CAT_ARRAY[SELECTED_MENU_INDEX]['featured']['totalItemCount'] = featuredJson.body.totalItemCount;
            }
            set_row(data, timestamp, menuId);
            get_all_videos_browse_video_data(menuId, timestamp);

        },
        error: function (xhr, error) {
            set_row(data, timestamp, menuId);
            get_all_videos_browse_video_data(menuId, timestamp);
        }
    });
}

function get_all_videos_browse_video_data(menuId, timestamp) {
    if (timestamp == TIME_STAMP) {
        var oauth = get_oauth_attr();
        var dataArray = new Array(),
            dataArrayCounter = 0,
            url = "";

        if (menuId == "AL") url = ALL_VIDEO_URL;
        else url = CHANNEL_AND_SHOWS_URL;

        url += "?limit=" + PER_PAGE_LIMIT + "&page=" + FIRST_PAGE_COUNTER + APPEND_AT_THE_END_OF_URL + oauth;

        //console.log("browse_video URL", url);

        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: true,
            cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (allVIdeoJson) {
                if (timestamp == TIME_STAMP) {
                    if (allVIdeoJson.body !== undefined && allVIdeoJson.body.response.length > 0) {
                        CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'] = allVIdeoJson.body.totalItemCount;
                    }

                    totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'];
                    page = Math.ceil(totalItemCount / PER_PAGE_LIMIT);
                    set_grid(allVIdeoJson.body.response, page, totalItemCount, timestamp, menuId);
                }

            },
            error: function (xhr, error) {
                if (timestamp == TIME_STAMP) {
                    totalItemCount = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'];
                    page = Math.ceil(totalItemCount / PER_PAGE_LIMIT);
                    set_grid([], page, totalItemCount, timestamp, menuId);
                }
            }
        });
    }
}

function set_row(data, timestamp, menuId) {
    if ((menuId == "AL" || menuId == "CAS") && timestamp == TIME_STAMP) {
        var
            tabindex = 1,
            row = 0,
            title = "",
            imgSrc = "",
            str = "",
            ignoreLi = 0,
            focusName = "";

        totalItems = data.length;
        if (totalItems > 0) {
            for (i = 0; i < totalItems; i++) {
                if (menuId == "AL") {
                    if (data[i]['video_url'].indexOf('public') === -1) ignoreLi = 0;
                    else ignoreLi = 1;
                }

                if (!ignoreLi) {
                    FEATURE_ROW_FLAG = 1;

                    CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FEATURED_ROW_COUNTER] = [];
                    CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FEATURED_ROW_COUNTER] = data[i];

                    focusName = "row_" + row + "_item_" + FEATURED_ROW_COUNTER;

                    title = "&nbsp;";
                    if (data[i]['title'] != undefined && data[i]['title'] != "") title = data[i]['title'];

                    imgSrc = "../images/default_bg.png";
                    if (data[i]['image'] != undefined && data[i]['image'] != "") imgSrc = data[i]['image'];

                    str += '<li class="focusable" tabindex="' + tabindex + '" id="' + focusName + '" data-sn-up="null">';
                    str += '<div class="channel_inner_box">';
                    str += '<h4 class="channel_header">' + title + '</h4>';
                    str += '<div class="category_box" id="' + focusName + '_img_container">';
                    str += '<div class="category_border" id="' + focusName + '_img_sub_container">';
                    str += '<img src="' + imgSrc + '" onerror="image_error(this, ' + tabindex + ');" id="' + focusName + '_img">';
                    str += '</div>';
                    if (menuId == "AL")
                        str += '<div class="time_zone featured_time_zone">' + milliseconds_to_time(data[i]['duration']) + '</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</li>';

                    FEATURED_ROW_COUNTER++;
                }
            }

            if (timestamp == TIME_STAMP) {
                if (menuId == "CAS") $("#featuredRowHeading").text("FEATURED CHANNELS");
                else $("#featuredRowHeading").text("FEATURED VIDEOS");
                $("ul#featuredRow").append(str);
                if (FEATURED_PAGE_COUNTER == 1) {
                    SN.remove('featuredRow');
                    // Add feature row
                    SN.add({
                        id: 'featuredRow',
                        selector: '#featuredRow .focusable',
                        defaultElement: '#row_0_item_0',
                        enterTo: 'last-focused'
                    });
                    SN.makeFocusable();
                }
                FEATURED_PAGE_COUNTER++;
                addEventListeners();
                $("ul#featuredRow li").last().attr("data-sn-right", "null");
            }

        } else {
            console.log("featured row has no data.");
            if (timestamp == TIME_STAMP) FEATURED_PAGE_COUNTER++;
        }
    }
}

function set_grid(data, page, totalItemCount, timestamp, menuId) {
    if ((menuId == "AL" || menuId == "CAS") && timestamp == TIME_STAMP) {
        var totalItems = data.length,
            tabindex = 1,
            row = 1,
            title = "",
            imgSrc = "",
            str = "";

        if (totalItems > 0) {
            for (i = 0; i < totalItems; i++) {
                if (menuId == "AL") str += set_grid_li(data, totalItemCount, i, tabindex, "row_" + row + "_item_", menuId, 1);
                else if (menuId == "CAS") str += set_grid_li(data, totalItemCount, i, tabindex, "row_" + row + "_item_", menuId, 0);
            }

            if (timestamp == TIME_STAMP) {
                if (FIRST_PAGE_COUNTER == 1) {
                    if (!FEATURE_ROW_FLAG) $('#allVideosGrid').closest("div.channel_small_fullbox").addClass("channel_small_full_height");
                    $(".cat_container").show();
                    if (menuId == "CAS") $("#allVideoRowHeading").text("BROWSE CHANNELS");
                    else $("#allVideoRowHeading").text("BROWSE ALL VIDEOS");
                }

                $(".loader").remove();
                $("ul#allVideosGrid").append(str);
                addEventListeners();
                if (FIRST_PAGE_COUNTER == 1) {
                    SN.remove('allVideosGrid');
                    SN.add({
                        id: 'allVideosGrid',
                        selector: '#allVideosGrid .focusable',
                        defaultElement: '#row_0_item_0',
                        enterTo: 'last-focused'
                    });
                    SN.makeFocusable();
                }
                set_pagination("", menuId, timestamp, page, "cat_container", "allVideosGrid", EMPTY_VOD_LIST, tabindex);
            }

        } else {
            msg = "There is no content in page no " + FIRST_PAGE_COUNTER;
            //console.log(msg);
            set_pagination("", menuId, timestamp, page, "cat_container", "allVideosGrid", EMPTY_VOD_LIST, tabindex);
        }
    }
}

// Category grid for channels categories and video categories menu page
function set_channels_and_video_category(timestamp, menuId, page) {
    if ((menuId == "CC" || menuId == "VC") && timestamp == TIME_STAMP) {
        var feedUrl = "",
            oauth = get_oauth_attr(),
            totalItems = 0,
            totalCount = 0,
            row = 0,
            depth = 1,
            str = "";

        if (FIRST_PAGE_COUNTER == 1) create_object();

        switch (MENU_ARRAY[SELECTED_MENU_INDEX]['id']) {
            case "VC":
                feedUrl = VIDEO_FIRST_PAGE_URL;
                break;
            case "CC":
                feedUrl = CHANNEL_FIRST_PAGE_URL;
                break;
        }

        feedUrl += "&page=" + FIRST_PAGE_COUNTER + oauth;

        //console.log("Category URL"+ feedUrl);

        $.ajax({
            type: "GET",
            url: feedUrl,
            dataType: "json",
            async: true,
            cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (json) {
                if (json.body !== undefined && json.body.categories.length > 0) {
                    data = json.body.categories;
                    totalCount = json.body.totalItemCount;
                    page = Math.ceil(totalCount / PER_PAGE_LIMIT);
                    CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo']['totalItemCount'] = totalCount;

                    if (data != undefined && data != "") {
                        totalItems = data.length;
                        if (totalItems > 0) {
                            for (i = 0; i < totalItems; i++) {
                                str += set_grid_li(data, totalCount, i, depth, "row_" + row + "_item_", menuId, 0);
                            }

                            $(".loader").remove();
                            if (timestamp == TIME_STAMP) {
                                if (FIRST_PAGE_COUNTER == 1) {
                                    $(".cat_container").show();
                                    $("#allVideoRowHeading").text((MENU_ARRAY[SELECTED_MENU_INDEX]['name']).toUpperCase());
                                }
                                LOAD_NEXT_PAGE = 1;

                                $('#allVideosGrid').closest("div.channel_small_fullbox").addClass("channel_small_full_height");
                                $("ul#allVideosGrid").append(str);
                                addEventListeners();

                                if (FIRST_PAGE_COUNTER == 1) {
                                    SN.remove('allVideosGrid');
                                    SN.add({
                                        id: 'allVideosGrid',
                                        selector: '#allVideosGrid .focusable',
                                        defaultElement: '#row_0_item_0',
                                        enterTo: 'last-focused'
                                    });
                                    SN.makeFocusable();
                                }
                                FIRST_PAGE_COUNTER++;
                            }

                            set_down_focus_on_last_fouth_li("allVideosGrid");

                        } else {
                            if (timestamp == TIME_STAMP) set_pagination("", menuId, timestamp, page, "cat_container", "allVideosGrid", EMPTY_CATSET, depth);
                        }
                    } else {
                        if (timestamp == TIME_STAMP) set_pagination("", menuId, timestamp, page, "cat_container", "allVideosGrid", EMPTY_CATSET, depth);
                    }
                } else {
                    if (timestamp == TIME_STAMP) set_pagination("", menuId, timestamp, page, "cat_container", "allVideosGrid", EMPTY_CATSET, depth);
                }
            },
            error: function (xhr, error) {
                if (timestamp == TIME_STAMP) set_pagination("", menuId, timestamp, page, "cat_container", "allVideosGrid", EMPTY_CATSET, depth);
            }
        });
    }
}

// Support menu screen
function set_support_screen() {
    if (MENU_ID == "SU" || MENU_ID == "SO") {
        create_object();
        var str = "";
        str = '<div class="support_main_container">';
        str += '<div class="support_container">';
        str += '<h3 class="support_header">Support/Help</h3>';
        str += '<div class="support_text">Austraila & International</div>';
        str += '<ul class="support_list">';
        str += '<li><img src="images/phone.png">+610427312312</li>';
        str += '<li><img src="images/email.png">admin@uhunt.org</li>';
        str += '<li><img src="images/globe.png">www.uhunt.org</li>';
        str += '</ul>';
        str += '</div>';
        str += '</div>';

        $(".navbar_rightsidebox").append(str);
        $(".loader").remove();
    }
}

// Search page screen
function set_search_screen() {
    if (MENU_ID == "SE") {
        create_object();
        var str = "";
        str += '<div class="search_leftbox" id="searchBox">';
        str += '<img src="images/search_box.png" alt="seach" class="sarch_img">';
        str += '<div class="search_text">SEARCH:</div>';
        str += '<input type="text" class="search_input focusable" id="searchInputText" tabindex="1" data-sn-up="null" data-sn-left="null" data-sn-up="null" data-sn-down="null">';
        str += '</div>';
        str += '<div class="channel_video_box gridContainer search_margin">';
        str += '<h2 class="featured_header search_result_txt" id="resultText"></h2>';
        str += '<div class="channel_small_fullbox search_results_full_height">';
        str += '<ul class="search_list" id="searchList">';
        str += '</ul>';
        str += '</div>';
        str += '</div>';

        $(".cat_container").hide().removeClass("active");
        $(".search_container").show().html(str);
        $(".loader").remove();

        SN.remove("searchBox");
        SN.add({
            id: 'searchBox',
            selector: '#searchBox .focusable',
            defaultElement: '#searchInputText',
            enterTo: 'last-focused'
        });
        SN.makeFocusable();
        addEventListeners();

        $('#searchInputText').on('sn:focused', function (e) {
            if (!$(".search_container").hasClass("active")) {
                moveFocusToRightSide();
            }

            if ($("#searchList").hasClass("active") && FIRST_PAGE_ITEM_INDEX < 4) {
                TIME_STAMP = jQuery.now();
                $("#resultText").text("");
                $("#searchList, .error_msg").removeClass("active").html('');
            }
        });
    }
}

function request_search_results() {
    searchText = jQuery.trim(document.getElementById('searchInputText').value);
    document.getElementById('searchInputText').blur();
    $(".error_msg").remove();
    if (searchText != "") {
        FIRST_PAGE_ITEM_INDEX = 0;
        FIRST_PAGE_COUNTER = 1;
        FIRST_ROW_ITEM_COUNTER = 1;
        FIRST_PAGE_ITEM_COUNTER = 0;
        LOAD_NEXT_PAGE = 0;
        TIME_STAMP = jQuery.now();
        set_search_results(MENU_ID, TIME_STAMP, 1);

    } else {

        var popup = '<div class="search_popup">Please enter text to search.</div>';
        $(".search_container").append(popup);
        $(".search_popup").fadeIn(2000);
        setTimeout(function () { $.when($(".search_popup").fadeOut(2000)).done(function () { $(".search_popup").remove(); }); }, 3000);
    }
}

// Search results page
function set_search_results(menuId, timestamp, page) {
    searchText = jQuery.trim(document.getElementById('searchInputText').value);
    if (searchText != "") {
        if (FIRST_PAGE_COUNTER == 1) {
            $(".search_container .channel_video_box .channel_small_fullbox").append(add_loader("search_loader"));
            $("#searchList, .no_result").html("").removeClass("active");
            $("#searchList").removeAttr("style");
            $("#resultText").text("");
            //$(".channel_small_fullbox").addClass("search_results_full_height");
            CAT_ARRAY[SELECTED_MENU_INDEX]['search_result'] = [];
            CAT_ARRAY[SELECTED_MENU_INDEX]['search_result']['totalItemCount'] = {};
            CAT_ARRAY[SELECTED_MENU_INDEX]['search_result']['totalItemCount'] = 0;
        }
        var oauth = get_oauth_attr();
        var str = "",
            url = SEARCH_URL + searchText + "&page=" + FIRST_PAGE_COUNTER + APPEND_AT_THE_END_OF_URL + oauth,
            searchFocusName = "",
            searchFocusTrue = "",
            searchRigthFocus = "",
            searchLeftFocus = "",
            searchUpFocus = "",
            searchFocusDown = "",
            depth = 1;

        //console.log("search url ", url);

        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: true,
            cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (results) {
                if (timestamp == TIME_STAMP) {
                    if (results != undefined) {
                        if (results.body.response != undefined) {
                            totalItem = results.body.response.length;
                            page = Math.ceil(results.body.totalItemCount / PER_PAGE_LIMIT);
                            if (FIRST_PAGE_COUNTER == 1) CAT_ARRAY[SELECTED_MENU_INDEX]['search_result']['totalItemCount'] = results.body.totalItemCount;

                            if (totalItem > 0) {
                                for (i = 0; i < totalItem; i++) {
                                    str += set_grid_li(results.body.response, results.body.totalItemCount, i, depth, "item_", menuId, 1);
                                }

                                if (MENU_ID == "SE" && timestamp == TIME_STAMP) {
                                    $(".loader").remove();
                                    $("#searchList").append(str);
                                    addEventListeners();

                                    if (FIRST_PAGE_COUNTER == 1) {
                                        document.getElementById("searchInputText").blur();
                                        $("#resultText").text("RESULTS");
                                        $("#searchList").addClass("active");

                                        SN.remove("searchList");
                                        SN.add({
                                            id: 'searchList',
                                            selector: '#searchList .focusable',
                                            //restrict: 'self-only',
                                            defaultElement: '#item_0',
                                            enterTo: 'last-focused'
                                        });
                                        SN.makeFocusable();
                                        SN.focus("searchList");

                                        $('#searchList').on('sn:focused', function (e) {
                                            console.log("searchList focused ...");
                                            FIRST_PAGE_ITEM_INDEX = $('#searchList li#' + e.target.id).index();
                                            $("#searchList").addClass("active");

                                            if (!$(".search_container").hasClass("active")) {
                                                moveFocusToRightSide();
                                            }
                                        });

                                        $('#searchList').on('sn:enter-down', function (e) {
                                            console.log("searchList selected ...", "#" + e.currentTarget.id + " li#" + e.target.id);
                                            $("#" + e.currentTarget.id + " li#" + e.target.id).click();
                                        });
                                    }

                                    set_pagination("", menuId, timestamp, page, "search_container", "searchList", EMPTY_VOD_LIST, depth);
                                }

                            } else {
                                console.log("no results found..");
                                if (MENU_ID == "SE" && $(".search_container").hasClass("active") && timestamp == TIME_STAMP) {
                                    set_pagination("", menuId, timestamp, page, "search_container", "searchList", EMPTY_VOD_LIST, depth);
                                }
                            }
                        } else {
                            console.log("no results found..");
                            if (MENU_ID == "SE" && $(".search_container").hasClass("active") && timestamp == TIME_STAMP) {
                                set_pagination("", menuId, timestamp, page, "search_container", "searchList", EMPTY_VOD_LIST, depth);
                            }
                        }
                    } else {
                        console.log("no results found");
                        if (MENU_ID == "SE" && $(".search_container").hasClass("active") && timestamp == TIME_STAMP) {
                            set_pagination("", menuId, timestamp, page, "search_container", "searchList", EMPTY_VOD_LIST, depth);
                        }
                    }
                }

            },
            error: function (xhr, error) {
                if (MENU_ID == "SE" && $(".search_container").hasClass("active") && timestamp == TIME_STAMP) {
                    set_pagination("", menuId, timestamp, page, "search_container", "searchList", EMPTY_VOD_LIST, depth);
                }
            }
        });
    }
}

// Second page screen
function set_categories_video_menu_second_page(menuId, timestamp, page) {
    if (SECOND_PAGE_COUNTER == 1) {
        $(".cat_container").hide().removeClass("active");
        $(".channel_video_categories_menu_second_page_container").addClass("active").show();
        $(".channel_video_categories_menu_second_page_container .channel_video_box .channel_small_fullbox").append(add_loader("second_page_loader"));
        $("#catList").html("").removeAttr('style');
        $("#catName").text("CHANNEL CATEGORY: " + CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['category_name']);
        SECOND_PAGE_ITEM_INDEX = 0;
        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'] = [];
        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat']['totalItemCount'] = {};
        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat']['totalItemCount'] = 0;
        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video'] = [];
        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video']['totalItemCount'] = {};
        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video']['totalItemCount'] = 0;
    }

    var data = [],
        oauth = get_oauth_attr(),
        categoryId = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['category_id'],
        url = "",
        depth = 2,
        errorMsg = "";

    if (menuId == "CC") {
        url = CHANNEL_SECOND_PAGE_URL;
        errorMsg = EMPTY_CATSET;

    } else if (menuId == "VC") {
        url = VIDEO_SECOND_PAGE_URL;
        errorMsg = EMPTY_VOD_LIST;
    }

    url += categoryId + "&page=" + SECOND_PAGE_COUNTER + APPEND_AT_THE_END_OF_URL + oauth;
    //console.log("set_categories_video_menu_second_page url", url);

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (results) {
            if (timestamp == TIME_STAMP) {
                var totalItems = 0,
                    totalCount = 0,
                    str = "";

                if (results != undefined && results != "") {
                    if (menuId == "CC") {
                        totalCount = results.body.channels.totalItemCount;
                        response = results.body.channels.response;
                        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat']['totalItemCount'] = totalCount;

                    } else if (menuId == "VC") {
                        totalCount = results.body.video.totalItemCount;
                        response = results.body.video.response;
                        CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video']['totalItemCount'] = totalCount;
                    }
                    if (response != undefined) data = response;

                    page = Math.ceil(totalCount / PER_PAGE_LIMIT);
                    totalItems = data.length;

                    if (totalItems > 0) {
                        for (i = 0; i < totalItems; i++) {
                            if (menuId == "VC") str += set_grid_li(data, totalCount, i, depth, "category_item_", menuId, 1);
                            else str += set_grid_li(data, totalCount, i, depth, "category_item_", menuId, 0);
                        }

                        if (str != "") {
                            $(".loader").remove();
                            $("#catList").append(str);
                            addEventListeners();
                        }

                        if ($(".channel_video_categories_menu_second_page_container").hasClass("active")) {
                            if (str != "") {
                                if (SECOND_PAGE_COUNTER == 1) {
                                    $("#catList").addClass("active");
                                    SN.remove('catList');
                                    SN.add({
                                        id: 'catList',
                                        selector: '#catList .focusable',
                                        //restrict: 'self-only',
                                        defaultElement: '#row_0_item_0',
                                        enterTo: 'last-focused'
                                    });
                                    SN.makeFocusable();
                                    SN.focus("catList");
                                }
                                LOAD_NEXT_PAGE = 1;
                                SECOND_PAGE_COUNTER++;
                                set_down_focus_on_last_fouth_li("catList");
                            } else {
                                set_pagination("", menuId, timestamp, page, "channel_video_categories_menu_second_page_container", "catList", errorMsg, depth);
                            }
                        }


                    } else {
                        set_pagination("", menuId, timestamp, page, "channel_video_categories_menu_second_page_container", "catList", errorMsg, depth);
                        console.log("There is no data");
                    }
                } else {
                    set_pagination("", menuId, timestamp, page, "channel_video_categories_menu_second_page_container", "catList", errorMsg, depth);
                    console.log("There is no data");
                }
            }

        },
        error: function (xhr, error) {
            set_pagination("", menuId, timestamp, page, "channel_video_categories_menu_second_page_container", "catList", errorMsg, depth);
        }
    });
}

// Third page screen
function set_categories_menu_third_page(channelId, menuId, timestamp, page) {
    if (THIRD_PAGE_COUNTER == 1) {
        $(".channel_video_categories_menu_second_page_container, .cat_container").removeClass("active").hide();
        $(".channel_third_page_container").show().addClass("active");
        $(".channel_third_page_container .channel_video_box .channel_small_fullbox").append(add_loader("third_page_loader"));
        $("#subcatList").html("").removeAttr('style');
        $("#channelDetails").html("");
        THIRD_PAGE_ITEM_INDEX = 0;

        if (menuId == "CAS") {
            if ($("ul#featuredRow").hasClass("active")) {
                CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'] = {};
                CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'] = 0;

            } else if ($("ul#allVideosGrid").hasClass("active")) {
                CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'] = {};
                CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'] = 0;
            }

        } else {
            CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['totalItemCount'] = {};
            CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['totalItemCount'] = 0;
        }
    }

    var oauth = get_oauth_attr(),
        channelObj = {},
        data = [],
        url = "",
        depth = 3;

    url = CHANNEL_THRID_PAGE_URL + channelId + "?limit=" + PER_PAGE_LIMIT + "&page=" + THIRD_PAGE_COUNTER + APPEND_AT_THE_END_OF_URL + oauth;

    //console.log("set_categories_menu_third_page url", url);

    if (navigator.onLine) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: true,
            cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (results) {
                if (menuId == MENU_ID && timestamp == TIME_STAMP) {
                    if (results != undefined && results != "") {
                        page = Math.ceil(results.body.totalItemCount / PER_PAGE_LIMIT);
                        if (menuId == "CAS") {
                            if ($("ul#featuredRow").hasClass("active")) {
                                channelObj = CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX];
                                if (THIRD_PAGE_COUNTER == 1) CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['video'] = [];

                                CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'] = results.body.totalItemCount;
                                if (results.body.response != undefined) data = results.body.response;

                            } else if ($("ul#allVideosGrid").hasClass("active")) {
                                channelObj = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX];
                                if (THIRD_PAGE_COUNTER == 1) CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['video'] = [];
                                CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['totalItemCount'] = results.body.totalItemCount;
                                if (results.body.response != undefined) data = results.body.response;
                            }

                        } else {
                            channelObj = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX];
                            if (THIRD_PAGE_COUNTER == 1) CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['video'] = [];
                            CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['totalItemCount'] = results.body.totalItemCount;

                            if (results.body.response != undefined)
                                data = results.body.response;
                        }

                        var totalItems = "",
                            row = 0,
                            //counter = 1,
                            parentHtml = "";
                        str = "";

                        totalItems = data.length;
                        if (totalItems > 0) {
                            if (THIRD_PAGE_COUNTER == 1) {
                                str += '<h2>' + channelObj['title'] + '</h2>';
                                str += '<div class="channel_details_box">';
                                str += '<div class="channel_thumbnail_box">';
                                str += '<img src="' + channelObj['image'] + '" onerror="image_error(this, ' + depth + ');">';
                                str += '</div>';
                                str += '<div class="channel_description_box">';
                                str += '<p>' + limit_words((channelObj['description']).replace(/(<([^>]+)>)/ig, ""), 550) + '</p>';
                                str += '</div>';
                                str += '</div>';
                                $("#channelDetails").html(str);
                            }

                            str = "";
                            for (i = 0; i < totalItems; i++) {
                                str += set_grid_li(data, results.body.totalItemCount, i, depth, "video_item_", menuId, 1);
                            }

                            if (str != "") {
                                $(".loader").remove();
                                $("#subcatList").append(str).addClass("active");
                                addEventListeners();
                            }

                            if ($(".channel_third_page_container").hasClass("active")) {
                                if (str != "") {
                                    if (THIRD_PAGE_COUNTER == 1) {
                                        $("#third_page_header").text("VIDEOS");
                                        SN.remove('subcatList');
                                        SN.add({
                                            id: 'subcatList',
                                            selector: '#subcatList .focusable',
                                            defaultElement: '#row_0_item_0',
                                            enterTo: 'last-focused'
                                        });
                                        SN.makeFocusable();
                                        SN.focus("subcatList");
                                    }

                                    LOAD_NEXT_PAGE = 1;
                                    THIRD_PAGE_COUNTER++;

                                } else {
                                    set_pagination(channelId, menuId, timestamp, page, "channel_third_page_container", "subcatList", EMPTY_VOD_LIST, depth);
                                }
                            }

                        } else {
                            set_pagination(channelId, menuId, timestamp, page, "channel_third_page_container", "subcatList", EMPTY_VOD_LIST, depth);
                        }
                    } else {
                        set_pagination(channelId, menuId, timestamp, page, "channel_third_page_container", "subcatList", EMPTY_VOD_LIST, depth);
                    }
                }

            },
            error: function (xhr, error) {
                set_pagination(channelId, menuId, timestamp, page, "channel_third_page_container", "subcatList", EMPTY_VOD_LIST, depth);
            }
        });

    } else {
        set_pagination(channelId, menuId, timestamp, page, "channel_third_page_container", "subcatList", EMPTY_VOD_LIST, depth);
    }
}

// call pagination for second, third and search page from here
function set_pagination(channelId, menuId, timestamp, page, mainContainerClass, ulId, errorMsg, focusDepth) {
    switch (focusDepth) {
        case 1:
            pageCounter = FIRST_PAGE_COUNTER;
            break;

        case 2:
            pageCounter = SECOND_PAGE_COUNTER;
            break;

        case 3:
            pageCounter = THIRD_PAGE_COUNTER;
            break;
    }

    if (pageCounter < page && (menuId == MENU_ID)) {
        $(".loader").remove();
        switch (focusDepth) {
            case 1:
                FIRST_PAGE_COUNTER++;
                if (menuId == "AL" || menuId == "CAS") get_all_videos_browse_video_data(menuId, timestamp);
                else if (menuId == "CC" || menuId == "VC") set_channels_and_video_category(timestamp, menuId, page);
                else set_search_results(menuId, timestamp, page);
                break;

            case 2:
                SECOND_PAGE_COUNTER++;
                set_categories_video_menu_second_page(menuId, timestamp, page);
                break;

            case 3:
                THIRD_PAGE_COUNTER++;
                set_categories_menu_third_page(channelId, menuId, timestamp, page);
                break;
        }


    } else {
        $(".loader").remove();

        switch (focusDepth) {
            case 1:
                FIRST_PAGE_ITEM_INDEX = 0;
                FIRST_PAGE_ITEM_COUNTER = 0;
                FIRST_PAGE_COUNTER = 1;
                break;

            case 2:
                SECOND_PAGE_ITEM_INDEX = 0;
                SECOND_PAGE_ITEM_COUNTER = 0;
                SECOND_PAGE_COUNTER = 1;
                break;

            case 3:
                THIRD_PAGE_ITEM_INDEX = 0;
                THIRD_PAGE_ITEM_COUNTER = 0;
                THIRD_PAGE_COUNTER = 1;
                break;
        }

        set_down_focus_on_last_fouth_li(ulId);

        if ($("ul#" + ulId + " li").length < 1) {
            set_error_message(mainContainerClass, errorMsg, focusDepth);
        }
    }
}

// get li for second, third and search page from here
function set_grid_li(data, totalItemsFromAPI, i, tabindex, focusNamePrefix, menuId, showDuration) {
    var str = "",
        ignoreLi = 0;

    switch (tabindex) {
        case 1:
            itemCounter = FIRST_PAGE_ITEM_COUNTER;
            rowItemCounter = FIRST_ROW_ITEM_COUNTER;
            break;

        case 2:
            itemCounter = SECOND_PAGE_ITEM_COUNTER;
            rowItemCounter = SECOND_ROW_ITEM_COUNTER;
            break;

        case 3:
            itemCounter = THIRD_PAGE_ITEM_COUNTER;
            rowItemCounter = THIRD_ROW_ITEM_COUNTER;
            break;
    }

    if (showDuration) {
        //console.log("video_url public, ", data[i]['video_url'].indexOf('public'));
        if (data[i]['video_url'].indexOf('public') === -1) ignoreLi = 0;
        else ignoreLi = 1;
    }

    if (!ignoreLi) {
        switch (tabindex) {
            case 1:
                if (menuId == "AL" || menuId == "CAS") {
                    CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_COUNTER] = {};
                    CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_COUNTER] = data[i];

                } else if (menuId == "VC" || menuId == "CC") {
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_COUNTER] = [];
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_COUNTER] = data[i];

                } else if (menuId == "SE") {
                    CAT_ARRAY[SELECTED_MENU_INDEX]['search_result'][FIRST_PAGE_ITEM_COUNTER] = {};
                    CAT_ARRAY[SELECTED_MENU_INDEX]['search_result'][FIRST_PAGE_ITEM_COUNTER] = data[i];
                }
                break;

            case 2:
                if (menuId == "CC") {
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_COUNTER] = {};
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_COUNTER] = data[i];

                } else if (menuId == "VC") {
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video'][SECOND_PAGE_ITEM_COUNTER] = {};
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video'][SECOND_PAGE_ITEM_COUNTER] = data[i];
                }
                break;

            case 3:
                if (menuId == "CAS") {
                    if ($("ul#featuredRow").hasClass("active")) {
                        CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_COUNTER] = {};
                        CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_COUNTER] = data[i];
                    } else {
                        CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_COUNTER] = {};
                        CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_COUNTER] = data[i];
                    }

                } else {
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_COUNTER] = {};
                    CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_COUNTER] = data[i];
                }
                break;
        }

        focusId = focusNamePrefix + itemCounter,
            upFocus = "",
            rigthFocus = "",
            leftFocus = "",
            downFocus = "";
        //focusTrue = "";

        if (itemCounter == (totalItemsFromAPI - 1) || (rowItemCounter % 4 == 0 && itemCounter > 0)) rigthFocus = " data-sn-right='null'";
        //else rigthFocus = " data-sn-right='"+ focusNamePrefix + (itemCounter + 1) +"'";

        if (itemCounter > 0 && itemCounter % 4 != 0) {
            //leftFocus = "data-sn-left='"+ focusNamePrefix + (itemCounter - 1) +"'";
        } else leftFocus = " data-sn-left='null'";

        if (itemCounter < 4 && !$("ul#featuredRow").is(":visible")) {
            if (menuId == "SE") upFocus = " data-sn-up='#searchInputText'";
            else upFocus = " data-sn-up='null'";
        }

        title = "&nbsp;";
        imgSrc = "../images/default_bg.png";
        if ((menuId == "CC" || menuId == "VC") && tabindex == 1) {
            imgSrc = "../images/cat_default_bg.png";
            if (data[i]['category_name'] != undefined && data[i]['category_name'] != "") title = data[i]['category_name'];
            if (data[i]['images']['image'] != undefined && data[i]['images']['image'] != "") imgSrc = data[i]['images']['image'];

        } else {
            if (data[i]['title'] != undefined && data[i]['title'] != "") title = data[i]['title'];
            if (data[i]['image'] != undefined && data[i]['image'] != "") imgSrc = data[i]['image'];
        }

        str += '<li class="focusable" tabindex="' + tabindex + '" id="' + focusId + '" ' + rigthFocus + rigthFocus + upFocus + '>';
        str += '<div class="channel_inner_smallbox">';
        str += '<h4 class="channel_small_header">' + title + '</h4>';
        str += '<div class="category_smallbox" id="' + focusId + '_container">';
        str += '<div class="category_small_border category_bg" id="' + focusId + '_img_container">';
        str += '<img id="' + focusId + '_img" src="' + imgSrc + '"  onerror="image_error(this, ' + tabindex + ');">';
        str += '</div>';
        if (showDuration) str += '<div class="time_zone" id="' + focusId + '_time">' + milliseconds_to_time(data[i]['duration']) + '</div>';
        str += '</div>';
        str += '</div>';
        str += '</li>';


        switch (tabindex) {
            case 1:
                if (FIRST_ROW_ITEM_COUNTER == 4) FIRST_ROW_ITEM_COUNTER = 0;
                FIRST_ROW_ITEM_COUNTER++;
                FIRST_PAGE_ITEM_COUNTER++;
                break;

            case 2:
                if (SECOND_ROW_ITEM_COUNTER == 4) SECOND_ROW_ITEM_COUNTER = 0;
                SECOND_ROW_ITEM_COUNTER++;
                SECOND_PAGE_ITEM_COUNTER++;
                break;

            case 3:
                if (THIRD_ROW_ITEM_COUNTER == 4) THIRD_ROW_ITEM_COUNTER = 0;
                THIRD_ROW_ITEM_COUNTER++;
                THIRD_PAGE_ITEM_COUNTER++;
                break;
        }
    }

    return str;
}

// From here, we call the next page items for every page
function call_next_page(totalItemCount, focusDepth) {
    var counter = 0;
    TIME_STAMP = jQuery.now();
    page = Math.ceil(totalItemCount / PER_PAGE_LIMIT);

    switch (focusDepth) {
        case 1:
            counter = FIRST_PAGE_COUNTER;
            break;
        case 2:
            counter = SECOND_PAGE_COUNTER;
            break;
        case 3:
            counter = THIRD_PAGE_COUNTER;
            break;
    }

    if (counter <= page) {
        LOAD_NEXT_PAGE = 0;
        $(".gridContainer").append(add_loader("set_browse_all_loader_center"));

        switch (focusDepth) {
            case 1:
                if (MENU_ID == "AL" || MENU_ID == "CAS") {
                    get_all_videos_browse_video_data(MENU_ID, TIME_STAMP);

                } else if (MENU_ID == "CC" || MENU_ID == "VC") {
                    set_channels_and_video_category(TIME_STAMP, MENU_ID);
                } else if (MENU_ID == "SE") {
                    set_search_results(MENU_ID, TIME_STAMP);
                }
                break;

            case 2:
                set_categories_video_menu_second_page(MENU_ID, TIME_STAMP, page);
                break;

            case 3:
                if (MENU_ID == "CAS") {
                    if ($("ul#featuredRow").hasClass("active"))
                        channelId = CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['channel_id'];
                    else if ($("ul#allVideosGrid").hasClass("active"))
                        channelId = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['channel_id'];

                } else {
                    channelId = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['channel_id'];
                }

                set_categories_menu_third_page(channelId, MENU_ID, TIME_STAMP);
                break;
        }

    }
}

function set_error_message(container, msg, depth) {
    $(".loader").remove();
    var activeClass = "",
        firstPageClass = "";
    if ($(".cat_container").is(":visible")) firstPageClass = "first_page_error";
    if (!$(".menu_container").hasClass("active")) activeClass = "active";

    $("." + container).show().addClass(activeClass);
    $("." + container).append("<div class='error_msg " + activeClass + firstPageClass + "' focusable data-focusable-depth='" + depth + "' data-focusable-initial-focus='true'>" + msg + "</div>");

    if (activeClass != "") {
        //$.caph.focus.activate();
        //$.caph.focus.controllerProvider.getInstance().setDepth(depth);
    }
}

// Video details screeen
function set_video_details_screen() {
    var str = "",
        obj,
        title = "",
        imgSrc = "",
        description = "";

    if ($(".cat_container").hasClass("active")) {
        if ($("ul#featuredRow").hasClass("active")) {
            FIRST_PAGE_ITEM_INDEX = $('#featuredRow li:focus').index();
            obj = CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX];
        } else if ($("ul#allVideosGrid").hasClass("active"))
            obj = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX];

    } else if ($(".search_container").hasClass("active")) {
        if ($("ul#searchList").hasClass("active"))
            obj = CAT_ARRAY[SELECTED_MENU_INDEX]['search_result'][FIRST_PAGE_ITEM_INDEX];

    } else if ($(".channel_video_categories_menu_second_page_container").hasClass("active")) {
        if ($("#catList").hasClass("active")) obj = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['video'][SECOND_PAGE_ITEM_INDEX];

    } else if ($(".channel_third_page_container").hasClass("active")) {
        if (MENU_ID == "CAS") {
            if ($("ul#featuredRow").hasClass("active") || $("ul#featuredRow").hasClass("lastActive")) {
                obj = CAT_ARRAY[SELECTED_MENU_INDEX]['featured'][FIRST_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_INDEX];
            } else if ($("ul#allVideosGrid").hasClass("active") || $("ul#allVideosGrid").hasClass("lastActive"))
                obj = CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'][FIRST_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_INDEX];
        } else {
            if ($("#subcatList").hasClass("active")) obj = CAT_ARRAY[SELECTED_MENU_INDEX]['category'][FIRST_PAGE_ITEM_INDEX]['subcat'][SECOND_PAGE_ITEM_INDEX]['video'][THIRD_PAGE_ITEM_INDEX];
        }
    }

    VOD_URL = obj.video_url;
    VIDEO_ID = obj.video_id;

    $(".cat_container, .search_container, .channel_video_categories_menu_second_page_container, .channel_third_page_container").hide().removeClass("active");

    if (obj.title != undefined && obj.title != "") title = obj.title;

    imgSrc = "../images/description_default_bg.png";
    if (obj.image != undefined && obj.image != "") imgSrc = obj.image;

    if (obj.description != undefined && obj.description != "") description = obj.description.replace(/(<([^>]+)>)/ig, "");

    str += '<h2>' + title + '</h2>';
    str += '<div class="video_details_img_box focusable" id="videoDescriptionImgBox" data-sn-right="null" data-sn-up="null" data-sn-down="#videoDescriptionContentBox">';
    str += '<img src="' + imgSrc + '" class="video_thumbnail_img" onerror="image_error(this, 4);" id="videoDescriptionImg">';
    str += '<div class="time_zone time_zone_details_page" id="videoDescriptionImgTime">' + milliseconds_to_time(obj.duration) + '</div>';
    if (obj.allow_to_view == 1)
        str += '<img src="images/video_description_play_icon.png" class="video_description_play_icon" id="videoDescriptionImgPlayIcon" />';
    else
        str += '<div class="video_strip" id="videoDescriptionImgUpgradeAccount">' + UPGRADE_ACCOUNT_INFO_TEXT + '</div>';

    str += '</div>';
    str += '<div class="video_description focusable" id="videoDescriptionContentBox" data-sn-right="null" data-sn-up="#videoDescriptionImgBox" data-sn-down="null"><div id="videoDescriptionContent">' + description + '</div></div>';

    $(".video_details_container").append(str).addClass("active");
    addEventListeners();

    SN.remove('videoDetails');
    SN.add({
        id: 'videoDetails',
        selector: '#videoDetails .focusable',
        //restrict: 'self-only',
        defaultElement: '#videoDescriptionImgBox',
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
    SN.focus('videoDetails');

    return;
}

// Add loader for inner pages(second page, third page and search results page)
function add_loader(loaderClass) {
    var cssClass = "";
    if (loaderClass != undefined && loaderClass != "") cssClass = loaderClass;

    //id="loader"
    return '<div class="loader ' + cssClass + '" ><div class="circle_loader"></div></div>';
}

// Return time from seconds to format 0:00 (minutes:seconds)
function milliseconds_to_time(time) {
    if (!isNaN(time)) return Math.floor(time / 60) + ":" + (time % 60 ? min_two_digits(time % 60) : '00');
    else return '0:00';
}

//This function is used for display two digit number from 1-9
function min_two_digits(number) {
    return (number < 10 ? '0' : '') + number;
}

// Placed default image when error occured
function image_error(image, focusDepth) {
    image.onerror = "";
    if ($(".video_details_container").hasClass("active")) image.src = "../images/description_default_bg.png";

    else {
        if ((MENU_ID == "VC" || MENU_ID == "CC") && focusDepth == 1) image.src = "../images/cat_default_bg.png";
        else image.src = "../images/default_bg.png";
    }
    return true;
}

// Manage slide when move focus in between menu and right side items
function manageSlideBetweenChannelMenu() {
    $('.slider_panelbox').toggleClass('activate');
    $('.menu_container').toggleClass('pushmenu-left');
    $('.menu_container').toggleClass('pushmenu-open');
}

// Move focus from menu to right side items
function moveFocusToRightSide() {
    if (MENU_ID != "SO" && (CAT_ARRAY[SELECTED_MENU_INDEX]['featured'].length > 0 || CAT_ARRAY[SELECTED_MENU_INDEX]['allVideo'].length > 0 || CAT_ARRAY[SELECTED_MENU_INDEX]['category'].length > 0)) {
        console.log("=============== moveFocusToRightSide ===============");
        $("#menuList > li").removeClass("menu_border");
        $("ul#menuList li:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").addClass("menu_border");
        $(".menu_container").removeClass("active");

        if ($(".cat_container").is(':visible')) {
            $(".cat_container").addClass("active");
            if ($("ul#featuredRow").children().length > 0) {
                $("ul#featuredRow").addClass('active');
                SN.focus("featuredRow");
                $("#row_0_item_0").focus();

            } else if ($("ul#allVideosGrid").children().length > 0) {
                $("ul#allVideosGrid").addClass('active');
                SN.focus("allVideosGrid");
                $("#row_0_item_0").focus();
            }

        } else if ($(".channel_video_categories_menu_second_page_container").is(':visible')) {
            $(".channel_video_categories_menu_second_page_container").addClass("active");
            SN.focus("catList");
            $("#row_0_item_0").focus();

        } else if ($(".channel_third_page_container").is(':visible')) {
            $(".channel_third_page_container").addClass("active");
            SN.focus("subcatList");
            $("#row_0_item_0").focus();

        } else if ($(".video_details_container").is(':visible')) {
            $(".video_details_container").addClass("active");
            SN.focus("videoDetails");
        }

        manageSlideBetweenChannelMenu();

    } else {
        if (MENU_ID == "SE") {
            $("#menuList > li:nth(" + SELECTED_MENU_INDEX + ")").addClass("menu_border");
            $(".menu_container").removeClass("active");
            $(".cat_container").hide().removeClass("active");

            if ($(".search_container").is(':visible')) {
                $(".search_container").addClass("active");
                SN.focus("searchList");

            } else if ($(".video_details_container").is(':visible')) {
                $(".video_details_container").addClass("active");
                SN.focus("videoDetails");
            }

            //$(".search_container").show().addClass("active");
            manageSlideBetweenChannelMenu();
            //SN.focus("searchInputText");
            //document.getElementById('searchInputText').focus();
        }
    }
}

//This function is used for restrict string length
function limit_words(feedImgTitle, maxLength) {
    if (feedImgTitle != undefined) {
        feedImgTitle = feedImgTitle.trim();
        original_length = feedImgTitle.length;

        //trim the string to the maximum length
        var trimmedString = feedImgTitle.substr(0, maxLength);
        //re-trim if we are in the middle of a word
        trimmed_title = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

        if (original_length > 0 && trimmed_title == '') {
            if (feedImgTitle.length <= maxLength)
                feedImgTitle = feedImgTitle;
            else
                feedImgTitle = trimmedString + "...";
        } else {
            if (feedImgTitle.length <= maxLength)
                feedImgTitle = feedImgTitle;
            else
                feedImgTitle = trimmed_title + "...";
        }

        return feedImgTitle;
    }
}

// Start video fucntion from here
function load_video() {
    try {
        show_hide_video_container();
        console.log("start playing video");
        //setTimeout(function(){
        // Get URL for vimoe video
        if (VOD_URL.indexOf('vimeo.com') !== -1) {
            $.ajax({
                type: "GET",
                url: "https://vimeo.com/api/oembed.json?url=" + VOD_URL,
                dataType: "json",
                async: true,
                cache: false,
                timeout: REQUEST_TIMEOUT * 1000,
                success: function (results) {
                    if (results != undefined && results != "") {
                        $.ajax({
                            type: "GET",
                            url: "https://player.vimeo.com/video/" + results.video_id + "/config",
                            dataType: "json",
                            async: true,
                            cache: false,
                            timeout: REQUEST_TIMEOUT * 1000,
                            success: function (videoObj) {
                                if (videoObj != undefined && videoObj != "") {
                                    totalVideo = videoObj.request.files.progressive.length;
                                    if (totalVideo > 0) {
                                        var maxWidth = 0;
                                        for (i = 0; i < totalVideo; i++) {
                                            if (maxWidth < videoObj.request.files.progressive[i]['width']) {
                                                maxWidth = videoObj.request.files.progressive[i]['width'];
                                                VOD_URL = videoObj.request.files.progressive[i]['url'];
                                            }
                                        }
                                        playVideo();

                                    } else retry_error_popup();

                                } else retry_error_popup();

                            },
                            error: function (xhr, error) {
                                retry_error_popup();
                            }
                        });

                    } else retry_error_popup();

                },
                error: function (xhr, error) {
                    retry_error_popup();
                }
            });
        } else playVideo();

        //}, 500);
    } catch (e) {
        console.log("Error in load video: " + e);
    }
}

function playVideo() {

    var features = [],
        type = "video/";
    features = ['current', 'progress', 'duration'];

    if ((VOD_URL).indexOf(".m3u") > -1) type += "hls";
    else if ((VOD_URL).indexOf("youtube") !== -1) type += "youtube";
    else type += "mp4";

    // Add vidoe player
    SN.remove("videoSection");
    SN.add({
        id: 'videoSection',
        selector: '#videoSection .focusable',
        restrict: 'self-only',
        defaultElement: '#video_container',
    });
    SN.makeFocusable();
    SN.focus("videoSection");

    $("#video_container").html('<video controls id="videoPlayer" style="height: 1080px; width: 1920px;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');

    $("#videoURL").attr('src', VOD_URL);
    MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
        stretching: "auto",
        pluginPath: 'player/',
        features: features,
        clickToPlayPause: true,
        alwaysShowControls: true,
        customError: "&nbsp;",
        success: function (media) {
            VIDEO_PLAYER = media;
            if ((VOD_URL).indexOf("youtube") !== -1) {
                $("iframe").contents().find(".ytp-chrome-top").css('display', 'none');
                $("iframe").contents().find(".ytp-chrome-top").remove();
                $('#videoPlayer_youtube_iframe').css('height', '100%');
                $('#videoPlayer_youtube_iframe').css('width', '100%');

                setTimeout(function () {
                    media.load();
                    media.play();
                }, 100);
            } else {
                media.load();
                media.play();
            }

            media.addEventListener('loadeddata', function () {
                if ((VOD_URL).indexOf("youtube") !== -1) {
                    $("iframe").contents().find(".ytp-chrome-top").remove();
                    $('#videoPlayer_youtube_iframe').css('height', '100%');
                    $('#videoPlayer_youtube_iframe').css('width', '100%');
                }
                console.log("media load data");
            });

            media.addEventListener('playing', function () {
                console.log("media play");
                $(".mejs__overlay-play").css("display", "none");
            });

            media.addEventListener('pause', function () {
                console.log("media pause");
            });

            media.addEventListener('progress', function () {
                //console.log("3333333333333");
            });

            media.addEventListener('error', function (e) {
                console.log("error.............");
                retry_error_popup();
                media.stop();
            });

            media.addEventListener('ended', function (e) {
                console.log("end video..............." + e.message);
                closeVideo();
            });

            media.addEventListener('timeupdate', function (e) { });
        }
    });
}

var closeVideo = function () {
    console.log("close video");
    $(".circle_loader").removeClass('circle-loader-middle');
    VIDEO_PLAYER.pause();

    $("#video_container").hide().html('');
    $(".video-inner").hide();

    $(".video_details_container").addClass("active");
    $(".main-container").show();
    $(".video_container").removeClass('active');

    SN.focus('videoDetails');
};

// Open video screen
function show_hide_video_container() {
    $(".main-container").hide();
    $("#video_container").show();
}

// Open error popup when error will occur during video playing.
function retry_error_popup(playerErrorType) {
    var onlineStatus = navigator.onLine;

    if (onlineStatus) msg = "The content is currently unavailable. Please check back later.";
    else msg = NET_CONNECTION_ERR;


    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
        hide_show_modal(true, 'RETRY_CANCEL', msg);
    }
}

// This is call when video plays to increase count
function increase_video_count() {
    var oauth = get_oauth_attr();
    var url = VIDEO_COUNT_URL + VIDEO_ID + "?gutter_menu=1&language=en" + APPEND_AT_THE_END_OF_URL + oauth;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (result) {
            console.log("increase_video_count");

        },
        error: function (xhr, error) {
            console.log("error in increase_video_count");
        }
    });
}

function forward_video() {
    if ($(".video_container").hasClass("active")) {
        VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
    }
}

function rewind_video() {
    if ($(".video_container").hasClass("active")) {
        VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function set_down_focus_on_last_fouth_li(ulId) {
    $("ul#" + ulId + " > li").removeAttr("data-sn-down");
    var totalRow = Math.ceil($("ul#" + ulId + " li").length / 4);
    var lastFourItems = parseInt($("ul#" + ulId + " li").length - ((totalRow - 1) * 4));
    $("ul#" + ulId + " li:nth-last-child(-n+" + lastFourItems + ")").attr("data-sn-down", "null");
}

function scrollUpDown(scroll) {
    var $this = $('.video_description');
    var scrolled = $this.scrollTop();
    if (scroll == -5) {
        if (scrolled < 0) scrolled = scrolled - 60;
        else scrolled = scrolled + 60;

        $this.animate({
            scrollTop: scrolled
        });
    } else if (scroll == 5) {
        if (scrolled < 0) scrolled = scrolled + 60;
        else scrolled = scrolled - 60;

        $this.animate({
            scrollTop: scrolled
        });
    }
}

function move_cursor_left_side(target) {
    TEXT_LENGTH = target.value.length;
    LENGTH = target.selectionStart;
    S_START = target.selectionStart;
    LENGTH--;
    LENGTH = (LENGTH >= 0) ? LENGTH : 0;
    target.focus();
    target.setSelectionRange(S_START, LENGTH);
}

function move_cursor_right_side(target) {
    TEXT_LENGTH = target.value.length;
    LENGTH = target.selectionStart;
    S_START = TEXT_LENGTH;
    LENGTH++;
    LENGTH = (LENGTH <= TEXT_LENGTH) ? LENGTH : TEXT_LENGTH;
    target.focus();
    target.setSelectionRange(S_START, LENGTH);
}