'use strict';
//dedicated file for "helpers" functions
var playerVersion = '8.0.14-beta';

var container = document.getElementById('container');
var emailInput = document.getElementById('inputEmail');
var formError = document.getElementById('formError');
var goButton = document.getElementById('goButton');
var playButton = document.getElementById('playButton');
var logger = document.getElementById('logger');
var loginForm = document.getElementById('login');
var loader = document.getElementById('loader');
var logWindow = document.getElementById('log-container');
var passwordInput = document.getElementById('inputPassword');
var playlistsList = document.getElementById('playlistsList');
var playlistsContainer = document.getElementById('playlistsContainer');
var nowPlaying = document.getElementById('nowPlaying');
var showThisWindow = document.getElementById('showThisWindow');
var qrcode = document.getElementById('qrcode');
var alertConnection = document.getElementById('alertNoConnection');

var downloadError, playbackError, logExist, updateLoopID;
var playerListDetails = [];

// logWindowOn();
// handleWindowSize();
showThis('Player version', playerVersion);

function logThis(message) {
    if (typeof message === 'object') {
        message = message.stack || objToString(message);
    }
    console.log(message);
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var dateTime = date + ' ' + time + ' ';
    while (logger.children.length >= 100) {
        logger.removeChild(logger.lastChild);
    }
    logger.insertAdjacentHTML('afterbegin', '<label>' + dateTime + message + '<br/></label>');
}

function objToString(obj) {
    var str = 'Object: ';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + ',\n';
        }
    }
    return str;
}

function showThis(type, data) {
    if (playerListDetails[type] != undefined) {
        showThisWindow.removeChild(document.getElementById(type));
        if (!data) {
            playerListDetails[type] = undefined;
            return;
        }
    }
    logThis(type + ': ' + data);
    playerListDetails[type] = data;
    showThisWindow.insertAdjacentHTML('beforeend', '<span id="' + type + '">' + type + ': ' + data + ' ▪ </span>');
}

function logWindowOn() {
    logWindow.hidden = false;
    alertConnection.hidden = false;
}

function logWindowOff() {
    logWindow.hidden = true;
    alertConnection.hidden = true;
}

function handleWindowSize() {
    if (window.innerWidth <= 580) {
        logWindowOff();
    }
    if (window.innerWidth > 580) {
        logWindowOn();
    }
    if (loginForm.style.display === 'none') {
        logWindowOff();
    }
}

function removeExtraBackslash(site) {
    while (site.charAt(site.length - 1) === '/') {
        site = site.replace(/\/$/, '');
    }
    return site;
}

function isBlank(str) {
    return !str || /^\s*$/.test(str);
}

function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value);
    } else {
        return false;
    }
}

function showIsNetwork(hostName, err, isBeginUpdate) {
    err = err.toString();
    var isOnline = err.indexOf('Network request failed') > -1 || !navigator.onLine ? false : true;
    showThis('Online Status', isOnline ? 'Connected' : 'Disconnected');
    if (!isOnline) {
        alertConnection.innerText = 'no internet connection';
    } else if (isBeginUpdate) {
        alertConnection.innerText = '';
    } else {
        alertConnection.innerText = 'Could not reach server ' + hostName + ' Error: ' + err;
    }
}

function listenToKeyEvents() {
    document.addEventListener('keypress', function (event) {
        switch (event.keyCode) {
            case 49:
                if (logWindow.hidden) {
                    logWindowOn();
                    logThis('1 pressed, showing log. Press 1 again to close.');
                } else {
                    logWindowOff();
                }
                break;
            case 50:
                logThis('2 pressed, Sending playback reports');
                prepareReport();
                break;
            case 53:
                logThis('5 pressed, updating content.');
                updateNow();
                break;
            case 54:
                logThis('6 pressed, refreshing app.');
                switch (device) {
                    case 'signageOS':
                        sos.management.power.appRestart();
                        break;
                    default:
                        window.location.reload();
                        break;
                }
                break;
            case 55:
                logThis('7 pressed, clearing player ID.');
                localStorage.clear();
                window.location.reload();
                break;
            case 56:
                logThis('8 pressed, refreshing after error, if nothing happens, there is no error');
                forceWakeup();
                break;
            case 57:
                logThis('9 pressed, delete all files');
                deleteAllFiles();
                break;
        }
        return;
    });
}

function deleteAllFiles() {
    switch (device) {
        case 'cordova':
            deleteAllFilesCordova();
            break;
        case 'signageOS':
            sos.offline.cache
                .listFiles()
                .then(function (files) {
                    for (var i = 0; i < files.length; i++) {
                        sos.offline.cache
                            .deleteFile(files[i])
                            .then(function () {
                                logThis('❌ The ' + file[i] + 'file has been deleted');
                            })
                            .catch(function (err) {
                                logThis('❗ The ' + file[i] + 'file was not deleted');
                            });
                    }
                })
                .catch(function (err) {
                    logThis(err);
                });
            break;
        case 'electron':
            deleteAllFilesElectron();
            break;
        case 'android':
            androidApp.deleteAllFilesAndroid();
            break;
        default:
            //
            break;
    }
}

//reporting
function prepareReport() {
    logThis('💹 Preparing playback reports');
    var date = new Date();
    var dateStr = date.toDateString();
    var report = {
        playerID: playerData.id,
        date: dateStr,
        items: [],
    };

    playerData.windows.map(function (window) {
        window.playlist.map(function (item) {
            report.items.push({
                uid: item.uid,
                playlist_id_text: window.playlist_id_text,
                appeared: item.count,
            });
            item.count = 0;
        });
    });
    sendReport(report);
}

//pipedream
function sendReport(report) {
    logThis('🏹 Sending playback reports');
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var options = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(report),
    };

    // fetch('https://app.angalia.co/api/1.1/wf/report/', options);
}

function sameObject(x, y) {
    return x && y && typeof x === 'object' && typeof y === 'object'
        ? Object.keys(x).length === Object.keys(y).length &&
              Object.keys(x).reduce(function (isEqual, key) {
                  return isEqual && sameObject(x[key], y[key]);
              }, true)
        : x === y;
}

function periodicUpdate() {
    if (updateLoopID) {
        clearTimeout(updateLoopID);
    }
    updateLoopID = setTimeout(updateNow, 5 * 60 * 1000);
}

function intervals() {
    setInterval(forceWakeup, 15 * 60 * 1000);
    // setInterval(prepareReport, 1 * 5 * 60 * 1000);
}

function getFileSize(url) {
    var fileSize = '';
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send(null);
    if (http.status === 200) {
        fileSize = http.getResponseHeader('content-length');
    }
    return fileSize;
}

function renderLoadingScreen() {
    logWindowOn();
    loader.hidden = false;
    document.body.style.background = 'url(./assets/welcome.jpg) no-repeat center center fixed';
    document.body.style.backgroundSize = 'cover';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
}
