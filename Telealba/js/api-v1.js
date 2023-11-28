function content_list_Api_size_1000() {
    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/content/list/category/1?page=0&restricted=false&showAdultContent=false&size=2000",
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
    };


    $.ajax(settings).done(function (response, statusCode) {
        var totalItems = response.contents.content.length;
        APP_VOD_CONTENT = response.contents.content;
        if (totalItems > 0) {
            var str = '',
                upFocus = '',
                downFocus = '',
                leftFocus = '',
                rightFocus = '';

            for (i = 0; i < totalItems; i++) {
                var id = 'id="vod_cat_' + i + '" ';

                if (i < 2) upFocus = ' data-sn-up="#menu_0" ';
                else upFocus = ' data-sn-up="#vod_cat_' + (i - 2) + '" ';

                if (i == totalItems) downFocus = ' data-sn-down="null" ';
                else downFocus = ' data-sn-down="#vod_cat_' + (i + 2) + '" ';

                rightFocus = ' data-sn-right="#vod_cat_' + (i + 1) + '" ';
                leftFocus = 'data-sn-left="#vod_cat_' + (i - 1) + '" ';

                str += '<li class="demand_ind_bx focusable"  tabindex="3" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-id="' + APP_VOD_CONTENT[i]["contentId"] + '" >'
                str += '<span class="dimand_img"><img src="' + APP_DOMAIN + "/xtv-ws-client" + APP_VOD_CONTENT[i]['thumbnail'] + '"></span>'
                str += '<span class="demand_name"><span>' + APP_VOD_CONTENT[i]['title'] + '</span></span>'
                str += '<span class="demand_val"><span id="count_' + i + '" >...</span ></span > '
                str += '<span class="demand_arow"><img src="images/right_arrow.png"></span>'
                str += '</li>'
            }
            $("#ondemand_items").html(str);
            $("#sub_category_list").empty();
            NUM = 0;
            get_vod_children();
            addEventListeners();
        } else {
            $("#ondemand_items").html('<div class="not_found">Data not found.</div>');
        }
    }).fail(function (xhr, err) {
        console.log(xhr, err);
        var responseTitle = $(xhr.responseText).filter('title').get(0);
        var msg = formatErrorMessage(xhr, err)
        hide_show_modal(true, 'RETRY_EXIT', msg);
    });
}

function checkVideoURL() {
    $.ajax({
        type: "GET",
        url: VOD_URL,
        async: true,
        cache: false,
        headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US', 'UA-Resolution': 240 },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            setTimeout(function () {
                hide_show_screens("video_container");
                load_video();
            }, 200);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
}

function get_vod_children() {
    if (NUM < _.size(APP_VOD_CONTENT)) {

        var url = APP_DOMAIN + "/xtv-ws-client" + APP_VOD_CONTENT[NUM]['children'] + "?page=0&restricted=false&showAdultContent=false&size=1000";
        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
            "dataType": "JSON",
        };

        $.ajax(settings).done(function (response, statusCode) {
            if (NUM == _.size(APP_VOD_CONTENT) - 1) {
                $("#loader").hide();
                hide_show_screens("on_demand_container");
                SN.focus("ondemand_items");
            } else {
                NUM++;
                if (NUM < _.size(APP_VOD_CONTENT)) get_vod_children();
            }
        }).fail(function (error) {
            NUM++;
            if (NUM < _.size(APP_VOD_CONTENT)) get_vod_children();
        });
    }
}

function set_category_screen(index) {
    hide_show_screens("");
    $("#loader").show();
    var url = APP_DOMAIN + "/xtv-ws-client" + APP_VOD_CONTENT[index]['children'] + "?page=0&restricted=false&showAdultContent=false&size=1000";
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
    };

    $.ajax(settings).done(function (response) {
        APP_SUB_CAT_DATA = {};
        CAT_VOD_LIST = {};
        VIDEO_NUM = 0;
        var data = SUB_CATEGORY_ARRAY = response.contents.content;

        if (_.size(data) > 0) {
            var str = '',
                upFocus = '',
                downFocus = '',
                leftFocus = '',
                rightFocus = '';

            for (i = 0; i < _.size(data); i++) {
                if (typeof data[i] === 'undefined' && data['contentType'] === 'CATEGORY') {
                    var id = 'id="sub_cat_' + i + '" ';

                    if (i < 2) upFocus = 'data-sn-up="#menu_0"';
                    else upFocus = 'data-sn-up="#sub_cat_' + (i - 2) + '" ';

                    if (i == _.size(data)) downFocus = 'data-sn-down="null"';
                    else downFocus = 'data-sn-down="#sub_cat_' + (i + 2) + '" ';

                    rightFocus = 'data-sn-right="#sub_cat_' + (i + 1) + '" ';
                    leftFocus = 'data-sn-left="#sub_cat_' + (i - 1) + '" ';

                    str += '<li class="demand_ind_bx focusable"  tabindex="7" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-id="' + data["contentId"] + '"  data-type="SUB">';
                    str += '<span class="dimand_img"><img src="' + APP_DOMAIN + "/xtv-ws-client" + data['thumbnail'] + '"></span>';
                    str += '<span class="demand_name"><span>' + data['title'] + '</span></span>';
                    str += '<span class="demand_val"><span id="count_' + i + '" >...</span ></span > ';
                    str += '<span class="demand_arow"><img src="images/right_arrow.png"></span>';
                    str += '</li>';

                    if (i == 0) {
                        $("#sub_category_list").empty();
                        $("#sub_category_heading").text("");
                        $("#sub_category_list").html(str);

                        $("#loader").hide();
                        $("#sub_category_heading").text(APP_VOD_CONTENT[index]['title']);
                        hide_show_screens("sub_category_container");
                        SN.focus("sub_category_list");
                        addEventListeners();

                        break;
                    }

                } else if (data[i]['contentType'] == 'ASSET') {
                    CAT_VOD_LIST[VIDEO_NUM] = data[i];
                    VIDEO_NUM++;
                } else {
                    APP_SUB_CAT_DATA[i] = data[i];

                    var id = 'id="sub_cat_' + i + '" ';

                    if (i < 2) upFocus = 'data-sn-up="#menu_0"';
                    else upFocus = 'data-sn-up="#sub_cat_' + (i - 2) + '" ';

                    if (i == _.size(data)) downFocus = 'data-sn-down="null"';
                    else downFocus = 'data-sn-down="#sub_cat_' + (i + 2) + '" ';
                    rightFocus = 'data-sn-right="#sub_cat_' + (i + 1) + '" ';
                    leftFocus = 'data-sn-left="#sub_cat_' + (i - 1) + '" ';

                    str += '<li class="demand_ind_bx focusable"  tabindex="7" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-id="' + data[i]["contentId"] + '" data-type="SUB">';
                    str += '<span class="dimand_img"><img src="' + APP_DOMAIN + "/xtv-ws-client" + data[i]['thumbnail'] + '"></span>';
                    str += '<span class="demand_name"><span>' + data[i]['title'] + '</span></span>';
                    str += '<span class="demand_val"><span id="count_' + i + '" >...</span ></span > ';
                    str += '<span class="demand_arow"><img src="images/right_arrow.png"></span>';
                    str += '</li>';
                }
            }

            if (_.size(APP_SUB_CAT_DATA) > 0) {
                $("#sub_category_list").empty();
                $("#sub_category_heading").text("");
                $("#sub_category_list").html(str);
                $("#loader").hide();
                $("#sub_category_heading").text(APP_VOD_CONTENT[index]['title']);
                hide_show_screens("sub_category_container");
                SN.focus("sub_category_list");
                addEventListeners();
            } else if (_.size(APP_SUB_CAT_DATA) < 1 && _.size(CAT_VOD_LIST) > 0) {
                $("#sub_category_list").empty();
                $("#sub_category_heading").text("");
                set_video_list_screen();
                addEventListeners();
            }

            if (_.size(CAT_VOD_LIST) > 0) {
                create_other_sub_category();
                addEventListeners();
            }

        } else {
            $("#sub_category_list").html('<div class="not_found">Data not found.</div>');
        }
    }).fail(function (xhr, err) {
        console.log(xhr, err);
        var responseTitle = $(xhr.responseText).filter('title').get(0);
        var msg = formatErrorMessage(xhr, err)
        hide_show_modal(true, 'RETRY_EXIT', msg);
    });

}

function create_other_sub_category() {
    var str = '',
        upFocus = '',
        downFocus = '',
        leftFocus = '',
        rightFocus = '';

    var i = $("#sub_category_list li").last().index() + 1;
    var id = 'id="sub_cat_' + i + '" ';

    if (i < 2) upFocus = 'data-sn-up="#menu_0"';
    else upFocus = 'data-sn-up="#sub_cat_' + (i - 2) + '" ';
    downFocus = 'data-sn-down="null"';
    rightFocus = 'data-sn-right="null"';
    leftFocus = 'data-sn-left="#sub_cat_' + (i - 1) + '" ';

    str += '<li class="demand_ind_bx focusable"  tabindex="7" ' + id + upFocus + downFocus + rightFocus + leftFocus + ' data-id="0" data-type="CAT">';
    str += '<span class="dimand_img"><img src="' + APP_DOMAIN + '"/xtv-ws-client/other.png" onerror=this.src="images/default_thumbnail_img.png"></span>';
    str += '<span class="demand_name"><span>Other</span></span>';
    str += '<span class="demand_val"><span id="count_' + i + '" >' + _.size(CAT_VOD_LIST) + '</span ></span > ';
    str += '<span class="demand_arow"><img src="images/right_arrow.png"></span>';
    str += '</li>';

    $("#sub_category_list").append(str);
    addEventListeners();
}

function get_sub_category_videos(index) {
    hide_show_screens("");
    $("#loader").show();
    if (index < _.size(SUB_CATEGORY_ARRAY)) {
        var children = '';
        if (typeof SUB_CATEGORY_ARRAY[index] === 'undefined') children = SUB_CATEGORY_ARRAY["children"];
        else children = SUB_CATEGORY_ARRAY[index]["children"];

        var url = APP_DOMAIN + "/xtv-ws-client" + children + "?page=0&restricted=false&showAdultContent=false&size=1000";

        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
            "dataType": "JSON",
        };

        $.ajax(settings).done(function (response, statusCode) {
            SUB_CAT_VOD_ARRAY = response.contents.content;
            var totalContent = _.size(SUB_CAT_VOD_ARRAY);
            var str = '',
                upFocus = '',
                downFocus = '',
                leftFocus = '',
                rightFocus = '';

            for (i = 0; i < totalContent; i++) {

                var id = ' id="video_' + i + '" ';

                if (i < 4) upFocus = ' data-sn-up="#searchBox" ';
                else upFocus = ' data-sn-up="#video_' + (i - 4) + '" ';

                if (i == totalContent) downFocus = ' data-sn-down="null"';
                else downFocus = ' data-sn-down="#video_' + (i + 4) + '" ';

                if (i == totalContent) rightFocus = ' data-sn-right="null" ';
                else rightFocus = ' data-sn-right="#video_' + (i + 1) + '" ';

                if (i == 0) leftFocus = ' data-sn-left="null" ';
                else leftFocus = ' data-sn-left="#video_' + (i - 1) + '" ';

                if (typeof SUB_CAT_VOD_ARRAY[i] === 'undefined') {
                    str += '<li class="vid_box focusable" tabindex="5" ' + id + upFocus + downFocus + rightFocus + leftFocus + '>'
                    str += '<div class="vid_img focusable">'
                    str += '<img src="' + APP_DOMAIN + "/xtv-ws-client" + SUB_CAT_VOD_ARRAY['thumbnail'] + '" onerror=this.src="images/default_thumbnail_img.png">'
                    str += '<div class="vid_data">'
                    str += '<div class="vidTitle"><p>' + SUB_CAT_VOD_ARRAY['title'] + '</p></div>'
                    str += '</div>'
                    str += '</div>'
                    str += '</li>';

                    break;
                } else {
                    str += '<li class="vid_box focusable" tabindex="5" ' + id + upFocus + downFocus + rightFocus + leftFocus + '>'
                    str += '<div class="vid_img focusable">'
                    str += '<img src="' + APP_DOMAIN + "/xtv-ws-client" + SUB_CAT_VOD_ARRAY[i]['thumbnail'] + '"onerror=this.src="images/default_thumbnail_img.png">'
                    str += '<div class="vid_data">'
                    str += '<div class="vidTitle"><p>' + SUB_CAT_VOD_ARRAY[i]['title'] + '</p></div>'
                    str += '</div>'
                    str += '</div>'
                    str += '</li>'
                }
            }
            hide_show_screens("");
            $("#video_list").html("");
            $("#video_list").html(str);
            $("#category_heading").text("Videos(" + $("#video_list > li").length + ")");
            $("#loader").hide();
            hide_show_screens("video_list_container")
            SN.focus("video_list");
            addEventListeners();
        }).fail(function (xhr, err) {
            console.log(xhr, err);
            var responseTitle = $(xhr.responseText).filter('title').get(0);
            var msg = formatErrorMessage(xhr, err)
            hide_show_modal(true, 'RETRY_EXIT', msg);
        });
    }
}

function get_live_channel() {
    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/content/list/live_tv/2?page=0&restricted=false&showAdultContent=true&size=2000",
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
        "crosssDomain": "true",
    };

    $.ajax(settings).done(function (response, statusCode) {
        TOTAL_CHANNEL_NUMBER = response.contents.content.length;
        APP_LIVE_CHANNEL = response.contents.content;

        var totalChannelBox = Math.ceil(APP_LIVE_CHANNEL[TOTAL_CHANNEL_NUMBER - 1]["number"] / 100);
        for (var j = 0; j <= totalChannelBox; j++) {
            var min = 100 * j, max = min + 99;
            APP_CHANNEL_NUMBERS[j] = [];
            for (var i = 0; i < TOTAL_CHANNEL_NUMBER; i++) {
                var number = APP_LIVE_CHANNEL[i]["number"];
                if (min <= number && number < max) {
                    APP_CHANNEL_NUMBERS[j].push(number);
                }
            }
        }
        set_channel_screen();
    }).fail(function (xhr, err) {
        console.log(xhr, err);
        var responseTitle = $(xhr.responseText).filter('title').get(0);
    });
}

function set_program_list(number, url) {
    $("#programlist_overlay").show();
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
        "crosssDomain": "true",
    };

    $.ajax(settings).done(function (response) {
        var str = "",
            timeClass = " live ";
        if (_.size(response.contents)) {
            var total = response.contents.content.length;
            APP_PROGRAM_LIST[number] = response.contents.content;
            if (total > 0) {
                var program = APP_PROGRAM_LIST[number];
                var catchUp = '',
                    catchUpLive = '',
                    dataIndex = '',
                    upFocus = '',
                    downFocus = '',
                    leftFocus = '',
                    rightFocus = '';
                for (var i = 0; i < _.size(program); i++) {
                    var catchUpPlay = isCathUpLive(program[i]);
                    var id = ' id="program_' + i + '" ';

                    timeClass = "";
                    todayUnixTime = new Date().getTime();
                    if (todayUnixTime >= program[i]["startDateTime"] && todayUnixTime <= program[i]["endDateTime"]) {
                        timeClass += " live ";
                        $("#current_program").text(program[i]["title"]);
                        var dayTime = moment(program[i]["startDateTime"]).format('dddd') + ", " + moment(program[i]["startDateTime"]).format('LL') + " " + moment(program[i]["startDateTime"]).format('HH:mm');
                        $("#current_program_time").text(dayTime + " - " + moment(program[i]["endDateTime"]).format('HH:mm'));
                        var rating = program[i]["parentalLevel"]["rating"];
                        var info = convertSecondsToHM(program[i]["duration"]);
                        info += rating ? "<b>" + rating + "</b>" : '';
                        $("#programInfo").html(info);
                        $("#current_program_desc").text(program[i]["description"]);
                    }

                    if (i == 0) upFocus = ' data-sn-up="null" ';
                    else upFocus = ' data-sn-up="#program_' + (i - 1) + '" ';

                    if (i == _.size(program)) downFocus = ' data-sn-down="null" ';
                    else downFocus = ' data-sn-down="#program_' + (i + 1) + '" ';

                    leftFocus = ' data-sn-left="null" ';
                    rightFocus = ' data-sn-right="null" ';
                    dataIndex = ' data-index = "' + i + '" ';

                    if (catchUpPlay) {
                        catchUpLive = " live_catchup ";
                        catchUp = '<img class="catch_up" src="images/catchup.png" alt="CatchUp">';
                    }
                    else catchUpLive = catchUp = '';

                    str += '<li class="program-name focusable ' + timeClass + catchUpLive + ' " tabindex="30" ' + id + upFocus + downFocus + rightFocus + leftFocus + dataIndex + '>';
                    str += '<div class="time_box">' + catchUp + '<span class="program_date">' + extractDayAndDate(program[i]['startDateTime'], program[i]['endDateTime']) + '</span>' + extractStartTimeIn24Hours(program[i]['startDateTime']) + ' - </div>';
                    str += ' <div class="program_title"> ' + program[i]['title'] + '</div>';
                    str += '</li>';
                }

            } else {
                $("#current_program").text($("#channel_title").text());
                $("#current_program_time").text(moment().format('LLLL'));

                str += '<li class="program-name focusable ' + timeClass + ' " tabindex="30" id="program_0" data-sn-right="null" data-sn-up="null" data-sn-down="null">';
                str += '<div class="time_box">' + moment().format('LT') + '</div>';
                str += ' <div class="program_title"> ' + $("#channel_title").text() + '</div>';
                str += '</li>';
            }
        } else {
            $("#current_program").text($("#channel_title").text());
            $("#current_program_time").text(moment().format('LLLL'));

            str += '<li class="program-name focusable ' + timeClass + ' " tabindex="30" id="program_0" data-sn-right="null" data-sn-up="null" data-sn-down="null">';
            str += '<div class="time_box">' + moment().format('LT') + '</div>';
            str += ' <div class="program_title"> ' + $("#channel_title").text() + '</div>';
            str += '</li>';
        }
        $("#program_container").html(str);
        addEventListeners();
        $("#programlist_overlay").hide();
        var liveId = $("#program_container").find(".live").attr("id");
        if (liveId === undefined) {
            $("#current_program").text(program[total - 1]["title"]);
            var dayTime = moment(program[total - 1]["startDateTime"]).format('dddd') + ", " + moment(program[total - 1]["startDateTime"]).format('LL') + " " + moment(program[total - 1]["startDateTime"]).format('HH:mm');
            $("#current_program_time").text(dayTime + " - " + moment(program[total - 1]["endDateTime"]).format('HH:mm'));
            var rating = program[total - 1]["parentalLevel"]["rating"];
            var info = convertSecondsToHM(program[total - 1]["duration"]);
            info += rating ? "<b>" + rating + "</b>" : '';
            $("#programInfo").html(info);
            $("#current_program_desc").text(program[total - 1]["description"]);
            SN.focus("#program_" + (total - 1));
        } else SN.focus("#" + liveId);

        SN.focus("channel_slider");
    }).fail(function (xhr, err) {
        console.log(xhr, err);
        var responseTitle = $(xhr.responseText).filter('title').get(0);
        var msg = formatErrorMessage(xhr, err)
        hide_show_modal(true, 'RETRY_EXIT', msg);
    });
}

function set_logout_menu_data() {
    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/userdata/customerByMac/" + localStorage.getItem("mac_address"),
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
    };

    $.ajax(settings).done(function (response) {
        var firstName = response.customerInfo.firstName;
        var lastName = response.customerInfo.lastName;
        var userinfo = firstName + " " + lastName;
        $("#login_username").text(userinfo);
        localStorage.setItem("telealba_app_user_name", userinfo);
    }).fail(function (xhr, err) {
        console.log(xhr, err);
        var responseTitle = $(xhr.responseText).filter('title').get(0);
        var msg = formatErrorMessage(xhr, err)
        hide_show_modal(true, 'RETRY_EXIT', msg);
    });
}

function logoutfromApp() {
    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/login/logout",
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
    };

    $.ajax(settings).done(function (response) {
        var d = new Date();
        d.setTime(d.getTime());
        var expires = "expires=" + d.toUTCString();
        document.cookie = 'JSESSIONID' + "=" + "" + ";/xtv-ws-client;" + expires;
        window.location.href = "login.html";
    }).fail(function (xhr, err) {
        console.log(xhr, err);
        var responseTitle = $(xhr.responseText).filter('title').get(0);
        var msg = formatErrorMessage(xhr, err)
        hide_show_modal(true, 'RETRY_EXIT', msg);
    });
}


