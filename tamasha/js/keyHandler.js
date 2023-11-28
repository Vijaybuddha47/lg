var Keyhandler = {};



var homeFocus = '';
var menuFocus = '';
var AddToFavBoxHidden = false;
var openedSeriesID = '';
var numberOfRows = 7; //old value is 5
var numberOfVods = 6;
var numberOfLives = 11;
var numberOfCatchups = 7;
var numberOfShortEPGs = 5;
var numberOfVodRows = 3;
var lastVodTopIndex = 0;
var lastEpisodesTopIndex = 0;
var numberOfEpisodes = 8;
var numberOfEpisodeRows = 3;

Keyhandler.homeKeyhandler = function (e) {
	var keycode;
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var index = parseInt($('.imageFocus').attr("index"));
	
	var id = $('.imageFocus').attr("id");
	var source = $('.imageFocus').attr("source");

	var h_index = parseInt($('.imageFocus').attr("h_index"));

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
		if(source == "tiles"){
               
		} else {
               if (index > 6) {
                    h_index--;
                    $('.imageFocus').removeClass("imageFocus");
                    $("#vodMovies"+h_index).addClass("imageFocus");
               } else if (index == 6) {
                    $('.imageFocus').removeClass("imageFocus");
                    $('#moviesTile').addClass("imageFocus");
               }
          }
          
          break;
     }
	case tvKeyCode.ArrowRight: {
		if(source == "tiles"){
               $('.imageFocus').removeClass("imageFocus");
               $("#vodMovies1").addClass("imageFocus");
		} else {
               if (index < 11) {
                    h_index++;
                    $('.imageFocus').removeClass("imageFocus");
                    $("#vodMovies"+h_index).addClass("imageFocus");
               }
          }
          break;
     }
	case tvKeyCode.ArrowUp: {
			if(source == "tiles"){
                    if(id == "logoffTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#settingTile').addClass("imageFocus");
                    }
                    else if(id == "moviesTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#homeLiveTile').addClass("imageFocus");
                    }
                    else if(id == "seriesTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#moviesTile').addClass("imageFocus");
                    }
                    else if(id == "settingTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#seriesTile').addClass("imageFocus");
                    }
			}
			
			break;
		}
	case tvKeyCode.Enter: {
			Keyhandler.homeKeyEnter($('.imageFocus'));
			break;
		}
	case tvKeyCode.ArrowDown: {
			if(source == "headTiles"){
				$('.imageFocus').removeClass("imageFocus");
				$('#seriesTile').addClass("imageFocus");
               }
               else if(source == "tiles"){
                   if(id == "homeLiveTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#moviesTile').addClass("imageFocus");
                    }
                    else if(id == "moviesTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#seriesTile').addClass("imageFocus");
                    }
                    else if(id == "seriesTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#settingTile').addClass("imageFocus");
                    }
                    else if(id == "settingTile"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#logoffTile').addClass("imageFocus");
                    }
               }
			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return: {
	   if(!jQuery('#loading').is(':visible')){
              pushState(view,$(".imageFocus").attr("id"));
              $('.imageFocus').removeClass("imageFocus");
              view = "exitApp";
              $("#genericDiv").html(Util.showPopUp(2,'Do you want to exit the app?', "آیا می‌خواهید از برنامه خارج شوید؟", "Yes","No"));
              $("#genericDiv").show();
              $("#Btn-0").addClass("imageFocus");
              Main.HideLoading();
              break;
          }
			
	}
	default: {
			break;
		}
	}
}



Keyhandler.deleteKeyEnter = function(currFocus){
	var index = parseInt(currFocus.attr("index"));
	var id = currFocus.attr("id");
//	alert("deletekey");
	if(index == 0){
         var items = JSON.parse(window.localStorage.getItem('listData'));
         var profile = JSON.parse(window.localStorage.getItem('profile'));
//                    alert(JSON.stringify(profile));

            window.localStorage.removeItem('profile');

//           alert(JSON.stringify(Main));
           Main.profile ="";

//           alert(JSON.stringify(profile));

         for (var i =0; i< items.length; i++) {
             if (i == deleteBoxPosition) {
                 items.splice(i, 1);
             }
         }
         items = JSON.stringify(items);
         window.localStorage.setItem("listData", items);
         $("#mainContent").html(Util.listUserPage());
		 $("#mainContent").show();

		 hideDeleteUserPopUp();
	}else{
		hideDeleteUserPopUp();
	}
}

Keyhandler.episodeEndKeyHandler = function(e) {

     var keycode;
     if (window.event) {
          keycode = e.keyCode;
     } else if (e.which) {
          keycode = e.which;
     }
     
     var index = parseInt($('.imageFocus').attr("index"));
     
     switch (keycode) {
     case tvKeyCode.ArrowLeft: {
               if(index == 1){
                    index--;
                    $(".imageFocus").removeClass("imageFocus");
                    $("#Btn-"+index).addClass("imageFocus");
               }
               break;
          }
     case tvKeyCode.ArrowRight: {
               if(index == 0){
                    index++;
                    $(".imageFocus").removeClass("imageFocus");
                    $("#Btn-"+index).addClass("imageFocus");
               }
               break;
          }
     case tvKeyCode.ArrowUp: {
     
               break;
          }
     case tvKeyCode.Enter:{
          
          Keyhandler.episodeEndEnter($(".imageFocus"));
          break;
     }
     case 27:
     case 127:
     case 8:
     case 10009:
     case tvKeyCode.Return:{
                   $("#genericDiv").hide();
                   $("#genericDiv").html('');

                   try {
                         var obj = popState();
                         view = obj.view;
                         previousFocus = obj.focus;
                   } catch (e) {}

                   Main.processNext();

                   $("#HTML5Div").hide();
                   $("HTML5Div").html('');

                   break;
          }
     case tvKeyCode.ArrowDown: {
     
               break;
          }
     
     default: {
               break;
          }
     }

};

Keyhandler.episodeEndEnter = function(currFocus) {
     var index = parseInt(currFocus.attr("index"));
	if(index == 0){
          $("#genericDiv").hide();
          $("#genericDiv").html('');

          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
          } catch (e) {}

          var count = parseInt($('.imageFocus').attr("count"));

          var v_index = parseInt(previousFocus.attr("v_index"));
          var h_index = parseInt(previousFocus.attr("h_index"));
          var currFocus;
          if(h_index < numberOfEpisodes-1){
               h_index++;
               currFocus = $('#serMovies-'+v_index+"-"+h_index);
               Keyhandler.episodeKeyEnter(currFocus);
               return;
          } else {
               h_index = 0;
               if (v_index < (count/numberOfEpisodes)-1) {
                    var removed = false;
                    if (v_index == lastVodTopIndex + numberOfEpisodeRows - 1 ) {
                         $("#serRow-"+(lastVodTopIndex)).remove();
                         lastVodTopIndex++;
                         removed = true;
                    }
                    v_index ++;
                    if (removed) {
                         $("#episodesList").append(Util.addEpisodesRow((lastVodTopIndex+numberOfEpisodeRows-1)));
                         $("#serRow-"+(lastVodTopIndex+numberOfEpisodeRows-1)).show();
                    }
     
                    previousFocus.removeClass("imageFocus");
     
                    if((v_index * numberOfEpisodes)+h_index < count-1 ) {
                         $('#serMovies-'+v_index+"-"+h_index).addClass("imageFocus");
                         currFocus = $('#serMovies-'+v_index+"-"+h_index);
                    } else {
                         $('#serMovies-'+v_index+"-"+ ( (count-1) % numberOfEpisodes)).addClass("imageFocus");
                         currFocus = $('#serMovies-'+v_index+"-"+( (count-1) % numberOfEpisodes));
                    }
                    Keyhandler.episodeKeyEnter(currFocus);
                    return;
               }
          }

          $('#HTML5Div').hide();
          previousFocus.addClass("imageFocus");
          $("#episodesDiv").show();
     } else {
          $("#genericDiv").hide();
          $("#genericDiv").html('');

          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
          } catch (e) {}

          $('#HTML5Div').hide();
          previousFocus.addClass("imageFocus");
          $("#episodesDiv").show();
     }
};

Keyhandler.exitKeyEnter = function(currFocus){
	var index = parseInt(currFocus.attr("index"));
	var id = currFocus.attr("id");
//	alert(view);
	if(index == 0){
		if(view == "exitApp"){
               //toast.application.exit();
               if (isTizen) {
                    tizen.application.getCurrentApplication().exit();
               } else {
                    window.close();
               }
		}else if(view == "acceptTerms"){
			if(Player.playData.play_location){
				view = "continue";
				$("#customMessage").html(Util.showPopUp(2,'', "", "RESUME","START OVER"));
				$("#customMessage").show();
				$(".popup-p").css("padding","0px");
				$(".popup-Message-container").addClass("resume");
				$("#Btn-0").addClass("imageFocus");
			}
			else{
				Main.hitBeaconTest(Player.playData.play_location_id,Player.playData.play_location);
			}
			
		} else if(view == "continue"){
			Main.hitBeaconTest(Player.playData.play_location_id,Player.playData.play_location);
		} else {
				$("#genericDiv").hide();
				$("#genericDiv").html('');
				try {
					var obj = popState();
					if(obj.focus.indexOf("leftMenu") == -1)
                              view = obj.view;
                         else
                              view = "leftMenu";
					$("#"+obj.focus).addClass("imageFocus");
				} catch (e) {}
	
				if (callBack) {
					callBack();
					callBack = '';
				}
		 }
	} else{
		if(view == "continue"){
			Player.playData.play_location = 0;
			Main.hitBeaconTest(Player.playData.play_location_id,0);
		} else if(view == "acceptTerms"){
			$("#customMessage").hide();
			$("#customMessage").html('');
			$("#SingleMoviePage").show();
			try {
				var obj = popState();
				view = obj.view;
				$("#"+obj.focus).addClass("imageFocus");
			} catch (e) {}

			if (callBack) {
				callBack();
				callBack = '';
			}
		} else{
			$("#genericDiv").hide();
			$("#genericDiv").html('');
			try {
				var obj = popState();
			     view = obj.view;
                    
				$("#"+obj.focus).addClass("imageFocus");
			} catch (e) {}

			if (callBack) {
				callBack();
				callBack = '';
			}
		}
	}
}
Keyhandler.exitKeyhandler = function(e){

     var keycode;
     var userAgent = new String(navigator.userAgent);
     if (window.event) {
          keycode = e.keyCode;
     } else if (e.which) {
          keycode = e.which;
     }
     
     var index = parseInt($('.imageFocus').attr("index"));
     var id = $('.imageFocus').attr("id");
     
     
     
     switch (keycode) {
     case tvKeyCode.ArrowLeft: {
               if(index == 1){
                    index--;
                    $(".imageFocus").removeClass("imageFocus");
                    $("#Btn-"+index).addClass("imageFocus");
               }
               break;
          }
     case tvKeyCode.ArrowRight: {
               if(index == 0){
                    index++;
                    $(".imageFocus").removeClass("imageFocus");
                    $("#Btn-"+index).addClass("imageFocus");
               }
               break;
          }
     case tvKeyCode.ArrowUp: {
     
               break;
          }
     case tvKeyCode.Enter:{
          
          Keyhandler.exitKeyEnter($(".imageFocus"));
          break;
     }
     case 27:
     case 127:
     case 8:
     case 10009:
     case tvKeyCode.Return:{
            if(!jQuery('#loading').is(':visible')){
                   $("#genericDiv").hide();
                   $("#genericDiv").html('');

                   try {
                        var obj = popState();
                        if(obj.focus.indexOf("leftMenu") == -1)
                             view = obj.view;
                        else
                             view = "leftMenu";


                        $("#"+obj.focus).addClass("imageFocus");
                   } catch (e) {}

                   if (callBack) {
                        callBack();
                        callBack = '';
                   }

                   break;
             }
          }
     case tvKeyCode.ArrowDown: {
     
               break;
          }
     
     default: {
               break;
          }
     }
     
};


     Keyhandler.deleteUserKeyhandler = function(e){

          var keycode;
          var userAgent = new String(navigator.userAgent);
          if (window.event) {
               keycode = e.keyCode;
          } else if (e.which) {
               keycode = e.which;
          }

          var index = parseInt($('.imageFocus').attr("index"));
          var id = $('.imageFocus').attr("id");



          switch (keycode) {
          case tvKeyCode.ArrowLeft: {
                    if(index == 1){
                         index--;
                         $(".imageFocus").removeClass("imageFocus");
                         $("#Btn-"+index).addClass("imageFocus");
                    }
                    break;
               }
          case tvKeyCode.ArrowRight: {
                    if(index == 0){
                         index++;
                         $(".imageFocus").removeClass("imageFocus");
                         $("#Btn-"+index).addClass("imageFocus");
                    }
                    break;
               }
          case tvKeyCode.ArrowUp: {

                    break;
               }
          case tvKeyCode.Enter:{
               Keyhandler.deleteKeyEnter($(".imageFocus"));
               break;
          }
          case 27:
          case 127:
          case 8:
          case 10009:
          case tvKeyCode.Return:{
                    if(!jQuery('#loading').is(':visible')){
                        $("#genericDiv").hide();
                        $("#genericDiv").html('');

                        try {
                             var obj = popState();
                             if(obj.focus.indexOf("leftMenu") == -1)
                                  view = obj.view;
                             else
                                  view = "leftMenu";


                             $("#"+obj.focus).addClass("imageFocus");
                        } catch (e) {}

                        if (callBack) {
                             callBack();
                             callBack = '';
                        }

                        break;
                    }
               }
          case tvKeyCode.ArrowDown: {

                    break;
               }

          default: {
                    break;
               }
          }

          }


Keyhandler.settingsKeyhandler =  function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}

	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
               if(id == "accountLogout"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#accountBack').addClass("imageFocus");
               }
               else if(id == "playerControl"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#accountInfo').addClass("imageFocus");
               }
               /*
               else if(id == "screenControl"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#playerControl').addClass("imageFocus");
               }
               */
			break;
		}
	case tvKeyCode.ArrowRight: {
               if(id == "accountBack"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#accountLogout').addClass("imageFocus");
               }
               else if(id == "accountInfo"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#playerControl').addClass("imageFocus");
               }/*
               else if(id == "playerControl"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#screenControl').addClass("imageFocus");
               }
               */
			break;
		}
	case tvKeyCode.ArrowUp: {

			break;
		}
     case 27:
     case 127:
	case 8:
     case 10009:
	case tvKeyCode.Return:{
	   if(!jQuery('#loading').is(':visible')){
              try {
                   var obj = popState();
                   view = obj.view;
                   previousFocus = obj.focus;
                   //previousFocus = '';
              } catch (e) {}

              Main.processNext();
              $("#profile").html('').hide();
              break;
       }
     }
	case tvKeyCode.Enter: {
          Keyhandler.settingsKeyEnter($('.imageFocus'));
               

			break;
		}
	case tvKeyCode.ArrowDown: {

			break;
		}

	default: {
			break;
		}
	}
};

Keyhandler.accountKeyhandler =  function (e) {
	var keycode;
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}

	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
			break;
		}
	case tvKeyCode.ArrowRight: {
			break;
		}
	case tvKeyCode.ArrowUp: {

			break;
		}
     case 27:
     case 127:
	case 8:
     case 10009:
	case tvKeyCode.Return:{
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
               //previousFocus = '';
          } catch (e) {}

          Main.processNext();
          $("#account").html('').hide();
          break;
     }
	case tvKeyCode.Enter: {
               Keyhandler.accountKeyEnter($('.imageFocus'));
			break;
		}
	case tvKeyCode.ArrowDown: {

			break;
		}

	default: {
			break;
		}
	}
};

var selectSetting = '';
Keyhandler.settingsKeyEnter = function(currFocus){
     var id = currFocus.attr("id");
     if(id == "accountInfo"){
          selectSetting = "account";
          pushState(view,$(".imageFocus").attr("id"));
		$('.imageFocus').removeClass("imageFocus");
          view = "account";
          Main.processNext();
     } else if (id == "playerControl") {
          selectSetting = "playerControl";
          pushState(view,$(".imageFocus").attr("id"));
		$('.imageFocus').removeClass("imageFocus");
          view = "settingSection";
          Main.processNext();
     } else if (id == "screenControl") {
          selectSetting = "screenControl";
          pushState(view,$(".imageFocus").attr("id"));
		$('.imageFocus').removeClass("imageFocus");
          view = "settingSection";
          Main.processNext();
     }
};

Keyhandler.accountKeyEnter = function(currFocus){
     var id = currFocus.attr("id");
     if(id == "accountBack"){

          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
               //previousFocus = '';
          } catch (e) {}
          
          Main.processNext();
          $("#account").html('').hide();
     }
     else if(id == "accountLogout"){
          Main.profile = '';
          window.localStorage.removeItem("profile");
          location.reload();
     }
};

Keyhandler.settingSectionKeyhandler =  function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
     if(selectSetting == "playerControl" || selectSetting == "screenControl")
          e.preventDefault();
	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
     
     var source = $('.imageFocus').attr("source");
     
    

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
//	alert("Aa");
               if(source == "settingBtn"){
                    if(id == "accountClose"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#accountSave').addClass("imageFocus");
                    }
               }
               if(source == "parentalBtn"){
                   if(id == "accountClose"){
                   $('.imageFocus').removeClass("imageFocus");
                     if(parentPin!=''){
                       $('#turnOffPin').addClass("imageFocus");
                     }else{
                       $('#addNewPin').addClass("imageFocus");
                     }
                   }

                   if(id == "turnOffPin"){
                      $('.imageFocus').removeClass("imageFocus");
                      $('#addNewPin').addClass("imageFocus");
                   }
               }
			break;
		}
	case tvKeyCode.ArrowRight: {
               if(source == "settingBtn"){
                if(id == "accountSave"){
                    $('.imageFocus').removeClass("imageFocus");
                    $('#accountClose').addClass("imageFocus");
                }
               }
               if(source == "parentalBtn"){
                   if(id == "addNewPin"){
                       $('.imageFocus').removeClass("imageFocus");
                       if(parentPin!=''){
                          $('#turnOffPin').addClass("imageFocus");
                       }else{
                          $('#accountClose').addClass("imageFocus");
                       }
                   }else if(id == "turnOffPin"){
                       $('.imageFocus').removeClass("imageFocus");
                       $('#accountClose').addClass("imageFocus");
                   }
                }
			break;
		}
	case tvKeyCode.ArrowUp: {
               if(selectSetting == "playerControl"){
                   
                    if(source == "settingBtn"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#containerBtn-1').addClass("imageFocus");
                    }
                   else if(source == "inputButtons"){
                         if(index == 1){
                              $('.imageFocus').removeClass("imageFocus");
                              $('#containerBtn-0').addClass("imageFocus");
                         }
                   }
               }
               else if(selectSetting == "screenControl"){
                    console.log("source=" + source + " index=" + index);
                    if(source == "settingBtn"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#containerBtn-1').addClass("imageFocus");
                    }
                   else if(source == "inputButtons"){
                         if(index == 1) {
                              $('.imageFocus').removeClass("imageFocus");
                              $('#containerBtn-0').addClass("imageFocus");
                         }
                   }
               }
               else if(selectSetting == "accountInfo"){
                    if(source == "settingBtn"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#cpin').addClass("imageFocus");
                         $('#'+id).blur();

                    }
                    else if(source == "pinSetting"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#pin').addClass("imageFocus");
                         $('#'+id).blur();
                    }
               }
			break;
		}
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	    if(!jQuery('#loading').is(':visible')){
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
          } catch (e) {}

          Main.processNext();
          break;
        }
     }
	case tvKeyCode.Enter: {

			
               Keyhandler.settingSectionKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
               if(selectSetting == "playerControl"){
                    if(source == "inputButtons"){
                         if(index == 0){
                              $('.imageFocus').removeClass("imageFocus");
                              $('#containerBtn-1').addClass("imageFocus");
                         }
                         else if(index == 1){
                              $('.imageFocus').removeClass("imageFocus");
                              $('#accountSave').addClass("imageFocus");
                         }
                   }
                   
               }
               else if(selectSetting == "screenControl"){
                    console.log("source=" + source + " index=" + index);
                    if(source == "inputButtons"){
                         if(index == 0){
                              $('.imageFocus').removeClass("imageFocus");
                              $('#containerBtn-1').addClass("imageFocus");
                         }
                         else if(index == 1){
                              $('.imageFocus').removeClass("imageFocus");
                              $('#accountSave').addClass("imageFocus");
                         }
                   }
                   
               }
               else if(selectSetting == "accountInfo"){
                    if(source == "pinSetting"){
                         if(id == "pin"){
                              $('.imageFocus').removeClass("imageFocus");
                              $('#cpin').addClass("imageFocus");
                              $('#'+id).blur();
                         }
                         else {
                              $('.imageFocus').removeClass("imageFocus");
                              $('#accountSave').addClass("imageFocus");
                              $('#'+id).blur();
                         }
                         
                    }
               }
			break;
		}

	default: {
			break;
		}
	}
}

Keyhandler.parentalPinSettingsKeyhandler =  function (e) {
}

Keyhandler.parentalPinTurnOffKeyhandler =  function (e) {
}

Keyhandler.catchupPlayerKeyHandler =  function (e) {
	var keycode;
    	var userAgent = new String(navigator.userAgent);
    	if (window.event) {
    		keycode = e.keyCode;
    	} else if (e.which) {
    		keycode = e.which;
    	}
         if(selectSetting == "playerControl" || selectSetting == "screenControl")
              e.preventDefault();
    	var index = parseInt($('.imageFocus').attr("index"));
    	var id = $('.imageFocus').attr("id");

         var source = $('.imageFocus').attr("source");


    	switch (keycode) {
     case tvKeyCode.MediaPause:
          Player.pause();
          showMovieInfo();
          break;
     case tvKeyCode.MediaPlay:
          Player.resume();
          showMovieInfo();
          break;
     case tvKeyCode.MediaStop:
          Player.stop();
          showMovieInfo();
          break;
    	case tvKeyCode.ArrowLeft: {
          Player.rwnd();
          showCatchupInfo();

    			break;
    		}
    	case tvKeyCode.ArrowRight: {

          Player.ffwd();
          showCatchupInfo();
    			break;
    		}
    	case tvKeyCode.ArrowUp: {
               showCatchupInfo();
    			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
    	case tvKeyCode.Return:{
    	   if(!jQuery('#loading').is(':visible')){
              try {
                   var obj = popState();
                   view = obj.view;
                   previousFocus = obj.focus;
              } catch (e) {}

              Main.processNext();
// 	         console.log("backpressed");
               Player.close();

// 	          backPressed = true;
//              if(!playerReleased && playerPrepared){
//                  console.log("backpress released");
                  $("#HTML5Div").html('').hide();
                  $("#catchupPrograms").show();
//              }else{
//                  $("#HTML5Div").hide();
//              }
              break;
           }
         }
    	case tvKeyCode.Enter: {
//    	        if(flowPlayerH!=null && flowPlayerH!== undefined){
//    	             flowPlayerH.fullscreen();
//    	        }
               //fullScreenPlayer();
               showCatchupInfo();
    			break;
          }
     case tvKeyCode.MediaFastForward:
          Player.ffwd();
          showCatchupInfo();
          break;
     case tvKeyCode.MediaRewind:
          Player.rwnd();
          showCatchupInfo();
          break;
    	case tvKeyCode.ArrowDown: {
          showCatchupInfo();

    		break;
          }
     case tvKeyCode.ColorF3Blue:
          Player.switchDisplayMethod();
          break;

    	default: {
    			break;
    		}
    	}
}


Keyhandler.seriesPlayerKeyHandler =  function (e) {
	var keycode;
    	var userAgent = new String(navigator.userAgent);
    	if (window.event) {
    		keycode = e.keyCode;
    	} else if (e.which) {
    		keycode = e.which;
    	}
         if(selectSetting == "playerControl" || selectSetting == "screenControl")
              e.preventDefault();
    	var index = parseInt($('.imageFocus').attr("index"));
    	var id = $('.imageFocus').attr("id");

         var source = $('.imageFocus').attr("source");



    	switch (keycode) {
     case tvKeyCode.MediaPause:
          Player.pause();
          showMovieInfo();
          break;
     case tvKeyCode.MediaPlay:
          Player.resume();
          showMovieInfo();
          break;
     case tvKeyCode.MediaPlayPause:
          Player.onMediaPlayPause();
          showMovieInfo();
          break;
     case tvKeyCode.MediaStop:
          Player.stop();
          showMovieInfo();
          break;
    	case tvKeyCode.ArrowLeft: {
               Player.rwnd();
               showMovieInfo();
    			break;
    		}
    	case tvKeyCode.ArrowRight: {
               Player.ffwd();
               showMovieInfo();
    			break;
    		}
    	case tvKeyCode.ArrowUp: {
          showMovieInfo();
    			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
    	case tvKeyCode.Return:{
    	   if(!jQuery('#loading').is(':visible')){
              try {
                   var obj = popState();
                   view = obj.view;
                   previousFocus = obj.focus;
               } catch (e) {}

               Main.processNext();
               //console.log("backpressed");
               Player.close();

 	          backPressed = true;
              if(!playerReleased && playerPrepared){
                  //console.log("backpress released");
                  $("#HTML5Div").html('').hide();
              }else{
                  $("#HTML5Div").hide();
              }
              break;
           }
         }
    	case tvKeyCode.Enter: {
    	        //if(flowPlayerH!=null && flowPlayerH!== undefined){
    	        //     flowPlayerH.fullscreen();
    	        //}
             //fullScreenPlayer();
               Player.onMediaPlayPause();
               showMovieInfo();
    			break;
          }
     case tvKeyCode.MediaFastForward:
          Player.ffwd();
          showMovieInfo();
          break;
     case tvKeyCode.MediaRewind:
          Player.rwnd();
          showMovieInfo();
          break;
    	case tvKeyCode.ArrowDown: {
          showMovieInfo();

    			break;
    		}
     case tvKeyCode.ColorF3Blue:
          Player.switchDisplayMethod();
          break;
    	default: {
    			break;
    		}
    	}
}

function validateForm() {
  var isValid = true;
  $('.form-control').each(function() {
    if ( $(this).val() === '' )
        isValid = false;
  });
  return isValid;
}

function savePin(){
if($("#pin").val() && $("#pin").val() == $("#cpin").val()){
                         parentPin = $("#pin").val();
                         window.localStorage.setItem("parentPin",parentPin);
//                         alert(parentPin);
                         try {
                              var obj = popState();
                              view = obj.view;
                              previousFocus = obj.focus;
                         } catch (e) {}

                         Main.processNext();

                         $("#addNewPin").html("Update Pin");
                         $("#turnOffPin").css("visibility",'visible');
                    }
                    else{
                         Main.showFailure("Please provide valid Pin.");
                    }
}


//var containerSelected = '.ts';
Keyhandler.settingSectionKeyEnter = function(currFocus){

     var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
     
     var source = $('.imageFocus').attr("source");

//     alert(source);
//     alert(id);

     if(source == "inputButtons"){
          //if(index == 1){
               $("#"+id).find("input").prop("checked",true);
               containerSelected = $("#"+id).text().trim();
        //  }
     }
     else if(source =="sourceAddPinField" || source =="sourceUpdatePinField" || source =="sourceParentControlTurnOffField"){
          $("#"+id).focus();
     }
     else if(source == "settingBtn" || source == "parentalBtn" || source =="sourceAddPin" || source =="sourceUpdatePin" || source =="sourceParentControlTurnOff"){
          if(id == "accountSave"){

               if($("#pin").length){
                    savePin();

               }
               else{
                     var radioValue = $("input[name='radio']:checked").val();

                     if (radioValue === 'main' || radioValue === 'backup') {
                         window.localStorage.setItem("portal",radioValue);
                         if (radioValue === 'main') {
                              var reload = false;
                              if (Main.backupServerSelected)
                                   reload = true;
                              Main.backupServerSelected = false;
                              Main.serverURL = Main.primaryServerURL;
                              if (reload) {
                                   Main.profile = '';
                                   allChannels = {};
                                   allLiveCats = [];
                                   window.localStorage.removeItem("profile");
                                   location.reload();
                                   return;
                              }
                         } else if (radioValue === 'backup') {
                              var reload = false;
                              if (Main.backupServerSelected)
                                   reload = true;
                              Main.backupServerSelected = true;
                              Main.serverURL = Main.backupServerURL;
                              if (reload) {
                                   Main.profile = '';
                                   allChannels = {};
                                   allLiveCats = [];
                                   window.localStorage.removeItem("profile");
                                   location.reload();
                                   return;
                              }
                         }
                     } else {
                         selectedContainer = radioValue;
                         window.localStorage.setItem("selectedContainer",selectedContainer);
                     }
                    try {
                         var obj = popState();
                         view = obj.view;
                         previousFocus = obj.focus;
                    } catch (e) {}
     
                    Main.processNext();
               }

               
          }else if(id=="pinUpdate"){
                 if(validateForm()){
                     if($("#opin").val() == parentPin){
                        savePin();

                     }else{
                           Main.showFailure("Invalid Old Pin!");
                     }

                 }else{
                      Main.showFailure("All the fields are required!");
                 }
          }else if(id == "addNewPin"){
            pushState(view,$(".imageFocus").attr("id"));
			$('.imageFocus').removeClass("imageFocus");
			view = "parentalPinSettings";
			Main.processNext();


          }else if(id == "turnOffPin"){
             if(parentPin){
                pushState(view,$(".imageFocus").attr("id"));
                $('.imageFocus').removeClass("imageFocus");
                view = "parentalTurnOff";
                Main.processNext();
             }else{
                 Main.showFailure("Please add any pin first.");
             }

          }else if(id == "turnOffPinSave"){
            if(validateForm()){
                 if($("#opin").val() == parentPin){
                    parentPin ='';
                    window.localStorage.setItem("parentPin",parentPin);
                    try {
                        var obj = popState();
                            view = obj.view;
                            previousFocus = obj.focus;
                       } catch (e) {}

                       Main.processNext();
                       $("#addNewPin").html("Add New Pin");
                       $("#turnOffPin").css("visibility",'hidden');
                       $("#addNewPin").addClass("imageFocus");

                 }else{
                       Main.showFailure("Invalid Old Pin!");
                 }

             }else{
                  Main.showFailure("Please enter your old parental pin!");
             }

         }else {
               try {
				var obj = popState();
                    view = obj.view;
                    previousFocus = obj.focus;
               } catch (e) {}

               Main.processNext();
          }
     }
}
Keyhandler.enterPinKeyHandler = function(e){
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
     $(".error").html('');
	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			break;
		}
	case tvKeyCode.ArrowRight: {

			break;
		}
	case tvKeyCode.ArrowUp: {
               if(id == "confirmPin"){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").addClass('imageFocus');
               }
			break;
		}
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	    if(!jQuery('#loading').is(':visible')){
          $("#customMessage").hide();
			$("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');

			} catch (e) {}

			if (callBack) {
				callBack();
				callBack = '';
          }
          
          break;
        }
     }
	case tvKeyCode.Enter: {
               Keyhandler.enterPinKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
               if(id == "pin"){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").blur();
                    $("#confirmPin").addClass('imageFocus');
               }
			break;
		}

	default: {
			break;
		}
	}
}

Keyhandler.enterPinMoviesCategoriesKeyHandler = function(e){
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
     $(".error").html('');
	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			break;
		}
	case tvKeyCode.ArrowRight: {

			break;
		}
	case tvKeyCode.ArrowUp: {

               if(id == "confirmPin"){

                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").addClass('imageFocus');
               }
			break;
		}
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	    if(!jQuery('#loading').is(':visible')){
          $("#customMessage").hide();
			$("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');

			} catch (e) {}

			if (callBack) {
				callBack();
				callBack = '';
          }

          break;
        }
     }
	case tvKeyCode.Enter: {
               Keyhandler.enterPinMoviesCategoriesKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
               if(id == "pin"){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").blur();
                    $("#confirmPin").addClass('imageFocus');
               }
			break;
		}

	default: {
			break;
		}
	}
}
Keyhandler.enterPinMoviesKeyHandler = function(e){
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
     $(".error").html('');
	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			break;
		}
	case tvKeyCode.ArrowRight: {

			break;
		}
	case tvKeyCode.ArrowUp: {

               if(id == "confirmPin"){

                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").addClass('imageFocus');
               }
			break;
		}
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	    if(!jQuery('#loading').is(':visible')){
          $("#customMessage").hide();
			$("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');

			} catch (e) {}

			if (callBack) {
				callBack();
				callBack = '';
          }

          break;
        }
     }
	case tvKeyCode.Enter: {
               Keyhandler.enterPinMoviesKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
               if(id == "pin"){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").blur();
                    $("#confirmPin").addClass('imageFocus');
               }
			break;
		}

	default: {
			break;
		}
	}
}

Keyhandler.enterPinSeriesKeyHandler = function(e){
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
     $(".error").html('');
	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");
	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			break;
		}
	case tvKeyCode.ArrowRight: {

			break;
		}
	case tvKeyCode.ArrowUp: {

               if(id == "confirmPin"){

                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").addClass('imageFocus');
               }
			break;
		}
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	    if(!jQuery('#loading').is(':visible')){
          $("#customMessage").hide();
			$("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');

			} catch (e) {}

			if (callBack) {
				callBack();
				callBack = '';
          }

          break;
        }
     }
	case tvKeyCode.Enter: {
               Keyhandler.enterPinSeriesKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
               if(id == "pin"){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#pin").blur();
                    $("#confirmPin").addClass('imageFocus');
               }
			break;
		}

	default: {
			break;
		}
	}
}

Keyhandler.enterPinSeriesKeyEnter = function(currFocus){
  var id = currFocus.attr("id");
     if(id == "pin"){
          $("#"+id).focus();
     }else{

          if($("#pin").val() == parentPin){
               pinEntered = true;

               $("#customMessage").hide();
			   $("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');
			} catch (e) {}

	        Main.ShowLoading();
//            alert(openedMovieID);
             $.ajax({
                 url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_series_info"+"&series_id="+openedSeriesID,
                 type : "GET",
                 data : {},
                 success : function (data) {
                        if(typeof data == "string"){
                            data = JSON.parse(data);
                         }
                        Main.HideLoading();
                        hideValues();
                     seriesPage = data;
                     if(view != "tvshowDetails")
                          pushState(view,$(".imageFocus").attr("id"));
                        $(".imageFocus").removeClass("imageFocus");

                     view = "tvshowDetails";
                     Main.processNext();

                 },
                 error : function (errObj) {
                 },
                 timeout : 80000
             });



          } else{
               $(".error").html("Invalid Pin.");
          }
     }
}



Keyhandler.enterPinMoviesCategoriesKeyEnter = function(currFocus){
  var id = currFocus.attr("id");
     if(id == "pin"){
          $("#"+id).focus();
     }else{

          if($("#pin").val() == parentPin){
               pinEntered = true;

               $("#customMessage").hide();
			   $("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');
			} catch (e) {}

	        Main.ShowLoading();

//	        alert(openedMovieCatID);

//	         if(action == "get_vod_streams"){
                       Main.getVodDetails(openedSectionAction,openedMovieCatID);
//             }


//             $.ajax({
//                         url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_vod_info&vod_id="+openedMovieID,
//                         type : "GET",
//                         data : {},
//                         success : function (data) {
//                            if(typeof data == "string"){
//                                data = JSON.parse(data);
//                             }
//                                Main.HideLoading();
//                                hideValues();
//                             singleMovie = data;
//                             if(view != "singleMovie")
//                                  pushState(view,$(".imageFocus").attr("id"));
//                             $(".imageFocus").removeClass("imageFocus");
//                             view = "singleMovie";
//                             Main.processNext();
//                         },
//                         error : function (errObj) {
//                         },
//                         timeout : 80000
//                     });



          } else{
               $(".error").html("Invalid Pin.");
          }
     }
}

Keyhandler.enterPinMoviesKeyEnter = function(currFocus){
  var id = currFocus.attr("id");
     if(id == "pin"){
          $("#"+id).focus();
     }else{

          if($("#pin").val() == parentPin){
               pinEntered = true;

               $("#customMessage").hide();
			   $("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');
			} catch (e) {}

	        Main.ShowLoading();
//            alert(openedMovieID);
             $.ajax({
                         url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_vod_info&vod_id="+openedMovieID,
                         type : "GET",
                         data : {},
                         success : function (data) {
                            if(typeof data == "string"){
                                data = JSON.parse(data);
                             }
                                Main.HideLoading();
                                hideValues();
                             singleMovie = data;
                             if(view != "singleMovie")
                                  pushState(view,$(".imageFocus").attr("id"));
                             $(".imageFocus").removeClass("imageFocus");
                             view = "singleMovie";
                             Main.processNext();
                         },
                         error : function (errObj) {
                         },
                         timeout : 80000
                     });



          } else{
               $(".error").html("Invalid Pin.");
          }
     }
}

Keyhandler.enterPinKeyEnter = function(currFocus){
     var id = currFocus.attr("id");
     if(id == "pin"){
          $("#"+id).focus();
     }
     else{

          if($("#pin").val() == parentPin){
               pinEntered = true;
               
               $("#customMessage").hide();
			$("#customMessage").html('');
			try {
				var obj = popState();
                    view = obj.view;
                    $("#"+obj.focus).addClass('imageFocus');
			} catch (e) {}



			$(".playerReconnecting").html('').hide();
                 $("#notification").html('').hide();



//                     var LiveVideoLink = "http://google.com/";

                     var FailCounter = "";

                      if(reconnectInt !== null || reconnectInt !== undefined){
                        clearInterval(reconnectInt);
                      }

               /*
                 var player = jwplayer('player-wrapper');
                     // Set up the player with an HLS stream that includes timed metadata
                     player.setup({
                       "file": LiveVideoLink,
                       "width":"100%",
                       "aspectratio": "16:9"
                     });

                 player.on('play',function(){
                        counter = 0;
                        clearInterval(reconnectInt);
                      })

                      player.on('error', function() {
                      var showText = 1;
                                    var PlayerDIvSelector = $('#player-wrapper');
                                   $('#videoHtml').css('background', 'black');

                                    PlayerDIvSelector.html('');
            //                        PlayerDIvSelector.attr('class', '');
                                    PlayerDIvSelector.css('text-align', 'center');
                                    PlayerDIvSelector.css('background', 'none');
                                    PlayerDIvSelector.html('<div class="erroronplayer"><span>Playback error, reconnects in 5s ('+showText+'/5)</span></div>');

                                  jWPlayerReconnect(LiveVideoLink,FailCounter);
                                  return false;


                          });

               */

          }
          else{
               $(".error").html("Invalid Pin.");
          }
     }
}
Keyhandler.descKeyhandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}

	var index = parseInt($('.imageFocus').attr("index"));
	var id = $('.imageFocus').attr("id");

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			break;
		}
	case tvKeyCode.ArrowRight: {

			break;
		}
	case tvKeyCode.ArrowUp: {
               if(view == "terms"){
                    if($(".descData").css("margin-top").replace("px","") < 0){
                         $(".descData").css("margin-top",function(i, v) {
                              return (parseFloat(v) + 10) + 'px';
                         });
                    }
               }
			break;
		}
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	   if(!jQuery('#loading').is(':visible')){
          if(view == "terms"){
               pushState(view,$(".imageFocus").attr("id"));
               $('.imageFocus').removeClass("imageFocus");
               view = "exitApp";
               $("#genericDiv").html(Util.showPopUp(2,'Do you want to exit the app?', "آیا می‌خواهید از برنامه خارج شوید؟", "Yes","No"));
               $("#genericDiv").show();
               $("#Btn-0").addClass("imageFocus");
               Main.HideLoading();
          }
          else{
               $("#customMessage").hide();
               $("#customMessage").html('');
               try {
                    var obj = popState();
                    view = obj.view;
               } catch (e) {}

               if (callBack) {
                    callBack();
                    callBack = '';
               }
          }
          break;
       }
     }
	case tvKeyCode.Enter: {
               Keyhandler.descKeyEnter();
			break;
		}
	case tvKeyCode.ArrowDown: {
               if(view == "terms"){
                    if($(".descData").css("margin-top").replace("px","") > -4497){
                         $(".descData").css("margin-top",function(i, v) {
                              return (parseFloat(v) - 10) + 'px';
                         });
                    }
               }
			break;
		}

	default: {
			break;
		}
	}
}
Keyhandler.descKeyEnter = function(currFocus){
     if(view == "terms"){
          $("#customMessage").hide();
          $("#customMessage").html('');
          window.localStorage.setItem("terms",true);
          Main.HideLoading();
          Main.hideSplash();
          window.localStorage.removeItem('profile');
          view = "signIn";
          Main.processNext();
     }
     else{
          $("#customMessage").hide();
          $("#customMessage").html('');
          try {
               var obj = popState();
               view = obj.view;
          } catch (e) {}

          if (callBack) {
               callBack();
               callBack = '';
          }
     }
}
Keyhandler.sectionKeyHandler = function (e) {
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}

	var index = parseInt($('.imageFocus').attr("index"));
     var source = $('.imageFocus').attr("source");
	//var count = parseInt($('.imageFocus').attr("count"));

	//var rowIndex = parseInt($('.imageFocus').attr("rowIndex"));
	//var rowCount = parseInt($('.imageFocus').attr("rowCount"));

	
	var id = $('.imageFocus').attr("id");

     switch (keycode) {
     case tvKeyCode.ArrowLeft: 
          {

               /*
               if(rowIndex > 0){
                    $("#sectionIndex-"+(rowIndex+1)).hide();
                    rowIndex--;
                    $("#sectionIndex-"+rowIndex).show();
               }

               var sectionIndex = rowIndex * numberOfRows + (index );

               $('.imageFocus').removeClass("imageFocus");
               $("#sections-"+sectionIndex).addClass('imageFocus');
               */
               
               break;
          }
     case tvKeyCode.ArrowRight: 
          {
               /*
               if(rowIndex < rowCount){

                    $("#sectionIndex-"+(rowIndex-1)).hide();
                    rowIndex++;
                    $("#sectionIndex-"+rowIndex).show();

               }
               
               var sectionIndex = rowIndex * numberOfRows + (index);
               if(sectionIndex < sectionData.length){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#sections-"+sectionIndex).addClass('imageFocus');
               }
               */
               var catType = $("#curCatType").val();
               if (catType == "live") {
                    pushState(view, $('.imageFocus').attr("id"));
                    $('.imageFocus').removeClass("imageFocus");
                    var children = $("#liveDetails").children()[0];
                    children.className += " imageFocus";
                    view = "liveChannels";
               } else {
                    pushState(view, $('.imageFocus').attr("id"));
                    $('.imageFocus').removeClass("imageFocus");
                    var children = $("#moviesList").find(".shows-image")[0];
                    children.className += " imageFocus";
                    view = catType == "vod" ? "vodMovies" : "tvShows";
               }
               break;
          }
     case tvKeyCode.ArrowUp: 
          {
               if (source == "cat" && index > 0) {
                    $('.imageFocus').removeClass("imageFocus");
                    if(--index < Util.lastCatMax - Util.catMax){
                         Util.lastCatMax--;
                         $("#cat"+Util.lastCatMax).hide();
                         $("#cat"+index).show();
                    }
                    $("#cat"+index).addClass('imageFocus');
               } else {

               }
               
               break;
          }
     case tvKeyCode.ArrowDown: 
          {
               if (source == "cat" && index < Util.totalCats) {
                    $('.imageFocus').removeClass("imageFocus");
                    if(++index >= Util.lastCatMax){
                         $("#cat"+(Util.lastCatMax - Util.catMax)).hide();
                         Util.lastCatMax++;
                         $("#cat"+index).show();
                    }
                    $("#cat"+index).addClass('imageFocus');
               } else {

               }
               
               break;
          }
     case tvKeyCode.Enter:
          {
               Keyhandler.sectionEnter ($(".imageFocus"));
               break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
     case tvKeyCode.Return:
          {

               if(!jQuery('#loading').is(':visible')) {
                    $("#SingleMoviePage").hide();
                    $("#SingleMoviePage").html('');
                    try {
                         var obj = popState();
                         view = obj.view;
                         previousFocus = obj.focus;
                    } catch (e) {}

                    Player.close();
                    Main.processNext();
                    break;
               }

               break;
          }
     default:
          break;
     }

     /*
	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			if(rowIndex > 0){
				$("#sectionIndex-"+(rowIndex+1)).hide();
				rowIndex--;
				$("#sectionIndex-"+rowIndex).show();
			}

			var sectionIndex = rowIndex * numberOfRows + (index );

               $('.imageFocus').removeClass("imageFocus");
               $("#sections-"+sectionIndex).addClass('imageFocus');

			break;
		}
	case tvKeyCode.ArrowRight: {

//alert("rowIndex: "+rowIndex);
//alert("rowCount: "+rowCount);
			if(rowIndex < rowCount){

				$("#sectionIndex-"+(rowIndex-1)).hide();
				rowIndex++;
				$("#sectionIndex-"+rowIndex).show();

			}
			
               var sectionIndex = rowIndex * numberOfRows + (index);
               if(sectionIndex < sectionData.length){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#sections-"+sectionIndex).addClass('imageFocus');
               }
			break;
		}
	case tvKeyCode.ArrowUp: {
		    var sectionIndex = 0;
			if(index != 0  ){
				index -- ;
				sectionIndex = rowIndex * numberOfRows + (index % numberOfRows);
	
				$('.imageFocus').removeClass("imageFocus");
				$("#sections-"+sectionIndex).addClass('imageFocus');
			}
			
			break;
		}
	case tvKeyCode.ArrowDown: {
		var sectionIndex =  (rowIndex * numberOfRows + (index % numberOfRows));
		if(index < numberOfRows && sectionIndex < count-1){
			index ++ ;
			sectionIndex = rowIndex * numberOfRows + (index % numberOfRows);
			$('.imageFocus').removeClass("imageFocus");
			$("#sections-"+sectionIndex).addClass('imageFocus');
		}

		break;
	}
	case tvKeyCode.Enter:{
		Keyhandler.sectionEnter ($(".imageFocus"));
		break;
	}
	case 8:
     case 10009:
	case tvKeyCode.Return:{

	    if(!jQuery('#loading').is(':visible')){
	                    $("#SingleMoviePage").hide();
            			$("#SingleMoviePage").html('');
            			try {
            				var obj = popState();
            				view = obj.view;
            				 previousFocus = obj.focus;
            			} catch (e) {}

            			Main.processNext();
            			break;
	        }


	}
	

	default: {
			break;
		}
	}
     */
}

Keyhandler.liveCatchupChannelsKeyHandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}

	var index = parseInt($('.imageFocus').attr("index"));
	var count = parseInt($('.imageFocus').attr("count"));

	var rowIndex = parseInt($('.imageFocus').attr("rowIndex"));
	var rowCount = parseInt($('.imageFocus').attr("rowCount"));


	var id = $('.imageFocus').attr("id");

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
			if(rowIndex > 0){
				$("#sectionCatchupIndex-"+(rowIndex+1)).hide();
				rowIndex--;
				$("#sectionCatchupIndex-"+rowIndex).show();
			}

			var sectionIndex = rowIndex * numberOfRows + (index );


               $('.imageFocus').removeClass("imageFocus");
               $("#sectionCatchup-"+sectionIndex).addClass('imageFocus');

			break;
		}
	case tvKeyCode.ArrowRight: {
			if(rowIndex < rowCount){

				$("#sectionCatchupIndex-"+(rowIndex-1)).hide();
				rowIndex++;
				$("#sectionCatchupIndex-"+rowIndex).show();

			}

               var sectionIndex = rowIndex * numberOfRows + (index);

               if(sectionIndex < catchUpChannelsData.length){
                    $('.imageFocus').removeClass("imageFocus");
                    $("#sectionCatchup-"+sectionIndex).addClass('imageFocus');
               }
			break;
		}
	case tvKeyCode.ArrowUp: {
		    var sectionIndex = 0;
			if(index != 0  ){
				index -- ;
				sectionIndex = rowIndex * numberOfRows + (index % numberOfRows);

				$('.imageFocus').removeClass("imageFocus");
				$("#sectionCatchup-"+sectionIndex).addClass('imageFocus');
			}

			break;
		}
	case tvKeyCode.ArrowDown: {
		var sectionIndex =  (rowIndex * numberOfRows + (index % numberOfRows));
		if(index < numberOfRows && sectionIndex < count-1){
			index ++ ;
			sectionIndex = rowIndex * numberOfRows + (index % numberOfRows);
			$('.imageFocus').removeClass("imageFocus");
			$("#sectionCatchup-"+sectionIndex).addClass('imageFocus');
		}

		break;
	}
	case tvKeyCode.Enter:{
		Keyhandler.liveCatchupChannelsEnter ($(".imageFocus"));
		break;
     }
     /*case tvKeyCode.MediaFastForward:
          Player.ffwd();
          break;
     case tvKeyCode.MediaRewind:
          Player.rwnd();
          break;*/
	case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{

	    if(!jQuery('#loading').is(':visible')){
	                    $("#catchupChannels").hide();
            			$("#catchupChannels").html('');
            			try {
            				var obj = popState();
            				view = obj.view;
            				 previousFocus = obj.focus;
            			} catch (e) {}

                           Main.processNext();
                           Player.close();
            			break;
	        }


	}


	default: {
			break;
		}
	}
}
var sectionsIndex = '';
function include(arr,obj) {
     return (arr.indexOf(obj) != -1);
}


Keyhandler.liveCatchupProgramsKeyHandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}

	var index = parseInt($('.imageFocus').attr("index"));
	var count = parseInt($('.imageFocus').attr("count"));

	var rowIndex = parseInt($('.imageFocus').attr("rowIndex"));
	var rowCount = parseInt($('.imageFocus').attr("rowCount"));
	var role = $('.imageFocus').attr("role");
    var currentPanelID = $('.panel.current').attr("id");

	var id = $('.imageFocus').attr("id");

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
//alert(role);
        if(role!="catchupSection"){
            var $navlist = $('#navlist');
            var $tabContainer = $('#tab-container');
            var $panels = $('#panels');
                    var arrows = [37, 38, 39, 40];
                       var which = e.which;
                       var target = e.target;
                       if ($.inArray(which, arrows) > -1) {
                         var adjacentTab = findAdjacentTab(target, $navlist, which);

                         if (adjacentTab) {
                           e.preventDefault();
                           adjacentTab.focus();
                           // if desired behavior is that when tab receives focus -> make it the active tab:
                           setActiveAndInactive(adjacentTab, $navlist);
                           $('.imageFocus').removeClass("imageFocus");
                           $(".tabs-view #navlist .active a").focus();
                           $(".tabs-view #navlist .active a").addClass('imageFocus');
                         }
                       } else if (which === 13 || which === 32) { // ENTER |or| SPACE
                         e.preventDefault(); // don't scroll the page around...
                         target.click();
                       } else if (which === 34) { // PAGE DOWN
                         e.preventDefault(); // don't scroll the page
                         var assocPanel = $('#' + this.getAttribute('aria-controls'));
                         if (assocPanel) {
                           assocPanel.focus();
                         }
                       }
        }   else{
            if(rowIndex > 0){
                $("#"+currentPanelID+"-sectionIndexCatchUp-"+(rowIndex+1)).hide();
                rowIndex--;
                $("#"+currentPanelID+"-sectionIndexCatchUp-"+rowIndex).show();
            }

            var sectionIndex = rowIndex * numberOfRows + (index );


//alert("#sections-catchup-"+sectionIndex);
               $('.imageFocus').removeClass("imageFocus");
               $("#"+currentPanelID+"-sections-catchup-"+sectionIndex).addClass('imageFocus');

        }




//			if(rowIndex > 0){
//				$("#sectionCatchupIndex-"+(rowIndex+1)).hide();
//				rowIndex--;
//				$("#sectionCatchupIndex-"+rowIndex).show();
//			}
//
//			var sectionIndex = rowIndex * numberOfRows + (index );
//
//
//               $('.imageFocus').removeClass("imageFocus");
//               $("#sectionCatchup-"+sectionIndex).addClass('imageFocus');

			break;
		}
	case tvKeyCode.ArrowRight: {
        if(role!="catchupSection"){
             var $navlist = $('#navlist');
             var $tabContainer = $('#tab-container');
             var $panels = $('#panels');

	        var arrows = [37, 38, 39, 40];
               var which = e.which;
               var target = e.target;
               if ($.inArray(which, arrows) > -1) {
                 var adjacentTab = findAdjacentTab(target, $navlist, which);

                 if (adjacentTab) {
                   e.preventDefault();
                   adjacentTab.focus();
                   // if desired behavior is that when tab receives focus -> make it the active tab:
                   setActiveAndInactive(adjacentTab, $navlist);
                   $('.imageFocus').removeClass("imageFocus");
                   $(".tabs-view #navlist .active a").focus();
                   $(".tabs-view #navlist .active a").addClass('imageFocus');
                 }
               } else if (which === 13 || which === 32) { // ENTER |or| SPACE
                 e.preventDefault(); // don't scroll the page around...
                 target.click();
               } else if (which === 34) { // PAGE DOWN
                 e.preventDefault(); // don't scroll the page
                 var assocPanel = $('#' + this.getAttribute('aria-controls'));
                 if (assocPanel) {
                   assocPanel.focus();
                 }
               }

        }else{
//alert("rowIndex: "+rowIndex);
//alert("rowCount: "+rowCount);

                if(rowIndex < rowCount){

                    $("#"+currentPanelID+"-sectionIndexCatchUp-"+(rowIndex-1)).hide();
                    rowIndex++;
                    $("#"+currentPanelID+"-sectionIndexCatchUp-"+rowIndex).show();

                }

                   var sectionIndex = rowIndex * numberOfRows + (index);
                   var dateIndex =  $(".tabs-view #navlist .active a").attr("date");
                   if(sectionIndex < archiveArray[dateIndex].length){
                        $('.imageFocus').removeClass("imageFocus");
                        $("#"+currentPanelID+"-sections-catchup-"+sectionIndex).addClass('imageFocus');
                   }
        }
//			if(rowIndex < rowCount){
//
//				$("#sectionCatchupIndex-"+(rowIndex-1)).hide();
//				rowIndex++;
//				$("#sectionCatchupIndex-"+rowIndex).show();
//
//			}
//
//               var sectionIndex = rowIndex * numberOfRows + (index);
//
//               if(sectionIndex < catchUpChannelsData.length){
//                    $('.imageFocus').removeClass("imageFocus");
//                    $("#sectionCatchup-"+sectionIndex).addClass('imageFocus');
//               }
			break;
		}
case tvKeyCode.ArrowUp: {
            if(role!="catchupSection"){

            }else{
                var sectionIndex = 0;
                if(index != 0  ){
                    index -- ;
                    sectionIndex = rowIndex * numberOfRows + (index % numberOfRows);

                    $('.imageFocus').removeClass("imageFocus");
                    $("#"+currentPanelID+"-sections-catchup-"+sectionIndex).addClass('imageFocus');
                }else{
                     $('.imageFocus').removeClass("imageFocus");
                    $(".tabs-view #navlist .active a").focus();
                    $(".tabs-view #navlist .active a").addClass('imageFocus');
                }

            }

			break;
		}
	case tvKeyCode.ArrowDown: {
	    if(role!="catchupSection"){
	            var visibleDiv = $('.panel.current').find('div:visible:first').attr("id");
	             $('.imageFocus').removeClass("imageFocus");
	            $('#'+visibleDiv).find('p:visible:first').addClass('imageFocus');
//                alert(visibleDivInner);
//                alert(visibleDivInner);
//
//                $("#"+currentPanelID+"-sections-catchup-0").addClass('imageFocus');
        }else{

            var sectionIndex =  (rowIndex * numberOfRows + (index % numberOfRows));
            //		alert("sectionIndex"+ sectionIndex);
    //		alert("index"+ index);
            if(index < numberOfRows && sectionIndex < count-1){
                index ++ ;
                sectionIndex = rowIndex * numberOfRows + (index % numberOfRows);
                $('.imageFocus').removeClass("imageFocus");
                $("#"+currentPanelID+"-sections-catchup-"+sectionIndex).addClass('imageFocus');
            }
        }



		break;
	}
	case tvKeyCode.Enter:{
		Keyhandler.liveCatchupProgramsEnter ($(".imageFocus"));
		break;
     }
     case 27:
     case 127:
	case 8:
     case 10009:
	case tvKeyCode.Return:{

	    if(!jQuery('#loading').is(':visible')){
	                    $("#catchupPrograms").hide();
            			$("#catchupPrograms").html('');
            			$("#catchupChannels").show();
            			try {
            				var obj = popState();
            				view = obj.view;
//            				alert(view);
            				 previousFocus = obj.focus;
            			} catch (e) {}

                           Main.processNext();
                           Player.close();
            			break;
	        }


	}


	default: {
			break;
		}
	}
}

Keyhandler.liveCatchupProgramsEnter = function(currFocus){
     if (Player.isPreparing())
          return;
     var role = currFocus.attr("role");

     if(role=="catchupSection"){
          var startDateTime = currFocus.attr("starttime");
          var stopDateTime = currFocus.attr("stoptime");
          var stream_id = currFocus.attr("streamid");
          var programName = atob(currFocus.attr("programname"));
          var programDesc = atob(currFocus.attr('programdesc'));
          var startDateTimeWithoutSpace = startDateTime.replace(" ", ":");
          //console.log("start=" + startDateTime + " stop=" + stopDateTime);
          var edate = Date.parse(stopDateTime);
          if (isNaN(edate))
               edate = Date.parse(stopDateTime.replace(' ', 'T'));
          var sdate = Date.parse(startDateTime);
          if (isNaN(sdate))
               sdate = Date.parse(startDateTime.replace(' ', 'T'));

          var diff = ( edate  - sdate ) / 1000 / 60 ;
          if (isNaN(diff))
               diff = 120;

          //var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/timeshift/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+diff+"/"+startDateTimeWithoutSpace+"/"+stream_id+".m3u8";
          var playUrl = Main.profile.user_info.login_url + "/timeshift.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&file="+stream_id+".m3u8&dur="+diff+"&t="+startDateTimeWithoutSpace;
          hideValues();
          $("#catchupChannels").hide();
          $("#catchupPrograms").hide();
          pushState(view,$('.imageFocus').attr('id'));

          currentCatchupInfo.duration = diff * 60;
          currentCatchupInfo.streamId = stream_id;
          currentCatchupInfo.programName = programName;
          currentCatchupInfo.startTime = sdate;
          currentCatchupInfo.endTime = edate;
          currentCatchupInfo.programDesc = programDesc;
          $("#HTML5Div").html(Util.fullScreenCatchUpPage(programName, formatTime(new Date()), currentCatchupInfo.chNum + ' ' + currentCatchupInfo.channelName, diff * 60, currentCatchupInfo.programDesc, currentCatchupInfo.logo));
          view = "catchupPlayer";
          Player.data = currentCatchupInfo;
          Player.type = 'catchup';
          Player.playStream(playUrl,false);
          Player.setStreamId(-1);
          /*
          var player = jwplayer('player-wrapper');
                    // Set up the player with an HLS stream that includes timed metadata
                    player.setup({
                    "file": playUrl,
                    "width":"100%",
                    "aspectratio": "16:9"
                    });
          */
          $("#HTML5Div").show();
          showCatchupInfo();
     }
}

Keyhandler.liveCatchupChannelsEnter = function(currFocus){
            var stream_id = currFocus.attr("stream_id");
            currentCatchupInfo.channelName = atob(currFocus.attr("chname"));
            currentCatchupInfo.chNum = currFocus.attr("chnum");
            currentCatchupInfo.logo = atob(currFocus.attr("chlogo"));
            Main.getTVArchive('get_simple_data_table',stream_id);
//            Main.HideLoading();
//            pushState(view,$(".imageFocus").attr("id"));
//            $(".imageFocus").removeClass("imageFocus");
//            view = "liveCatchupPrograms";
//            $("#catchupPrograms").html(Util.listCatchUpProgramsPage());
//            $("#catchupPrograms").show();
}

var adultArray = ['adult','xxx','porn','sex','adults'],pinEntered = false;

Keyhandler.sectionEnter2 = function(currFocus){
	var index = parseInt(currFocus.attr("index"));
	var count = parseInt(currFocus.attr("count"));

	var rowIndex = parseInt(currFocus.attr("rowIndex"));
	var rowCount = parseInt(currFocus.attr("rowCount"));
     var action = currFocus.attr("action");
     var sectionType = currFocus.attr("sectionType");
     if(action == "get_live_categories") action = "get_live_streams";
     else if(action == "get_vod_categories") action = "get_vod_streams";
     else if(action == "get_series_categories") action = "get_series";

     var actualIndex = (rowIndex * numberOfRows) + index;

	var categ = currFocus.attr("categ");
     sectionsIndex = actualIndex;

     var temp = sectionData[sectionsIndex].category_name.split(" ");

     var flag = false;
     var ajaxChecked = false;




// var cID="";
     var cName="";
     var cID="";
     var flag = false;
     var typeofCase = '';
//     openedMovieID = id;

	Main.ShowLoading();
	if(sectionType !="live" && sectionType !="catchup"){
        if(parentPin){
        //        for(var i= 0 ;i<vodSectionDetails.length;i++){
        //            if(vodSectionDetails[i].stream_id == id){
        //               cID = vodSectionDetails[i].category_id;
        //               break;
        //            }
        //        }

                 if(categ!="" && categ == "ALL"){
                    typeofCase = "ALL";
                    for(var j=0;j<sectionData.length;j++){
                            if(compareString(sectionData[j].category_name,adultArray)){
                                   openedMovieCatID = categ;
                                   openedSectionAction = action;
                                   flag = true;
                                   Main.HideLoading();
                                   pushState(view,$(".imageFocus").attr("id"));
                                   $(".imageFocus").removeClass("imageFocus");
                                   view = "enterPinMoviesCategories";
                                   $("#customMessage").html(Util.confirmPin());
                                   $("#customMessage").show();
                                   break;

                            }
                    }
                 }else if(categ!="" && categ == "FAVOURITE"){
                        typeofCase = "FAVOURITE";
                        if(action == "get_series"){
                             var items = JSON.parse(window.localStorage.getItem('favSeriesList'));
                        }else{
                             var items = JSON.parse(window.localStorage.getItem('favMoviesList'));
                        }
                        if(items !== null && items !== undefined && items.length>0){
        //                        alert(items);
                                for(var j=0;j<sectionData.length;j++){
                                        if(compareString(sectionData[j].category_name,adultArray)){
                                            cName = sectionData[j].category_name;
                                            cID = sectionData[j].category_id;
                                            break;
                                        }
                                }
                                if(cName!=""){
                                   ajaxChecked = true;
                                   ajaxGetCatDetails(action,cID,items,categ);
                                 }else{
                                    //alert("no category found");
                                }
                        }else{
        //                     Main.HideLoading();
        //                     Main.showFailure("No Favourite Found.");
                        }

                 }else if(categ!=""){
                    typeofCase ="Any";
                    for(var j=0;j<sectionData.length;j++){
                        if(sectionData[j].category_id == categ){
                            cName = sectionData[j].category_name;
                           break;
                        }

                    }
                 }

                if(typeofCase == "Any"){
                    if(cName!="" && parentPin){
                       if(compareString(cName,adultArray)){
                            openedMovieCatID = categ;
                            openedSectionAction = action;

                            flag = true;
        //                    alert("locked movie");
                            Main.HideLoading();

                            pushState(view,$(".imageFocus").attr("id"));
                            $(".imageFocus").removeClass("imageFocus");
                            view = "enterPinMoviesCategories";
                            $("#customMessage").html(Util.confirmPin());
                            $("#customMessage").show();

                       }

                    }
                }

            }
	}

//    else{
//         if(action = "get_vod_streams"){
//                  Main.getVodDetails(action,categ);
//         }
//    }



//alert(pinEntered);
//alert(parentPin);
//     if(!pinEntered && parentPin)
//     for(var i=0;i<temp.length;i++){
//          if(include(adultArray,temp[i].toLowerCase())){
//               flag = true;
//
//               pushState(view,$(".imageFocus").attr("id"));
//               $(".imageFocus").removeClass("imageFocus");
//               view = "enterPin";
//
//               $("#customMessage").html(Util.confirmPin());
//               $("#customMessage").show();
//               break;
//          }
//     }

     if(!ajaxChecked){
        if(!flag){
            if(action == "get_vod_streams" || action =="get_series"){
                    Main.getVodDetails(action,categ);
             }
        }

     }
     if(!flag){
        if(action == "get_live_streams"){
              Main.getLiveDetails(action,categ,false,sectionType);
         }
     }

     
	
}

Keyhandler.sectionEnter = function(currFocus) {
     var source = currFocus.attr("source");

     if (source == "cat") {
          var index = parseInt(currFocus.attr("index"));
          var action = currFocus.attr("action");
          var sectionType = currFocus.attr("sectionType");
          if (action == "get_live_categories") {
               action = "get_live_streams";
               $("#curCatType").val("live");
          } else if (action == "get_vod_categories") {
               action = "get_vod_streams";
               $("#curCatType").val("vod");
          } else if (action == "get_series_categories") {
               action = "get_series";
               $("#curCatType").val("series");
          }

          var categ = currFocus.attr("categ");

          var ajaxChecked = false;

          var cName = "";
          var cID = "";
          var flag = false;
          var typeofCase = '';

          Main.ShowLoading();
          if (sectionType != "live")
               $("#catTitle").html(currFocus.attr("catName"));
          $("#liveCatTitle").html(currFocus.attr("catName"));
          $("#curCatId").val(currFocus[0].id);
          console.log("cat id: " + currFocus[0].id);
          if (sectionType != "live" && sectionType != "catchup") {
               if (parentPin) {
                    if (categ != "" && categ == "ALL") {
                         typeofCase = "ALL";
                         for (var j = 0; j < sectionData.length; j++) {
                              if (compareString(sectionData[j].category_name, adultArray)) {
                                   openedMovieCatID = categ;
                                   openedSectionAction = action;
                                   flag = true;
                                   Main.HideLoading();
                                   pushState(view, $(".imageFocus").attr("id"));
                                   $(".imageFocus").removeClass("imageFocus");
                                   view = "enterPinMoviesCategories";
                                   $("#customMessage").html(Util.confirmPin());
                                   $("#customMessage").show();
                                   break;

                              }
                         }
                    } else if (categ != "" && categ == "FAVOURITE") {
                         typeofCase = "FAVOURITE";
                         if (action == "get_series") {
                              var items = JSON.parse(window.localStorage.getItem('favSeriesList'));
                         } else {
                              var items = JSON.parse(window.localStorage.getItem('favMoviesList'));
                         }
                         if (items !== null && items !== undefined && items.length > 0) {
                              //alert(items);
                              for (var j = 0; j < sectionData.length; j++) {
                                   if (compareString(sectionData[j].category_name, adultArray)) {
                                        cName = sectionData[j].category_name;
                                        cID = sectionData[j].category_id;
                                        break;
                                   }
                              }
                              if (cName != "") {
                                   ajaxChecked = true;
                                   ajaxGetCatDetails(action, cID, items, categ);
                              } else {
                                   //alert("no category found");
                              }
                         } else {
                              //Main.HideLoading();
                              //Main.showFailure("No Favourite Found.");
                         }

                    } else if (categ != "") {
                         typeofCase = "Any";
                         for (var j = 0; j < sectionData.length; j++) {
                              if (sectionData[j].category_id == categ) {
                                   cName = sectionData[j].category_name;
                                   break;
                              }

                         }
                    }

                    if (typeofCase == "Any") {
                         if (cName != "" && parentPin) {
                              if (compareString(cName, adultArray)) {
                                   openedMovieCatID = categ;
                                   openedSectionAction = action;

                                   flag = true;
                                   //alert("locked movie");
                                   Main.HideLoading();

                                   pushState(view, $(".imageFocus").attr("id"));
                                   $(".imageFocus").removeClass("imageFocus");
                                   view = "enterPinMoviesCategories";
                                   $("#customMessage").html(Util.confirmPin());
                                   $("#customMessage").show();

                              }

                         }
                    }

               }
          }

          if (!ajaxChecked) {
               if (!flag) {
                    if (action == "get_vod_streams" || action == "get_series") {
                         Main.getVodDetails(action, categ);
                    }
               }

          }
          if (!flag) {
               if (action == "get_live_streams") {
                    Main.getLiveDetails(action, categ, false, sectionType);
               }
          }
     }
}

Keyhandler.vodMoviesKeyhandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var index = parseInt($('.imageFocus').attr("index"));
	
	var id = $('.imageFocus').attr("id");
	var count = parseInt($('.imageFocus').attr("count"));
	var source = $('.imageFocus').attr("source");

	var v_index = parseInt($('.imageFocus').attr("v_index"));
	var h_index = parseInt($('.imageFocus').attr("h_index"));

	switch (keycode) {
     case 27:
     case tvKeyCode.Search:
     case tvKeyCode.ColorF1Green:
          break;
	case tvKeyCode.ArrowLeft: {
		if(source != "topMenu"){
		
				if(h_index > 0){
					h_index--;
					$('.imageFocus').removeClass("imageFocus");
					$('#vodMovies-'+v_index+"-"+h_index).addClass("imageFocus");
				} else {
                         $('.imageFocus').removeClass("imageFocus");
                         var obj = popState();
                         $('#' + obj.focus).addClass("imageFocus");
                         view = obj.view;
                         return;
                    }
		}
		
			
			break;
		}
	case tvKeyCode.ArrowRight: 
          {
               if(source != "topMenu") {
                    var rowData = (v_index * numberOfVods) + h_index;
                    if(rowData < (count-1))
                    if(h_index < numberOfVods-1){
                         h_index++;
                         $('.imageFocus').removeClass("imageFocus");
                         $('#vodMovies-'+v_index+"-"+h_index).addClass("imageFocus");
                    }
               }
               break;
		}
	case tvKeyCode.ArrowUp: {
			if(source != "topMenu"){
				if(v_index > 0){
                         var prepended = false;
                         if (v_index == lastVodTopIndex) {
                              $("#moviesList").prepend(Util.addMovieRow((v_index-1)));
                              $("#vodRow-"+(v_index-1)).show();
                              lastVodTopIndex--;
                              prepended = true;
                         }
					v_index --;
					$('.imageFocus').removeClass("imageFocus");
					$('#vodMovies-'+v_index+"-"+h_index).addClass("imageFocus");
                         if (prepended)
					     $("#vodRow-"+(v_index+numberOfVodRows)).remove();
				}
			}
			break;
		}
	case tvKeyCode.Enter: {
               Keyhandler.vodMovieKeyEnter($('.imageFocus'));
			break;
          }
     /*
     case tvKeyCode.MediaFastForward:
          Player.ffwd();
          break;
     case tvKeyCode.MediaRewind:
          Player.rwnd();
          break;
     */
	case tvKeyCode.ArrowDown: {
		//var id = $('.imageFocus').attr("id");
		if (v_index < (count/numberOfVods)-1) {
               var removed = false;
               if (v_index == lastVodTopIndex + numberOfVodRows - 1 ) {
			     $("#vodRow-"+(lastVodTopIndex)).remove();
                    lastVodTopIndex++;
                    removed = true;
               }
			v_index ++;
               if (removed) {
			     $("#moviesList").append(Util.addMovieRow((lastVodTopIndex+numberOfVodRows-1)));
			     $("#vodRow-"+(lastVodTopIndex+numberOfVodRows-1)).show();
               }

			$('.imageFocus').removeClass("imageFocus");

			if((v_index * numberOfVods)+h_index < count-1 )
				$('#vodMovies-'+v_index+"-"+h_index).addClass("imageFocus");
			else
				$('#vodMovies-'+v_index+"-"+ ( (count-1) % numberOfVods)).addClass("imageFocus");

		}
			break;
          }
     case tvKeyCode.Cancel:
          break;
     case tvKeyCode.ColorF2Yellow:
          /*
          var stream_id = parseInt($('.imageFocus').attr("stream_id"));
          var type = $('.imageFocus').attr("type");
          if (type === 'show')
               addToFavSeries(stream_id);
          else
               addToFavMovie(stream_id);
          */
          break;
     case tvKeyCode.ColorF0Red:
          /*
          var stream_id = parseInt($('.imageFocus').attr("stream_id"));
          var type = $('.imageFocus').attr("type");
          if (type === 'show')
               removeFromFavSeries(stream_id);
          else
               removeFromFavMovie(stream_id);
          */
          break;
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return: {

	    if(!jQuery('#loading').is(':visible')){
          $("#mainContent").html("");
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
               //previousFocus = '';
          } catch (e) {}
          
          Main.processNext();
          Player.close();
          break;
        }
			
	}
	default: {
			break;
		}
	}
}

Keyhandler.tvEpisodesKeyhandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var index = parseInt($('.imageFocus').attr("index"));
	
	var id = $('.imageFocus').attr("id");
	var count = parseInt($('.imageFocus').attr("count"));
	var source = $('.imageFocus').attr("source");

	var v_index = parseInt($('.imageFocus').attr("v_index"));
	var h_index = parseInt($('.imageFocus').attr("h_index"));

	switch (keycode) {
     case 27:
     case tvKeyCode.Search:
     case tvKeyCode.ColorF1Green:
          break;
	case tvKeyCode.ArrowLeft: {
		if(source != "topMenu"){	
               if(h_index > 0){
                    h_index--;
                    $('.imageFocus').removeClass("imageFocus");
                    $('#serMovies-'+v_index+"-"+h_index).addClass("imageFocus");
               }
		}
		
			
			break;
		}
	case tvKeyCode.ArrowRight: 
          {
               if(source != "topMenu") {
                    var rowData = (v_index * numberOfEpisodes) + h_index;
                    if(rowData < (count-1))
                    if(h_index < numberOfEpisodes-1){
                         h_index++;
                         $('.imageFocus').removeClass("imageFocus");
                         $('#serMovies-'+v_index+"-"+h_index).addClass("imageFocus");
                    }
               }
               break;
		}
	case tvKeyCode.ArrowUp: {
			if(source != "topMenu"){
				if(v_index > 0){
                         var prepended = false;
                         if (v_index == lastVodTopIndex) {
                              $("#episodesList").prepend(Util.addEpisodesRow((v_index-1)));
                              $("#serRow-"+(v_index-1)).show();
                              lastVodTopIndex--;
                              prepended = true;
                         }
					v_index --;
					$('.imageFocus').removeClass("imageFocus");
					$('#serMovies-'+v_index+"-"+h_index).addClass("imageFocus");
                         if (prepended)
					     $("#serRow-"+(v_index+numberOfEpisodeRows)).remove();
				}
			}
			break;
		}
	case tvKeyCode.Enter: {
               Keyhandler.episodeKeyEnter($('.imageFocus'));
			break;
          }
     /*
     case tvKeyCode.MediaFastForward:
          Player.ffwd();
          break;
     case tvKeyCode.MediaRewind:
          Player.rwnd();
          break;
     */
	case tvKeyCode.ArrowDown: {
		//var id = $('.imageFocus').attr("id");
		if (v_index < (count/numberOfEpisodes)-1) {
               var removed = false;
               if (v_index == lastVodTopIndex + numberOfEpisodeRows - 1 ) {
			     $("#serRow-"+(lastVodTopIndex)).remove();
                    lastVodTopIndex++;
                    removed = true;
               }
			v_index ++;
               if (removed) {
			     $("#episodesList").append(Util.addEpisodesRow((lastVodTopIndex+numberOfEpisodeRows-1)));
			     $("#serRow-"+(lastVodTopIndex+numberOfEpisodeRows-1)).show();
               }

			$('.imageFocus').removeClass("imageFocus");

			if((v_index * numberOfEpisodes)+h_index < count-1 )
				$('#serMovies-'+v_index+"-"+h_index).addClass("imageFocus");
			else
				$('#serMovies-'+v_index+"-"+ ( (count-1) % numberOfEpisodes)).addClass("imageFocus");

		}
			break;
          }
     case tvKeyCode.Cancel:
          break;
     case tvKeyCode.ColorF2Yellow:
          /*
          var stream_id = parseInt($('.imageFocus').attr("stream_id"));
          var type = $('.imageFocus').attr("type");
          if (type === 'show')
               addToFavSeries(stream_id);
          else
               addToFavMovie(stream_id);
          */
          break;
     case tvKeyCode.ColorF0Red:
          var stream_id = parseInt($('.imageFocus').attr("stream_id"));
          var type = $('.imageFocus').attr("type");
          if (type === 'show')
               removeFromFavSeries(stream_id);
          else
               removeFromFavMovie(stream_id);
          break;
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return: {
          $("#episodesDiv").html("");
          $("#episodesDiv").hide();
          try {
               var obj = popState();
               view = obj.view;
               //previousFocus = obj.focus;
               previousFocus = '';
          } catch (e) {}
          Main.processNext();
          break;
     }
	default: {
			break;
		}
	}
}

var singleMovieFocus = '';

Keyhandler.tvshowDetailsKeydown = function(e){
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var id = $('.imageFocus').attr("id");
	var count = parseInt($('.imageFocus').attr("count"));
	var source = $('.imageFocus').attr("source");

	var v_index = parseInt($('.imageFocus').attr("v_index"));
     var h_index = parseInt($('.imageFocus').attr("h_index"));
     
     var index = parseInt($('.imageFocus').attr("index"));
     
     switch (keycode) {
	case tvKeyCode.ArrowLeft: {
               if (id == "trailer") {
                    $('.imageFocus').removeClass("imageFocus");
                    $("#episodes").addClass("imageFocus");
               } else if (id == "fav") {
                    $('.imageFocus').removeClass("imageFocus");
                    $("#trailer").addClass("imageFocus");
               }
			break;
		}
	case tvKeyCode.ArrowRight: {
          if (id == "episodes") {
               $('.imageFocus').removeClass("imageFocus");
               $("#trailer").addClass("imageFocus");
          } else if (id == "trailer") {
               $('.imageFocus').removeClass("imageFocus");
               $("#fav").addClass("imageFocus");
          }
		break;
		}
	case tvKeyCode.ArrowUp: {
               
			break;
		}
	case tvKeyCode.Enter: {
               Keyhandler.tvshowDetailsKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {

			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return: {
         if(!jQuery('#loading').is(':visible')){
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
          } catch (e) {}
          singleMovieFocus = '';
          Main.processNext();
          break;
        }
			
	}
	default: {
			break;
		}
	}
}
Keyhandler.tvshowDetailsKeyEnter = function(currFocus){
	var id = currFocus.attr("id");
     if (id == "episodes") {
          pushState(view, currFocus);
          view = "tvEpisodes";
          Main.processNext();
          return;
     } else if (id == "fav") {
          var keys = Object.keys(Main.getFavSeries());
          if (jQuery.inArray('' + openedSeriesID, keys) != -1) {
               Main.removeFavSeries(openedSeriesID);
               currFocus.html('<img src="images/favourite.png">');
          } else {
               Main.addFavSeries(openedSeriesID, vodSectionDetails[openedSeriesID2]);
               currFocus.html('<img src="images/favouriteselected.png">');
          }
          return;
     } else if (id == "trailer" && seriesPage.info.youtube_trailer !== undefined && seriesPage.info.youtube_trailer.indexOf("http://") != 0 && seriesPage.info.youtube_trailer.indexOf("https://") != 0 && seriesPage.info.youtube_trailer.length > 5) {
          pushState(view, currFocus);
          view = "youtubeTrailer";
          hideValues();
          $("#SingleMoviePage").hide();
          $("#HTML5Div").html(Util.playTrailer(seriesPage.info.youtube_trailer));
          $("#HTML5Div").show();
          return;
     }

     if (seriesPage.info.youtube_trailer === undefined || seriesPage.info.youtube_trailer.length < 10)
          return;

     if (Player.isPreparing())
          return;
   
     pushState(view, currFocus);
     hideValues();
     Player.type = "movies";
     Player.data = seriesPage.info;
     Player.data.name = seriesPage.info.name;
     var playUrl = seriesPage.info.youtube_trailer;
     $("#SingleMoviePage").hide();
     $("#HTML5Div").html(Util.fullScreenMoviePage(seriesPage.info.name, seriesPage.info.cover, 0, formatTime(new Date()), seriesPage.info.plot));
     view = "seriesPlayer";
     Player.playStream(playUrl,false);
     Player.setStreamId(-1);
     $("#HTML5Div").show();
     showMovieInfo();
     
}
Keyhandler.seasonsListKeyhandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	hoverOn = false;
	var source = $('.imageFocus').attr("source");
	var id = $('.imageFocus').attr("id");

	var index = parseInt($('.imageFocus').attr("index"));
	var count =  parseInt($('.imageFocus').attr("count"));

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

			break;
		}
	case tvKeyCode.ArrowRight: {

			break;
		}
	case tvKeyCode.ArrowUp: {
		if(index > 0){
			index--;
			$('.imageFocus').removeClass("imageFocus");
			$('#ssList-'+index).addClass('imageFocus');
		}
			break;
		}
	case tvKeyCode.Enter: {
			Keyhandler.seasonsListEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
		if(index < count-1){
			index++;
			$('.imageFocus').removeClass("imageFocus");
			$('#ssList-'+index).addClass('imageFocus');
		}
			break;
		}
     case 27:
     case 127:
	case tvKeyCode.Return:
     case 10009:
	case 8: {
	       if(!jQuery('#loading').is(':visible')){
			$("#customMessage").hide();
			$("#customMessage").html("");
			var obj = popState();
			view = obj.view;
			previousFocus = obj.focus;
			Main.processNext();
			break;
		  }
		}
	default: {
			break;
		}
	}

}
Keyhandler.seasonsListEnter = function(currFocus){
	
	Main.ShowLoading();
	var id = currFocus.attr("id");
	var season = parseInt(currFocus.text().replace("Season - ",""));
     //season -= 1;

	$("#customMessage").hide();
	$("#customMessage").html("");
	var obj = popState();
	view = obj.view;
     previousFocus = obj.focus;
     $("#seasonSelector").attr("season",season);
     Main.updateEpisodes(season);
	//Main.processNext();

	Main.HideLoading();
}
Keyhandler.singleMovieKeydown = function(e){
     var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var id = $('.imageFocus').attr("id");

	switch (keycode) {
	case tvKeyCode.ArrowLeft: {

               if (id == "trailer") {
                    $('.imageFocus').removeClass("imageFocus");
                    $("#play").addClass("imageFocus");
               } else if (id == "fav") {
                    $('.imageFocus').removeClass("imageFocus");
                    $("#trailer").addClass("imageFocus");
               }

			break;
		}
	case tvKeyCode.ArrowRight: {
          if (id == "play") {
               $('.imageFocus').removeClass("imageFocus");
               $("#trailer").addClass("imageFocus");
          } else if (id == "trailer") {
               $('.imageFocus').removeClass("imageFocus");
               $("#fav").addClass("imageFocus");
          }
		break;
	}
	case tvKeyCode.ArrowUp: {
			break;
		}
	case tvKeyCode.Enter: {
               Keyhandler.singleMovieKeyEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return: {
	    if(!jQuery('#loading').is(':visible')){
          $("#SingleMoviePage").html("");
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
          } catch (e) {}
          singleMovieFocus = '';
          Main.processNext();
          Player.close();
          break;
        }
			
	}
	default: {
			break;
		}
	}
};

Keyhandler.singleMovieKeyEnter = function(currFocus){
     var id = currFocus.attr("id");

     if (id == "fav") {
          var keys = Object.keys(Main.getFavMovies());
          if (jQuery.inArray('' + openedMovieID, keys) != -1) {
               Main.removeFavMovies(openedMovieID);
               currFocus.html('<img src="images/favourite.png">');
          } else {
               Main.addFavMovies(singleMovie.movie_data.stream_id, vodSectionDetails[openedMovieID2]);
               currFocus.html('<img src="images/favouriteselected.png">');
          }
          return;
     } else if (id == "trailer" && singleMovie.info.youtube_trailer.indexOf("http://") != 0 && singleMovie.info.youtube_trailer.indexOf("https://") != 0 && singleMovie.info.youtube_trailer.length > 4) {
          pushState(view, currFocus);
          view = "youtubeTrailer";
          hideValues();
          $("#SingleMoviePage").hide();
          $("#HTML5Div").html(Util.playTrailer(singleMovie.info.youtube_trailer));
          $("#HTML5Div").show();
          return;
     }

     if (id == "trailer" && (singleMovie.info.youtube_trailer === undefined || singleMovie.info.youtube_trailer.length < 10))
          return;

     if (Player.isPreparing())
          return;
   
     pushState(view, currFocus);
     hideValues();
     var container = singleMovie.movie_data.container_extension;
     Player.type = "movies";
     Player.data = singleMovie.info;
     Player.data.name = singleMovie.movie_data.name;
     var playUrl = singleMovie.info.youtube_trailer;
     if (id == "play")
          playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/movie/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+singleMovie.movie_data.stream_id+"."+container;
     $("#SingleMoviePage").hide();
     $("#HTML5Div").html(Util.fullScreenMoviePage(singleMovie.movie_data.name, singleMovie.info.movie_image, 0, formatTime(new Date()), singleMovie.info.description));
     view = "seriesPlayer";
     Player.playStream(playUrl,false);
     Player.setStreamId(-1);
     $("#HTML5Div").show();
     showMovieInfo();
};

Keyhandler.youtubeKeyhandler = function(e) {
     var keycode;
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	
	var id = $('.imageFocus').attr("id");

	switch (keycode) {
          case 27:
          case 127:
          case 8:
          case 10009:
          case tvKeyCode.Return: {
               $("#HTML5Div").html('');
               $("#HTML5Div").hide();
               try {
                    var obj = popState();
                    view = obj.view;
                    previousFocus = obj.focus;
               } catch (e) {}
               Main.processNext();
               break;
          }
     }
};

Keyhandler.episodeKeyEnter = function(currFocus){
     if (Player.isPreparing())
          return;
	
	var id = currFocus.attr("id");
     var season = currFocus.attr("season");
     var index = currFocus.attr("index");

     pushState(view, currFocus);

     hideValues();
     var container = seriesPage.episodes[season][index].container_extension;
     Player.type = "series";
     Player.data = seriesPage.episodes[season][index].info;
     Player.data.name = seriesPage.episodes[season][index].title;
     var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/series/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+seriesPage.episodes[season][index].id+"."+container;

     $("#episodesDiv").hide();
     var title = seriesPage.episodes[season][index].title;
     if (title === undefined) {
          title = seriesPage.info.name;
     } else {
          if (title.indexOf(seriesPage.info.name) == -1 || title.length < 10) {
               title = seriesPage.info.name + ' - ' + title;
          }
     }
     var cover = seriesPage.info.cover;
     if (seriesPage.episodes[season][index].info !== undefined && seriesPage.episodes[season][index].info.movie_image !== undefined && seriesPage.episodes[season][index].info.movie_image.length > 10)
          cover = seriesPage.episodes[season][index].info.movie_image;
     var plot = seriesPage.info.plot;
     if (seriesPage.episodes[season][index].info !== undefined && seriesPage.episodes[season][index].info.plot !== undefined && seriesPage.episodes[season][index].info.plot.length > 10)
          plot = seriesPage.episodes[season][index].info.plot;
     $("#HTML5Div").html(Util.fullScreenMoviePage(title, cover, 0, formatTime(new Date()), plot));
     view = "seriesPlayer";
     Player.playStream(playUrl,false);
     Player.setStreamId(-1);
     $("#HTML5Div").show();
     showMovieInfo();
}

Keyhandler.vodMovieKeyEnter = function(currFocus){

     var id = $('.imageFocus').attr("id");
	var index = parseInt($('.imageFocus').attr("index"));

     var streamId = $('.imageFocus').attr("stream_id");

     var type = $('.imageFocus').attr("type");
     if(type != "show"){
          openedMovieID2 = index;
          Main.getSingleMovie(streamId);
     }else{
          openedSeriesID2 = index;
          Main.getSeriesPage(streamId);
      }

}

Keyhandler.liveTvOnNumbers = function(keycode) {
     if (keycode > tvKeyCode.Num9 && keycode < tvKeyCode.Num0)
          return;
     if (searchChNum.length > 4)
          return;
     searchChNum = searchChNum + (keycode - tvKeyCode.Num0);
     showChannelNum();
};

Keyhandler.liveTvOnFullscreen = function(keycode) {
     
     switch(keycode) {
          case tvKeyCode.Enter:
               if ($('.player_onnum').is(':visible')) {
                    hideChannelNum();
                    break;
               }
               showLiveInfo();
               break;
          case tvKeyCode.ArrowLeft:
               showLiveInfo();
               break;
          case tvKeyCode.ArrowRight:
               showLiveInfo();
               break;
          case tvKeyCode.ChannelUp:
          case tvKeyCode.ChannelUpLG:
          case tvKeyCode.ArrowUp:
               Keyhandler.playStreamIndex(currentLiveInfo.nextIndex);
               showLiveInfo();
               break;
          case tvKeyCode.ChannelDown:
          case tvKeyCode.ChannelDownLG:
          case tvKeyCode.ArrowDown:
               Keyhandler.playStreamIndex(currentLiveInfo.prevIndex);
               showLiveInfo();
               break;
          case tvKeyCode.ColorF3Blue:
               Player.switchDisplayMethod();
               break;
          case tvKeyCode.ColorF2Yellow:
               addToFavLink(currentLiveInfo.streamId, currentLiveInfo.curIndex, currentLiveInfo.channelName, currentLiveInfo.logo, currentLiveInfo.chNum);
               break;
          case tvKeyCode.ColorF0Red:
               //removeFromFavLink(currentLiveInfo.streamId, currentLiveInfo.curIndex);
               break;
          case 27:
          case 127:
          case 8:
          case 10009:
          case tvKeyCode.Return:
               if ($('.player_onnum').is(':visible')) {
                    searchChNum = '';
                    hideChannelNum();
                    break;
               }
               Player.setFullscreen(false);
               $(".playing").removeClass("playing");
               $(".imageFocus").removeClass('imageFocus');
               $("#liveChannel-" + currentLiveInfo.curIndex).addClass('imageFocus');
               $("#liveChannel-" + currentLiveInfo.curIndex).addClass('playing');
               hideLiveInfo();
               break;
          case tvKeyCode.Num0:
          case tvKeyCode.Num1:
          case tvKeyCode.Num2:
          case tvKeyCode.Num3:
          case tvKeyCode.Num4:
          case tvKeyCode.Num5:
          case tvKeyCode.Num6:
          case tvKeyCode.Num7:
          case tvKeyCode.Num8:
          case tvKeyCode.Num9:
               Keyhandler.liveTvOnNumbers(keycode);
               break;
     }
};

var tempIndex = 0,epgTimer = '';
Keyhandler.liveTvKeydown = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	var v_index = parseInt($('.imageFocus').attr("v_index"));
	var h_index = parseInt($('.imageFocus').attr("h_index"));

	var index = parseInt($('.imageFocus').attr("index"));
	
	var id = $('.imageFocus').attr("id");
	var count = parseInt($('.imageFocus').attr("count"));
     var source = $('.imageFocus').attr("source");
     //console.log("liveTvKeydown " + keycode);
     if (Player.getFullscreen()) {
          Keyhandler.liveTvOnFullscreen(keycode);
          return;
     }

	switch (keycode) {
	case tvKeyCode.ArrowLeft: 
          {
               /*
	        if($('#dropdown_id_'+index).is(":visible")){


	        }else{
	            if(source == "liveHeadLine"){


               }
               else if(id == "videoHtml"){
                    $('.imageFocus').removeClass("imageFocus");
                    if(tempIndex)
                         $('#'+tempIndex).addClass("imageFocus");

               }
               else if(source == "arrows"){
                    if(id == "rightLiveArrow"){
                         $('.imageFocus').removeClass("imageFocus");
                         $('#leftLiveArrow').addClass("imageFocus");
                    }
               }

	        }

               */
               if (source == "liveChannels") {

                    $('.imageFocus').removeClass("imageFocus");
                    /*
                    var catId = $("#curCatId").val();
                    $("#" + catId).addClass("imageFocus");
                    view = "sections";
                    */
                    var obj = popState();
                    view = obj.view;
                    $("#" + obj.focus).addClass("imageFocus");
               } else if (source == "cat") {

               }

			break;
		}
	case tvKeyCode.ArrowRight: 
          {
               /*
	            if($('#dropdown_id_'+index).is(":visible")){


    	        }else{
                   if(source == "liveHeadLine"){

                   }
                   else   if(source == "liveChannels"){
                        tempIndex = id;
                        $('.imageFocus').removeClass("imageFocus");
                        $('.player').addClass("imageFocus");
//                        $('#player-wrapper').addClass("imageFocus");
                   }
                   else if(source == "arrows"){
                        if(id == "leftLiveArrow"){
                             $('.imageFocus').removeClass("imageFocus");
                             $('#rightLiveArrow').addClass("imageFocus");
                        }
                   }

               }
			*/
               if (source == "cat") {

               } else if (source == "liveChannels") {

               }

			break;
		}
	case tvKeyCode.ArrowUp: {

            if($('#genericDiv').is(":visible")){
                var idx = $(".imageFocus1").attr("tabindex");
                    if(idx != 0){
                        $("tr").removeClass("imageFocus1");
                        idx--;
                        $("tr[tabindex="+idx+"]").focus();
                        $("tr[tabindex="+idx+"]").addClass("imageFocus1");

                    }else{
                        $("tr[tabindex="+idx+"]").focus();
                        $("tr[tabindex="+idx+"]").addClass("imageFocus1");
                    }

            }else{
                if($('#dropdown_id_'+index).is(":visible")){
                    if($('#add_to_fav_link_'+index).is(":focus") || $('#remove_from_fav_link_'+index).is(":focus")){
                      $('#play_link_'+index).focus();
                    }else if($('#close_menu_link_'+index).is(":focus")){
                        $('#full_epg_menu_link_'+index).focus();
                    }else if($('#full_epg_menu_link_'+index).is(":focus")){
                        $('#add_to_fav_link_'+index).focus();
                        $('#remove_from_fav_link_'+index).focus();
                    }



                }else{

                    if(source == "liveChannels"){
                            if(index > 0){
                                 index --;
                                 $('.imageFocus').removeClass("imageFocus");
                                 if(!$('#liveChannel-'+index).length)
                                      $(".liveDetails").prepend(addChannelRow(index));

                                 $('#liveChannel-'+index).addClass("imageFocus");
                                 $('#liveChannel-'+index).show();

                                 $('#liveChannel-'+(index+numberOfLives+1)).remove();

                                 var stID = $('#liveChannel-'+index).attr("streamid");
                                 if(epgTimer) clearTimeout(epgTimer);
                                 epgTimer = setTimeout(function(){var stID = $('#liveChannel-'+index).attr("streamid");Main.getEPG(stID)},900);


                            }
                       }
                       else{

                         }
                }
            }


			break;
          }
	case tvKeyCode.Enter: {

               if ($('.player_onnum').is(':visible')) {
                    hideChannelNum();
                    break;
               }

			Keyhandler.liveKeyEnter($('.imageFocus'),"keyboard");
			break;
		}
	case tvKeyCode.ArrowDown: {

                 if($('#genericDiv').is(":visible")){
                      var idx = $(".imageFocus1").attr("tabindex");
                        $("tr").removeClass("imageFocus1");
                        idx++;
                        $("tr[tabindex="+idx+"]").focus();
                        $("tr[tabindex="+idx+"]").addClass("imageFocus1");

                      var abc = $(".imageFocus1").attr("tabindex");
                      if(abc===undefined){
                        idx--;
                        $("tr[tabindex="+idx+"]").focus();
                        $("tr[tabindex="+idx+"]").addClass("imageFocus1");

                      }

                }else{
                   if($('#dropdown_id_'+index).is(":visible")){
                                    if($('#play_link_'+index).is(":focus")){
                                          $('#add_to_fav_link_'+index).focus();
                                          $('#remove_from_fav_link_'+index).focus();
                                     }else if($('#add_to_fav_link_'+index).is(":focus") || $('#remove_from_fav_link_'+index).is(":focus")){
                                        $('#full_epg_menu_link_'+index).focus();
                                     }else if($('#full_epg_menu_link_'+index).is(":focus")){
                                        $('#close_menu_link_'+index).focus();
                                     }

                   }else{
                        if(source == "liveChannels"){
                           if(index < count-1){
                                index ++;
                                $('.imageFocus').removeClass("imageFocus");
                                if(!$('#liveChannel-'+index).length){
                                     $('.liveDetails').append(addChannelRow(index));
                                }
                                $('#liveChannel-'+index).addClass("imageFocus");


                                $('#liveChannel-'+index).show();
                                if(index > numberOfLives){
                                     $('#liveChannel-'+(index-(numberOfLives+1))).remove();
                                }
                                var stID = $('#liveChannel-'+index).attr("streamid");

                                if(epgTimer) clearTimeout(epgTimer);
                                epgTimer = setTimeout(function(){var stID = $('#liveChannel-'+index).attr("streamid");Main.getEPG(stID)},900);
                           }
                      } else if(source == "arrows"){
                           $('.imageFocus').removeClass("imageFocus");
                           $('#liveChannel-'+0).addClass("imageFocus");
                      }
                   }
                }



			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return: {
          if ($('.player_onnum').is(':visible')) {
               searchChNum = '';
               hideChannelNum();
               break;
          }

	     
          $("#mainContent").html("");
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
          } catch (e) {}

          Main.processNext();
          Player.close();

          if(reconnectInt !== null || reconnectInt !== undefined){
               clearInterval(reconnectInt);
          }
          counter = 0;
          break;
     }
     case tvKeyCode.ColorF2Yellow:
	     var streamId = parseInt($('.imageFocus').attr("streamId"));
          addToFavLink(streamId, index, $('#liveName-'+index).html(), $('#logo-'+index).attr('src'), $('#liveNum-'+index).html());
          break;
     case tvKeyCode.ColorF0Red:
          var streamId = parseInt($('.imageFocus').attr("streamId"));
          removeFromFavLink(streamId, index);
          break;
     case tvKeyCode.Num0:
     case tvKeyCode.Num1:
     case tvKeyCode.Num2:
     case tvKeyCode.Num3:
     case tvKeyCode.Num4:
     case tvKeyCode.Num5:
     case tvKeyCode.Num6:
     case tvKeyCode.Num7:
     case tvKeyCode.Num8:
     case tvKeyCode.Num9:
          Keyhandler.liveTvOnNumbers(keycode);
          break;
	default: {
			break;
		}
	}
}

Keyhandler.playStreamNumber = function(num) {
     for (var i=0; i<liveSectionDetails.length; i++) {
          if ((''+liveSectionDetails[i].num) === (''+num)) {
               Keyhandler.playStreamIndex(i);
               if (Player.getFullscreen())
                    showLiveInfo();
               break;
          }
     }
}

Keyhandler.playStreamIndex = function(index) {
     if (Player.isPreparing())
          return;
     $(".playing").removeClass("playing");
     $(".imageFocus").removeClass('imageFocus');
     Util.liveDetailsUpdate(index);
     $("#liveChannel-" + index).addClass('imageFocus');
     $("#liveChannel-" + index).addClass('playing');
     playingIndex = index;
     Player.data = liveSectionDetails[index];
     Main.getEPG(liveSectionDetails[index].stream_id);
     currentLiveInfo.channelName = Player.data.name;
     currentLiveInfo.streamId = Player.data.stream_id;
     currentLiveInfo.logo = Player.data.stream_icon;
     currentLiveInfo.chNum = Player.data.num;
     currentLiveInfo.currentProgram = '';
     currentLiveInfo.nextProgram = '';
     currentLiveInfo.curIndex = index;
     currentLiveInfo.nextIndex = currentLiveInfo.curIndex + 1;
     if (liveSectionDetails.length<=currentLiveInfo.nextIndex)
          currentLiveInfo.nextIndex = 0;
     currentLiveInfo.prevIndex = currentLiveInfo.curIndex - 1;             
     if (currentLiveInfo.prevIndex<0)
          currentLiveInfo.prevIndex = liveSectionDetails.length-1;
     Player.type = "live";
     playerLiveIndex = index;
     var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url+":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[index].stream_id+selectedContainer;


     Player.playStream(playUrl,true);
     Player.setStreamId(liveSectionDetails[index].stream_id);
}

//var liveKeyEnterTime = 0;
Keyhandler.liveKeyEnter = function(currFocus,type){
	var index = parseInt(currFocus.attr("index"));
	var streamId = parseInt(currFocus.attr("streamId"));
     //var now = new Date().getTime();

     if (streamId != Player.getStreamId()) {
          if (Player.isPreparing())
               return;
          $(".playing").removeClass("playing");
          $(".imageFocus").addClass('playing');
          var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+streamId+selectedContainer;
          Player.playStream(playUrl, true);
          Player.setStreamId(streamId);
          playingIndex = index;
          Player.data = liveSectionDetails[index];
          Main.getEPG(liveSectionDetails[index].stream_id);
          Player.type = "live";
          playerLiveIndex = index;
          currentLiveInfo.channelName = Player.data.name;
          currentLiveInfo.streamId = streamId;
          currentLiveInfo.logo = Player.data.stream_icon;
          currentLiveInfo.chNum = Player.data.num;
          currentLiveInfo.currentProgram = '';
          currentLiveInfo.nextProgram = '';
          currentLiveInfo.curIndex = index;
          currentLiveInfo.nextIndex = currentLiveInfo.curIndex + 1;
          if (liveSectionDetails.length<=currentLiveInfo.nextIndex)
               currentLiveInfo.nextIndex = 0;
          currentLiveInfo.prevIndex = currentLiveInfo.curIndex - 1;             
          if (currentLiveInfo.prevIndex<0)
               currentLiveInfo.prevIndex = liveSectionDetails.length-1;
     } else {
          /*
          if (now - liveKeyEnterTime < 1000) {
               var keys = Object.keys(Main.getFavChannels());
               if (jQuery.inArray('' + streamId, keys) != -1) {
                    Main.removeFavChannels(streamId);
                    jQuery("#favStar_"+index).removeClass("show");
                    jQuery("#favStar_"+index).addClass("hide");
               } else {
                    Main.addFavChannels(streamId, liveSectionDetails[index]);
                    jQuery("#favStar_"+index).removeClass("hide");
                    jQuery("#favStar_"+index).addClass("show");
               }
               liveKeyEnterTime = 0;
               return;
          }
          */
          fullScreenPlayer();
          if (Player.getFullscreen())
               showLiveInfo();
     }

     //liveKeyEnterTime = now;
}

function fullScreenPlayer(){
     //var fullscreen = jwplayer().getFullscreen();
     var fullscreen = Player.getFullscreen();
     if(fullscreen) {
          fullscreen = false
     } else {
          fullscreen = true;
     }
     AddToFavBoxHidden = true;
     //jwplayer().setFullscreen(fullscreen);
     Player.setFullscreen(fullscreen);
}

function gotoLeftMenu(){
	contentView = view;
	view = "leftMenu";
	homeFocus = $('.imageFocus').attr('id');
	$('.imageFocus').removeClass("imageFocus");
	$('.leftHigh').addClass("imageFocus");
}


Keyhandler.homeKeyEnter = function (currFocus) {
     pinEntered = false;
	var index = parseInt(currFocus.attr("index"));
     if (index == 0)
          return;
     Main.ShowLoading();
	var source = currFocus.attr("source");
	var id = currFocus.attr("id");
     if(id == "logoffTile"){
          pushState(view,$(".imageFocus").attr("id"));
          $('.imageFocus').removeClass("imageFocus");
          view = "exitApp";
          $("#genericDiv").html(Util.showPopUp(2,'Do you want to exit the app?', "آیا می‌خواهید از برنامه خارج شوید؟", "Yes","No"));
          $("#genericDiv").show();
          $("#Btn-0").addClass("imageFocus");
          Main.HideLoading();
          return;
     } else if (id.indexOf("vodMovies") == 0) {
          var vodMovie = recentlyAdded[index - 6];
          vodSectionDetails = recentlyAdded;
          if (vodMovie['is_series']) {
               openedSeriesID2 = index - 6;
               Main.getSeriesPage(vodMovie['series_id']);
          } else {
               openedMovieID2 = index - 6;
               Main.getSingleMovie(vodMovie['stream_id']);
          }
          return;
     }
	if(source == "tiles"){
		if(index == 1){
			Main.getSections("get_live_categories","live");
		}
		else if(index == 2){
			Main.getSections("get_vod_categories","vod");
		}
		else if(index == 3){
			Main.getSections("get_series_categories","series");
          }
          else if(index == 4){
             //Main.getSections("get_live_categories","catchup");
               pushState(view,$(".imageFocus").attr("id"));
               $('.imageFocus').removeClass("imageFocus");
               view = "settings";
               Main.processNext();
          }
          else if(index == 5){
               pushState(view,$(".imageFocus").attr("id"));
			$('.imageFocus').removeClass("imageFocus");
               view = "account";
               Main.processNext();
          }
          else if(index == 6){
               pushState(view,$(".imageFocus").attr("id"));
			$('.imageFocus').removeClass("imageFocus");
               view = "settings";
               Main.processNext();
          }
	}else if(source =="headTiles"){
	    if(id == "switchUserIcon"){
	         pushState(view,$(".imageFocus").attr("id"));
            $('.imageFocus').removeClass("imageFocus");
            view = "listUser";
            Main.processNext();
	    }
	}
}


Keyhandler.listUserKeyhandler = function (e) {
}
Keyhandler.listUserEnter = function (currFocus) {
}




Keyhandler.signInKeyhandler = function (e) {
	var keycode;
	var userAgent = new String(navigator.userAgent);
	if (window.event) {
		keycode = e.keyCode;
	} else if (e.which) {
		keycode = e.which;
	}
	hoverOn = false;
	var source = $('.imageFocus').attr("source");
     var id = $('.imageFocus').attr("id");
     if (source === undefined || id === undefined) {
          $('.imageFocus').removeClass('imageFocus');
          $('#login').addClass('imageFocus');
          return;
     }
	switch (keycode) {
	case tvKeyCode.ArrowLeft: {
		
			if(source == "loginForm"){
				$('.imageFocus').blur();
				$('.imageFocus').removeClass("imageFocus");
				$('#subscribe').addClass('imageFocus');
			}
			break;
		}
	case tvKeyCode.ArrowRight: {
			if(source == "subscribe"){
				$('.imageFocus').removeClass("imageFocus");
				$('#username').addClass('imageFocus');
			}
			break;
		}
	case tvKeyCode.ArrowUp: {
			if (id == "password"){
				$('.imageFocus').blur();
				$('.imageFocus').removeClass("imageFocus");
				$('#username').addClass('imageFocus');
				
			} else if(id == "login"){
				$('.imageFocus').blur();
				$('.imageFocus').removeClass("imageFocus");
				$('#password').addClass('imageFocus');
				
			} else {
                    $('.imageFocus').blur();
				$('.imageFocus').removeClass("imageFocus");
				$('#username').addClass('imageFocus');
               }
			break;
		}
	case tvKeyCode.Enter: {
			Keyhandler.signInEnter($(".imageFocus"));
			break;
		}
	case tvKeyCode.ArrowDown: {
               
			if(id == "name"){
				$('.imageFocus').blur()
				$('.imageFocus').removeClass("imageFocus");
				$('#username').addClass('imageFocus');
				
			}
			else if(id == "username"){
				$('.imageFocus').blur()
				$('.imageFocus').removeClass("imageFocus");
				$('#password').addClass('imageFocus');
				
			}
			else if(id == "password"){
				$('.imageFocus').blur()
				$('.imageFocus').removeClass("imageFocus");
                    $('#login').addClass('imageFocus');
			}
			break;
          }
     case 27:
     case 127:
     case 8:
     case 10009:
	case tvKeyCode.Return:{
	     if(!jQuery('#loading').is(':visible')){
			if(stack.length){
				$("#signIn").hide();
				$("#signIn").html("");
				var obj = popState();
				view = obj.view;
				previousFocus = obj.focus;
				Main.processNext();
               }
               else{
                    pushState(view,$(".imageFocus").attr("id"));
                    $('.imageFocus').removeClass("imageFocus");
                    view = "exitApp";
                    $("#genericDiv").html(Util.showPopUp(2,'Do you want to exit the app?', "آیا می‌خواهید از برنامه خارج شوید؟", "Yes","No"));
                    $("#genericDiv").show();
                    $("#Btn-0").addClass("imageFocus");
                    Main.HideLoading();
               }
			break;
	     }
	}
	default: {
			break;
		}
	}

}

Keyhandler.signInEnter = function(currFocus){
	var id = currFocus.attr("id");

	if(id == "login"){
 	      var port = Main.serverURL;
          if(port.indexOf("http") == -1)
               port = "http://"+port;
          //Main.login(port,$("#username").val(),$("#password").val());
          if($("#username").val() && $("#password").val() && port)
               Main.login(port,$("#username").val(),$("#password").val(),$("#name").val(),"login");
          else
               Main.showFailure("Invalid Details.");
	} 
     else if (id == "subscribe") {
          var target = currFocus.attr("href");
          if (isTizen) {
               var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", target );
               tizen.application.launchAppControl(appControl, null, function(){ console.log("launch appControl succeeded");}, function(e){ console.log("launch appControl failed. Reason: " + e.name); } );
          } else {
               window.open(target);
          }
     }
	else if(id){
          if(keyBoradVisible)
               $("#"+id).blur();
          else
               $("#"+id).focus();
	}

}
