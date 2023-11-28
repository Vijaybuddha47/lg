'use strict';

var hourlyItem = [];
var playbackLoopID = [];

try {
    var PDFJS = PDFJS ? PDFJS : pdfjsLib;
} catch (error) {
    logThis("PDF playback could not be loaded, this means that PDF files will not be displayed. This is mostly due to unsupported hardware. more details:")
    logThis(error)
}

switch (device) {
    case 'cordova':
        showThis('Type', 'Android');
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function (dirEntry) {
                directoryEntry = dirEntry.root;
                init();
            },
            function (error) {
                device = '';
                logThis("Can't find directory to save files for offline, operating online. details: " + JSON.stringify(error));
                init();
            }
        );
        break;
    case 'signageOS':
        showThis('Type', 'Embedded');
        try {
            logThis('Your applet version is ' + sos.appletVersion)
        } catch (error) {
            logThis('Cant initialize sos, going online mode')
            logThis(error);
            showThis('Type', 'Online');
            device = '';
        }
        init();
        break;
    case 'electron':
        showThis('Type', 'Windows');
        init();
        break;
    case 'android':
        showThis('Type', 'Android');
        init();
        break;
    default:
        showThis('Type', 'Online');
        init();
        break;
}

function init() {
    if (location.search.match(/player=([^&]*)/i)) {
        playerID = location.search.match(/player=([^&]*)/i)[1];
        document.body.style.cursor = 'default';
        if (!userAuth) {
            if (location.search.match(/id=([^&]*)/i)) {
                userID = location.search.match(/id=([^&]*)/i)[1];
                emailInput.value = userID;
            }
            showLoginForm(true);
            return;
        }
    }

    if (!playerID) {
        renderQRCode();
        showLoginForm();
        return;
    } else if(playerID.indexOf('x') > -1) {
        hideLoginForm();
        renderLoadingScreen();
        listenToKeyEvents();
    
        fetchPlayer()
            .then(function (player) {
                clearInterval(qrCodeInterval);
                intervals();
                buildLayout(player);
            })
            .catch(function (err) {
                err = err.stack || err;
                logThis('Error: while fetching player data. ' + err);
                if (err.indexOf('initiating') > -1) {
                    return;
                }
                showLoginForm();
                return;
            });
    } else {
        hideLoginForm();
        renderLoadingScreen();
        listenToKeyEvents();
        localStorage.clear();
        logThis('player ID is not supported:' + playerID + '. Local configuration got cleared, please restart device')
    }

}

function fetchPlayer(isUpdate) {
    return fetch(urlAPI + 'wf/player/?id=' + playerID, {
        headers: {
            Authorization: 'Bearer ' + userAuth.token,
        },
        method: 'POST',
    })
        .catch(function (err) {
            // if (userAuth.expires_at < Date.now()) {
            //     // find better way to identify token expiration
            //     logThis('❗ Expired token, generating new one.');
            //     authenticateUser(userAuth.user_email, userAuth.user_password, isUpdate).then(function () {
            //         if (isUpdate) {
            //             throw 'token'; //Does this ignite next periodicUpdate?
            //         } else {
            //             init(); //Does this ignite next periodicUpdate more than once?
            //             throw 'tokenInit';
            //         }
            //     });
            // }
            if (isUpdate) {
                throw 'notReachable';
            }
            return new Promise(function (resolve, reject) {
                logThis('📁 Player is offline, restoring layout data from file');
                var playerData = localStorage.getItem('dataJson');
                playerData = JSON.parse(playerData);
                reject(playerData);
            });
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            if (isUpdate) {
                return compareDetails(response);
            } else {
                return response;
            }
        })
        .then(function (data) {
            showIsNetwork('', '', true);
            if (data.response) {
                showThis('Player Name', data.response.player.name_text);
                localStorage.setItem('dataJson', JSON.stringify(data));
                return data.response;
            } else {
                throw data;
            }
        })
        .catch(function (err) {
            if (err === 'noNews') {
                throw '♻ Nothing new, keep on rolling';
            } else if (err === 'notReachable') {
                throw '🚫 Server is not reachable for update';
                // } else if (err === 'token') {
                //     throw '🔐 Re-authenticating and waiting for next update';
                // } else if (err === 'tokenInit') {
                //     throw '🔐 Re-authenticating and initiating connection';
            }
            downloadError = true;
            showIsNetwork(urlAPI, '', false);
            err = err.stack || err.translation || err;
            logThis('Error: while fetching player data. ' + err);
            if (err.response) {
                return err.response;
            } else {
                return new Promise(function (resolve, reject) {
                    logThis('📁 Player seems online, but could not get online data, restoring layout data from file');
                    var playerData = localStorage.getItem('dataJson');
                    playerData = JSON.parse(playerData);
                    resolve(playerData.response);
                });
            }
        })
        .then(function (data) {
            return createPlayerData(data);
        });
}

function compareDetails(newData) {
    return new Promise(function (resolve, reject) {
        var getCurrentData = localStorage.getItem('dataJson');
        var currentData = JSON.parse(getCurrentData);
        delete currentData.response.player;
        var newPlayer = newData.response.player;
        delete newData.response.player;
        var result = sameObject(newData, currentData);
        if (result) {
            reject('noNews'); //is this throwing us all the way out?
        } else {
            var sameWindows = sameObject(newData.response.windows, currentData.response.windows);
            if (sameWindows) {
                findUselessFiles(newData.response.contents, currentData.response.contents);
                newData.response.player = newPlayer;
                resolve(newData);
            } else {
                switch (device) {
                    case 'signageOS':
                        sos.management.power.appRestart();
                        break;
                    default:
                        window.location.reload();
                        break;
                }
            }
        }
    });
}

function findUselessFiles(newContents, currentContents) {
    for (var i = 0; i < currentContents.length; i++) {
        if (currentContents[i].type_text == 'video' || currentContents[i].type_text == 'image' || currentContents[i].type_text == 'pdf') {
            for (var j = 0; j < newContents.length; j++) {
                if (newContents[j]._id == currentContents[i]._id) {
                    break;
                }
            }
            if (j == newContents.length) {
                deleteItem(currentContents[i]);
            }
        }
    }
}

function deleteItem(item) {
    var itemToRemove = CryptoJS.MD5(item._id + '_' + item.name_text).toString();
    switch (device) {
        case 'cordova':
            directoryEntry.getFile(
                itemToRemove,
                {
                    create: false,
                },
                function (fileEntry) {
                    fileEntry.remove(function () {
                        logThis(item.name_text + ' Deleted');
                    }, errorHandler);
                },
                errorHandler
            );
            break;
        case 'electron':
            deleteElectron(itemToRemove)
                .then(function () {
                    logThis(item.name_text + ' Deleted');
                })
                .catch(function (err) {
                    err = err.stack || err;
                    logThis(item.name_text + ': (electron) Error deleting: ' + err);
                });
            break;
        case 'signageOS':
            sos.offline.cache
                .deleteFile(itemToRemove)
                .then(function () {
                    logThis(item.name_text + ' Deleted');
                })
                .catch(function (err) {
                    err = err.stack || err;
                    logThis(item.name_text + ': (sos) Error deleting: ' + err);
                });
            break;
        case 'android':
            if (androidApp.deleteAndroid(itemToRemove) == true) {
                logThis(item.name_text + ' Deleted');
            } else {
                logThis(item.name_text + ': (android) Error deleting');
            }
            break;
    }
}

function createPlayerData(rawPlayer) {
    var player = rawPlayer.player;
    var contents = rawPlayer.contents;
    var playlists = rawPlayer.playlists;
    var windows = rawPlayer.windows;

    //setting each window with it's playlist
    for (var i = 0; i < windows.length; i++) {
        var window = windows[i];
        window.playlist = [];
        window.windowID = i;
        window.scheduleCount = 0;

        for (var k = 0; k < playlists.length; k++) {
            var playlist = playlists[k];
            try {
                if (window.multiplaylist_list_custom_playlist.indexOf(playlist._id) > -1) {
                    if (window.playlistName) {
                        window.playlistName += '&';
                        window.playlistName += playlist.name_text;
                    } else {
                        window.playlistName = playlist.name_text;
                    }
                }
            } catch (error) {
                if (playlist._id === window.playlist_id_text) {
                    window.playlistName = playlist.name_text;
                }
            }
        }
        for (var j = 0; j < contents.length; j++) {
            var item = contents[j];
            var itemKeys = Object.keys(item);
            var scheduleDays = [];

            for (var x = 0; x < itemKeys.length; x++) {
                if (itemKeys[x].indexOf('boolean') > -1) {
                    if (!item[itemKeys[x]]) {
                        scheduleDays.push(itemKeys[x]);
                        itemKeys.splice(x, 1);
                        x--;
                    }
                }
            }

            if (item.end_time_date || item.start_time_date || item.start_date_date || item.end_date_date || item.scheduleDescription_text || item.scheduleName_text || scheduleDays.length > 0) {
                item.scheduleData = {
                    rules: [],
                };

                item.scheduleData.rules.push({
                    days: '{"WeekDay":' + scheduleDays.join(',') + '}',
                    name: item.scheduleName_text,
                    scheduleDescription: item.scheduleDescription_text,
                    startDt: item.start_date_date,
                    stopDt: item.end_date_date,
                    startTime: item.start_time_date,
                    stopTime: item.end_time_date,
                });

                item.scheduleData.schedule = true;
            }

            try {
                if (window.multiplaylist_list_custom_playlist.indexOf(item.playlist_custom_playlist) > -1) {
                    window.playlist.push(item);
                }
            } catch (error) {
                if (window.playlist_id_text === item.playlist_custom_playlist) {
                    window.playlist.push(item);
                }
            }
        }
    }
    player.windows = windows;
    playerData.windows = player.windows;
    return player;
}

function buildLayout(playerDetails) {
    container.innerHTML = '';
    var windows = playerDetails.windows;
    for (var i = 0; i < windows.length; i++) {
        var x = windows[i].x_number ? 'left: ' + windows[i].x_number + '%;' : '';
        var y = windows[i].y_number ? 'top: ' + windows[i].y_number + '%;' : '';
        var w = 'width: ' + windows[i].width_number + '%;';
        var h = 'height: ' + windows[i].height_number + '%;';
        var objectFit = 'contain';
        createLayoutWindow(i, x, y, w, h, objectFit);
        go(playerDetails.windows[i]);
    }
}

function createLayoutWindow(i, x, y, w, h, contentClass) {
    var imgString = '<img id="window-i-' + i + '" class="' + contentClass + '" style="display: none; position: absolute; ' + w + h + x + y + '" />';
    var videoString = '<video id="window-v-' + i + '" class="' + contentClass + '" autoplay="autoplay" poster="" style="display: none; position: absolute;' + w + h + x + y + '"></video>';
    var urlString = '<iframe id="window-url-' + i + '" class="' + contentClass + '" style="border:0; display: none; position: absolute;' + w + h + x + y + '"></iframe>';
    container.insertAdjacentHTML('beforeend', imgString + videoString + urlString);
}

function go(details) {
    organizePlaylist(details)
        .then(scheduleFetch)
        .then(downloadItems)
        .then(clearScreen)
        .then(playItem)
        .then(periodicUpdate)
        .catch(function (err) {
            playbackError = true;
            periodicUpdate();
            err = err.stack || err;
            logThis(details.playlistName + ' ❗ Error in playback. Details: ' + err);
        });
}

function organizePlaylist(details) {
    var items = details.playlist;
    return new Promise(function organizePlaylistPromise(resolve, reject) {
        if (!items) {
            resolve(details);
        } else {
            var playlist = items.map(function (item, idx) {
                var content = {};
                content.name = item.name_text;
                content.uid = item._id;
                content.extra_data_text = item.extra_data_text;
                // if (item.type_text.indexOf('template') > -1) {
                //     content.uri = urlAPI + '/templates/' + encodeURIComponent(item.name) + '.html?id=' + item.datafeed.id;
                // } else {
                //     content.uri = urlAPI + '/api/v1/content/' + item.storage_file_id.id + '/download/' + encodeURIComponent(item.name);
                // }
                // else if (item.external_url !== null) {
                //     content.uri = item.external_url;
                // }

                content.uri = item.data_file;
                content.fileType = item.type_text;
                content.duration = item.duration1_number * 1000;
                content.ord = idx + 1;
                content.rules = [];
                content.schedule = item.scheduleData;
                // content.playlistSchedule = item.playlistSchedule;
                logThis(details.playlistName + ' 🎼 ' + content.name + ' (' + content.fileType + ') found');
                return content;
            });
            details.playlist = playlist;
            resolve(details);
        }
    });
}

function scheduleFetch(details) {
    var playlist = details.playlist;
    return new Promise(function (resolve, reject) {
        if (!playlist) {
            resolve(details);
            return;
        }

        function step(index) {
            var item = playlist[index];
            if (!item) {
                resolve(details);
                return;
            }
            if (item.schedule) {
                getScheduleRules(item.schedule)
                    .then(function (data) {
                        item.rules.push(data);
                        if (data.scheduleDescription) {
                            item = setByTheHour(data.scheduleDescription, item);
                        }
                    })
                    .then(function () {
                        if (item.playlistSchedule) {
                            var id = item.playlistSchedule;
                            getScheduleRules(id).then(function (data) {
                                data.isPlaylistRule = true;
                                item.rules.push(data);
                                if (data.scheduleDescription) {
                                    item = setByTheHour(data.scheduleDescription, item);
                                }
                                step(index + 1);
                                return;
                            });
                        } else {
                            step(index + 1);
                            return;
                        }
                    });
            } else if (item.playlistSchedule) {
                var id = item.playlistSchedule;
                getScheduleRules(id).then(function (data) {
                    data.isPlaylistRule = true;
                    item.rules.push(data);
                    if (data.scheduleDescription) {
                        item = setByTheHour(data.scheduleDescription, item);
                    }
                    step(index + 1);
                    return;
                });
            } else {
                step(index + 1);
                return;
            }
        }

        step(0);
    });
}

function setByTheHour(number, item) {
    var timeout = filterInt(number);
    if (timeout) {
        logThis('⏳ Got hourly scheduling for ' + item.name + ', will play ' + timeout + ' times per hour');
        item.playByTheHour = 3.6e6 / timeout;
    }
    return item;
}

function getScheduleRules(data) {
    return new Promise(function (resolve, reject) {
        if (data) {
            for (var q = 0; q < data.rules.length; q++) {
                var rule = data.rules[q];
                var ruleToWrite = {
                    name: rule.name,
                    scheduleDescription: rule.scheduleDescription,
                };
                if (rule.startDt !== undefined) {
                    ruleToWrite.startDate = new Date(rule.startDt);
                } else {
                    ruleToWrite.startDate = new Date(1); // 01 January 1970
                }
                if (rule.stopDt !== undefined) {
                    ruleToWrite.stopDate = new Date(rule.stopDt);
                } else {
                    ruleToWrite.stopDate = new Date(32503593600000); // 31 December 2999
                }
                if (rule.startTime !== undefined) {
                    ruleToWrite.startTime = new Date(rule.startTime);
                }
                if (rule.stopTime !== undefined) {
                    ruleToWrite.stopTime = new Date(rule.stopTime);
                }
                ruleToWrite.days = rule.days;

                //Cant receive Hours from bubble
                //     for (var i = 0; i < rule.frequencies.length; i++) {
                //         var frequency = rule.frequencies[i];
                //         if (frequency.jsonData.indexOf('WeekDay') > -1) {
                //             ruleToWrite.days = frequency.jsonData;
                //         }
                //     else if (frequency.defs[0].typeName.indexOf('TimeInterval') > -1) {
                //         ruleToWrite.timeInterval = true;
                //         for (var x = 0; x < frequency.defs[0].data.length; x++) {
                //             var timeRule = frequency.defs[0].data[x];
                //             if (timeRule.name.indexOf('start') > -1) {
                //                 ruleToWrite.startTime = timeRule.value;
                //                 ruleToWrite.startTime = ruleToWrite.startTime.split(':');
                //             } else if (timeRule.name.indexOf('stop') > -1) {
                //                 ruleToWrite.stopTime = timeRule.value;
                //                 ruleToWrite.stopTime = ruleToWrite.stopTime.split(':');
                //             }
                //         }
                //     } else {
                //         ruleToWrite.timeInterval = false;
                //     }
                // }
            }
        } else if (data.scheduleDescription) {
            var ruleToWrite = {
                id: data.schedule.id,
                name: data.schedule.name,
                scheduleDescription: data.schedule.description,
            };
        } else {
            return;
        }
        resolve(ruleToWrite);
    });
}

function downloadItems(details) {
    var playlist = details.playlist;
    var playlistToPlay = [];
    return new Promise(function (resolve, reject) {
        if (!playlist) {
            resolve(details);
            return;
        }

        function step(index) {
            var item = playlist[index];
            if (!item) {
                details.playlist = playlistToPlay;
                resolve(details);
                return;
            }
            nowPlaying.innerHTML = '<h1>Downloading ' + item.name + '</h1>';
            if (item.fileType.indexOf('url') > -1 || item.fileType.indexOf('template') > -1) {
                logThis(details.playlistName + ' 🔗 ' + item.name + ': link\\template added');
                if (item.uri && item.uri.indexOf('birthday') > -1) {
                    if (item.uri.indexOf('?file=') > -1) {
                        var linkToFile = item.uri.replace('?file=', '');
                    } else {
                        var linkToFile = item.uri + 'birthday.csv';
                    }
                    item.downloading = true;
                    fetch(linkToFile)
                        .then(function (response) {
                            return response.text();
                        })
                        .then(function (data) {
                            item.downloading = false;
                            var names = data.split(',');
                            var checkIfEmpty = isBlank(names);
                            if (!checkIfEmpty) {
                                var duration = names.length * 5000;
                                playlistToPlay.push(getItemData(item, null, duration));
                            }
                            step(index + 1);
                            return;
                        })
                        .catch(function (err) {
                            err = err.stack || err;
                            showIsNetwork(linkToFile, err, false);
                            logThis('Couldnt find birthday file. details: ' + err);
                            step(index + 1);
                            return;
                        });
                } else {
                    playlistToPlay.push(getItemData(item));
                    step(index + 1);
                    return;
                }
            } else if (item.fileType.indexOf('pdf') > -1) {
                PDFJS.workerSrc = './js/pdf.worker.js';
                var downloadPDF = PDFJS.getDocument('https:' + item.uri);
                logThis(details.playlistName + ' 🔽 ' + item.name + ': downloading. (PDF)');
                downloadPDF.promise
                    .then(function (pdf) {
                        logThis(details.playlistName + ' ✅ ' + item.name + ': download finishes.');
                        function parsePDFPages(i) {
                            return new Promise(function (resolve) {
                                if (i < pdf.numPages) {
                                    i++;
                                    return pdf
                                        .getPage(i)
                                        .then(function (page) {
                                            logThis(details.playlistName + ' 📃 ' + item.name + ' rendering PDF page ' + i);
                                            var scale = 2;
                                            var canvas = document.createElement('canvas');
                                            var viewport = page.getViewport({ scale: scale });

                                            if (!viewport.width || !viewport.height) {
                                                var viewport = page.getViewport(scale);
                                            }
                                            canvas.height = viewport.height;
                                            canvas.width = viewport.width;
                                            var canvasContext = canvas.getContext('2d');
                                            var renderContext = {
                                                canvasContext: canvasContext,
                                                viewport: viewport,
                                            };

                                            return page
                                                .render(renderContext)
                                                .promise.then(function () {
                                                    var dataUrl = canvas.toDataURL();
                                                    playlistToPlay.push(getItemData(item, dataUrl, item.duration, i));
                                                })
                                                .catch(function (err) {
                                                    err = err.stack || err;
                                                    logThis(details.playlistName + ' ❗ ' + item.name + ': Error rendering PDF page ' + i + '. Details:');
                                                    logThis(err);
                                                });
                                        })
                                        .then(function () {
                                            return resolve(parsePDFPages(i));
                                        });
                                } else {
                                    return resolve();
                                }
                            });
                        }

                        parsePDFPages(0)
                            .then(function () {
                                step(index + 1);
                                return;
                            })
                            .catch(function (err) {
                                err = err.stack || err;
                                logThis(details.playlistName + ' ❗ ' + item.name + ': Error parsing PDF. Details:');
                                logThis(err);
                                showIsNetwork(item.uri, err, false);
                                step(index + 1);
                                return;
                            });
                    })
                    .catch(function (err) {
                        err = err.stack || err;
                        logThis(details.playlistName + ' ❗ ' + item.name + ': Error getting PDF. Details:');
                        logThis(err);
                        showIsNetwork(item.uri, err, false);
                        step(index + 1);
                        return;
                    });
            } else if (!item.datauri) {
                var msg = device || 'no offline capabilities';
                logThis(details.playlistName + ' 🔽 ' + item.name + ': downloading. (' + msg + ')');
                item.downloading = true;
                var fileName = CryptoJS.MD5(item.uid + '_' + item.name).toString();
                switch (device) {
                    case 'cordova':
                        downloadCordova(item, fileName)
                            .then(function (data) {
                                item.downloading = false;
                                playlistToPlay.push(getItemData(item, data));
                                step(index + 1);
                                return;
                            })
                            .catch(function (err) {
                                err = err.stack || err;
                                showIsNetwork('https:' + item.uri, err, false);
                                logThis(details.playlistName + ' ❗ ' + item.name + ': Failed to download. error: ' + JSON.stringify(err));
                                step(index + 1);
                                return;
                            });
                        break;
                    case 'electron':
                        downloadElectron(item, fileName)
                            .then(function (data) {
                                item.downloading = false;
                                playlistToPlay.push(getItemData(item, data));
                                step(index + 1);
                                return;
                            })
                            .catch(function (err) {
                                err = err.stack || err;
                                showIsNetwork('https:' + item.uri, err, false);
                                logThis(details.playlistName + ' ❗ ' + item.name + ': Failed to download. error: ' + err);
                                step(index + 1);
                                return;
                            });
                        break;
                    case 'signageOS':
                        sos.offline.cache
                            .loadOrSaveFile(fileName, 'https:' + item.uri)
                            .then(function (file) {
                                logThis(details.playlistName + ' ✅ ' + item.name + ': download finishes or file found on disk.');
                                return file.filePath;
                            })
                            .then(function (data) {
                                item.downloading = false;
                                playlistToPlay.push(getItemData(item, data));
                                step(index + 1);
                                return;
                            })
                            .catch(function (err) {
                                err = err.stack || err;
                                showIsNetwork('https:' + item.uri, err, false);
                                logThis(details.playlistName + ' ❗ ' + item.name + ': Failed to download. error: ' + err);
                                step(index + 1);
                                return;
                            });
                        break;
                    case 'android':
                        new Promise(function (resolve, reject) {
                            var path = androidApp.downloadAndroid('https:' + item.uri, fileName, item.name);
                            if (path.indexOf('/data') > -1) {
                                resolve(path);
                            } else {
                                reject(path);
                            }
                        })
                            .then(function (data) {
                                item.downloading = false;
                                playlistToPlay.push(getItemData(item, data));
                                step(index + 1);
                                return;
                            })
                            .catch(function (err) {
                                err = err.stack || err;
                                showIsNetwork('https:' + item.uri, err, false);
                                logThis(details.windowName + ' ❗ ' + item.name + ': Failed to download. error: ' + err);
                                step(index + 1);
                                return;
                            });
                        break;
                    default:
                        fetch('https:' + item.uri)
                            .then(function (response) {
                                return response.blob();
                            })
                            .then(function (file) {
                                var filePath = window.URL.createObjectURL(file);
                                logThis(details.playlistName + ' ✅ ' + item.name + ': download finishes.');
                                return filePath;
                            })
                            .then(function (data) {
                                item.downloading = false;
                                playlistToPlay.push(getItemData(item, data));
                                step(index + 1);
                                return;
                            })
                            .catch(function (err) {
                                err = err.stack || err;
                                showIsNetwork(item.uri, err, false);
                                logThis(details.playlistName + ' ❗ ' + item.name + ': Failed to download. error: ' + err);
                                step(index + 1);
                                return;
                            });
                        break;
                }
            } else {
                playlistToPlay.push(item);
                step(index + 1);
                return;
            }
        }
        step(0);
    });
}

function getItemData(item, data, duration, page) {
    var itemDuration = duration || item.duration;
    var itemDatauri = data || item.uri;

    if (item.fileType.indexOf('pdf') > -1) {
        var itemType = 'image';
        var itemName = item.name + '(' + page + ') from PDF';
        var itemUid = item.uid + '(' + page + ')';
    } else {
        var itemType = item.fileType;
        var itemName = item.name;
        var itemUid = item.uid;
    }

    return {
        datauri: itemDatauri,
        uid: itemUid,
        uri: item.uri,
        duration: itemDuration,
        fileType: itemType,
        name: itemName,
        ord: item.ord,
        schedule: item.schedule,
        playlistSchedule: item.playlistSchedule,
        count: item.count ? item.count : 0,
        skip: item.skip,
        playByTheHour: item.playByTheHour,
        rules: item.rules.slice(0),
        extra_data_text: item.extra_data_text,
    };
}
