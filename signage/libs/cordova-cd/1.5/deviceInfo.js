DeviceInfo=function(){var e,o;function n(e,o,n){void 0!==e.errorCode&&null!==e.errorCode||(e.errorCode=o),void 0!==e.errorText&&null!==e.errorText||(e.errorText=n)}"object"==typeof window?(cordova.define("cordova/plugin/deviceInfo",function(n,t,r){e=function(){},o=window.PalmSystem?n("cordova/plugin/webos/service"):{Request:function(e,o){"function"==typeof o.onFailure&&o.onFailure({returnValue:!1,errorText:"PalmSystem Not Available. Cordova is not installed?"})}},r.exports=e}),e=cordova.require("cordova/plugin/deviceInfo")):(e=function(e){(o=e).Request=function(e,n){var t=e+"/"+n.method,r={};!0===n.hasOwnProperty("parameters")&&(r=n.parameters);var i={};o&&o.call(t,r,function(e){console.log("res : "+JSON.stringify(e)),!0===e.payload.returnValue?(i=e.payload,n.onSuccess(i)):(i.returnValue=!1,i.errorCode=e.payload.errorCode,i.errorText=e.payload.errorText,n.onFailure(i))})}},module.exports=e);var t=null,r={};return e.EddystoneFrame={UUID:"uid",URL:"url"},e.prototype.getNetworkInfo=function(e,n){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"getNetworkInfo",parameters:{},onSuccess:function(o){"function"==typeof e&&(delete o.returnValue,e(o))},onFailure:function(t){-1!==t.errorText.indexOf("Unknown method")?o.Request("luna://com.palm.connectionmanager",{method:"getstatus",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}}):(delete t.returnValue,"function"==typeof n&&n(t))}})},e.prototype.setNetworkInfo=function(e,n,t){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"setNetworkInfo",parameters:t,onSuccess:function(o){"function"==typeof e&&e()},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.getBeaconInfo=function(e,n){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"getBeaconInfo",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.setBeaconInfo=function(e,t,r){var i;if(!0===r.enabled&&(0==(void 0!==(i=r.uuid)&&null!==i&&32==i.length&&null!==new RegExp(/^[a-fA-F0-9]*$/g).exec(i))||isNaN(r.major)||r.major<0||r.major>65535||isNaN(r.minor)||r.minor<0||r.minor>65535)){if("function"==typeof t){var a={};n(a,"DSBI","DeviceInfo.setBeaconInfo. Invalid options."),t(a)}}else o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"setBeaconInfo",parameters:r,onSuccess:function(o){"function"==typeof e&&e()},onFailure:function(e){delete e.returnValue,"function"==typeof t&&t(e)}})},e.prototype.getSoftApInfo=function(e,n){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"getSoftApInfo",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.setSoftApInfo=function(e,t,r){if(!0===r.enabled&&(null!==r.ssid&&r.ssid.length>32||null!==r.securityKey&&6!==r.securityKey.length)){if("function"==typeof t){var i={};n(i,"DSSI","DeviceInfo.setSoftApInfo. Invalid options."),t(i)}}else o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"setSoftApInfo",parameters:r,onSuccess:function(o){"function"==typeof e&&e()},onFailure:function(e){delete e.returnValue,"function"==typeof t&&t(e)}})},e.prototype.getWifiList=function(e,n){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"getWifiList",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.connectWifi=function(e,n,t){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"connectWifi",parameters:t,onSuccess:function(o){"function"==typeof e&&e()},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.startWps=function(e,n,t){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"startWps",parameters:t,onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.stopWps=function(e,n){o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"stopWps",parameters:{},onSuccess:function(o){"function"==typeof e&&e()},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.getNetworkMacInfo=function(e,n){var i;i=function(t){4===t.webOSVer||t.webOSVer>4?o.Request("luna://com.webos.service.commercial.scapadapter/deviceinfo",{method:"getNetworkMacInfo",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}}):o.Request("luna://com.webos.service.tv.signage",{method:"getinfo",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},null===t?o.Request("luna://com.webos.service.tv.systemproperty",{method:"getSystemInfo",parameters:{keys:["sdkVersion","boardType"]},onSuccess:function(e){e.sdkVersion;var o=e.sdkVersion.split(".");r=o.length>=1&&"1"===o[0]?{webOSVer:1,chipset:e.boardType.split("_")[0]}:o.length>=1&&"2"===o[0]?{webOSVer:2,chipset:e.boardType.split("_")[0]}:o.length>=1&&"3"===o[0]?{webOSVer:3,chipset:e.boardType.split("_")[0]}:o.length>=1&&"4"===o[0]?{webOSVer:4,chipset:e.boardType.split("_")[0]}:{webOSVer:0,chipset:""},t=r.webOSVer,delete e.returnValue,i(r)},onFailure:function(e){delete e.returnValue,i(r={webOSVer:0,chipset:""})}}):i(r)},e.prototype.getPlatformInfo=function(e,n){o.Request("luna://com.webos.service.tv.systemproperty",{method:"getSystemInfo",parameters:{keys:["modelName","serialNumber","firmwareVersion","hardwareVersion","sdkVersion"]},onSuccess:function(o){o.manufacturer="LGE",o.sdkVersion="1.5.4",delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof n&&n(e)}})},e.prototype.getSystemUsageInfo=function(e,n,t){o.Request("luna://com.webos.service.commercial.signage.storageservice",{method:"getSystemUsageInfo",parameters:{cpus:t.cpus,memory:t.memory},onSuccess:function(o){if(!0===o.returnValue){var t={};void 0!==o.memory&&(t.memory=o.memory),void 0!==o.cpus&&(t.cpus=o.cpus),"function"==typeof e&&e(t)}else"function"==typeof n&&n({errorCode:o.errorCode,errorText:o.errorText})},onFailure:function(e){"function"==typeof n&&n({errorCode:e.errorCode,errorText:e.errorText})}})},e.prototype.setProxyInfo=function(e,t,r){var i={};if(r.enabled,"boolean"!=typeof r.enabled&&"function"==typeof t)return n(a={},"DSPI","DeviceInfo.setProxyInfo returns failure. enabled is not boolean."),void t(a);if(0==r.enabled)i.proxyEnable="off","string"==typeof r.ipAddress&&null!==r.ipAddress.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)&&(i.proxySingleAddress=r.ipAddress),!1===isNaN(r.port)&&(i.proxySinglePort=r.port.toString());else{var a;if(i.proxyEnable="on",("string"!=typeof r.ipAddress||null===r.ipAddress.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/))&&"function"==typeof t)return n(a={},"DSPI","DeviceInfo.setProxyInfo returns failure. ipAddress is not valid."),void t(a);if(isNaN(r.port)&&"function"==typeof t)return n(a={},"DSPI","DeviceInfo.setProxyInfo returns failure. port is not number."),void t(a);i.proxySingleAddress=r.ipAddress,i.proxySinglePort=r.port.toString()}"string"==typeof r.userName&&(i.proxySingleUsername=r.userName),"string"==typeof r.password&&(i.proxySinglePassword=r.password),JSON.stringify(i),o.Request("luna://com.webos.service.commercial.signage.storageservice/settings/",{method:"set",parameters:{category:"commercial",settings:i},onSuccess:function(o){!0===o.returnValue&&"function"==typeof e&&e()},onFailure:function(e){delete e.returnValue,"function"==typeof t&&(n(e,"DSPI","DeviceInfo.setProxyInfo returns failure."),t(e))}})},e.prototype.getProxyInfo=function(e,t){o.Request("luna://com.webos.service.commercial.signage.storageservice/settings/",{method:"get",parameters:{category:"commercial",keys:["proxyEnable","proxySingleAddress","proxySinglePort"]},onSuccess:function(o){if(!0===o.returnValue){var n={};n.enabled="on"===o.settings.proxyEnable,n.ipAddress=o.settings.proxySingleAddress,n.port=parseInt(o.settings.proxySinglePort),"function"==typeof e&&e(n)}},onFailure:function(e){delete e.returnValue,"function"==typeof t&&(n(e,"DGPI","DeviceInfo.getProxyInfo returns failure."),t(e))}})},e.prototype.setiBeaconInfo=function(e,t,r){var i,a={};if((null===r.enabled||void 0===r.enabled||"boolean"!=typeof r.enabled)&&"function"==typeof t)return n(s={},"DSIB","DeviceInfo.setiBeaconInfo returns failure. enabled is required."),void t(s);if(0==r.enabled)a.beaconMode="off";else{var s;if((null===r.uuid||void 0===r.uuid||0==(void 0!==(i=r.uuid)&&null!==i&&32==i.length&&null!==new RegExp(/^[a-fA-F0-9]*$/g).exec(i)))&&"function"==typeof t)return n(s={},"DSIB","DeviceInfo.setiBeaconInfo returns failure. uuid is not valid."),void t(s);if((null===r.major||void 0===r.major||isNaN(r.major)||r.major<0||r.major>65535||null===r.minor||void 0===r.minor||isNaN(r.minor)||r.minor<0||r.minor>65535)&&"function"==typeof t)return n(s={},"DSIB","DeviceInfo.setiBeaconInfo returns failure. major and minor are not valid."),void t(s);a.beaconMode="on",a.beaconType="iBeacon",a.iBeaconUuid=r.uuid,a.iBeaconMajor=r.major.toString(),a.iBeaconMinor=r.minor.toString()}JSON.stringify(a),o.Request("luna://com.webos.service.commercial.signage.storageservice/settings/",{method:"set",parameters:{category:"commercial",settings:a},onSuccess:function(n){!0===n.returnValue&&o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"notifyUpdatingBeaconInfo",parameters:{},onSuccess:function(o){delete o.returnValue,"function"==typeof e&&e(o)},onFailure:function(e){delete e.returnValue,"function"==typeof t&&t(e)}})},onFailure:function(e){delete e.returnValue,"function"==typeof t&&(n(e,"DSIB","DeviceInfo.setiBeaconInfo returns failure."),t(e))}})},e.prototype.getiBeaconInfo=function(e,t){o.Request("luna://com.webos.service.commercial.signage.storageservice/settings/",{method:"get",parameters:{category:"commercial",keys:["beaconMode","iBeaconUuid","iBeaconMajor","iBeaconMinor"]},onSuccess:function(o){if(!0===o.returnValue){var n={};n.enabled="on"===o.settings.beaconMode,n.uuid=o.settings.iBeaconUuid,n.major=parseInt(o.settings.iBeaconMajor),n.minor=parseInt(o.settings.iBeaconMinor),"function"==typeof e&&e(n)}},onFailure:function(e){delete e.returnValue,"function"==typeof t&&(n(e,"DGIB","DeviceInfo.getiBeaconInfo returns failure."),t(e))}})},e.prototype.setEddystoneInfo=function(t,r,i){var a,s={};if(i.enabled,(null===i.enabled||void 0===i.enabled||"boolean"!=typeof i.enabled)&&"function"==typeof r)return n(u={},"DSEI","DeviceInfo.setEddystoneInfo returns failure. enabled is required."),void r(u);if(!1===i.enabled)s.beaconMode="off";else if(s.beaconMode="on",s.beaconType="eddystone",i.frame===e.EddystoneFrame.UUID){if(0==(void 0!==(a=i.frameData)&&null!==a&&32==a.length&&null!==new RegExp(/^[a-fA-F0-9]*$/g).exec(a))&&"function"==typeof r)return n(u={},"DSEI","DeviceInfo.setEddystoneInfo returns failure. frameData is not valid."),void r(u);s.eddyStoneFrame=i.frame,s.eddyStoneUuid=i.frameData}else{if(i.frame!==e.EddystoneFrame.URL)return n(u={},"DSEI","DeviceInfo.setEddystoneInfo returns failure. frame is not valid."),void r(u);if((null===i.frameData||void 0===i.frameData||"string"!=typeof i.frameData||i.frameData.search("://")<0||"HTTP"!==i.frameData.substring(0,4).toUpperCase())&&"function"==typeof r)return n(u={},"DSEI","DeviceInfo.setEddystoneInfo returns failure. frameData is not valid."),void r(u);s.eddyStoneFrame=i.frame,s.eddyStoneUrlPrefix=i.frameData.substring(0,i.frameData.search("://")),"WWW"===i.frameData.substring(i.frameData.search("://")+3,3).toUpperCase()&&(s.eddyStoneUrlPrefix=s.eddyStoneUrlPrefix+"Ex");var u,c=0;if("HTTP"===s.eddyStoneUrlPrefix.toUpperCase()?c=7:"HTTPEX"===s.eddyStoneUrlPrefix.toUpperCase()?c=11:"HTTPS"===s.eddyStoneUrlPrefix.toUpperCase()?c=8:"HTTPSEX"===s.eddyStoneUrlPrefix.toUpperCase()&&(c=12),i.frameData.length-c>17)return n(u={},"DSEI","DeviceInfo.setEddystoneInfo returns failure. url size is over."),void r(u);s.eddyStoneUrl=i.frameData.substring(c,i.frameData.length),s.eddyStoneUrlExCode="noneValue"}JSON.stringify(s),o.Request("luna://com.webos.service.commercial.signage.storageservice/settings/",{method:"set",parameters:{category:"commercial",settings:s},onSuccess:function(e){!0===e.returnValue&&o.Request("luna://com.webos.service.commercial.signage.storageservice/network/",{method:"notifyUpdatingBeaconInfo",parameters:{},onSuccess:function(e){delete e.returnValue,"function"==typeof t&&t(e)},onFailure:function(e){delete e.returnValue,"function"==typeof r&&r(e)}})},onFailure:function(e){delete e.returnValue,"function"==typeof r&&(n(e,"DSEI","DeviceInfo.setEddystoneInfo returns failure."),r(e))}})},e.prototype.getEddystoneInfo=function(t,r){o.Request("luna://com.webos.service.commercial.signage.storageservice/settings/",{method:"get",parameters:{category:"commercial",keys:["beaconMode","eddyStoneFrame","eddyStoneUuid","eddyStoneUrlPrefix","eddyStoneUrl","eddyStoneUrlExCode"]},onSuccess:function(o){if(!0===o.returnValue){var n={};n.enabled="on"===o.settings.beaconMode,n.frame=o.settings.eddyStoneFrame,o.settings.eddyStoneFrame===e.EddystoneFrame.UUID?n.frameData=o.settings.eddyStoneUuid:"http"===o.settings.eddyStoneUrlPrefix?n.frameData="http://"+o.settings.eddyStoneUrl:"httpEx"===o.settings.eddyStoneUrlPrefix?n.frameData="http://www."+o.settings.eddyStoneUrl:"https"===o.settings.eddyStoneUrlPrefix?n.frameData="https://"+o.settings.eddyStoneUrl:n.frameData="https://www."+o.settings.eddyStoneUrl,"function"==typeof t&&t(n)}},onFailure:function(e){delete e.returnValue,"function"==typeof r&&(n(e,"DGEI","DeviceInfo.getEddystoneInfo returns failure."),r(e))}})},e}();