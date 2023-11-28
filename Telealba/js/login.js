window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    $("span#modal_container").load("modal.html");
    $(".login_container").show();
    getIPAddress();
    addEventListeners();

    var userName = localStorage.getItem('telealba_app_user_id'),
        password = localStorage.getItem('telealba_app_password');

    if (localStorage.getItem("telealba_app_user_name")) {
        $("#login_loader").show();
        document.getElementById('userName').value = userName;
        document.getElementById('password').value = password;
        setTimeout(function () {
            $("#login_container").hide();
            loginApi();
        }, 8000);
    } else {
        set_login_focus('login_container', 'userName');

        $('#login_container').on('sn:enter-down', function (e) {
            $("#" + e.target.id).click();
        });

        if (userName != null && userName != "") document.getElementById('userName').value = userName;
        if (password != null && password != "") document.getElementById('password').value = password;

        if ((userName != null && userName != "" && password != null && password != "")) {
            SN.focus("#loginButton");
        } else {
            localStorage.setItem('telealba_app_user_id', "");
            localStorage.setItem('telealba_app_password', "");
            SN.focus("login_container");
        }
    }
};

$(window).keydown(function (evt) {
    switch (evt.keyCode) {
        case 461: // Return key
            if ($(".login_container").hasClass("active")) {
                window.close();
            }
            break;

        case 37: // LEFT arrow
            console.log("left key");
            if ($('.login_container').hasClass('active') && ($("#userName").is(":focus") || $("#password").is(":focus"))) {
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

        case 13: // Done from keyboard
            console.log("OK from keyboard...");
            if ($(".login_container").hasClass("active")) {
                if ($('#userName').is(":focus")) SN.focus('#password');
                else if ($('#password').is(":focus")) setTimeout(function () { SN.focus('#loginButton') }, 50);
            }
            break;
        default:
            console.log("Key code : " + evt.keyCode);
            break;
    }
});

function login_error_message(msg) {
    $("#login_loader").hide();
    $(".login_container").show();

    if (!_.isString(msg)) {
        if (msg.status == 404) msg = "Not found.";
        else msg = msg.responseText;
    }
    var jsonString = msg.search("{");
    if (jsonString > -1) {
        var msgObject = JSON.parse(msg);
        msg = msgObject.MinervaError.message;
    }

    clearTimeout(HIDE_SHOW_LOGIN_ERROR);
    $("#error_message").text(msg);
    if ($(".error_overlay").css("display") == "none") {
        $(".error_overlay").css({ "display": "block" });
    }
    $("#login_loader").hide();
    $("#login_container").show();
    SN.focus("login_container");

    HIDE_SHOW_LOGIN_ERROR = setTimeout(function () {
        $(".error_overlay").css({ "display": "none" });
    }, 8000);
}

function set_login_focus(containerId, itemId) {
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

function getMacAddress() {
    webOS.service.request("luna://com.webos.service.connectionmanager", {
        method: "getinfo",
        parameters: { subscribe: true },
        onSuccess: function (args) {
            if (args.returnValue) { localStorage.setItem("mac_address", args.wiredInfo.macAddress); }
            else if (args.returnValue) { localStorage.setItem("mac_address", args.wifiInfo.macAddress); }
        },
        onFailure: function (args) {
            console.log("Failed to get network state", args);
        }
    });
}

function getIPAddress() {
    subscriptionHandle = webOS.service.request(
        'luna://com.palm.connectionmanager',
        {
            method: 'getStatus',
            parameters: { subscribe: true },
            onSuccess: function (resp) {
                if (resp.isInternetConnectionAvailable && resp.returnValue) {
                    // getMacAddress();
                    getUniqueId();
                    if (resp.wired.state === "connected") localStorage.setItem("ip_address", resp.wired.ipAddress);
                    else if (resp.wifi.state === "connected") localStorage.setItem("ip_address", resp.wifi.ipAddress);
                } else hide_show_modal(true, 'RETRY_EXIT', NET_CONNECTION_ERR);
            },
            onFailure: function (inError) {
                console.log('Failed to get network state');
                console.log('[' + inError.errorCode + ']: ' + inError.errorText);
                hide_show_modal(true, 'RETRY_EXIT', inError.errorText);
            },
        }
    );
}

// Get system ID information
function getUniqueId() {
    var request = webOS.service.request('luna://com.webos.service.sm', {
        method: 'deviceid/getIDs',
        parameters: {
            idType: ['LGUDID'],
        },
        onSuccess: function (inResponse) {
            if (inResponse.returnValue) {
                localStorage.setItem("mac_address", inResponse.idList[0]["idValue"]);
                getUserInfo();
            }
            else hide_show_modal(true, 'RETRY_EXIT', inResponse.errorText);
        },
        onFailure: function (inError) {
            console.log('Failed to get system ID information');
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            hide_show_modal(true, 'RETRY_EXIT', inError.errorText);
        },
    });

}


function loginApi() {
    var authURL = APP_DOMAIN + "/xtv-ws-client/api/login/auth";
    $.ajax({
        type: 'POST',
        url: authURL,
        async: true,
        cache: false,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US' },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data: {
            'type': "accountid", 'accountId': localStorage.getItem("telealba_app_user_id"), 'password': localStorage.getItem("telealba_app_password")
        },
        crossDomain: true,
        success: function (response, statusCode, xhr, text_status) {
            if (statusCode === "success") {
                if (FIRST_TIME == 1) subscribeApi();
                else followApi();
            } else login_error_message("Something went wrong.");
        },
        error: function (xhr, error) {
            var msg;
            if (navigator.onLine) msg = xhr.responseText;
            else msg = NET_CONNECTION_ERR;
            login_error_message(msg);
        }
    });

}

function followApi() {
    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/login/follow",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        "data": JSON.stringify({
            "device": {
                "xmlns": "http://ws.minervanetworks.com/",
                "MACAddress": localStorage.getItem("mac_address"),
                "IPAddress": localStorage.getItem("ip_address"),
                "uuid": localStorage.getItem("mac_address"),
                "clientCasId": localStorage.getItem("mac_address"),
            }
        }),
    };

    $.ajax(settings).done(function (response, statusCode) {
        if (statusCode == "success") window.location.href = "home.html";
        else login_error_message("Failed. Please contact admin.");
    }).fail(function (xhr, error) {
        console.log(xhr);
        login_error_message(xhr);
    });
}


function subscribeApi() {

    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/user/device/subscribe",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify({
            "device": {
                "xmlns": "http://ws.minervanetworks.com/",
                "MACAddress": localStorage.getItem("mac_address"),
                "IPAddress": localStorage.getItem("ip_address"),
                "uuid": localStorage.getItem("mac_address"),
                "dhcp": "true",
                "deviceType": "phone",
                "externalPort": "7780",
                "adminUserId": 1
            }
        }),
    };

    $.ajax(settings).done(function (response, statusCode) {
        if (statusCode == "success") window.location.href = "home.html";
        else login_error_message("Something went wrong.");
    }).fail(function (xhr) {
        console.log(xhr);
        var msg = '';
        if (xhr.status == 403) msg = "Device with this MAC address is already assigned to different customer.";
        else if (xhr.status == 403) msg = "Access Denied.";
        else if (xhr.status == 412) msg = "Can't subscribe device! Customer device limit reached.";
        login_error_message(msg);
    });
}

function getUserInfo() {
    var settings = {
        "url": APP_DOMAIN + "/xtv-ws-client/api/userdata/customerByMac/" + localStorage.getItem("mac_address"),
        "method": "GET",
        "timeout": 0,
        "dataType": "JSON",
    };

    $.ajax(settings).done(function (response, statusCode) {
        if (statusCode == "success" && response.customerInfo.deviceId) {
            console.log("getUserInfo api success");
            $(".login-device-info-box").html("<span>Device ID:" + response.customerInfo.deviceId + "</span>");
        }
        else $(".login-device-info-box").html("");
    }).fail(function (jqXHR, error) {
        console.log(jqXHR, error);
    });
}


