function load_preview_player() {
  console.log("load_preview_player");
  $(".video_player_error_message").hide();
  console.log("VOD_URL==>", VOD_URL);
  $(".preview-video-inner").show();
  // setTimeout(function () {
  load_video();
  // }, 2000);
  PREVIEW_PLAYER = true;
}

// Start video fucntion from here
function load_main_player() {
  try {
    console.log("start playing video");
    PREVIEW_PLAYER = false;
    TAB_INDEX = 6;
    $(".pause-icon").hide();
    show_hide_video_container();
    VIDEO_PLAYER.pause();
    sessionStorage.FWD_RWD_key_press = 0;
    $(".player_progress").hide();
    progress_bar(0);
    document.getElementById("currentTime").innerHTML = "00:00:00";
    document.getElementById("totalTime").innerHTML = "/00:00:00";

    var totalVideo = get_total_video_or_first_video_index(1),
      firstItem = get_total_video_or_first_video_index(0);
    obj = get_video_obj();

    // show next video button
    if (totalVideo > VOD_COUNTER) {
      $("#playNextVideo").css('visibility', 'visible');
      $("#playPauseVideo").attr('data-sn-right', '#playNextVideo');

    } else {
      $("#playNextVideo").css('visibility', 'hidden');
      $("#playPauseVideo").attr('data-sn-right', 'null');
    }

    // show previous video button
    if (VOD_COUNTER > firstItem) {
      $("#playPreviousVideo").css('visibility', 'visible');
      $("#playPauseVideo").attr('data-sn-left', '#playPreviousVideo');
    } else {
      $("#playPreviousVideo").css('visibility', 'hidden');
      $("#playPauseVideo").attr('data-sn-left', 'null');
    }

    if (PAGE_INDEX == 1) {
      $("#playPreviousVideo").css('visibility', 'hidden');
      $("#playNextVideo").css('visibility', 'hidden');
      $("#playPauseVideo").attr('data-sn-left', 'null');
      $("#playPauseVideo").attr('data-sn-right', 'null');
    }

    if (PAGE_INDEX == 1) show_hide_video_next_previous(false);
    else show_hide_video_next_previous(true);

    // SN.focus("videoPlayer");

    // setTimeout(function(){
    // load_video_library();
    // },3000);
  } catch (e) {
    var msg = "";
    if (navigator.onLine) msg = "The content is currently unavailable. Please check back later.";
    else msg = NET_CONNECTION_ERR;
    // if (webapis.avplay.getState() == "NONE" || webapis.avplay.getState() == "IDLE" && !PREVIEW_PLAYER) {
    //     if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
    //         hide_show_modal(true, 'RETRY_CANCEL', msg);
    //     }
    // }
    console.log("Error in load video: " + e);
  }
}

function show_hide_video_loader() {
  if ($(".video_container").hasClass('active') && $('.video_container').is(':visible')) $(".video-inner").show();
  else $(".preview-video-inner").show();
}

// Open video screen
function show_hide_video_container() {
  $(".pause-icon").hide();
  $(".video-inner").show();
  $(".video-loader").show();
  $(".main_conatiner, .home_container, .setting_container, .account_container, .search_container, .video_library_container").removeClass("active").hide();
  $(".main_container").hide();
  $("#video_container").addClass("active").show();
  $("#av-player").css("display", "block");
}

// It returns current vod object while playing video
function get_video_obj() {
  var obj = "";
  var countryName = "";
  var index = "";
  switch (PAGE_INDEX) {
    case 0:
      countryName = $("#" + FIRST_PAGE_SELECTED_ITEM).parent().attr("data-name");
      index = $("#" + FIRST_PAGE_SELECTED_ITEM).index();
      obj = APP_CHANNEL_DATA_ARRAY[countryName][index];
      break;
  }

  return obj;
}

//This function is used for display two digit number from 1-9
function min_two_digits(number) {
  return (number < 10 ? '0' : '') + number;
}

// function load_video_library() {
//   console.log('video library page');
//   VIDEO_PLAYER = '';
//   var features = [], type = 'video/', url = '';

//   PREVIEW_PLAYER = false;
//   TAB_INDEX = 6;

//   // features = ['current', 'progress', 'duration'];

//   if (APP_GENRE_COUNTRY_LIST > 0)
//     features = ['current', 'progress', 'duration'];
//   else if (APP_GENRE_COUNTRY_LIST == 0) features = ['current', 'progress'];

//   if (VOD_URL.toLowerCase().indexOf('.m3u') > -1) type += 'hls';
//   else type += 'mp4';
//   console.log(type);

//   show_hide_video_container();

//   console.log('VOD_URL', VOD_URL);

//   // Add vidoe player
//   set_focus('videoPlayer', '');
//   SN.focus('videoPlayer');

//   console.log('video library page');

//   $('#video_container').html(
//     '<video controls id="videoLibraryPlayer" style="max-width:100%;" poster="" preload="none" class="video_box videoPlayer"><source src="" type="' +
//     type +
//     '" id="videoLibraryURL"></video>'
//   );

//   console.log($('#video_container'));

//   $('#videoLibraryURL').attr('src', VOD_URL);
//   SN.focus("videoNextPrevious");

//   console.log(VOD_URL);

//   MEDIA_OBJ_LIBRARY = new MediaElementPlayer('videoLibraryPlayer', {
//     stretching: 'auto',
//     features: features,
//     customError: '&nbsp;',
//     success: function (media) {
//       console.log('media player on video library page');
//       // show_hide_show_deatils(true);
//       // updateDuration();

//       // if (APP_GENRE_COUNTRY_LIST == 2)
//       $(".mejs__controls").addClass('progress-container'); // Progressbar Shift upside
//       // $('.mejs__controls').addClass('progress-bar'); progress_bar(0);
//       // else $('.mejs__controls').removeClass('set_progressbar');

//       $('.mejs__time-total').css('height', '18px');
//       $('.mejs__currenttime').css('height', '18px');
//       $('.mejs__duration').css('height', '18px');

//       $('.mejs__time-loaded').css('height', '18px');
//       $('.mejs__time-current').css('height', '18px');
//       $('.mejs__time-buffering').css('height', '18px');

//       $('.mejs__time').css('font-size', '20px');
//       $('.mejs__time').css('padding-top', '18px');

//       media.load();
//       media.play();
//       VIDEO_PLAYER = media;

//       media.addEventListener('progress', function () {
//         //console.log("progress...");
//       });

//       media.addEventListener('error', function (e) {
//         PLAY_VIDEO = true;
//         retry_error_popup();
//         media.pause();
//         if (TAB_INDEX == 0 || TAB_INDEX == 1) {
//           $('.video-inner').hide();
//           $('.video_player_error_message')
//             .show()
//             .text('Content Currently Not Available');
//           if (PREVIEW_FULL_DISPLAY)
//             $('.video_player_error_message').addClass(
//               'expand_preview_error_msg'
//             );
//         } else retry_error_popup(eventType);
//         console.log('Error in stream: ' + eventType);
//       });

//       media.addEventListener('ended', function (e) {
//         console.log('end video...............' + e.message);
//         totalVideo = get_total_video_or_first_video_index(1);
//         if (VOD_COUNTER < totalVideo) previous_next_video((type = 'next'));
//         else closeVideo();
//       });

//       media.addEventListener('playing', function (e) {
//         console.log('playing...............');
//         $('#playPauseIcon').attr('src', 'images/pause.png');
//         $('.mejs__controls').addClass('mejs__offscreen').css('opacity', 0);
//         $('.video-inner').hide();
//       });

//       media.addEventListener('pause', function (e) {
//         console.log('pause...............');
//         $('.mejs__controls')
//           .removeClass('mejs__offscreen')
//           .css('opacity', 1);
//         $('#playPauseIcon').attr('src', 'images/play.png');
//       });

//       media.addEventListener('loadstart', function (e) {
//         console.log("loading...");
//         $('.video-inner').show();
//       });

//       media.addEventListener('seeking', function (e) {
//         console.log("seeking");
//         $(".video-inner").show();
//       }, true);

//       media.addEventListener('seeked', function (e) {
//         console.log("seeked");
//         $(".video-inner").hide();
//         VIDEO_PLAYER.play();
//       }, true);

//       media.addEventListener('loadedmetadata', function (e) {
//         console.log('loadedmetadata');
//         show_hide_show_deatils(false);
//         try {
//           var duration = VIDEO_PLAYER.getDuration();

//           if (Math.floor(duration / 3600) >= 1) {
//             document.getElementById('totalTime').innerHTML =
//               '/' +
//               min_two_digits(Math.floor(duration / 3600)) +
//               ':' +
//               min_two_digits(Math.floor(duration / 60 % 60)) +
//               ':' +
//               min_two_digits(Math.floor(duration % 60));
//           }
//           else {
//             document.getElementById('totalTime').innerHTML =
//               '/' +
//               min_two_digits(Math.floor(duration / 60 % 60)) +
//               ':' +
//               min_two_digits(Math.floor(duration % 60));
//             console.log('video play........');
//           }
//         } catch (e) // else
//         {
//           console.log('Error in update duration');
//         }
//       });

//       media.addEventListener('timeupdate', function () {
//         // console.log('timeupdate');
//         var currentTime = VIDEO_PLAYER.getCurrentTime();
//         try {
//           if (VIDEO_PLAYER.getCurrentTime() == null)
//             currentTime = VIDEO_PLAYER.getCurrentTime();

//           if (Math.floor(VIDEO_PLAYER.getCurrentTime() / 3600) >= 1)
//             document.getElementById('currentTime').innerHTML =
//               min_two_digits(
//                 Math.floor(currentTime / 3600)
//               ) +
//               ':' +
//               min_two_digits(
//                 Math.floor(currentTime / 60 % 60)
//               ) +
//               ':' +
//               min_two_digits(Math.floor(currentTime % 60));
//           else
//             document.getElementById('currentTime').innerHTML =
//               min_two_digits(
//                 Math.floor(currentTime / 60 % 60)
//               ) +
//               ':' +
//               min_two_digits(Math.floor(currentTime % 60));

//           console.log('video play.....');

//           // var time = VIDEO_PLAYER.getCurrentTime();
//           // var duration = VIDEO_PLAYER.getDuration();
//           var time = VIDEO_PLAYER.getCurrentTime();
//           // Math.floor(VIDEO_PLAYER.getCurrentTime() / 360) * 36 +
//           // Math.floor(VIDEO_PLAYER.getCurrentTime() / 60 % 60) * 60 +
//           // Math.floor(VIDEO_PLAYER.getCurrentTime() / 10 % 60);
//           var totalTime = VIDEO_PLAYER.getDuration();
//           // Math.floor(duration / 360) * 36 +
//           // Math.floor(duration / 60 % 60) * 60 +
//           // Math.floor(duration / 10 % 60);
//           var percentageCompleted = time / totalTime;
//           var percentge = Math.round(percentageCompleted * 100);
//           progress_bar(percentge);
//           // console.log(time, totalTime, percentageCompleted, percentge);
//         } catch (e) // else
//         {
//           // }
//           console.log('Error in update current time');
//         }
//       });

//       media.addEventListener('canplay', function (e) {
//         PLAY_VIDEO = true;
//         if (APP_GENRE_COUNTRY_LIST == 0)
//           show_hide_programme_details_after_specific_time();
//       });

//       // timer_forwerd.addEventListener('input', function (e) {
//       //   console.log("forward/backward..........");
//       //   skipAhead();
//       // });

//       // setTimeout(function(){
//       //   show_hide_show_deatils(true);
//       // },3000);
//       // show_hide_show_deatils(false);

//       // $(".player_progress").show();
//       // SN.focus("videoNextPrevious");
//     },
//   });
// }
