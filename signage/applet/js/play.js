'use strict';
var renderTask = null;

function updatePlayback(details) {
    logThis(details.playlistName + ' 🔃 Playlist updated, restarting playback');
    clearTimeout(playbackLoopID[details.windowID]);
    details.index = 0;
    return Promise.resolve(details);
}

function clearScreen(details) {
    details.index = 0;
    logWindowOff();
    document.body.style.background = '#000000';
    loader.hidden = true;
    return Promise.resolve(details);
}

function clearPlayback(details) {
    var item = {
        name: 'no content',
        fileType: 'none',
    };
    play(item, details.windowID, true);
}

function playItem(details) {
    var playlist = details.playlist;
    var nextIndex = hourlyItem.shift();
    var item = playlist[nextIndex] || playlist[details.index];

    if (!item) {
        if (details.errorCount < 10) {
            logThis(details.playlistName + ' ⚠ item not found. Forcing playback');
            details.errorCount++;
            clearTimeout(playbackLoopID[details.windowID]);
            details.index = 0;
            playItem(details);
            return;
        } else {
            clearPlayback(details);
            logThis(details.playlistName + ' ❗ playlist has no content');
            return;
        }
    }

    if (details.errorCount > 50) {
        clearTimeout(playbackLoopID[details.windowID]);
        playbackError = true;
        showThis('Error', '❗ Not able to display content');
        return;
    }

    if (nextIndex === undefined) {
        details.index = (details.index + 1) % playlist.length;

        if (item.skip) {
            logThis('⌛ ' + item.name + ' is hourly scheduled, skipping');
            playItem(details);
            return;
        } else if (item.playByTheHour) {
            item.skip = true;
            item.index = details.index - 1;
            countTillPlayback(item);
        }
    } else if (item.playByTheHour) {
        item.index = nextIndex;
        countTillPlayback(item);
    }

    if (item.downloading) {
        logThis(details.playlistName + ' ❗ ' + item.name + ': Still downloading, skipping');
        playItem(details);
        return;
    }

    if ((!item.datauri || !item.uid) && !item.extra_data_text) {
        details.errorCount++;
        if (details.errorCount > playlist.length) {
            logThis('⚠ Couldnt play any item, trying update');
            details.errorCount = 0;
            updateNow();
            return;
        }
        logThis(details.playlistName + ' ❗ ' + item.name + ': Missing media, skipping');
        setTimeout(function resumePlayback() {
            playItem(details);
        }, 1000);
        return;
    }

    if (item.rules.length > 0) {
        var playlistRules = item.rules.filter(function (rule) {
            return rule.isPlaylistRule;
        });

        if (playlistRules.length > 0) {
            for (var i = 0; i < playlistRules.length; i++) {
                var rule = playlistRules[i];
                var scheduled = scheduleCheck(rule);
                if (scheduled) {
                    logThis('🕘 ' + details.playlistName + ' ' + item.name + ': is in playlist scheduled to display now. verifying item schedules.');
                    break;
                }
            }
            if (!scheduled) {
                details.scheduleCount++;
                if (details.scheduleCount > playlist.length) {
                    allItemsSchedule(details);
                    return;
                } else {
                    logThis('🪁 ' + details.playlistName + ' ' + item.name + ': is in playlist not scheduled to display now. skipping');
                    playItem(details);
                    return;
                }
            }
        }

        var itemRules = item.rules.filter(function (rule) {
            return !rule.isPlaylistRule;
        });

        if (itemRules.length > 0) {
            for (var i = 0; i < itemRules.length; i++) {
                var rule = itemRules[i];
                var scheduled = scheduleCheck(rule);
                if (scheduled) {
                    logThis('🕘 ' + details.playlistName + ' ' + item.name + ': is scheduled to display now. playing');
                    break;
                }
            }
            if (!scheduled) {
                details.scheduleCount++;
                if (details.scheduleCount > playlist.length) {
                    allItemsSchedule(details);
                    return;
                } else {
                    logThis('🪁 ' + details.playlistName + ' ' + item.name + ': is not scheduled to display now. skipping');
                    playItem(details);
                    return;
                }
            }
        }
    }

    details.scheduleCount = 0;
    details.errorCount = 0;
    play(item, details.windowID, false);
    if (playbackLoopID[details.windowID]) {
        clearTimeout(playbackLoopID[details.windowID]);
    }
    playbackLoopID[details.windowID] = setTimeout(function loopPlay() {
        playItem(details);
        return;
    }, item.duration);
}

function countTillPlayback(item) {
    function playByTheHour() {
        if (hourlyItem.indexOf(item.index) === -1) {
            hourlyItem.push(item.index);
        }
        logThis('⌛ Finished waiting for ' + item.name + ' and it will be displayed next time');
    }
    setTimeout(playByTheHour, item.playByTheHour);
}

function scheduleCheck(item) {
    var now = new Date();
    var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var dayToday = days[now.getDay()];

    if (item.startDate) {
        if (item.startDate.getTime() <= now.getTime()) {
            //
        } else {
            return false;
        }
    }

    if (item.stopDate) {
        if (item.stopDate.getTime() >= now.getTime()) {
            //
        } else {
            return false;
        }
    }

    if (item.days) {
        if (item.days.indexOf(dayToday) === -1) {
            //
        } else {
            return false;
        }
    }

    if (item.startTime && item.stopTime) {
        var nowHour = now.getHours();
        var nowMinute = now.getMinutes();
        var startHour = item.startTime.getHours();
        var startMinute = item.startTime.getMinutes();
        var stopHour = item.stopTime.getHours();
        var stopMinute = item.stopTime.getMinutes();

        if (startHour > nowHour) {
            return false;
        } else if (startHour == nowHour) {
            if (startMinute > nowMinute) {
                return false;
            }
        }
        if (stopHour < nowHour) {
            return false;
        } else if (stopHour == nowHour) {
            if (stopMinute < nowMinute) {
                return false;
            }
        }
    }
    return true;
}

function allItemsSchedule(details) {
    logThis(details.playlistName + ' ❕ All items are scheduled, waiting for a minute before retry');
    details.scheduleCount = 0;
    clearPlayback(details);
    setTimeout(function resumePlayback() {
        playItem(details);
    }, 60000);
}

function play(content, windowID, clear) {
    var video = document.getElementById('window-v-' + windowID);
    var img = document.getElementById('window-i-' + windowID);
    var link = document.getElementById('window-url-' + windowID);
    nowPlaying.innerHTML = '<h1>Now Playing: ' + content.name + '</h1><br>for ' + Math.floor(content.duration / 1000) + ' seconds';
    if (content.fileType.indexOf('video') > -1) {
        video.src = content.datauri;
        video.style.display = 'block';
        img.style.display = 'none';
        link.style.display = 'none';
        link.src = 'about:blank';
        logThis('▶ ' + content.name + ' 🎞 video playing for ' + Math.floor(content.duration / 1000) + ' seconds');
    } else if (content.fileType.indexOf('image') > -1) {
        img.src = content.datauri;
        img.style.display = 'block';
        link.style.display = 'none';
        link.src = 'about:blank';
        video.style.display = 'none';
        logThis('▶ ' + content.name + ' 🖼 image displaying for ' + Math.floor(content.duration / 1000) + ' seconds');
    } else if (content.fileType.indexOf('url') > -1) {
        link.removeAttribute('srcdoc');
        link.src = content.datauri;
        link.style.display = 'block';
        img.style.display = 'none';
        video.style.display = 'none';
        logThis('▶ ' + content.name + ' 🌎 URL displaying for ' + Math.floor(content.duration / 1000) + ' seconds');
    } else if (content.fileType.indexOf('template') > -1) {
        link.src = '';
        link.srcdoc = content.extra_data_text;
        link.style.display = 'block';
        img.style.display = 'none';
        video.style.display = 'none';
        logThis('▶ ' + content.name + ' 🌎 template displaying for ' + Math.floor(content.duration / 1000) + ' seconds');
    } else {
        logThis('❌ ' + content.name + ': unknown file type or no content on playlist');
        link.style.display = 'none';
        img.style.display = 'none';
        video.style.display = 'none';
        if (clear) {
            clearTimeout(playbackLoopID[windowID]);
        }
        return;
    }
    playbackError = false;
    content.count++;
}

function updateNow() {
    showIsNetwork('', '', true);
    fetchPlayer(true)
        .then(function updateEachWindow(playerDetails) {
            if (typeof playerDetails === 'string') {
                throw playerDetails;
            }
            var allWindows = playerDetails.windows;
            for (var i = 0; i < allWindows.length; i++) {
                var details = allWindows[i];
                logThis('♾ Checking for updated content for window: ' + details.playlistName);
                organizePlaylist(details)
                    .then(scheduleFetch)
                    .then(downloadItems)
                    .then(updatePlayback)
                    .then(playItem)
                    .then(periodicUpdate)
                    .catch(function (err) {
                        err = err.stack || err;
                        logThis(details.playlistName + ' ❗ Failed to update. Details: ' + err);
                        periodicUpdate();
                    });
            }
        })
        .catch(function (err) {
            err = err.stack || err;
            logThis('Update check finished: ' + err);
            periodicUpdate();
        });
}

function forceWakeup() {
    if (playbackError) {
        playbackError = false;
        logThis('🔆 Refreshing playback after error');
        fetchPlayer().then(buildLayout);
    }
    if (downloadError) {
        downloadError = false;
        logThis('🔆 Refreshing playback after error');
        updateNow();
    }
}
