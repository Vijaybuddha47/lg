/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var lastFocusedElementId;
document.addEventListener('cursorStateChange', cursorVisibilityChange, false);
document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);

var checkRemeberMe = checkUncheckRememberMeBtn();


function cursorVisibilityChange(event) {
    var visibility = event.detail.visibility;
    if ($(":focus").length > 0) lastFocusedElementId = $(":focus").attr("id");
    if (visibility) {
        console.log("Cursor appeared");
        if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
            show_hide_progress_bar_after_specific_time();
        }
    }
    else {
        console.log("Cursor disappeared");
        SN.focus("#" + lastFocusedElementId);
        if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
            $("#video_player_about_video").hide();
            $(".set_progressbar").hide();
            $(".mejs__controls").hide();
            $(".mejs__controls").removeClass('mejs__offscreen').css('opacity', 0);
            $(".video_next_previous_container").hide();
            SN.focus('videoSection');
        }
    }
}

function keyboardVisibilityChange(event) {
    var visibility = event.detail.visibility;
    // console.log(event, visibility);
    if (visibility) {
        console.log("Virtual keyboard appeared");
        $(".login_container").addClass("cursor_disabled");
    }
    else {
        console.log("Virtual keyboard disappeared");
        $(".login_container").removeClass("cursor_disabled");
    }
}

function addEventListeners() {
    var itemArray = document.getElementsByClassName("focusable");
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    var elementId = this.id;
    console.log(elementId + " is Clicked.");

    if (elementId != "") {
        // When popup is clicked
        if ($(".modal_container").hasClass("active")) {
            var modalName = $(".modal_container").attr("data-modal-name");
            if (elementId == "cancelChange") {
                if (MENU_INDEX == 3) hide_show_modal(false, 'LANGUAGE');
            }
            else if (elementId == "confirmChange") {
                if (modalName == "LANGUAGE") {
                    $(".selected-lang").removeClass("selected-lang");
                    localStorage.setItem("locale", $("#" + FIRST_LEVEL_SELECTED_ITEM).attr("data-locale"));
                    $("#" + FIRST_LEVEL_SELECTED_ITEM).addClass("selected-lang");
                    window.location.href = "home.html";
                }
            }
            else if (elementId == "noButton") {
                // if (PAGE_INDEX == 0) {
                if (MENU_INDEX == 4) hide_show_modal(false, 'LOGOUT');
                else hide_show_modal(false, 'EXIT');
                // } else if (PAGE_INDEX == 6) {
                //     hide_show_modal(false, 'EXIT');
                // }
            } else if (elementId == "yesButton") {
                if (modalName == 'EXIT') window.close();
                else if (modalName == "LOGOUT") {
                    let locale = localStorage.getItem("locale");
                    window.localStorage.clear();
                    localStorage.setItem("locale", locale);
                    window.location.href = "login.html";
                }
            } else if (elementId == "retryButton") {
                if (modalName == "RETRY_CANCEL") {
                    if ($("#retryButton").is(":focus")) {
                        hide_show_modal(false, modalName);
                        load_video();
                    }
                } else if (modalName == "RETRY_EXIT") {
                    hide_show_modal(false, modalName);
                    if ($("#retryButton").is(":focus")) {
                        hide_show_modal(false, 'EXIT');
                    }
                }
            } else if (elementId == "cancelButton") {
                hide_show_modal(false, modalName);
                if (modalName == "RETRY_CANCEL") {
                    if ($("#cancelButton").is(":focus")) closeVideo();
                } else if (modalName == "RETRY_EXIT") {
                    if ($("#cancelButton").is(":focus")) {
                        closeVideo();
                        window.close();
                    }
                }
            } else if ($(".exit_modal").is(":visible")) SN.focus("exitModal");
            else SN.focus("retryModal");
        } else if ($(".video_container").hasClass("active") && $(".video_container").is(":visible")) {
            if (elementId == "playPauseVideo") {
                if (VIDEO_PLAYER.getPaused()) {
                    $("#playPauseIcon").attr('src', 'images/pause.png');
                    $(".pause-icon").hide();
                    playVideo();
                } else {
                    $(".pause-icon").show();
                    pauseVideo();
                }
            }

        } else if ($(".login_container").hasClass("active")) {
            if (elementId == "submit") {
                var email = document.getElementById('email').value;
                var password = document.getElementById('password').value;
                if (email == '') login_error_message(TXT["EMAIL_REQUIRED"])
                else if (password == '') login_error_message(TXT["PASSWORD_REQUIRED"])
                else if (email && password) {
                    $("#login_loader").show();
                    var email = document.getElementById('email').value;
                    var user_pswd = document.getElementById('password').value;
                    if ($("#rememberMe").attr("data-checked") == 1) {
                        localStorage.setItem("actif_user_email", email);
                        localStorage.setItem("actif_user_password", user_pswd);
                    }
                    // else {
                    //     localStorage.setItem("actif_user_email", "");
                    //     localStorage.setItem("actif_user_password", "");
                    // }
                    loginApi();

                }
            } else if (elementId == "rememberMe") {
                checkRemeberMe();
            }
        } else if ($("#" + elementId).parent().attr("id") == "menu_items") {
            SELECTED_MENU = elementId;
            $("li.menu").removeClass("selected_menu");
            $("#" + SELECTED_MENU).addClass("selected_menu");

            if (elementId != "menu_4") PAGE_INDEX = TAB_INDEX = MENU_INDEX = $("#" + SELECTED_MENU).index();

            if (elementId == "menu_4") {
                if (!$(".modal_container").hasClass("active")) setTimeout(function () { hide_show_modal(true, "LOGOUT", TXT['WANT_TO_LOGOUT']); }, 500);
                else if ($(".modal_container").hasClass("active")) hide_show_modal(false, "LOGOUT");
            } else if (MENU_INDEX == 0) {
                if (!$(".search_container").hasClass("active")) {
                    resetVariables();
                    setSearchRecommendedVideos(false, APP_SEARCH_ARRAY);
                    setCategoryFilterOptions();
                    hide_show_screens("search_container");
                    SN.focus("keyboard");
                }
            } else if (MENU_INDEX == 1) {
                if (!$(".home_container").hasClass("active")) {
                    getCategories();
                    hide_show_screens("");
                }
            } else if (MENU_INDEX == 2) {
                if (!$(".dashboard_container").hasClass("active")) {
                    hide_show_screens("");
                    getActivities();
                }
            } else if (MENU_INDEX == 3) {
                if (!$(".setting_container").hasClass("active")) {
                    let divs = document.querySelectorAll('.app-language');
                    let i = 0;
                    divs.forEach(function (element) {
                        divs[i].innerHTML = '<h3>' + TXT["MULTI_LANGUAGE"][i] + '</h3>';
                        i++;
                    });
                    $(".selected-lang").removeClass("selected-lang");
                    if (localStorage.getItem("locale") == "fr-FR") $("#lang_2").addClass("selected-lang");
                    else if (localStorage.getItem("locale") == "pt-PT") $("#lang_1").addClass("selected-lang");
                    else if (localStorage.getItem("locale") == "en-EN") $("#lang_0").addClass("selected-lang");
                    hide_show_screens("setting_container");
                    SN.focus("#lang_0");
                }
            }
        } else if ($(".home_container").hasClass("active")) {
            console.log(elementId);
            FIRST_LEVEL_SELECTED_ITEM = elementId;
            if (elementId.search('cat_') > -1) {
                var idArr = elementId.split("_");
                var categoryId = APP_CATEGORY_ARRAY[idArr[1]]["_id"];
                console.log(categoryId);
                hide_show_screens("");
                getSubcategories(categoryId);
            } else if (elementId.search('item_') > -1) {
                VOD_URL = APP_DATA_ARRAY[$("#" + FIRST_LEVEL_SELECTED_ITEM).index()]["downloadLink"];
                VOD_COUNTER = $("#" + FIRST_LEVEL_SELECTED_ITEM).parent().index();
                // VOD_URL = "https://player.vimeo.com/progressive_redirect/playback/860938114/rendition/1080p/file.mp4?loc=external&signature=34fa08cd8a4382f62d3ce294e55ef655fd55a8d7b24381307daa4bbcdad3fe43";//"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                console.log(VOD_URL, VOD_COUNTER);
                setTimeout(function () { load_video(); }, 100);
            }
        } else if ($(".subcategory_container").hasClass("active")) {
            if ($("[id^='subcat_']")) {
                SECOND_LEVEL_SELECTED_ITEM = elementId;
                var idArr = FIRST_LEVEL_SELECTED_ITEM.split("_");
                var subIdArr = SECOND_LEVEL_SELECTED_ITEM.split("_");
                var categoryId = APP_CATEGORY_ARRAY[idArr[1]]["_id"];
                var subCategoryId = APP_CATEGORY_ARRAY[idArr[1]]["sub"][subIdArr[1]]["id"];
                console.log(categoryId, subCategoryId);
                getVideosBySubCategory(categoryId, subCategoryId);
            }
        } else if ($(".search_container").hasClass("active")) {
            FIRST_LEVEL_SELECTED_ITEM = elementId;
            if (elementId == "apply") {
                console.log($(".selected_option"));
                if ($(".filter-conatiner-list .selected_option").length > 0) {
                    var param = [], str = "page=1&";
                    param["category"] = [];
                    $(".selected_option").each(function (i) {
                        console.log($(this).attr("data-id"));
                        if ($(this).hasClass("filter-category-list")) param["category"][i] = $(this).attr("data-id");
                        else if ($(this).hasClass("filter-subcategory-list")) {
                            if (str.search("categories") < 0 && param["category"].length > 0) {
                                str += "categories=" + param["category"].join(",");
                                param["category"] = [];
                            }
                            str += "&subcategory=" + $(this).attr("data-id");
                        }
                        else if ($(this).hasClass("filter-intensity-list")) str += "&intensity=" + $(this).attr("data-id");
                        else if ($(this).hasClass("filter-duration-list")) str += "&duration=" + $(this).attr("data-id");
                    });
                    console.log(param, str);
                    getFilteredVideo();
                }
            } else if (elementId == "clear") {
                console.log($(".selected_option"));
                if (($(".filter-conatiner-list .selected_option").length > 0) || ($.trim($('#searchInputText').val()) != '')) {
                    $('#searchInputText').val('');
                    var headArr = [TXT["CATEGORY"], TXT["SUBCATEGORY"], TXT["INTENSITY"], TXT["DURATION"]];
                    $(".main-filter-heading").each(function (i) {
                        $(this).text(headArr[i]);
                    });
                    $(".selected_option").find("img").attr("src", "images/filter-unchecked.png");
                    $(".selected_option").removeClass("selected_option");
                    $(".filter-conatiner-list").children(":nth-child(2)").addClass("list-disabled");
                    setSearchRecommendedVideos(false, APP_SEARCH_ARRAY);
                }
            } else if (elementId.search("key_") > -1) {
                console.log(elementId);
                var letters = "qwertyuiopasdfghjklzxcvbnm";
                if ($("#" + elementId).hasClass("key-letters")) {
                    var char = $("#" + elementId).find("span").text();
                    $("#searchInputText").val($("#searchInputText").val() + char);
                } else if (elementId == "key_caps") {
                    if ($("#key_a").find("span").text() == "a") {
                        $(".key-letters").each(function (i, ele) {
                            $(this).find("span").text(letters[i].toUpperCase());
                        });
                    } else {
                        $(".key-letters").each(function (i, ele) {
                            $(this).find("span").text(letters[i].toLowerCase());
                        });
                    }
                } else if (elementId == "key_clear") {
                    var str = $("#searchInputText").val();
                    if (str.length > 0) $("#searchInputText").val(str.substring(0, str.length - 1));
                } else if (elementId == "key_space") {
                    var str = $("#searchInputText").val();
                    str = str + " ";
                    if (str.length > 0) $("#searchInputText").val(str + " ");
                } else if (elementId == "key_num") {
                    if ($("#key_a").find("span").text() == "a") {
                        var charArr = "!@#$%&+-_:/'()[]";
                        var j = 0;
                        $(".key-letters").each(function (i, ele) {
                            if (i < 10) {
                                $(this).find("span").text(i);
                            } else {
                                $(this).find("span").text(charArr[j]);
                                j++;
                            }
                        });
                    } else {
                        $(".key-letters").each(function (i, ele) {
                            $(this).find("span").text(letters[i].toLowerCase());
                        });
                    }
                } else if (elementId == "key_enter") {
                    request_search_results();
                }
            } else if (elementId.search("filter") > -1) {
                // console.log("filter clicked", elementId);
                ["category_filter", "subcategory_filter", "intensity_filter", "duration_filter"].forEach(function (e, i) {
                    $("." + e + "_options").hide();
                });
                $(".right-arrow-box").find("img").css("transform", "rotate(0deg)");

                if (!$("#" + elementId).parent().parent().hasClass("list-disabled")) {
                    $("#" + elementId).find("img").css("transform", "rotate(90deg)");
                    $("." + elementId + "_options").show();
                    var type = elementId.split("_filter");
                    var filterContainer = type[0] + "_options";
                    SN.focus(filterContainer);
                }
            } else if (elementId.search("_option_") > -1) {
                if ($("#" + elementId).hasClass("selected_option")) {
                    $("#" + elementId).removeClass("selected_option");
                    $("#" + elementId).find("img").attr("src", "images/filter-unchecked.png");
                } else if (!$("#" + elementId).hasClass("selected_option")) {
                    $("#" + elementId).addClass("selected_option");
                    $("#" + elementId).find("img").attr("src", "images/filter-checked.png");
                }
                var currentFilter = $("#" + elementId).parent().parent().parent().children(':first-child').children(':first-child').attr("id").split("_filter");//.find("span").text();
                var length = $("#" + elementId).parent().find("li.selected_option").length;
                if (length > 0) $("#" + elementId).parent().parent().parent().children(':first-child').children(':first-child').find(".main-filter-heading").text(currentFilter[0] + "(" + length + ")");
                else $("#" + elementId).parent().parent().parent().children(':first-child').children(':first-child').find(".main-filter-heading").text(currentFilter[0]);

                if (($("#" + elementId).parent().attr("id") == "category_options")) {
                    if ($("#" + elementId).hasClass("selected_option")) setSubcategoryFilterOptions($("#" + elementId).attr("data-id"));
                    else resuffleSubcategoryOptions($("#" + elementId).attr("data-id"));
                }
            } else if (elementId.search("search_") > -1) {
                if (APP_SEARCH_ARRAY["hasMetadata"] !== undefined)
                    VOD_URL = APP_SEARCH_ARRAY["getVideos"][$("#" + FIRST_LEVEL_SELECTED_ITEM).index()]["downloadLink"];
                else
                    VOD_URL = APP_SEARCH_ARRAY[$("#" + FIRST_LEVEL_SELECTED_ITEM).index()]["downloadLink"];

                VOD_COUNTER = $("#" + FIRST_LEVEL_SELECTED_ITEM).index();
                setTimeout(() => { load_video(); }, 100);
            }

        } else if ($(".dashboard_container").hasClass("active")) {
            console.log("dashboard click", elementId);
            let index = Number($("#" + elementId).attr("data-item-index"));

            // let s = moment()

            let startTime = ACTIVITY_DATA['infoEvents'][index]["startTime"].split(" ")[0]; //ACTIVITY_DATA['infoEvents'][index]['endTime'];

            let endTime = ACTIVITY_DATA['infoEvents'][index]["endTime"].split(" ")[0]; //ACTIVITY_DATA['infoEvents'][index]['endTime'];

            let t = moment().format('HH:MM:SS');
            let s = dateCompare(t, startTime);
            let e = dateCompare(t, endTime);

            console.log(t, s, e);
            if ((s == 1 && e == -1) || (s == 0 && e == -1)) {
                console.log('is between');
            } else {
                console.log('is not between');
            }

            // VOD_URL = ACTIVITY_DATA["infoEvents"][index]
            // load_video();


            // var time = moment() gives you current time. no format required.
            // console.log( ACTIVITY_DATA['infoEvents'][index]["startTime"].split(" ")[0], ACTIVITY_DATA['infoEvents'][index]["endTime"].split(" ")[0]);
            // const time = moment().format("18:30:00","HH:MM:SS");
            // const beforeTime = moment(ACTIVITY_DATA['infoEvents'][index]["startTime"].split(" ")[0], "HH:MM:SS");
            // const afterTime = moment(ACTIVITY_DATA['infoEvents'][index]["endTime"].split(" ")[0], "HH:MM:SS");
            // console.log(time, beforeTime, afterTime);
            // if (time.isBetween(beforeTime, afterTime)) {
            //     console.log('is between');
            // } else {
            //     console.log('is not between');
            // }

            // let startTime = ACTIVITY_DATA['infoEvents'][index]["start"] + " " + ACTIVITY_DATA['infoEvents'][index]["startTime"].split(" ")[0]; //ACTIVITY_DATA['infoEvents'][index]['endTime'];
            // let start = new Date(startTime).getTime();

            // let endTime = ACTIVITY_DATA['infoEvents'][index]["end"] + " " + ACTIVITY_DATA['infoEvents'][index]["endTime"].split(" ")[0]; //ACTIVITY_DATA['infoEvents'][index]['endTime'];
            // let end = new Date(endTime).getTime();

            // let today = new Date().getTime();
            // console.log("hjkjdsdsk kksj  ", today, start, end);
            // if ((today <= end && today >= start)) console.log("play video");
            // else console.log("not available right now");

        } else if ($(".setting_container").hasClass("active")) {
            let lang = $("#" + elementId).attr("data-locale");
            let locale = localStorage.getItem("locale");
            if ($("#" + elementId).parent().attr("id") == 'languages' && (lang != locale)) {
                FIRST_LEVEL_SELECTED_ITEM = elementId;
                $("#" + FIRST_LEVEL_SELECTED_ITEM).text();
                $(".language-change-message").html('<span class="change-language-msg">' + TXT['CHANGE_TO'] + ' ' + $.trim(TXT["MULTI_LANGUAGE"][$("#" + FIRST_LEVEL_SELECTED_ITEM).index()]) + '? </span><span class="change-lang-instruction">' + TXT['WILL_RESTART'] + '</span>');
                if (!$(".modal_container").hasClass("active")) setTimeout(function () { hide_show_modal(true, "LANGUAGE"); }, 200);
                else if ($(".modal_container").hasClass("active")) hide_show_modal(false, "LANGUAGE");
            }
        } else if ($(".video_list_container").hasClass("active")) {
            THIRD_LEVEL_SELECTED_ITEM = elementId;
            if (elementId.search('video_') > -1) {
                VOD_URL = APP_VIDEO_ARRAY[$("#" + THIRD_LEVEL_SELECTED_ITEM).index()]["downloadLink"];
                VOD_COUNTER = $("#" + THIRD_LEVEL_SELECTED_ITEM).parent().index();
                console.log(VOD_URL, VOD_COUNTER);
                setTimeout(function () { load_video(); }, 100);
            }
        }
    }
}


function _onMouseOverEvent(e) {
    e.preventDefault();
    var elementId = this.id;
    console.log("MouseOver is " + elementId);

    var itemArray = document.getElementsByClassName("focusable");
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }

    if (elementId != "") {
        if ($('#modal_container').hasClass("active")) {
            if (elementId.search("yesButton") > -1) $("#yesButton").focus();
            else if (elementId.search("noButton") > -1) $("#noButton").focus();
            else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
            else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
            else if ($(".exit_modal_show").parent().attr("data-modal-name") == "EXIT") SN.focus("exitModal");
            else SN.focus("retryModal");

        } else {
            if (elementId.search("searchInputText") > -1) $("#searchInputText").focus();
            else if (elementId.search("email") > -1) $("#email").focus();
            else if (elementId.search("password") > -1) $("#password").focus();
            else if (elementId.search("submit") > -1) $("#submit").focus();
            else if (elementId.search("rememberMe") > -1) $("#rememberMe").focus();
            else if (elementId.search("searchBox") > -1) $("#searchBox").focus();
            else if (elementId.search("logout_btn") > -1) $("#logout_btn").focus();
            else if ($("#" + elementId).closest('div.focusable').length > 0) $("#" + elementId).closest('div.focusable').focus();
            else if ($("#" + elementId).closest('li').length > 0) $("#" + elementId).closest('li').focus();
        }
    }
    if ($(":focus").length > 0) lastFocusedElementId = $(":focus").attr("id");
}