$(document).keydown(function(e){
	if (e.keyCode == 38 || e.keyCode == 40) {
		//Setting description scroll manage here
		if ($(".about_desc_container").hasClass("active")) {
			// Up key
			if (e.keyCode == 38) {
				SETTING_DESC_SCROLLED = SETTING_DESC_SCROLLED - SETTING_SCROLLED_UP_DOWN_HEIGHT;

				if (SETTING_DESC_SCROLLED > -1) {
					$(".about-scroll").scrollTop(SETTING_DESC_SCROLLED);
				} else {
					SETTING_DESC_SCROLLED = 0;
				}
			// Down Key
			} else if (e.keyCode == 40) {
				SETTING_DESC_SCROLLED = SETTING_DESC_SCROLLED + SETTING_SCROLLED_UP_DOWN_HEIGHT;

				if ($(".about-scroll")[0].scrollHeight > SETTING_DESC_SCROLLED) {
					$(".about-scroll").scrollTop(SETTING_DESC_SCROLLED);
				} else {
					SETTING_DESC_SCROLLED = SETTING_DESC_SCROLLED - SETTING_SCROLLED_UP_DOWN_HEIGHT;
				}
			}
		}
	}
});