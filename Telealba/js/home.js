function parse_main_feed() {
    setTimeout(function () {
        $("#login_loader").hide();
        $(".home_container, .header").show();
        $("#loader").hide();
        SN.focus("menu_items");
    }, 3000);
}

function change_menu_focus(id) {
    if (id == 'menu_0') $("#" + id).find("img").attr("src", "images/watch_icon_focused.png");
    else $("#menu_0").find("img").attr("src", "images/watch_icon.png");

    if (id == 'menu_1') $("#" + id).find("img").attr("src", "images/setting_icon_focused.png");
    else $("#menu_1").find("img").attr("src", "images/setting_icon.png");

    if (id != '') {
        $("li.nav_box").removeClass("selected_menu");
        $("#" + id).addClass("selected_menu");
    }

}

function hide_show_screens(className) {
    $(".home_container, .on_demand_container, .sub_category_container, .epg_container, .live_channel_container, .video_list_container, .logout_container, .video_container").removeClass("active").hide();
    if (className != '') $("." + className).addClass("active").show();
    else $("#loader").show();
    if (className == 'video_container') $(".main-container").hide();
}


function spatial_navigation_program() {

    manage_spatial_navigation("menu_container") // For menu item

    manage_spatial_navigation("homepage_container") // For homepage item

    manage_spatial_navigation("sub_category_container") // For sub category item

    manage_spatial_navigation("on_demand_container") // For homepage item

    manage_spatial_navigation("video_list_container") // For video list contianer

    manage_spatial_navigation("listing_box_programs") // For LiveGuide item

    manage_spatial_navigation("logout_container") // For logout item

    manage_spatial_navigation("search_bar_box") // For search box

    manage_spatial_navigation("search_bar") // For search item

    manage_spatial_navigation("date_container") // For date option

    manage_spatial_navigation("channel_container") // For channel number screen

    manage_spatial_navigation("program_time_container") // For epg program_time_container

    manage_spatial_navigation("parental_control_box") // For parental controll popup

}

function set_video_list_screen() {
    var totalContent = _.size(CAT_VOD_LIST);
    var str = '',
        upFocus = '',
        downFocus = '',
        leftFocus = '',
        rightFocus = '';

    VIDEO_TYPE = "CAT";
    for (i = 0; i < totalContent; i++) {
        var id = 'id="video_' + i + '" ';

        if (i < 4) upFocus = 'data-sn-up="#searchBox"';
        else upFocus = 'data-sn-up="#video_' + (i - 4) + '" ';

        if (i == totalContent) downFocus = 'data-sn-down="null"';
        else downFocus = 'data-sn-down="#video_' + (i + 4) + '" ';

        if (i == totalContent) rightFocus = ' data-sn-right="null" ';
        else rightFocus = 'data-sn-right="#video_' + (i + 1) + '" ';

        if (i == 0) leftFocus = ' data-sn-left="null" ';
        else leftFocus = 'data-sn-left="#video_' + (i - 1) + '" ';

        str += '<li class="vid_box focusable" tabindex="5" ' + id + upFocus + downFocus + rightFocus + leftFocus + '>';
        str += '<div class="vid_img focusable">';
        str += '<img src="' + APP_DOMAIN + "/xtv-ws-client" + CAT_VOD_LIST[i]['thumbnail'] + '"onerror=this.src="images/default_thumbnail_img.png">';
        str += '</div>';
        str += '<div class="vid_data">';
        str += '<div class="vidTitle"><p>' + CAT_VOD_LIST[i]['title'] + '</p></div>';
        str += '</div>';
        str += '</li>';
    }
    hide_show_screens("");
    $("#video_list").html("");
    $("#video_list").html(str);
    $("#category_heading").text("Videos(" + $("#video_list > li").length + ")");
    $("#loader").hide();
    hide_show_screens("video_list_container");
    SN.focus("video_list");
    addEventListeners();
}

function time_convert(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hours = h > 0 ? h + (h == 1 ? " hour " : " hour ") : "";
    var minutes = m > 0 ? m + (m == 1 ? " min " : " min ") : "";
    var seconds = s > 0 ? s + (s == 1 ? " sec" : " sec") : "";
    return hours + minutes + seconds;
}

//This function is used for display two digit number from 1-9
function min_two_digits(number) {
    return (number < 10 ? '0' : '') + number;
}

function set_epg_screen() {
    $("#loader").show();
    hide_show_screens("");
    if (_.size(APP_LIVE_CHANNEL) > 0) {
        var str = '',
            upFocus = '',
            downFocus = '',
            leftFocus = '',
            rightFocus = ' ';

        tabindex = 21;
        for (var i = 0; i < _.size(APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX]); i++) {
            for (var j = 0; j < _.size(APP_LIVE_CHANNEL); j++) {

                if (APP_LIVE_CHANNEL[j]["number"] == APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][i]) {
                    var id = 'id="live_0_' + i + '" ';

                    if (i == 0) upFocus = 'data-sn-up="#menu_0" ';
                    else upFocus = 'data-sn-up="#live_0_' + (i - 1) + '" ';

                    if (i == _.size(APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX])) downFocus = 'data-sn-down="null" ';
                    else downFocus = 'data-sn-down="#live_0_' + (i + 1) + '" ';

                    leftFocus = 'data-sn-left="null" ';

                    str += '<li class="channel_box focusable" tabindex="' + tabindex + '" data-index="' + i + '" ' + id + upFocus + downFocus + rightFocus + leftFocus + '>'
                    str += '<div class="channel_number">' + APP_LIVE_CHANNEL[j]['number'] + '</div>'
                    str += '<div class="channel_image_box">';
                    str += '<img src = "' + APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[j]['thumbnail'] + '" alt="' + APP_LIVE_CHANNEL[j]['title'] + '">'
                    str += '</div>';
                    str += '<div class="channel_name">' + APP_LIVE_CHANNEL[j]['title'] + '</div>'
                    str += '</li>'

                    tabindex++;
                }
            }
        }
        $("#channel_slider").empty();
        $("#channel_slider").html(str);
        extractChannelURL(0);
        addEventListeners();
    } else {
        console.log("channel data not found.");
    }
}

function set_epg_program(index, row) {
    row++;
    if (_.size(APP_PROGRAM_LIST[index]) > 0) {
        var program = APP_PROGRAM_LIST[index];
        var i = 0,
            str = '',
            check = true,
            upFocus = '',
            downFocus = '',
            leftFocus = '',
            rightFocus = '',
            marginLeft = '',
            scrollable = ' scrollable ',
            programDateMonth = '';

        var d = new Date();
        var todayMonth = d.getMonth();
        var todayDate = d.getDate();

        todayDate = (todayDate < 10 ? '0' : '') + todayDate;
        todayMonth = (todayMonth < 10 ? '0' : '') + todayMonth;

        todayDateMonth = todayDate + todayMonth;
        str += '<div class="program_list" id="tv_program_list_' + index + '" >';

        for (var j = 0; j < _.size(program); j++) {
            marginLeft = 0;
            var startDateTime = new Date(program[j]["startDateTime"]);
            var monthNum = startDateTime.getMonth();
            var dateNum = startDateTime.getDate();

            dateNum = (dateNum < 10 ? '0' : '') + dateNum;
            monthNum = (monthNum < 10 ? '0' : '') + monthNum;

            programDateMonth = dateNum + monthNum;

            if (check && index == 0) {
                check = false;
            }

            if (todayDateMonth == programDateMonth) {
                if (i == 0) {
                    var h = new Date(program[j]["startDateTime"]).getHours();
                    var m = new Date(program[j]["startDateTime"]).getMinutes();
                    marginLeft = 190 * (h * 2) + (m * 20 / 3);
                }

                if (check && index == 1) {
                    check = false;
                }

                id = 'id="live_' + index + '_' + (i + 1) + '"';
                if (index == 0) upFocus = 'data-sn-up="null" ';
                rightFocus = 'data-sn-right="#live_' + index + '_' + (i + 2) + '" ';

                if (i == 0) leftFocus = 'data-sn-left="#live_' + index + '_0" ';
                else leftFocus = 'data-sn-left="#live_' + index + '_' + i + '" ';

                str += '<div class="program_name focusable" tabindex="4"  data-index="' + index + '" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' style="width: ' + programTimePeriodInHours(program[j]["startDateTime"], program[j]["endDateTime"], program[j]["duration"]) + "px" + '; margin-left:' + marginLeft + 'px; ">';
                str += '<span>' + program[j]['title'] + '</span>';
                str += '</div>';

                i++;
            }
        }
        str += '</div>';
        setTimeout(function () {
            $("#liveGuide_items").append(str);
            addEventListeners();
            SN.focus("channel_slider");
            index++;
            if (row < 100) set_epg_program(index, row);
        }, 100);
    } else if (row < 100) set_epg_program(index + 1, row);

    if (row == 99) {
        hide_show_screens("epg_container");
        $("#loader").hide();
        SN.focus("channel_slider");
    }
}

function set_channel_screen() {
    if (TOTAL_CHANNEL_NUMBER < 1) return;

    var k = 0,
        str = '',
        upFocus = '',
        downFocus = '',
        leftFocus = '',
        rightFocus = '';
    var num = Math.ceil(APP_LIVE_CHANNEL[TOTAL_CHANNEL_NUMBER - 1]["number"] / 100);
    for (var i = 0; i <= num; i++) {
        if (_.size(APP_CHANNEL_NUMBERS[i]) > 0) {
            var id = 'id="channel_box_' + k + '" ';

            if (k < 2) upFocus = 'data-sn-up="#menu_0"';
            else upFocus = 'data-sn-up="#channel_box_' + (k - 2) + '" ';

            downFocus = 'data-sn-down="#channel_box_' + (k + 2) + '" ';

            if (k == 0) rightFocus = 'data-sn-right="#channel_box_' + (k + 1) + '" ';
            else if (k % 2 == 1) rightFocus = 'data-sn-right="null"';
            else if (k % 2 == 0) rightFocus = 'data-sn-right="#channel_box_' + (k + 1) + '" ';

            if (k == 0) leftFocus = 'data-sn-left="null"';
            else if (k % 2 == 1) leftFocus = 'data-sn-left="#channel_box_' + (k - 1) + '" ';
            else if (k % 2 == 0) leftFocus = 'data-sn-left="null"';

            str += '<li class="number_box_list focusable"  tabindex="11" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-index="' + i + '" >';
            str += '<span class="dimand_img"><img src="images/app_logo.png"></span>';
            str += '<span class="channel_number_list_name"><span>Channel Number</span></span>';
            str += '<span class="demand_val"><span id="count_' + k + '" >' + (i == 0 ? (i + 1) : (i * 100)) + '</span ></span > ';
            str += '<span class="demand_arow"><img src="images/right_arrow.png"></span>';
            str += '</li>';

            k++;
        }
    }

    $("#channel_number_box").html(str);
    addEventListeners();

}

function extractDateMonth(startDateTime) {
    var dateMonth = new Date(startDateTime);
    var dateNum = dateMonth.getDate();
    var monthNum = dateMonth.getMonth();

    dateNum = (dateNum < 10 ? '0' : '') + dateNum;
    monthNum = (monthNum < 10 ? '0' : '') + monthNum;
    return (dateNum + monthNum);
}

// Open video screen
function show_hide_video_container() {
    $(".pause-icon").hide();
    $(".video-inner").show();
    $(".video-loader").show();
    $(".home_container, .episode_container, .search_container, .video_detail_container").hide();
    $("#video_container").show();
    $("#video_container").css("display", "block");
}


// It returns current vod object while playing video
function get_video_obj() {
    var obj = "";
    switch (PAGE_INDEX) {
        case 2: obj = APP_LIVE_CHANNEL[0];
            break;

        case 3: obj = SUB_CAT_VOD_ARRAY[SELECTED_VIDEO_INDEX];
            break;
    }

    return obj;
}

function retry_error_popup(playerErrorType) {
    var onlineStatus = navigator.onLine;

    progress_bar(0);
    show_hide_video_next_previous(false);

    var errorMsg = '';
    switch (playerErrorType) {
        case "PLAYER_ERROR_NONE": errorMsg = "Operation has successfully completed."; break;
        case "PLAYER_ERROR_INVALID_PARAMETER": errorMsg = "Unable to find the parameter"; break;
        case "PLAYER_ERROR_NO_SUCH_FILE": errorMsg = "Unable to find the specified media content"; break;
        case "PLAYER_ERROR_INVALID_OPERATION": errorMsg = "Invalid API Call at the moment"; break;
        case "PLAYER_ERROR_SEEK_FAILED": errorMsg = "Failed to perform seek operation, or seek operation called during an invalid state"; break;
        case "PLAYER_ERROR_INVALID_STATE": errorMsg = "AVPlay API method was called during an invalid state"; break;
        case "PLAYER_ERROR_NOT_SUPPORTED_FILE": errorMsg = "Multimedia file format not supported"; break;
        case "PLAYER_ERROR_INVALID_URI": errorMsg = "Input URI is in an invalid format"; break;
        case "PLAYER_ERROR_CONNECTION_FAILED": errorMsg = "Failed multiple attempts to connect to the specified content server"; break;
        case "PLAYER_ERROR_GENEREIC": errorMsg = "Failed to create the display window"; break;
    }

    if (onlineStatus) msg = "The content is currently unavailable. Please check back later.";
    else msg = NET_CONNECTION_ERR;

    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
        if (errorMsg != "" && onlineStatus) msg = errorMsg;
        hide_show_modal(true, 'RETRY_CANCEL', msg);
    }
}

function remove_add_active_class(className) {
    if ($("body").find(".active").length > 0) {
        $("body").find(".active").each(function () {
            if ($(this).className != className) $(this).removeClass("active");
        });
    }
    if (className != "modal_container") {
        $(".home_container").addClass("active");
    }
    $("." + className).addClass("active");
}

function set_search_result() {
    var searchText = get_searched_text();
    var i = 0;

    $("#video_list > li").each(function () {

        if ($(this).text().toLowerCase().search(searchText) > -1) {
            $(this).show();
            $(this).addClass("visible");
            $(this).removeClass("hide-video");
            i++;
        }
        else {
            $(this).addClass("hide-video");
        }
    });
    $("#loader").hide();
    if (($("#video_list > li.visible").length > 0) && (i > 0)) {

        var totalContent = $("#video_list > li.visible").length,
            upFocus = '',
            downFocus = '',
            leftFocus = '',
            rightFocus = '';
        $("#video_list").find('.visible').each(function (j, el) {
            var id = 'video_' + j;
            if (j < 4) upFocus = '#searchBox';
            else upFocus = '#video_' + (j - 4);

            if (j == totalContent) downFocus = 'null';
            else downFocus = '#video_' + (j + 4);

            if (j == totalContent) rightFocus = 'null';
            else rightFocus = '#video_' + (j + 1);

            if (j == 0) leftFocus = 'null';
            else leftFocus = '#video_' + (j - 1);
            $("#" + id).attr("id", "");

            $(this).attr('id', id);
            $(this).attr('data-sn-up', upFocus);
            $(this).attr('data-sn-down', downFocus);
            $(this).attr('data-sn-left', leftFocus);
            $(this).attr('data-sn-right', rightFocus);
        });

        $(".result_not_found").hide();
        $("#category_heading").text("Match found (" + $("#video_list > li.visible").length + ")");
        SN.focus("video_list");
        addEventListeners();
    } else {
        $("#category_heading").text("Videos (" + $("#video_list > li").length + ")");
        $(".hide-video").removeClass("hide-video");
        $(".result_not_found").text("Match not found.").show();
        $("#searchTextShow").text("");
        $("#searchInputText").val("");
        setTimeout(function () {
            $(".result_not_found").hide('slow');
        }, 10000);
        SN.focus("#searchInputText");
        addEventListeners();
    }
}


function request_search_results() {
    searchText = get_searched_text();
    $("#searchResultBox").html("");
    $('#searchInputText').blur();
    if (searchText != "") {
        $("#loader").show();
        $("#searchTextShow").text(searchText);
        set_search_result();
    } else {
        $("#category_heading").text("Videos (" + $("#video_list > li").length + ")");
        $(".hide-video").removeClass("hide-video");
        $(".result_not_found").hide();
        $("#searchInputText").attr("placeholder", "Please enter text here.");
        SN.focus('search_bar');
    }
}

function get_searched_text() {
    return $.trim($('#searchInputText').val().toLowerCase());
}

function milliSecondToMinute(millis) {
    var minutes = Math.ceil(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes;
}

function extractChannelURL(index) {
    var url = "";
    for (var i = 0; i < _.size(APP_LIVE_CHANNEL); i++) {
        if (APP_LIVE_CHANNEL[i]["number"] == APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][index]) {
            url = APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[i]["children"] + "/?page=0&restricted=false&showAdultContent=true&size=2000";
            if (url != '') get_channel_program(APP_LIVE_CHANNEL[i]["number"], url, index); break;
        }
    }
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

function isTodaysProgram(programStart, programEnd) {
    var rtn = false;
    var start = new Date(programStart);
    var end = new Date(programEnd);

    var todaysDate = new Date();

    if (start.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) || end.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) rtn = true;
    if (rtn == true) console.log("isTodaysProgram", rtn, programStart, programEnd);

    return rtn;
}

function programTimePeriodInHours(start, end, duration) {
    var rtn = '';
    if (moment(new Date(start)).isBetween(moment().startOf('day'), moment().endOf('day')) && moment(new Date(end)).isBetween(moment().startOf('day'), moment().endOf('day'))) {
        rtn = (12 * (Math.round(duration / 60))) - 2;
    } else if (moment(new Date(start)).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'))) {
        var s = moment(end).startOf("day").valueOf();
        var diff = moment(end) - moment(s);
        var mins = Math.round(diff / (1000 * 60));
        rtn = (12 * mins) - 2;

    } else if (moment(new Date(end)).isBetween(moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day'))) {
        var m = moment(start).endOf("day").valueOf();
        var diff = moment(m) - moment(start);
        var mins = Math.round(diff / (1000 * 60));
        rtn = (12 * mins) - 2;
    }

    return rtn;
}

function extractDayAndDate(start, end) {
    var rtn = "";

    if (new Date().getTime() >= start && new Date().getTime() <= end) {
        rtn = "Now";

    } else if (moment(new Date(start)).isBetween(moment().startOf('day'), moment().endOf('day')) && moment(new Date(end)).isBetween(moment().startOf('day'), moment().endOf('day'))) {
        rtn = "Today";

    } else if (moment(new Date(start)).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')) && moment(new Date(end)).isBetween(moment().startOf('day'), moment().endOf('day'))) {
        rtn = "Today";

    } else if (moment(new Date(end)).isBetween(moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')) && moment(new Date(start)).isBetween(moment().startOf('day'), moment().endOf('day'))) {
        rtn = "Today";
        //Yesterday
    } else if (moment(new Date(start)).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')) && moment(new Date(end)).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'))) {
        rtn = "Yesterday";

    } else if (moment(new Date(end)).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')) || moment(new Date(start)).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'))) {
        rtn = "Yesterday";
        //Tomorrow
    } else if (moment(new Date(start)).isBetween(moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')) && moment(new Date(end)).isBetween(moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day'))) {
        rtn = "Tomorrow";
    } else if (moment(new Date(start)).isBetween(moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')) || moment(new Date(end)).isBetween(moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day'))) {
        rtn = "Tomorrow";
    } else {
        var daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var progStart = new Date(start),
            month = monthArray[progStart.getMonth()],
            day = daysArray[progStart.getDay()],
            date = '' + progStart.getDate(),
            hour = progStart.getHours(),
            min = progStart.getMinutes();

        var programDate = '' + progStart.getFullYear() + progStart.getMonth() + progStart.getDate();

        var d = new Date();
        var todayMonth = d.getMonth();
        var todayDate = d.getDate();
        var todayYear = d.getFullYear();

        today = '' + todayYear + todayMonth + todayDate;
        yesterday = '' + todayYear + todayMonth + (todayDate - 1);
        tomorrow = '' + todayYear + todayMonth + (todayDate + 1);

        if (date.length < 2) date = '0' + date;
        rtn = day + " " + date + " " + month;
    }
    return rtn;
}
function extractStartTimeIn24Hours(startDateTime) {
    var start = new Date(startDateTime);
    var dateNum = start.getDate();
    var monthNum = start.getMonth();
    var hours = start.getHours();
    var minutes = start.getMinutes();

    dateNum = (dateNum < 10 ? '0' : '') + dateNum;
    monthNum = (monthNum < 10 ? '0' : '') + monthNum;

    hours = (hours < 10 ? '0' : '') + hours;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    return (hours + ":" + minutes);
}

function set_tv_guide_screen() {
    append_channel_list();
    var url = "";
    SELECTED_CHANNEL_INDEX = 0;
    for (var i = 0; i < _.size(APP_LIVE_CHANNEL); i++) {
        if (APP_LIVE_CHANNEL[i]["number"] == APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][SELECTED_CHANNEL_INDEX]) {
            SELECTED_CHANNEL_NUMBER = APP_LIVE_CHANNEL[i]["number"];
            $("#channel_title").text(APP_LIVE_CHANNEL[i]["title"]);
            $("#channel_logo_img").attr("src", APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[i]['thumbnail']);
            url = APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[i]["children"] + "/?page=0&restricted=false&showAdultContent=true&size=2000";
            if (url != '') set_program_list(SELECTED_CHANNEL_NUMBER, url); break;
        }
    }
}

function append_channel_list() {
    if (_.size(APP_LIVE_CHANNEL) > 0) {
        var str = '',
            upFocus = '',
            downFocus = '',
            leftFocus = '',
            rightFocus = ' ',
            currentClass = '';

        tabindex = 21;
        for (var i = 0; i < _.size(APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX]); i++) {
            for (var j = 0; j < _.size(APP_LIVE_CHANNEL); j++) {
                if (APP_LIVE_CHANNEL[j]["number"] == APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX][i]) {
                    var ulId = ' id="live_channel_' + i + '" ';

                    var id = ' id="live_0_' + i + '" ';

                    if (i == 0) currentClass = " current ";
                    else currentClass = '';

                    if (i == 0) upFocus = ' data-sn-up="#menu_0" ';
                    else upFocus = ' data-sn-up="#live_0_' + (i - 1) + '" ';

                    if (i == _.size(APP_CHANNEL_NUMBERS[SELECTED_CHANNEL_BOX])) downFocus = 'data-sn-down="null" ';
                    else downFocus = ' data-sn-down="#live_0_' + (i + 1) + '" ';

                    rightFocus = ' data-sn-right="null" ';
                    leftFocus = ' data-sn-left="null" ';

                    str += '<li class="channel_box focusable ' + currentClass + '" tabindex="' + tabindex + '" data-index="' + i + '" ' + id + upFocus + downFocus + rightFocus + leftFocus + '>'
                    str += '<div class="channel_number">' + APP_LIVE_CHANNEL[j]['number'] + '</div>'
                    str += '<div class="channel_image_box">';
                    str += '<img src = "' + APP_DOMAIN + "/xtv-ws-client" + APP_LIVE_CHANNEL[j]['thumbnail'] + '" alt="' + APP_LIVE_CHANNEL[j]['callSign'] + '" onerror="this.src="./images/default_channel_logo.png";">'
                    str += '</div>';
                    str += '<div class="channel_name"><p>' + APP_LIVE_CHANNEL[j]['callSign'] + '</p></div>'
                    str += '</li>'
                }
            }
        }
        $("#channel_slider").empty();
        $("#channel_slider").html(str);
        hide_show_screens("epg_container");
        $("#loader").hide();
        SN.focus("channel_slider");
        addEventListeners();
    } else {
        console.log("channel data not found.");
    }
}

function set_video_details() {
    var str, title, runtime, episodeTitle, rating, rentTime, description = '';
    if (_.size(CAT_VOD_LIST) > 0 && VIDEO_TYPE == "CAT") {
        var title = CAT_VOD_LIST[FOCUSED_VIDEO_INDEX]["title"];
        var runtime = time_convert(CAT_VOD_LIST[FOCUSED_VIDEO_INDEX]["runtime"]);
        var episodeTitle = CAT_VOD_LIST[FOCUSED_VIDEO_INDEX]["episodeTitle"];
        var rating = CAT_VOD_LIST[FOCUSED_VIDEO_INDEX]["parentalLevel"]["rating"];
        var rentTime = CAT_VOD_LIST[FOCUSED_VIDEO_INDEX]["rentTime"];
        var description = CAT_VOD_LIST[FOCUSED_VIDEO_INDEX]["description"];
    }
    else if (typeof SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX] === "undefined" && VIDEO_TYPE == "SUB") {
        var title = SUB_CAT_VOD_ARRAY["title"];
        var runtime = time_convert(SUB_CAT_VOD_ARRAY["runtime"]);
        var episodeTitle = SUB_CAT_VOD_ARRAY["episodeTitle"];
        var rating = SUB_CAT_VOD_ARRAY["parentalLevel"]["rating"];
        var rentTime = SUB_CAT_VOD_ARRAY["rentTime"];
        var description = SUB_CAT_VOD_ARRAY["description"];
    }
    else if (VIDEO_TYPE == "SUB") {
        var title = SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX]["title"];
        var runtime = time_convert(SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX]["runtime"]);
        var episodeTitle = SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX]["episodeTitle"];
        var rating = SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX]["parentalLevel"]["rating"];
        var rentTime = SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX]["rentTime"];
        var description = SUB_CAT_VOD_ARRAY[FOCUSED_VIDEO_INDEX]["description"];
    }

    if (typeof title != 'undefined') str = '<div class="discription_box"><div class="video_title"><p>' + title + '</p></div>';

    if (typeof episodeTitle != 'undefined') str += '<p>' + episodeTitle + '</p>';

    if (typeof runtime != 'undefined') str += '<div class="video_desc"><span class="video_duration">' + runtime + '</span><br>';

    if (typeof rating != 'undefined') str += '<span class="video_rating">' + rating + '</span><br>';

    if (rentTime > 0 && typeof rentTime != 'undefined') str += '<span class="video_subs">Rent for:</span><br><span class="video_free">Free for ' + rentTime + ' days</span></div>';

    if (typeof description != 'undefined') str += '<div class="video_description"><p>' + description + '</p></div></div>';

    $("#videoDetail").html(str);
}


function isCathUpLive(data) {
    data["startDateTime"]
    var t = new Date(data["startDateTime"]);
    if (moment(t).isBetween(moment().subtract(6, 'days'), moment()) && data["catchupTv"] && data["endDateTime"] < new Date().getTime()) {
        return 1;
    } else return 0;
}

function convertSecondsToHM(Seconds) {
    var h = Math.floor(Seconds / 3600);
    var m = Math.floor(Seconds % 3600 / 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    return hDisplay + mDisplay;// + sDisplay;
}

function formatErrorMessage(jqXHR, exception) {
    console.log(jqXHR.status);
    if (jqXHR.status === 0) {
        return ('Not connected. Please verify your network connection.');
    } else if (jqXHR.status == 404) {
        return ('The requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        return ('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        return ('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        return ('Time out error.');
    } else if (exception === 'abort') {
        return ('Ajax request aborted.');
    } else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}

// var leftmove,rightmove;
function controlLeftArrowKeys() {
    var leftmove;
    var input = document.getElementById($(":focus").attr("id"));

    var currentpos = input.selectionStart; //getting current postion of cursor 
    if (input.value.length > 0 && currentpos > 0) {
        leftmove = currentpos - 1;
        setCaretPosition(input, leftmove);
    }
}
function controlrightArrowKeys() {
    var rightmove;
    var input = document.getElementById($(":focus").attr("id"));
    var currentpos = input.selectionStart;  //getting current postion of cursor
    if (input.value.length >= 0 && currentpos >= 0) {
        rightmove = currentpos + 1;
        setCaretPosition(input, rightmove);
    }
}

function setCaretPosition(ctrl, pos) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
        // IE8 and below
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

function create_bread_crumb() {
    var str = '',
        cls = "";
    for (var i = 0; i < _.size(VOD_BREADCRUMB); i++) {
        if (i == _.size(VOD_BREADCRUMB) - 1) cls = "active";
        if (i == 0) str += '<span class="crumb ' + cls + '">' + VOD_BREADCRUMB[i] + '</span>';
        else if (i > 0) str += '/ <span class="crumb ' + cls + '">' + VOD_BREADCRUMB[i] + '</span>';
    }
    $("#category_detail").html(str);
}

function playerState() {
    console.log("playerStart");
    var a = Date.now();
    console.log(a);
    return function Counter() {
        var b = new Date().getTime();
        console.log(b);
        if (b - a >= 60000) {
            console.log("player close");
            PLAY_VIDEO = true;
            VIDEO_PLAYER.setSrc("http://158.69.162.119:8080/Adysh2dgdf433535/index98765453652726.m3u8");
            VIDEO_PLAYER.pause();
            retry_error_popup();
        }
    }
}