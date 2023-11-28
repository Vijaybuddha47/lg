var Util = {};
Util.splashHtml = function() {
     var Text = "";
     Text += '<div style="overflow:hidden;height:100%;width:100%;background:#0c1013 url(images/logo.png) no-repeat; background-size:25%;background-position:center center;">';
     Text += '</div>';
     return Text;
}
var listMenu = true;
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
var monthNamesC = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
              ];
var monthFullNames = ["January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"
];
var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

var timeArray =  ['00:00 AM','00:30 AM','01:00 AM','01:30 AM','02:00 AM','02:30 AM','03:00 AM','03:30 AM','04:00 AM','04:30 AM','05:00 AM','05:30 AM','06:00 AM','06:30 AM','07:00 AM','07:30 AM','08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM',];//dont remove space between time and Am /pm space is mandetory 
var timeArrayToCompare =  ['00:00 AM','00:30 AM','01:00 AM','01:30 AM','02:00 AM','02:30 AM','03:00 AM','03:30 AM','04:00 AM','04:30 AM','05:00 AM','05:30 AM','06:00 AM','06:30 AM','07:00 AM','07:30 AM','08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','13:00 PM','13:30 PM','14:00 PM','14:30 PM','15:00 PM','15:30 PM','16:00 PM','16:30 PM','17:00 PM','17:30 PM','18:00 PM','18:30 PM','19:00 PM','19:30 PM','20:00 PM','20:30 PM','21:00 PM','21:30 PM','22:00 PM','22:30 PM','23:00 PM','23:30 PM',];

var liveSectionDetails = {};
var vodSectionDetails = {};
var recentlyAdded = {};
Util.favName = "FAVORITES";
function formatDate(date) {
     //return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
     return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() ;
}

function formatIsoDatetime(date) {
     var month = date.getMonth()+1;
     if (month < 10)
          month = '0' + month;
     
     var day = date.getDate();
     if (day < 10)
          day = '0' + day;
     
     var hours = date.getHours();
     if (hours < 10)
          hours = '0' + hours;
     var minutes = date.getMinutes();
     if (minutes < 10)
          minutes = '0' + minutes;
     var secs = date.getSeconds();
     if (secs < 10)
          secs = '0' + secs;

     return date.getFullYear() + '-' + month + "-" + day + " " +  hours + ':' + minutes + ':' + secs;
}

function updateDateTimeHtml()
{
     var data = new Date();

     var hours = data.getHours();
     if(hours <= 9)
          hours =  '0' + hours ; 
     var minutes = data.getMinutes();
     if(minutes <= 9)
          minutes =  '0' + minutes ; 

     var date = hours + " : "+minutes;


     var date2 = monthNames[data.getMonth()] + " " + data.getDate() + ", " + data.getFullYear();

     return date+' <span>'+date2+'</span>';
}

function getHours()
{
     var data = new Date();

     var hours = data.getHours();
     if (hours > 12)
          hours -= 12;
     var minutes = data.getMinutes();
     if(minutes <= 9)
          minutes =  '0' + minutes ; 

     return hours + ":"+minutes;
}

function getAmPm() {
     var data = new Date();

     var hours = data.getHours();

     if (hours > 11)
          return "PM";

     return "AM";
}

function getDayDate() {
     var data = new Date();

     return dayNames[data.getDay()] + ", " + data.getDate() + " " + monthNamesC[data.getMonth()] + " " + data.getFullYear();
}

function durToTime(sec) {
     var hours = (sec/3600) | 0;
     var mins = ((sec%3600)/60) | 0;
     var secs = sec%60 | 0;
     if (hours < 10)
          hours = '0' + hours;
     if (mins < 10)
          mins = '0' + mins;
     if (secs < 10)
          secs = '0' + secs;

     return '' + hours + ':' + mins + ':' + secs;
}

function formatTime(date) {
     var hours = date.getHours();
     var minutes = date.getMinutes();
     var ampm = hours >= 12 ? 'pm' : 'am';
     hours = hours % 12;
     hours = hours ? hours : 12; // the hour '0' should be '12'
     minutes = minutes < 10 ? '0'+minutes : minutes;
     return hours + ':' + minutes + ' ' + ampm;
}

function utcToLocalDate(date) {
     return new Date(date.getTime() - date.getTimezoneOffset()*60000);
}

var liveInfoTimer = -1;
function showLiveInfo() {
     $('.osd_info_clock').html(formatTime(new Date()));
     $('.osd_info_title_live').html(currentLiveInfo.channelName);
     $('.osd_channel_number').html(currentLiveInfo.chNum)
     if (currentLiveInfo.currentProgram.length>0)
          $('.osd_info_epg_now').html('NOW: ' + currentLiveInfo.currentProgram);
     else
          $('.osd_info_epg_now').html('');
     if (currentLiveInfo.nextProgram.length>0)
          $('.osd_info_epg_next').html('NEXT: ' + currentLiveInfo.nextProgram);
     else
          $('.osd_info_epg_next').html('');
     $('#osd_info_logo').attr('src', currentLiveInfo.logo);
     if (Main.screenHeight < 1000)
          $('.osd_info_720p').show();
     else
          $('.osd_info_1080p').show();
     if (liveInfoTimer != -1)
          clearTimeout(liveInfoTimer);
     liveInfoTimer = setTimeout(hideLiveInfo, 5000);

}

function hideLiveInfo() {
     if (Main.screenHeight < 1000)
          $('.osd_info_720p').hide();
     else
          $('.osd_info_1080p').hide();
     if (liveInfoTimer != -1)
          clearTimeout(liveInfoTimer);
     liveInfoTimer = -1;
}

var chNumTimeout = -1;
function showChannelNum() {
     $('#player_chnum').html(searchChNum);
     $('.player_onnum').show();
     if (chNumTimeout != -1)
          clearTimeout(chNumTimeout);
     chNumTimeout = setTimeout(hideChannelNum, 2000);
}

function hideChannelNum() {
     $('.player_onnum').hide();
     if (searchChNum.length>0)
          Keyhandler.playStreamNumber(searchChNum);
     searchChNum = '';
     if (chNumTimeout != -1)
          clearTimeout(chNumTimeout);
     chNumTimeout = -1;
}

var catchupInfoTimer = -1;
function showCatchupInfo() {
     var pos = Player.getCurrentPosition();
     var buttonPos = (pos / currentCatchupInfo.duration) * 1780;
     $('.osd_info_clock').html(formatTime(new Date()));
     $('.cur_pos_time').html(durToTime(pos));
     $('.pos_button').css('left', buttonPos+'px');
     $('.osd_info').show();
     if (catchupInfoTimer != -1)
          clearTimeout(catchupInfoTimer);
     catchupInfoTimer = setTimeout(hideCatchupInfo, 10000);

}

function hideCatchupInfo() {
     $('.osd_info').hide();
     if (catchupInfoTimer != -1)
          clearTimeout(catchupInfoTimer);
     catchupInfoTimer = -1;
}

var movieInfoTimer = -1;
function showMovieInfo() {
     var pos = Player.getCurrentPosition();
     var dur = Player.getDuration();
     if (dur < 1) {
          $('.pos_button').css('left', '0px');
     } else {
          if (pos > dur)
               pos = dur;
          var buttonPos = (pos / dur) * 0.81 * Main.screenWidth;
          $('.pos_button').css('left', buttonPos+'px');
          $('.total_pos_time').html(durToTime(dur));
     }
     $('.osd_info_clock').html(formatTime(new Date()));
     $('.cur_pos_time').html(durToTime(pos));
     if (Player.isPaused()) {
          $('#img_play_pause').attr('src', 'images/playpauseicon.png');
     } else {
          $('#img_play_pause').attr('src', 'images/pauseplay.png');
     }
     if (Main.screenHeight < 1000)
          $('.osd_info_720p').show();
     else
          $('.osd_info_1080p').show();

     if (movieInfoTimer != -1)
          clearTimeout(movieInfoTimer);
          
     movieInfoTimer = setTimeout(hideMovieInfo, 10000);
}

function showMovieInfo2(wtimer) {
     var pos = Player.getCurrentPosition();
     var dur = Player.getDuration();
     if (dur < 1) {
          $('.pos_button').css('left', '0px');
     } else {
          if (pos > dur)
               pos = dur;
          var buttonPos = (pos / dur) * 0.81 * Main.screenWidth;
          $('.pos_button').css('left', buttonPos+'px');
          $('.total_pos_time').html(durToTime(dur));
     }
     $('.osd_info_clock').html(formatTime(new Date()));
     $('.cur_pos_time').html(durToTime(pos));
     if (Player.isPaused()) {
          $('#img_play_pause').attr('src', 'images/playpauseicon.png');
     } else {
          $('#img_play_pause').attr('src', 'images/pauseplay.png');
     }
     if (Main.screenHeight < 1000)
          $('.osd_info_720p').show();
     else
          $('.osd_info_1080p').show();

     if (movieInfoTimer != -1)
          clearTimeout(movieInfoTimer);
          
     if (wtimer) {
          movieInfoTimer = setTimeout(hideMovieInfo, 10000);
     }
}

function hideMovieInfo() {
     if (Main.screenHeight < 1000)
          $('.osd_info_720p').hide();
     else
          $('.osd_info_1080p').hide();
     if (movieInfoTimer != -1)
          clearTimeout(movieInfoTimer);
     movieInfoTimer = -1;
}

function showSearch() {
     $('#searchBar').show();
     setTimeout(function() {
          $('#search_text').val(searchWords);
          $('#search_text').focus();
     }, 100);
}

function isSearchShown() {
     return $('#searchBar').is(':visible');
}

var imageFocus = null;

function clearSearch() {
     searchWords = '';
}

function closeSearch() {
     $('#searchBar').hide();
     setTimeout(function() {
          $('#moviesList').focus();
          if (imageFocus != null) {
               $('#' + imageFocus).addClass('imageFocus');
          }
          imageFocus = null; 
     }, 100);
}

function hideSearch() {
     closeSearch();
}

function searchOnInput() {
     searchWords = $('#search_text').val();
     imageFocus = null;
     $("#mainContent").html(Util.vodMoviesPage(vodSectionDetails));
}

function searchOnClick() {
     searchWords = $('#search_text').val();
     imageFocus = null;
     $("#mainContent").html(Util.vodMoviesPage(vodSectionDetails));
}

function showMovieUpdated(tupdate) {
     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     var Text = '<div style="width:220px;position:absolute;font-size:20px;z-index:99999;color:gold"><span>';
     var localdate = new Date();
     var tserver = new Date(tupdate*1000);
     var tnow = localdate.getTime()/1000 + (localdate.getTimezoneOffset() * 60);
     var diff = tnow - tupdate;
     if (diff < 24 * 3600 && localdate.getUTCDate() == tserver.getUTCDate()) {
          Text += 'Today';
     } else if (diff < 48 * 3600 && localdate.getUTCDate() - tserver.getUTCDate() == 1) {
          Text += 'Yesterday';
     } else if (diff < 7 * 24 * 3600 && localdate.getUTCDay() > tserver.getUTCDay() && localdate.getUTCMonth() == tserver.getUTCMonth()) {
          Text += (localdate.getUTCDate() - tserver.getUTCDate()) + " days ago";
     } else if (diff < 14 * 24 * 3600 && localdate.getUTCMonth() == tserver.getUTCMonth()) {
          Text += "Last week";
     } else if (diff < 31 * 24 * 3600 && localdate.getUTCMonth() == tserver.getUTCMonth()) {
          var weeks = parseInt(diff / (7 * 24 * 3600));
          if (weeks < 2)
               weeks = 2;
          Text += weeks + " weeks ago";
     } else {
          Text += months[tserver.getMonth()] + ' ' + tserver.getFullYear();
     }
     /*else if (diff >= 48 * 3600 && diff < 7 * 24 * 3600) {
          Text += (diff / (24 * 3600)) + " days ago";
     } else if (diff >= 7 * 24 * 3600 && diff < 14 * 24 * 3600) {
          Text += "Last week";
     } else if (diff >= 14 * 24 * 3600 && diff < 30 * 24 * 3600) {
          Text += (diff / (7 * 24 * 3600)) + " weeks ago";
     } else if (diff >= 30 * 24 * 3600 && diff < 60 * 24 * 3600) {
          Text += "Last month";
     } else if (diff >= 60 * 24 * 3600 && diff < 365 * 24 * 3600) {
          Text += (diff / (30 * 24 * 3600)) + " months ago";
     } else if (diff >= 365 * 24 * 3600 && diff < 730 * 24 * 3600) {
          Text += "Last year";
     } else if (diff >= 730 * 24 * 3600) {
          Text += (diff / (365 * 24 * 3600)) + " years ago";
     }*/
     Text += '</span></div>';

     return Text;
}
// Home page

Util.gridHomePage = function(){
     if (Main.screenHeight < 1000)
          return Util.gridHomePage_720p();

     return Util.gridHomePage_1080p();
};

Util.gridHomePage_720p = function(){
     var Text = '';
     Text += '<div class="mainHome">';
     Text += '     <div class="mainHomeContent">';
     Text += '          <div class="homeHeader_720p">';
     Text += '               <div class="homeLeftTop_720p"></div>';
     Text += '               <img src="images/tamasha_logo.png">';
     Text += '          </div>';
     Text += '          <div class="homeBody_720p">';
     Text += '                    <div class="homeMenu_720p">';
     Text += '                         <img index=1 source="tiles" id="homeLiveTile" src="images/tv.png" class="imgMenu_720p imageFocus">';
     Text += '                         <img index=2 source="tiles" id="moviesTile" src="images/MOVIE.png" class="imgMenu_720p">';
     Text += '                         <img index=3 source="tiles" id="seriesTile" src="images/SERIES.png" class="imgMenu_720p">';
     Text += '                         <img index=4 source="tiles" id="settingTile" src="images/SETTINGS.png" class="imgMenu_smaller_720p settingsMenu_720p">';
     //Text += '                         <img index=5 source="tiles" id="accountTile" src="images/user.png" class="imgMenu_720p accountMenu_720p">';
     Text += '                         <img index=5 source="tiles" id="logoffTile" src="images/officon.png" class="imgMenu_smaller_720p logoffMenu_720p">';
     Text += '                    </div>';
     Text += '                    <div class="homeDisplay_720p">';
     Text += '                              <div class="h1_container_720p"><h1 id="ihours">xhours</h1></div>';
     Text += '                              <div class="h3_container_720p"><h3 id="iampm">xampm</h3></div>';
     Text += '                              <div class="h1_container_720p"><h4 id="idate">xdate</h4></div>';
     Text += '                              <div class="h5_container_720p">';
     Text += '                                   <h5>RECENTLY ADDED</h5>';
     Text += '                              </div>';
     Text += '                          <div id="recentList" class="recentRow_720p">';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_720p"  type="vod" source="recent" v_index="1" h_index="1" stream_id="1"	index=6 id="vodMovies1" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>0?recentlyAdded[0].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>0?recentlyAdded[0].name:'Movie 1')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_720p"  type="vod" source="recent" v_index="1" h_index="2" stream_id="2"	index=7 id="vodMovies2" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>1?recentlyAdded[1].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>1?recentlyAdded[1].name:'Movie 2')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_720p"  type="vod" source="recent" v_index="1" h_index="3" stream_id="3"	index=8 id="vodMovies3" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>2?recentlyAdded[2].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>2?recentlyAdded[2].name:'Movie 3')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_720p"  type="vod" source="recent" v_index="1" h_index="4" stream_id="4"	index=9 id="vodMovies4" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>3?recentlyAdded[3].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>3?recentlyAdded[3].name:'Movie 4')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_720p"  type="vod" source="recent" v_index="1" h_index="5" stream_id="5"	index=10 id="vodMovies5" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>4?recentlyAdded[4].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>4?recentlyAdded[4].name:'Movie 5')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_720p"  type="vod" source="recent" v_index="1" h_index="6" stream_id="6"	index=11 id="vodMovies6" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>5?recentlyAdded[5].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>5?recentlyAdded[5].name:'Movie 6')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                          </div>';
     Text += '                              <div class="h6_container_720p">';
     Text += '                                   <h6 id="iexp">xexp</h6>';
     Text += '                              </div>';
     Text += '                    </div>';
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';
     

     Text = Text.replace("xhours", getHours()).replace("xampm", getAmPm()).replace("xdate", getDayDate()).replace("xexp", "Expiration: " + dateUtil(Main.profile.user_info.exp_date * 1000));
     return Text;
};

Util.gridHomePage_1080p = function(){
     var Text = '';
     Text += '<div class="mainHome">';
     Text += '     <div class="mainHomeContent">';
     Text += '          <div class="homeHeader_1080p">';
     Text += '               <div class="homeLeftTop_1080p"></div>';
     Text += '               <img src="images/tamasha_logo.png">';
     Text += '          </div>';
     Text += '          <div class="homeBody_1080p">';
     Text += '                    <div class="homeMenu_1080p">';
     Text += '                         <img index=1 source="tiles" id="homeLiveTile" src="images/tv.png" class="imgMenu_1080p imageFocus">';
     Text += '                         <img index=2 source="tiles" id="moviesTile" src="images/MOVIE.png" class="imgMenu_1080p">';
     Text += '                         <img index=3 source="tiles" id="seriesTile" src="images/SERIES.png" class="imgMenu_1080p">';
     Text += '                         <img index=4 source="tiles" id="settingTile" src="images/SETTINGS.png" class="imgMenu_smaller_1080p settingsMenu_1080p">';
     //Text += '                         <img index=5 source="tiles" id="accountTile" src="images/user.png" class="imgMenu_1080p accountMenu_1080p">';
     Text += '                         <img index=5 source="tiles" id="logoffTile" src="images/officon.png" class="imgMenu_smaller_1080p logoffMenu_1080p">';
     Text += '                    </div>';
     Text += '                    <div class="homeDisplay_1080p">';
     Text += '                              <div class="h1_container_1080p"><h1 id="ihours">xhours</h1></div>';
     Text += '                              <div class="h3_container_1080p"><h3 id="iampm">xampm</h3></div>';
     Text += '                              <div class="h1_container_1080p"><h4 id="idate">xdate</h4></div>';
     Text += '                              <div class="h5_container_1080p">';
     Text += '                                   <h5>RECENTLY ADDED</h5>';
     Text += '                              </div>';
     Text += '                          <div id="recentList" class="recentRow_1080p">';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_1080p"  type="vod" source="recent" v_index="1" h_index="1" stream_id="1"	index=6 id="vodMovies1" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>0?recentlyAdded[0].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>0?recentlyAdded[0].name:'Movie 1')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_1080p"  type="vod" source="recent" v_index="1" h_index="2" stream_id="2"	index=7 id="vodMovies2" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>1?recentlyAdded[1].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>1?recentlyAdded[1].name:'Movie 2')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_1080p"  type="vod" source="recent" v_index="1" h_index="3" stream_id="3"	index=8 id="vodMovies3" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>2?recentlyAdded[2].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>2?recentlyAdded[2].name:'Movie 3')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_1080p"  type="vod" source="recent" v_index="1" h_index="4" stream_id="4"	index=9 id="vodMovies4" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>3?recentlyAdded[3].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>3?recentlyAdded[3].name:'Movie 4')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_1080p"  type="vod" source="recent" v_index="1" h_index="5" stream_id="5"	index=10 id="vodMovies5" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>4?recentlyAdded[4].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>4?recentlyAdded[4].name:'Movie 5')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                              <div class="col-5-eq-nopad">';
     Text += '                                   <div><div class="recentImage_1080p"  type="vod" source="recent" v_index="1" h_index="6" stream_id="6"	index=11 id="vodMovies6" count="6" >';
     Text += '                                        <img src="'+(recentlyAdded.length>5?recentlyAdded[5].stream_icon:'images/noimage.png')+'"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     Text += '                                        <div class="pText"><p><span>'+(recentlyAdded.length>5?recentlyAdded[5].name:'Movie 6')+'</span></p></div>';
     Text += '                                   </div></div>';
     Text += '                              </div>';
     Text += '                          </div>';
     Text += '                              <div class="h6_container_1080p">';
     Text += '                                   <h6 id="iexp">xexp</h6>';
     Text += '                              </div>';
     Text += '                    </div>';
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';
     

     Text = Text.replace("xhours", getHours()).replace("xampm", getAmPm()).replace("xdate", getDayDate()).replace("xexp", "Expiration: " + dateUtil(Main.profile.user_info.exp_date * 1000));

     return Text;
};

// Account PAge
Util.accountPage = function(){
	var Text = '';

	if (Main.screenHeight < 1000)
          Text += '<div class="mainAccount_720p"><div class="mainHomeContent">';
     else
          Text += '<div class="mainAccount"><div class="mainHomeContent">';

     Text += '<div class="homeHeader2">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/tamasha_logo.png" class="logImg2"/></div>';
     Text += '<div class="col-md-4 accountTitle">SETTINGS</div>';

     Text += '<div class="col-md-4"><h3 class="homeH1">'+ updateDateTimeHtml() +'</h3></div>';

     //<div class="floatRight"><img src="images/bell-icon.png"  source="headTiles" id="bellIcon" class="bellIcon" style=""><img src="images/switch-user-icon.png"  source="headTiles" style="" class="switchUser" id="switchUser"/></div>
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="accountBody">';
     Text +='<div class="row accountElements">';
     Text +='<div class="account-title">Account Info</div>';

     Text +='<div class="row accountData">';
     Text +='<div class="col-md-6">UserName</div><div class="col-md-6">'+Main.profile.user_info.username+'</div>';
     Text +='<div class="col-md-6">Account Status</div><div class="col-md-6">'+Main.profile.user_info.status+'</div>';

     Text +='<div class="col-md-6">Expire Date</div><div class="col-md-6">'+(Main.profile.user_info.exp_date?dateUtil(Main.profile.user_info.exp_date * 1000) : "Unlimited" )+'</div>';
     Text +='<div class="col-md-6">Is Trial</div><div class="col-md-6">'+(parseInt (Main.profile.user_info.is_trial)? "Yes":"No")+'</div>';
     Text +='<div class="col-md-6">Active Connections</div><div class="col-md-6">'+Main.profile.user_info.active_cons+'</div>';
     Text +='<div class="col-md-6">Created At</div><div class="col-md-6">'+(Main.profile.user_info.created_at ? dateUtil(Main.profile.user_info.created_at * 1000) : "")+'</div>';
     Text +='<div class="col-md-6">Max connections</div><div class="col-md-6">'+Main.profile.user_info.max_connections+'</div>';

     Text +='</div>';

     Text +='</div>';

     Text +='<div class="row accountButtons">';
     Text += '<div class="col-md-6"><div class="floatLeft"><a id="accountBack" class="btn btn-default accountBtn accountBack imageFocus">BACK</a></div></div>';
     //Text += '<div class="col-md-6"><div class="floatRight"><a id="accountLogout" class="btn btn-default accountBtn accoutnLogout">LOGOUT</a></div></div>';
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="homeBottom">';

     Text +='</div>';

     Text +='</div></div>';

     return Text;
};



// settings Page
Util.settingsPage = function(){
	var Text = '';

     if (Main.screenHeight < 1000)
          Text += '<div class="mainAccount_720p"><div class="mainHomeContent">';
     else
          Text += '<div class="mainAccount"><div class="mainHomeContent">';

     Text += '<div class="homeHeader2">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/tamasha_logo.png" class="logImg2"/></div>';
     Text += '<div class="col-md-4 accountTitle">SETTINGS</div>';

     Text += '<div class="col-md-4"><h3 class="homeH1">'+ updateDateTimeHtml() +'</h3></div>';

     //<div class="floatRight"><img src="images/bell-icon.png"  source="headTiles" id="bellIcon" class="bellIcon" style=""><img src="images/switch-user-icon.png"  source="headTiles" style="" class="switchUser" id="switchUser"/></div>
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="accountBody">';

     Text += '<div id="accountInfo" class=" settingsTile imageFocus">';
     Text += '<div class="sTile">';
     Text += '<div class="sImg"><img src="images/user2.png"></div>';
     Text += '<div class="sText">Account Info</div>';
     Text +='</div>';
     Text +='</div>';

     Text += '<div id="playerControl"  class=" settingsTile">';
     Text += '<div class="sTile">';
     Text += '<div class="sImg"><img src="images/format.png"></div>';
     Text += '<div class="sText">Stream Format</div>';
     Text +='</div>';
     Text +='</div>';
/*
     Text += '<div id="screenControl"  class=" settingsTile">';
     Text += '<div class="sTile">';
     Text += '<div class="sImg"><img src="images/parental.png"></div>';
     Text += '<div class="sText">Streaming Portal</div>';
*/
     Text +='</div>';
     Text +='</div>';

     Text +='</div>';

     Text += '<div class="homeBottom">';

     Text +='</div>';

     Text +='</div></div>';

     return Text;
};

// Inner Settings
Util.settingSection = function(){
     var Text = '';
     if (Main.screenHeight < 1000)
          Text += '<div class="mainAccount_720p"><div class="mainHomeContent">';
     else
          Text += '<div class="mainAccount"><div class="mainHomeContent">';

     Text += '<div class="homeHeader2">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/tamasha_logo.png" class="logImg2"/></div>';
     Text += '<div class="col-md-4 accountTitle">SETTINGS</div>';

     Text += '<div class="col-md-4"><h3 class="homeH1">'+ updateDateTimeHtml() +'</h3></div>';

     //<div class="floatRight"><img src="images/bell-icon.png"  source="headTiles" id="bellIcon" class="bellIcon" style=""><img src="images/switch-user-icon.png"  source="headTiles" style="" class="switchUser" id="switchUser"/></div>
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="accountBody">';
     Text +='<div class="row accountElements">';
     if(selectSetting == "parentControl" && parentPin == ''){
          Text +='<div class="account-title">Parental Control</div>';
     }else if(selectSetting == "playerControl"){
          Text +='<div class="account-title">Stream Format</div>';
     }else if(selectSetting == "screenControl"){
          Text +='<div class="account-title">Screen Format</div>';
     }else if(selectSetting == "accountInfo"){
          Text +='<div class="account-title">Parental Control</div>';
     }else if(selectSetting == "parentControlTurnOff" && parentPin){
          Text +='<div class="account-title">Turn Off Parental Control</div>';
     }else{
          Text +='<div class="account-title">Update Parental Control Pin</div>';
     }



     if(selectSetting == "parentControl" && parentPin == ''){
          Text +='<div class="row pinControl">';
          Text +='<div class="form-group">';
          Text +=' <label for="pin">Enter Your Pin:</label>';
          Text += '<input type="password" class="form-control pinSetting imageFocus" max-length="10"  source="sourceAddPinField" id="pin">';
          Text +='</div>';

          Text +='<div class="form-group">';
          Text +=' <label for="cpin">Confirm Your Pin</label>';
          Text += '<input type="password" class="form-control pinSetting"  max-length="10" source="sourceAddPinField"  id="cpin">';
          Text +='</div>';
          Text +='</div>';
     }else if(selectSetting == "playerControl"){
          Text +='<div class="row accountData">';
          Text +='<label class="containerBtn imageFocus" index=0 id="containerBtn-0"  source="inputButtons"> .m3u8<input   type="radio" '+(selectedContainer == ".m3u8" ? "checked":"")+' name="radio" value=".m3u8"> <span class="checkmark"></span></label>';
          Text +='<label class="containerBtn" index=1 id="containerBtn-1" source="inputButtons"> .ts<input  type="radio" '+( (selectedContainer == ".ts" ) ? "checked":"")+' name="radio" value=".ts"> <span class="checkmark"></span></label>';
          Text +='</div>';
     /*
     }else if(selectSetting == "screenControl"){
          Text +='<div class="row accountData">';
          Text +='<label class="containerBtn imageFocus" index=0 id="containerBtn-0"  source="inputButtons">Primary Portal<input   type="radio" '+(Main.backupServerSelected == false ? "checked":"")+' name="radio" value="main"> <span class="checkmark"></span></label>';
          Text +='<label class="containerBtn" index=1 id="containerBtn-1" source="inputButtons">Backup Portal<input  type="radio" '+( (Main.backupServerSelected == true ) ? "checked":"")+' name="radio" value="backup"> <span class="checkmark"></span></label>';
          Text +='</div>';
     */
     }else if(selectSetting == "accountInfo"){
          Text +='<div class="row accountButtons">';
          if(parentPin == ''){
               Text +='<div class="col-md-4"><div class="floatLeft"><a id="addNewPin" class="btn btn-default accountBtn accountBack imageFocus" source="parentalBtn" style="width: 300px;">Add New Pin</a></div></div>';
          }else{
               Text +='<div class="col-md-4"><div class="floatLeft"><a id="addNewPin" class="btn btn-default accountBtn accountBack imageFocus" source="parentalBtn" style="width: 300px;">Update Pin</a></div></div>';
          }
          Text +='<div class="col-md-4"><div class="floatLeft"><a id="turnOffPin" class="btn btn-default accountBtn accoutnLogout" source="parentalBtn" style="width: 300px;">Turn Off Pin</a></div></div>';
          Text +='<div class="col-md-4"><div class="floatLeft"><a id="accountClose" class="btn btn-default accountBtn accountBack" source="parentalBtn" style="width: 300px;">Back</a></div></div>';

          Text +='</div>';

     }else if(selectSetting == "parentControlTurnOff" && parentPin){
          Text +='<div class="row pinControl">';
          Text +='<div class="form-group">';
          Text +=' <label for="opin">Enter your old Pin:</label>';
          Text += '<input type="password" class="form-control pinSetting imageFocus" max-length="10"  source="sourceParentControlTurnOffField" id="opin">';
          Text +='</div>';

     }else{

          Text +='<div class="row pinControl">';
          Text +='<div class="form-group">';
          Text +=' <label for="opin">Old Pin:</label>';
          Text += '<input type="password" class="form-control pinSetting imageFocus" max-length="10"  source="sourceUpdatePinField" id="opin">';
          Text +='</div>';

          Text +='<div class="form-group">';
          Text +=' <label for="pin">New Pin</label>';
          Text += '<input type="password" class="form-control pinSetting"  max-length="10" source="sourceUpdatePinField"  id="pin">';
          Text +='</div>';

          Text +='<div class="form-group">';
          Text +=' <label for="cpin">Confirm Pin</label>';
          Text += '<input type="password" class="form-control pinSetting"  max-length="10" source="sourceUpdatePinField"  id="cpin">';
          Text +='</div>';
          Text +='</div>';
     };


     Text +='</div>';

     if(selectSetting == "parentControl" && parentPin != ''){
          Text +='<div class="row accountButtons">';
          Text += '<div class="col-md-6"><div class="floatLeft"><a id="pinUpdate" class="btn btn-default accountBtn accountBack "  source="sourceUpdatePin">UPDATE</a></div></div>';
          Text += '<div class="col-md-6"><div class="floatRight"><a id="accountCloseParental" class="btn btn-default accountBtn accountBack"  source="sourceUpdatePin">CLOSE</a></div></div>';
          Text +='</div>';
     }else if(selectSetting == "accountInfo"){

     }else if(selectSetting == "parentControlTurnOff" && parentPin){
          Text +='<div class="row accountButtons">';
          Text += '<div class="col-md-6"><div class="floatLeft"><a id="turnOffPinSave" class="btn btn-default accountBtn accountBack "  source="sourceParentControlTurnOff">OK</a></div></div>';
          Text += '<div class="col-md-6"><div class="floatRight"><a id="accountCloseParental" class="btn btn-default accountBtn accoutnLogout"  source="sourceParentControlTurnOff">CLOSE</a></div></div>';
          Text +='</div>';

     }else if(selectSetting == "parentControl" && parentPin == ''){
          Text +='<div class="row accountButtons">';
          Text += '<div class="col-md-6"><div class="floatLeft"><a id="accountSave" class="btn btn-default accountBtn accountBack "  source="sourceAddPin">SAVE</a></div></div>';
          Text += '<div class="col-md-6"><div class="floatRight"><a id="accountCloseParental" class="btn btn-default accountBtn accoutnLogout"  source="sourceAddPin">CLOSE</a></div></div>';
          Text +='</div>';

     }else{

          Text +='<div class="row accountButtons">';
          Text += '<div class="col-md-6"><div class="floatLeft"><a id="accountSave" class="btn btn-default accountBtn accountBack "  source="settingBtn">SAVE</a></div></div>';
          Text += '<div class="col-md-6"><div class="floatRight"><a id="accountClose" class="btn btn-default accountBtn accoutnLogout"  source="settingBtn">CLOSE</a></div></div>';
          Text +='</div>';
     }

     Text +='</div>';
     Text += '<div class="homeBottom">';
     Text +='</div>';
     Text +='</div></div>';
     return Text;
};

Util.singleMovie = function() {
     if (Main.screenHeight < 1000)
          return Util.singleMovie_720p();

     return Util.singleMovie_1080p();
};

Util.singleMovie_720p = function() {
     var Text = '';
     Text += '<div class="SingleMoviePageContainer_720p">';
     Text += '     <div class="SingleHeader_720p">';
     Text += '          <img src="images/tamasha_logo.png"/>';
     Text += '     </div>';
     Text += '     <div class="SingleBarMiddle_720p">';
     Text += '     </div>';
     Text += '     <div class="SingleImage_720p">';
     Text += '          <img src="' + singleMovie.info.movie_image + '" onerror="this.src=\'images/noimage.png\';"/>';
     Text += '     </div>';
     Text += '     <div class="SingleTitle_720p">';
     Text += '          <h1>'+ singleMovie.movie_data.name +'</h1>';
     Text += '          <h3>'+ singleMovie.info.genre +'</h3>';
     Text += '          <h3>'+ durToTime(singleMovie.info.duration_secs) +'</h3>';
     Text += '     </div><div class="SingleDirector_720p">';
     Text += '          <h3 style="-webkit-line-clamp:1;line-clamp:1">DIRECTOR : '+ singleMovie.info.director +'</h3>';
     Text += '          <h3>CAST : '+ singleMovie.info.cast +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleRating_720p">';
     Text += '          <h3>'+ (singleMovie.info.releaseDate===undefined?singleMovie.info.releasedate:singleMovie.info.releaseDate) +'</h3>';
     Text += '          <div>';

               var rating = parseInt(singleMovie.info.rating_count_kinopoisk);
               if (rating <= 0)
                    rating = 3;
               for (var i=0; i<rating; i++) {
                    Text += '<img src="images/star.png">';
               }

     Text += '</div>';
     Text += '          <h3>'+ (singleMovie.info.age==""?"PG-13":singleMovie.info.age) +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleDesc_720p">';
     Text += '          <p>'+ singleMovie.info.plot +'</p>';
     Text += '     </div>';
     Text += '     <div class="SingleButtons_720p">';
     Text += '          <div class="SinglePlayButton_720p imageFocus" id="play" stream_id="'+singleMovie.movie_data.stream_id+'" >';
     Text += '               <img src="images/play.png">';
     Text += '          </div>';
     Text += '          <div class="SingleTrailerButton_720p" id="trailer" >';
     Text += '               <img src="images/teaser.png">';
     Text += '          </div>';
     Text += '          <div class="SingleFavButton_720p" id="fav">';
     var keys = Object.keys(Main.getFavMovies());
     if (jQuery.inArray('' + openedMovieID, keys) != -1) {
          Text += '               <img src="images/favouriteselected.png">';
     } else {
          Text += '               <img src="images/favourite.png">';
     }
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';
     
     return Text;
};

Util.singleMovie_1080p = function() {
     var Text = '';
     Text += '<div class="SingleMoviePageContainer">';
     Text += '     <div class="SingleHeader">';
     Text += '          <img src="images/tamasha_logo.png"/>';
     Text += '     </div>';
     Text += '     <div class="SingleBarMiddle">';
     Text += '     </div>';
     Text += '     <div class="SingleImage">';
     Text += '          <img src="' + singleMovie.info.movie_image + '" onerror="this.src=\'images/noimage.png\';"/>';
     Text += '     </div>';
     Text += '     <div class="SingleTitle">';
     Text += '          <h1>'+ singleMovie.movie_data.name +'</h1>';
     Text += '          <h3>'+ singleMovie.info.genre +'</h3>';
     Text += '          <h3>'+ durToTime(singleMovie.info.duration_secs) +'</h3>';
     Text += '     </div><div class="SingleDirector">';
     Text += '          <h3 style="-webkit-line-clamp:1;line-clamp:1">DIRECTOR : '+ singleMovie.info.director +'</h3>';
     Text += '          <h3>CAST : '+ singleMovie.info.cast +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleRating">';
     Text += '          <h3>'+ (singleMovie.info.releaseDate===undefined?singleMovie.info.releasedate:singleMovie.info.releaseDate) +'</h3>';
     Text += '          <div>';

               var rating = parseInt(singleMovie.info.rating_count_kinopoisk);
               if (rating <= 0)
                    rating = 3;
               for (var i=0; i<rating; i++) {
                    Text += '<img src="images/star.png">';
               }

     Text += '</div>';
     Text += '          <h3>'+ (singleMovie.info.age==""?"PG-13":singleMovie.info.age) +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleDesc">';
     Text += '          <p>'+ singleMovie.info.plot +'</p>';
     Text += '     </div>';
     Text += '     <div class="SingleButtons">';
     Text += '          <div class="SinglePlayButton imageFocus" id="play" stream_id="'+singleMovie.movie_data.stream_id+'" >';
     Text += '               <img src="images/play.png">';
     Text += '          </div>';
     Text += '          <div class="SingleTrailerButton" id="trailer" >';
     Text += '               <img src="images/teaser.png">';
     Text += '          </div>';
     Text += '          <div class="SingleFavButton" id="fav">';
     var keys = Object.keys(Main.getFavMovies());
     if (jQuery.inArray('' + openedMovieID, keys) != -1) {
          Text += '               <img src="images/favouriteselected.png">';
     } else {
          Text += '               <img src="images/favourite.png">';
     }
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';
     
     return Text;
};

Util.playTrailer = function (yid){
     var Text = '<iframe ';
     if (Main.screenHeight < 1000)
          Text += ' width="1280" height="720" style="width:1280px;height=720px;border:none;border-width:0;left:0;top:0"';
     else
          Text += ' width="1920" height="1080" style="width:1920px;height=1080px;border:none;border-width:0;left:0;top:0"';

     Text += ' src="https://www.youtube.com/embed/'+ yid +'?autoplay=1&controls=0"></iframe>';

     return Text;
};

Util.singleMovie2 = function(){
     var Text = '';
     Text += '<div  class="no-padding row singleRow" style="margin: 0px;" >';
     Text += '<div  class="col-sm-12 no-padding" >';
     Text += '<div  class= "header clearfix" id="heading" >';
     Text += '<div  class="container">'	;
     Text += '<div class="logo col-sm-4 p-left margin30"><img src="images/home-logo.png"/></div>';
     Text += '<div class="col-sm-8 text-center"><h1 class="main-title">Movie INFO</h1></div>';
     //Text += '<div class="form-search navItem floatRight col-sm-4 p-right"> <input type="text" placeholder="search" id="searchBox" id="searchBox" id="searchBox" id="searchBox" id="searchBox" id="searchBox" class="searchBar"></div>'
     Text += '</div>';
     Text += '</div>';
     Text += '</div>';
     Text += "<div class='col-sm-12'>";
     Text += "<div class='topMovie'>";
     Text += '<div class="singleMovieName">'+singleMovie.movie_data.name+'</div>';
     Text += '<div class="playSingle imageFocus" id="btnPlayMovie" source="playButton"><img src="images/play-icon2.png"></div>';
     if(singleMovie.info.movie_image) {
          Text+= '<div class="singleImgBack" style="background:url('+singleMovie.info.movie_image+') no-repeat;background-size: cover;">';
     } else
          Text+= '<div class="singleImgBack" style="background:url(images/vod_backgound.jpg) no-repeat;background-size: cover;">';
     Text +='</div>';
     Text +='</div>';
     Text +='<div class="bottomDiv" style="height: 20%;"></div >';
     Text += '<div class="container miscContain">';

     Text +='<div class="col-md-5">';
     Text += '<div ><b class="headSingle">Directed By : </b> '+(singleMovie.info.director?singleMovie.info.director:"N/a") + '</div>';

     Text += "</div>";
     Text +='<div class="col-md-1"></div>';
     Text +='<div class="col-md-6">';
     Text += '<div><b>Release Date : </b> '+(singleMovie.info.releaseDate?singleMovie.info.releaseDate : "N/a") + '</div>';
     Text += "</div>";

     Text +='<div class="col-md-12">'+ ( (singleMovie.info.plot && singleMovie.info.plot.length > 280 ) ? singleMovie.info.plot.substring(0,280)+" .." : "")+'</div>';

     Text +='<div class="col-md-5">';
     Text += '<div ><b class="headSingle">Duration : </b> '+(singleMovie.info.duration?singleMovie.info.duration : "N/a")+ '</div>';
     Text += '<div ><b class="headSingle">Rating : </b> ';
     var rating = Math.ceil(singleMovie.info.rating / 2);
     if(rating >= 1)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';

     if(rating >= 2)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';
     if(rating >= 3)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';
     if(rating >= 4)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';
     if(rating >= 5)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';

     Text += '</div>';

     Text += '</div>';
     Text +='<div class="col-md-1"></div>';
     Text +='<div class="col-md-6">';
     //   Text += '<div><b>Release Date : </b> '+(singleMovie.info.director?singleMovie.info.director : "N/a") + '</div>'
     var cast = '';
     if(singleMovie.info && singleMovie.info.cast && singleMovie.info.cast.length > 70)
          cast = singleMovie.info.cast.substring(0,70) + "..";
     else 
          cast =  singleMovie.info.cast;
     Text += '<div><b>Cast : </b> '+ (cast? cast : "N/a" )+ '</div>';

     Text += '</div>';

     Text += '</div>';

     Text += '<div class="container miscContain">';
     Text += '<a class="relatedM" style="float:left;">Related Movies</a>';
     var items = JSON.parse(window.localStorage.getItem('favMoviesList'));
     var itemsKeys = items!=null?Object.keys(items):null;
     //                    alert(singleMovie.movie_data.stream_id);
     //                    alert(items);
     //                    alert(singleMovie.movie_data.stream_id);
     if(itemsKeys!=null && jQuery.inArray(singleMovie.movie_data.stream_id+'', itemsKeys) != -1) {
          Text += '<a id="removeFromFavMovie" source="favButton" class="btn btn-default accountBtn accountBack" style="border: none;margin-left: 30px;border-radius: 20px;height: 50px;line-height: 38px;" onclick="removeFromFavMovie('+singleMovie.movie_data.stream_id+')">Remove from Favourite</a>';
     }else{
          Text += '<a id="addToFavMovie" source="favButton" class="btn btn-default accountBtn accountBack" style="border: none;margin-left: 30px;border-radius: 20px;height: 50px;line-height: 38px;" onclick="addToFavMovie('+singleMovie.movie_data.stream_id+')">Add to Favourite</a>';
     }

     Text += '<div id="relatedData">';

     var relatedData = vodSectionDetails.slice(0,15);
     singleMovieRelatedData = relatedData;
     for(var i = 0;i < relatedData.length;i++){
          Text += '<div class="relatedSec">';
          Text += Util.generateRelatedCard(relatedData[i],0,i,i,relatedData.length);
          Text += '</div>';
     }
     Text +='</div>';

     Text +='</div>';

     Text += '</div>';
     Text +='</div>';
     return Text;
};
Util.tvEpisode = function(obj,index,count){
     var Text = '';
     Text += '<div  class="episode" id="tvEpisode-'+index+'" index='+index+' count="'+count+'" source="episodes" >';
     Text += '<div  class="col-md-3"  >';

     var icon = '';
     if(obj.info){
          if(obj.info.movie_image)
               icon = obj.info.movie_image;
          if (icon === undefined || icon.length == 0)
               icon = 'images/show.png';
          Text += '<div class="epsDiv" ><img src="images/movie-icon.png"></div>';
          Text += '<img src="'+icon+'"  onerror="this.src=\'images/show.png\';" height="160px">';
          Text += '</div>';
          
          Text += '<div  class="col-md-9"  >';
          Text += '<b class="headEps">'+obj.title+'</b>';
          Text += '<b class="headEpsDuration">'+(obj.info.duration===undefined?'00:00:00':obj.info.duration)+'</b>';
          var desc = '';
          if(obj.info.plot && obj.info.plot.length > 250)
               desc = obj.info.plot.substring(0,250) + "..";
          else
               desc = obj.info.plot;

          Text += '<p>'+(desc?desc:"")+'</p>';
          Text += '</div>';
     }
     
     Text += '</div>';
     return Text;
};

Util.tvShowDetails = function() {
     if (Main.screenHeight < 1000)
          return Util.tvShowDetails_720p();

     return Util.tvShowDetails_1080p();
};

Util.tvShowDetails_720p = function() {
     var Text = '';
     
     Text += '<div class="SingleMoviePageContainer_720p">';
     Text += '     <div class="SingleHeader_720p">';
     Text += '          <img src="images/tamasha_logo.png"/>';
     Text += '     </div>';
     Text += '     <div class="SingleBarMiddle_720p">';
     Text += '     </div>';
     Text += '     <div class="SingleImage_720p">';
     Text += '          <img src="' + seriesPage.info.cover + '" onerror="this.src=\'images/noimage.png\';"/>';
     Text += '     </div>';
     Text += '     <div class="SingleTitle_720p">';
     Text += '          <h1>'+ seriesPage.info.name +'</h1>';
     Text += '          <h3>'+ seriesPage.info.genre +'</h3>';
     //Text += '          <h3>'+ durToTime(seriesPage.info.episode_run_time) +'</h3>';
     Text += '     </div><div class="SingleDirector_720p">';
     Text += '          <h3 style="-webkit-line-clamp:1;line-clamp:1">DIRECTOR : '+ seriesPage.info.director +'</h3>';
     Text += '          <h3>CAST : '+ seriesPage.info.cast +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleRating_720p">';
     Text += '          <h3>'+ (seriesPage.info.releaseDate===undefined?seriesPage.info.releasedate:seriesPage.info.releaseDate) +'</h3>';
     Text += '          <div>';

               var rating = parseInt(seriesPage.info.rating_5based);
               if (rating <= 0)
                    rating = 3;
               for (var i=0; i<rating; i++) {
                    Text += '<img src="images/star.png">';
               }

     Text += '</div>';
     Text += '          <h3>'+ (seriesPage.info.age===undefined || seriesPage.info.age==""?"PG-13":seriesPage.info.age) +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleDesc_720p">';
     Text += '          <p>'+ seriesPage.info.plot +'</p>';
     Text += '     </div>';
     Text += '     <div class="SingleButtons_720p">';
     Text += '          <div class="SinglePlayButton_720p imageFocus" id="episodes">';
     Text += '               <img src="images/SERIES.png">';
     Text += '          </div>';
     Text += '          <div class="SingleTrailerButton_720p" id="trailer" >';
     Text += '               <img src="images/teaser.png">';
     Text += '          </div>';
     Text += '          <div class="SingleFavButton_720p" id="fav">';
     var keys = Object.keys(Main.getFavSeries());
     if (jQuery.inArray('' + openedSeriesID, keys) != -1) {
          Text += '               <img src="images/favouriteselected.png">';
     } else {
          Text += '               <img src="images/favourite.png">';
     }
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';
     
     return Text;
};

Util.tvShowDetails_1080p = function() {
     var Text = '';
     
     Text += '<div class="SingleMoviePageContainer">';
     Text += '     <div class="SingleHeader">';
     Text += '          <img src="images/tamasha_logo.png"/>';
     Text += '     </div>';
     Text += '     <div class="SingleBarMiddle">';
     Text += '     </div>';
     Text += '     <div class="SingleImage">';
     Text += '          <img src="' + seriesPage.info.cover + '" onerror="this.src=\'images/noimage.png\';"/>';
     Text += '     </div>';
     Text += '     <div class="SingleTitle">';
     Text += '          <h1>'+ seriesPage.info.name +'</h1>';
     Text += '          <h3>'+ seriesPage.info.genre +'</h3>';
     //Text += '          <h3>'+ durToTime(seriesPage.info.episode_run_time) +'</h3>';
     Text += '     </div><div class="SingleDirector">';
     Text += '          <h3 style="-webkit-line-clamp:1;line-clamp:1">DIRECTOR : '+ seriesPage.info.director +'</h3>';
     Text += '          <h3>CAST : '+ seriesPage.info.cast +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleRating">';
     Text += '          <h3>'+ (seriesPage.info.releaseDate===undefined?seriesPage.info.releasedate:seriesPage.info.releaseDate) +'</h3>';
     Text += '          <div>';

               var rating = parseInt(seriesPage.info.rating_5based);
               if (rating <= 0)
                    rating = 3;
               for (var i=0; i<rating; i++) {
                    Text += '<img src="images/star.png">';
               }

     Text += '</div>';
     Text += '          <h3>'+ (seriesPage.info.age===undefined || seriesPage.info.age==""?"PG-13":seriesPage.info.age) +'</h3>';
     Text += '     </div>';
     Text += '     <div class="SingleDesc">';
     Text += '          <p>'+ seriesPage.info.plot +'</p>';
     Text += '     </div>';
     Text += '     <div class="SingleButtons">';
     Text += '          <div class="SinglePlayButton imageFocus" id="episodes">';
     Text += '               <img src="images/SERIES.png">';
     Text += '          </div>';
     Text += '          <div class="SingleTrailerButton" id="trailer" >';
     Text += '               <img src="images/teaser.png">';
     Text += '          </div>';
     Text += '          <div class="SingleFavButton" id="fav">';
     var keys = Object.keys(Main.getFavSeries());
     if (jQuery.inArray('' + openedSeriesID, keys) != -1) {
          Text += '               <img src="images/favouriteselected.png">';
     } else {
          Text += '               <img src="images/favourite.png">';
     }
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';
     
     return Text;
};

Util.tvShowDetails2 = function(){
     var Text = '';
     Text += '<div  class="no-padding row singleRow"  style="margin: 0px;" >';
     Text += '<div  class="col-sm-12 no-padding" >';
     Text += '<div  class= "header clearfix" id="heading" >';
     Text += '<div  class="container">'	;
     Text += '<div class="logo col-sm-4 p-left margin30"><img src="images/home-logo.png"/></div>';
     Text += '<div class="col-sm-8 text-center"><h1 class="main-title">SERIES INFO</h1></div>';
     //Text += '<div class="form-search navItem floatRight col-sm-4 p-right"> <input type="text" placeholder="search" id="searchBox" id="searchBox" id="searchBox" id="searchBox" id="searchBox" id="searchBox" class="searchBar"></div>'
     Text += '</div>';
     Text += '</div>';

     Text += '</div>';

     Text += "<div class='col-sm-12'>";
     Text += "<div class='topMovie'>";
     Text += '<div class="singleMovieName">'+seriesPage.info.name+'</div>';
     Text += '<div class="playSingle imageFocus"  id="btnPlayMovie"  source="playButton" ><img src="images/play-icon2.png"></div>';
     if(seriesPage.info.backdrop_path && seriesPage.info.backdrop_path.length) {
          Text+= '<div class="singleImgBack" style="background:url('+seriesPage.info.backdrop_path[0]+') no-repeat;    background-size: cover;">';
          //console.log(seriesPage.info.backdrop_path[0]);
     } else
          Text+= '<div class="singleImgBack" style="background:url(images/vod_backgound.jpg) no-repeat;    background-size: cover;">';

     Text +='</div>';
     Text +='</div>';

     Text += '<div class="container miscContain">';

     Text +='<div class="col-md-5">';
     Text += '<div ><b class="headSingle">Directed By : </b> '+(seriesPage.info.director?seriesPage.info.director : "N/a" )+ '</div>';
     Text += '<div ><b class="headSingle">Genre : </b> '+ ( seriesPage.info.genre ? seriesPage.info.genre : "N/a" )+ '</div>';
     Text += '<div ><b class="headSingle">Rating : </b> ';
     var rating = Math.ceil(seriesPage.info.rating / 2);
     if(rating >= 1)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';

     if(rating >= 2)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';
     if(rating >= 3)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';
     if(rating >= 4)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';
     if(rating >= 5)
          Text += '<span class="fa fa-star checked"></span>';
     else
          Text += '<span class="fa fa-star "></span>';

     Text += '</div>';

     Text += '</div>';
     Text +='<div class="col-md-1"></div>';
     Text +='<div class="col-md-6">';
     Text += '<div><b>Release Date : </b> '+ (seriesPage.info.releaseDate? seriesPage.info.releaseDate : "N/a") + '</div>';
     Text += '<div><b>Seasons : </b> '+ (seriesPage.episodes? Object.keys(seriesPage.episodes).length : "N/a") + '</div>';
     var cast = '';
     if(seriesPage.info.cast.length > 70)
          cast = seriesPage.info.cast.substring(0,70) + "..";
     else 
          cast =  seriesPage.info.cast;
     Text += '<div><b>Cast : </b> '+ (cast ? cast : "N/a" )+ '</div>';

     Text += '</div>';

     Text += '</div>';
     if(seriesPage.episodes){
          var keys = Object.keys(seriesPage.episodes);
          Text += '<div class="container miscContain">';
          Text += '<a class="relatedM" id="seasonSelector" season='+keys[0]+' source="seasonSelector">Season - '+keys[0]+'</a>';

          var items = JSON.parse(window.localStorage.getItem('favSeriesList'));
          var itemsKeys = items!=null?Object.keys(items):null;
     //                           alert(items);
     //                           alert(openedSeriesID);
          if(itemsKeys!=null && jQuery.inArray(openedSeriesID+'', itemsKeys) != -1) {
               Text += '<a id="removeFromFavSeries" source="favButton" class="btn btn-default accountBtn accountBack" style="border: none;margin-left: 30px;border-radius: 20px;height: 50px;line-height: 38px;" onclick="removeFromFavSeries('+openedSeriesID+')">Remove from Favourite</a>';
          }else{
               Text += '<a id="addToFavSeries" source="favButton" class="btn btn-default accountBtn accountBack" style="border: none;margin-left: 30px;border-radius: 20px;height: 50px;line-height: 38px;" onclick="addToFavSeries('+openedSeriesID+')">Add to Favourite</a>';
          }
     //
          Text += '<div id="relatedSeries">';

     /*   var relatedData = vodSectionDetails.slice(0,15);

     for(var i = 0;i < relatedData.length;i++){
     Text += '<div class="relatedSec">'
     Text += Util.generateRelatedCard(relatedData[i],0,i,i,relatedData.length);
     Text += '</div>'
     } */

          var data = seriesPage.episodes[keys[0]];
          for(var i = 0;i < data.length;i++){
               Text += '<div class="">';
               Text += Util.tvEpisode(data[i],i,data.length);
               Text += '</div>';
          }

          Text +='</div>';

          Text +='</div>';
     }
     else{
          Text += '<div class="container miscContain">';
          Text += '<a class="relatedM" id="seasonSelector" style="    margin: 0% 38%;" >No Episodes Found.</a>';
          Text += '</div>';
     }

     Text +='</div>';
     return Text;
};

Util.vodMoviesPage2 = function(moviesData){
     var Text = '';
     Text += '<div  class="no-padding row" id="" >';

     Text += '<div  class="col-sm-12 no-padding" >';
     Text += '<div  class= "header clearfix" id="heading" >';
     Text += '<div  class="container">'	;
     Text += '<div class="logo col-sm-4 p-left margin30"><img src="images/home-logo.png"/></div>';
     Text += '<div class="col-sm-8 text-center"><h1 class="main-title">'+vodSectionDetails.category.category_name+'</h1></div>';
     //Text += '<div class="form-search navItem floatRight col-sm-4 p-right"> <input type="text" placeholder="search" id="searchBox" id="searchBox" id="searchBox" id="searchBox" id="searchBox" id="searchBox" class="searchBar"></div>'
     Text += '</div>';
     Text += '</div>';

     Text += '</ul></div>';
     Text +='</div>';

     Text += '<div class="inner">';
     Text += '<div class="center-layout">';
     Text += '<div id="moviesList">';                 

     if (searchWords.length>0) {
          var tempData = [];
          for(var i=0;i<moviesData.length;i++){
               if (moviesData[i].name && moviesData[i].name.toLowerCase().indexOf(searchWords.toLowerCase())>-1) {
                    tempData.push(moviesData[i]);
               }
          }

          moviesData = tempData;
     }
     var rowID = 0;
     for(var i=0;i<moviesData.length;i++){

          var v_index = Math.floor(i/numberOfVods);
          var h_index = i % numberOfVods;
          if(v_index < numberOfVodRows){
               if(h_index == 0){
                    Text += "<div id='vodRow-"+v_index+"' class='row bottom40'>";
               }
               Text +="<div class='col-5-eq'>";
               Text += Util.generateMovieCard(moviesData[i],v_index,h_index,i,moviesData.length);
               //Text += Util.generatetvShowCard(homeTvShowData[i],v_index,h_index,i,homeTvShowData.length);
               Text +="</div>";
               if(h_index == numberOfVods-1){
                    Text += "</div>";
               }
          }

     }
     Text +='<div class="bottomDiv"></div >';
     Text +='</div >';
     Text +='</div >';
     Text +='</div >';
     Text += '</div>';
     Text += '</div>';

     return Text;
};

Util.vodMoviesPage = function(moviesData){
     //if (Main.screenHeight < 1000)
          //return Util.vodMoviesPage_720p(moviesData);

     return Util.vodMoviesPage_1080p(moviesData);
};

Util.vodMoviesPage_1080p = function(moviesData){
     var Text = '';
     lastVodTopIndex = 0;
     if (searchWords.length>0) {
          var tempData = [];
          for(var i=0;i<moviesData.length;i++){
               if (moviesData[i].name && moviesData[i].name.toLowerCase().indexOf(searchWords.toLowerCase())>-1) {
                    tempData.push(moviesData[i]);
               }
          }

          moviesData = tempData;
     }
     var rowID = 0;
     for(var i=0;i<moviesData.length;i++){

          var v_index = Math.floor(i/numberOfVods);
          var h_index = i % numberOfVods;
          if(v_index < numberOfVodRows){
               if(h_index == 0){
                    Text += "<div id='vodRow-"+v_index+"' class='row bottom40'>";
               }
               Text +="<div class='col-5-eq'>";
               Text += Util.generateMovieCard(moviesData[i],v_index,h_index,i,moviesData.length);
               //Text += Util.generatetvShowCard(homeTvShowData[i],v_index,h_index,i,homeTvShowData.length);
               Text +="</div>";
               if(h_index == numberOfVods-1){
                    Text += "</div>";
               }
          }

     }
     Text +='<div class="bottomDiv"></div >';

     return Text;
};

Util.addMovieRow = function(v_indexAdd){
     var Text = '';
     var rowID = 0;
     var moviesData = vodSectionDetails;
     if (searchWords.length>0) {
          var tempData = [];
          for(var i=0;i<moviesData.length;i++){
               if (moviesData[i].name && moviesData[i].name.toLowerCase().indexOf(searchWords.toLowerCase())>-1) {
                    tempData.push(moviesData[i]);
               }
          }

          moviesData = tempData;
     }

     for(var i= (v_indexAdd)*numberOfVods;i<moviesData.length;i++){

          var v_index = Math.floor(i/numberOfVods);
          var h_index = i % numberOfVods;

          if(v_index == v_indexAdd){

               if(h_index == 0){
                    Text += "<div id='vodRow-"+v_index+"' class='row bottom40'>";
               }
               Text +="<div class='col-5-eq'>";
               Text += Util.generateMovieCard(moviesData[i],v_index,h_index,i,moviesData.length);
               Text +="</div>";
               if(h_index == numberOfVods-1){
                    Text += "</div>";
               }
          }
          else{
               break;
          }

     }
     return Text;
};
Util.generateMovieCard = function(obj,v,h,i,count){
     var Text = '';
     var streamId = '',type = '';
     var modified = 0;
     if(obj.series_id){
          type = "show";
          streamId = obj.series_id;
          openedSeriesID = streamId;
          modified = obj.last_modified;
     }
     else{
          type = "movie";
          streamId = obj.stream_id;
          modified = obj.added;
     }
     if (imageFocus == null)
          imageFocus = 'vodMovies-' + v + '-' + h;
     Text += '<div><div class="shows-image"  type= "'+type+'" v_index="'+v+'" h_index="'+h+'" stream_id="'+streamId+'"	index='+i+' id="vodMovies-'+v+"-"+h+'" count='+count+' >';
     var icon = '';
     if(obj.cover)
          icon = obj.cover;
     else
          icon = obj.stream_icon;

     if(type == "show"){
          var items = JSON.parse(window.localStorage.getItem('favSeriesList'));
          var itemsKeys = items!=null?Object.keys(items):null;
     }else{
          var items = JSON.parse(window.localStorage.getItem('favMoviesList'));
          var itemsKeys = items!=null?Object.keys(items):null;
     }
     /*
     if(itemsKeys!=null && jQuery.inArray(streamId+'', itemsKeys) != -1) {
          Text +='<div id="favDiv_'+streamId+'">'+showMovieUpdated(modified)+'<img src="images/favouriteselected.png" style="position: absolute;width: 30px;z-index: 99999;margin-left: 10px;margin-top: 10px;"></div>';
     }else{
          Text +='<div id="favDiv_'+streamId+'">'+showMovieUpdated(modified)+'</div>';
     }
     */
     Text += '<img src="' + icon + '"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     //Text += '</div>'
     Text += '<div class="pText"><p>';
     if(obj.name && obj.name.length < 21)
          Text += '<span>'+obj.name+'</span></p></div></div></div>';
     else
          Text += '<span  class="">'+obj.name+'</span></p></div></div></div>';
     return Text;
};

Util.addEpisodesRow = function(v_indexAdd){
     var Text = '';
     var episodesMap = seriesPage.episodes;
     var icon = seriesPage.info.cover;
     var count = 0;
     for (var key in episodesMap) {
          var episodes = episodesMap[key];
          count += episodes.length;
     }

     var iter = 0;
     for (var key in episodesMap) {
          var episodes = episodesMap[key];
          for(var i=0;i<episodes.length;i++){

               var v_index = Math.floor(i/numberOfEpisodes);
               var h_index = iter % numberOfEpisodes;
               if (v_index > v_indexAdd)
                    break;
               if(v_index == v_indexAdd) {
                    if(h_index == 0){
                         Text += "<div id='serRow-"+v_index+"' class='row bottom40b'>";
                    }
                    Text +="<div class='col-6-eq'>";
                    Text += Util.generatetvShowCard(iter, episodes[i],v_index,h_index,i,key, count, icon);
                    Text +="</div>";
                    if(h_index == numberOfEpisodes-1){
                         Text += "</div>";
                    }
               }
               
               iter++;
          }
     }
     return Text;
};

Util.generatetvShowCard = function(iter, obj,v,h,i,key,count, icon){
     var Text = '';
     if (iter==0)
          Text += '<div><div class="shows-image imageFocus" index='+i+' season="'+key+'" v_index="'+v+'" h_index="'+h+'" stream_id="'+obj.id+'"	id="serMovies-'+v+"-"+h+'" count='+count+' >';
     else
          Text += '<div><div class="shows-image" index='+i+' season="'+key+'" v_index="'+v+'" h_index="'+h+'" stream_id="'+obj.id+'" id="serMovies-'+v+"-"+h+'" count='+count+' >';
     //Text +='<div id="favDiv_'+obj.id+'">'+showMovieUpdated(obj.added)+'</div>';
     Text += '<img src="' + icon + '"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     //Text += '</div>'
     Text += '<div class="pText"><p>';
     if(obj.title && obj.title.length < 21)
          Text += '<span>'+obj.title+'</span></p></div></div></div>';
     else
          Text += '<span  class="">'+obj.title+'</span></p></div></div></div>';
     return Text;
};

Util.tvEpisodes = function(name, id, episodesMap, icon) {
     lastVodTopIndex = 0;
     var Text = '';
     
     Text += '<div class="mainHome">';
     if (Main.screenHeight < 1000)
          Text += '     <div class="mainHomeContent_720p">';
     else
          Text += '     <div class="mainHomeContent_1080p">';
     Text += '          <div class="homeHeader">';
     Text += '               <div class="logImgContainer"><img src="images/tamasha_logo.png" class="logImgCat"></div>';
     Text += '               <div class="logTitleContainer"><span id="serTitle">'+name+'</span></div>';
     Text += '               <input type="hidden" value="'+id+'" id="serId"/>';
     Text += '          </div>';
     Text += '          <div class="homeBody">';
     Text += '               <div class="row">';
     Text += '                    <div class="center-layout2">';
     Text += '                         <div id="episodesList">';

     lastEpisodesTopIndex = 0;
     var count = 0;
     for (var key in episodesMap) {
          var episodes = episodesMap[key];
          count += episodes.length;
     }

     var iter = 0;
     for (var key in episodesMap) {
          var episodes = episodesMap[key];
          for(var i=0;i<episodes.length;i++){

               var v_index = Math.floor(i/numberOfEpisodes);
               var h_index = iter % numberOfEpisodes;
               if(v_index < numberOfEpisodeRows){
                    if(h_index == 0){
                         Text += "<div id='serRow-"+v_index+"' class='row bottom40b'>";
                    }
                    Text +="<div class='col-6-eq'>";
                    Text += Util.generatetvShowCard(iter, episodes[i],v_index,h_index,i,key,count, icon);
                    Text +="</div>";
                    if(h_index == numberOfEpisodes-1){
                         Text += "</div>";
                    }
               }
               iter++;
          }
     }
     Text +='<div class="bottomDiv"></div >';

     Text += '</div>';
     Text += '                         <div class="liveDetailsName norecordfound" style="width: 100%;color:white;display:none;">';
     Text += '                              <h2><span class="namescroll" style="text-align: center;">No Record Found</span></h2>';
     Text += '                         </div>';
     Text += '                    </div>';
     Text += '               </div>';
     Text += '          </div>';
     Text += '     </div>';
     Text += '</div>';

     return Text;
};

Util.generateRelatedCard = function(obj,v,h,i,count){
     var Text = '';
     Text += '<div><div class="shows-image"  source= "related" v_index="'+v+'" h_index="'+h+'" stream_id="'+obj.stream_id+'"	index='+i+' id="relMovies-'+v+"-"+h+'" count='+count+' >';
     Text += '<img src="' + obj.stream_icon + '"  onerror="this.src=\'images/noimage.png\';" class="posterImage"/>';
     // Text += '</div>'
     Text += '<div class="pText"><p>';
     if(obj.name && obj.name.length < 21)
          Text += '<span>'+obj.name+'</span></p></div></div></div>';
     else	
          Text += '<span class="namescroll">'+obj.name+'</span></p></div></div></div>';
     return Text;
};
//sections page
Util.listSectionPage_old = function(section){
     var Text = '';
     Text += '<div class="mainHome"><div class="mainHomeContent">';

     Text += '<div class="homeHeader">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/home-logo.png" class="logImg"/></div>';
     var type = "";
     if(section.sectionType == "live"){
          type = "LIVE TV";
     }
     else if(section.sectionType == "vod"){
          type = "MOVIES";
     }
     else if(section.sectionType == "series"){
          type = "SERIES";
     }
     else if(section.sectionType == "catchup"){
          type = "CATCH UP";
     }

     Text += '<div class="col-md-4"><h1 class="LiveH1">'+type+'</h1></div>';
     Text += '<div class="col-md-4"><div class="floatRight"></div></div>';
     //<img src="images/search-ico.png" class="bellIcon"/>
     Text +='</div>';
     Text +='</div>';
     Text += '<div class="arrowsSections"><div class="leftLiveDisplay"> << </div><div class="rightLiveDisplay"> >> </div></div>';
     Text += '<div class="homeBody">';
     Text +='<div class="row" style="margin-top: -60px;">';
     var row = 0,count = parseInt(section.length / numberOfRows);
     //					alert(section.length);
     //					alert(count);
     //					       			         alert(JSON.stringify(section));
     //    					                 console.log(JSON.stringify(section));

     for(var i=0;i<section.length;){

          if(i % numberOfRows == 0 || i == 0 ){
               if(i > 8)
                    Text += '<div  id="sectionIndex-'+row+'" class="col-md-6" index='+row+' count = '+count+' style="display:none">';
               else
                    Text += '<div  id="sectionIndex-'+row+'"  index='+row+'  count = '+count+'   class="col-md-6">';
               row ++;
          }
          if(i == 0 ){
               Text +='<div id="sections-'+i+'" categ="'+section[i].category_id+'" action="'+section.type+'" sectionType="'+section.sectionType+'" count='+section.length+' rowIndex='+(row-1)+'  rowCount = '+count+' index = '+(i%numberOfRows)+' class="section imageFocus"><div class="floatLeft"><img src="images/tv-shows.png"/><p>';
               if(section[i].category_name.length < 26 )
                    Text += '<span>'+section[i].category_name+'</span>';
               else
                    Text += '<span class="namescroll">'+section[i].category_name+'</span>';
               Text += '</p></div><div class="floatRight"></div></div>';
          }else{
               Text +='<div id="sections-'+i+'" categ="'+section[i].category_id+'" action="'+section.type+'" sectionType="'+section.sectionType+'" count='+section.length+' rowIndex='+(row-1)+'  rowCount = '+count+' index = '+(i%numberOfRows)+' class="section"><div class="floatLeft"><img src="images/tv-shows.png"/><p>';
               if(section[i].category_name.length < 26 )
                    Text += '<span>'+section[i].category_name+'</span>';
               else
                    Text += '<span class="namescroll">'+section[i].category_name+'</span>';
               Text += '</p></div><div class="floatRight"></div></div>';
          }
          i++;
          if(i % numberOfRows == 0 & i != 0)
               Text += '</div>';

     }

     /* 	Text +='<div class="col-md-2"><div id="homeLiveTile" class="homeLiveTile imageFocus"><div class="wrapCenter"><img src="images/live-tv-icon.png"><p>LIVE TV</p></div></div></div>';
     Text +='<div class="col-md-4"><div  id="moviesTile" class="moviesTile"><div class="wrapLeft"><img src="images/movie-icon.png"><p>MOVIES</p></div></div></div>';
     Text +='<div class="col-md-4"><div  id="seriesTile" class="seriesTile"><div class="wrapLeft"><img src="images/series-icon.png"><p>SERIES</p></div></div></div>';
     */
     Text +='</div>';
     Text +='</div>';
     Text += '<div class="homeBottom">';
     Text +='</div>';
     Text +='</div></div>';

     return Text;
};

Util.catMax = 15;
Util.lastCatMax = 15;

Util.listSectionPage = function(section) {
     Util.lastCatMax = Util.catMax;
     var Text1 = '';
     
     Text1 += '<div class="mainHome">';
     if (Main.screenHeight < 1000)
          Text1 += '     <div class="mainHomeContent_720p">';
     else
          Text1 += '     <div class="mainHomeContent_1080p">';
     Text1 += '          <div class="homeHeader">';
     Text1 += '               <div class="logImgContainer"><img src="images/tamasha_logo.png" class="logImgCat"></div>';
     Text1 += '               <div class="logTitleContainer"><span id="catTitle"></span></div>';
     Text1 += '               <input type="hidden" value="" id="curCatId"/>';
     Text1 += '               <input type="hidden" value="" id="curCatType"/>';
     Text1 += '          </div>';
     Text1 += '          <div class="homeBody">';
     //Text1 += '               <div class="row">';
     Text1 += '                    <div class="catMenu">';
     Text1 += '                         <div id="cat0" categ="all_categ_number" source="cat" action="' + section.type +'" sectionType="'+section.sectionType+'" index=0 catName="ALL" class="catItem imageFocus">';
     Text1 += '                              <span>ALL</span>';
     Text1 += '                         </div>';
     Text1 += '                         <div id="cat1" categ="fav_categ_number" source="cat" action="' + section.type +'" sectionType="'+section.sectionType+'" index=1 catName="'+Util.favName+'" class="catItem">';
     Text1 += '                              <img src="images/favouriteselected.png">';
     Text1 += '                              <span>'+Util.favName+'</span>';
     Text1 += '                         </div>';

     var all_categ_number = 1;
     var fav_categ_number = 0;
     var j = 2;
     for (var i=0;i<section.length;i++) {
          if (section[i].category_name == 'FAVOURITE') {
               fav_categ_number = section[i].category_id;
               continue;
          }
          if ( section[i].category_name == 'ALL') {
               all_categ_number = section[i].category_id;
               continue;
          }
          var cat_name = section[i].category_name;
          /*for (var k=0; k<section[i].category_name.length; k++) {
               if (section[i].category_name[k] > '|')
                    break;
               cat_name += section[i].category_name[k];
          }*/
          cat_name = cat_name.trim();
          Text1 += '<div id="cat' + j + '" categ="'+section[i].category_id+'" source="cat" action="'+section.type+'" sectionType="'+section.sectionType+'" index=' + j + ' class="catItem" catName="' + section[i].category_name + '"';
          if (i>=(Util.lastCatMax-1)) {
               Text1 += ' style="display:none" ';
          }
        	Text1 += '><div class="catNameDiv"><span ' + (cat_name.length > 19? 'class="namescroll"':'') + '>'+cat_name+'</span></div></div>';
          
          j++;
     }

     Text1 = Text1.replace("all_categ_number", ""+all_categ_number).replace("fav_categ_number", ""+fav_categ_number);

     Util.totalCats = j - 1;
     var Text2 = '';
     Text2 += '                    </div>';
     if(section.sectionType == "live") {
          Text2 += '               <div class="catFooter"><div class="yellow_button"></div><p>Favorite +/-</p></div>';
     }
     Text2 += '                    <div id="catDisplay" class="catDisplay">';
     
     if(section.sectionType == "live") {
     

     //Text2 += '     <div class="row">';
     Text2 += '          <div class="col-md-4b liveChannels">';
     Text2 += '               <div class="">';
     Text2 += '                    <div class="row liveHeadLine rowSec" source="liveHeadLine">';
     Text2 += '                         <div class="col-md-12">';
     Text2 += '                              <h1 id="liveCatTitle"></h1>';
     Text2 += '                         </div>';
     Text2 += '                    </div>';
     Text2 += '                    <div class="liveDetails" id="liveDetails">';
     Text2 += '                    </div>';
     Text2 += '                    <div class="liveDetailsName norecordfound" style="width: 100%;display:none;">';
     Text2 += '                         <h2><span class="namescroll" style="text-align: center;">No Record Found</span></h2>';
     Text2 += '                    </div>';
     Text2 += '               </div>';
     Text2 += '          </div>';
     Text2 += '          <div class="col-md-4c liveBodyTop">';
     //Text2 += '               <div id="smallLoading" class="cssload-container" style="display:none;z-index: 99999;">';
     //Text2 += '                    <div id="loadingImg">';
     //Text2 += '                         <img src="images/Spin.png" class="imgsLoader">';
     //Text2 += '                    </div>';
     //Text2 += '               </div>';
     Text2 += '               <div class="epgListing">';
     Text2 += '                    <div id="epgListing" >';
     Text2 += '                    </div>';
     Text2 += '               </div>';
     Text2 += '               <div class="player" id="videoHtml">';
     Text2 += '                    <div id="player-wrapper" style="text-align: center;">';
     if (isTizen) {
          Text2 += '                    <object id="tv-player"';
          Text2 += '                              type="application/avplayer"';
          Text2 += '                              ></object>';
     }
     Text2 += '                    </div>';
     Text2 += '               </div>';
     Text2 += '          </div>';
     //Text2 += '     </div>';
          
     } else {
          Text2 += '<div class="inner">';
          Text2 += '               <div class="center-layout">';
          Text2 += '                    <div id="moviesList">';
          Text2 += '                    </div>';
          Text2 += '                    <div class="liveDetailsName norecordfound" style="width: 100%;color:white;display:none;">';
          Text2 += '                         <h2><span class="namescroll" style="text-align: center;">No Record Found</span></h2>';
          Text2 += '                    </div>';
          Text2 += '               </div>';
          Text2 += '          </div>';
          Text2 += '          ';
     }
     var Text3 = '';
     //Text3 += '                    </div>';
     Text3 += '               </div>';
     Text3 += '          </div>';
     Text3 += '     </div>';
     if (section.sectionType == "live") {
          if (Main.screenHeight < 1000)
               Text3 += '<div class="osd_info_720p" style="display: none;">';
          else
               Text3 += '<div class="osd_info_1080p" style="display: none;">';
          Text3 += '     <div class="osd_info_clock" style="visibility: visible;"></div>';
          Text3 += '     <div class="osd_info_time_shift_mark" style="display: none;"></div>';
          Text3 += '     <div class="osd_info_title_live"></div>';
          Text3 += '     <div class="osd_channel_number"></div>';
          Text3 += '     <div class="osd_arrow_up"><img src="images/chevron_up.png" style="width:2em;height:2em"></div>';
          Text3 += '     <div class="osd_arrow_down"><img src="images/chevron_down.png" style="width:2em;height:2em"></div>';
          Text3 += '     <div class="osd_info_logo_live">';
          Text3 += '          <img id="osd_info_logo" src="images/logo.png" style="width:6.6em;height:6.6em"';
          Text3 += '               onerror="this.src=\'images/tamasha_logo.png\';"></div>';
          Text3 += '     <div class="osd_info_epg_now" style="display: block;" descr="0"></div>';
          Text3 += '     <div class="osd_info_epg_next" style="display: block;" descr="0"></div>';
          Text3 += '</div>';
          Text3 += '<div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div>';
          Text3 += '<div class="player_onnum" style="display:none;"><span id="player_chnum"></span></div>';
     }
     Text3 += '     </div>     ';

     return Text1 + Text2 + Text3;
};

function getTwoHours(epocTime){
     var data = new Date(epocTime*1000);

     var hours = data.getHours();
     if(hours <= 9)
          hours = '0' + hours  ; 
     var minutes = data.getMinutes();
     if(minutes <= 9)
          minutes = '0' + minutes ; 

     return date = hours + ":"+minutes;
}

function getTwoHours2(dateString){
     var dtemp = new Date((Date.parse(dateString.replace(' ', 'T')) - Main.serverTimeDifference));
     dateString = formatIsoDatetime(dtemp);
     return dateString.substr(11,5);
}

Util.fullScreenMoviePage = function(title, logo, duration, tnow, desc){
     var Text = '';
     if (isTizen) {
          Text +='<object id="movie-player" type="application/avplayer" style="position:absolute; left=0px; top=0px; width=1920px; height=1080px"></object>';
          if (Main.screenHeight < 1000)
               Text +='<div class="osd_info_720p" style="display: block;">';
          else
               Text +='<div class="osd_info_1080p" style="display: block;">';
          Text +='<div class="osd_info_clock" style="visibility: visible;">'+tnow+'</div><div class="osd_backward_button"><img src="images/backward.png"></div><div class="osd_forward_button"><img src="images/forward.png"></div><div class="osd_play_pause_button"><img id="img_play_pause" src="images/playpauseicon.png"></div><div class="osd_info_title">'+ title +'</div><div class="osd_info_logo"><img src="'+logo+'"></div><div class="osd_info_epg" style="display: block;" descr="0">'+desc+'</div><div style="display: block;"><div class="pos_bar"><div class="pos_button" style="left: 0px;"></div></div><div class="pos_time"><div class="cur_pos_time" active="">00:00:00</div><div class="pos_time_separator">/</div><div class="total_pos_time">'+durToTime(duration)+'</div></div><div class="pos_series"></div></div></div>';
          if (Main.screenHeight < 1000)
               Text +='<div class="erroronplayer_fullscreen_720p"><div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div></div>';
          else
               Text +='<div class="erroronplayer_fullscreen_1080p"><div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div></div>';
     } else {
          //Text +='<div class="no-padding row" id=""><div class="col-sm-12 no-padding"><div class="header clearfix" id="heading"><div class="container"><div class="logo col-sm-4 p-left margin30"><img src="images/home-logo.png"></div><div class="col-sm-8 text-center"><h1 style="font-size: 30px;">'+Player.data.name+'</h1></div></div></div></div></div>';
          //Text +='<div class ="playerDiv imageFocus" id="videoHtml" style=" width: 70%; margin: 0 auto;margin-bottom: 5%;">';
          //Text +='<div class ="playerDiv imageFocus" id="videoHtml" style=" width: 90%; margin: auto;">';
          //Text +='<div class ="playerDiv imageFocus" id="videoHtml" style=" width: 90%; margin: auto; height: 80%;">';
          //                    Text +='<div id="player-wrapper" style="text-align: center;">'
          //
          //                    Text +='</div>'

          //Text +='<div class="PlayerHolder" data-ajplayer="" data-flowplayer="" data-jwplayer="">';
          //Text +='<div id="player-holder" class="hideOnLoad"  style="border:solid 2px #fff; height: auto !important;"  >';
          //Text +='<div id="player-holder" class="hideOnLoad"  style="margin: 0px; max-width: 89.45%; position: absolute; top: 50%; -ms-transform: translateY(-50%);transform: translateY(-50%);"  >';
          //Text +='<div id="player-holder" class="hideOnLoad"  style="margin: 0px; max-width: 89.45%;"  >';
          Text +='<div id="player-holder" class="hideOnLoad"  style="left: 0; top=0; margin: 0px; width: 100%; height: 100%">';
          Text +='</div>';
          if (Main.screenHeight < 1000)
               Text +='<div class="osd_info_720p" style="display: block;">';
          else
               Text +='<div class="osd_info_1080p" style="display: block;">';
          Text +='<div class="osd_info_clock" style="visibility: visible;">'+tnow+'</div><div class="osd_backward_button"><img src="images/backward.png"></div><div class="osd_forward_button"><img src="images/forward.png"></div><div class="osd_play_pause_button"><img id="img_play_pause" src="images/playpauseicon.png"></div><div class="osd_info_title">'+ title +'</div><div class="osd_info_logo"><img src="'+logo+'"></div><div class="osd_info_epg" style="display: block;" descr="0">'+desc+'</div><div style="display: block;"><div class="pos_bar"><div class="pos_button" style="left: 0px;"></div></div><div class="pos_time"><div class="cur_pos_time" active="">00:00:00</div><div class="pos_time_separator">/</div><div class="total_pos_time">'+durToTime(duration)+'</div></div><div class="pos_series"></div></div></div>';
          if (Main.screenHeight < 1000)
               Text +='<div class="erroronplayer_fullscreen_720p"><div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div></div>';
          else
               Text +='<div class="erroronplayer_fullscreen_1080p"><div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div></div>';
          //Text +='</div>';
          //Text +='</div>';
     }

     return Text;
};

Util.fullScreenCatchUpPage = function(programName, tnow, channelName, duration, desc, logo){
     var Text = '';

     if (isTizen) {
          Text +='<object id="tv-player" type="application/avplayer" style="position:relative; left=0px; top=0px; width=1920px; height=1080px"></object>';
          //Text +='<div id="overlay"><div id="textover">Overlay Text</div></div>';
          Text +='<div class="osd_info" style="display: block;"><div class="osd_info_clock" style="visibility: visible;">'+tnow+'</div><div class="osd_info_time_shift_mark" style="display: none;"></div><div class="osd_info_title">'+channelName + ' - ' + programName +'</div><div class="osd_info_logo_catchup"><img src="'+logo+'"></div><div class="osd_info_epg" style="display: block;" descr="0">'+desc+'</div><div style="display: block;"><div class="pos_bar"><div class="pos_button" style="left: 0px;"></div></div><div class="pos_time"><div class="cur_pos_time" active="">00:00:00</div><div class="pos_time_separator">/</div><div class="total_pos_time">'+durToTime(duration)+'</div></div><div class="pos_series"></div></div></div>';
          Text +='<div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div>';
     } else {
          //Text +='<div class="no-padding row" id=""><div class="col-sm-12 no-padding"><div class="header clearfix" id="heading"><div class="container"><div class="logo col-sm-4 p-left margin30"><img src="images/home-logo.png"></div><div class="col-sm-8 text-center"><h1 style="font-size: 30px;">'+programName+'</h1></div></div></div></div></div>';

          //Text +='<div class ="playerDiv imageFocus" id="videoHtml" style=" width: 70%; margin: 0 auto;margin-bottom: 5%;">';
          //Text +='<div class ="playerDiv imageFocus" id="videoHtml" style=" width: 90%; margin: auto;">';
          //                    Text +='<div id="player-wrapper" style="text-align: center;">'
          //
          //                    Text +='</div>'

          // Text +='<div class="PlayerHolder" data-ajplayer="" data-flowplayer="" data-jwplayer="">'
          //                          								Text +='<div id="player-holder" class="hideOnLoad"  style="border:solid 2px #fff; height: auto !important;"  >'
          //                          								Text +='</div>'
          //                          								Text +='</div>'
          //                    Text +='</div>';

          Text +='<div id="player-wrapper" style="text-align: center; width: 100%;">';
          Text +='</div>';
          //Text +='</div>';
          Text +='<div class="osd_info" style="display: block;"><div class="osd_info_clock" style="visibility: visible;">'+tnow+'</div><div class="osd_info_time_shift_mark" style="display: none;"></div><div class="osd_info_title">'+channelName + ' - ' + programName +'</div><div class="osd_info_logo_catchup"><img src="'+logo+'"></div><div class="osd_info_epg" style="display: block;" descr="0">'+desc+'</div><div style="display: block;"><div class="pos_bar"><div class="pos_button" style="left: 0px;"></div></div><div class="pos_time"><div class="cur_pos_time" active="">00:00:00</div><div class="pos_time_separator">/</div><div class="total_pos_time">'+durToTime(duration)+'</div></div><div class="pos_series"></div></div></div>';
          Text +='<div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div>';
     }
     return Text;
}

Util.liveDetailsPage2 = function(){
     pinEntered = false;
     var Text = '';
     Text += '<div class="mainHome"><div class="mainHomeContent">';

     Text += '<div class="liveHeader">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/home-logo.png"  class="logImg"/></div>';

     Text += '<div class="col-md-4"><p></p></div>';
     Text += '<div class="col-md-4"><div class="floatRight"><h1 class="homeH1">'+ updateDateTimeHtml() + '</h1></div></div>';
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="homeBody">';
     Text +='<div class="row">';
     Text +='<div class="col-md-6 liveChannels">';

     Text +='<div class="">';
     Text +='<div class="row liveHeadLine rowSec" source="liveHeadLine"><div class="col-md-2"><img src="images/left_icon_cat.png" source="arrows"  id="leftLiveArrow" class="arrowsIcon"></div><div class="col-md-8 headSectionsLive"><p>'+liveSectionDetails.category.category_name+'</p></div>';
     Text +='<div class="col-md-2"><img src="images/right_icon_cat.png" class="arrowsIcon" source="arrows" id="rightLiveArrow" ></div></div>';

     Text +='<div class="liveDetails">';
     for(var i=0;i<liveSectionDetails.length;i++){
          if(i > numberOfLives){ break; }
          else
          //                         console.log(liveSectionDetails[i]);
               Text +='<div class="row rowSec"  source= "liveChannels" streamId="'+liveSectionDetails[i].stream_id+'"  id="liveChannel-'+i+'" index='+i+' count="'+liveSectionDetails.length+'" ><div class="liveDetailsH1"><h1 id="liveNum-'+i+'">'+liveSectionDetails[i].num+'</h1></div><div class="liveDetailsImg"><img id="logo-'+i+'" src="'+liveSectionDetails[i].stream_icon+'" style="width:86px;height:50px" onerror="this.src=\'images/logo.png\';" ></div>  <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div> <div class="liveDetailsName">';

          //                              var item = window.localStorage.getItem("favChannelsList");
          var items = JSON.parse(window.localStorage.getItem('favChannelsList'));
          var itemsKeys = items!=null?Object.keys(items):null;

          if(liveSectionDetails[i].name.length < 20){
               Text +='<h1><span id="liveName-'+i+'">'+liveSectionDetails[i].name+'</span></h1></div>';

               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }

               Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+i+'" onclick="playLink()" class="playLinkClass">Play</a>';
               if(found) {
                    Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="remove_from_fav_link_'+i+'" class="RemoveFromFavClass">Remove From Favourite</a>';
               } else {
                    Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="add_to_fav_link_'+i+'" class="addToFavClass">Add to Favourite</a>';
               }
               Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[i].stream_id+','+i+');" id="full_epg_menu_link_'+i+'"  class="fullEPGMenuClass">View Full EPG</a>';
               Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+i+'"  class="closeMenuClass">Close</a></div>';
               Text +='</div>';

          }else{
               Text +='<h1><span class="namescroll" id="liveName-'+i+'">'+liveSectionDetails[i].name+'</span></h1></div>';
               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }
               Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+i+'" onclick="playLink()" class="playLinkClass">Play</a>';
               if(found) {
                    Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="remove_from_fav_link_'+i+'" class="RemoveFromFavClass">Remove From Favourite</a>';
               } else {
                    Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="add_to_fav_link_'+i+'" class="addToFavClass">Add to Favourite</a>';
               }
               Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[i].stream_id+','+i+');" id="full_epg_menu_link_'+i+'"  class="fullEPGMenuClass">View Full EPG</a>';
               Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+i+'" class="closeMenuClass">Close</a></div>';
               Text +='</div>';
          }
     }

     Text +='</div>';
     Text +='<div class="liveDetailsName norecordfound" style="width: 100%;display:none;"><h2><span class="namescroll" style="text-align: center;">No Record Found</span></h2></div>';
     Text +='</div>';
     Text += '</div>';
     Text +='<div class="col-md-6 liveBodyTop" >';

     //Text +='<div id="smallLoading"  class="cssload-container" style="display:none;z-index: 99999;">';
     //Text +='<div id="loadingImg">';
     //Text +='          <center><img src="images/Spin.png" class="imgsLoader" /></center>';
     //Text +='     </div>';
     //Text +='</div>';
     //                    Text +='<div class="player" id="videoHtml">'
     //
     //
     //
     //                    Text += "<b class='playerReconnecting'></b>"
     //                    Text +='</div>'

     Text +='<div class ="player" id="videoHtml">';
     Text +='<div id="player-wrapper" style="text-align: center;">';
     if (isTizen)
          Text +='<object id="tv-player" type="application/avplayer" style="position:relative"></object>';
     Text +='</div>';
     Text +='</div>';

     Text +='<div class="epgListing">';

     Text +='</div>';

     Text += '</div>';
     Text +='</div>';
     Text +='</div>';

     Text +='</div>';

     Text +='<div class="osd_info" style="display: none;"><div class="osd_info_clock" style="visibility: visible;">'+ formatTime(new Date()) +'</div><div class="osd_info_time_shift_mark" style="display: none;"></div><div class="osd_info_title">'+ currentLiveInfo.chNum + ' ' + currentLiveInfo.channelName +'</div><div class="osd_info_logo_live"><img id="osd_info_logo" src="'+currentLiveInfo.logo+'" width="200px" height="200px" onerror="this.src=\'images/logo.png\';"></div><div class="osd_info_epg_now" style="display: block;" descr="0">'+ (currentLiveInfo.currentProgram.length>0?('NOW: '+ currentLiveInfo.currentProgram):'') +'</div><div class="osd_info_epg_next" style="display: block;" descr="0">'+ (currentLiveInfo.nextProgram.length>0?('NEXT: '+ currentLiveInfo.nextProgram):'') +'</div></div>';
     Text +='<div class="erroronplayer_fullscreen" style="display:none;"><span id="error_fullscreen"></span></div>';
     Text +='<div class="player_onnum" style="display:none;"><span id="player_chnum"></span></div>';

     Text +='</div></div>';

     return Text;
};

Util.liveDetailsPage = function(){
     pinEntered = false;
     var Text = '';
     /*
     <div class="row rowSec" source="liveChannels" streamid="3144" id="liveChannel-7"
                    index="7" count="42">
                    <div class="liveDetailsH1">
                         <h1 id="liveNum-7">307</h1>
                    </div>
                    <div class="liveDetailsImg"><img id="logo-7"
                              src="http://tv.indigotv.me/stp/misc/logos/240/3144.png"
                               onerror="this.src='images/tamasha_logo.png';"></div>
                    <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png"
                              class="playShowImg"> </div>
                    <div class="liveDetailsName">
                         <h1><span id="liveName-7">FOX LIFE 4K</span></h1>
                    </div>
                    <div class="liveDetailPlayImg" style="position:absolute;right:10px;"><img
                              src="images/favouriteselected.png" class="favStar hide" id="favStar_7">
                    </div>
               </div>
     */
     for(var i=0;i<liveSectionDetails.length;i++){
          if(i > numberOfLives){ break; }
          else
          //                         console.log(liveSectionDetails[i]);
               Text +='<div class="row rowSec"  source= "liveChannels" streamId="'+liveSectionDetails[i].stream_id+'"  id="liveChannel-'+i+'" index='+i+' count="'+liveSectionDetails.length+'" ><div class="liveDetailsH1"><h1 id="liveNum-'+i+'">'+liveSectionDetails[i].num+'</h1></div><div class="liveDetailsImg"><img id="logo-'+i+'" src="'+liveSectionDetails[i].stream_icon+'" onerror="this.src=\'images/tamasha_logo.png\';" ></div>  <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div> <div class="liveDetailsName">';

          //                              var item = window.localStorage.getItem("favChannelsList");
          var items = Main.getFavChannels();//JSON.parse(window.localStorage.getItem('favChannelsList'));
          var itemsKeys = items!=null?Object.keys(items):null;

          if(liveSectionDetails[i].name.length < 18){
               Text +='<h1><span id="liveName-'+i+'">'+liveSectionDetails[i].name+'</span></h1></div>';

               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="position:absolute;right:0.5em;"><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="position:absolute;right:0.5em;"><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }
          }else{
               Text +='<h1><span class="namescroll" id="liveName-'+i+'">'+liveSectionDetails[i].name+'</span></h1></div>';
               
               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="position:absolute;right:0.5em;"><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="position:absolute;right:0.5em;"><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }
          }

          Text += "</div>"
     }
     return Text;
};

Util.liveDetailsUpdate = function(newIndex) {
     var Text = '';
     var maxIndex = newIndex + ((numberOfLives/2) | 0);
     var minIndex = newIndex - ((numberOfLives/2) | 0);
     if (liveSectionDetails.length <= maxIndex) {
          maxIndex = liveSectionDetails.length - 1;
          minIndex = maxIndex - numberOfLives;
          if (minIndex < 0)
               minIndex = 0;
     } else if (minIndex < 0) {
          minIndex = 0;
          maxIndex = numberOfLives;
          if (maxIndex >= liveSectionDetails.length)
               maxIndex = liveSectionDetails.length - 1;
     }
     for(var i=minIndex;i<maxIndex+1;i++){
          //                         console.log(liveSectionDetails[i]);
          Text +='<div class="row rowSec"  source= "liveChannels" streamId="'+liveSectionDetails[i].stream_id+'"  id="liveChannel-'+i+'" index='+i+' count="'+liveSectionDetails.length+'" ><div class="liveDetailsH1"><h1 id="liveNum-'+i+'">'+liveSectionDetails[i].num+'</h1></div><div class="liveDetailsImg"><img id="logo-'+i+'" src="'+liveSectionDetails[i].stream_icon+'" onerror="this.src=\'images/tamasha_logo.png\';" ></div>  <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div> <div class="liveDetailsName">';

          //                              var item = window.localStorage.getItem("favChannelsList");
          var items = Main.getFavChannels();//JSON.parse(window.localStorage.getItem('favChannelsList'));
          var itemsKeys = items!=null?Object.keys(items):null;

          if(liveSectionDetails[i].name.length < 20){
               Text +='<h1><span id="liveName-'+i+'">'+liveSectionDetails[i].name+'</span></h1></div>';

               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }

               Text +='</div>';

          }else{
               Text +='<h1><span id="liveName-'+i+'" class="namescroll">'+liveSectionDetails[i].name+'</span></h1></div>';
               
               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }
               Text +='</div>';
          }
     }

     $('.liveDetails').html(Text);
};

Util.liveDetailsUpdate2 = function(newIndex) {
     var Text = '';
     var maxIndex = newIndex + ((numberOfLives/2) | 0);
     var minIndex = newIndex - ((numberOfLives/2) | 0);
     if (liveSectionDetails.length <= maxIndex) {
          maxIndex = liveSectionDetails.length - 1;
          minIndex = maxIndex - numberOfLives;
          if (minIndex < 0)
               minIndex = 0;
     } else if (minIndex < 0) {
          minIndex = 0;
          maxIndex = numberOfLives;
          if (maxIndex >= liveSectionDetails.length)
               maxIndex = liveSectionDetails.length - 1;
     }
     for(var i=minIndex;i<maxIndex+1;i++){
          //                         console.log(liveSectionDetails[i]);
          Text +='<div class="row rowSec"  source= "liveChannels" streamId="'+liveSectionDetails[i].stream_id+'"  id="liveChannel-'+i+'" index='+i+' count="'+liveSectionDetails.length+'" ><div class="liveDetailsH1"><h1 id="liveNum-'+i+'">'+liveSectionDetails[i].num+'</h1></div><div class="liveDetailsImg"><img id="logo-'+i+'" src="'+liveSectionDetails[i].stream_icon+'" style="width:86px;height:50px" onerror="this.src=\'images/logo.png\';" ></div>  <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div> <div class="liveDetailsName">';

          //                              var item = window.localStorage.getItem("favChannelsList");
          var items = JSON.parse(window.localStorage.getItem('favChannelsList'));
          var itemsKeys = items!=null?Object.keys(items):null;

          if(liveSectionDetails[i].name.length < 20){
               Text +='<h1><span id="liveName-'+i+'">'+liveSectionDetails[i].name+'</span></h1></div>';

               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }

               Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+i+'" onclick="playLink()" class="playLinkClass">Play</a>';
               if(found) {
                    Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="remove_from_fav_link_'+i+'" class="RemoveFromFavClass">Remove From Favourite</a>';
               } else {
                    Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="add_to_fav_link_'+i+'" class="addToFavClass">Add to Favourite</a>';
               }
               Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[i].stream_id+','+i+');" id="full_epg_menu_link_'+i+'"  class="fullEPGMenuClass">View Full EPG</a>';
               Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+i+'"  class="closeMenuClass">Close</a></div>';
               Text +='</div>';

          }else{
               Text +='<h1><span id="liveName-'+i+'" class="namescroll">'+liveSectionDetails[i].name+'</span></h1></div>';
               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }
               Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+i+'" onclick="playLink()" class="playLinkClass">Play</a>';
               if(found) {
                    Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="remove_from_fav_link_'+i+'" class="RemoveFromFavClass">Remove From Favourite</a>';
               } else {
                    Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="add_to_fav_link_'+i+'" class="addToFavClass">Add to Favourite</a>';
               }
               Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[i].stream_id+','+i+');" id="full_epg_menu_link_'+i+'"  class="fullEPGMenuClass">View Full EPG</a>';
               Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+i+'" class="closeMenuClass">Close</a></div>';
               Text +='</div>';
          }
     }

     $('.liveDetails').html(Text);
};

function addChannelRow(index){
     var Text = '';
     Text +='<div class="row rowSec '+((playingIndex == index)? "playing" : "")+'"  source= "liveChannels" streamId="'+liveSectionDetails[index].stream_id+'"  id="liveChannel-'+index+'" index='+index+' count="'+liveSectionDetails.length+'" ><div class="liveDetailsH1"><h1 id="liveNum-'+index+'">'+liveSectionDetails[index].num+'</h1></div><div class="liveDetailsImg"><img id="logo-'+index+'" src="'+liveSectionDetails[index].stream_icon+'" onerror="this.src=\'images/tamasha_logo.png\';" ></div>  <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div> <div class="liveDetailsName">';
     var items = Main.getFavChannels();//JSON.parse(window.localStorage.getItem('favChannelsList'));
     var itemsKeys = items!=null?Object.keys(items):null;

     if(liveSectionDetails[index].name.length < 18){
          Text +='<h1><span id="liveName-'+index+'">'+liveSectionDetails[index].name+'</span></h1></div>';
          if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[index].stream_id+'', itemsKeys) != -1) {
               var found = true;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+index+'"> </div>';
          }else{
               var found = false;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+index+'"> </div>';
          }
          Text +='</div>';
     }else{
          Text +='<h1><span id="liveName-'+index+'" class="namescroll">'+liveSectionDetails[index].name+'</span></h1></div>';
    	     
          if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[index].stream_id+'', itemsKeys) != -1) {
               var found = true;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+index+'"> </div>';
          }else{
               var found = false;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+index+'"> </div>';
          }
          Text +='</div>';
     }

     return Text;
}

function addChannelRow2(index){
     var Text = '';
     Text +='<div class="row rowSec '+((playingIndex == index)? "playing" : "")+'"  source= "liveChannels" streamId="'+liveSectionDetails[index].stream_id+'"  id="liveChannel-'+index+'" index='+index+' count="'+liveSectionDetails.length+'" ><div class="liveDetailsH1"><h1 id="liveNum-'+index+'">'+liveSectionDetails[index].num+'</h1></div><div class="liveDetailsImg"><img id="logo-'+index+'" src="'+liveSectionDetails[index].stream_icon+'" style="width:86px;height:50px" onerror="this.src=\'images/logo.png\';" ></div>  <div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div> <div class="liveDetailsName">';
     var items = JSON.parse(window.localStorage.getItem('favChannelsList'));
     var itemsKeys = items!=null?Object.keys(items):null;

     if(liveSectionDetails[index].name.length <= 20){
          Text +='<h1><span id="liveName-'+index+'">'+liveSectionDetails[index].name+'</span></h1></div>';
          if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[index].stream_id+'', itemsKeys) != -1) {
               var found = true;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+index+'"> </div>';
          }else{
               var found = false;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+index+'"> </div>';
          }
          Text +='<div class="dropdown-content" id="dropdown_id_'+index+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+index+'" onclick="playLink()" class="playLinkClass">Play</a>';

          if(found) {
               Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[index].stream_id+','+index+')" id="remove_from_fav_link_'+index+'" class="RemoveFromFavClass">Remove From Favourite</a>';
          } else {
               Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[index].stream_id+','+index+')" id="add_to_fav_link_'+index+'" class="addToFavClass">Add to Favourite</a>';
          }

          Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[index].stream_id+','+index+');" id="full_epg_menu_link_'+index+'"  class="fullEPGMenuClass">View Full EPG</a>';
          Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+index+'" class="closeMenuClass">Close</a></div>';
          Text +='</div>';
     }else{
          Text +='<h1><span id="liveName-'+index+'" class="namescroll">'+liveSectionDetails[index].name+'</span></h1></div>';
          if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[index].stream_id+'', itemsKeys) != -1) {
               var found = true;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+index+'"> </div>';
          }else{
               var found = false;
               Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+index+'"> </div>';
          }
          Text +='<div class="dropdown-content" id="dropdown_id_'+index+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+index+'" onclick="playLink()" class="playLinkClass">Play</a>';
          if(found) {
               Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[index].stream_id+','+index+')" id="remove_from_fav_link_'+index+'" class="RemoveFromFavClass">Remove From Favourite</a>';
          } else {
               Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[index].stream_id+','+index+')" id="add_to_fav_link_'+index+'" class="addToFavClass">Add to Favourite</a>';
          }
          Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[index].stream_id+','+index+');" id="full_epg_menu_link_'+index+'"  class="fullEPGMenuClass">View Full EPG</a>';
          Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+index+'" class="closeMenuClass">Close</a></div>';
          Text +='</div>';
     }

     return Text;
}

Util.updateSectionCat = function(){
     var Text = '';
     Text +='<div class="">';

     Text +='<div class="row liveHeadLine rowSec" source="liveHeadLine"><div class="col-md-2"><img src="images/left_icon_cat.png" source="arrows"  id="leftLiveArrow" class="arrowsIcon imageFocus"></div><div class="col-md-8 headSectionsLive"><p>'+liveSectionDetails.category.category_name+'</p></div>';
     Text +='<div class="col-md-2"><img src="images/right_icon_cat.png" class="arrowsIcon" source="arrows" id="rightLiveArrow" ></div></div>';

     Text +='<div class="liveDetails">';
     for(var i=0;i<liveSectionDetails.length;i++){
          if(i > numberOfLives){break;}
          else {
               Text +='<div class="row rowSec"  source= "liveChannels" streamId="'+liveSectionDetails[i].stream_id+'"  id="liveChannel-'+i+'" index='+i+' count="'+liveSectionDetails.length+'" >';
               Text +='<div class="liveDetailsH1"><h1>'+liveSectionDetails[i].num+'</h1></div>';
               Text +='<div class="liveDetailsImg"><img src="'+liveSectionDetails[i].stream_icon+'" style="width:86px;height:50px" onerror="this.src=\'images/logo.png\';" ></div>';
               Text +='<div class="liveDetailPlayImg"><img src="images/player_play_newflow.png" class="playShowImg" > </div>';

               Text +='<div class="liveDetailsName">';
               if(liveSectionDetails[i].name.length < 18 )
                    Text+= '<h1><span>'+liveSectionDetails[i].name+'</span></h1/></div>';
               else
                    Text+= '<h1><span class="namescroll">'+liveSectionDetails[i].name+'</span></h1/></div>';

               var items = Main.getFavChannels();//JSON.parse(window.localStorage.getItem('favChannelsList'));
               var itemsKeys = items!=null?Object.keys(items):null;

               if(itemsKeys!=null && jQuery.inArray(liveSectionDetails[i].stream_id+'', itemsKeys) != -1) {
                    var found = true;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar show" id="favStar_'+i+'"> </div>';
               }else{
                    var found = false;
                    Text +='<div class="liveDetailPlayImg" style="float: right; "><img src="images/favouriteselected.png" class="favStar hide" id="favStar_'+i+'"> </div>';
               }
               Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="margin-left: -85px;width: 250px;z-index:99;"><a href="#" id="play_link_'+i+'" onclick="playLink()" class="playLinkClass">Play</a>';

               if(found) {
                    Text +='<a href="#" onclick="removeFromFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="remove_from_fav_link_'+i+'" class="RemoveFromFavClass">Remove From Favourite</a>';
               } else {
                    Text +='<a href="#" onclick="addToFavLink('+liveSectionDetails[i].stream_id+','+i+')" id="add_to_fav_link_'+i+'" class="addToFavClass">Add to Favourite</a>';
               }

               Text +='<a href="#" onclick="viewFullEPG('+liveSectionDetails[i].stream_id+','+i+');" id="full_epg_menu_link_'+i+'"  class="fullEPGMenuClass">View Full EPG</a>';
               Text +='<a href="#" onclick="hideAddToFav();" id="close_menu_link_'+i+'" class="closeMenuClass">Close</a></div>';
               Text +='</div>';

               Text +='</div>';
          }
     }
     Text +='</div>';

     Text +='<div class="liveDetailsName norecordfound" style="width: 100%;display:none;"><h2><span class="namescroll" style="text-align: center;">No Record Found</span></h2></div>';

     Text +='</div>';
     return Text;
};

//Util.popupMenuLogin = function(){
//var Text ='';
//Text +='<div class="dropdown">'
//          Text +='<div class="dropdown-content">
//            Text +='<a href="#">Login</a>
//            Text +='<a href="#">Delete</a>
//          Text +='</div>
//        Text +='</div>';
//	return Text;
//}

Util.listUserPage = function(){
     var Text = '';
     Text += '<div class="mainHome"><div class="mainHomeContent">';

     Text += '<div class="homeHeader">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/home-logo.png" class="logImg" /></div>';
     Text += '<div class="col-md-4"><h1 class="homeH1b">LIST USERS</h1></div>';
     Text += '<div class="col-md-4"><div class="floatRight" ><img src="images/add_more_user.png"  source="addUser" class="addUserIcon"/><b id="addUserBtn">ADD USER</b></div></div>';
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="homeBody">';
     Text +='<div class="row">';
     var listData = JSON.parse(window.localStorage.getItem('listData'));
     var profile = JSON.parse(window.localStorage.getItem('profile'));
     if(!listData || !listData.length){
          Text +='<div id="listCenterButton"  class="listCenterButton imageFocus"><img src="images/add_more_user.png" class="addUserIcon2" /><b id="addUserButton">ADD NEW USER</b></div>';
     }
     else{
          for(var i=0;i<listData.length;i++){
          //						console.log(listData[i].user_info);

               if(i == 0){
                    Text +='<div class="listBlock dropdown"><div index='+i+' source="listSessions" class="listIcons imageFocus" id="listIcons-'+i+'" count='+listData.length+'><div class="listImg"><img src="images/user-icon.png" ></div><div class="listTitles"><h1>'+listData[i].user_info.name+'</h1><p>Username : '+listData[i].user_info.username+'</p><p>URL : '+listData[i].user_info.login_url+'</p></div></div>';
                    Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="float: right;position: inherit;"><a href="#" id="login_link_'+i+'" onclick="loginLink()">Login</a><a href="#" onclick="deleteLink('+i+')" id="delete_link_'+i+'">Delete</a></div></div>';
               }else{
                    Text +='<div class="listBlock dropdown"><div index='+i+' source="listSessions"  class="listIcons"   id="listIcons-'+i+'"  count='+listData.length+'><div class="listImg"><img src="images/user-icon.png" ></div><div class="listTitles"><h1>'+listData[i].user_info.name+'</h1><p>Username : '+listData[i].user_info.username+'</p><p>URL : '+listData[i].user_info.login_url+'</p></div></div>';
                    Text +='<div class="dropdown-content" id="dropdown_id_'+i+'" style="float: right;position: inherit;"><a href="#" onclick="loginLink()" id="login_link_'+i+'">Login</a><a href="#" onclick="deleteLink('+i+')" id="delete_link_'+i+'">Delete</a></div></div>';
               }
          }
     }

     /* 	Text +='<div class="col-md-2"><div id="homeLiveTile" class="homeLiveTile imageFocus"><div class="wrapCenter"><img src="images/live-tv-icon.png"><p>LIVE TV</p></div></div></div>';
     Text +='<div class="col-md-4"><div  id="moviesTile" class="moviesTile"><div class="wrapLeft"><img src="images/movie-icon.png"><p>MOVIES</p></div></div></div>';
     Text +='<div class="col-md-4"><div  id="seriesTile" class="seriesTile"><div class="wrapLeft"><img src="images/series-icon.png"><p>SERIES</p></div></div></div>';
     */
     Text +='</div>';
     Text +='</div>';
     Text += '<div class="homeBottom">';
     Text +='</div>';
     Text +='</div></div>';

     return Text;
};



function dateUtilNew(date){
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
     ];
	var date = new Date(date);
	
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	return day+" "+monthNames[month] + " " + year;
}

function dateUtil(epocTime){
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
     ];
	var date = new Date(parseInt(epocTime));
	
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	return day+" "+monthNamesC[month] + " " + year;
}



Util.playerBody = function(){
     var Text = '';

     Text +='<div id="PlayBackImage" style="display:none">';
     /* var image = 'https://d3lyihdno7nd8k.cloudfront.net/image/livebg.jpg';

     //image = selectedMovie.backgroundImage;
     Text +='<div id="playerBackImg" style="background:url('+image+') no-repeat;background-size: 100% 100%;background-repeat:no-repeat;height:100%;" ></div> '
     Text += '<img src="images/TV_Loader.png" class="imgLoaderForMovies">'
     Text +='<div class="liveGradient"></div>' */
     Text += '</div>';
     Text +='<div class="playerDivision">';
     Text +='<div class="player-content">';
     Text +='<div class="container">';
     Text +='<p></p>';
     Text +='</div>';
     Text +='</div>';
     /* Text += '<div class="play-icon-wrap">'
     Text +='<span class="play-icon" style="display:none" source="play-icon"><img src="images/play-icon.png"/></span>';
     Text +='<div source="playerPrev" id="playerPrev"><div class="snapImage"><img src=""/></div></div>';
     Text +=	'<div source="playerNext" id="playerNext"><div class="snapImage"><img src=""/></div></div>';
     Text += '</div>'; */
     Text +='<div class="player-inner"></div>';
     Text +='<div class="flix-mov-title" id="flix-mov-title">';
     if(Player.data.stream_icon)
          Text +='<div class="iconPlay"><img src="'+Player.data.stream_icon+'"  onerror="this.src=\'images/logo.png\';"></div>';
     else
          Text +='<div class="iconPlay"><img src="'+Player.data.movie_image+'"  onerror="this.src=\'images/logo.png\';"></div>';

     Text +='<div class="playIconText">'+ Player.data.name +'</div>';
     Text +='</div>';



     Text +='<div class="playerBottomDiv">';
     Text +='<div class="flix-seekbar"  id="flix-seekbar" onmouseover=\'progressIconHandle(event, "over");\' onclick=\'progressIconHandle(event, "click");\' onmousedown=\'progressIconHandle(event, "down");\' onmouseout=\'progressIconHandle(event, "out");\'>';
     Text +='<div class="flix-seekbar-load" id="flix-seekbar-load"></div>';
     Text +='<div class="flix-seekbar-run" id="flix-seekbar-run"></div>';
     Text +='<a href="#" class="seek-picker" id="seek-picker" source="picker"></a>';
     Text +='<span class="seek-picker-runtime" id="seek-picker-runtime"></span>';
     Text += '</div><div id="playerLog" ></div>' ;

     Text +='<span class="seek-picker-start" id="seek-picker-start">00:00:00</span>';
     Text +='<span class="seek-picker-end" id="seek-picker-end">00:00:00</span>';
     /* Text += '<div class="sub-title" source="subtitles">'
     Text += '<span><img src="images/subtitle.png"/></span>'
     Text += '<span>Sub title</span>'
     //Text += '<div class="listSubs"><b>English</b></div>';
     Text += '</div>' */	
     Text += '</div>';
     Text +='</div>';
     Text +='</div>';
     Text +='</div>';
     return Text;
};



Util.confirmPin = function(code,message,btnText){
     var Text = '';
     Text += '<div class="overlay-screen"></div>';
     Text += '<div class="info-msg-cont">';
     Text += '<div class="row remove-margin">';
     Text += "<div class='error'></div>";
     Text += '<div class="col-md-2 col-lg-2 col-xl-2"></div>';
     Text += '<div class="col-md-8 col-lg-8 col-xl-8">';

     Text +='<div class="row">';
     Text +='<div class="form-group">';
     Text +=' <label for="pin" style="font-size: 25px;padding: 20px;">Enter Pin</label>';
     Text += '<input type="password" class="form-control imageFocus pinSetting" source="pinSetting" max-length="10" style="margin-bottom: 30px;" id="pin">';
     Text +='</div>';
     Text +='</div>';

     // Text += '<img src="'+image+'" class="img-responsive pop-err-ico" alt="">'
     Text += '</div>';
     Text += '<div class="col-md-2 col-lg-2 col-xl-2"></div>';
     Text += '</div>';
     /*  Text += '<p class="dis-block">'+message+'</p>' */
     Text += '<a href="#" class="orange-button" id="confirmPin" style="margin:0px">Confirm</a>';
     Text += '</div>';

     return Text;
};

Util.showStatusPopUp = function(code,message,btnText){
     var Text = '';
     if (Main.screenHeight < 1000)
          Text += '<div class="popup-container_720p">';
     else
          Text += '<div class="popup-container_1080p">';
     Text += '<div class="overlay-screen"></div>';
     Text += '<div class="info-msg-cont">';
     Text += '<div class="row remove-margin">';
     Text += '<div class="col-md-4 col-lg-4 col-xl-4"></div>';
     Text += '<div class="col-md-4 col-lg-4 col-xl-4">';
     var image = '';
     if(code == 0)
          image = 'images/error.png';
     else if(code ==1)
          image = 'images/success.png';
     else
          image = 'images/info.png';

     // Text += '<img src="'+image+'" class="img-responsive pop-err-ico" alt="">'
     var messages = message.split("\n");
     Text += '</div>';
     Text += '<div class="col-md-4 col-lg-4 col-xl-4"></div>';
     Text += '</div>';
     Text += '<p class="dis-block">'+messages[0]+'</p>';
     if (messages.length > 1)
          Text += '<p class="dis-block">'+messages[1]+'</p>';
     Text += '<a href="#" class="orange-button" style="margin:0px">'+btnText+'</a>';
     Text += '</div>';
     Text += '</div>';

     return Text;
};

Util.showPopUp1 = function(no,title,desc,info1,info2){
     var Text = '';
     Text += '<div class="">';
     Text += '<div class="overlay-screen">';
     Text += '</div>';
     Text += '<div class="popup-Message-container popup-lg">';
     Text += '<h4 class="popUpSubhead">'+title+'</h4>';
     Text += '<h4 class="sumHead"></h4>';
     Text += '<div class="readmoreText " >'+desc;
     Text += '</div>';
     Text +=   '<div class="col-md-12 col-lg-12 col-xl-12 remove-padding mt30">';
     if(no == 2){

          Text +=     '<a id="Btn-0" class="popUpBtn popUpBtn-orange remove-margin" index="0"> << '+info1+'</a>';
          Text +=     '<a id="Btn-1" class="popUpBtn  ml30  remove-margin" index="1">'+info2+'</a>';

     }
     else if(no == 1){
          Text +=     '<a id="Btn-0" index = "0" class="popUpBtn-orange btn btn-default popUpBtn remove-margin" style="margin-left: -2%;"> '+info1+'</a>';
     }
     else {

     }
     Text +=   '</div>  ';
     Text +=   '';
     Text += '</div>';
     Text += '';
     Text += '</div>';
     return Text;
};


Util.showMenuPopUp = function(seasonNo,list,name){
     var Text = '';
     Text += '<div class="overlay-screen"></div>';
     Text += '<div class="info-msg-cont">';
     Text += '<div class="row remove-margin">';
     Text += '<div class="col-md-4 col-lg-4 col-xl-4"></div>';
     var count = Object.keys(list).length;
     for(var i=0;i<count;i++){
          if(Object.keys(seriesPage.episodes)[i] == (seasonNo))
               Text += '<a index='+i+' count='+count+' id="ssList-'+i+'" class="btn btn-default btn-block btnCust imageFocus" >'+name+" - "+Object.keys(seriesPage.episodes)[i]+'</a>';
          else{
               if((count - 12) > 0 && i < (count - 12))
                    Text += '<a index='+i+' count='+count+' style="display:none" id="ssList-'+i+'" class="btn btn-default btn-block btnCust" >'+name+" - "+Object.keys(seriesPage.episodes)[i]+'</a>';
               else
                    Text += '<a index='+i+' count='+count+' id="ssList-'+i+'" class="btn btn-default btn-block btnCust" >'+name+" - "+ Object.keys(seriesPage.episodes)[i]+'</a>';
          }

     }
     Text += '<div class="col-md-4 col-lg-4 col-xl-4"></div>';
     Text += '</div>';
     Text += '</div>';

    return Text;
};

Util.TermsPopUp = function(no,title,desc,info1,info2){
     var Text = '';
     Text += '<div class="">';
     Text += '<div class="overlay-screen">';
     Text += '</div>';
     Text += '<div class="Termspopup-Message-container popup-lg">';

     Text += '<div class="descData" >';
     Text += '<h4 class="popup-subhead" style="color:black">'+title+'</h4>';
     Text += '<p>'+desc + '</p>';
     Text += '</div>';
     Text +=   '<div class="col-md-12 col-lg-12 col-xl-12 remove-padding popup-btn-wrap mt30">';
     Text +=   '</div>  ';
     Text +=   '';
     Text += '</div>';
     Text += '';
     Text +=     '<a id="acceptBtn" index = "0" class="popUpBtn-orange termsBtn  remove-margin" style="bottom: 0px;text-align: center;z-index: 200;color: #FFF;background-color: #2196F3;max-width: 1200px;min-width: 900px;width: auto;position: fixed;-webkit-transition: all 0.3s ease;padding: 20px;left: 50%;transform: translate(-50%, -50%);-webkit-transform: translate(-50%, -50%);margin-bottom: 0px;">'+info1+'</a>';
     Text += '</div>';
     return Text;
 };

Util.showPopUp = function(no,title,desc,info1,info2){
     var Text = '';
     if (Main.screenHeight < 1000)
          Text += '<div class="popup-container_720p">';
     else
          Text += '<div class="popup-container_1080p">';
     Text += '<div class="overlay-screen">';
     Text += '</div>';
     Text += '<div class="popup-Message-container popup-lg">';
     //Text += '<p class="popup-p">'+title+'</p>';
     Text += '<p class="popup-p" >'+title+ '<br><br><br><br><br>' +desc;
     Text += '</p>';
     Text +=   '<div class="col-md-12 col-lg-12 col-xl-12 remove-padding popup-btn-wrap mt30">';
     if(no == 2){
          
          Text +=     '<a id="Btn-0" class="popUpBtn popUpBtn-orange remove-margin" index="0">'+info1+'</a>';
          Text +=     '<a id="Btn-1" class="popUpBtn  ml30  remove-margin" index="1">'+info2+'</a>';
          
     }
     else if(no == 1){
          Text +=     '<a id="Btn-0" index = "0" class="popUpBtn-orange popUpBtn remove-margin">'+info1+'</a>';
     }
     else {
          
     }
     Text +=   '</div>  ';
     Text +=   '';
     Text += '</div>';
     Text += '';
     Text += '</div>';
     return Text;
};

Util.showEpisodePopUp = function(no,desc,img,info1,info2){
     var Text = '';
     if (Main.screenHeight < 1000)
          Text += '<div class="popup-container_720p">';
     else
          Text += '<div class="popup-container_1080p">';
     Text += '<div class="overlay-screen">';
     Text += '</div>';
     Text += '<div class="popup-right-container popup-lg">';
     Text += '<img src="'+ img +'" class="nextImg" onerror="this.src=\'images/noimage.png\';">';
     Text += '<p class="popup-p" >'+desc;
     Text += '</p>';
     Text +=   '<div class="col-md-12 col-lg-12 col-xl-12 remove-padding popup-btn-wrap mt30">';
     if(no == 2){
          
          Text +=     '<a id="Btn-0" class="popUpBtn2" index="0"><img src="images/play.png" style="height:80%"></a>';
          Text +=     '<a id="Btn-1" class="popUpBtn2" index="1"><img src="images/returnlogo.png" style="height:80%"></a>';
          
     }
     else if(no == 1){
          Text +=     '<a id="Btn-0" index = "0" class="popUpBtn-orange popUpBtn remove-margin">'+info1+'</a>';
     }
     else {
          
     }
     Text +=   '</div>  ';
     Text +=   '';
     Text += '</div>';
     Text += '';
     Text += '</div>';
     return Text;
};

Util.signIn = function(){
     if (Main.screenHeight < 1000)
          return Util.signIn_720p();

     return Util.signIn_1080p();
};

Util.signIn_720p = function(){
     var Text = '';
     Text += '     <div class="login-page_720p">';
     Text += '          <div class="login-container">';
     Text += '               <div class="visit_card_720p">';
     Text += '                   <h2 style="font-family: Roboto-Thin;">Visit our website to buy subscription package:</h2>';
     Text += '                   <h2 style="font-family: Droid-Persian;">:برای خرید بسته اشتراک، به وب سایت ما مراجعه کنید</h2>';
     Text += '                   <h1 class="suburl_720p">http://tamasha.me</h1>';
     //Text += '                   <a href="http://tamasha.me" id="subscribe" name="subscribe" source="subscribe" class="btn subscribe_button_720p">Subscribe <span style="font-family: Droid-Persian;"> اشتراک</span></a>';
     Text += '               </div>';
     Text += '               <div class="login_card_720p">';
     Text += '                   <div class="login_logo_card_720p">';
     Text += '                       <img src="images/tamasha_logo.png" alt="tamasha">';
     Text += '                   </div>';
     Text += '                   <div class="login_form_card_720p">';
     Text += '                       <form id="loginForm">';
     Text += '                           <div class="form-group">';
     Text += '                               <input type="hidden" id="name" value="tamasha" source="loginForm" class="form-control signin imageFocus">';
     Text += '                           </div>';
     Text += '                           <div class="form-group">';
     Text += '                               <input type="text" source="loginForm" class="username_input_720p signin" id="username" value="" name="u" placeholder="Username">';
     Text += '                           </div>';
     Text += '                           <div class="form-group">';
     Text += '                               <input type="password" source="loginForm" class="password_input_720p signin" id="password" value="" name="p" placeholder="Password">';
     Text += '                           </div>';
     Text += '                           <div class="btn-action_720p">';
     Text += '                               <b type="submit" id="login" source="loginForm" class="btn login_button_720p">Login</b>';
     Text += '                           </div>';
     Text += '                       </form>';
     Text += '                   </div>';
     Text += '               </div>';
     Text += '               <div class="tc_card_720p">';
     Text += '                   <p>"TAMASHA-TV DOES NOT HOST, ARCHIVE, STORE OR DISTRIBUTE MEDIA OF ANY KIND AND ACTS MERELY AS AN INDEX OF MEDIA URLS POSTED BY ENTHUSIAST. WE DO NOT HOST OR UPLOAD ANY STREAMS, VOD, FILMS, MEDIAFILES. ALL TRADEMARKS, SERVICE MARKS, NAMES, CONTENT, PRODUCT NAMES AND LOGOS ARE THE PROPERTY OF THEIR OWNERS. TV CHANNELS AND VIDEO CONTENT IS BEING PROVIDED WITHOUT ANY LIABILITY BY TAMASHA-TV REGARDING COPYRIGHTS. CHANNEL AVAILABILITY MAY VARY AND CHANGE FROM TIME TO TIME NO COPYRIGHT INFRINGEMENT IS INTENDED. FOR FURTHER DETAILS ON THE INFORMATION REQUIRED FOR VALID DMCA NOTIFICATION, SEE 17 U.S.C 512(c)(3)"</p>';
     Text += '               </div>';
     Text += '          </div>';
     Text += '     </div>';
     return Text;
};

Util.signIn_1080p = function(){
     var Text = '';
     Text += '     <div class="login-page_1080p">';
     Text += '          <div class="login-container">';
     Text += '               <div class="visit_card_1080p">';
     Text += '                   <h2 style="font-family: Roboto-Thin;">Visit our website to buy subscription package:</h2>';
     Text += '                   <h2 style="font-family: Droid-Persian;">:برای خرید بسته اشتراک، به وب سایت ما مراجعه کنید</h2>';
     Text += '                   <h1 class="suburl_1080p">http://tamasha.me</h1>';
     //Text += '                   <a href="http://tamasha.me" id="subscribe" name="subscribe" source="subscribe" class="btn subscribe_button_1080p">Subscribe <span style="font-family: Droid-Persian;"> اشتراک</span></a>';
     Text += '               </div>';
     Text += '               <div class="login_card_1080p">';
     Text += '                   <div class="login_logo_card_1080p">';
     Text += '                       <img src="images/tamasha_logo.png" alt="tamasha">';
     Text += '                   </div>';
     Text += '                   <div class="login_form_card_1080p">';
     Text += '                       <form id="loginForm">';
     Text += '                           <div class="form-group">';
     Text += '                               <input type="hidden" id="name" value="tamasha" source="loginForm" class="form-control signin imageFocus">';
     Text += '                           </div>';
     Text += '                           <div class="form-group">';
     Text += '                               <input type="text" source="loginForm" class="username_input_1080p signin" id="username" value="" name="u" placeholder="Username">';
     Text += '                           </div>';
     Text += '                           <div class="form-group">';
     Text += '                               <input type="password" source="loginForm" class="password_input_1080p signin" id="password" value="" name="p" placeholder="Password">';
     Text += '                           </div>';
     Text += '                           <div class="btn-action_1080p">';
     Text += '                               <b type="submit" id="login" source="loginForm" class="btn login_button_1080p">Login</b>';
     Text += '                           </div>';
     Text += '                       </form>';
     Text += '                   </div>';
     Text += '               </div>';
     Text += '               <div class="tc_card_1080p">';
     Text += '                   <p>"TAMASHA-TV DOES NOT HOST, ARCHIVE, STORE OR DISTRIBUTE MEDIA OF ANY KIND AND ACTS MERELY AS AN INDEX OF MEDIA URLS POSTED BY ENTHUSIAST. WE DO NOT HOST OR UPLOAD ANY STREAMS, VOD, FILMS, MEDIAFILES. ALL TRADEMARKS, SERVICE MARKS, NAMES, CONTENT, PRODUCT NAMES AND LOGOS ARE THE PROPERTY OF THEIR OWNERS. TV CHANNELS AND VIDEO CONTENT IS BEING PROVIDED WITHOUT ANY LIABILITY BY TAMASHA-TV REGARDING COPYRIGHTS. CHANNEL AVAILABILITY MAY VARY AND CHANGE FROM TIME TO TIME NO COPYRIGHT INFRINGEMENT IS INTENDED. FOR FURTHER DETAILS ON THE INFORMATION REQUIRED FOR VALID DMCA NOTIFICATION, SEE 17 U.S.C 512(c)(3)"</p>';
     Text += '               </div>';
     Text += '          </div>';
     Text += '     </div>';
     
	return Text;
};


Util.displayTime = function(){
     var Text = '';
     Text +='<div class="time_bar" id="timeBar" source ="timeBar">';
     //for(var x = 0;x<dates.length;x++){
          
     for(var y=0;y<timeArray.length;y++){
          Text +='<div class="time_period" ><span class="time_period" >'+timeArray[y]+'</span></div>';//id="timeArray_'+x+'_'+y+'"
     }
          //Text += '</div>'
     //}
     Text += '</div>';

     return Text;
};
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};

Util.displayDateFormat = function(epgSelectedDate){
	var date = epgSelectedDate;
	var dayName = date.toString().split(' ')[0];
	return dayName+','+ monthFullNames[date.getMonth()]+' '+date.getDate()+','+date.getFullYear();

};


Util.listCatchUpChannelsPage = function(section){
	var Text = '';
	Text += '<div class="mainHome"><div class="mainHomeContent">';

     Text += '<div class="homeHeader">';
     Text +='<div class="row">';
     Text += '<div class="col-md-4"><img src="images/home-logo.png" class="logImg"/></div>';

     var type = "CATCH UP CHANNELS";

     Text += '<div class="col-md-4"><h1 class="LiveH1">'+type+'</h1></div>';
     Text += '<div class="col-md-4"><div class="floatRight"></div></div>';
     //<img src="images/search-ico.png" class="bellIcon"/>
     Text +='</div>';
     Text +='</div>';
     Text += '<div class="arrowsSections"><div class="leftLiveDisplay"> << </div><div class="rightLiveDisplay"> >> </div></div>';
     Text += '<div class="homeBody">';
     Text +='<div class="row" style="margin-top: -60px;">';
     var row = 0,count = parseInt(section.length / numberOfCatchups);
     for(var i=0;i<section.length;){

          if(i % numberOfCatchups == 0 || i == 0 ){
               if(i > 8)
                    Text += '<div  id="sectionCatchupIndex-'+row+'" class="col-md-6" index='+row+' count = '+count+' style="display:none">';
               else
                    Text += '<div  id="sectionCatchupIndex-'+row+'"  index='+row+'  count = '+count+'   class="col-md-6">';
               row ++;
          }
          if(i == 0 ){
               Text +='<div id="sectionCatchup-'+i+'" categ="'+section[i].category_id+'" stream_id="'+section[i].stream_id+'"  count='+section.length+' rowIndex='+(row-1)+'  rowCount = '+count+' index = '+(i%5)+' class="section imageFocus" chname="'+btoa(section[i].name)+'" chnum="'+section[i].num+'" chlogo="'+btoa(section[i].stream_icon)+'"><div class="floatLeft"><img src="'+section[i].stream_icon+'" style="width:86px;height:62px" onerror="this.src=\'images/logo.png\';" ><p><span style="float: left;margin-right: 25px;">'+section[i].num+'</span>';
               if(section[i].name.length < 22 )
                    Text += '<span>'+section[i].name+'</span>';
               else
                    Text += '<span class="namescroll">'+section[i].name+'</span>';
               Text += '</p></div><div class="floatRight"></div></div>';
          }else{
               Text +='<div id="sectionCatchup-'+i+'" categ="'+section[i].category_id+'" stream_id="'+section[i].stream_id+'"  count='+section.length+' rowIndex='+(row-1)+'  rowCount = '+count+' index = '+(i%numberOfCatchups)+' class="section" chname="'+btoa(section[i].name)+'" chnum="'+section[i].num+'" chlogo="'+btoa(section[i].stream_icon)+'"><div class="floatLeft"><img src="'+section[i].stream_icon+'" style="width:86px;height:62px" onerror="this.src=\'images/logo.png\';" ><p><span style="float: left;margin-right: 25px;">'+section[i].num+'</span>';
               if(section[i].name.length < 22 )
                    Text += '<span>'+section[i].name+'</span>';
               else
                    Text += '<span class="namescroll">'+section[i].name+'</span>';
               Text += '</p></div><div class="floatRight"></div></div>';
          }
          i++;
          if(i % numberOfCatchups == 0 & i != 0)
               Text += '</div>';

     }

     /* 	Text +='<div class="col-md-2"><div id="homeLiveTile" class="homeLiveTile imageFocus"><div class="wrapCenter"><img src="images/live-tv-icon.png"><p>LIVE TV</p></div></div></div>';
     Text +='<div class="col-md-4"><div  id="moviesTile" class="moviesTile"><div class="wrapLeft"><img src="images/movie-icon.png"><p>MOVIES</p></div></div></div>';
     Text +='<div class="col-md-4"><div  id="seriesTile" class="seriesTile"><div class="wrapLeft"><img src="images/series-icon.png"><p>SERIES</p></div></div></div>';
     */
     Text +='</div>';
     Text +='</div>';

     Text += '<div class="homeBottom">'

     Text +='</div>';



     Text +='</div></div>';

	return Text;
};


Util.listCatchUpProgramsPage = function(tabsHTML,tabsData){
	var Text = '';
	Text += '<div class="mainHome"><div class="mainHomeContent">';

	Text += '<div class="homeHeader">';
     Text +='<div class="row">';
	Text += '<div class="col-md-4"><img src="images/home-logo.png" class="logImg"/></div>';

     var type = "CATCH UP PROGRAMS";

     Text += '<div class="col-md-4"><h1 class="LiveH1">'+type+'</h1></div>';
     Text += '<div class="col-md-4"><div class="floatRight"></div></div>';
     //<img src="images/search-ico.png" class="bellIcon"/>
     Text +='</div>';
     Text +='</div>';
     Text += '<div class="arrowsSections"><div class="leftLiveDisplay"> << </div><div class="rightLiveDisplay"> >> </div></div>';
     Text += '<div class="homeBody">';
     Text +='<div class="row" style="margin-top: -60px;">';

     Text +='<div id="tab-container" aria-multiselectable="false" class="tabs-view">';
     Text += tabsHTML;

     Text +='         <div id="panels">';

     Text += tabsData;

     Text +='         </div>';
     Text +='       </div>';

     Text +='</div>';
     Text +='</div>';

     Text += '<div class="homeBottom">';

     Text +='</div>';

     Text +='</div></div>';

	return Text;
};

Util.fullEPGPopUp = function(tdText,channelName){
	var Text = '';
	Text += '<div class="row accountElements">';
     Text += '<div class="account-title">'+channelName+'</div>';
     Text += '<div class="row">';
     Text += '<table class="fullEPGTable">';
     Text += '<thead><tr>';
     Text += '<th style="width: 15%;">START TIME</th>';
     Text += '<th style="width: 15%;">END TIME</th>';
     Text += '<th style="width: 20%;">TITLE</th>';
     Text += '<th style="width: 50%;">DESCRIPTION</th>';
     Text += '</tr></thead>';
     Text += '<tbody>';

     Text +=  tdText;


     Text += '</tbody></table>';

     Text += '</div>';

     Text +='</div>';

	return Text;
};