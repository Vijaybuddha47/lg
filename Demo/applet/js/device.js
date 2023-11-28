var head = document.getElementsByTagName('head')[0];
var js = document.createElement('script');

var device = '';
var sosCheck = false; // enable on SOS

if (navigator.userAgent.indexOf('Electron') > -1) {
    device = 'electron';
    js.src = './js/electron/electron.js';
} else if (sosCheck) {
    device = 'signageOS';
    js.src = './js/bundle.js';
} else if (!!window.cordova) {
    if (window.cordova.platformId.indexOf('browser') > -1) {
        device = '';
    } else {
        device = 'cordova';
    }
} else if (navigator.userAgent.indexOf('Android') > -1) {
    if (androidApp.isAccessToFS()) {
        device = 'android';
    }
}

head.appendChild(js);
