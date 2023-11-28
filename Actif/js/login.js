window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    $(".login_container").show();
    if (localStorage.getItem("locale") == null) localStorage.setItem("locale", "pt-PT");
    addEventListeners();
    changeDynamicText();
    // localStorage.setItem('actif_user_email', "");
    // localStorage.setItem('actif_user_password', "");

    // localStorage.setItem('actif_user_email', "testing09k@gmail.com");
    // localStorage.setItem('actif_user_password', "Test@123");

    document.getElementById('email').value = "testing09k@gmail.com";
    document.getElementById('password').value = "Test@123";
    SN.focus("#submit");


    set_login_focus('loginDetail', 'email');
    function set_login_focus(containerId, itemId) {
        console.log(containerId, itemId);
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

    $('#loginDetail').on('sn:enter-down', function (e) {
        $("#" + e.target.id).click();
    });


    var email = localStorage.getItem('actif_user_email'),
        password = localStorage.getItem('actif_user_password');

    if (localStorage.getItem("actif_user_email")) {
        $("#login_loader").show();
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        setTimeout(function () {
            loginApi();
        }, 3000);
    } else {
        if (email != null && email != "") document.getElementById('email').value = email;
        if (password != null && password != "") document.getElementById('password').value = password;

        if ((email != null && email != "" && password != null && password != "")) SN.focus("#submit");
        else {
            localStorage.setItem('actif_user_email', "");
            localStorage.setItem('actif_user_password', "");
            SN.focus("#submit");
            // SN.focus("loginDetail");
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
            if ($('.login_container').hasClass('active') && ($("#email").is(":focus") || $("#password").is(":focus"))) {
                var textEntered = $.trim($(':focus').val());
                if (textEntered) controlLeftArrowKeys();
            }
            break;

        case 39: // RIGHT arrow
            console.log("right key");
            if ($('.login_container').hasClass('active') && ($("#email").is(":focus") || $("#password").is(":focus"))) {
                var textEntered = $.trim($(':focus').val());
                var input = document.getElementById($(":focus").attr("id"));
                var currentpos = input.selectionStart;
                if (textEntered && input.value.length > currentpos) controlrightArrowKeys();
            }
            break;

        case 13: // Done from keyboard
            console.log("OK from keyboard...");
            if ($(".login_container").hasClass("active")) {
                if ($('#email').is(":focus")) SN.focus('#password');
                else if ($('#password').is(":focus")) setTimeout(function () { SN.focus('#loginButton') }, 50);
            }
            break;
        default:
            console.log("Key code : " + evt.keyCode);
            break;
    }
});

function loginApi() {
    console.log("loginApi");
    $("#login-loader").show();
    var info = { "email": "testing09k@actif.online", "password": "Test@123", "rememberMe": "true" };

    const login_header = {
        'Accept': '*/*',
        "Authorization": "Bearer undefined",
    };

    var settings = {
        url: APP_DOMAIN + "/api/v0/auth/pro/login",
        method: "POST",
        data: JSON.stringify(info),
        dataType: "json",
        contentType: "application/json",
        traditional: true,
        crossDomain: true,
        headers: login_header,
        xhrFields: {
            withCredentials: true,
        },
        timeout: 5000,
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#login-loader").hide();
        if (response.status == "success") {
            localStorage.setItem("actif_token", response.data.idToken);
            window.location.href = "home.html";
        }
        else login_error_message(TXT["CONTACT_ADMIN"]);
    }).fail(function (error) {
        console.log("Error: ", error);
        $("#login-loader").hide();
        if (error.responseJSON !== undefined) login_error_message(error.responseJSON.message);
        else login_error_message(TXT["CONTACT_ADMIN"]);
    });

}

function login_error_message(msg) {
    console.log(msg);
    $("#login-loader").hide();
    if (msg == '') msg = TXT["TRY_AGAIN"];
    $("#loginError").text(msg).show();
    SN.focus("loginDetail");
    setTimeout(function () {
        $("#loginError").hide();
    }, 5000);
}

function checkUncheckRememberMeBtn() {
    check = 0;
    return function () {
        if (check == 0) {
            $("#rememberMe").find("img").attr("src", "images/checked.png");
            $("#rememberMe").attr("data-checked", 1);
            check = 1;
        } else if (check == 1) {
            $("#rememberMe").find("img").attr("src", "images/unchecked.png");
            $("#rememberMe").attr("data-checked", 0);
            check = 0;
        }
    }
}

function changeDynamicText() {
    $("#loginFormHeading").text(TXT['WELCOME']);
    $("#loginFormSubHeading").text(TXT['LOG_INTO_ACCOUNT']);
    $("#emailLable").text(TXT['EMAIL']);
    $("#email").attr("placeholder", TXT['EMAIL_ADDRESS']);
    $("#passwordLable").text(TXT['PASSWORD']);
    $("#password").attr("placeholder", TXT['PASSWORD']);
    $("#rememberMeText").text(TXT['REMEMBER_ME']);
    $("#submitButtonText").text(TXT['LOGIN']);
}




