/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
//var lastClickedId = null;
var itemArray = document.getElementsByClassName("item");

function addEventListeners() {
	for (var i = 0; i < itemArray.length; i++) {
		itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
		itemArray[i].addEventListener("click", _onClickEvent);
	}
}

function _onClickEvent(e) {
	elementId = e.target.id;
	console.log(elementId + " is clicked!");

	// For menu onclick
	if (elementId.search("menu") > -1) {
		SELECTED_MENU_INDEX = $('#menuList li.item:focus').index();
		if (SELECTED_MENU_INDEX == 0) {
			set_linear_list();
		} else {
			set_setting_list();
		}

		// For grid onclick
	} else if (elementId.search("content") > -1) {
		if ($('#catList li').length > 1) {
			SELECTED_CAT_INDEX = $('#catList li.item:focus').index();
			console.log("SELECTED_CAT_INDEX", SELECTED_CAT_INDEX);
		}
		if (SELECTED_MENU_INDEX == 1) {
			set_setting_content();
			SN.focus('aboutDesc');
		} else {
			load_video();
		}

		// For retry popup onclick
	} else if (elementId.search("retryButton") > -1 || elementId.search("cancelButton") > -1) {
		hide_show_modal(false, "RETRY_CANCEL");
		if ($('#retryButton').is(":focus")) load_video();
		else if ($("#cancelButton").is(":focus")) closeVideo();

	} else if (elementId.search("exitbtn0") > -1 || elementId.search("exitbtn1") > -1) {
		if ($('#exitbtn0').is(":focus")) {
			console.log('hide popup');
			hide_show_modal(false, 'EXIT');

		} else if ($("#exitbtn1").is(":focus")) {
			console.log('exit app');
			window.close();
		}
	}

}

function _onMouseOverEvent(e) {
	for (var i = 0; i < itemArray.length; i++) {
		itemArray[i].blur();
	}
	var elementId = e.target.id;
	console.log("focus container id", e.target.id);
	if (elementId != "") {
		if (elementId.search("content") > -1) $("#" + elementId).closest('li').focus();
		else document.getElementById(elementId).focus();
	}
}