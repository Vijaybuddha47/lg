var api_header = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    "Authorization": "Bearer " + localStorage.getItem("actif_token"),
};


function getCategories() {
    $("#loader").show();
    var authURL = APP_DOMAIN + "/api/v0/pro/categories/all?locale=" + localStorage.getItem("locale");
    $.ajax({
        type: 'GET',
        url: authURL,
        async: true,
        cache: false,
        headers: api_header,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        crossDomain: true,
        success: function (response) {
            console.log(response);
            if (response.status === "success") {
                if (response.data.length > 0) {
                    var total = response.data.length;
                    APP_CATEGORY_ARRAY = response.data;
                    var id = '',
                        str = '',
                        upFocus = '',
                        downFocus = '',
                        leftFocus = '',
                        rightFocus = '';
                    for (var i = 0; i < total; i++) {
                        id = 'id="cat_' + i + '" ';

                        if (i < 4) upFocus = 'data-sn-up="null"';
                        else upFocus = 'data-sn-up="#cat_' + (i - 4) + '" ';

                        if (i > 4) downFocus = '';
                        else downFocus = 'data-sn-down="#cat_' + (i + 4) + '" ';

                        if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
                        else rightFocus = 'data-sn-right="#cat_' + (i + 1) + '" ';

                        if (i == 0 || (i % 4 == 0)) leftFocus = 'data-sn-left="#menu_' + MENU_INDEX + '" ';
                        else leftFocus = 'data-sn-left="#cat_' + (i - 1) + '" ';

                        str += '<div class="col-md-3"><div class="inner-category focusable"  tabindex="9" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><div class="category-item"><h4>' + APP_CATEGORY_ARRAY[i]["name"] + '</h4></div></div></div>';
                    }
                    $("#category_list").html(str);
                    addEventListeners();

                } else $("#category_list").html("");
            } else $("#category_list").html("");
            getRecommendedVideos();
        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = TXT['CHECK_CONNECTION'];
        }
    });
}

function getRecommendedVideos() {
    var authURL = APP_DOMAIN + "/api/v0/pro/tracks/all/category/6499946277964162466723cf?currentPage=1&videosPerPage=6&sortKey=-1&locale=" + localStorage.getItem("locale");
    $.ajax({
        type: 'GET',
        url: authURL,
        async: true,
        cache: false,
        headers: api_header,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        crossDomain: true,
        success: function (response) {
            console.log(response);
            if (response.data.count > 0) {
                var total = _.size(response.data.docs);
                APP_SEARCH_ARRAY = [...response.data.docs];
                APP_DATA_ARRAY = [...response.data.docs];
                var data = [...response.data.docs];
                var id = '',
                    str = '',
                    upFocus = '',
                    downFocus = '',
                    leftFocus = '',
                    rightFocus = '';
                for (var i = 0; i < total; i++) {
                    id = 'id="item_' + i + '" ';

                    if (i < 3) upFocus = '';
                    else upFocus = 'data-sn-up="#item_' + (i - 3) + '" ';

                    if (i > (total - 3)) downFocus = 'data-sn-down="null"';
                    else downFocus = 'data-sn-down="#item_' + (i + 3) + '" ';

                    if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
                    else rightFocus = 'data-sn-right="#item_' + (i + 1) + '" ';

                    if (i == 0 || (i % 3 == 0)) leftFocus = 'data-sn-left="#menu_1" ';
                    else leftFocus = 'data-sn-left="#item_' + (i - 1) + '" ';

                    str += '<div class="col-md-4 list-box"><div class="inner-thumbnail focusable" tabindex="10" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><img src="' + data[i]["thumbnail"] + ' " loading="lazy"><div class="inner-thumbnail-details"><h6>' + data[i]["title"] + '</h6><span class="badge  badge1">' + data[i]["categoryId"]["name"] + '</span><div class="duration"><img src="images/clock.png"><span>' + data[i]["duration"] + " " + TXT["MINUTES"] + '</span></div></div></div></div> ';
                }
                $("#home_items").html(str);
                $(".main-container").show();
                hide_show_screens("home_container");
                $("#loader").hide();
                $("#remoteIns").show();
                SN.focus("home_items");
                addEventListeners();


            } else $("#home_items").html('<div class="not-found"><p>' + TXT["NO_VIDEO"] + '</p></div>');

        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = TXT['CHECK_CONNECTION'];
        }
    });
}


function getActivities() {
    var authURL = APP_DOMAIN + "/api/v0/pro/events?locale=" + localStorage.getItem("locale");;
    $.ajax({
        type: 'GET',
        url: authURL,
        async: true,
        cache: false,
        headers: api_header,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        crossDomain: true,
        success: function (response) {
            console.log(response);
            $("#dashboard_heading").html('');
            var total = response.data.infoEvents.length;
            ACTIVITY_DATA = response.data;
            if (total > 0) {
                $("#dashboard_heading").html('<h2>' + TXT["TODAY_ACTIVITY"] + ' (' + total + ')</h2>');
                var data = response.data.infoEvents;
                var j = 0,
                    id = '',
                    str = '',
                    upFocus = '',
                    downFocus = '',
                    leftFocus = '',
                    rightFocus = '';

                for (var i = 0; i < total; i++) {
                    if (!validateActivity(data[i])) continue;

                    // upcomingStartDate(data[i]);

                    id = 'id="activity_' + j + '" ';

                    if (j < 3) upFocus = 'data-sn-up="null"';
                    else upFocus = 'data-sn-up="#activity_' + (j - 3) + '" ';

                    if (j > (total - 3)) downFocus = 'data-sn-down="null"';
                    else downFocus = 'data-sn-down="#activity_' + (j + 3) + '" ';

                    if (j == (total - 1)) rightFocus = 'data-sn-right="null" ';
                    else rightFocus = 'data-sn-right="#activity_' + (j + 1) + '" ';

                    if (j == 0 || (j % 3 == 0)) leftFocus = 'data-sn-left="#menu_' + MENU_INDEX + '" ';
                    else leftFocus = 'data-sn-left="#activity_' + (j - 1) + '" ';

                    var start = data[i]["start"] + " " + data[i]["startTime"].split(" ")[0];
                    var end = data[i]["end"] + " " + data[i]["endTime"].split(" ")[0];

                    str += '<div class="col-md-4"><div class="inner-dashboard-box focusable" tabindex="11" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-item-index=' + i + '><div class="title-box bx1" style="background: ' + data[i]["backgroundColor"] + ', color: ' + data[i]["textColor"] + '"><h6>' + data[i]["title"] + '</h6></div>';
                    str += '<div class="inner-dashboard-details"><span>' + upcomingStartDate(data[i]) + '</span><h6>' + extractTimeInterval(start, end) + '</h6>';
                    str += '<ul><li><div><img src="images/video.png" loading="lazy"><span class="iconSpan">' + (data[i]["playlist"].length > 0 ? (data[i]["playlist"].length + " " + TXT["VIDEOS"]) : TXT['NO_VIDEO_INCLUDED']) + '</span></div><div><img src="images/room.png"><span class="iconSpan"> ' + (data[i]["rooms"].length > 0 ? extractRooms(data[i]["rooms"]) : TXT["NO_ROOM"]) + '</span></div></li><li><i class="fa fa-play-circle"></i></li></ul>';
                    str += '</div></div></div> ';

                    j++;
                }
                $("#activities").html(str);
            } else {
                $("#dashboard_heading").html('<h2>' + TXT["TODAY_ACTIVITY"] + ' (0)</h2>');
                $("#activities").html('<div class="not-found"><p>' + TXT["NO_EVENT"] + '</p></div>');
            }

            hide_show_screens("dashboard_container");
            addEventListeners();
            SN.focus("activities");
        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = TXT['CHECK_CONNECTION'];
        }
    });
}

function getSubcategories(categoryId) {
    console.log("getSubcategories", categoryId);
    var authURL = APP_DOMAIN + "/api/v0/pro/subcategories?categoryId=" + categoryId + "&locale=" + localStorage.getItem("locale");;
    console.log(authURL);
    var settings = {
        "url": authURL,
        "method": "GET",
        "headers": api_header
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        var idArr = FIRST_LEVEL_SELECTED_ITEM.split("_");
        APP_CATEGORY_ARRAY[idArr[1]]["sub"] = response.docs;
        var data = response.docs
        $("#subcategory_heading").html(' ');
        if (data.length > 0) {
            $("#subcategory_heading").html('<h2>' + $.trim($("#" + FIRST_LEVEL_FOCUSED_ITEM).find("h4").text()) + '</h2 > ');
            var total = data.length;
            var id = '',
                str = '',
                upFocus = '',
                downFocus = '',
                leftFocus = '',
                rightFocus = '';
            for (var i = 0; i < total; i++) {
                id = 'id="subcat_' + i + '" ';

                if (i < 4) upFocus = 'data-sn-up="#cat_4"';
                else upFocus = 'data-sn-up="#subcat_' + (i - 4) + '" ';

                if (i > (total - 4)) downFocus = 'data-sn-down="null"';
                else downFocus = 'data-sn-down="#subcat_' + (i + 4) + '" ';

                if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
                else rightFocus = 'data-sn-right="#subcat_' + (i + 1) + '" ';

                if (i == 0 || (i % 4 == 0)) leftFocus = 'data-sn-left="null" ';
                else leftFocus = 'data-sn-left="#subcat_' + (i - 1) + '" ';

                str += '<div class="col-md-3"><div class="subcatgeory-item-box focusable"  tabindex="12" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><div class="sub-category-image-box"><img src="' + data[i]["thumbnail"] + '"></div><div class="title-box text-center"><h6>' + data[i]["name"] + '</h6></div></div></div></div>';
            }
            $("#subcategories").html(str);
            hide_show_screens("subcategory_container");
            $("#loader").hide();
            addEventListeners();
            SN.focus("subcategories");
        } else {
            getVideosByCategory(categoryId);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
    });
}


function getVideosByCategory(categoryId) {
    var authURL = APP_DOMAIN + "/api/v0/pro/tracks/all/category/" + categoryId + "?currentPage=1&videosPerPage=6&sortKey=-1&locale=" + localStorage.getItem("locale");;
    $.ajax({
        type: 'GET',
        url: authURL,
        async: true,
        cache: false,
        headers: api_header,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        crossDomain: false,
        success: function (response) {
            console.log(response);
            $("#videolist_heading").html('');
            if (response.data.count > 0) {
                $("#videolist_heading").html('<h2>' + $.trim($("#" + FIRST_LEVEL_FOCUSED_ITEM).find("h4").text()) + '</h2 > ');
                var total = _.size(response.data.docs);
                APP_VIDEO_ARRAY = response.data.docs;
                var id = '',
                    str = '',
                    upFocus = '',
                    downFocus = '',
                    leftFocus = '',
                    rightFocus = '';
                for (var i = 0; i < total; i++) {
                    id = 'id="video_' + i + '" ';

                    if (i < 3) upFocus = 'data-sn-up="null"';
                    else upFocus = 'data-sn-up="#video_' + (i - 3) + '" ';

                    if (i > (total - 3)) downFocus = 'data-sn-down="null"';
                    else downFocus = 'data-sn-down="#video_' + (i + 3) + '" ';

                    if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
                    else rightFocus = 'data-sn-right="#video_' + (i + 1) + '" ';

                    if (i == 0 || (i % 3 == 0)) leftFocus = 'data-sn-left="null" ';
                    else leftFocus = 'data-sn-left="#video_' + (i - 1) + '" ';

                    str += '<div class="col-md-4"><div class="inner-thumbnail focusable" tabindex="13" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><img src="' + APP_VIDEO_ARRAY[i]["thumbnail"] + '" loading="lazy"><div class="inner-thumbnail-details"><h6>' + APP_VIDEO_ARRAY[i]["title"] + '</h6><span class="badge  badge1">' + APP_VIDEO_ARRAY[i]["categoryId"]["name"] + '</span><div class="duration"><img src="images/clock.png"><span>' + APP_VIDEO_ARRAY[i]["duration"] + " " + TXT["MINUTES"] + '</span></div></div></div></div> ';
                }
                $("#videolist").html(str);
                hide_show_screens("video_list_container");
                $("#loader").hide();
                SN.focus("videolist");
                addEventListeners();
            } else {
                $("#videolist").html('<div class="not-found"><p>' + TXT["NO_VIDEO"] + '</p></div>');
            }

        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = TXT['CHECK_CONNECTION'];
        }
    });
}

function getVideosBySubCategory(categoryId, subCategoryId) {
    var authURL = APP_DOMAIN + "/api/v0/pro/tracks/all/category/" + categoryId + "?currentPage=1&videosPerPage=6&sortKey=-1&subcategoryId=" + subCategoryId + "&locale=" + localStorage.getItem("locale");;
    $.ajax({
        type: 'GET',
        url: authURL,
        async: true,
        cache: false,
        headers: api_header,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        crossDomain: false,
        success: function (response) {
            console.log(response);
            $("#videolist_heading").html('');
            if (response.data.count > 0) {
                $("#videolist_heading").html('<h2>' + $.trim($("#" + FIRST_LEVEL_SELECTED_ITEM).find("h4").text()) + '<span class="breadcrum-arrow"> ></span> ' + $.trim($("#" + SECOND_LEVEL_SELECTED_ITEM).find("h6").text()) + '</h2 > ');
                var total = _.size(response.data.docs);
                APP_VIDEO_ARRAY = response.data.docs;
                var id = '',
                    str = '',
                    upFocus = '',
                    downFocus = '',
                    leftFocus = '',
                    rightFocus = '';
                for (var i = 0; i < total; i++) {
                    id = 'id="video_' + i + '" ';

                    if (i < 3) upFocus = 'data-sn-up="null"';
                    else upFocus = 'data-sn-up="#video_' + (i - 3) + '" ';

                    if (i > (total - 3)) downFocus = 'data-sn-down="null"';
                    else downFocus = 'data-sn-down="#video_' + (i + 3) + '" ';

                    if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
                    else rightFocus = 'data-sn-right="#video_' + (i + 1) + '" ';

                    if (i == 0 || (i % 3 == 0)) leftFocus = 'data-sn-left="null" ';
                    else leftFocus = 'data-sn-left="#video_' + (i - 1) + '" ';

                    str += '<div class="col-md-4"><div class="inner-thumbnail focusable" tabindex="14" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><img src="' + APP_VIDEO_ARRAY[i]["thumbnail"] + '" loading="lazy"> <div class="inner-thumbnail-details"><h6>' + APP_VIDEO_ARRAY[i]["title"] + '</h6><span class="badge  badge1">' + APP_VIDEO_ARRAY[i]["categoryId"]["name"] + '</span><div class="duration"><img src="images/clock.png"><span>' + APP_VIDEO_ARRAY[i]["duration"] + " " + TXT["MINUTES"] + '</span></div></div></div></div> ';
                }
                $("#videolist").html(str);
                hide_show_screens("video_list_container");
                $("#loader").hide();
                SN.focus("videolist");
                addEventListeners();
            } else {
                $("#videolist").html('<div class="not-found"><p>' + TXT["NO_VIDEO"] + '</p></div>');
            }

        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = TXT['CHECK_CONNECTION'];
            // show_error_message(msg);
        }
    });
}


function setSubcategoryFilterOptions(categoryId) {
    console.log("setSubcategoryFilterOptions", categoryId);
    var authURL = APP_DOMAIN + "/api/v0/pro/subcategories?categoryId=" + categoryId + "&locale=" + localStorage.getItem("locale");;
    console.log(authURL);

    var settings = {
        "url": authURL,
        "method": "GET",
        "headers": api_header,
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        var data = response.docs
        // $(".subcategory_options").html(' ');
        if (data.length > 0) {
            var total = data.length;
            var id = '',
                str = '',
                upFocus = '',
                downFocus = '',
                leftFocus = '',
                rightFocus = '';
            var num = $("#subcategory_options li").length;

            for (var i = 0; i < total; i++) {
                id = 'id="subcat_option_' + num + '" ';

                if (num < 2) upFocus = 'data-sn-up="null"';
                else upFocus = 'data-sn-up="#subcat_option_' + (num - 2) + '" ';

                if (num > (total - 2)) downFocus = 'data-sn-down="null"';
                else downFocus = 'data-sn-down="#subcat_option_' + (num + 2) + '" ';

                if (num == (total - 1)) rightFocus = 'data-sn-right="null" ';
                else rightFocus = 'data-sn-right="#subcat_option_' + (num + 1) + '" ';

                if (num == 0 || (num % 2 == 0)) leftFocus = 'data-sn-left="null" ';
                else leftFocus = 'data-sn-left="#subcat_option_' + (num - 1) + '" ';

                str += '<li class="filter-subcategory-list focusable"  tabindex="19" data-cat="' + categoryId + '" data-id="' + data[i]["id"] + '" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><div><img src="images/filter-unchecked.png"><h4>' + data[i]["name"] + '</h4></div></li>';
                num++;
            }

            $("#subcategory_options").append(str);
            addEventListeners();

        } else {
            console.log("empty");
            // $(".subcategory_filter_options").html('<div>Sub catgeory not available.<div>');
        }

        if ($("#subcategory_options li").length > 0 || ($.trim($('#searchInputText').val()) != '')) $(".filter-conatiner-list").children(":nth-child(2)").removeClass("list-disabled");
        else $(".filter-conatiner-list").children(":nth-child(2)").addClass("list-disabled");

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
    });
}

function getFilteredVideo() {
    console.log("getFilteredVideo");
    var param = [], str = "", page = 1;
    if (APP_SEARCH_ARRAY["hasMetadata"] !== undefined) {
        page = APP_SEARCH_ARRAY["hasMetadata"]["nextPage"];
    }
    str = "p=" + page;
    param["categories"] = [];

    searchText = get_searched_text();
    console.log(str, searchText);
    if (searchText != "") str += "&title=" + searchText;

    $(".selected_option").each(function (i) {
        // console.log($(this).attr("data-id"));
        if ($(this).hasClass("filter-category-list")) param["categories"][i] = $(this).attr("data-id");
        else if ($(this).hasClass("filter-subcategory-list")) {
            if (str.search("categories") < 0 && param["categories"].length > 0) {
                str += "&categories=" + param["categories"].join(",");
                param["categories"] = [];
            }
            str += "&subcategory=" + $(this).attr("data-id");
        }
        else if ($(this).hasClass("filter-intensity-list")) str += "&intensity=" + $(this).attr("data-id");
        else if ($(this).hasClass("filter-duration-list")) str += "&duration=" + $(this).attr("data-id");
    });

    //Add default intensity if not slected
    if (str.includes('&intensity') < 0) str += "&intensity=blue";
    //Add default duration if not slected
    if (str.includes('&duration') < 0) str += "&duration=%3C30min";

    var url = APP_DOMAIN + "/api/v0/pro/tracks/record?" + str + "&locale=" + localStorage.getItem("locale"); // + page + " & categories=" + categories + " & duration=" + duration + " & intensity=" + intensity;
    console.log("filtered URL: ", url);

    $.ajax({
        type: 'GET',
        url: url,
        async: true,
        cache: false,
        headers: api_header,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        crossDomain: true,
        success: function (response) {
            console.log(response);
            var data = [];
            if (response.data.getVideos.length > 0) {
                if (APP_SEARCH_ARRAY["hasMetadata"] !== undefined) {
                    APP_SEARCH_ARRAY.hasMetadata = response.data.hasMetadata;
                    // APP_SEARCH_ARRAY.hasMetadata.nextPage = response.data.hasMetadata.nextPage;
                    APP_SEARCH_ARRAY.getVideos = [...APP_SEARCH_ARRAY.getVideos, ...response.data.getVideos];
                    data = [...response.data.getVideos];
                }
                else {
                    APP_SEARCH_ARRAY = response.data;
                    data = [...response.data.getVideos]
                }

                setSearchRecommendedVideos(true, data);
            } else {
                $(".search-result-heading").text(TXT["RESULT"] + ' (0)');
                $("#search_result").html('<li class="search-not-found"><p>' + TXT["NO_VIDEO"] + '</p></li>');
            }
        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = TXT['CHECK_CONNECTION'];
            // show_error_message(msg);
        }
    });
}



