window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    $("span#modal_container").load("modal.html");
    getPublicIP();
    getMacAddress();
    // getUniqueId();


    window.HIDE_SHOW_LOGIN_ERROR = "";
    document.getElementById('userName').value = localStorage.getItem('pupilhd_app_user_name');
    document.getElementById('password').value = localStorage.getItem('pupilhd_app_password');

    // Username: lg@pupilhd.com
    // Password: LG@12345

    $(".login-container").show();

    set_login_focus('login_container', 'username');

    if (localStorage.getItem('pupilhd_app_user_name') && localStorage.getItem('pupilhd_app_password')) {
        loginApi();
    } else SN.focus("login_container");


    // When search input focus
    $('#login_container').on('sn:focused', function (e) {
        console.log("login page focus");
        TAB_INDEX = -1;
    });

    $('#loginButton').on('sn:enter-down', function (e) {
        console.log("login button enter");
        $("#" + e.target.id).click();
    });

    set_login_focus('forgot_pass_popup', 'ok_popup');

    // When forgot button enter
    $('#forgotPass').on('sn:enter-down', function (e) {
        console.log("forgot link enter");
        $("#" + e.target.id).click();
    });

    // When search input focus
    $('#forgot_pass_popup').on('sn:focused', function (e) {
        console.log("popup focus");
    });
    // When forgot button enter
    $('#forgot_pass_popup').on('sn:enter-down', function (e) {
        console.log("ok enter");
        $("#" + e.target.id).click();
    });

    addEventListeners();
}


function login_error_message(title, msg) {
    $("#login_loader").hide();
    $(".login_container").addClass("active");
    $(".login_container").show();

    clearInterval(HIDE_SHOW_LOGIN_ERROR);
    $("#error_title").text(title);
    $("#error_message").text(":" + msg);
    if ($(".error_overlay").css("display") == "none") {
        $(".error_overlay").css({ "display": "block" });
    }
    SN.focus("login_container");

    HIDE_SHOW_LOGIN_ERROR = setTimeout(function () {
        $(".error_overlay").css({ "display": "none" });
    }, 3000);
}

function set_login_focus(containerId, itemId) {
    console.log("set login focus");
    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        restrict: 'self-first',
        defaultElement: '#' + itemId,
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
}

function hideShowError(text, left) {
    clearInterval(HIDE_SHOW_LOGIN_ERROR);
    if ($(".error_overlay").css("display") == "none") $(".error_overlay").text(text).css({ "display": "block" });

    HIDE_SHOW_LOGIN_ERROR = setTimeout(function () {
        $(".error_overlay").css({ "display": "none" });
    }, 10000);
}

function getstalkeraccountdetails() {
    $("#login_loader").show();
    console.log("getstalkeraccountdetails");
    $.ajax({
        type: "GET",
        url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/getstalkeraccountdetails.json?account_number=" + localStorage.getItem("pupilhd_app_account_number"),
        async: true,
        cache: false,
        headers: { "Authorization": TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            console.log(data);
            var parseDate = Date.parse(data.response.date_expire);
            var expiryDate = Math.floor(parseDate.getTime() / 1000);
            var today = Math.floor(new Date().getTime() / 1000);

            if (expiryDate > today) {
                console.log("login success");
                localStorage.setItem('pupilhd_app_expiry_date', data.response.date_expire);
                localStorage.setItem('pupilhd_app_service_name', data.response.service_name);
                localStorage.setItem('pupilhd_app_user_login', data.response.login);
                localStorage.setItem('pupilhd_app_stalker_login', data.response.login);
                localStorage.setItem('pupilhd_app_stalker_password', data.response.password);
                window.location.href = "home.html";
            } else {
                login_error_message("Error", "Your Subscription is Expired.");
                console.log("getstalkeraccountdetails error.")
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function maccheck() {
    $("#login_loader").show();
    console.log("maccheck");
    $.ajax({
        type: "GET",
        url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/maccheck.json?client_id=" + localStorage.getItem("pupilhd_app_client_id") + "&mac=" + localStorage.getItem("pupilhd_app_mac_address"),
        async: true,
        cache: false,
        headers: { "Authorization": TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            console.log(data);
            if (data.response.valid_subscription) {
                console.log("getstalkeraccountdetails");
                localStorage.setItem("pupilhd_app_account_number", data.response.account_number);
                updateip();
                getstalkeraccountdetails();
            } else {
                console.log("maccheck error.");
                login_error_message("Error", "There is problem in validating your device. Please contact PupilHD Support.");
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function accountstatus() {
    $("#login_loader").show();
    console.log("accountstatus");
    $.ajax({
        type: "GET",
        url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/accountstatus.json?client_id=" + localStorage.getItem("pupilhd_app_client_id"),
        async: true,
        cache: false,
        headers: { "Authorization": TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            console.log(data);
            if (data.response) {
                console.log("maccheck");
                maccheck();
            } else {
                login_error_message("Error", "Account is inactive.");
                console.log("accountstatus error.")
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function getClientId() {
    $("#login_loader").show();
    console.log("getClientId");
    $.ajax({
        type: "GET",
        url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/getclientId.json?user=" + localStorage.getItem('pupilhd_app_user_name') + "&password=" + localStorage.getItem('pupilhd_app_password'),
        async: true,
        cache: false,
        headers: { "Authorization": TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            console.log(data);
            if (data.response != '') {
                localStorage.setItem("pupilhd_app_client_id", data.response);
                accountstatus();
            } else {
                login_error_message("Error", "Something went wrong.");
                console.log("client id error.")
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function loginApi() {
    $(".login_container").removeClass("active");
    $(".login_container").hide();
    $("#login_loader").show();
    console.log("loginApi");


    $.ajax({
        type: "GET",
        url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/blestalogin.json?user=" + localStorage.getItem('pupilhd_app_user_name') + "&password=" + localStorage.getItem('pupilhd_app_password'),
        async: true,
        cache: false,
        headers: { "Authorization": TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            console.log(data);
            if (data.response) {
                getClientId();
            } else {
                login_error_message("Error", "Invalid username or password");
                console.log("Something went wrong.")
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

function getPublicIP() {
    console.log("getPublicIP");
    $.ajax({
        type: "GET",
        url: "https://ipinfo.io",
        async: true,
        cache: false,
        headers: { "Accept": "application/json" },
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            localStorage.setItem("pupilhd_app_ip_address", response.ip);
        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
            if (navigator.onLine) msg = SOMETHING_WENT_WRONG;
            else msg = NET_CONNECTION_ERR;
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}



function updateip() {
    console.log("updateip");
    $.ajax({
        type: "GET",
        url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/updateip.json?client_id=" + localStorage.getItem("pupilhd_app_client_id") + "updateip=" + localStorage.getItem("pupilhd_app_ip_address") + "& mac=" + localStorage.getItem('pupilhd_app_mac_address'),
        async: true,
        cache: false,
        headers: { "Authorization": TOKEN },
        crossDomain: true,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            if (data.response) {
                console.log("updateip");
            } else console.log("updateip error.")
        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
        }
    });
}


$(window).keydown(function (evt) {
    switch (evt.keyCode) {
        case 13: // OK key
            if ($(".login_container").hasClass("active") && ($("#userName").is(":focus") || $("#password").is(":focus"))) {
                var text = $.trim($(':focus').val());
                if ($("#userName").is(":focus") && text) SN.focus("#password");
                else if ($("#password").is(":focus") && text) {
                    console.log("Okay key pressed");
                    $("#password").blur();
                    setTimeout(function () { SN.focus("#loginButton"); }, 100);
                }

            }
            break;
        case 461: // Return key
            if ($(".login_container").hasClass("active") && $("#ok_popup").is(":focus")) {
                $(".pop-up-box").hide();
                SN.focus("login_container");
            } else if ($(".login_container").hasClass("active")) {
                window.close();
            }
            break;

        case 37: // LEFT arrow
            console.log("left key");
            if ($('.login_container').hasClass('active') && ($("#userName").is(":focus") || $("#password").is(":focus"))) {
                console.log("pointer move left ");
                var textEntered = $.trim($(':focus').val());
                if (textEntered) controlLeftArrowKeys();
            }
            break;

        case 39: // RIGHT arrow
            console.log("right key");
            if ($('.login_container').hasClass('active') && ($("#userName").is(":focus") || $("#password").is(":focus"))) {
                var textEntered = $.trim($(':focus').val());
                var input = document.getElementById($(":focus").attr("id"));
                var currentpos = input.selectionStart;
                if (textEntered && input.value.length > currentpos) controlrightArrowKeys();
            }
            break;
        default:
            console.log("Key code : " + evt.keyCode);
            break;
    }
});

// Get system ID information
function getUniqueId() {
    var request = webOS.service.request('luna://com.webos.service.sm', {
        method: 'deviceid/getIDs',
        parameters: {
            idType: ['LGUDID'],
        },
        onSuccess: function (inResponse) {
            if (inResponse.returnValue) {
                // localStorage.setItem('pupilhd_app_mac_address', inResponse.idList[0]["idValue"]);
                localStorage.setItem('pupilhd_app_mac_address', "b0:37:95:4c:76:f2");
            }
            else hide_show_modal(true, "RETRY_EXIT", inResponse.errorText);
        },
        onFailure: function (inError) {
            console.log('Failed to get system ID information');
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            hide_show_modal(true, "RETRY_EXIT", inError.errorText);
        },
    });

}

function getMacAddress() {
    webOS.service.request("luna://com.webos.service.connectionmanager", {
        method: "getinfo",
        parameters: {},
        onSuccess: function (args) {
            console.log(args);
            // if (args.wiredInfo.macAddress) localStorage.setItem('pupilhd_app_mac_address', args.wiredInfo.macAddress);
            // else if (args.wifiInfo.macAddress) localStorage.setItem('pupilhd_app_mac_address', args.wifiInfo.macAddress);
            localStorage.setItem('pupilhd_app_mac_address', "b0:37:95:4c:76:f2");
        },
        onFailure: function (args) {
            console.log("Failed to get network state");
        }
    });
}