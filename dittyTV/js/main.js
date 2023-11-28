window.onload = function () {
    $(".splash-screen").show();
    $(".container_box").hide();
    $("span#modal_container").load("popup.html");
    parse_main_feed();

    document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);
    function keyboardVisibilityChange(event) {
        if (event.detail.visibility) {
            console.log("Virtual keyboard appeared");
            $("body").css("pointer-events", "none");
        } else {
            console.log("Virtual keyboard disappeared");
            $("body").removeAttr("style");
        }
    }
};