var appDomain = 'app.angalia.co';
var testMode = '';
//Electron - "npm run test" to run with test server
if(device==='electron'){
    if (process){
        if (process.env.NODE_ENV) {
            if(process.env.NODE_ENV === 'test') {
                testMode = 'version-test/';
                showThis('Test Mode', 'Enabled');
            }
        }
    }
}

var apiVersion = 'api/1.1/';
var urlAPI = 'https://' + appDomain + '/' + testMode + apiVersion;
var userAuth = JSON.parse(localStorage.getItem('userAuth'));
var playerID = localStorage.getItem('savedPlayerID');
var playerData = { windows: [], id: playerID };
var qrCodeID = localStorage.getItem('qrCodeID');
var qrCodeInterval;
var hardwareInfo = 'userAgent: ' + navigator.userAgent + ' || platform: ' + navigator.platform + ' || App Version : ' + playerVersion + ' || ' + testMode;

function renderQRCode() {
    getQRCodeID().then(function (codeID) {
        qrcode.innerHTML = '';
        new QRCode('qrcode', {
            text: codeID,
            width: 320,
            height: 320,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.L,
        });
        qrcode.title = '';
        qrCodeID = codeID;
        qrCodeInterval = setInterval(qrCodeLogin, 10000);
        localStorage.setItem('qrCodeID', qrCodeID);
    });
}

function getQRCodeID() {
    return new Promise(function (resolve, reject) {
        if (qrCodeID) {
            resolve(qrCodeID);
            return;
        }
        fetch(urlAPI + 'wf/create', { method: 'POST' })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                resolve(data.response.code_id);
            })
            .catch(function (err) {
                setTimeout(renderQRCode, 10000);
                if (!navigator.onLine) {
                    qrcode.innerHTML = 'Device is offline, please connect to the internet.';
                } else {
                    qrcode.innerHTML = 'Cannot reach QR generation server.';
                }
                err = err.stack || err;
                logThis('Error while generating QRCode. Trying again in 10 seconds. Details: ', err);
            });
    });
}

function qrCodeLogin() {
    fetch(urlAPI + 'wf/qrcode/?id=' + qrCodeID + '&player-data=' + hardwareInfo, {
        method: 'POST',
    })
        .then(function (response) {
            alertConnection.innerText = '';
            return response.json();
        })
        .then(function (data) {
            if (!data.response.token) {
                return;
            }
            userAuth = {
                token: data.response.token,
                expires: data.response.expires,
            };
            localStorage.setItem('userAuth', JSON.stringify(userAuth));
            playerID = data.response.player_id;
            playerData.id = playerID;
            localStorage.setItem('savedPlayerID', playerID);
            qrCodeID = null;
            localStorage.removeItem('qrCodeID');
            init();
        })
        .catch(function (err) {
            alertConnection.innerText = 'No internet connection';
            err = err.stack || err;
            logThis('Error while trying to login with QR code. ' + err);
        });
}

function showLoginForm(isPreview) {
    if (isPreview) {
        document.getElementById('loginHeader').innerHTML = 'For your security, enter your password again';
        document.body.style.backgroundColor = '#00001E';
        passwordInput.focus();
        var sidebar = document.getElementById('sidebar');
        sidebar.style.setProperty('transform', 'translate(-50%, -50%)');
        sidebar.style.top = '50%';
        sidebar.style.left = '50%';
    } else {
        document.body.style.background = 'url(./assets/login.jpg) no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
    }
    document.body.style.cursor = 'default';
    loginForm.style.display = 'block';
    goButton.hidden = false;
    loader.hidden = true;
    playlistsContainer.hidden = true;
    logWindow.style.width = '30%';
    logWindow.style.left = '68%';

    var btns = [goButton, playButton];
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function (event) {
            event.preventDefault();
            if (!goButton.hidden) {
                getFormData(isPreview);
            } else {
                createNewPlayer();
            }
        });
    }

    var inputs = document.querySelectorAll('.loginInput');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                if (!goButton.hidden) {
                    getFormData(isPreview);
                } else {
                    createNewPlayer();
                }
            }
        });
    }
}

function hideLoginForm() {
    loginForm.style.display = 'none';
    document.body.style.cursor = 'none';
    logWindow.style.width = '90%';
    logWindow.style.left = '5%';
}

function getFormData(isPreview) {
    var isFormValid = checkFormData(emailInput.value, passwordInput.value);
    if (!isFormValid) {
        return;
    }
    authenticateUser(emailInput.value, passwordInput.value, isPreview).then(function () {
        if (isPreview) {
            init();
        }
    });
}

function checkFormData(user, password) {
    if (!user || !password) {
        formError.innerHTML = 'All fields are required.';
        formError.style.display = 'block';
        var inputs = document.querySelectorAll('.loginInput');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('focus', function () {
                formError.style.display = 'none';
            });
        }
        return false;
    }
    return true;
}

function authenticateUser(email, password, isUpdate) {
    return fetch(urlAPI + 'wf/login?email=' + email + '&password=' + password, {
        method: 'POST',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.statusCode === 400) {
                throw new Error('Can not access server. Can not get new token for authentication');
            }
            data.response.user_email = email;
            data.response.user_password = password;
            data.response.expires_at = Date.now() + data.response.expires;
            userAuth = data.response;
            localStorage.setItem('userAuth', JSON.stringify(data.response));
            if (isUpdate) {
                return;
            }
            getAllPlaylists();
        })
        .catch(function (err) {
            var errStr = navigator.onLine ? '❗ Incorrect email or password.' : 'Device is offline.';
            alertConnection.innerText = 'No internet connection';
            err = err.stack || err;
            logThis(errStr + err);
            formError.style.display = 'block';
            formError.innerHTML = errStr;
            setTimeout(function () {
                formError.style.display = 'none';
            }, 3000);
        });
}

function getAllPlaylists() {
    return fetch(urlAPI + 'obj/playlist', {
        headers: {
            Authorization: 'Bearer ' + userAuth.token,
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var playlists = data.response.results;
            playlists.length === 1 ? createNewPlayer(playlists[0]._id) : renderPlaylistsList(playlists);
        })
        .catch(function (err) {
            err = err.stack || err;
            logThis('Error: failed to get playlists.' + err);
        });
}

function renderPlaylistsList(playlists) {
    var strHtml = '';
    for (var i = 0; i < playlists.length; i++) {
        strHtml += '<option id="playerOption" value=' + playlists[i]._id + '>' + playlists[i].name_text + '</option>';
    }
    playlistsList.innerHTML += strHtml;
    goButton.hidden = true;
    playlistsContainer.hidden = false;
}

function createNewPlayer(defPlaylistID) {
    var playlistID = defPlaylistID || playlistsList.value;
    fetch(urlAPI + 'wf/create-player/?playlist-id=' + playlistID + '&player-data=' + hardwareInfo, {
        headers: {
            Authorization: 'Bearer ' + userAuth.token,
        },
        method: 'POST',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (createdPlayer) {
            playerID = createdPlayer.response.player_id;
            playerData.id = playerID;
            localStorage.setItem('savedPlayerID', playerID);
            init();
        })
        .catch(function (err) {
            err = err.stack || err;
            logThis('Error while created a player.', err);
            showLoginForm(); //at other brach it will display a clean form
        });
}

function checkFormData(user, password) {
    if (!user || !password) {
        formError.innerHTML = 'All fields are required.';
        formError.style.display = 'block';
        var inputs = document.querySelectorAll('.loginInput');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('focus', function () {
                formError.style.display = 'none';
            });
        }
        return false;
    }
    return true;
}
