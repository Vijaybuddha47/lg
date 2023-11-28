window.onload = function () {
    window.SN = SpatialNavigation;
    SN.init();
    $(".login_container").show();
    if (localStorage.getItem("locale") == null) localStorage.setItem("locale", "pt-PT");
    addEventListeners();
    // localStorage.setItem('actif_user_email', "");
    // localStorage.setItem('actif_user_password', "");

    // localStorage.setItem('actif_user_email', "testing09k@gmail.com");
    // localStorage.setItem('actif_user_password', "Test@123");

    document.getElementById('email').value = "testing09k@actif.online";
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
            // loginTest();
        }, 3000);
    } else {
        if (email != null && email != "") document.getElementById('email').value = email;
        if (password != null && password != "") document.getElementById('password').value = password;

        if ((email != null && email != "" && password != null && password != "")) SN.focus("#submit");
        else {
            localStorage.setItem('actif_user_email', "");
            localStorage.setItem('actif_user_password', "");
            SN.focus("loginDetail");
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
    $("#login-loader").show();



    var form = new FormData();
    form.append("email", "testing09k@gmail.com");
    form.append("password", "Test@123");
    form.append("rememberMe", "true");
    // console.log(form);
    // for (var [key, value] of form.entries()) {
    //     console.log(key, value);
    // }

    var settings = {
        url: "https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login",
        method: "POST",
        data: form,
        processData: false,
        contentType: false,
    };

    $.ajax(settings).done(function (response) {
        console.log("111111", response);
        if (response.status == "success") {
            localStorage.setItem("actif_token", response.data.idToken);
            // localStorage.setItem("locale", response.data.locale);

            window.location.href = "home.html";
        }
        else login_error_message("Failed. Please contact admin.");
    }).fail(function (error) {
        console.log("111111", error);
        try {
            var response = JSON.parse(error.responseText);
            console.log(response);
        }
        catch (e) {
            var response = error.responseText;
            console.log(
                'There was an error: \n -> '
                + e + '\n'
                + 'Complete server response: \n -->'
                + response
            );
        }
    });


    try {
        var timestamp = Math.floor(Date.now() / 1000);
        var settings = {
            url: APP_DOMAIN + "/api/v0/auth/pro/login",// + timestamp,
            method: "POST",
            processData: false,
            contentType: false,
            data: {
                "email": "testing09k@gmail.com",
                "password": "Test@123",
                "rememberMe": "true",
            },
        };

        $.ajax(settings).done(function (response, statusCode) {
            console.log(response, statusCode);
            if (response.status == "success") {
                localStorage.setItem("actif_token", response.data.idToken);
                // window.location.href = "home.html";
            }
            else login_error_message("Failed. Please contact admin.");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown)
            // login_error_message(jqXHR.responseJSON.message);
        });

    } catch (error) {
        console.log("Error 1: ", error);
    }


    // loginApiAjax();
}

function loginApiAjax() {
    try {
        var timestamp = Math.floor(Date.now() / 1000);
        var authURL = APP_DOMAIN + "/api/v0/auth/pro/login";// + timestamp;
        // "https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login"
        $.ajax({
            type: 'POST',
            url: authURL,
            // async: true,
            // cache: false,
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Accept-Language': 'en-US', "Access-Control-Allow-Headers": "*" },
            // // contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            // dataType: 'json',
            data: {
                'email': "testing09k@gmail.com", 'password': "Test@123", 'rememberMe': true
            },
            // crossDomain: true,
            // timeout: 0,
            statusCode: {
                200: function (response) {
                    console.log(response);
                },
                201: function (response) {
                    console.log(response);
                },
                400: function (response) {
                    console.log(response);
                    // bootbox.alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function () { });
                },
                404: function (response) {
                    console.log(response);
                    // bootbox.alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function () { });
                }
            },
            success: function (response, statusCode) {
                console.log(response, statusCode);
                // if (statusCode === "success") {

                // } else login_error_message("Something went wrong.");
            },
            error: function (xhr, statusText, err) {
                console.log(xhr, statusText, err);
                // var msg;
                // if (navigator.onLine) msg = xhr.responseText;
                // else msg = TXT['CHECK_CONNECTION'];
                // login_error_message(msg);
            }
        });

    } catch (error) {
        console.log("Error 2: ", error);
    }

}

function login_error_message(msg) {
    console.log(msg);
    $("#login-loader").hide();
    if (msg == '') msg = "Somthing went wrong. Please try again."
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






function loginTest() {
    var form = new FormData();
    form.append("email", "testing09k@gmail.com");
    form.append("password", "Test@123");
    form.append("rememberMe", "true");
    // console.log(form);
    // for (var [key, value] of form.entries()) {
    //     console.log(key, value);
    // }

    var settings = {
        url: "https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login",
        method: "POST",
        // timeout: 0,
        // headers: {
        //     "Content-Type": "application/json",
        // },
        processData: false,
        // mimeType: "multipart/form-data",
        contentType: false,
        data: JSON.stringify({
            "email": localStorage.getItem("actif_user_email"),
            "password": localStorage.getItem("actif_user_password"),
            "rememberMe": "true",
        })
    };

    $.ajax(settings).done(function (response) {
        console.log("111111", response);
    }).fail(function (error) {
        console.log("111111", error);
        try {
            var response = JSON.parse(error.responseText);
            console.log(response);
        }
        catch (e) {
            var response = error.responseText;
            console.log(
                'There was an error: \n -> '
                + e + '\n'
                + 'Complete server response: \n -->'
                + response
            );
        }
    });


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var formdata = new FormData();
    formdata.append("email", "testing09k@gmail.com");
    formdata.append("password", "Test@123");
    formdata.append("rememberMe", "true");
    // for (var [key, value] of formdata.entries()) {
    //     console.log(key, value);
    // }

    var requestOptions = {
        method: 'POST',
        // headers: myHeaders,
        body: JSON.stringify(formdata),
        processData: false,
        contentType: false,
        redirect: 'follow'
    };

    fetch("https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login", requestOptions)
        .then(response => response.text())
        .then(result => console.log("22222", result))
        .catch(function (error) {
            console.log("222222", error)
            try {
                var response = JSON.parse(error.responseText);
                console.log(response);
            }
            catch (e) {
                var response = error.responseText;
                console.log(
                    'There was an error: \n -> '
                    + e + '\n'
                    + 'Complete server response: \n -->'
                    + response
                );
            }
        });



    // WARNING: For POST requests, body is set to null by browsers.
    var data = new FormData();
    data.append("email", "testing09k@gmail.com");
    data.append("password", "Test@123");
    data.append("rememberMe", "true");


    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        console.log("33333", this);
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login");
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));


    fetchData();

}

const fetchData = async function (data = {}) {

    var data = new FormData();
    data.append("email", "testing09k@gmail.com");
    data.append("password", "Test@123");
    data.append("rememberMe", "true");

    let url = 'https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login';
    const response = await fetch(url, {
        method: 'POST',
        // mode: 'no-cors',
        // cache: 'no-cache',
        // credentials: 'include',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: 'follow',
        // referrerPolicy: 'same-origin',
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.log('Error:', error);
            return;
        });

    console.log("444444", response);
    return response.json();
}




