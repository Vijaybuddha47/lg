$(document).ready(function(){
	
	
});
var Generate = {};
Generate.event = function (keyCode) {
	var e = $.Event('keyup');
	e.which = keyCode;
	e.keyCode = keyCode;
	airMouse = true;
	Main.processTrigger(e);
}



/* $(document).on("click","#videoDiv",function(e){
	showPlayerBar();
    playOrPause();
}); */


$(document).on('mousewheel DOMMouseScroll','body', function(event){
	    event.preventDefault();
	    var e = 0;
	    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
	        e = tvKeyCode.ArrowUp;
	    }
	    else {
	        e = tvKeyCode.ArrowDown;
	    }
	    Generate.event(e);
	});
	
	$(document.body).scroll(function(event) {
			event.preventDefault();
		    var e = 0;
		    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		        e = tvKeyCode.ArrowUp;
		    }
		    else {
		        e = tvKeyCode.ArrowDown;
		    }
		    Generate.event(e);
	});
	
	$(document).on("mouseover",'.tab,.catchUpPara,#switchUserIcon,.fullEPGMenuClass,.RemoveFromFavClass,.closeMenuClass,.addToFavClass,.arrowsIcon,.listCenterButton,.popUpBtn,.termsBtn,.player,.rowSec,.settingsTile,.accountBtn ,#addUserBtn,.listIcons ,.orange-button,.login-btn,#listUsersBtn ,.btnCust,.episode,.relatedM,.playForwardF,.play-icon,.playRewind,.playForward,.playRewindR,.playSingle,#homeLiveTile,#moviesTile,#seriesTile,#listUser,#accountTile,#settingTile,.section,.shows-image',function(e){
        
		var id = $(this).attr("id");
		var classVar = $(this).attr("class");
        if(classVar == "addToFavClass" || classVar =="closeMenuClass" || classVar =="RemoveFromFavClass" || classVar =="fullEPGMenuClass"){
               $('.playLinkClass').blur();
         }
        if(id == "videoHtml"){
            $(".imageFocus").removeClass("imageFocus");
            $(".playing").addClass("imageFocus");

        }else{
            if(id){
        			//$('.imageFocus').blur();
        			$(".imageFocus").removeClass("imageFocus");

                       $("#" + id).addClass("imageFocus");

                       if(classVar == "listIcons"){
                           $(".dropdown-content").removeClass("hide");
                           $(".dropdown-content").removeClass("show");
                       }
                       if(id == "seasonSelector"){
                            if($("#seasonSelector").text() != "No Episodes Found.")
                            TweenMax.to($(".singleRow"), 0.4, {
                                 top : -380,
                                 ease : Power1.easeInOut
                            });
                       }
                       else if(id == "btnPlayMovie"){
                            TweenMax.to($(".singleRow"), 0.4, {
                                 top : 0,
                                 ease : Power1.easeInOut
                            });
                       }
        	}
        }

           
	});

	/*$(document).on("mouseover",'',function(e){
        
		var id = $(this).attr("id");
		try{
			$('#email').blur();$('#password').blur();
		}
		catch(e){

		}
        if(id){
			$(".mouseFocus").removeClass("mouseFocus");
			
			$("#" + id).addClass("mouseFocus");
		}
           
     });*/
     
     $(document).on("click",".signin,.login-btn,#listUsersBtn",function(e){
          var id = $(this).attr("id");
          e.preventDefault();
          if(id == "login"){
               var port = $("#port").val();
//               var port = Main.serverURL;
               var username = $("#username").val();
               var pwd = $("#password").val();
               if(port && username && pwd){
                    if(port.indexOf("http") == -1)
                    port = "http://"+port;
                    //Main.login(port,$("#username").val(),$("#password").val());
                    Main.getAuth(port,$("#username").val(),$("#password").val(),$("#name").val());
               }
               else{
                    Main.showFailure("Invalid Details.<br/> Please provide valid login credentials.");
               }

               
          }
          else if(id == "listUsersBtn"){
               pushState(view,$('.imageFocus').attr("id"));
               $('.imageFocus').removeClass("imageFocus");
               view = "listUser";
               hideValues();
               $("#mainContent").html(Util.listUserPage());
               $("#mainContent").show();
          }
          else{
               if(id){
                    $('.imageFocus').blur();
                    $('.imageFocus').removeClass("imageFocus");
                    $(this).addClass("imageFocus");
                    $(this).focus();
               }
               
          }
     });


     var keyBoradVisible = false;
     function keyboardVisibilityChange(event) {
          var visibility = event.detail.visibility;
          if(visibility){
               keyBoradVisible = true;
          }
          else{
               keyBoradVisible = false;
          }
      }
      document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);




	$(document).on("click",'.catchUpPara,#navlist li a,#switchUserIcon,#confirmPin,.listCenterButton,.popUpBtn,.termsBtn,.player,.rowSec,.settingsTile,.accountBtn ,#addUserBtn,.listIcons ,.orange-button,.btnCust,.episode,.relatedM,.playForwardF,.play-icon,.playRewind,.playForward,.playRewindR,.playSingle ,#homeLiveTile,#moviesTile,#seriesTile,#listUser,#accountTile,#settingTile,.section,.shows-image',function(e){
		var id = $(this).attr("id");
		var source = $('.imageFocus').attr("source");
		var role = $('.imageFocus').attr("role");

          e.preventDefault();
//          alert("ASDFAS");
//alert("id: "+id);
//          alert(view);
		/* if(id && id.indexOf("leftMenu") != -1){
			Keyhandler.menuKeyEnter($('.mouseFocus'));
		}
		else{
			if(view == "leftMenu"){
				viewIndex = contentView;
			}
			else{
				viewIndex = view;
			}
		} */
        switch(view){

            case "homePage":{
            		$("#genericDiv").html('');
            		$("#genericDiv2").html('');
            		$("#HTML5Div").html('');
					Keyhandler.homeKeyEnter($('.imageFocus'));
				break;
               }
               case "sections":{
                    Keyhandler.sectionEnter ($(".imageFocus"));
                    break;
               }
               case "liveCatchupChannels":{
                    Keyhandler.liveCatchupChannelsEnter ($(".imageFocus"));
                    break;
               }


               case "vodMovies":{
                    Keyhandler.vodMovieKeyEnter($('.imageFocus'));
                    break;
               }
               case "settings":
               case "account":{ Keyhandler.accountKeyEnter($('.imageFocus'));break;}
			case "singleMovie":{
                    if(source != "favButton"){
                        Keyhandler.singleMovieKeyEnter($(".imageFocus"));
                    }
                    break;
                    }
			case "terms":{ Keyhandler.descKeyEnter();break; }
			case "signIn":{$('#email').blur();$('#password').blur();Keyhandler.signInEnter($('.imageFocus'));;break;}
			case "liveChannels":{ Keyhandler.liveKeyEnter($('.imageFocus'),"mouse");break;}
			case "timeZone":{Keyhandler.timeZoneListEnter($('.mouseFocus'));;break;}
			case "seasonsList":{Keyhandler.seasonsListEnter($(".imageFocus"));;break;}
			case "liveTvDetail":{Keyhandler.liveTvDetailKeyEnter($('.mouseFocus'));;break;}
			case "live":{Keyhandler.liveKeyEnter($('.mouseFocus'));;break;}
			case "tvShows":{Keyhandler.tvShowsKeyEnter($('.mouseFocus'));;break;}
			case "tvshowDetails":{
				if(source != "favButton")
					Keyhandler.tvshowDetailsKeyEnter($(".imageFocus"));
				break;
			}
			case "settingSection":{ Keyhandler.settingSectionKeyEnter($(".imageFocus")); break;}
			case "parentalPinSettings":{ Keyhandler.settingSectionKeyEnter($(".imageFocus")); break;}
			case "parentalTurnOff":{ Keyhandler.settingSectionKeyEnter($(".imageFocus")); break;}
			case "profile":{Keyhandler.profileEnter($('.imageFocus'));;break;}
			case "listUser":{Keyhandler.listUserEnter($(".imageFocus"));;break;}
			case "search":break;
			case "exitApp":{Keyhandler.exitKeyEnter($(".imageFocus"));break;}
			case "deleteUser":{Keyhandler.deleteKeyEnter($(".imageFocus"));break;}
			case "player":{Player.playEnterKeydown($('.imageFocus'));;break;}
			case "enterPin":{
			   if(id == "confirmPin"){
			   			   Keyhandler.enterPinKeyEnter($('.mouseFocus'));

			   }break;

			}
			case "enterPinMovies":{
               if(id == "confirmPin"){
                           Keyhandler.enterPinMoviesKeyEnter($('.mouseFocus'));

               }break;

            }

            case "enterPinSeries":{
               if(id == "confirmPin"){
                           Keyhandler.enterPinSeriesKeyEnter($('.mouseFocus'));

               }break;

            }
            case "enterPinMoviesCategories":{
               if(id == "confirmPin"){
                           Keyhandler.enterPinMoviesCategoriesKeyEnter($('.mouseFocus'));

               }break;

            }

            case "liveCatchupPrograms":{
                    if(role =="catchupSection"){
                            Keyhandler.liveCatchupProgramsEnter ($(".imageFocus"));
                    }else{
                            setActiveAndInactive(this, $('#navlist'));
                    }
                   break;
            }




//            enterPinSeries

//			case "seriesPlayer":{Keyhandler.tvshowDetailsKeyEnter($(".imageFocus"));;break;}

			case "popUp":{
				
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
               ;break;
               }
			case "logout":{
				var index = parseInt($(this).attr("index"));
				if(index == 0){
					pushState(view,$(".imageFocus").attr("id"));
					Main.logOut();
				}
				else{
					
					$("#customMessage").hide();
					$("#customMessage").html('');
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
				break;
			}
			case "exitApp":{
				Keyhandler.exitKeyEnter($('.mouseFocus'));
				break;
			}

			
		}
           
	});
	
	function cursorVisibilityChange(event) {
		var visibility = event.detail.visibility;
		if(visibility){
			console.log("Cursor appeared");
		
			showArrows();
		}
		else{
			console.log("Cursor disappeared");
			hideArrows();
		}
	}
	document.addEventListener('cursorStateChange', cursorVisibilityChange, false);


	$(document).on('mousemove','body',function(e){
    	if(view != ""){
    		if($('#leftArrow').css('display')!= 'block')
			{
				arrowsTimeOut = setTimeout(function() {
					if($('#leftArrow').css('display')== 'block')
						hideArrows();   
					clearInterval(arrowsTimeOut);
				},6000);

				showArrows();
			}
                   
    	}
    });


	$(document).on("mouseover",'#downArrow,#upArrow,#leftArrow,#rightArrow,#backArrow',function(){
		$(this).css("opacity",'1');
	});
	$(document).on("mouseout",'#downArrow,#upArrow,#leftArrow,#rightArrow,#backArrow',function(){
		$(this).css("opacity",'0.5');
	});
    

     

	$(document).on("click","#leftArrow",function(e){
		e = tvKeyCode.ArrowLeft;
		Generate.event(e); 
	});

	$(document).on("click","#upArrow",function(e){
		e = tvKeyCode.ArrowUp;
		Generate.event(e); 
	});

	$(document).on("click","#downArrow",function(e){
		e = tvKeyCode.ArrowDown;
		Generate.event(e); 
	});

	$(document).on("click","#rightArrow",function(e){
		e = tvKeyCode.ArrowRight;
		Generate.event(e); 
	});

	$(document).on("click","#backArrow",function(e){
		e = tvKeyCode.Return;
		Generate.event(e); 
	});




	function showArrows() {
		if(view != "player"){
			$("#leftArrow").fadeIn();
			$("#rightArrow").fadeIn();
			$("#upArrow").fadeIn();
			$("#downArrow").fadeIn();
		}
		$("#backArrow").fadeIn();
	
	}
	function hideArrows() {
		$("#leftArrow").fadeOut();
		$("#rightArrow").fadeOut();
		$("#upArrow").fadeOut();
		$("#downArrow").fadeOut();
		$("#backArrow").fadeOut();
	}