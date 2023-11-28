var Main = {
	BOXID:"",
	country:"",
	offset:"",
	unixTime:"",
	profile : {},
     watchListData : '',
     tvVersion: '0.0',
     getLatestAddedScript: '/latestadded.php',
     primaryServerURL: 'http://tamasha-tv.com:25461',
     backupServerURL: 'http://tamasha.me:25461',
     serverURL : 'http://tamasha-tv.com:25461',
     backupServerSelected: false,
     //serverURL : 'http://192.168.1.224:25461',
     domain:"",
     screenWidth: screen.width,
     screenHeight: screen.height,
     resolutionWidth: screen.width,
     resolutionHeight: screen.height,
     dotsPerInchWidth: 0,
     dotsPerInchHeight: 0,
     physicalWidth: 0,
     physicalHeight: 0,
     currentUserLogin: {},
     dateTimeLoggedIn: "",
     timestampLoggedIn: 0,
     serverTimeDifference: 0,
	getDeviceID:function(){
		if (device && device.uuid) {
			return device.uuid;
		} else {
			return getBOXDetails();
		}
	},
	initialize:function(){
		//Main.showSplash();
		//console.log('Main.initialize');
          try {
               if (isTizen) {
                    var value = webapis.tvinfo.getVersion();
                    console.log("version value = " + value);
                    app.sendlog("version value = " + value);
                    this.tvVersion = value;
                    
                    tizen.systeminfo.getPropertyValue('DISPLAY', function(result) {
                         /*
                         if (parseInt(result.physicalWidth) < 800) {
                              Main.screenWidth = 960;
                              Main.screenHeight = 720;
                         } else {
                              Main.screenWidth = result.resolutionWidth;
                              Main.screenHeight = result.resolutionHeight;
                         }
                         */
                         //Main.screenWidth = result.resolutionWidth;
                         //Main.screenHeight = result.resolutionHeight;
                         //Main.resolutionWidth = result.resolutionWidth;
                         //Main.resolutionHeight = result.resolutionHeight;
                         Main.physicalWidth = result.physicalWidth;
                         Main.physicalHeight = result.physicalHeight;
                         Main.dotsPerInchWidth = result.dotsPerInchWidth;
                         Main.dotsPerInchHeight = result.dotsPerInchHeight;

                    });
               }
               
               var radioValue = window.localStorage.getItem("portal");
               if (radioValue == null || radioValue === 'main') {
                    Main.backupServerSelected = false;
                    Main.serverURL = Main.primaryServerURL;
               } else if (radioValue === 'backup') {
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               }
          } catch (error) {
               //console.log("error code = " + error.code);
               //app.sendlog("error code = " + error.code);
               console.log("error code = ", error);
               app.sendlog("exception " + JSON.stringify(error));
          }

          Main.BOXID = Main.getDeviceID();
          //console.log(Main.BOXID);
          if(window.localStorage.getItem("profile") !== null) {

               Main.profile = JSON.parse(window.localStorage.getItem("profile"));
               Main.login(Main.serverURL, Main.profile.user_info.username, Main.profile.user_info.password, "tamasha", "login");
          } else {
               view = "signIn";
               /*pushState(view, '');
               sectionData = [];
               sectionData[0] = {category_id: "ALL", category_name: "ALL", parent_id: 0};
               sectionData.type = "get_vod_categories";
               sectionData.sectionType = "vod";
               view = "sections";*/
               Main.processNext();
               //$(".imageFocus").removeClass('imageFocus');
               //$("#cat1").addClass('imageFocus');
               //Keyhandler.sectionEnter($("#cat1"));
          }

	},
	showSplash: function(){
		//console.log('Main.showSplash');
		$("#splashContent").css("display", "block");
		$("#splashContent").html(Util.splashHtml());
	},
	hideSplash : function () {
		//console.log('Main.hideSplash');
		$("#splashContent").hide();
	}
};

var homeLiveData = '',previousView = '';

var selectedContainer = '.ts';
var openedMovieID = '';
var openedSeriesID = '';
var openedMovieID2 = '';
var openedSeriesID2 = '';
var openedMovieCatID = '';
var openedSectionAction ='';
var fullEPGKeyboardOpened = false;
var searchWords = '';
var searchChNum = '';
var allChannels = {};
var allLiveCats = [];

var currentCatchupInfo = {
     channelName : '',
     streamId : -1,
     programName : '',
     duration : 0,
     startTime : 0,
     endTime: 0,
     logo: '',
     chNum: -1,
     programDesc: ''
};

var currentVodInfo = {
     isSeries: false,
     title: '',
     plot: '',
     actors: '',
     serieName: '',
     episodeNum: '',
     seasonNum: '',
     vodId: -1,
     cover: ''     
};

var currentLiveInfo = {
     channelName: '',
     streamId: -1,
     currentProgram: '',
     nextProgram: '',
     logo: '',
     chNum: -1,
     curIndex: 0,
     nextIndex: 0,
     prevIndex: 0
};

/*
if(window.localStorage.getItem("screenHeight") !== null) {
     var sh = window.localStorage.getItem("screenHeight");
     if (sh === '720') {
          Main.screenWidth = 960;
          Main.screenHeight = 720;
     } else if (sh === '1080') {
          Main.screenWidth = 1920;
          Main.screenHeight = 1080;
     } else if (sh === '2160') {
          Main.screenWidth = 3840;
          Main.screenHeight = 2160;
     }
}
*/

if(window.localStorage.getItem("selectedContainer") !== null)
     selectedContainer = window.localStorage.getItem("selectedContainer");

var parentPin = '';
if(window.localStorage.getItem("parentPin") !== null){
     parentPin = window.localStorage.getItem("parentPin");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
var stack = [];
Main.ShowLoading = function () {
	

};

Main.HideLoading = function () {
     document.getElementById("loading").style.display = "none";     
};
Main.ShowLoading2 = function () {
	document.getElementById("loading").style.display = "block";
};

device = {

};
var mainPlayUrl = '';
var callBack = '';
var cookieBoxNo = null;
var cookieSupported = false;
var view = '';
var deleteBoxPosition = '';
var Generate = {},previousFocus = '';;
Generate.event = function (keyCode) {
	var e = $.Event('ke$');
	e.which = keyCode;
	e.keyCode = keyCode;
	airMouse = true;
	Main.processTrigger(e);
};
function hideValues (){
	$("#SingleMoviePage").hide();
	$("#mainContent").hide();
	$("#signIn").hide();
     $("#customMessage").hide();
     $("#channelContent").hide();
     $("#profile").hide();
     $("#notification").hide();
     $("#genericDiv").hide();
     $("#genericDiv2").hide();
	homeFocus = '';
}

Main.getFavChannels = function() {
     var item = window.localStorage.getItem("TamashaFavChannels");
     if (item != null && item !== undefined)
          return JSON.parse(item);

     return {};
};

Main.addFavChannels = function(stream_id, data) {
     var favs = Main.getFavChannels();
     favs[stream_id + ''] = data;
     window.localStorage.setItem("TamashaFavChannels", JSON.stringify(favs));
};

Main.removeFavChannels = function(stream_id) {
     var favs = Main.getFavChannels();
     delete favs[stream_id + ''];
     window.localStorage.setItem("TamashaFavChannels", JSON.stringify(favs));
};

Main.getFavMovies = function() {
     var item = window.localStorage.getItem("TamashaFavMovies");
     if (item != null && item !== undefined)
          return JSON.parse(item);

     return {};
};

Main.addFavMovies = function(stream_id, data) {
     var favs = Main.getFavMovies();
     favs[stream_id + ''] = data;
     window.localStorage.setItem("TamashaFavMovies", JSON.stringify(favs));
};

Main.removeFavMovies = function(stream_id) {
     var favs = Main.getFavMovies();
     delete favs[stream_id + ''];
     window.localStorage.setItem("TamashaFavMovies", JSON.stringify(favs));
};

Main.getFavSeries = function() {
     var item = window.localStorage.getItem("TamashaFavSeries");
     if (item != null && item !== undefined)
          return JSON.parse(item);

     return {};
};

Main.addFavSeries = function(stream_id, data) {
     var favs = Main.getFavSeries();
     favs[stream_id + ''] = data;
     window.localStorage.setItem("TamashaFavSeries", JSON.stringify(favs));
};

Main.removeFavSeries = function(stream_id) {
     var favs = Main.getFavSeries();
     delete favs[stream_id + ''];
     window.localStorage.setItem("TamashaFavSeries", JSON.stringify(favs));
};

Main.showSuccess = function (msg) {

	if (view != "popUp")
		pushState(view, $(".imageFocus").attr("id"));
	view = "popUp";
	$("#customMessage").show();
	$("#customMessage").html(Util.showStatusPopUp(1, msg, "OK"));
};
Main.showFailure = function (msg) {
	var status = navigator.onLine;

	if (status == false) {
		if (view != "popUp")
			pushState(view, $(".imageFocus").attr("id"));

		view = "popUp";
		$("#customMessage").show();

		if (navigator.connection.type && navigator.connection.type.toUpperCase() != "NONE" && navigator.connection.type.toUpperCase() != "UNKNOWN")
			$("#customMessage").html(Util.showPopUpMessage(1, "Trouble connecting to Internet using " + navigator.connection.type.toUpperCase() + ", please Try again.", "", "Okay"));
		else
			$("#customMessage").html(Util.showPopUpMessage(1, "Trouble connecting to Internet, please Try gain.", "", "Okay"));

		Main.HideLoading();
		/*callBack = function () {
			location.reload();
		}*/
	} else {
		if (view != "popUp")
			pushState(view, $(".imageFocus").attr("id"));
		view = "popUp";
		$("#customMessage").show();
		if (!msg)
			$("#customMessage").html(Util.showStatusPopUp(0, "Something went wrong", "OK"));
		else
			$("#customMessage").html(Util.showStatusPopUp(0, msg, "OK"));
		Main.HideLoading();
	}

};
Main.showMessage = function(msg){
	$("#customMessage").show();
	$("#customMessage").html("<div id='showMessage'>"+msg+"</div>");
};
Main.showInfo = function (msg) {
	if (view != "popUp")
		pushState(view, $(".imageFocus").attr("id"));
	view = "popUp";
	$("#customMessage").show();
	$("#customMessage").html(Util.showStatusPopUp(2, msg, "OK"));
};
Main.processNext = function (event) {

	switch (view) {

	case "liveCatchupChannels":{
          hideValues();
        if(previousFocus){
            $('#'+previousFocus).addClass("imageFocus");
            previousFocus = '';
        }
          Main.HideLoading();
         break;
     }
	case "homePage": {
		hideValues();
		stack = [];

		if(previousFocus){


			if(previousFocus == 'listUser' &&  $("#listUser").length == 0){
                $("#mainContent").html(Util.gridHomePage());
                $("#mainContent").show();
                $('.imageFocus').removeClass("imageFocus");
                $('#listUser').addClass("imageFocus");
			    previousFocus = '';
			}else if(previousFocus == 'moviesTile' &&  $("#moviesTile").length == 0){
                $("#mainContent").html(Util.gridHomePage());
                $("#mainContent").show();
                $('.imageFocus').removeClass("imageFocus");
                $('#moviesTile').addClass("imageFocus");
                previousFocus = '';
            }else if(previousFocus == 'seriesTile' &&  $("#seriesTile").length == 0){
                $("#mainContent").html(Util.gridHomePage());
                $("#mainContent").show();
                $('.imageFocus').removeClass("imageFocus");
                $('#seriesTile').addClass("imageFocus");
                previousFocus = '';
            }else if(previousFocus == 'homeLiveTile' &&  $("#homeLiveTile").length == 0){
                $("#mainContent").html(Util.gridHomePage());
                $("#mainContent").show();
                $('.imageFocus').removeClass("imageFocus");
                $('#homeLiveTile').addClass("imageFocus");
                previousFocus = '';
            }else if(previousFocus == 'switchUserIcon' &&  $("#switchUserIcon").length == 0){
                 $("#mainContent").html(Util.gridHomePage());
                 $("#mainContent").show();
                 $('.imageFocus').removeClass("imageFocus");
                 $('#switchUserIcon').addClass("imageFocus");
                 previousFocus = '';
            }else{
			    $('#'+previousFocus).addClass("imageFocus");
                $("#mainContent").show();
                previousFocus = '';
			}

		}
		else{
			previousFocus = '';
			$("#mainContent").html(Util.gridHomePage());
			$("#mainContent").show();
		}

		break;
     }
     case "terms":{
          Main.hideSplash();
          $("#customMessage").html(Util.TermsPopUp(1,'Terms of Use (EULA)',termsData, "Accept",""));
		$("#customMessage").show();
          break;
     }
     case "account":{
          hideValues();
          if(previousFocus){
			$('#'+previousFocus).addClass("imageFocus");
			$("#account").show();
			previousFocus = '';
		}
		else{
			$("#account").html( Util.accountPage());
			$("#account").show();
          }
          Main.HideLoading();
         break;
     }
     case "settings":{
          hideValues();
          if(previousFocus){
			$('#'+previousFocus).addClass("imageFocus");
			$("#profile").show();
			previousFocus = '';
		}
		else{
			$("#profile").html(Util.settingsPage());
			$("#profile").show();
          }
          Main.HideLoading();
         break;
     }
     case "parentalPinSettings":{
               hideValues();
             if(previousFocus){
     			$('#'+previousFocus).addClass("imageFocus");
     			$("#genericDiv").show();
     			previousFocus = '';
     		}
     		else{
     			selectSetting = "parentControl";
     			$("#genericDiv2").html(Util.settingSection());
                $("#genericDiv2").show();
               }
               Main.HideLoading();
              break;
       }

       case "seriesPlayer":{
                      hideValues();
//                      alert("aa");
//                    if(previousFocus){
//            			$('#'+previousFocus).addClass("imageFocus");
//            			$("#genericDiv").show();
//            			previousFocus = '';
//            		}
//            		else{
//            			selectSetting = "parentControl";
//            			$("#genericDiv2").html(Util.settingSection());
//                       $("#genericDiv2").show();
//                      }
//                      Main.HideLoading();
                     break;
              }
       case "parentalTurnOff":{
                      hideValues();
                    if(previousFocus){
            			$('#'+previousFocus).addClass("imageFocus");
            			$("#genericDiv").show();
            			previousFocus = '';
            		}
            		else{
            			selectSetting = "parentControlTurnOff";
            			$("#genericDiv2").html(Util.settingSection());
                       $("#genericDiv2").show();
                      }
                      Main.HideLoading();
                     break;
              }
     case "tvShows":
     case "vodMovies":{
          $('.imageFocus').removeClass("imageFocus");
          hideValues();
          if(previousFocus){
			$('#'+previousFocus).addClass("imageFocus");
			//$("#mainContent").show();
               $("#channelContent").show();
			previousFocus = '';
		}
		else{

			$("#mainContent").html(Util.listUserPage());
			$("#mainContent").show();

		}

          break;
     }
	case "listUser":{

		$('.imageFocus').removeClass("imageFocus");
		hideValues();
		contentView = view;
		if(previousFocus){
			$('#'+previousFocus).addClass("imageFocus");
			$("#mainContent").show();
			previousFocus = '';
		}
		else{

			$("#mainContent").html(Util.listUserPage());
			$("#mainContent").show();

          }
          Main.HideLoading();
		break;
	}
	case "tvShows_old": {
		hideValues();
		stack = [];
		contentView = view;
		if(previousFocus && previousFocus.indexOf("tvShow") != -1){
		if(previousFocus.indexOf("leftMenu") != -1)
			view  = "leftMenu";
			$('#'+previousFocus).addClass("imageFocus");
			//$("#mainContent").show();
               $("#channelContent").show();
			previousFocus = '';
		}
		else{
		/* 	if(topMenu["tv"]){
				Main.gettvShowSections(topMenu["tv"][0].id);
			}
			else{ */
				Main.getTopMenu("tv");
			//}
			previousFocus = '';

		}
		break;
	}
	case "liveChannels":{
		hideValues();

		if(previousFocus){

			$('#'+previousFocus).addClass("imageFocus");
			$("#mainContent").show();
			previousFocus = '';
		}
		else{
               if (Player.isPreparing())
                    break;
               $("#mainContent").html('');
               $(".imageFocus").removeClass("imageFocus");
               $("#mainContent").html(Util.liveDetailsPage());
               $("#liveChannel-0").addClass('imageFocus');
               $("#liveChannel-0").addClass('playing');
               playingIndex = 0;
               $("#mainContent").show();
               playerLiveIndex = 0;
               Main.getEPG(liveSectionDetails[0].stream_id);
               Player.data = liveSectionDetails[0];
               Player.type = "live";
               currentLiveInfo.channelName = Player.data.name;
               currentLiveInfo.streamId = Player.data.stream_id;
               currentLiveInfo.logo = Player.data.stream_icon;
               currentLiveInfo.chNum = Player.data.num;
               currentLiveInfo.currentProgram = '';
               currentLiveInfo.nextProgram = '';
               currentLiveInfo.curIndex = 0;
               currentLiveInfo.nextIndex = currentLiveInfo.curIndex + 1;
               if (liveSectionDetails.length<=currentLiveInfo.nextIndex)
                    currentLiveInfo.nextIndex = 0;
               currentLiveInfo.prevIndex = currentLiveInfo.curIndex - 1;             
               if (currentLiveInfo.prevIndex<0)
                    currentLiveInfo.prevIndex = liveSectionDetails.length-1;

               var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.user_info.login_url+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[0].stream_id+".ts";

               if(!selectedContainer)
                         playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.user_info.login_url+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[0].stream_id+".ts";
                    else
                         playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.user_info.login_url+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[0].stream_id+selectedContainer;


               Player.playStream(playUrl,true);
               Player.setStreamId(liveSectionDetails[0].stream_id);
               //Main.getLiveStream(liveSectionDetails[0].stream_id);
		}
		break;
	}
	case "signIn":{
		hideValues();
		Main.hideSplash();
		$('.imageFocus').removeClass("imageFocus");
		$("#signIn").html(Util.signIn());
		$("#signIn").show();
		Main.HideLoading();
		break;
	}
	case "tvShowDetail":{
          hideValues();
		contentView = view;
		if(previousFocus){
			if(previousFocus.indexOf("leftMenu") != -1)
				view  = "leftMenu";
			$('#'+previousFocus).addClass("imageFocus");
			$("#SingleMoviePage").show();
			previousFocus = '';
		}

		break;
	}
	case "sections":{
          contentView = view;
          hideValues();
		if(previousFocus){
			$('#'+previousFocus).addClass("imageFocus");
			$("#channelContent").show();
			previousFocus = '';
		}else{
			$("#channelContent").html(Util.listSectionPage(sectionData));
			$("#channelContent").show();
		}
		break;
	}
	case "liveTvDetail":{
		contentView = view;
		if(previousFocus){
			if(previousFocus.indexOf("leftMenu") != -1)
				view  = "leftMenu";
			$('#'+previousFocus).addClass("imageFocus");
			$("#SingleMoviePage").show();
			previousFocus = '';
		}
		Main.HideLoading();
		break;
     }
     case "settingSection":{
          if(previousFocus){

			$('#'+previousFocus).addClass("imageFocus");
			$("#genericDiv").show();
			previousFocus = '';
		}
		else{
		     $("#genericDiv2").html('');
               $("#profile").hide();
               $("#genericDiv").html(Util.settingSection());
               $("#genericDiv").show();
		}
          break;
     }
     case "tvEpisodes":
          $("#SingleMoviePage").hide();
          $(".imageFocus").removeClass("imageFocus");
          $("#episodesDiv").html(Util.tvEpisodes(seriesPage.info.name, openedSeriesID,seriesPage.episodes, seriesPage.info.cover));
          $("#episodesDiv").show();
          break;
     case "enterPin":{

          break;
     }
	case "singleMovie":{
          hideValues();
		if(previousFocus){
			//if(previousFocus.length > "leftMenu".length && previousFocus.indexOf("leftMenu") != -1)
			//     view  = "leftMenu";
			//$('#'+previousFocus).addClass("imageFocus");
               previousFocus.addClass("imageFocus");
			$("#SingleMoviePage").show();
			previousFocus = '';
		}
		else{
               $("#SingleMoviePage").html(Util.singleMovie());
               $("#SingleMoviePage").show();

		}

		break;
	}
	case "player":{
          if (Player.isPreparing())
               break;
		$('.imageFocus').removeClass("imageFocus");
		$("#SingleMoviePage").hide();
          $("#mainContent").hide();
          Player.data = null;
          Player.type = 'movies';
          Player.playStream();
          Player.setStreamId(-1);
		break;
     }
     case "tvshowDetails":{
          hideValues();
          if(previousFocus){
               previousFocus.addClass("imageFocus");
               previousFocus = '';   
               $("#SingleMoviePage").show();
          }
          else{
               $("#SingleMoviePage").html(Util.tvShowDetails());   
               $("#SingleMoviePage").show();
          }
          break;
     }
	case "search":{
          hideValues();
		if(previousFocus){
			$('#'+previousFocus).addClass("imageFocus");previousFocus = '';
		}
		$("#mainContent").show();
		$("#SingleMoviePage").hide();
		$("#SingleMoviePage").html();
		break;
	}
     case "playerEnded" : {
          try {
               var obj = popState();
               view = obj.view;
               previousFocus = obj.focus;
               //previousFocus = '';
          } catch (e) {}
          Player.close();

          if (view == "tvEpisodes") {
               var showPopup = false;
               var count = parseInt($('.imageFocus').attr("count"));

               var v_index = parseInt(previousFocus.attr("v_index"));
               var h_index = parseInt(previousFocus.attr("h_index"));
               var currFocus;
               if(h_index < numberOfEpisodes-1){
                    h_index++;
                    currFocus = $('#serMovies-'+v_index+"-"+h_index);
                    var season = currFocus.attr("season");
                    var index = currFocus.attr("index");
                    if (season !== undefined && index !== undefined)
                         showPopup = true;
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
                         var season = currFocus.attr("season");
                         var index = currFocus.attr("index");
                         if (season !== undefined && index !== undefined)
                              showPopup = true;
                    }
               }

               if (showPopup) {
                    showMovieInfo2(false);
                    pushState(view, previousFocus);
                    $('.imageFocus').removeClass("imageFocus");
                    view = "episodeEnd";
                    var season = currFocus.attr("season");
                    var index = currFocus.attr("index");
                    var title = seriesPage.episodes[season][index].title;
                    if (title === undefined) {
                         title = seriesPage.info.name;
                    } else {
                         if (title.indexOf(seriesPage.info.name) == -1 || title.length < 10) {
                              title = seriesPage.info.name + ' - ' + title;
                         }
                    }
                    $("#genericDiv").html(Util.showEpisodePopUp(2,title,seriesPage.info.cover, "Yes","No"));
                    $("#genericDiv").show();
                    $("#Btn-0").addClass("imageFocus");
                    break;
               }

               $('#HTML5Div').hide();
               previousFocus.addClass("imageFocus");
               $("#episodesDiv").show();
          } else if (view == "singleMovie") {
               $('#HTML5Div').hide();
               hideValues();
               if(previousFocus){
                    previousFocus.addClass("imageFocus");
                    $("#SingleMoviePage").show();
                    previousFocus = '';
               }
               else{
                    $("#SingleMoviePage").html(Util.singleMovie());
                    $("#SingleMoviePage").show();
               }
          }
          break;
     }
	}
};
Main.updateEpisodes = function(seasonID){
     var Text = '';

     var keys = Object.keys(seriesPage.episodes);
     if(seriesPage.episodes[seasonID]){
          var data = seriesPage.episodes[seasonID];
          for(var i = 0;i < data.length;i++){
               Text += '<div class="">'
               Text += Util.tvEpisode(data[i],i,data.length);
               Text += '</div>'
          }
          $("#relatedSeries").html(Text);
          $("#seasonSelector").text("Season - "+(seasonID));
          $("#seasonSelector").addClass("imageFocus");
          tvEPSIndex = 1;
     }
     else{
          Main.showFailure("No episodes available.");
     }

};

Main.ShowMenu = function(season){
	if (view != "seasonsList")
		pushState(view, $(".imageFocus").attr("id"));
	$(".imageFocus").removeClass("imageFocus");
	view = "seasonsList";
	$("#customMessage").show();
	$("#customMessage").html(Util.showMenuPopUp(season,seriesPage.episodes,"Season"));
};


Main.processTrigger = function (event) {
	$('.mouseFocus').removeClass('mouseFocus');
//	alert(view);
     console.log("processTrigger " + view);
     app.sendlog("processTrigger " + view);
     var keycode = -1;
	if (window.event) {
		keycode = event.keyCode;
	} else if (event.which) {
		keycode = event.which;
     }
     console.log("Keycode=" + keycode);
     app.sendlog("Keycode=" + keycode);
     //app.sendcmd("/key:193D0990FE2F:"+keycode);
	if (true) {
		switch (view) {
          case "youtubeTrailer":
               Keyhandler.youtubeKeyhandler(event);
               break;
		case "listUser":{
			Keyhandler.listUserKeyhandler(event);
			break;
          }
          case "account":{
               Keyhandler.accountKeyhandler(event);
               break;
          }
          case "settings":{
               Keyhandler.settingsKeyhandler(event);
               break;
          }
          case "settingSection":{
               Keyhandler.settingSectionKeyhandler(event);
               break;
          }
          case "parentalPinSettings":{
                 Keyhandler.parentalPinSettingsKeyhandler(event);
                 break;
            }
          case "parentalTurnOff":{
             Keyhandler.parentalPinTurnOffKeyhandler(event);
             break;
          }
          case "seriesPlayer":{
             Keyhandler.seriesPlayerKeyHandler(event);
             break;
          }
           case "catchupPlayer":{
               Keyhandler.catchupPlayerKeyHandler(event);
               break;
            }


		case "homePage": {
				Keyhandler.homeKeyhandler(event);
				break;
               }
          case "tvShows":
          case "vodMovies":
               {
                    Keyhandler.vodMoviesKeyhandler(event);
			     break;
               }
          case "tvEpisodes":
               Keyhandler.tvEpisodesKeyhandler(event);
               break;
	    case "sections":{
			Keyhandler.sectionKeyHandler(event);
			break;
          }
          case "liveCatchupChannels":{
            Keyhandler.liveCatchupChannelsKeyHandler(event);
            break;
            }

            case "liveCatchupPrograms":{
                Keyhandler.liveCatchupProgramsKeyHandler(event);
                break;
            }




          case "enterPin":{
               Keyhandler.enterPinKeyHandler(event);
               break;
          }
          case "enterPinMovies":{
             Keyhandler.enterPinMoviesKeyHandler(event);
             break;
          }
          case "enterPinMoviesCategories":{
               Keyhandler.enterPinMoviesCategoriesKeyHandler(event);
               break;
            }
          case "enterPinSeries":{
            Keyhandler.enterPinSeriesKeyHandler(event);
            break;
          }

		case "singleMovie": {
				Keyhandler.singleMovieKeydown(event);
				break;
               }
          case "tvshowDetails":{
               Keyhandler.tvshowDetailsKeydown(event);
			break;
          }
		case "popUp": {
				Keyhandler.descKeyhandler(event);
				break;
          }
          case "terms":{
               Keyhandler.descKeyhandler(event);
				break;
          }
		case "seasonsList":{
			Keyhandler.seasonsListKeyhandler(event);
			break;
		}
		case "liveChannels":{
			Keyhandler.liveTvKeydown(event);
			break;
		}
		case "player":{
			Player.playKeydown(event);
			break;
		}
		case "tvShows":{
			Keyhandler.tvShowsKeyDown(event);
			break;
		}

		case "confirmPin":{
			Keyhandler.confirmPinKeyDown(event);
			break;
		}
		case "tvShowDetail":{
			Keyhandler.tvShowDetailKeyhandler(event);
			break;
		}
		case "adultShowDetail":{
			Keyhandler.adultShowDetailKeyhandler(event);
			break;
		}
		case "signIn":{
			Keyhandler.signInKeyhandler(event);
			break;
		}
		case "profile":{
			Keyhandler.profileKeyhandler(event);
			break;
		}
		case "watchList":{
			Keyhandler.watchListKeyDown(event);
			break;
          }
          case "episodeEnd":{
               Keyhandler.episodeEndKeyHandler(event);
               break;
          }
          case "exitApp":{
			Keyhandler.exitKeyhandler(event);
               break;
          }
		case "search":
		case "adult":{
			Keyhandler.adultKeyDown(event);
			break;
		}
		case "changePin":{
			Keyhandler.changePinKeyDown(event);
			break;
		}
		case "tvGuide":{
			Keyhandler.tvGuideKeyHandler(event);
			break;
		}
		case "deleteUser":{
            Keyhandler.deleteUserKeyhandler(event);
            break;
         }
	}
	}
};

function loginLink(){
       Keyhandler.listUserEnter($(".imageFocus"));
}

function deleteLink(position){
     deleteBoxPosition = position;
//     $('.imageFocus').removeClass("imageFocus");
//     $("#genericDiv").html(Util.showPopUp(2,'', "Are you sure you want to delete this user?", "Yes","No"));
//     $("#genericDiv").show();
//     $("#Btn-0").addClass("imageFocus");
          $(".dropdown-content").removeClass("hide");
          $(".dropdown-content").removeClass("show");
//          alert(view);
          pushState(view,$(".imageFocus").attr("id"));
          $('.imageFocus').removeClass("imageFocus");
          view = "deleteUser";
          $("#genericDiv").html(Util.showPopUp(2,'', "Are you sure you want to delete this user?", "Yes","No"));
          $("#genericDiv").show();
          $("#Btn-0").addClass("imageFocus");
}


function playLink(){
    var currFocus = $('.imageFocus');
    var v_index = parseInt(currFocus.attr("v_index"));
	var h_index = parseInt(currFocus.attr("h_index"));

	var index = parseInt(currFocus.attr("index"));
	var streamId = parseInt(currFocus.attr("streamId"));
	var id = currFocus.attr("id");
	var count = parseInt(currFocus.attr("count"));
    var source = currFocus.attr("source");

    hideAddToFav();

//  if(streamId == undefined || Player.data == undefined || Player.data.stream_id == undefined || Player.data.stream_id != streamId){
     if (Player.getStreamId() != streamId) {
          if (Player.isPreparing())
               return;
          $(".playing").removeClass("playing");
          $(".imageFocus").addClass('playing');
          playingIndex = index;
          playerLiveIndex = index;
          Player.data = liveSectionDetails[index];
          Player.type = 'live';
          Main.getEPG(streamId);
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
          var playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url + ":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+Player.data.stream_id+selectedContainer;
          Player.playStream(playUrl,true);
          Player.setStreamId(streamId);
     } else {
          Player.setFullscreen(!Player.getFullscreen());
     }
//  } else{
//       short = true;
////       Player.resize();
//  }
}

function addToFavLink(stream_id,i,name,logo,number){
     var keys = Object.keys(Main.getFavChannels());
     if (jQuery.inArray('' + stream_id, keys) != -1) {
          Main.removeFavChannels(stream_id);
          jQuery("#favStar_"+i).removeClass("show");
          jQuery("#favStar_"+i).addClass("hide");
     } else {
          Main.addFavChannels(stream_id, liveSectionDetails[i]);
          jQuery("#favStar_"+i).removeClass("hide");
          jQuery("#favStar_"+i).addClass("show");
     }
     /*
     if(stream_id!=''){

          var item = window.localStorage.getItem("favChannelsList");

          var obj = {};
          if(item !== null) {
               obj = JSON.parse(item);
          }

          var fav = { stream_id: stream_id, name: name, stream_icon: logo, num: number };
          obj[stream_id + ''] = fav;
          //jQuery("#add_to_fav_link_"+i).html("Remove From Favourite");
          //jQuery("#add_to_fav_link_"+i).removeClass("addToFavClass");
          //jQuery("#add_to_fav_link_"+i).addClass("RemoveFromFavClass");
          //jQuery("#add_to_fav_link_"+i).attr("onclick","removeFromFavLink("+stream_id+","+i+")");
          //jQuery("#add_to_fav_link_"+i).attr("id","remove_from_fav_link_"+i);
          jQuery("#favStar_"+i).removeClass("hide");
          jQuery("#favStar_"+i).addClass("show");

          //console.log(JSON.stringify(obj));
          window.localStorage.setItem("favChannelsList",JSON.stringify(obj));
     }
     */
    //hideAddToFav();
}

function addToFavMovie(stream_id){
     if(stream_id!=''){
          var item = window.localStorage.getItem("favMoviesList");

          var obj = {};
          if(item !== null) {
               obj = JSON.parse(item);
          }

          for (var j=0; j<vodSectionDetails.length; j++) {
               if (vodSectionDetails[j].stream_id == stream_id) {
                    var fav = { stream_id: stream_id, name: vodSectionDetails[j].name, stream_icon: vodSectionDetails[j].stream_icon, num: vodSectionDetails[j].num, added: vodSectionDetails[j].added };
                    obj[stream_id + ''] = fav;
                    break;
               }
          }

          jQuery("#addToFavMovie").html("Remove From Favourite");
          jQuery("#addToFavMovie").attr("onclick","removeFromFavMovie("+stream_id+")");
          jQuery("#favDiv_"+stream_id).append('<img src="images/favourite_yellow.png" style="position: absolute;width: 30px;z-index: 99999;margin-left: 10px;margin-top: 10px;"></div>');
          jQuery("#addToFavMovie").attr("id","removeFromFavMovie");

          window.localStorage.setItem("favMoviesList",JSON.stringify(obj));


     }
}
function addToFavSeries(stream_id){
     if(stream_id!=''){
          var item = window.localStorage.getItem("favSeriesList");

          var obj = {};
          if(item !== null) {
               obj = JSON.parse(item);
          }
          console.log('add series ' + stream_id);

          for (var j=0; j<vodSectionDetails.length; j++) {
               if (vodSectionDetails[j].series_id == stream_id) {
                    var fav = { series_id: stream_id, name: vodSectionDetails[j].name, cover: vodSectionDetails[j].cover, num: vodSectionDetails[j].num, last_modified: vodSectionDetails[j].last_modified };
                    obj[stream_id + ''] = fav;
                    break;
               }
          }

          jQuery("#addToFavSeries").html("Remove From Favourite");
          jQuery("#addToFavSeries").attr("onclick","removeFromFavSeries("+stream_id+")");
          jQuery("#favDiv_"+stream_id).append('<img src="images/favourite_yellow.png" style="position: absolute;width: 30px;z-index: 99999;margin-left: 10px;margin-top: 10px;"></div>');
          jQuery("#addToFavSeries").attr("id","removeFromFavSeries");

          window.localStorage.setItem("favSeriesList",JSON.stringify(obj));


     }
}

function removeFromFavMovie(stream_id){
     if(stream_id!=''){
          var item = window.localStorage.getItem("favMoviesList");

          var obj = {};
          if(item !== null) {
               obj = JSON.parse(item);
          }

          delete obj[stream_id+''];

          jQuery("#removeFromFavMovie").html("Add to Favourite");
          jQuery("#removeFromFavMovie").attr("onclick","addToFavMovie("+stream_id+")");
          jQuery("#favDiv_"+stream_id).html("");
          jQuery("#removeFromFavMovie").attr("id","addToFavMovie");

          window.localStorage.setItem("favMoviesList",JSON.stringify(obj));


     }
}
function removeFromFavSeries(stream_id){
     if(stream_id!=''){
          var item = window.localStorage.getItem("favSeriesList");

          var obj = {};
          if(item !== null) {
               obj = JSON.parse(item);
          }

          delete obj[stream_id+''];

          jQuery("#removeFromFavSeries").html("Add to Favourite");
          jQuery("#removeFromFavSeries").attr("onclick","addToFavSeries("+stream_id+")");
          jQuery("#favDiv_"+stream_id).html("");
          jQuery("#removeFromFavSeries").attr("id","addToFavSeries");

          window.localStorage.setItem("favSeriesList",JSON.stringify(obj));


     }
}

function removeFromFavLink(stream_id,i){
     if(stream_id!=''){

          var item = window.localStorage.getItem("favChannelsList");

          var obj = {};
          if(item !== null) {
               obj = JSON.parse(item);
          }

     //             alert(JSON.stringify(obj));
          delete obj[stream_id+''];
          //obj.splice(jQuery.inArray(stream_id, obj),1);

          //console.log(JSON.stringify(obj));


          //jQuery("#remove_from_fav_link_"+i).html("Add to Favourite");
          //jQuery("#remove_from_fav_link_"+i).removeClass("RemoveFromFavClass");
          //jQuery("#remove_from_fav_link_"+i).addClass("addToFavClass");
          //jQuery("#remove_from_fav_link_"+i).attr("onclick","addToFavLink("+stream_id+","+i+")");
          //jQuery("#remove_from_fav_link_"+i).attr("id","add_to_fav_link_"+i);
          jQuery("#favStar_"+i).removeClass("show");
          jQuery("#favStar_"+i).addClass("hide");



          window.localStorage.setItem("favChannelsList",JSON.stringify(obj));
     }
        //hideAddToFav();
}

function hideAddToFav(){
     $('.dropdown-content').removeClass("hide");
     $('.dropdown-content').removeClass("showInlineGrid");
     //AddToFavBoxHidden = true;
}
function viewFullEPG(stream_id,i){
          Main.getFullEPG('get_simple_data_table',stream_id);

}

function pushState(view, focus, backData, startTime) {

	//console.log("pushState ");
	if(view == "leftMenu") view = contentView;
	for (var i = 0; i < stack.length; i++) {
		if (stack[i].view == view) {
			stack.splice(i, 1);
			i = 0;
		}
	}
	var obj = {
		"view" : view,
		"focus" : focus,
		"backData" : backData,
		"time" : startTime
	}
	stack.push(obj);
}
function popState(view, focus) {
	//console.log("popState");
	return stack.pop();
}
function getRandomArbitrary(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
}
var MD5 = function (string) {

     function RotateLeft(lValue, iShiftBits) {
             return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
     }

     function AddUnsigned(lX,lY) {
             var lX4,lY4,lX8,lY8,lResult;
             lX8 = (lX & 0x80000000);
             lY8 = (lY & 0x80000000);
             lX4 = (lX & 0x40000000);
             lY4 = (lY & 0x40000000);
             lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
             if (lX4 & lY4) {
                     return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
             }
             if (lX4 | lY4) {
                     if (lResult & 0x40000000) {
                             return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                     } else {
                             return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                     }
             } else {
                     return (lResult ^ lX8 ^ lY8);
             }
     }

     function F(x,y,z) { return (x & y) | ((~x) & z); }
     function G(x,y,z) { return (x & z) | (y & (~z)); }
     function H(x,y,z) { return (x ^ y ^ z); }
     function I(x,y,z) { return (y ^ (x | (~z))); }

     function FF(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     }

     function GG(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     }

     function HH(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     }

     function II(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     }

     function ConvertToWordArray(string) {
             var lWordCount;
             var lMessageLength = string.length;
             var lNumberOfWords_temp1=lMessageLength + 8;
             var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
             var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
             var lWordArray=Array(lNumberOfWords-1);
             var lBytePosition = 0;
             var lByteCount = 0;
             while ( lByteCount < lMessageLength ) {
                     lWordCount = (lByteCount-(lByteCount % 4))/4;
                     lBytePosition = (lByteCount % 4)*8;
                     lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                     lByteCount++;
             }
             lWordCount = (lByteCount-(lByteCount % 4))/4;
             lBytePosition = (lByteCount % 4)*8;
             lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
             lWordArray[lNumberOfWords-2] = lMessageLength<<3;
             lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
             return lWordArray;
     }

     function WordToHex(lValue) {
             var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
             for (lCount = 0;lCount<=3;lCount++) {
                     lByte = (lValue>>>(lCount*8)) & 255;
                     WordToHexValue_temp = "0" + lByte.toString(16);
                     WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
             }
             return WordToHexValue;
     }

     function Utf8Encode(string) {
             string = string.replace(/\r\n/g,"\n");
             var utftext = "";

             for (var n = 0; n < string.length; n++) {

                     var c = string.charCodeAt(n);

                     if (c < 128) {
                             utftext += String.fromCharCode(c);
                     }
                     else if((c > 127) && (c < 2048)) {
                             utftext += String.fromCharCode((c >> 6) | 192);
                             utftext += String.fromCharCode((c & 63) | 128);
                     }
                     else {
                             utftext += String.fromCharCode((c >> 12) | 224);
                             utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                             utftext += String.fromCharCode((c & 63) | 128);
                     }

             }

             return utftext;
     }

     var x=Array();
     var k,AA,BB,CC,DD,a,b,c,d;
     var S11=7, S12=12, S13=17, S14=22;
     var S21=5, S22=9 , S23=14, S24=20;
     var S31=4, S32=11, S33=16, S34=23;
     var S41=6, S42=10, S43=15, S44=21;

     string = Utf8Encode(string);

     x = ConvertToWordArray(string);

     a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

     for (k=0;k<x.length;k+=16) {
             AA=a; BB=b; CC=c; DD=d;
             a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
             d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
             c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
             b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
             a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
             d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
             c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
             b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
             a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
             d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
             c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
             b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
             a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
             d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
             c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
             b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
             a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
             d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
             c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
             b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
             a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
             d=GG(d,a,b,c,x[k+10],S22,0x2441453);
             c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
             b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
             a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
             d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
             c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
             b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
             a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
             d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
             c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
             b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
             a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
             d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
             c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
             b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
             a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
             d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
             c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
             b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
             a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
             d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
             c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
             b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
             a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
             d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
             c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
             b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
             a=II(a,b,c,d,x[k+0], S41,0xF4292244);
             d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
             c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
             b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
             a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
             d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
             c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
             b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
             a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
             d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
             c=II(c,d,a,b,x[k+6], S43,0xA3014314);
             b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
             a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
             d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
             c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
             b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
             a=AddUnsigned(a,AA);
             b=AddUnsigned(b,BB);
             c=AddUnsigned(c,CC);
             d=AddUnsigned(d,DD);
          }

          var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

          return temp.toLowerCase();
  };

  Main.getAuth = function(url,user,pwd,name){

     Main.ShowLoading();
     Main.login(url,user,pwd,name,"login");
};

Main.log = function(arg) {
     console.log(arg);
     app.sendlog(arg);
};

Main.getRecentlyAdded = function(port, username, pwd) {
     Main.ShowLoading();
	$.ajax({
		url : port+"/latestadded.php?username="+username+"&password="+pwd,
		type : "GET",
		data : {},
		success : function (data) {
               Main.HideLoading();
               Main.hideSplash();

               if(typeof data == "string"){
                    data = JSON.parse(data);
               }

               recentlyAdded = data;

               view = "homePage";
               hideValues();
               $("#mainContent").html(Util.gridHomePage());
               $("#mainContent").show();
		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.getRecentlyAdded " + xhr.status);
               Main.log(thrownError);
			view = "homePage";
               hideValues();
               $("#mainContent").html(Util.gridHomePage());
               $("#mainContent").show();
		},
		timeout : 60000
	});
};

Main.login = function(port,email,pwd,name,loginType){
	Main.ShowLoading();
	$.ajax({
		url : port+"/player_api.php?username="+email+"&password="+pwd,
		type : "GET",
		data : {},
		success : function (data) {
               Main.HideLoading();
               Main.hideSplash();

               if(typeof data == "string"){
                    data = JSON.parse(data);
               }

               try
               {
			     if(data.user_info.auth) {

                         Main.currentUserLogin = data;
                         Main.dateTimeLoggedIn = new Date();
                         Main.timestampLoggedIn = parseInt(Main.dateTimeLoggedIn.getTime()/1000);
                         Main.serverTimeDifference = parseInt((Date.parse(data.server_info.time_now) - Main.dateTimeLoggedIn)/1000);
                         
                         if (Main.serverTimeDifference > 1799 || Main.serverTimeDifference < -1799) {
                              var div = parseInt(Main.serverTimeDifference / 60);
                              var rem = Main.serverTimeDifference % 60;
                              if (rem > 0)
                                   div = div + 1;
                              if (rem < 0)
                                   div = div - 1;

                              Main.serverTimeDifference = div * 60000;
                         } else {
                              Main.serverTimeDifference = 0;
                         }

                         Main.log("logged in 1 " + formatIsoDatetime(Main.dateTimeLoggedIn));
                         Main.log("logged in 2 " + data.server_info.time_now);
                         Main.log("logged in ts 1 " + Main.timestampLoggedIn);
                         Main.log("logged in ts 2 " + data.server_info.timestamp_now);
                         Main.log("server time diff " + Main.serverTimeDifference);

			          if(data.user_info.status =="Active") {
			               data.user_info.name = name;
                              data.user_info.login_url =port;

                              var item = window.localStorage.getItem("listData");

                              var obj = [];
                              if(item !== null) {
                                   obj = JSON.parse(item);
                              }

                              obj.push(data);

                              if(loginType != "multiscreen") {
                                   window.localStorage.setItem("listData",JSON.stringify(obj));
                              }

                              window.localStorage.setItem("profile",JSON.stringify(data));

                              Main.profile = data;

                              Main.getRecentlyAdded(port, email, pwd);
                              Main.prefetchLiveCats();
    
                              //view = "homePage";
                              //hideValues();
                              //$("#mainContent").html(Util.gridHomePage());
                              //$("#mainContent").show();
			          } else {
			               $(".dropdown-content").removeClass("hide");
                              $(".dropdown-content").removeClass("show");
                              if (view != "signIn") {
                                   view = "signIn";
                                   Main.processNext();
                              }
			               Main.showFailure("Your Status is "+data.user_info.status);
			               $(".orange-button").focus();
                	          callBack = '';
			          }
			     } else {
                         if (view != "signIn") {
                              view = "signIn";
                              Main.processNext();
                         }
				     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
				     callBack = '';
                    }
               }
               catch(e) {
                    if (view != "signIn") {
                         view = "signIn";
                         Main.processNext();
                    }
                    Main.showFailure(e);
                    callBack = '';
               }
		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.login " + xhr.status);
               Main.log(thrownError);
			Main.HideLoading();
               if (view != "signIn") {
                    view = "signIn";
                    Main.processNext();
               }
               if (xhr.status == 404) {
			     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
               } else if (xhr.status == 0) {
                    Main.showFailure("Please check your internet connection.");
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               } else {
                    Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
               }
			callBack = '';
		},
		timeout : 60000
	});
};

Main.prefetchLiveCats = function() {
     $.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_live_categories",
		type : "GET",
		data : {},
		success : function (data) {

		     if(typeof data == "string") {
                    data = JSON.parse(data);
               }

               allLiveCats[0] = {category_id: "ALL", category_name: "ALL", parent_id: 0};
               allLiveCats = $.merge( $.merge( [], allLiveCats ), data );

               Main.prefetchLiveDetails(0);
          },
          error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.prefetchChannels " + xhr.status + " err " + thrownError);
               Main.log(thrownError);
		},
		timeout : 60000
     });
};

Main.prefetchLiveDetails = function(idx){
     var category = allLiveCats[idx].category_id;
     $.ajax({
          url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_live_streams&category_id="+category,
          type : "GET",
          data : {},
          success : function (data) {
               if(typeof data == "string"){
                    data = JSON.parse(data);
               }
               
               allChannels[category] = data;
               idx++;
               if (idx < allLiveCats.length)
                    Main.prefetchLiveDetails(idx);
          },
          error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.prefetchLiveDetails " + xhr.status);
               Main.log(thrownError);
          },
          timeout : 60000
     });
}

var sectionData = '';

Main.getSections = function(action,sectionType){
     sectionData = [];

     if (sectionType == "live" && allLiveCats.length > 0) {
          sectionData = allLiveCats;
          sectionData.type = action;
          sectionData.sectionType = sectionType;
          pushState(view,$(".imageFocus").attr("id"));
          $(".imageFocus").removeClass("imageFocus");
          view = "sections"
          Main.processNext();
          Main.HideLoading();
          Keyhandler.sectionEnter($(".imageFocus"));
          return;
     }

	Main.ShowLoading();
	$.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action,
		type : "GET",
		data : {},
		success : function (data) {

		        if(typeof data == "string"){
                    data = JSON.parse(data);
                 }

               sectionData[0] = {category_id: "ALL", category_name: "ALL", parent_id: 0};
               sectionData = $.merge( $.merge( [], sectionData ), data );

               sectionData.type = action;
               sectionData.sectionType = sectionType;
               pushState(view,$(".imageFocus").attr("id"));
               $(".imageFocus").removeClass("imageFocus");
               view = "sections"
               Main.processNext();
               Main.HideLoading();
               Keyhandler.sectionEnter($(".imageFocus"));
		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.HideLoading();
               Main.log("Error Main.getSections " + xhr.status + " on " + action);
               Main.log(thrownError);
               if (xhr.status == 404)
			     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
               else if (xhr.status == 0) {
                    Main.showFailure("Please check your internet connection.");
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               } else
                    Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
		},
		timeout : 60000
	});
};

var fullEPGData = '';
//var archiveArray ='';
Main.getFullEPG = function(action,stream_id){
 var currFocus = $('.imageFocus');
 var index = parseInt(currFocus.attr("index"));
	var channelName = liveSectionDetails[index].name;
var loadingImage = '<tr colspan="4"><img src="images/Spin.png"  class="imgLoader"></tr>';
    $('#genericDiv').css('background', '#000000e6');
    $("#genericDiv").show();
    $("#genericDiv").html(Util.fullEPGPopUp(loadingImage,channelName));
    hideAddToFav();
 fullEPGData = [];
// var datesTabs = [];
// var tabsHTML = '';
// var tabsData = '';
// var counts = {};
 var fullEPGArray = [];
// archiveArray = [];


// var datesTabsIndex = 0;
//alert(Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&stream_id="+stream_id);
//	Main.ShowLoading();
	$.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&stream_id="+stream_id,
		type : "GET",
		data : {},
		success : function (data) {

		        if(typeof data == "string"){
                    data = JSON.parse(data);
                 }
                  var index = 0;
                   var enterInLoop = false;
                   var tdText ='';
                 for(var i=0;i<data.epg_listings.length;i++){
                      if(data.epg_listings[i].now_playing || enterInLoop) {
                            enterInLoop = true;

                            tdText += '<tr tabindex="'+index+'">'
                                tdText += '<td style="width: 15%;">'+data.epg_listings[i].start+'</td>'
                                tdText += '<td style="width: 15%;">'+data.epg_listings[i].end+'</td>'
                                tdText += '<td style="width: 20%;">'+atob(data.epg_listings[i].title)+'</td>'
                                tdText += '<td style="width: 50%;">'+atob(data.epg_listings[i].description)+'</td>'
                            tdText += '</tr>';
                            index++;
//                            fullEPGData.push(data.epg_listings[i]);
                      }
                 }

            if(tdText!=""){
                  $("#genericDiv").html(Util.fullEPGPopUp(tdText,channelName));
            }else{
                  $("#genericDiv").html(Util.fullEPGPopUp('<tr style="display: grid;height: 100%;"><td colspan="4"><center style="    margin-top: 10%;    font-size: 22px;">No EPG Found!</center></td></tr>',channelName));

            }

        if(fullEPGKeyboardOpened){
            $("tr[tabindex='0']").focus();
            $("tr[tabindex='0']").addClass("imageFocus1");
            fullEPGKeyboardOpened = false;
        }

//                 for(var j=0;j<archiveData.length;j++){
//                    var startDateWithTime = archiveData[j].start;
//                    var startDateSplit = startDateWithTime.split(" ");
//
//                     var key = startDateSplit[0];
//                        if(!counts[key]) counts[key] = 0;
//                        counts[key]++;
//
//                        if(!compareString(startDateSplit[0],datesTabs)){
//                                  datesTabs.push(startDateSplit[0]);
//                        }
//
//                 }

//                   archiveArray = _.groupBy(testingArray, 'start_date');

//                 console.log(JSON.stringify(fullEPGData));




//                if(datesTabs.length> 0){
//                    tabsHTML +='<ul id="navlist" role="tablist">';
//                    for(var k=0;k<datesTabs.length;k++){
//                             var newDate = moment(datesTabs[k]).format('DD MMM YYYY');
//
//
//                        if(k == datesTabs.length-1){
//
//                            tabsHTML +='<li role="presentation" class="active">';
//                            tabsHTML +='<a role="tab" class="tab" id="DataTab_'+(k+1)+'" aria-setsize="'+datesTabs.length+'" aria-posinset="'+(k+1)+'" tabindex="0" href="#" aria-controls="panel-'+(k+1)+'" aria-selected="true" date="'+datesTabs[k]+'">'+newDate+'</a>';
//
//                                 tabsData += '<div class="panel current" role="tabpanel" aria-labelledby="DataTab_'+(k+1)+'" tabindex="-1" id="panel-'+(k+1)+'">';
//                                            var row = 0,count = parseInt(archiveArray[datesTabs[k]].length / 5);
//                                            if((archiveArray[datesTabs[k]].length / 5) % 1 != 0){
//                                                count = count+1;
//                                            }
//                                            for(var i=0;i<(count*5);){
//                                                    if(i % 5 == 0 || i == 0 ){
//                                                        if(i > 8)
//                                                            tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6" style="display:none">';
//                                                        else
//                                                            tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6">';
//
//                                                        row ++;
//                                                    }
//                                                    if(i<archiveArray[datesTabs[k]].length){
//                                                        if(i == 0){
//                                                            if(i<archiveArray[datesTabs[k]].length){
//                                                               tabsData += '<p role="catchupSection" class="catchUpPara imageFocus" id="panel-'+(k+1)+'-sections-catchup-'+i+'" count='+archiveArray[datesTabs[k]].length+' rowindex='+(row-1)+' rowcount='+(count-1)+' index = '+(i%5)+' starttime="'+archiveArray[datesTabs[k]][i].start+'" stoptime="'+archiveArray[datesTabs[k]][i].end+'" streamid='+stream_id+' programname="'+atob(archiveArray[datesTabs[k]][i].title)+'">';
//                                                                if(atob(archiveArray[datesTabs[k]][i].title).length < 26 ){
//                                                                   tabsData +='<span class="catchUpSpan1">'+atob(archiveArray[datesTabs[k]][i].title)+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
//                                                                }else{
//                                                                   tabsData +='<span class="catchUpSpan1 namescroll">'+atob(archiveArray[datesTabs[k]][i].title)+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
//                                                                }
//                                                               tabsData += '</p>';
//                                                            }
//                                                         }else{
//
//                                                               tabsData += '<p role="catchupSection" class="catchUpPara" id="panel-'+(k+1)+'-sections-catchup-'+i+'" count='+archiveArray[datesTabs[k]].length+' rowindex='+(row-1)+' rowcount='+(count-1)+' index = '+(i%5)+' starttime="'+archiveArray[datesTabs[k]][i].start+'" stoptime="'+archiveArray[datesTabs[k]][i].end+'" streamid='+stream_id+' programname="'+atob(archiveArray[datesTabs[k]][i].title)+'">';
//                                                                if(atob(archiveArray[datesTabs[k]][i].title).length < 26 ){
//                                                                   tabsData +='<span class="catchUpSpan1">'+atob(archiveArray[datesTabs[k]][i].title)+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
//                                                                }else{
//                                                                   tabsData +='<span class="catchUpSpan1 namescroll">'+atob(archiveArray[datesTabs[k]][i].title)+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
//                                                                }
//                                                               tabsData += '</p>';
//
//                                                         }
//
//                                                    }
//
//                                                    i++;
//                                                    if(i % 5 == 0 && i != 0){
//                                                         tabsData += '</div>';
//                                                    }
//
//                                            }
//                                 tabsData +='  </div>';
//
//                        }else{
//
//                                        tabsData += '<div aria-hidden="true" class="panel" role="tabpanel" aria-labelledby="DataTab_'+(k+1)+'" tabindex="-1" id="panel-'+(k+1)+'">';
//    					                var row = 0,count = parseInt(archiveArray[datesTabs[k]].length / 5);
//    					                if((archiveArray[datesTabs[k]].length / 5) % 1 != 0){
//    					                    count = count+1;
//    					                }
//                                        for(var i=0;i<(count*5);){
//                                                if(i % 5 == 0 || i == 0 ){
//                                                    if(i > 8)
//                                                        tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6" style="display:none">';
//                                                    else
//                                                        tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6">';
//
//                                                    row ++;
//                                                }
//                                                if(i<archiveArray[datesTabs[k]].length){
//                                                   tabsData += '<p role="catchupSection" class="catchUpPara" id="panel-'+(k+1)+'-sections-catchup-'+i+'" count='+archiveArray[datesTabs[k]].length+' rowindex='+(row-1)+' rowcount='+(count-1)+' index = '+(i%5)+' starttime="'+archiveArray[datesTabs[k]][i].start+'" stoptime="'+archiveArray[datesTabs[k]][i].end+'" streamid='+stream_id+' programname="'+atob(archiveArray[datesTabs[k]][i].title)+'">';
//                                                    if(atob(archiveArray[datesTabs[k]][i].title).length < 26 ){
//                                                       tabsData +='<span class="catchUpSpan1">'+atob(archiveArray[datesTabs[k]][i].title)+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
//                                                    }else{
//                                                       tabsData +='<span class="catchUpSpan1 namescroll">'+atob(archiveArray[datesTabs[k]][i].title)+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
//                                                    }
//                                                   tabsData += '</p>';
//                                                }
//
//                                                i++;
//						                        if(i % 5 == 0 && i != 0){
//                                                     tabsData += '</div>';
//                                                }
//
//                                        }
//                                    tabsData +='  </div>';
//
//                            tabsHTML +='<li role="presentation">';
//                            tabsHTML +='<a role="tab"  class="tab" id="DataTab_'+(k+1)+'" aria-setsize="'+datesTabs.length+'" aria-posinset="'+(k+1)+'" tabindex="-1" href="#" aria-controls="panel-'+(k+1)+'" aria-selected="false" date="'+datesTabs[k]+'">'+newDate+'</a>';
//
//                        }
//                        tabsHTML +='</li>';
//                    }
//
//                    tabsHTML +='</ul>';
//
//                }

//                Main.HideLoading();
////                alert(view);
////                alert($(".imageFocus").attr("id"));
//                pushState(view,$(".imageFocus").attr("id"));
//                $(".imageFocus").removeClass("imageFocus");
//                view = "liveCatchupPrograms";
//                $("#catchupPrograms").html(Util.listCatchUpProgramsPage(tabsHTML,tabsData));
//                $("#catchupPrograms").show();


		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.getFullEPG " + xhr.status);
               Main.log(thrownError);
		},
		timeout : 80000
	});
};




var archiveData = '';
var archiveArray ='';
Main.getTVArchive = function(action,stream_id){
 archiveData = [];
 var datesTabs = [];
 var tabsHTML = '';
 var tabsData = '';
 var counts = {};
 var testingArray = [];
 archiveArray = [];


// var datesTabsIndex = 0;
//alert(Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&stream_id="+stream_id);
	Main.ShowLoading();
	$.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&stream_id="+stream_id,
		type : "GET",
		data : {},
		success : function (data) {

		        if(typeof data == "string"){
                    data = JSON.parse(data);
                 }
                  var index = 0;
                 for(var i=0;i<data.epg_listings.length;i++){
                      if(data.epg_listings[i].has_archive) {
                            var startDateWithTime = data.epg_listings[i].start;
                            var startLocal = formatIsoDatetime(new Date(Date.parse(data.epg_listings[i].start.replace(' ', 'T'))));
                            startDateWithTime = startLocal;
                            var endDateWithTime = data.epg_listings[i].end;
                            var endLocal = formatIsoDatetime(new Date(Date.parse(data.epg_listings[i].end.replace(' ', 'T'))));
                            endDateWithTime = endLocal;
                            var startDateSplit = startDateWithTime.split(" ");
                            var endDateSplit = endDateWithTime.split(" ");
                            var key = startDateSplit[0];
                            var startTime = startDateSplit[1];
                            var endTime = endDateSplit[1];
                            data.epg_listings[i].startLocal = startLocal;
			             //console.log(atob(data.epg_listings[i].title) + ' - ' + startLocal);
                            testingArray[index] = {
                            id: data.epg_listings[i].id,
                            epg_id:data.epg_listings[i].epg_id,
                            title:data.epg_listings[i].title,
                            lang:data.epg_listings[i].lang,
                            start:data.epg_listings[i].start,
                            start_date: key,
                            startTime: startTime,
                            endTime: endTime,
                            end:data.epg_listings[i].end,
                            description:data.epg_listings[i].description,
                            channel_id: data.epg_listings[i].channel_id,
                            start_timestamp: data.epg_listings[i].start_timestamp,
                            stop_timestamp: data.epg_listings[i].stop_timestamp,
                            now_playing: data.epg_listings[i].now_playing,
                            has_archive: data.epg_listings[i].has_archive
                             };
                            index++;
                            archiveData.push(data.epg_listings[i]);
                      }
                 }
                 for(var j=0;j<archiveData.length;j++){
                    var startDateWithTime = archiveData[j].startLocal;
                    var startDateSplit = startDateWithTime.split(" ");

                     var key = startDateSplit[0];
                        if(!counts[key]) counts[key] = 0;
                        counts[key]++;

                        if(!compareString(startDateSplit[0],datesTabs)){
                                  datesTabs.push(startDateSplit[0]);
                        }

                 }

                   archiveArray = _.groupBy(testingArray, 'start_date');

//                 console.log(JSON.stringify(archiveArray));




                if(datesTabs.length> 0){
                    tabsHTML +='<ul id="navlist" role="tablist">';
                    for(var k=0;k<datesTabs.length;k++){
                             var newDate = moment(datesTabs[k]).format('DD MMM YYYY');


                        if(k == datesTabs.length-1){

                            tabsHTML +='<li role="presentation" class="active">';
                            tabsHTML +='<a role="tab" class="tab" id="DataTab_'+(k+1)+'" aria-setsize="'+datesTabs.length+'" aria-posinset="'+(k+1)+'" tabindex="0" href="#" aria-controls="panel-'+(k+1)+'" aria-selected="true" date="'+datesTabs[k]+'">'+newDate+'</a>';

                                 tabsData += '<div class="panel current" role="tabpanel" aria-labelledby="DataTab_'+(k+1)+'" tabindex="-1" id="panel-'+(k+1)+'">';
                                            var row = 0,count = parseInt(archiveArray[datesTabs[k]].length / numberOfRows);
                                            if((archiveArray[datesTabs[k]].length / numberOfRows) % 1 != 0){
                                                count = count+1;
                                            }
                                            for(var i=0;i<(count*numberOfRows);){
                                                    if(i % numberOfRows == 0 || i == 0 ){
                                                        if(i > 8)
                                                            tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6" style="display:none">';
                                                        else
                                                            tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6">';

                                                        row ++;
                                                    }
                                                    if(i<archiveArray[datesTabs[k]].length){
                                                        if(i == 0){
                                                            if(i<archiveArray[datesTabs[k]].length){
                                                                 var programname = atob(archiveArray[datesTabs[k]][i].title);
                                                               tabsData += '<p role="catchupSection" class="catchUpPara imageFocus" id="panel-'+(k+1)+'-sections-catchup-'+i+'" count='+archiveArray[datesTabs[k]].length+' rowindex='+(row-1)+' rowcount='+(count-1)+' index = '+(i%numberOfRows)+' starttime="'+archiveArray[datesTabs[k]][i].start+'" stoptime="'+archiveArray[datesTabs[k]][i].end+'" streamid='+stream_id+' programname="'+archiveArray[datesTabs[k]][i].title+'" programdesc="'+archiveArray[datesTabs[k]][i].description+'">';
                                                                if(programname.length < 26 ){
                                                                   tabsData +='<span class="catchUpSpan1">'+programname+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
                                                                }else{
                                                                   tabsData +='<span class="catchUpSpan1 namescroll">'+programname+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
                                                                }
                                                               tabsData += '</p>';
                                                            }
                                                         }else{

                                                                 var programname = atob(archiveArray[datesTabs[k]][i].title);
                                                               tabsData += '<p role="catchupSection" class="catchUpPara" id="panel-'+(k+1)+'-sections-catchup-'+i+'" count='+archiveArray[datesTabs[k]].length+' rowindex='+(row-1)+' rowcount='+(count-1)+' index = '+(i%numberOfRows)+' starttime="'+archiveArray[datesTabs[k]][i].start+'" stoptime="'+archiveArray[datesTabs[k]][i].end+'" streamid='+stream_id+' programname="'+archiveArray[datesTabs[k]][i].title+'" programdesc="'+archiveArray[datesTabs[k]][i].description+'">';
                                                                if(programname.length < 26 ){
                                                                   tabsData +='<span class="catchUpSpan1">'+programname+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
                                                                }else{
                                                                   tabsData +='<span class="catchUpSpan1 namescroll">'+programname+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
                                                                }
                                                               tabsData += '</p>';

                                                         }

                                                    }

                                                    i++;
                                                    if(i % numberOfRows == 0 && i != 0){
                                                         tabsData += '</div>';
                                                    }

                                            }
                                 tabsData +='  </div>';

                        }else{

                                        tabsData += '<div aria-hidden="true" class="panel" role="tabpanel" aria-labelledby="DataTab_'+(k+1)+'" tabindex="-1" id="panel-'+(k+1)+'">';
    					                var row = 0,count = parseInt(archiveArray[datesTabs[k]].length / numberOfRows);
    					                if((archiveArray[datesTabs[k]].length / numberOfRows) % 1 != 0){
    					                    count = count+1;
    					                }
                                        for(var i=0;i<(count*numberOfRows);){
                                                if(i % numberOfRows == 0 || i == 0 ){
                                                    if(i > 8)
                                                        tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6" style="display:none">';
                                                    else
                                                        tabsData += '<div id="panel-'+(k+1)+'-sectionIndexCatchUp-'+row+'" index='+row+' count = '+count+'  class="col-md-6">';

                                                    row ++;
                                                }
                                                if(i<archiveArray[datesTabs[k]].length){
                                                     var programname = atob(archiveArray[datesTabs[k]][i].title);
                                                   tabsData += '<p role="catchupSection" class="catchUpPara" id="panel-'+(k+1)+'-sections-catchup-'+i+'" count='+archiveArray[datesTabs[k]].length+' rowindex='+(row-1)+' rowcount='+(count-1)+' index = '+(i%numberOfRows)+' starttime="'+archiveArray[datesTabs[k]][i].start+'" stoptime="'+archiveArray[datesTabs[k]][i].end+'" streamid='+stream_id+' programname="'+archiveArray[datesTabs[k]][i].title+'" programdesc="'+archiveArray[datesTabs[k]][i].description+'">';
                                                    if(programname.length < 26 ){
                                                       tabsData +='<span class="catchUpSpan1">'+programname+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
                                                    }else{
                                                       tabsData +='<span class="catchUpSpan1 namescroll">'+programname+'</span><br><span class="catchUpSpan3"><img src="images/tv_arch.png" class="catchupImage"><span class="catchUpSpan2">'+archiveArray[datesTabs[k]][i].startTime+' - '+archiveArray[datesTabs[k]][i].endTime+'</span></span>';
                                                    }
                                                   tabsData += '</p>';
                                                }

                                                i++;
						                        if(i % numberOfRows == 0 && i != 0){
                                                     tabsData += '</div>';
                                                }

                                        }
                                    tabsData +='  </div>';

                            tabsHTML +='<li role="presentation">';
                            tabsHTML +='<a role="tab"  class="tab" id="DataTab_'+(k+1)+'" aria-setsize="'+datesTabs.length+'" aria-posinset="'+(k+1)+'" tabindex="-1" href="#" aria-controls="panel-'+(k+1)+'" aria-selected="false" date="'+datesTabs[k]+'">'+newDate+'</a>';

                        }
                        tabsHTML +='</li>';
                    }

                    tabsHTML +='</ul>';

                }

                Main.HideLoading();
//                alert(view);
//                alert($(".imageFocus").attr("id"));
                pushState(view,$(".imageFocus").attr("id"));
                $(".imageFocus").removeClass("imageFocus");
                view = "liveCatchupPrograms";
                $("#catchupPrograms").html(Util.listCatchUpProgramsPage(tabsHTML,tabsData));
                $("#catchupPrograms").show();



//                 alert(JSON.stringify(datesTabs));

//                 if (!datesTabs.contains(currentFormatDate)) {
//                                                     datesTabs.add(datesTabsIndex, currentFormatDate);
//                                                     if (currentFormatDateAfter.equals(currentFormatDate)) {
//                                                         currentDateIndex = datesTabsIndex;
//                                                         break;
//                                                     }
//                                                     datesTabsIndex++;
//                                                 }

//                 alert(archiveData.length);


//               sectionData[0] = {category_id: "ALL", category_name: "ALL", parent_id: 0};
//               if(sectionType != "catchup"){
//                      sectionData[1] = {category_id: "FAVOURITE", category_name: "FAVOURITE", parent_id: 0};
//               }
//
//
//                sectionData = $.merge( $.merge( [], sectionData ), data );
//
//               sectionData.type = action;
//               sectionData.sectionType = sectionType;
//                pushState(view,$(".imageFocus").attr("id"));
//               $(".imageFocus").removeClass("imageFocus");
//               view = "sections"
//               Main.processNext();
//               Main.HideLoading();
		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.getTVArchive " + xhr.status);
               Main.log(thrownError);
		},
		timeout : 80000
	});
};


var singleMovie = '',singleMovieRelatedData = '';
Main.getSingleMovie = function(id){
//alert(id);
//alert(vodSectionDetails.length);
     var cID="";
     var cName="";
     var flag = false;
     openedMovieID = id;

	Main.ShowLoading();
    if(parentPin){
        for(var i= 0 ;i<vodSectionDetails.length;i++){
            if(vodSectionDetails[i].stream_id == id){
               cID = vodSectionDetails[i].category_id;
               break;
            }
        }
        if(cID!=""){
            for(var j=0;j<sectionData.length;j++){
                if(sectionData[j].category_id == cID){
                    cName = sectionData[j].category_name;
                   break;
                }

            }
         }

    //    alert(cName);
        if(cName!="" && parentPin){
           if(compareString(cName,adultArray)){
                flag = true;
    //            alert("locked movie");
                Main.HideLoading();

                pushState(view,$(".imageFocus").attr("id"));
                $(".imageFocus").removeClass("imageFocus");
                view = "enterPinMovies";
                $("#customMessage").html(Util.confirmPin());
                $("#customMessage").show();

           }

        }
    }
	 if(!flag){
        $.ajax({
            url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_vod_info&vod_id="+id,
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
            error : function (xhr, ajaxOptions, thrownError) {
               Main.HideLoading();
               Main.log("Error Main.singleMovie " + xhr.status);
               Main.log(thrownError);
               if (xhr.status == 404)
			     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
               else if (xhr.status == 0) {
                    Main.showFailure("Please check your internet connection.");
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               } else
                    Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
            },
            timeout : 60000
        });

	}
};

// For TV show and Movies listing pages
Main.getVodDetails = function(action,category){
//alert(category);
     $(".norecordfound").hide();
     Main.ShowLoading();
	if(category == "0"/*Util.favName*/){
	    if(action == "get_series"){
	    	 var items = Main.getFavSeries();//JSON.parse(window.localStorage.getItem('favSeriesList'));
	    }else{
	    	 var items = Main.getFavMovies();//JSON.parse(window.localStorage.getItem('favMoviesList'));
	    }
        if(items !== null && items !== undefined){

             ajaxGetVODDetails(action,category,"fav",items);
        }else{
             Main.HideLoading();
             //Main.showFailure("No Favourite Found.");
             $("#moviesList").html('');
             $(".norecordfound").show();
//             var obj = [];
//             loadLivePageData(obj,part);
        }

    }else{
         ajaxGetVODDetails(action,category,"","");
    }


};

function ajaxGetVODDetails(action,category,catType,items){
     vodSectionDetails = {};
     if (catType === 'fav' && items !== '') {
          var obj = [];
          var keys = Object.keys(items);
          keys.sort(function(a, b){return parseInt(items[a].num)-parseInt(items[b].num);});
          for(var i=0;i<keys.length;i++){
               obj.push(items[keys[i]]);
          }

          obj.category = { category_name: category };
               
          loadMoviesPageData(obj,action);

          Main.HideLoading();
               
          return;
     }

	Main.ShowLoading();
	$.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&category_id="+category,
		type : "GET",
		data : {},
		success : function (data) {
		if(typeof data == "string"){
            data = JSON.parse(data);
         }
//         alert(Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&category_id="+category);

			Main.HideLoading();
			        if(catType =="fav"){
                        var obj = [];
                        if(action == "get_series"){
                            for(var i=0;i<data.length;i++){

                                 if(items!=null && jQuery.inArray(data[i].series_id, items) != -1) {
                                       obj.push(data[i]);
                                 }
                            }
                        }else{
                            for(var i=0;i<data.length;i++){
//                                 alert(JSON.stringify(data[i]));

                                 if(items!=null && jQuery.inArray(data[i].stream_id, items) != -1) {
                                       obj.push(data[i]);
                                 }
                            }
                        }
                        loadMoviesPageData(obj,action);




                    }else{

                         if(action == "get_series"){
                              var obj = [];
                              var tmpcat = [];
                              var maxcat = 0;
                              var j = 1;
                              for(var i=data.length-1; i>=0 ; i--) {
                                   if (maxcat < data[i].category_id) {
                                        for (var k=0; k<data[i].category_id-maxcat; k++)
                                             tmpcat.push([]);
                                        
                                        maxcat = data[i].category_id;
                                   }
                                   tmpcat[data[i].category_id-1].push(data[i]);
                              }

                              for (var i=0; i<tmpcat.length; i++) {
                                   for (var k=0; k<tmpcat[i].length; k++) {
                                        tmpcat[i][k].num = j;
                                        obj.push(tmpcat[i][k]);
                                        j++;
                                   }
                              }

                              data = obj;
                         }

                         loadMoviesPageData(data, action);
                    }

		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.HideLoading();
               Main.log("Error ajaxGetVodDetails " + xhr.status);
               Main.log(thrownError);
               Main.showFailure(xhr.responseText);
               if (xhr.status == 404)
			     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
               else if (xhr.status == 0) {
                    Main.showFailure("Please check your internet connection.");
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               } else
                    Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
		},
		timeout : 80000
	});

};



function ajaxGetCatDetails(action,category,items,categ){

	Main.ShowLoading();
	$.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&category_id="+category,
		type : "GET",
		data : {},
		success : function (data) {
		if(typeof data == "string"){
            data = JSON.parse(data);
         }

          var found = false;
//         alert(JSON.stringify(data));


			Main.HideLoading();

//                        var obj = [];
                        if(action == "get_series"){
                            for(var i=0;i<data.length;i++){

                                 if(items!=null && jQuery.inArray(data[i].series_id, items) != -1) {
//                                       obj.push(data[i]);
                                         found = true;
                                         Main.HideLoading();
                                         openedMovieCatID = categ;
                                         openedSectionAction = action;
                                         pushState(view,$(".imageFocus").attr("id"));
                                         $(".imageFocus").removeClass("imageFocus");
                                         view = "enterPinMoviesCategories";
                                         $("#customMessage").html(Util.confirmPin());
                                         $("#customMessage").show();
                                         break;
                                 }
                            }
                        }else{
                            for(var i=0;i<data.length;i++){
//                                 alert(JSON.stringify(data[i]));

                                 if(items!=null && jQuery.inArray(data[i].stream_id, items) != -1) {
//                                       obj.push(data[i]);
                                         found = true;
                                         Main.HideLoading();
                                         openedMovieCatID = categ;
                                         openedSectionAction = action;
                                         pushState(view,$(".imageFocus").attr("id"));
                                         $(".imageFocus").removeClass("imageFocus");
                                         view = "enterPinMoviesCategories";
                                         $("#customMessage").html(Util.confirmPin());
                                         $("#customMessage").show();
                                         break;
                                 }
                            }


                             if(!found){
                                        Main.getVodDetails(action,categ);
                              }
                        }


//                          alert(JSON.stringify(obj));


//                        loadMoviesPageData(obj,action);



		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.HideLoading();
               Main.log("Error ajaxGetCatDetails " + xhr.status);
               Main.log(thrownError);
               Main.showFailure(xhr.responseText);
               if (xhr.status == 404)
			     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
               else if (xhr.status == 0) {
                    Main.showFailure("Please check your internet connection.");
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               } else
                    Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
		},
		timeout : 60000
	});

}

function loadMoviesPageData(data,action){

               vodSectionDetails = data;
               if(data.length){
                    if (vodSectionDetails.category === undefined)
                         vodSectionDetails.category = sectionData[sectionsIndex];

                    clearSearch();
                    hideValues();
                    pushState(view,$('.imageFocus').attr('id'));
                    view = "vodMovies";
                    //$("#mainContent").html('');
                    $("#moviesList").html('');
                    $(".imageFocus").removeClass("imageFocus");
                    //$("#mainContent").html(Util.vodMoviesPage(vodSectionDetails));
                    $("#moviesList").html(Util.vodMoviesPage(vodSectionDetails));
                    $("#vodMovies-0-0").addClass('imageFocus');
                    //$("#mainContent").show();
                    $("#channelContent").show();
               } else{
                    Main.HideLoading();
                    $("#moviesList").html('');
                    $(".norecordfound").show();
                    /*
                    if(action == "get_vod_streams")
                         Main.showFailure("No Movies Found.");
                    else
                         Main.showFailure("No Series Found.");
                         */
               }
}

var seriesPage = '';
Main.getSeriesPage = function(id){
	 var cID="";
         var cName="";
         var flag = false;
         openedSeriesID = id;

    	Main.ShowLoading();

       if(parentPin){
        for(var i= 0 ;i<vodSectionDetails.length;i++){
            if(vodSectionDetails[i].series_id == id){
               cID = vodSectionDetails[i].category_id;
               break;
            }
        }
        if(cID!=""){
            for(var j=0;j<sectionData.length;j++){
                if(sectionData[j].category_id == cID){
                    cName = sectionData[j].category_name;
                   break;
                }

            }
         }

    //    alert(cName);
        if(cName!="" && parentPin){
           if(compareString(cName,adultArray)){
                flag = true;
    //            alert("locked movie");
                Main.HideLoading();

                pushState(view,$(".imageFocus").attr("id"));
                $(".imageFocus").removeClass("imageFocus");
                view = "enterPinSeries";
                $("#customMessage").html(Util.confirmPin());
                $("#customMessage").show();

           }

        }
      }

    if(!flag){
        $.ajax({
            url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_series_info"+"&series_id="+id,
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
            error : function (xhr, ajaxOptions, thrownError) {
               Main.HideLoading();
               Main.log("Error Main.getSeriesPage " + xhr.status);
               Main.log(thrownError);
               if (xhr.status == 404)
			     Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
               else if (xhr.status == 0) {
                    Main.showFailure("Please check your internet connection.");
                    Main.backupServerSelected = true;
                    Main.serverURL = Main.backupServerURL;
               } else
                    Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
            },
            timeout : 60000
        });
	}
};
var playingIndex = 0;
Main.getLiveDetails = function(action,category,part,sectionType){
     liveSectionDetails = {};
     Main.ShowLoading();
     if(sectionType == "live"){
          if(category == "0"){
               var items = Main.getFavChannels();//JSON.parse(window.localStorage.getItem('favChannelsList'));
               if(items !== null && items !== undefined){
                    ajaxGetLiveDetails(action,category,part,"fav",items);
               }else{
                    Main.HideLoading();
                    var obj = [];
                    loadLivePageData(obj,part);
               }

          }else{
               if (allChannels[category] !== undefined && allChannels[category].length > 0) {
                    loadLivePageData(allChannels[category], part);
               } else {
                    ajaxGetLiveDetails(action,category,part,"","");
               }
          }
     }else if(sectionType == "catchup"){
          ajaxGetCatchUpDetails(action,category,part,"","");
     }
};
var catchUpChannelsData = '';
function ajaxGetCatchUpDetails(action,category,part,catType,items){
 catchUpChannelsData = [];

$.ajax({
       		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&category_id="+category,
       		type : "GET",
       		data : {},
       		success : function (data) {
       			Main.HideLoading();
                if(typeof data == "string"){
                    data = JSON.parse(data);
                 }
//                 catchUpChannelsData = data;
//                    alert(data.length);


                        for(var i=0;i<data.length;i++){
       			             if(data[i].tv_archive) {
                                   catchUpChannelsData.push(data[i]);
       			             }
       			        }

//       			        alert(catchUpChannelsData.length);
                        if(catchUpChannelsData.length>0){
                              hideValues();
                             pushState(view,$('.imageFocus').attr('id'));
                              view = "liveCatchupChannels";
                              $("#catchupChannels").html('');
                              $(".imageFocus").removeClass("imageFocus");
                            $("#catchupChannels").html(Util.listCatchUpChannelsPage(catchUpChannelsData));
                            $("#catchupChannels").show();
                        }else{
                            if (view != "popUp")
                                    pushState(view, $(".imageFocus").attr("id"));
                                view = "popUp";
                                $("#customMessage").show();
                                $("#customMessage").html(Util.showStatusPopUp(0, "No CatchUp Found!", "OK"));
                        }


//                 alert("catchup show krne");
//       			      if(catType =="fav"){
//       			        var obj = [];
//       			        for(var i=0;i<data.length;i++){
//       			             if(items!=null && jQuery.inArray(data[i].stream_id, items) != -1) {
//                                   obj.push(data[i]);
//       			             }
//       			        }
////       			         alert(JSON.stringify(obj));
//       			            loadLivePageData(obj,part);
//
//
//       			      }else{
//       			            loadLivePageData(data,part);
//       			      }


       		},
       		error : function (errObj) {
       		},
       		timeout : 80000
       	});
}



function ajaxGetLiveDetails(action,category,part,catType,items){
     if (catType === 'fav' && items !== '') {
          var obj = [];
          var keys = Object.keys(items);
          keys.sort(function(a, b){return parseInt(items[a].num)-parseInt(items[b].num);});
       	for(var i=0;i<keys.length;i++){
       	     obj.push(items[keys[i]]);
       	}
       	loadLivePageData(obj,part);
          Main.HideLoading();
          return;
     }
$.ajax({
       		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action="+action+"&category_id="+category,
       		type : "GET",
       		data : {},
       		success : function (data) {
       			Main.HideLoading();
                if(typeof data == "string"){
                    data = JSON.parse(data);
                 }
       			      if(catType =="fav"){
       			        var obj = [];
       			        for(var i=0;i<data.length;i++){
       			             if(items!=null && jQuery.inArray(data[i].stream_id, items) != -1) {
                                   obj.push(data[i]);
       			             }
       			        }
//       			         alert(JSON.stringify(obj));
       			            loadLivePageData(obj,part);


       			      }else{
       			            loadLivePageData(data,part);
       			      }


       		},
       		error : function (xhr, ajaxOptions, thrownError) {
                    Main.HideLoading();
                    Main.log("Error ajaxGetLiveDetails " + xhr.status);
                    Main.log(thrownError);
                    if (xhr.status == 404)
                         Main.showFailure("اطلاعات وارده معتبر نیست\nUsername or password is not valid.");
                    else if (xhr.status == 0) {
                         Main.showFailure("Please check your internet connection.");
                         Main.backupServerSelected = true;
                         Main.serverURL = Main.backupServerURL;
                    } else
                         Main.showFailure("Server Error. " + thrownError + "\nPlease try again later.");
       		},
       		timeout : 60000
       	});
}

function loadLivePageData(data,part){
     if(data.length>0){
//                                     console.log(data);

          liveSectionDetails = data;
          liveSectionDetails.category = sectionData[sectionsIndex];
          if(part){
               $(".liveChannels").html(Util.updateSectionCat());
          }else{
               if (Player.isPreparing())
                    return;
               hideValues();
               pushState(view,$('.imageFocus').attr('id'));
               view = "liveChannels";
               //$("#mainContent").html('');
               $("#liveDetails").html("");
               $(".imageFocus").removeClass("imageFocus");

               //$("#mainContent").html(Util.liveDetailsPage());
               $("#liveDetails").html(Util.liveDetailsPage());
               $("#liveChannel-0").addClass('imageFocus');
               //$("#mainContent").show();
               $("#channelContent").show();
               $("#liveChannel-0").addClass('playing');
               playingIndex = 0;
               Player.data = liveSectionDetails[0];
               Main.getEPG(liveSectionDetails[0].stream_id);
               currentLiveInfo.channelName = Player.data.name;
               currentLiveInfo.streamId = Player.data.stream_id;
               currentLiveInfo.logo = Player.data.stream_icon;
               currentLiveInfo.chNum = Player.data.num;
               currentLiveInfo.currentProgram = '';
               currentLiveInfo.nextProgram = '';
               currentLiveInfo.curIndex = 0;
               currentLiveInfo.nextIndex = currentLiveInfo.curIndex + 1;
               if (liveSectionDetails.length<=currentLiveInfo.nextIndex)
                    currentLiveInfo.nextIndex = 0;
               currentLiveInfo.prevIndex = currentLiveInfo.curIndex - 1;             
               if (currentLiveInfo.prevIndex<0)
                    currentLiveInfo.prevIndex = liveSectionDetails.length-1;
               Player.type = "live";
               playerLiveIndex = 0;
               var playUrl = '';
               if(!selectedContainer)
                    playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url+":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[0].stream_id+".ts";
               else
                    playUrl = Main.profile.server_info.server_protocol + "://" + Main.profile.server_info.url+":"+  Main.profile.server_info.port+"/live/"+Main.profile.user_info.username+"/"+Main.profile.user_info.password+"/"+liveSectionDetails[0].stream_id+selectedContainer;


               Player.playStream(playUrl,true);
               Player.setStreamId(liveSectionDetails[0].stream_id);
          }
          jQuery(".norecordfound").hide();
     }else{
          liveSectionDetails = data;
          liveSectionDetails.category = sectionData[sectionsIndex];
          if(part){
               $(".liveChannels").html(Util.updateSectionCat());
               jQuery(".norecordfound").show();

          } else{
               hideValues();
               //pushState(view,$('.imageFocus').attr('id'));
               //view = "liveChannels";
               //$("#mainContent").html('');
               $("#liveDetails").html("");
               //$(".imageFocus").removeClass("imageFocus");

               //$("#mainContent").html(Util.liveDetailsPage());
               $("#liveDetails").html(Util.liveDetailsPage());
               //$("#liveChannel-0").addClass('imageFocus');
               //$("#mainContent").show();
               $("#channelContent").show();
               //$("#liveChannel-0").addClass('playing');
               playingIndex = 0;
               Player.data = null;
               Player.type = "live";
               playerLiveIndex = 0;

               jQuery(".norecordfound").show();
               //$('#videoHtml').css('background', 'black');
               var PlayerDIvSelector = $('#player-wrapper');
               PlayerDIvSelector.html('');
               PlayerDIvSelector.attr('class', '');
               PlayerDIvSelector.css('text-align', 'center');
               PlayerDIvSelector.html('<div class="erroronplayer"><span>No Record Found</span></div>');
               //jQuery(".imageFocus").removeClass("imageFocus");
               //jQuery("#rightLiveArrow").addClass("imageFocus");
          }



     }


}



var epgData = '';
Main.getEPG = function(id){
	//Main.ShowLoading();
	$.ajax({
		url : Main.profile.user_info.login_url+"/player_api.php?username="+Main.profile.user_info.username+"&password="+Main.profile.user_info.password+"&action=get_short_epg&stream_id="+id,
		type : "GET",
		data : {},
		success : function (data) {
			//Main.HideLoading();
			    if(typeof data == "string"){
                    data = JSON.parse(data);
                 }
               epgData = data;
               Main.updateEPG(id);
		},
		error : function (xhr, ajaxOptions, thrownError) {
               Main.log("Error Main.getEPG " + xhr.status);
               Main.log(thrownError);
		},
		timeout : 60000
	});
};

Main.updateEPG = function(id){
     var Text = '';
     var now = new Date().getTime();
     var nowSet = false;
     var isNext = false;
     Text +='<div>'
     if(epgData.epg_listings.length){
          for(var i=0;i<epgData.epg_listings.length;i++){
               var isNow = false;
               var start = Date.parse(epgData.epg_listings[i].start.replace(' ', 'T')) - Main.serverTimeDifference;
               var end = Date.parse(epgData.epg_listings[i].end.replace(' ', 'T')) - Main.serverTimeDifference;
               
               if (isNext && start > now) {
                    if (id == currentLiveInfo.streamId) {
                         currentLiveInfo.nextProgram = atob(epgData.epg_listings[i].title);
                         isNext = false;
                    }
               }

               if (now >= start && now <= end) {
                    if (id == currentLiveInfo.streamId) {
                         if (!nowSet) {
                              currentLiveInfo.currentProgram = atob(epgData.epg_listings[i].title);
                              isNext = true;
                              nowSet = true;
                         }
                    }
                    isNow = true;
               }

               if (end < now)
                    continue;
               
               /*
               if (id == currentLiveInfo.streamId) {
                    if (!nowSet) {
                         if (now >= start && now <= end) {
                              //currentLiveInfo.currentProgram = getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+" "+atob(epgData.epg_listings[i].title);
                              currentLiveInfo.currentProgram = atob(epgData.epg_listings[i].title);
                              isNext = true;
                              nowSet = true;
                         }
                    }
                    if (isNext && start > now) {
                         //currentLiveInfo.nextProgram = getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+" "+atob(epgData.epg_listings[i].title);
                         currentLiveInfo.nextProgram = atob(epgData.epg_listings[i].title);
                         isNext = false;
                    }
               }
               if(i < numberOfShortEPGs){
                    if(i == 0) {
                         if (Main.screenHeight < 1000)
                              Text +='<div class="row selectedEPG" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow_720p">'+getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                         else
                              Text +='<div class="row selectedEPG" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow">'+getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                    } else {
                         if (Main.screenHeight < 1000)
                              Text +='<div class="row" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow_720p">'+getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                         else
                              Text +='<div class="row" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow">'+getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                    }

               }
               else {
                    if (Main.screenHeight < 1000)
                         Text +='<div class="row"  source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'"  id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'" style="display:none"><div class="epgRow_720p">'+getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                    else
                         Text +='<div class="row"  source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'"  id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'" style="display:none"><div class="epgRow">'+getTwoHours2(epgData.epg_listings[i].start)+"-"+getTwoHours2(epgData.epg_listings[i].end)+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
               }
               */
               if(i < numberOfShortEPGs){
                    if(i == 0) {
                         if (Main.screenHeight < 1000)
                              Text +='<div class="row selectedEPG" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow_720p">'+(isNow?"NOW":"NEXT")+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                         else
                              Text +='<div class="row selectedEPG" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow">'+(isNow?"NOW":"NEXT")+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                    } else {
                         if (Main.screenHeight < 1000)
                              Text +='<div class="row" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow_720p">'+(isNow?"NOW":"NEXT")+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                         else
                              Text +='<div class="row" source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'" id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'"><div class="epgRow">'+(isNow?"NOW":"NEXT")+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                    }

               }
               else {
                    if (Main.screenHeight < 1000)
                         Text +='<div class="row"  source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'"  id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'" style="display:none"><div class="epgRow_720p">'+(isNow?"NOW":"NEXT")+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
                    else
                         Text +='<div class="row"  source= "epgList" epgID="'+epgData.epg_listings[i].epg_id+'"  id="epgList-'+i+'" index='+i+' count="'+epgData.epg_listings.length+'" style="display:none"><div class="epgRow">'+(isNow?"NOW":"NEXT")+"<b style='margin-left:20px;margin-right:20px;'> => </b>"+'<p>'+atob(epgData.epg_listings[i].title)+'</p></div></div>';
               }
          }
     }
     Text +='</div>';
     $(".epgListing").html(Text);
     if (nowSet && Player.getFullscreen())
          showLiveInfo();
};
function getBOXDetails() {
	try {
		try {
			if (document.cookie) {
				cookieBoxNo = read_cookie('boxNo');
				cookieSupported = true;
				console.log("cookie support is there")
			}
		} catch (e) {
			console.log("No cookie support");
		}

		if (cookieBoxNo == null) {
			if (typeof(Storage) !== "undefined") {
				if (window.localStorage.getItem("boxNo") === null) {
					var bxN = uuid.v1().replaceAll("-","").substr(0,12).toUpperCase();
					window.localStorage.setItem("boxNo",bxN);
					return bxN;
				} else {
					var boxNo = window.localStorage.getItem("boxNo");
					if (cookieSupported)
						write_cookie('boxNo', boxNo);
					return boxNo;
				}
			} else {
				var bxN = uuid.v1().replaceAll("-","").substr(0,12).toUpperCase();
				window.localStorage.setItem("boxNo",bxN);
				return bxN;
			}
		} else {
			return cookieBoxNo;
		}
	} catch (e) {
		return "ERROR";
	}

}
function write_cookie(name, value) {
	var expiration_date = new Date();
	expiration_date.setFullYear(2040);
	expiration_date = expiration_date.toGMTString();

	var cookie_string = escape(name) + "=" + escape(value) + "; expires="
		 + expiration_date;
	document.cookie = cookie_string;
}
function read_cookie(key) {

	var cookie_string = "" + document.cookie;
	var cookie_array = cookie_string.split("; ");

	for (var i = 0; i < cookie_array.length; ++i) {
		var single_cookie = cookie_array[i].split("=");
		if (single_cookie.length != 2)
			continue;
		var name = unescape(single_cookie[0]);
		var value = unescape(single_cookie[1]);

		if (key == name)
			return value;
	}
	// Cookie was not found:
	return null;
}

function hideDeleteUserPopUp(){
$("#genericDiv").hide();
        $("#genericDiv").html('');
        try {
            var obj = popState();
             view = obj.view;
            $("#"+obj.focus).addClass("imageFocus");
        } catch (e) {} }






 var $navlist = $('#navlist');
 var $tabContainer = $('#tab-container');
 var $panels = $('#panels');

 $navlist.on('keydown', 'li a', function (keyVent) {
   var arrows = [37, 38, 39, 40];
   var which = keyVent.which;
   var target = keyVent.target;
   if ($.inArray(which, arrows) > -1) {
     var adjacentTab = findAdjacentTab(target, $navlist, which);

     if (adjacentTab) {
       keyVent.preventDefault();
       adjacentTab.focus();
       // if desired behavior is that when tab receives focus -> make it the active tab:
       setActiveAndInactive(adjacentTab, $navlist);
     }
   } else if (which === 13 || which === 32) { // ENTER |or| SPACE
     keyVent.preventDefault(); // don't scroll the page around...
     target.click();
   } else if (which === 34) { // PAGE DOWN
     keyVent.preventDefault(); // don't scroll the page
     var assocPanel = $('#' + this.getAttribute('aria-controls'));
     if (assocPanel) {
       assocPanel.focus();
     }
   }
 });

 $(document.body).on('keydown', '.panel', function (e) {
   if (e.which === 33) { // PAGE UP
     e.preventDefault(); // don't scroll
     var activeTab = $navlist.find('li.active a')[0];
     if (activeTab) {
       activeTab.focus();
     }
   }
 });

 // click support
 $navlist.on('click', 'li a', function () {
   setActiveAndInactive(this, $navlist);
 });

 function findAdjacentTab(startTab, $list, key) {
   var dir = (key === 37 || key === 38) ? 'prev' : 'next';
   var adjacentTab = (dir === 'prev') ?
                     $(startTab.parentNode).prev()[0] :
                     $(startTab.parentNode).next()[0];

   if (!adjacentTab) {
     var allTabs = $list.find('li');
     if (dir === 'prev') {
       adjacentTab = allTabs[allTabs.length - 1];
     } else {
       adjacentTab = allTabs[0];
     }
   }

   return $(adjacentTab).find('a')[0];
 }

 function setActiveAndInactive(newActive, $list) {
// alert(newActive);
// alert($list);
   $list.find('li').each(function () {
     var assocPanelID = $(this)
                           .find('a')
                           .first()
                           .attr('aria-controls');
     var anchor = $(this).find('a')[0];

     if (this !== newActive.parentNode) {
       $(this).removeClass('active');
       anchor.tabIndex = -1;
       anchor.setAttribute('aria-selected', 'false');
       $('#' + assocPanelID)
         .removeClass('current')
         .attr('aria-hidden', 'true');
     } else {
       $(this).addClass('active');
       anchor.tabIndex = 0;
       anchor.setAttribute('aria-selected', 'true');
       $('#' + assocPanelID)
         .addClass('current')
         .removeAttr('aria-hidden');
     }

   });
 }

 // initial configuration based on window's width
 var isAccordionView = false;
 var isTabsView = false;

 determineView();

 // Debounced Resize() jQuery Plugin
 // Author: Paul Irish
 (function($, sr){
   // debouncing function from John Hann
   // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
   var debounce = function (func, threshold, execAsap) {
       var timeout;

       return function debounced () {
           var obj = this, args = arguments;
           function delayed () {
               if (!execAsap)
                   func.apply(obj, args);
               timeout = null;
           }

           if (timeout)
               clearTimeout(timeout);
           else if (execAsap)
               func.apply(obj, args);

           timeout = setTimeout(delayed, threshold || 100);
       };
   };
   // smartresize
   jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

 })(jQuery,'smartresize');


 // RESIZE EVENT:
 $(window).smartresize(determineView);


 function determineView() {
   var winWidth = $(window).width();

   if (winWidth <= 800 && !isAccordionView) { // SHOW ACCORDION VIEW
     // switch to the accordion view
     $tabContainer
       .removeClass('tabs-view')
       .addClass('accordion-view');

     // fix the markup to be more suited for accordions
     $panels.find('.panel').each(function () {
       var panelID = this.id;
       var assocLink = panelID && $('#navlist a[aria-controls="' + panelID + '"]')[0];
       if (assocLink) {
         $(assocLink.parentNode).append(this);
       }
     });

     isAccordionView = true;
     isTabsView = false;
   } else if (winWidth > 800 && !isTabsView) { // SHOW TABS VIEW
     var wasAccordion = $tabContainer.hasClass('accordion-view');
     // switch to the tabs view
     $tabContainer
       .removeClass('accordion-view')
       .addClass('tabs-view');

     if (wasAccordion) {
       $navlist.find('.panel').each(function () {
         $panels.append(this);
       });
     }

     isTabsView = true;
     isAccordionView = false;
   }
 }

