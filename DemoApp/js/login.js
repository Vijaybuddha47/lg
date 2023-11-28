window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    $("span#modal_container").load("modal.html");
    getPublicIP();
    getMacAddress();

    // webapis.network.addNetworkStateChangeListener(function (value) {
    //     console.log("addNetworkStateChangeListener", value);
    //     if (value == webapis.network.NetworkState.GATEWAY_DISCONNECTED) {
    //         // Something you want to do when network is disconnected
    //         console.log(" network disconnected");
    //     } else if (value == webapis.network.NetworkState.GATEWAY_CONNECTED) {
    //         // Something you want to do when network is connected again
    //         console.log("Network connected");
    //     }
    // });


    window.HIDE_SHOW_LOGIN_ERROR = "";
    document.getElementById('userName').value = localStorage.getItem('pupilhd_app_user_name');
    document.getElementById('password').value = localStorage.getItem('pupilhd_app_password');
    document.getElementById('userName').value = 'samsungdev@pupilhd.com';
    document.getElementById('password').value = '123456';

    $(".login-container").show();

    set_login_focus('login_container', 'username');

    if (localStorage.getItem('pupilhd_app_user_name') && localStorage.getItem('pupilhd_app_password')) {
        loginApi();
    } else SN.focus("login_container");

    // SN.focus("#loginButton");


    // When search input focus
    $('#login_container').on('sn:focused', function (e) {
        console.log("login page focus");
        TAB_INDEX = -1;
    });

    $('#loginButton').on('sn:enter-down', function (e) {
        console.log("login button enter");
        var userName = document.getElementById('userName').value;
        var password = document.getElementById('password').value;

        if (userName == '') {
            console.log("USERNAME empty.");
            login_error_message("Username empty", "Username is required.")
        } else if (password == '') {
            console.log("password empty.");
            login_error_message("Password empty", "Password is required.")
        } else if (userName && password) {
            localStorage.setItem('pupilhd_app_user_name', userName);
            localStorage.setItem('pupilhd_app_password', password);
            loginApi();
        }
    });

    set_login_focus('forgot_pass_popup', 'ok_popup');

    // When forgot button enter
    $('#forgotPass').on('sn:enter-down', function (e) {
        console.log("forgot link enter");
        $(".pop-up-box").show();
        SN.focus("forgot_pass_popup");
    });

    // When search input focus
    $('#forgot_pass_popup').on('sn:focused', function (e) {
        console.log("popup focus");
    });
    // When forgot button enter
    $('#forgot_pass_popup').on('sn:enter-down', function (e) {
        console.log("ok enter");
        $(".pop-up-box").hide();
        SN.focus("login_container");
    });


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


    function getMAC() {
        try {
            localStorage.setItem("pupilhd_app_mac_address", GET_MAC_ADDRESS);
        } catch (e) {
            console.log("getMAC exception [" + e.code + "] name: " + e.name
                + " message: " + e.message);
        }

        if (null != localStorage.getItem("pupilhd_app_mac_address")) {
            console.log("[getMAC] mac: " + localStorage.getItem("pupilhd_app_mac_address"));
        }
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
                if (data.response.valid_subscription) {
                    console.log("getstalkeraccountdetails");
                    localStorage.setItem("pupilhd_app_account_number", data.response.account_number);
                    updateip();
                    getstalkeraccountdetails();
                } else {
                    login_error_message("Error", "There is problem validating your device Please contact PupilHD Support");
                    console.log("maccheck error.")
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
                if (data.response) {
                    localStorage.setItem('pupilhd_app_mac_address', GET_MAC_ADDRESS);
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
            url: APP_BLESTA_URL + "/wmspanel.wmspanel_sprocket/updateip.json?client_id=" + localStorage.getItem("pupilhd_app_client_id") + "updateip=" + localStorage.getItem("pupilhd_app_ip_address") + "& mac=" + GET_MAC_ADDRESS,
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
            case 10009: // Return key
                if ($(".login_container").hasClass("active") && $("#ok_popup").is(":focus")) {
                    $(".pop-up-box").hide();
                    SN.focus("login_container");
                } else if ($(".login_container").hasClass("active")) {
                    tizen.application.getCurrentApplication().exit();
                }
                break;

            case 37: // LEFT arrow
                console.log("left key");
                if ($('.login_container').hasClass('active') && $("#forgotPass").is(":focus")) {
                    SN.focus("#password");
                }
                else if ($('.login_container').hasClass('active') && ($("#userName").is(":focus") || $("#password").is(":focus"))) {
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
                    if (input.value.length == currentpos) SN.focus("#forgotPass");
                    else if (textEntered && input.value.length > currentpos) controlrightArrowKeys();
                }
                break;
            default:
                console.log("Key code : " + evt.keyCode);
                break;
        }
    });

    // var leftmove,rightmove;
    function controlLeftArrowKeys() {
        console.log("left move");
        var leftmove;
        var input = document.getElementById($(":focus").attr("id"));
        if (input.value.length == 0) {
            SN.focus("#searchIcon");
            return;
        } else {
            var currentpos = input.selectionStart; //getting current postion of cursor

            if (currentpos == 0) SN.focus("#search");
            else {
                leftmove = currentpos - 1;
                setCaretPosition(input, leftmove);
            }
        }
    }
    function controlrightArrowKeys() {
        console.log("right move");
        var rightmove;
        var input = document.getElementById($(":focus").attr("id"));
        if (input.value.length == 0) {
            return;
        } else {
            var currentpos = input.selectionStart;  //getting current postion of cursor
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

}

function getMacAddress(){
    var mac2 = '';
        webOS.service.request("luna://com.webos.service.connectionmanager", {
        method: "getinfo",
        parameters: {},
        onSuccess: function (args) {
            GET_MAC_ADDRESS = args.wiredInfo.macAddress;
            mac2 = args.wifiInfo.macAddress;
            console.log(GET_MAC_ADDRESS , mac2);
        },
        onFailure: function (args) {
            console.log("Failed to get network state"); 
        }
    });
}