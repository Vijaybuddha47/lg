function loginApi() {
    try {
        var settings = {
            "url": "https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            "data": JSON.stringify({
                "email": "testing09k@gmail.com",
                "password": "Test@123",
                "rememberMe": true,
            }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown)
        });
    } catch (error) {
        console.log("Error 1: ", error);
    }
}

loginApi();

$.ajax({

    method: "POST",
    url: "https://backend-zxus9.ondigitalocean.app/api/v0/auth/pro/login",
    data: { "email": "testing09k@gmail.com", "password": "Test@123", "rememberMe": true }
}).done(function (msg) {
    console.log("Data Saved: " + msg);
}).fail(function (response) {
    console.log(response);
});