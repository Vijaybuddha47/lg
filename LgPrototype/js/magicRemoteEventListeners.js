/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var itemArray = document.getElementsByClassName("focusable");

function addEventListeners() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    console.log("Click event", e);
}


function _onMouseOverEvent(e) {
    var elementId = $(e.target).closest('li').attr("id");
    console.log("focus container id", elementId);

    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }

    if (elementId != "") {
    }
}
