window.addEventListener('load', function() {
	console.log("page load");
	var userName = localStorage.getItem('user_name'),
		password = localStorage.getItem('password');
	
    var defaultFocusButton;
	if (userName != null && userName != "" && password != null && password != "") defaultFocusButton = '#loginButton';
	else defaultFocusButton = '#userName';
	
	window.SN = SpatialNavigation;
	SN.init();

	SN.add({
		id: 'login_page',
		selector: '#login_page .focusable',
		defaultElement: defaultFocusButton,
		enterTo: 'last-focused',
		restrict: 'self-only'
	});

	$('#login_page .focusable').on('sn:focused', function() {
		console.log("login_page focused");
		loadLogin();
		$(this).addClass('active');
		$("#login_page").addClass('active');
	});

	$('#login_page .focusable').on('sn:unfocused', function() {
		console.log("login_page unfocused");
		$(this).removeClass('active');
	});
    
	SN.makeFocusable();
	SN.focus('login_page');
	
	$(window).keydown(function(evt) {
		switch(evt.keyCode) {
			case 13:	// Ok
						if ($("#loginButton").hasClass("active")) {
							manageLoginLogout();
							
						} else if ($("#browseContentButton").hasClass("active")) {
							console.log('browseContentButton button OK');
							moveToHomePageWithoutLogin();

						} else if ($("#userName").hasClass("active")) {
							document.getElementById('userName').blur();
							LAST_FOCUSED = 1;
							
						} else if ($("#userPwd").hasClass("active")) {
							document.getElementById('userPwd').blur();
							LAST_FOCUSED = 2;
							
						} else {
							setFocusedOnLastFocus();
						}
						break;
				
			case 461:	// Return key
						if ($("#login_page").hasClass("active")) {
							console.log('return to main screen');
							$("#login_page").removeClass('active');
							moveToHomePageWithoutLogin();
						}
						break;
				
			default:
						console.log("Key code : " + evt.keyCode);
						break;
		}
	});
});

function set_first_focus(keyCode)
{
	if (FIRST_FOCUS) {
		FIRST_FOCUS = 0;
		setFocusedOnLastFocus();
	} else setFormFocus(keyCode);
}

function setFormFocus(keyCode)
{
	var userName = localStorage.getItem('user_name'),
		password = localStorage.getItem('password');

	if (keyCode == 38) {
		console.log("up key...");
		if ($("#browseContentButton").is(":focus")) {
			document.getElementById('browseContentButton').blur();
			document.getElementById('loginButton').focus();
			LAST_FOCUSED = 3;

		} else if ($("#loginButton").is(":focus")) {
			document.getElementById('loginButton').blur();
			document.getElementById('userPwd').focus();
			LAST_FOCUSED = 2;

		} else if ($("#userPwd").is(":focus")) {
			document.getElementById('userPwd').blur();
			document.getElementById('userName').focus();
			LAST_FOCUSED = 1;
		}

	} else {
		console.log("Down key...");
		if ($("#userName").is(":focus")) {
			document.getElementById('userName').blur();
			document.getElementById('userPwd').focus();
			LAST_FOCUSED = 2;

		} else if ($("#userPwd").is(":focus")) {
			document.getElementById('userPwd').blur();
			document.getElementById('loginButton').focus();
			LAST_FOCUSED = 3;
		
		} else if ($("#loginButton").is(":focus") && keyCode != 13) {
			document.getElementById('loginButton').blur();
			document.getElementById('browseContentButton').focus();
			LAST_FOCUSED = 4;
		
		} else if ($("#loginButton").is(":focus") && keyCode == 13) {
			manageLoginLogout();

		} else if ($("#browseContentButton").is(":focus") && keyCode == 13) {
			moveToHomePageWithoutLogin();
		}
	}
}

function manageLoginLogout()
{
	if ($("#loginButton").hasClass("login")) {
		if (document.getElementById('userName').value == "") hideShowError("Email id is required", "41%");
		else if (document.getElementById('userPwd').value == "") hideShowError("Password is required", "41%");
		else loginIntoApp();

	} else if ($("#loginButton").hasClass("logout")) {
		var oauth = get_oauth_attr();
		$.ajax({
			type: "POST",
			url:  BASE_URL + "logout?oauth_consumer_key="+ OAUTH_CONSUMER_KEY +"&oauth_consumer_secret="+ OAUTH_CONSUMER_SECRET + oauth,
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			async: true,
			cache: false,
			timeout: REQUEST_TIMEOUT * 1000,
			success: function(json) {
				console.log(json);
				logoutFromApp();

			}, error: function(xhr, error) {
				console.log(xhr, error);
				logoutFromApp();
			}
		});
	}
}

function moveToHomePageWithoutLogin()
{
	sessionStorage.move_to_login_sign_out_menu = 0;
	window.location.href = "home.html";
}

function setFocusedOnLastFocus()
{
	if (LAST_FOCUSED == 1) document.getElementById('userName').focus();
	else if (LAST_FOCUSED == 2) document.getElementById('userPwd').focus();
	else if (LAST_FOCUSED == 3) document.getElementById('loginButton').focus();
	else if (LAST_FOCUSED == 4) document.getElementById('browseContentButton').focus();
	
	return;
}

// Login Process
function loginIntoApp()
{
	$(".login_loader").show();
	$.ajax({
	 	type: "POST",
	    url:  BASE_URL + "login",
	    dataType: "JSON",
		data: jQuery.param({subscriptionForm: 1, email: document.getElementById('userName').value, password: document.getElementById('userPwd').value, oauth_consumer_key: OAUTH_CONSUMER_KEY, oauth_consumer_secret: OAUTH_CONSUMER_SECRET, ip: IP_ADDRESS, language: "en"}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		async: true,
		cache: false,
		timeout: REQUEST_TIMEOUT * 1000,
	    success: function(json) {
			console.log(json);
			$("#loginProgressPopup").hide();
			$(".login_loader").hide();
			if (json.status_code == 200) {
				sessionStorage.move_to_login_sign_out_menu = 0;
				localStorage.setItem('user_name', document.getElementById('userName').value);
				localStorage.setItem('password', document.getElementById('userPwd').value);
				localStorage.setItem('oauth_token', json.body.oauth_token);
				localStorage.setItem('oauth_secret', json.body.oauth_secret);
				window.location.href = "home.html";
				
			} else {
				hideShowError("The email and password you entered is incorrect.", "27.5%");
				console.log("login error.");
			}
		}, error: function(xhr, error) {
			$(".login_loader").hide();
			hideShowError("The email and password you entered is incorrect.", "27.5%");
			console.log(xhr.responseJSON);
		}
	});
}

function hideShowError(text, left)
{
	clearInterval(HIDE_SHOW_ERROR);
	if ($(".error_overlay").css("display") == "none") $(".error_overlay").text(text).css({"left": left, "display": "block"});

	HIDE_SHOW_ERROR = setTimeout(function() {
		$(".error_overlay").css({"display": "none"});
	}, 10000);
}

function logoutFromApp()
{
	localStorage.setItem('user_name', "");
	localStorage.setItem('password', "");
	localStorage.setItem('oauth_token', "");
	localStorage.setItem('oauth_secret', "");
	document.getElementById('userName').value = "";
	document.getElementById('userPwd').value = "";
	document.getElementById('loginButton').blur();
	$('#loginButton').text('login').removeClass("logout").addClass("login");
	document.getElementById('userName').focus();
}

function loadLogin(){
	window.LAST_FOCUSED = 1,
	window.HIDE_SHOW_ERROR = "";
	window.FIRST_FOCUS = 0; // to manage focus when user reach page without login
	$(".container_box").show();
	var userName = localStorage.getItem('user_name'),
		password = localStorage.getItem('password');
		
	if (userName != null && userName != "") document.getElementById('userName').value = userName;
	if (password != null && password != "") document.getElementById('userPwd').value = password;
	
	get_ip_address();
	
	if (userName != null && userName != "" && password != null && password != "") {
		console.log('focus logout button');
		$('#loginButton').text('Logout').addClass("logout");
		LAST_FOCUSED = 3;

	} else {
		localStorage.setItem('user_name', "");
		localStorage.setItem('password', "");
		localStorage.setItem('oauth_token', "");
		localStorage.setItem('oauth_secret', "");
		$('#loginButton').text('Login').addClass("login");
		FIRST_FOCUS = 1;
	}
}