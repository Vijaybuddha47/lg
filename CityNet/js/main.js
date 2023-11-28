window.onload = function () {
	window.SN = SpatialNavigation;
	SN.init();
	$("span#modal_container").load("modal.html");
	set_menu();

	document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);
	function keyboardVisibilityChange(event) {
		if (event.detail.visibility) {
			KEYBOARD = true;
			console.log("Virtual keyboard appeared");

		} else {
			set_search_text();
			KEYBOARD = false;
			console.log("Virtual keyboard disappeared");
		}
	}
};