var tvKeyCode = {};
var scount = 0,mainCount = 0;
var vers = null;
var eventTimer = '';
var scrollEvent = true;
var airMouse = false;
var isTizen = false;
var selectedMovie = '',view = '';
var wslog;
var wsconnected = false;
var handleKeys;

/**
 * Creates a read/writable property which returns a function set for write/set (assignment)
 * and read/get access on a variable
 *
 * @param {Any} value initial value of the property
 */
 function createProperty(value) {
    var _value = value;

    /**
     * Overwrite getter.
     *
     * @returns {Any} The Value.
     * @private
     */
    function _get() {
        return _value;
    }

    /**
     * Overwrite setter.
     *
     * @param {Any} v   Sets the value.
     * @private
     */
    function _set(v) {
        _value = v;
    }

    return {
        "get": _get,
        "set": _set
    };
}

/**
 * Creates or replaces a read-write-property in a given scope object, especially for non-writable properties.
 * This also works for built-in host objects (non-DOM objects), e.g. navigator. 
 * Optional an initial value can be passed, otherwise the current value of the object-property will be set.
 *
 * @param {Object} objBase  e.g. window
 * @param {String} objScopeName    e.g. "navigator"
 * @param {String} propName    e.g. "userAgent"
 * @param {Any} initValue (optional)   e.g. window.navigator.userAgent
 */
function makePropertyWritable(objBase, objScopeName, propName, initValue) {
    var newProp,
        initObj;

    if (objBase && objScopeName in objBase && propName in objBase[objScopeName]) {
        if(typeof initValue === "undefined") {
            initValue = objBase[objScopeName][propName];
        }

        newProp = createProperty(initValue);

        try {
            Object.defineProperty(objBase[objScopeName], propName, newProp);
        } catch (e) {
            initObj = {};
            initObj[propName] = newProp;
            try {
                objBase[objScopeName] = Object.create(objBase[objScopeName], initObj);
            } catch(e) {
                // Workaround, but necessary to overwrite native host objects
            }
        }
    }
}

var app = {
    // Application Constructor
    initialize: function() {
    	 //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		 this.onDeviceReady();
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
       
    },
    
    receivedEvent: function(id) {
		var loadTimeInterval;
		function checkMain(){
			try{
				if(Main){
					Main.initialize();
					clearInterval(loadTimeInterval);
					loadTimeInterval = '';
				}
			}
			catch(e){
				clearInterval(loadTimeInterval);
				loadTimeInterval = '';
				loadTimeInterval = setTimeout(checkMain,500);
				console.log("error code = ", e);
               	app.sendlog("exception " + JSON.stringify(e));
			}
		}
		loadTimeInterval = setTimeout(checkMain,500);

		if (window.tizen !== undefined) {
			isTizen = true;
		} else {
			//selectedContainer = '.m3u8';
		}

		if (isTizen) {
			var usedKeys = [
				'MediaPlay',	
				'MediaPause',
				'MediaStop',
				'MediaFastForward',
				'MediaRewind',
				'MediaPlayPause',
				'Search',
				'ColorF0Red',
				'ColorF1Green',
				'ColorF2Yellow',
				'ColorF3Blue',
				'ChannelUp',
				'ChannelDown',
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9'
			];

			usedKeys.forEach(
				function (keyName) {
					tizen.tvinputdevice.registerKey(keyName);
				}
			);
		}
		

		var supportedKeys = [
			{name: 'ArrowUp', code: 38},
			{name: 'ArrowDown', code: 40},
			{name: 'ArrowLeft', code: 37},
			{name: 'ArrowRight', code: 39},
			{name: 'Enter', code: 13},
			{name: 'Return', code: 461},
			{name: 'ColorF0Red', code: 403},
			{name: 'ColorF1Green', code: 404},
			{name: 'ColorF2Yellow', code: 405},
			{name: 'ColorF3Blue', code: 406},
			{name: 'MediaStop', code: 413},
			{name: 'MediaFastForward', code: 417},
			{name: 'MediaPlayPause', code: 10252},
			{name: 'MediaPlay', code: 415},
			{name: 'MediaPause', code: 19},
			{name: 'MediaRewind', code: 412},
			{name: 'ChannelUp', code: 427},
			{name: 'ChannelDown', code: 428},
			{name: 'ChannelUpLG', code: 33},
			{name: 'ChannelDownLG', code: 34},
			{name: 'Search', code: 10225},
			{name: 'Cancel', code: 65385},
			{name: 'Done', code: 65376},
			{name: 'Num0', code: 48},
			{name: 'Num1', code: 49},
			{name: 'Num2', code: 50},
			{name: 'Num3', code: 51},
			{name: 'Num4', code: 52},
			{name: 'Num5', code: 53},
			{name: 'Num6', code: 54},
			{name: 'Num7', code: 55},
			{name: 'Num8', code: 56},
			{name: 'Num9', code: 57}
		];

		for(var i=0; i<supportedKeys.length; i++) {
			tvKeyCode[supportedKeys[i].name] = supportedKeys[i].code;
			//tizen.tvinputdevice.registerKey(supportedKeys[i].name);
		}

		//"TAMASHA-TVتماشاPlayer"
		/*
		$.ajaxSetup({
			beforeSend: function(request) {
				request.setRequestHeader("User-Agent","TAMASHA-TV Player");
			}
		});
		*/
		if (!isTizen) {
			try {
				makePropertyWritable(window, "navigator", "userAgent");
				window.navigator.userAgent = "TAMASHA-TVتماشاPlayer";
				log(window.navigator.userAgent);
			} catch (e) {
				log(e);
			}
		}

		setInterval(function(){
			var homeH1 = $('.homeH1');
			if (homeH1 !== undefined && homeH1 !== null && homeH1 != "") {
				homeH1.html(updateDateTimeHtml());
			}
			var ihours = $('#ihours');
			var iampm = $('#iampm');
			var idate = $('#idate');
			if (ihours !== undefined && ihours != '') {
				ihours.html(getHours());
			}
			if (iampm !== undefined && iampm != '') {
				iampm.html(getAmPm());
			}
			if (idate !== undefined && idate != '') {
				idate.html(getDayDate());
			}
		}, 10000);
		
		handleKeys = function (e) {
			
			airMouse = false;
			var source = $(".imageFocus").attr("source");
			if(source && source == "list"){
				if(!scrollEvent){}
				else{
					try {
						Main.processTrigger(e);
					} catch (err) {
						app.sendlog("exception while process trigger scrollEvent=true source=" + source + " excp=" + err);
					}
					scrollEvent = false;
					
					eventTimer = setTimeout(function(){
						scrollEvent = true;
						clearTimeout(eventTimer);
						eventTimer = '';
					},100);
				}
			}
			else{
				app.sendlog("Triggered");
				try {
					Main.processTrigger(e);
				} catch (err) {
					app.sendlog("exception while process trigger source=" + source + " excp=" + err);
				}
			}
		};
		
		window.removeEventListener("keydown", handleKeys);
		window.addEventListener('keydown', handleKeys);

		setTimeout(function(){
			app.openws();
		}, 1000);

	},
	openws: function() {
		/*
		wslog = new WebSocket("ws://panel.indigotv.me:18080/log");

		wslog.onopen = function(e) {
			wsconnected = true;
			//wslog.send("tizen v" + Main.tvVersion +" boxid=193D0990FE2F");
			//wslog.send("tizen v" + Main.tvVersion +" boxid=193D0990FE2E");
			wslog.send("tizen v" + Main.tvVersion + " boxid=" + Main.BOXID);
			app.sendlog("TV width = " + Main.screenWidth + ", height = " + Main.screenHeight);
			app.sendlog("TV res width = " + Main.resolutionWidth + ", res height = " + Main.resolutionHeight);
			app.sendlog("TV dots width = " + Main.dotsPerInchWidth + ", dots height = " + Main.dotsPerInchHeight);
			app.sendlog("TV phys width = " + Main.physicalWidth + ", phys height = " + Main.physicalHeight);
		};

		wslog.onmessage = function(event) {
			if (event.data.indexOf('/key=')==0) {
				var keys = event.data.split('=');
				var krects = keys[1].split('-');
				if (krects.length > 1) {
					webapis.avplay.setDisplayRect(
						parseInt(krects[0]),
						parseInt(krects[1]),
						parseInt(krects[2]),
						parseInt(krects[3])
					);
				} else {
					var keyCode = parseInt(keys[1]);
					var e = $.Event('ke$');
					e.which = keyCode;
					e.keyCode = keyCode;
					handleKeys(e);
				}
			}
			console.log(event.data);
		};

		wslog.onclose = function(event) { 
			wsconnected = false;
			setTimeout(function(){
				app.openws();
			}, 1000);
		};
		*/
	},
	sendlog: function(msg) {
		//if (wsconnected)
		//	wslog.send('tizen ' + msg);
	},
	sendcmd: function(msg) {
		//if (wsconnected)
		//	wslog.send(msg);
	}
};

$(window).load(function(){ app.initialize(); });
