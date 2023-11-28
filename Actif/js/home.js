function parse_main_feed() {
    setTimeout(function () {
        $("#loader").show();
        getCategories();
        manage_spatial_navigation("menu_container");
        navigation_func();
        $("#menu_1").addClass("selected_menu");
        $(".menu_container").addClass("minimize-sidebar");
    }, 500);
}

function navigation_func() {
    manage_spatial_navigation("category_container");
    manage_spatial_navigation("home_video_list");
    manage_spatial_navigation("dashboard_container");
    manage_spatial_navigation("subcategory_container");
    manage_spatial_navigation("video_list_container");
    manage_spatial_navigation("language_container");
    manage_spatial_navigation("keyboard_container");
    manage_spatial_navigation("category_selection");
    manage_spatial_navigation("subcategory_selection");
    manage_spatial_navigation("intensity_selection");
    manage_spatial_navigation("duration_selection");
    manage_spatial_navigation("filter_keys");
    manage_spatial_navigation("subcategory_filter_options");
    manage_spatial_navigation("intensity_filter_options");
    manage_spatial_navigation("duration_filter_options");
    manage_spatial_navigation("search_result_container");
}

function hide_show_screens(className) {
    $("#loader").show();
    $("#video_player_about_video").hide();
    if (className == 'video_container') {
        $(".video-player-container").show();
        $(".main-container").hide();
    } else $(".main-container").show();

    $(".search_container, .home_container, .dashboard_container, .subcategory_container, .video_list_container, .setting_container, .video_container, .modal_container").removeClass("active").hide();

    if (className != '') {
        $("." + className).addClass("active").show();
        $("#loader").hide();
    }
}


function request_search_results() {
    searchText = get_searched_text();
    if (searchText != "") getFilteredVideo();
    else {
        $('#searchInputText').attr("placeholder", TXT['TYPE'] + '...');
        $('#searchInputText').val("");
        SN.focus('keyboard');
    }
}

function get_searched_text() {
    return $.trim($('#searchInputText').val());
}

function resetVariables() {
    console.log("resetVariables");
    APP_SEARCH_ARRAY = [];
    APP_SEARCH_ARRAY = [...APP_DATA_ARRAY];
    $('#searchInputText').val("");
    $("#search_result").html('');
    var headArr = [TXT['CATEGORY'], TXT['SUBCATEGORY'], TXT['INTENSITY'], TXT['DURATION']]
    // var headArr = ["Category", "Subcategory", "Intensity", "Duration"];
    $(".main-filter-heading").each(function (i) {
        $(this).text(headArr[i]);
    });
    $(".selected_option").find("img").attr("src", "images/filter-unchecked.png");
    $(".selected_option").removeClass("selected_option");
    $(".filter-conatiner-list").children(":nth-child(2)").addClass("list-disabled");
}

function setCategoryFilterOptions() {
    console.log("setFilterOptions");
    var id = '',
        str = '',
        upFocus = '',
        downFocus = '',
        leftFocus = '',
        rightFocus = '';
    var total = APP_CATEGORY_ARRAY.length;

    str += ' <ul class="filter-options-list" id="category_options">';
    for (var i = 0; i < total; i++) {
        id = 'id="cat_option_' + i + '" ';

        if (i < 2) upFocus = 'data-sn-up="null"';
        else upFocus = 'data-sn-up="#cat_option_' + (i - 2) + '" ';

        if (i > (total - 2)) downFocus = 'data-sn-down="null"';
        else downFocus = 'data-sn-down="#cat_option_' + (i + 2) + '" ';

        if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
        else rightFocus = 'data-sn-right="#cat_option_' + (i + 1) + '" ';

        if (i == 0 || (i % 2 == 0)) leftFocus = 'data-sn-left="null" ';
        else leftFocus = 'data-sn-left="#cat_option_' + (i - 1) + '" ';

        str += '<li class="filter-category-list focusable"  tabindex="18" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-id="' + APP_CATEGORY_ARRAY[i]["_id"] + '"><div><img src="images/filter-unchecked.png"><h4>' + APP_CATEGORY_ARRAY[i]["name"] + '</h4></div></li>';
    }
    str += '</ul>';

    $(".category_filter_options").html(str);
    manage_spatial_navigation("category_filter_options");
    addEventListeners();
}


function setSearchRecommendedVideos(flag, data) {
    console.log(flag, data);
    var total = 0, heading = "";
    if (data.length < 1) return;

    console.log("dataaaaa ", data);

    if (flag) {
        total = APP_SEARCH_ARRAY.getVideos.length;
        // data = [...APP_SEARCH_ARRAY.getVideos];
        if (APP_SEARCH_ARRAY.hasMetadata.nextPage == 2) $("#search_result").html(""); //page = APP_SEARCH_ARRAY.hasMetadata.nextPage;
        heading = TXT['RESULT'] + "(" + APP_SEARCH_ARRAY.hasMetadata.totalVideos + ")";
    } else {
        APP_SEARCH_ARRAY = [...APP_DATA_ARRAY];
        data = [...APP_SEARCH_ARRAY];
        total = APP_SEARCH_ARRAY.length;
        heading = TXT['RECOMMENDED'] + "(" + total + ")";
        console.log(APP_SEARCH_ARRAY);
        $("#search_result").html('');
    }
    let ln = data.length;
    if (ln < 1) heading = TXT['RESULT'] + "(0)";

    console.log("data.length", ln, data);

    if (ln > 0) {
        var id = '',
            str = '',
            upFocus = '',
            downFocus = '',
            leftFocus = '',
            rightFocus = '';

        $(".search-result-heading").text(heading);
        var j = focusItemIndex = $("#search_result li").length;

        for (var i = 0; i < ln; i++) {
            id = 'id="search_' + j + '" ';
            console.log(id);
            console.log(j, i);

            if (j < 2) upFocus = 'data-sn-up="null"';
            else upFocus = '';
            // else upFocus = 'data-sn-up="#search_' + (j - 2) + '" ';

            // if (j > (total - 2)) downFocus = 'data-sn-down="null"';
            downFocus = 'data-sn-down="#search_' + (j + 2) + '" ';

            // if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
            rightFocus = 'data-sn-right="#search_' + (j + 1) + '" ';

            // if (i == 0 || (i % 2 == 0)) leftFocus = 'data-sn-left="null" ';
            // else leftFocus = 'data-sn-left="#search_' + (i - 1) + '" ';

            str += '<li class="focusable"  tabindex="21" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><div class="inner-thumbnail"><img src="' + data[i]["thumbnail"] + '" loading="lazy"><div class="inner-thumbnail-details">';
            str += '<h6>' + data[i]["title"] + '</h6><span class="badge  badge1">' + data[i]["categoryId"]["name"] + '</span><div class="duration"><img src="images/clock.png"><span>' + data[i]["duration"] + ' Minutes </span></div>';
            str += '</div></div></li>';

            j++;
        }

        $("#search_result").append(str);
        addEventListeners();

        if (!flag) SN.focus("#search_0");

        if (APP_SEARCH_ARRAY["hasMetadata"] !== undefined) {
            console.log("dssd");
            if (APP_SEARCH_ARRAY.hasMetadata.nextPage > 2) {
                console.log("inner");
                // manage_spatial_navigation("search_result_container");
                setTimeout(() => {
                    let id = '#search_' + focusItemIndex;
                    SN.focus(id);
                    // console.log(SN.focus(id));
                }, 200);
            }
        }

    } else $("#search_list").html('<div class="search-not-found">' + TXT['NO_VIDEO'] + '<div>');
}

function resuffleSubcategoryOptions(categoryId) {
    console.log("resuffleSubcategoryOptions", categoryId);
    if ($("#subcategory_options li").length < 1) {
        $("#subcategory_filter").find(".main-filter-heading").text(TXT['SUBCATEGORY']);
        $(".filter-conatiner-list").children(":nth-child(2)").addClass("list-disabled");
        return;
    }

    var id = '',
        str = '',
        upFocus = '',
        downFocus = '',
        leftFocus = '',
        rightFocus = '';

    var j = 0;

    $("#subcategory_options li").each(function (i) {
        if ($(this).attr("data-cat") != categoryId) {
            id = 'id="search_' + j + '" ';

            if (j < 2) upFocus = 'data-sn-up="null"';
            else upFocus = '';
            // else upFocus = 'data-sn-up="#search_' + (j - 2) + '" ';

            // if (j > (total - 2)) downFocus = 'data-sn-down="null"';
            // downFocus = 'data-sn-down="#search_' + (j + 2) + '" ';

            // if (i == (total - 1)) rightFocus = 'data-sn-right="null" ';
            rightFocus = 'data-sn-right="#search_' + (j + 1) + '" ';

            // if (i == 0 || (i % 2 == 0)) leftFocus = 'data-sn-left="null" ';
            // else leftFocus = 'data-sn-left="#search_' + (i - 1) + '" ';
            if ($(this).hasClass("selected_option")) {
                img = "images/filter-checked.png";
                selectedClass = " selected_option ";
            } else {
                img = "images/filter-unchecked.png";
                selectedClass = "";
            }

            str += '<li class="filter-subcategory-list focusable' + selectedClass + ' "  tabindex="19" data-cat="' + categoryId + '" data-id="' + $(this).attr("data-id") + '" ' + id + upFocus + downFocus + rightFocus + leftFocus + '><div><img src="' + img + '"><h4>' + $(this).find("h4").text() + '</h4></div></li>';

            j++;
        }
    });
    $("#subcategory_options").html(str);

    if ($("#subcategory_options li").length < 1) {
        $("#subcategory_filter").find(".main-filter-heading").text(TXT['SUBCATEGORY']);
        $(".filter-conatiner-list").children(":nth-child(2)").addClass("list-disabled");
    } else if ($("#subcategory_options li").length > 0) {
        $("#subcategory_filter").find(".main-filter-heading").text(TXT['SUBCATEGORY'] + "(" + $("#subcategory_options li.selected_option").length + ")");
        $(".filter-conatiner-list").children(":nth-child(2)").removeClass("list-disabled");
    }
}

function set_video_details() {
    var i, data = [], cls = '', intensity = "";
    console.log(PAGE_INDEX);
    if (PAGE_INDEX == 0) {
        data = [...data, ...APP_SEARCH_ARRAY.getVideos];
        i = $("#" + FIRST_LEVEL_SELECTED_ITEM).index();
    } else if (PAGE_INDEX == 1) {
        data = APP_DATA_ARRAY;
        i = $("#" + FIRST_LEVEL_SELECTED_ITEM).parent().index();
    } else if (PAGE_INDEX == 5) {
        data = APP_VIDEO_ARRAY;
        i = $("#" + THIRD_LEVEL_SELECTED_ITEM).parent().index();
    }
    console.log(data, data[i]["class"]);

    cls = "intensity-color-" + data[i]["class"];
    if (data[i]["class"] == 'high') intensity = "Orange Intensity";
    else if (data[i]["class"] == 'low') intensity = "Blue Intensity";
    else if (data[i]["class"] == 'mid') intensity = "Purple Intensity";

    $("#videoTitle").text(data[i]["title"]);
    $("#videoDesc").text(data[i]["description"]);
    $("#videoDuration").text(data[i]["duration"] + " Minutes");
    $("#videoCategory").text(data[i]["categoryId"]["name"]);
    $("#videoIntensity").html('<span class="color-circle ' + cls + '"></span><h4>' + intensity + '</h4> ');
}

function upcomingStartDate(data) {
    console.log(data);

    let startDateTime = data['startDateTime'];
    let endDateTime = data['endDateTime'];
    let recurrence = data['recurrence'];
    let repeatOn = data['repeatOn'];

    let today = new Date();

    if (recurrence == 'daily') startDateTime = new Date();
    else if (repeatOn.length > 0) {
        console.log(repeatOn);
        if (repeatOn.includes(today.getDay())) startDateTime = new Date();
        else {
            let daynum = today.getDay();
            let nextDate = new Date();
            let j = 0
            for (let i = daynum; i < 7;) {
                console.log(i);
                if (i == 6) i = -1;
                i++
                if (repeatOn.includes(i.toString())) {
                    nextDate.setDate(new Date() + j);
                    startDateTime = nextDate;
                    break;
                }
                j++
            }
        }
    }

    console.log(startDateTime);

    var d = new Date(startDateTime);
    var day = TXT['WEEK'][d.getDay()];
    var month = TXT['MONTH'][d.getMonth()];
    var date = d.getDate();
    date = date + (31 == date || 21 == date || 1 == date ? "st" : 22 == date || 2 == date ? "nd" : 23 == date || 3 == date ? "rd" : "th")

    return day + ', ' + date + ' ' + month + ' ' + d.getFullYear();

    // console.log(day + ', ' + date + ' ' + month + ' ' + d.getFullYear());
}

function convertDate(startDate) {
    console.log(startDate);
    // var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date(startDate);
    var day = TXT['WEEK'][d.getDay()];
    var month = TXT['MONTH'][d.getMonth()];
    var date = d.getDate();
    date = date + (31 == date || 21 == date || 1 == date ? "st" : 22 == date || 2 == date ? "nd" : 23 == date || 3 == date ? "rd" : "th")

    return day + ', ' + date + ' ' + month + ' ' + d.getFullYear();
}

function extractTimeInterval(start, end) {
    console.log(start, end)
    var st = new Date(start).toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
    var et = new Date(end).toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
    return st + " - " + et;
}

function dateCompare(time1, time2) {
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0], parts[1], parts[2], 0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0], parts[1], parts[2], 0);

    // returns 1 if greater, -1 if less and 0 if the same
    if (t1.getTime() > t2.getTime()) return 1;
    if (t1.getTime() < t2.getTime()) return -1;
    return 0;
}


function deactivateFilterButtons() {
    if ($(".filter-conatiner-list .selected_option").length > 0) $("#filter_keys").css("opacity", "1");
    else $("#filter_keys").css("opacity", "0.5");
}

function extractRooms(rooms) {
    const roomString = [];

    ACTIVITY_DATA.institutionInfo.rooms.map((item) => {
        if (rooms.includes(item.id)) roomString.push(item.name);
    });

    return roomString.join(', ');
}

function validateActivity(data) {
    let staffRtn = false;
    let dateRtn = false;
    const staffs = data['staffs'];

    ACTIVITY_DATA.institutionInfo.staffs.map((item) => {
        if (staffs.includes(item.id)) staffRtn = true
    });

    let startDateTime = data['startDateTime'];
    let endDateTime = data['endDateTime'];
    let recurrence = data['recurrence'];
    let repeatOn = data['repeatOn'];

    let startDate = new Date(startDateTime).setHours(0, 0, 0, 0);
    let endDate = new Date(endDateTime).setHours(0, 0, 0, 0);
    let compareDate = new Date().setHours(0, 0, 0, 0);
    // let startDate = new Date('2023-10-30T12:10:31.167Z').setHours(0, 0, 0, 0);
    // let endDate = new Date('2024-04-01T11:09:00.000Z').setHours(0, 0, 0, 0);
    // console.log(compareDate <= endDate && compareDate >= startDate);

    if (compareDate <= endDate && compareDate >= startDate) dateRtn = true;

    return (staffRtn && dateRtn);
    // return true;
}

function changeDynamicText() {
    $("#searchMenu").text(TXT['SEARCH']);
    $("#homeMenu").text(TXT['HOME']);
    $("#dashboardMenu").text(TXT['DASHBOARD']);
    $("#settingMenu").text(TXT['SETTINGS']);
    $("#logoutMenu").text(TXT['LOGOUT']);

    $("#key_space").text(TXT['SPACE']);
    $("#searchInputText").attr("placeholder", TXT['TYPE'] + '...');
    $("#filterBytext").text(TXT['FILTER_BY']);
    $("#filterByCategoryText").text(TXT['CATEGORY']);
    $("#filterBySubcategoryText").text(TXT['SUBCATEGORY']);
    $("#filterByIntensityText").text(TXT['INTENSITY']);

    $("#blueIntensityText").text(TXT['BLUE']);
    $("#purpleIntensityText").text(TXT['PURPLE']);
    $("#orangeIntensityText").text(TXT['ORANGE']);
    $("#filterByDurationText").text(TXT['DURATION']);
    $("#15Minutes").html('&lt; 15' + TXT['MINUTES']);
    $("#15To30Minutes").text('15-30' + TXT['MINUTES']);
    $("#moreThan30Minutes").html('&gt; 30' + TXT['MINUTES']);
    $("#applyFilterText").text(TXT['APPLY_FILTER']);
    $("#clearFilterText").text(TXT['CLEAR_FILTER']);
}

function blurLoadImages() {
    const blurredImageDiv = document.querySelector(".blur-load")
    const img = blurredImageDiv.querySelector("img")
    function loaded() {
        blurredImageDiv.classList.add("loaded")
    }

    if (img.complete) {
        console.log("complete");
        loaded()
    } else {
        console.log("load image");
        img.addEventListener("load", loaded)
    }
}
