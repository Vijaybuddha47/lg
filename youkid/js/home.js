function get_app_dynamic_val() {
    console.log("app dynamic value");
    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + "/app-config",
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            if (_.size(data) > 0) {
                APP_CONFIG_DATA = data;
                $(".splash-screen").hide();
                requestAppStore();
            } else console.log("app-config data not found.");
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function generate_pin_code() {
    console.log("generate_pin_code");
    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + "/pin/generate",
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            if (_.size(data) > 0) {
                PIN_CODE = data.pin;
                $("#auth_code").text(PIN_CODE)
                countdown("count_down", 10, 0, true);
            } else {
                console.log("Pin code not recieved.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function countdown(elementName, minutes, seconds, flag = false) {
    if (!flag) {
        authetication_time_clear();
        return;
    }
    var element, endTime, hours, mins, time;

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        TIME_COUNTER_LEFT = endTime - (+new Date);
        if (TIME_COUNTER_LEFT < 300) {
            authetication_time_clear();
            document.getElementById("auth_code").innerHTML = '';
            element.innerHTML = "הזמן נגמר";

        } else {

            var pin = Number($("#auth_code").text());
            if (PIN_CODE != '') {
                $.ajax({
                    type: "GET",
                    url: APP_API_DOMAIN + "/pin/activate?pin=" + PIN_CODE,
                    async: true,
                    // cache: false,
                    timeout: REQUEST_TIMEOUT * 1000,
                    success: function (data) {
                        if (data.verified) {
                            VERIFIED_ACCOUNT = data.verified;
                            authetication_time_clear();
                            clearInterval(TIME_OUT);
                            TIME_OUT = null;
                            var todayTime = new Date().getTime();
                            EXPIRY_DATE = data.expiration * 1000;

                            if (EXPIRY_DATE > todayTime) {
                                localStorage.setItem("youkid_expiry", EXPIRY_DATE);
                                get_video_url();

                            }
                            else console.log("expired");

                        } else {
                            time = new Date(TIME_COUNTER_LEFT);
                            hours = time.getUTCHours();
                            mins = time.getUTCMinutes();
                            element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
                            authetication_time();
                        }
                    },
                    error: function (xhr, error) {
                        console.log("error", error);
                        time = new Date(TIME_COUNTER_LEFT);
                        hours = time.getUTCHours();
                        mins = time.getUTCMinutes();
                        element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
                        authetication_time();
                    }
                });
            }

        }
    }

    function authetication_time() {
        if (TIME_COUNTER_LEFT > 300) TIME_OUT = setTimeout(updateTimer, time.getUTCMilliseconds() + 300);
    }

    function authetication_time_clear() {
        clearTimeout(TIME_OUT);
        TIME_OUT = null;
        TIME_COUNTER_LEFT = 0;
        console.log("clear set time out");
    }

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 300;
    updateTimer();

}



function get_home_page_tags() {
    console.log("get_home_page_tags");
    $("#loader").show();

    APP_HOME_PAGE_TAG = [
        {
            "key": "cat_shows",
            "title": "הצגות"
        },
        {
            "key": "cat_movies",
            "title": "סרטים"
        },
        {
            "key": "cat_songs",
            "title": "שירים"
        },
        {
            "key": "cat_education",
            "title": "ללמוד בכיף"
        },
        {
            "key": "cat_logout",
            "title": "ללמוד בכיף"
        },
        {
            "key": "cat_exit",
            "title": "ללמוד בכיף"
        }
    ];

    get_home_page_featured_data();
    get_home_page_data();
    get_all_talent();
    addEventListeners();
}

function get_home_page_data() {
    console.log("get_home_page_data");
    var url = APP_API_DOMAIN + "/home-categories?age=0";
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.length > 0) {
                set_homepage_data(response);
            } else {
                console.log("Data not found.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
            get_home_page_data();
        }
    });
}

function set_homepage_data(data) {
    console.log("set_homepage_data");
    if (data.length > 0) {
        var str = "",
            tabindex = 'tabindex="6"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageItem";
        var check = true;


        for (var k = 0; k < data.length; k++) {

            if (check) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
                check = false;
            } else upFocus = 'data-sn-up= "#home_page_item_' + HOME_PAGE_ROW - 1 + '_0"';

            str += '<li class="home_page_listing" data-row="' + HOME_PAGE_ROW + '">';
            str += '<span class="category_list_heading">' + data[k]["tag"]["title"] + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_item_' + HOME_PAGE_ROW + '_0" data-id="' + HOME_PAGE_ROW + '" ' + upFocus + ' data-sn-left="#home_page_item_' + HOME_PAGE_ROW + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageList_' + HOME_PAGE_ROW + '" >';

            HOME_PAGE_DATA[HOME_PAGE_ROW] = data[k]["videos"];

            $.each(data[k]["videos"], function (i, el) {
                if (i < 5) {
                    i++;
                    id = 'id="home_page_item_' + HOME_PAGE_ROW + '_' + i + '"';

                    var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                    APP_HOME_PAGE_MIXED_DATA[extractUrlLastString(el.uri)] = el;

                    leftFocus = "";
                    if (i == _.size(data["videos"])) leftFocus = ' data-sn-left="null"';
                    else leftFocus = ' data-sn-left="#home_page_item_' + HOME_PAGE_ROW + '_' + (i + 1) + '"';

                    rightFocus = "";
                    if (i == 1) rightFocus = ' data-sn-right="#home_page_item_' + HOME_PAGE_ROW + '_0"';
                    else rightFocus = ' data-sn-right="#home_page_item_' + HOME_PAGE_ROW + '_' + (i - 1) + '"';

                    upFocus = "";
                    if (HOME_PAGE_ROW > 0) upFocus = ' data-sn-up="#home_page_item_' + (HOME_PAGE_ROW - 1) + '_' + i + '"';
                    if (HOME_PAGE_ROW == 0) upFocus = ' data-sn-up="#playBtn" ';

                    str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                    str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                    str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                    str += '</li>';
                }
            });
            HOME_PAGE_ROW++;
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';
        }

        $("#loader").hide();

        if ($("#homePageItem .tile-grid").length == 0) $("#" + containerId).html('');
        $("#" + containerId).append(str);
        addEventListeners();


    } else console.log("home page data not found");

    if ($("#homePageItem .tile-grid").length == 0) $("#loader").hide();
}

function get_home_page_featured_data() {
    console.log("home_page_featured_data");
    var part = '';
    if (SELECTED_MENU_TYPE == "HOME") part = "/featured?age=0 ";
    else part = '/featured-category?category=' + SELECTED_MENU_TYPE + '&age=0';

    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + part,
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.total > 0) {
                console.log("featured data");
                APP_HOME_FEATURED_LIST = {};
                HOME_PAGE_FEATURED_DATA = {};
                $.each(response.data, function (index, element) {
                    var id = extractUrlLastString(element.uri);
                    HOME_PAGE_FEATURED_DATA[id] = element;
                    APP_HOME_PAGE_MIXED_DATA[id] = element;
                    APP_HOME_FEATURED_LIST[index] = id;
                    if (index == 0) {
                        SELECTED_HOME_FEATURED_DATA_ID = id;
                        set_background(element.pictures.sizes[element.pictures.sizes.length - 1]['link']);
                        $("#favBtn").attr("data-id", id);
                        $("#playBtn").attr("data-id", id);
                        $("#leftArrow").attr("data-id", index + 1); //Next 
                        $("#loader").hide();
                        if (SELECTED_MENU_TYPE == "HOME") SN.focus("#playBtn");//SN.focus("homepage_header");
                        else SN.focus("homepageButton");
                    } else if (index == (response.total - 1)) $("#rightArrow").attr("data-id", index);// Previous

                });

            } else {
                console.log("data not found.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function get_category_featured_data() {
    console.log("home_page_featured_data");
    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + '/featured-category?category=' + SELECTED_MENU_TYPE + '&age=0',
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.total > 0) {
                $.each(response.data, function (index, element) {
                    var id = extractUrlLastString(element.uri);
                    HOME_PAGE_FEATURED_DATA[id] = element;
                    APP_HOME_PAGE_MIXED_DATA[id] = element;
                    if (SELECTED_MENU_TYPE == 'cat_shows') {
                        SHOWS_FEATURED_DATA[id] = element;
                        SHOWS_FEATURED_LIST[index] = id;
                        if (index == 0) SELECTED_SHOWS_FEATURED_DATA_ID = id;
                    } else if (SELECTED_MENU_TYPE == 'cat_movies') {
                        MOVIES_FEATURED_DATA[id] = element;
                        MOVIES_FEATURED_LIST[index] = id;
                        if (index == 0) SELECTED_MOVIES_FEATURED_DATA_ID = id;
                    } else if (SELECTED_MENU_TYPE == 'cat_education') {
                        EDUCATION_FEATURED_DATA[id] = element;
                        EDUCATION_FEATURED_LIST[index] = id;
                        if (index == 0) SELECTED_EDUCATION_FEATURED_DATA_ID = id;
                    } else if (SELECTED_MENU_TYPE == 'cat_songs') {
                        EDUCATION_FEATURED_DATA[id] = element;
                        EDUCATION_FEATURED_LIST[index] = id;
                        if (index == 0) SELECTED_MUSIC_FEATURED_DATA_ID = id;
                    }
                    if (index == 0) {
                        set_background(element.pictures.sizes[element.pictures.sizes.length - 1]['link']);
                        $("#favBtn").attr("data-id", id);
                        $("#playBtn").attr("data-id", id);
                        $("#leftArrow").attr("data-id", index + 1); //Next 
                        $("#loader").hide();
                        SN.focus("homepageButton");
                        addEventListeners();
                    } else if (index == (response.total - 1)) $("#rightArrow").attr("data-id", index);// Previous

                });

            } else {
                console.log("data not found.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function get_all_talent() {
    console.log("all talent");
    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + "/talents",
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            if (_.size(data) > 0) {
                APP_ALL_TALENT_DATA = data;
                set_talent(data);
            } else console.log("Talent not found.");
        },
        error: function (xhr, error) {
            console.log("error", error);
        }
    });
}

function set_talent(data) {
    console.log("set menu list");

    var str = "",
        tabindex = 'tabindex="0"',
        leftFocus = '',
        rightFocus = '',
        downFocus = 'data-sn-down="null"',
        upFocus = 'data-sn-up="null"',
        id = '';

    if (_.size(data) > 0) {

        str += '<ul id="talentList">';
        str += '<span class="talent_right"><img src="images/next.png" alt="Right Arrow" /></span>';
        data.forEach((element, index) => {
            id = 'id="talent_' + index + '"';
            APP_ALL_TALENT[element.talentShowId] = element;

            leftFocus = "";
            if (index == _.size(data)) leftFocus = ' data-sn-left="null"';
            else leftFocus = ' data-sn-left="#talent_' + (index + 1) + '"';

            rightFocus = "";
            if (index == 0) rightFocus = ' data-sn-right="#searchInputText"';
            else rightFocus = ' data-sn-right="#talent_' + (index - 1) + '"';

            downFocus = ' data-sn-down="null"';

            str += '<li class="focusable home_talent_list" ' + tabindex + id + leftFocus + rightFocus + downFocus + upFocus + ' data-id="' + element.talentShowId + '" data-index="' + index + '">';
            str += '<div class="home_creator_profile_img"><div class="profile_image_box"><img src="' + element.image + '" alt="' + element.name + '"></div></div><span class="home_user_name" >' + element.name + '</span >';
            str += '</li>';

        });
        str += '<span class="talent_left"><img src="images/prevs.png" alt="Left Arrow" /></span>';
        str += '</ul>';
        $("#talentBox").html('');
        $("#talentBox").html(str);
        addEventListeners();

    } else {
        console.log("talent not found");
    }
}

function set_home_page_by_menu() {

    if (SELECTED_MENU_TYPE == '') return;

    if (SELECTED_MENU_TYPE == 'cat_shows') {
        if (_.size(SHOWS_SUB_CAT) > 0) set_home_page_show_data();
        else get_videos_by_menu_list();
    } else if (SELECTED_MENU_TYPE == 'cat_movies') {
        if (_.size(MOVIES_SUB_CAT) > 0) set_home_page_movie_data();
        else get_videos_by_menu_list();
    } else if (SELECTED_MENU_TYPE == 'cat_education') {
        if (_.size(EDUCATION_SUB_CAT) > 0) set_home_page_education_data();
        else get_videos_by_menu_list();
    } else if (SELECTED_MENU_TYPE == 'cat_songs') {
        if (_.size(SONGS_SUB_CAT) > 0) set_home_page_song_data();
        else get_videos_by_menu_list();
    }
}

function set_home_page_songs_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(SONGS_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(SONGS_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + SONGS_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + SONGS_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[SONGS_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div ><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            SONGS_ROW_INDEX++;
        });

        SONGS_ROW_INDEX = SONGS_ROW_INDEX - _.size(SONGS_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        addEventListeners();

    } else console.log("home page data not found");

}

function set_home_page_education_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(EDUCATION_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(EDUCATION_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + EDUCATION_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + EDUCATION_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[EDUCATION_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div ><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            EDUCATION_ROW_INDEX++;
        });

        EDUCATION_ROW_INDEX = EDUCATION_ROW_INDEX - _.size(EDUCATION_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        addEventListeners();

    } else console.log("home page data not found");

}

function set_home_page_movies_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(MOVIES_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(MOVIES_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + MOVIES_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + MOVIES_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[MOVIES_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div ><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            MOVIES_ROW_INDEX++;
        });

        MOVIES_ROW_INDEX = MOVIES_ROW_INDEX - _.size(MOVIES_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        addEventListeners();

    } else console.log("home page data not found");

}

function set_home_page_show_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(SHOWS_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(SHOWS_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + SHOWS_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + SHOWS_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[SHOWS_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div ><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            SHOWS_ROW_INDEX++;
        });

        SHOWS_ROW_INDEX = SHOWS_ROW_INDEX - _.size(SHOWS_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        addEventListeners();

    } else console.log("home page data not found");

}

function set_home_page_movie_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(MOVIES_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(MOVIES_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + MOVIES_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + MOVIES_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[MOVIES_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            MOVIES_ROW_INDEX++;
        });

        MOVIES_ROW_INDEX = MOVIES_ROW_INDEX - _.size(MOVIES_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        addEventListeners();

    } else console.log("home page data not found");

}

function set_home_page_education_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(EDUCATION_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(EDUCATION_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + EDUCATION_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + EDUCATION_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[EDUCATION_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div><span class="timing">' + convertSeconds(el.duration) + '</span></div>';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            EDUCATION_ROW_INDEX++;
        });

        EDUCATION_ROW_INDEX = EDUCATION_ROW_INDEX - _.size(EDUCATION_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        SN.focus("homepageButton");
        addEventListeners();

    } else console.log("home page data not found");

}

function set_home_page_song_data() {
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (_.size(SONGS_SUB_CAT) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(SONGS_SUB_CAT, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + SONGS_ROW_INDEX + '">';
            str += '<span class="category_list_heading">' + element.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + SONGS_ROW_INDEX + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';


            $.each(HOME_PAGE_DATA[SONGS_ROW_INDEX], function (i, el) {
                i++;
                id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                leftFocus = "";
                if (i == _.size(el)) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                upFocus = "";
                if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                str += '<div class="title"><div class="item_title"><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            SONGS_ROW_INDEX++;
        });

        SONGS_ROW_INDEX = SONGS_ROW_INDEX - _.size(SONGS_SUB_CAT);

        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        SN.focus("homepageButton");
        addEventListeners();

    } else console.log("home page data not found");

}

function get_videos_by_menu_list() {
    console.log("get home page content");
    $(".home_page_list_box").hide();
    $(".home_page_menu_wise_list_box").hide();
    $("#loader").show();
    if (SELECTED_MENU_TYPE != '') {
        $.ajax({
            type: "GET",
            url: APP_API_DOMAIN + "/parent-category?category=" + SELECTED_MENU_TYPE + "&age=0",
            async: true,
            // cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (data) {
                if (_.size(data) > 0) set_menu_list_page_data(data);
                else console.log("Data not found.");
            },
            error: function (xhr, error) {
                console.log("error", error);
            }
        });
    }
}


function set_menu_list_page_data(data) {
    console.log("set_menu_list_home_screen");
    if (_.size(data) > 0) {
        var str = "",
            tabindex = 'tabindex="11"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '',
            firstClass = '',
            containerId = "homePageMenuWiseItem";

        $.each(data, function (j, element) {
            if (j == 0) {
                upFocus = 'data-sn-up= "#playBtn"';
                firstClass = "first-row";
            } else upFocus = 'data-sn-up= "#home_page_menu_wise_item_' + j - 1 + '_0"';
            str += '<li class="home_page_listing" data-row="' + HOME_PAGE_ROW + '">';
            str += '<span class="category_list_heading">' + element.tag.title + '</span>';
            str += '<div class="home_page_outer_layer">';
            str += '<div class="list_icon focusable tile-grid ' + firstClass + '" ' + tabindex + ' id="home_page_menu_wise_item_' + j + '_0" ' + upFocus + ' data-id="' + HOME_PAGE_ROW + '" data-sn-left="#home_page_menu_wise_item_' + j + '_1" data-sn-right="null" ><img src="images/tile_button.png" alt="Widget"></div>';
            str += '<div class="home_page_category_list">';
            str += '<ul class="home_page_category_video_list" id="homePageMenuWiseList_' + j + '" >';

            if (SELECTED_MENU_TYPE == "cat_shows") {
                if (j == 0) SHOWS_ROW_INDEX = HOME_PAGE_ROW;
                SHOWS_SUB_CAT[j] = element.tag;
            } else if (SELECTED_MENU_TYPE == "cat_movies") {
                if (j == 0) MOVIES_ROW_INDEX = HOME_PAGE_ROW;
                MOVIES_SUB_CAT[j] = element.tag;
            } else if (SELECTED_MENU_TYPE == "cat_education") {
                if (j == 0) EDUCATION_ROW_INDEX = HOME_PAGE_ROW;
                EDUCATION_SUB_CAT[j] = element.tag;
            } else if (SELECTED_MENU_TYPE == "cat_songs") {
                if (j == 0) SONGS_ROW_INDEX = HOME_PAGE_ROW;
                SONGS_SUB_CAT[j] = element.tag;
            }

            if (_.size(element.videos) > 0) {
                HOME_PAGE_DATA[HOME_PAGE_ROW] = element.videos;
                $.each(element.videos, function (i, el) {
                    i++;
                    id = 'id="home_page_menu_wise_item_' + j + '_' + i + '"';

                    var dataId = ' data-id="' + extractUrlLastString(el.uri) + '" ';

                    APP_HOME_PAGE_MIXED_DATA[extractUrlLastString(el.uri)] = el;

                    leftFocus = "";
                    if (i == _.size(element.videos)) leftFocus = ' data-sn-left="null"';
                    else leftFocus = ' data-sn-left="#home_page_menu_wise_item_' + j + '_' + (i + 1) + '"';

                    rightFocus = "";
                    if (i == 1) rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_0"';
                    else rightFocus = ' data-sn-right="#home_page_menu_wise_item_' + j + '_' + (i - 1) + '"';

                    upFocus = "";
                    if (j > 0) upFocus = ' data-sn-up="#home_page_menu_wise_item_' + (j - 1) + '_' + i + '"';
                    if (j == 0) upFocus = ' data-sn-up="#playBtn" ';

                    str += '<li class="home-item-list focusable ' + firstClass + '" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                    str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                    str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + el.name + '</marquee></div ><span class="timing">' + convertSeconds(el.duration) + '</span></div >';
                    str += '</li>';
                });
            }
            str += '</ul>';
            str += '</div>';
            str += '</div>';
            str += '</li>';

            HOME_PAGE_ROW++;
        });

        $("#loader").hide();
        $(".home_page_menu_wise_list_box").show();
        $("#" + containerId).html('');
        $("#" + containerId).append(str);
        SN.focus("homepageButton");
        addEventListeners();

    } else console.log("home page data not found");
}

function get_talent_videos() {
    console.log("get_talent_videos");
    $("#creator_video_list").html('');
    $("#loader").show();
    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + "/tags/" + APP_ALL_TALENT_DATA[SELECTED_TALENT_ID]['tag'] + "/videos?page=1&per_page=25",
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            console.log("get_talent_videos");
            if (data.length > 0) {
                $("#selected_talent_image").attr("src", APP_ALL_TALENT_DATA[SELECTED_TALENT_ID]['image']).attr("alt", APP_ALL_TALENT_DATA[SELECTED_TALENT_ID]['name']);
                $("#selected_talent_name").text(APP_ALL_TALENT_DATA[SELECTED_TALENT_ID]['name']);

                $("#focused_talent_video_time").text(convertSeconds(data[0]['duration']));
                $("#focused_talent_video_name").text(data[0]['name']);
                $("#focused_talent_video_desc").text(data[0]['description']);

                var str = "",
                    tabindex = 'tabindex="12"',
                    leftFocus = '',
                    rightFocus = '',
                    downFocus = 'data-sn-down="null"',
                    upFocus = 'data-sn-up="null"',
                    dataId = '';

                $.each(data, function (i, el) {
                    var Id = extractUrlLastString(el.uri);
                    SELECTED_TALENT_DATA[Id] = el;
                    dataId = 'data-id="' + Id + '"';

                    id = 'id="creator_video_list_' + i + '"';

                    leftFocus = "";
                    if (i == _.size(data)) leftFocus = ' data-sn-left="null"';
                    else leftFocus = ' data-sn-left="#creator_video_list_' + (i + 1) + '"';

                    rightFocus = "";
                    if (i == 1) rightFocus = ' data-sn-right="#creator_video_list_0"';
                    else rightFocus = ' data-sn-right="#creator_video_list_' + (i - 1) + '"';

                    downFocus = "";
                    // if (i == dataLength) downFocus = ' data-sn-down="null"';
                    downFocus = ' data-sn-down="#creator_video_list_' + (i + 5) + '"';

                    upFocus = "";
                    if (i < 5) upFocus = ' data-sn-up="#BackBtn"';
                    else upFocus = ' data-sn-up="#creator_video_list_' + (i - 5) + '"';

                    str += '<li class="focusable" ' + tabindex + id + leftFocus + rightFocus + downFocus + upFocus + dataId + ' >';
                    str += '<div class="category_imagebox"><div class="image_frame"><img class="creator_video_slide_img" src="' + el.pictures.sizes[el.pictures.sizes.length - 1]['link'] + '" alt="' + el.name + '"></div></div>';
                    str += '</li>';
                });

                $("#background_slider").attr("src", "images/bg.png").attr("alt", "Background");
                $("#BackBtn").attr("src", "images/close.png");
                $(".talent_page_container").addClass("active").show();
                $(".creator_profile_box").show();
                $(".common_header").show();
                $(".screen_name_box").hide();
                $("#loader").hide();

                $("#creator_video_list").html('');
                $("#creator_video_list").html(str);

                SN.focus("creator_video_list");
                addEventListeners();

            } else {
                console.log("talent video not found.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = NET_CONNECTION_ERR;
            else msg = DATA_PARSE_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function show_video_details() {
    console.log("show_video_details");
    $(".home_container, .talent_page_container, .category_container, .detail_page_main_container, .search_result_main_container, .search_container, .favorite_page_container, .instruction_main_container, .video_container").removeClass("active").hide();
    show_hide_page_header(false);
    $("#deatilPageVideoList").html('');
    $("#loader").show();

    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + "/video/related/" + SELECTED_VIDEO_ID,
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.data.length > 0) {
                var str = "",
                    tabindex = 'tabindex="13"',
                    leftFocus = '',
                    rightFocus = '',
                    downFocus = '',
                    upFocus = '';
                var data = response.data;
                data.forEach(function (element, i) {
                    var dataId = 'data-id="' + extractUrlLastString(element.uri) + '"';
                    THIRD_PAGE_SELECTED_DATA_ARRAY[extractUrlLastString(element.uri)] = element;
                    id = 'id="deatil_page_video_item_' + i + '"';

                    leftFocus = "";
                    if (i == _.size(data)) leftFocus = ' data-sn-left="null"';
                    else leftFocus = ' data-sn-left="#deatil_page_video_item_' + (i + 1) + '"';

                    rightFocus = "";
                    if (i == 0) rightFocus = ' data-sn-right="null"';
                    else rightFocus = ' data-sn-right="#deatil_page_video_item_' + (i - 1) + '"';

                    // downFocus = "";
                    // if (i == dataLength) downFocus = ' data-sn-down="null"';
                    // downFocus = ' data-sn-down="#deatil_page_video_item_' + (i + 4) + '"';

                    upFocus = "";
                    if (i == 0) upFocus = ' data-sn-up="#detail_play_btn"';
                    // else upFocus = ' data-sn-up="#creator_video_list_' + (i - 4) + '"';

                    str += '<li class="focusable" ' + tabindex + id + leftFocus + rightFocus + downFocus + upFocus + dataId + '><div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + element.pictures.sizes[element.pictures.sizes.length - 1]['link'] + '" alt = "' + element.name + '" /></div></div>';
                    str += '<div class="title"><div class="video_title"><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + element.name + '</marquee></div><span class="timing">' + convertSeconds(element.duration) + '</span></div>';
                    str += '</li>';
                });
                $(".screen_name_box").hide();
                $(".detail_page_main_container").addClass("active").show();
                $(".creator_profile_box").hide();
                $(".common_header").show();
                $("#loader").hide();
                $("#deatilPageVideoList").html('');
                $("#deatilPageVideoList").html(str);

                SN.focus("#detail_play_btn");
                addEventListeners();

            } else {
                console.log("video detail not found.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = NET_CONNECTION_ERR;
            else msg = DATA_PARSE_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });

}

function show_inner_video_details() {
    console.log("show_inner_video_details");

    $(".home_container").removeClass("active").hide();
    $("#loader").show();

    $.ajax({
        type: "GET",
        url: APP_API_DOMAIN + "/video/related/" + THIRD_PAGE_SELECTED_DATA_ID,
        async: true,
        // cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (response.data.length > 0) {
                var str = "",
                    tabindex = 'tabindex="13"',
                    leftFocus = '',
                    rightFocus = '',
                    downFocus = '',
                    upFocus = '',
                    firstCatDivId = '',
                    containerId = "homePageList";

                var data = response.data;
                data.forEach(function (element, i) {

                    var dataId = ' data-id="' + extractUrlLastString(element.uri) + '"';
                    THIRD_PAGE_SELECTED_DATA_ARRAY[extractUrlLastString(element.uri)] = element;

                    var id = 'id="deatil_page_video_item_' + i + '"';

                    leftFocus = "";
                    if (i == _.size(data)) leftFocus = ' data-sn-left="null"';
                    else leftFocus = ' data-sn-left="#deatil_page_video_item_' + (i + 1) + '"';

                    rightFocus = "";
                    if (i == 0) rightFocus = ' data-sn-right="null"';
                    else rightFocus = ' data-sn-right="#deatil_page_video_item_' + (i - 1) + '"';

                    downFocus = "";

                    upFocus = "";
                    if (i == 0) upFocus = ' data-sn-up="#detail_play_btn" ';

                    str += '<li class="focusable" ' + tabindex + id + leftFocus + rightFocus + downFocus + upFocus + dataId + '><div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + element.pictures.sizes[element.pictures.sizes.length - 1]['link'] + '" alt = "' + element.name + '" /></div></div>';
                    str += '<div class="title"><div class="video_title"><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + element.name + '</marquee></div><span class="timing">' + convertSeconds(element.duration) + '</span></div>';
                    str += '</li>';
                });

                $(".detail_page_main_container").addClass("active").show();
                $("#loader").hide();
                $("#deatilPageVideoList").html('');
                $("#deatilPageVideoList").html(str);
                addEventListeners();

                SN.focus("DetailPageButton");

            } else {
                console.log("video detail not found.");
                $("#loader").hide();
                $("#deatilPageVideoList").html('');
                SN.focus("CancelButton");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = NET_CONNECTION_ERR;
            else msg = DATA_PARSE_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });

}

function show_category_page(row, id) {
    console.log("show_category_page");

    show_hide_page_header(false);
    $("#loader").show();
    $("#categoryitems").html('');

    if ($("#" + id).parent().find("ul").length > 0) {
        var str = "",
            tabindex = 'tabindex="14"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '';

        for (i = 0; i < _.size(HOME_PAGE_DATA[row]); i++) {
            if (i < _.size(HOME_PAGE_DATA[row])) {

                var videoId = extractUrlLastString(HOME_PAGE_DATA[row][i].uri);
                APP_HOME_PAGE_MIXED_DATA[videoId] = HOME_PAGE_DATA[row][i];

                var dataId = ' data-id="' + videoId + '"';

                var id = 'id="category_row_video_list_' + i + '"';

                leftFocus = "";
                if (i == _.size(HOME_PAGE_DATA[row])) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#category_row_video_list_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 0) rightFocus = ' data-sn-right="null"';
                else rightFocus = ' data-sn-right="#category_row_video_list_' + (i - 1) + '"';

                downFocus = "";
                downFocus = ' data-sn-down="#category_row_video_list_' + (i + 5) + '"';

                upFocus = "";
                if (i > 4) upFocus = ' data-sn-up="#category_row_video_list_' + (i - 5) + '"';

                str += '<li class="matrix_category focusable" ' + tabindex + id + leftFocus + rightFocus + downFocus + upFocus + dataId + '>';
                str += '<div class="category_imagebox"><img class="creator_video_slide_img" src="' + HOME_PAGE_DATA[row][i].pictures.sizes[HOME_PAGE_DATA[row][i].pictures.sizes.length - 1]['link'] + '"></div>';
                str += '</li>';
            }
        }

        $(".category_container").addClass("active").show();
        $(".common_header").show();
        $(".screen_name_box").show();
        $(".screen_name").show();

        $("#loader").hide();
        $("#categoryitems").html('');
        $("#categoryitems").html(str);
        addEventListeners();
        SN.focus("CancelButton");

    } else {
        console.log("category items not found.");
    }
}

function change_focused_homepage_button(id) {
    if (id == "favBtn") $("#" + id).find("img").attr("src", "images/favorite_button_focus.png");
    else $("#favBtn").find("img").attr("src", "images/favorite_button.png");

    var favoriteDataId = $("#favBtn").attr("data-id");
    var check = false;
    for (var i = 0; i < localStorage.length; i++) {
        const keyArray = localStorage.key(i).split("_");
        if (keyArray[1] == favoriteDataId) check = true;
    }

    if (check) {
        if ($("#favBtn").is(":focus")) $("#favBtn").find('img').attr("src", "images/favorite_added_focused.png");
        else $("#favBtn").find('img').attr("src", "images/favorite_added.png");
    }
    else {
        if ($("#favBtn").is(":focus")) $("#favBtn").find('img').attr("src", "images/favorite_button_focus.png");
        else $("#favBtn").find('img').attr("src", "images/favorite_button.png");
    }

    if (id == "playBtn") $("#" + id).find("img").attr("src", "images/play_button_focus.png");
    else $("#playBtn").find("img").attr("src", "images/play_button.png");

    if (id == "leftArrow") $("#" + id).find("img").attr("src", "images/arrow_left_focus.png");
    else $("#leftArrow").find("img").attr("src", "images/arrow_left.png");

    if (id == "rightArrow") $("#" + id).find("img").attr("src", "images/arrow_right_focus.png");
    else $("#rightArrow").find("img").attr("src", "images/arrow_right.png");

}

function change_focused_menu_image(id) {
    console.log("change_focused_menu_image");
    if (id == "homePage") $("#" + id).find("img").attr("src", "images/home_icon_focus.png");
    else $("#homePage").find("img").attr("src", "images/home_icon.png");

    if (id == "favouritePage") $("#" + id).find("img").attr("src", "images/heart_icon_focus.png");
    else $("#favouritePage").find("img").attr("src", "images/heart_icon.png");

    if (id == "showPage") $("#" + id).find("img").attr("src", "images/show_icon_focus.png");
    else $("#showPage").find("img").attr("src", "images/show_icon.png");

    if (id == "moviePage") $("#" + id).find("img").attr("src", "images/movie_icon_focus.png");
    else $("#moviePage").find("img").attr("src", "images/movie_icon.png");

    if (id == "educationPage") $("#" + id).find("img").attr("src", "images/edu_icon_focus.png");
    else $("#educationPage").find("img").attr("src", "images/edu_icon.png");

    if (id == "musicPage") $("#" + id).find("img").attr("src", "images/music_icon_focus.png");
    else $("#musicPage").find("img").attr("src", "images/music_icon.png");

    if (id == "logoutPage") $("#" + id).find("img").attr("src", "images/logout_icon_focus.png");
    else $("#logoutPage").find("img").attr("src", "images/logout_icon.png");

    if (id == "exitPage") $("#" + id).find("img").attr("src", "images/exit_icon_focus.png");
    else $("#exitPage").find("img").attr("src", "images/exit_icon.png");

}


function request_search_results() {
    console.log('search request...');
    searchText = get_searched_text();
    $('#searchText').blur();
    if (searchText != "") {
        show_search_result();
    } else {
        console.log('input text enter');
        var ele = $('#searchResultBox').find("div.search_popup:contains('כיתבו את שם התוכן שתרצו לחפש')");
        if (ele.length < 1) {
            var popup = '<div class="search_popup">כיתבו את שם התוכן שתרצו לחפש</div>';
            $("#searchMsg").html("");
            $("#searchMsg").html(popup);
        }
        SN.focus('searchText');
        $(".search_popup").fadeIn(1000);
        setTimeout(function () { $.when($(".search_popup").fadeOut(1000)).done(function () { $(".search_popup").remove(); }); }, 2000);
    }
}

function get_searched_text() {
    return $.trim($('#searchText').val());
}

function show_search_result() {
    console.log("show search result");
    $(".search_container").removeClass("active").hide();

    $("#screen_name").text("");
    $("#search_page_heading").text("");
    $(".search_result_main_container").addClass("active").show();
    $(".common_header").show();

    if ($('ul#searchResultList li').length == 0) manage_spatial_navigation("search_result_main_container");

    $("#loader").show();
    var searchText = get_searched_text();
    if (searchText != '') {
        var url = APP_API_DOMAIN + '/video/search/?query=' + searchText;

        $.ajax({
            type: "GET",
            url: url,
            async: true,
            // cache: false,
            crossDomain: true,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (response) {
                if (response.total > 0) {
                    var data = response.data;
                    var str = "",
                        tabindex = ' tabindex="16" ',
                        leftFocus = '',
                        rightFocus = '',
                        downFocus = '',
                        upFocus = '';

                    data.forEach(function (element, i) {
                        var searchData = {};
                        searchData['name'] = element.name;
                        searchData['description'] = element.description;
                        searchData['duration'] = element.duration;
                        searchData['image'] = element.pictures.sizes[element.pictures.sizes.length - 1]['link'];
                        searchData['uri'] = element.uri;
                        searchData['video_url'] = element.player_embed_url;

                        var searchId = extractUrlLastString(element.uri);
                        APP_SEARCH_DATA_ARRAY[searchId] = element;//searchData;

                        leftFocus = "";
                        if (i == _.size(data)) leftFocus = ' data-sn-left="null"';
                        else leftFocus = ' data-sn-left="#search_item_' + (i + 1) + '"';

                        rightFocus = "";
                        if (i == 0) rightFocus = ' data-sn-right="null"';
                        else rightFocus = ' data-sn-right="#search_item_' + (i - 1) + '"';

                        downFocus = "";
                        upFocus = "";
                        // if (i == 0) upFocus = ' data-sn-up="#BackBtn" ';
                        str += '<li class="focusable" ' + tabindex + leftFocus + rightFocus + downFocus + upFocus + ' id="search_item_' + i + '" data-id="' + searchId + '" > <div class="search_slider_imagebox"><img class="slide_img" src = "' + searchData['image'] + '" alt="' + searchData['name'] + '"></div></li>';
                    });

                } else {
                    SN.focus("#BackBtn")
                    $("#search_page_heading").text("לא נמצאה התאמה");
                }
                $("#screen_name").text("לחפש");
                $(".screen_name_box").show();

                $("#searchResultList").html("");
                $("#searchResultList").html(str);
                $("#loader").hide();
                $("#searchText").val('');
                addEventListeners();

                SN.focus("searchResultList");
            },
            error: function (xhr, error) {
                console.log("error", error);
                if (navigator.onLine) msg = NET_CONNECTION_ERR;
                else msg = DATA_PARSE_ERR;
                hide_show_modal(true, "RETRY_EXIT", msg);
            }
        });
    }
}

function show_favorite_video_list() {
    console.log("show_favorite_video_list");

    $("#screen_name").text("");
    $(".no_favorite_msg").text("");
    $(".favorite_page_container").addClass("active").show();
    $(".common_header").show();

    $("#loader").show();

    if (localStorage.length > 0) {
        var str = "",
            tabindex = ' tabindex="17" ',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '';

        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) != "youkid_expiry") {
                var keyArray = localStorage.key(i).split("_");
                var favroiteId = keyArray[1];
                var favoriteData = JSON.parse(localStorage["id_" + favroiteId]);

                leftFocus = "";
                if (i == localStorage.length) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#favorite_video_list_' + (i + 1) + '"';

                rightFocus = "";
                if (i == 0) rightFocus = ' data-sn-right="null"';
                else rightFocus = ' data-sn-right="#favorite_video_list_' + (i - 1) + '"';

                downFocus = "";
                upFocus = "";
                str += '<li class="favorite_item_list focusable" ' + tabindex + leftFocus + rightFocus + downFocus + upFocus + ' id="favorite_video_list_' + i + '" data-id="' + favroiteId + '" > <div class="favorite_slider_imagebox"><img class="fav_slide_img" src = "' + favoriteData.pictures.sizes[favoriteData.pictures.sizes.length - 1]['link'] + '" alt="' + favoriteData['name'] + '"></div></li>';
            }
        }

        if ($("#favoriteList").length < 1) {
            $(".no_favorite_msg").text("לא נבחרו סרטים מועדפים. להוספת סרטים ביחרו את הסרט הרצוי ולחצו על סימן הלב");
            $(".no_favorite_msg").show();
        }
    } else {
        $(".no_favorite_msg").text("לא נבחרו סרטים מועדפים. להוספת סרטים ביחרו את הסרט הרצוי ולחצו על סימן הלב");
        $(".no_favorite_msg").show();
    }

    $("#screen_name").text("מועדפים");
    $(".screen_name_box").show();

    $("#favoriteList").html("");
    $("#favoriteList").html(str);
    $("#loader").hide();

    SN.focus("#BackBtn");
    addEventListeners();
}
function show_instruction_page() {
    console.log("show_instruction_page");
    generate_pin_code();
    show_hide_page_header(false);
    $(".screen_name_box").hide();
    $(".homepage_header").hide();
    $(".home_container, .talent_page_container, .category_container, .detail_page_main_container, .search_result_main_container, .search_container, .favorite_page_container, .instruction_main_container, .video_container").removeClass("active").hide();
    $("#background_slider").attr("src", "images/jungle.png");

    // show instruction page();
    $(".instruction_main_container").addClass("active").show();
    $("#screen_name").text("Instructions").show();
    $(".common_header").show();
    SN.focus("CancelButton");
    addEventListeners();
}

function hide_instruction_screen() {
    $(".home_container, .talent_page_container, .category_container, .detail_page_main_container, .search_result_main_container, .search_container, .favorite_page_container, .instruction_main_container, .video_container").removeClass("active").hide();
    $(".common_header").hide();
    $(".homepage_header").hide();
    $(".main_container").show();
    if (PLAY_PAGE_INDEX == 1) {
        $(".homepage_header").show();
        $(".header_container").show();
        $(".home_container").addClass("active").show();
        SN.focus("homepageButton");
    } else if (PLAY_PAGE_INDEX == 2) {
        $(".common_header").show();
        $(".header_container").show();
        $(".detail_page_main_container").addClass("active").show();
        SN.focus("DetailPageButton");
    }
}

function hide_video_player_screens(index = "") {
    console.log("show_hide_screens");
    $(".video_container").removeClass("active").hide();
    $(".main_container").show();
    $(".common_header").hide();
    $(".homepage_header").hide();
    TIME_COUNTER_LEFT = 0;

    if (index == 0) {
        $(".homepage_header").show();
        $(".header_container").show();
        $(".home_container").addClass("active").show();
        SN.focus("homepageButton");
    } else if (index == 1) {
        $(".header_container").show();
        $(".common_header").show();
        $(".talent_page_container").addClass("active").show();
        SN.focus("creator_video_list");
    } else if (index == 2) {
        $(".header_container").show();
        $(".common_header").show();
        $(".detail_page_main_container").addClass("active").show();
        SN.focus("DetailPageButton");
    } else if (index == 3) {
        $(".header_container").show();
        $(".common_header").show();
        $(".category_container").addClass("active").show();
        SN.focus("categoryitems");
    } else if (index == 5) {
        $(".header_container").show();
        $(".common_header").show();
        $(".search_result_main_container").addClass("active").show();
        SN.focus("searchResultList");
    } else if (index == 6) {
        $(".header_container").show();
        $(".common_header").show();
        $(".detail_page_main_container").addClass("active").show();
        SN.focus("DetailPageButton");
    }
}

function show_page_by_index(index = "") {
    console.log("show_page_by_index");
    $(".home_container, .talent_page_container, .category_container, .detail_page_main_container, .search_result_main_container, .search_container, .favorite_page_container, .instruction_main_container, .video_container").removeClass("active").hide();
    $(".main_container").show();
    $(".common_header").hide();
    $(".homepage_header").hide();
    switch (index) {
        case 0: // show home page
            set_home_background();
            if (TAB_INDEX !== 0) TAB_INDEX = '';
            $(".header_container").show();
            $(".homepage_header").show();
            $(".home_container").addClass("active").show();
            if ($(".home_page_list_box").css("display") != "none" && TAB_INDEX != 1) SN.focus("homePageItem");
            else if ($(".home_page_menu_wise_list_box").css("display") != "none" && TAB_INDEX != 1) SN.focus("homePageMenuWiseItem");
            else if (TAB_INDEX == 1) SN.focus("homepage_header"), TAB_INDEX = '';
            break;
        case 1: //Show talent page
            $(".header_container").show();
            $(".homepage_header").hide();
            $(".creator_home_btn").show();
            $(".common_header").show();
            $(".talent_page_container").addClass("active").show();
            SN.focus("creator_video_list");
            break;
        case 2: //show category page
            $(".header_container").show();
            $(".common_header").show();
            $(".category_container").addClass("active").show();
            SN.focus("categoryitems");
            break;
        case 3:
            $(".search_result_main_container").removeClass("active").hide();
            $(".common_header").hide();
            $(".screen_name_box").hide();
            $("#searchResultList").html("");
            set_background("");

            $(".search_container").addClass("active").show();

            APP_SEARCH_DATA_ARRAY = {};
            SN.focus("searchPage");
            break;
        case 4: //Show search result page
            $(".header_container").show();
            $(".common_header").show();
            $(".search_result_main_container").addClass("active").show();
            SN.focus("searchResultList");
            break;
        case 5:
            show_favorite_video_list();
            $(".header_container").show();
            $(".common_header").show();
            $(".favorite_page_container").addClass("active").show();
            SN.focus("favoriteList");
            break;
        case 6:
            if (TAB_INDEX == 5) {
                show_favorite_video_list();
                $(".header_container").show();
                $(".common_header").show();
                $(".favorite_page_container").addClass("active").show();
                SN.focus("favoriteList");
            } else if (TAB_INDEX == 2) {
                $(".header_container").show();
                $(".common_header").show();
                $(".category_container").addClass("active").show();
                SN.focus("categoryitems");
            } else if (TAB_INDEX == 1) {
                $(".header_container").show();
                $(".homepage_header").hide();
                $(".creator_home_btn").show();
                $(".common_header").show();
                $(".talent_page_container").addClass("active").show();
                SN.focus("creator_video_list");
            } else {
                set_home_background();
                $(".header_container").show();
                $(".homepage_header").show();
                $(".home_container").addClass("active").show();
                if ($(".home_page_list_box").css("display") != "none") SN.focus("homePageItem");
                else if ($(".home_page_menu_wise_list_box").css("display") != "none") SN.focus("homePageMenuWiseItem");
            }
            break;
        default:
            console.log("default case");
    }
}

// Start video fucntion from here
function get_video_url() {
    console.log("get video url from vimeo video api");
    try {
        $.ajax({
            type: "GET",
            url: "https://youkids.herokuapp.com/video/" + VIDEO_ID,
            dataType: "json",
            async: true,
            // cache: false,
            timeout: REQUEST_TIMEOUT * 1000,
            success: function (response) {
                if (response != undefined && response != "") {
                    totalVideo = response.files.length;
                    if (totalVideo > 0) {
                        var maxWidth = 0;
                        for (i = 0; i < totalVideo; i++) {
                            if (maxWidth < response.files[i]['height']) {
                                maxWidth = response.files[i]['height'];
                                VOD_URL = response.files[i]['link'];
                            }
                        }
                        load_video();
                    }
                }

            }, error: function (xhr, error) {
                console.log(xhr, error);
                if (navigator.onLine) msg = NET_CONNECTION_ERR;
                else msg = DATA_PARSE_ERR;
                hide_show_modal(true, "RETRY_EXIT", msg);
            }
        });
    } catch (e) {
        console.log("Error in load video: " + e);
    }
}


function lazy_load_items(row, index) {
    console.log("lazy_load_items");
    if (index + 1 < _.size(HOME_PAGE_DATA[row])) {
        var str = "",
            tabindex = 'tabindex="6"',
            leftFocus = '',
            rightFocus = '',
            downFocus = '',
            upFocus = '',
            id = '';
        var rowDataArray = new Array();

        for (i = index + 1; i <= index + 5; i++) {
            if (i < _.size(HOME_PAGE_DATA[row])) {
                rowDataArray[i] = extractUrlLastString(HOME_PAGE_DATA[row][i].uri);
                id = 'id="home_page_item_' + row + '_' + (i + 1) + '"';
                var dataId = ' data-id="' + extractUrlLastString(HOME_PAGE_DATA[row][i].uri) + '" ';
                APP_HOME_PAGE_MIXED_DATA[extractUrlLastString(HOME_PAGE_DATA[row][i].uri)] = HOME_PAGE_DATA[row][i];

                leftFocus = "";
                if (i == _.size(HOME_PAGE_DATA[row])) leftFocus = ' data-sn-left="null"';
                else leftFocus = ' data-sn-left="#home_page_item_' + row + '_' + (i + 2) + '"';

                rightFocus = "";
                if (i == 1) rightFocus = ' data-sn-right="#home_page_item_' + row + '_0"';
                else rightFocus = ' data-sn-right="#home_page_item_' + row + '_' + (i) + '"';

                upFocus = "";
                // if (row > 0) upFocus = ' data-sn-up="#home_page_item_' + (row - 1) + '_' + i + '"';
                if (row == 0) upFocus = ' data-sn-up="#playBtn" ';

                // downFocus = "";
                // if (i == dataLength) downFocus = ' data-sn-down="null"';
                // else downFocus = ' data-sn-down="#cat_item_' + (i + 1) + '_0"';

                str += '<li class="home-item-list focusable" ' + tabindex + dataId + id + leftFocus + rightFocus + downFocus + upFocus + ' >';
                str += '<div class="home_imagebox"><div class="image_frame"><img class="home_slide_img" src="' + HOME_PAGE_DATA[row][i].pictures.sizes[HOME_PAGE_DATA[row][i].pictures.sizes.length - 1]['link'] + '" alt="' + HOME_PAGE_DATA[row][i].name + '"></div></div>';
                str += '<div class="title"><div class="item_title" ><marquee class="marquee marquee-text" data-duplicated="true" data-direction="right">' + HOME_PAGE_DATA[row][i].name + '</marquee></div><span class="timing">' + convertSeconds(HOME_PAGE_DATA[row][i].duration) + '</span></div >';
                str += '</li>';
            }

        }
        if (str != '') $("ul#homePageList_" + row).append(str);
        addEventListeners();

    } else console.log("home page data not found");
}


function show_hide_video_container() {
    $(".main_container").hide();
    $("#video_container").show();
}

// It returns current vod object while playing video
function get_video_obj() {
    var obj = "";
    switch (PAGE_INDEX) {
        case 0:
            obj = APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID];
            break;

        case 1:
            obj = APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID];
            break;

        case 2:
            obj = APP_HOME_PAGE_MIXED_DATA[FIRST_PAGE_SELECTED_DATA_ID];
            break;
    }

    return obj;
}

// var leftmove,rightmove;
function controlLeftArrowKeys() {
    console.log("left move");
    var leftmove;
    var input = document.getElementById('searchText');
    if (input.value.length == 0) {
        return;
    }
    var currentpos = input.selectionStart; //getting current postion of cursor 
    leftmove = currentpos - 1;
    setCaretPosition(input, leftmove);
}
function controlrightArrowKeys() {
    console.log("right move");
    var rightmove;
    var input = document.getElementById('searchText');
    if (input.value.length == 0) {
        return;
    }
    var currentpos = input.selectionStart;  //getting current postion of cursor
    rightmove = currentpos + 1;
    setCaretPosition(input, rightmove);
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

function check_favourate_data() {
    console.log("home page buttons focus");
    var favoriteDataId = $("#favBtn").attr("data-id");
    var check = false;
    if (favoriteDataId) {
        for (var i = 0; i < localStorage.length; i++) {
            var keyArray = localStorage.key(i).split("_");
            if (keyArray[1] == favoriteDataId) check = true;
        }

        if (check) {
            if ($("#favBtn").is(":focus")) $("#favBtn").find('img').attr("src", "images/favorite_added_focused.png");
            else $("#favBtn").find('img').attr("src", "images/favorite_added.png");
        }
        else {
            if ($("#favBtn").is(":focus")) $("#favBtn").find('img').attr("src", "images/favorite_button_focus.png");
            else $("#favBtn").find('img').attr("src", "images/favorite_button.png");
        }
    }
}