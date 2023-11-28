window.onload = function () {
	TAB_INDEX = -1;
	var userName = localStorage.getItem('username'),
		password = localStorage.getItem('password');

	LAST_FOCUSED = 1;

	window.SN = SpatialNavigation;
	SN.init();

	$("span#modal_container").load("modal.html", function () {
		console.log("page load...");
		SN.add({
			id: 'loginPage',
			selector: '#loginPage .focusable',
			defaultElement: "#username",
			enterTo: 'last-focused',
			restrict: 'self-only'
		});

		SN.makeFocusable();
		SN.focus('loginPage');
		addEventListeners();
	});

	$(window).keydown(function (evt) {
		console.log(evt.keyCode);

		var modalName = $(".modal_container").attr("data-modal-name");
		switch (evt.keyCode) {
			case 13:	// OK/Enter key
				if (($("#username").is(":focus") || $("#password").is(":focus"))) {
					loginFormValidation();
				}
				break;

			case 461:	// Return key
				// back from popup to login
				if ($(".modal_container").hasClass("active")) {
					// When exit modal selected
					if (modalName == "EXIT") {
						hide_show_modal(false, modalName);
						$(".modal_container").removeClass("active");
						set_form_focus();
					}

				} else if ((!$("#username").is(":focus") && !$("#password").is(":focus")) || $("#loginButton").is(":focus")) {
					console.log('exit popup');
					hide_show_modal(true, "EXIT", APP_EXIT_MSG);

				}
				break;

			case 40:	//Down key
				if (!$(".modal_container").hasClass("active")) {
					if ($("#username").is(":focus") || LAST_FOCUSED == 1) {
						$("#username").blur();
						$("#password").focus();
						LAST_FOCUSED = 2;

					} else if ($("#password").is(":focus") || LAST_FOCUSED == 2) {
						$("#password").blur();
						$("#loginButton").focus();
						LAST_FOCUSED = 3;
					}
				}
				break;

			case 38:	//Up key
				if (!$(".modal_container").hasClass("active")) {
					if ($("#loginButton").is(":focus") || LAST_FOCUSED == 3) {
						$("#loginButton").blur();
						$("#password").focus();
						LAST_FOCUSED = 2;

					} else if ($("#password").is(":focus") || LAST_FOCUSED == 2) {
						$("#password").blur();
						$("#username").focus();
						LAST_FOCUSED = 1;
					}
				}
				break;
		}
	});
};

function loginFormValidation() {
	console.log("loginFormValidation");
	var userName = $("#username").val().trim();
	var password = $("#password").val().trim();
	if (userName == '' || password == '') {
		hideShowError("Please enter your credential");
		if (userName == '') SN.focus("#username");
		else if (password == '') SN.focus("#password");
	}
	else if (userName != '' && password != '') {
		if ($("#username").is(":focus")) SN.focus("#password");
		else if ($("#password").is(":focus")) setTimeout(function () { SN.focus("#loginButton"); }, 500);
	}
}

function hideShowError(text) {
	clearInterval(HIDE_SHOW_ERROR);
	if ($(".error_overlay").css("display") == "none") $(".error_overlay").text(text).css({ "display": "inline-table" });

	HIDE_SHOW_ERROR = setTimeout(function () {
		$(".error_overlay").css({ "display": "none" });
	}, 10000);
}

function set_form_focus() {
	// on username input text
	if (LAST_FOCUSED == 1) {
		$("#password, #loginButton").blur().removeClass("active");
		$("#username").focus().addClass("active");

		// on password input text
	} else if (LAST_FOCUSED == 2) {
		$("#username, #loginButton").blur().removeClass("active");
		$("#password").focus().addClass("active");

		// on login button
	} else if (LAST_FOCUSED == 3) {
		$("#username, #password").blur().removeClass("active");
		$("#loginButton").focus().addClass("active");
	}
}