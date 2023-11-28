cordova.define("cordova/plugin/video",function(e,d,f){function g(h){}var a;if(window.PalmSystem){g("Window.PalmSystem Available");a=e("cordova/plugin/webos/service")}else{a={Request:function(h,i){g(h+" invoked. But I am a dummy because PalmSystem is not available");if(typeof i.onFailure==="function"){i.onFailure({returnValue:false,errorText:"PalmSystem Not Available. Cordova is not installed?"})}}}}var b=function(){};function c(i,j,h){if(i.errorCode===undefined||i.errorCode===null){i.errorCode=j}if(i.errorText===undefined||i.errorText===null){i.errorText=h}}b.prototype.getVideoStatus=function(h,i){g("getVideoStatus: ");a.Request("luna://com.webos.service.tv.signage/",{method:"getVideoSize",onSuccess:function(j){g("getVideoStatus: On Success");if(j.returnValue===true){if(h&&typeof h==="function"){var k={};k.source=j.videoSize.source;h(k)}}},onFailure:function(j){g("getVideoStatus: On Failure");delete j.returnValue;if(i&&typeof i==="function"){c(j,"VGVS","Video.getVideoStatus returns failure.");i(j)}}});g("Video.getVideoStatus Done")};b.currentVideo={uri:null,source:null,tagId:null};b.prototype.setVideoSize=function(i,j,k){g("setVideoSize: "+JSON.stringify(k));if(k.source===undefined||typeof k.source.x!=="number"||typeof k.source.y!=="number"||typeof k.source.width!=="number"||typeof k.source.height!=="number"||isNaN(k.source.x)||isNaN(k.source.y)||isNaN(k.source.width)||isNaN(k.source.height)||k.source.x<0||k.source.y<0||k.source.width<=0||k.source.height<=0){if(j&&typeof j==="function"){var h={};c(h,"VSVS","Video.setVideoSize returns failure. out of range or type error.");j(h)}return}a.Request("luna://com.webos.service.tv.signage/",{method:"getVideoSize",onSuccess:function(l){g("setVideoSize: On Success");if(l.returnValue===true){var p={};p.x=l.videoSize.destination.x;p.y=l.videoSize.destination.y;p.width=l.videoSize.destination.width;p.height=l.videoSize.destination.height;var m=document.getElementsByTagName("video");var o=false;for(var n=0;n<m.length;n++){if(m[n].currentTime>0){o=true;if(b.currentVideo.uri!==m[n].src||(m[n].id!==null&&m[n].id!==undefined&&b.currentVideo.tagId!==null&&b.currentVideo.tagId!==undefined&&b.currentVideo.tagId!==m[n].id)){b.currentVideo.uri=m[n].src;b.currentVideo.source=l.videoSize.source;b.currentVideo.tagId=m[n].id}break}}if(o===false){a.Request("luna://com.webos.service.eim/",{method:"getCurrentInput",parameters:{},onSuccess:function(r){if(r.returnValue===true&&b.currentVideo.uri!==r.mainInputSourceId||(m[0].id!==null&&m[0].id!==undefined&&b.currentVideo.tagId!==null&&b.currentVideo.tagId!==undefined&&b.currentVideo.tagId!==m[0].id)){b.currentVideo.uri=r.mainInputSourceId;b.currentVideo.tagId=(m[0]!==null&&m[0].id!==null&&m[0].id!==undefined?m[0].id:null);a.Request("luna://com.webos.service.tv.signage/",{method:"getVideoSize",onSuccess:function(v){g("setVideoSize: On Success 1");if(v.returnValue===true){b.currentVideo.source=v.videoSize.source;if(v.videoSize.source.width===0&&v.videoSize.source.height===0){b.currentVideo={uri:null,source:null,tagId:null};var u={};c(u,"VSVS","Video.setVideoSize returns failure. Not ready to setVideoSize.");j(u);return}else{if(b.currentVideo.uri===null||b.currentVideo.source===null||(k.source.width+k.source.x)>(b.currentVideo.source.x+b.currentVideo.source.width)||(k.source.height+k.source.y)>(b.currentVideo.source.y+b.currentVideo.source.height)){var t={};c(t,"VSVS","Video.setVideoSize returns failure. out of range or type error. ("+b.currentVideo.source.width+" : "+b.currentVideo.source.height+")");j(t);return}}a.Request("luna://com.webos.service.tv.signage/",{method:"setVideoSize",parameters:{videoSize:{source:{x:k.source.x,y:k.source.y,width:k.source.width,height:k.source.height},destination:{x:p.x,y:p.y,width:p.width,height:p.height}}},onSuccess:function(w){g("setVideoSize: On Success 2");if(w.returnValue===true&&i&&typeof i==="function"){i();return}},onFailure:function(w){g("setVideoSize: On Failure 2");delete w.returnValue;if(j&&typeof j==="function"){c(w,"VSVS","Video.setVideoSize returns failure. Can't current video source size.");j(w);return}}})}}})}else{if(b.currentVideo.uri===null||b.currentVideo.source===null||(k.source.width+k.source.x)>(b.currentVideo.source.x+b.currentVideo.source.width)||(k.source.height+k.source.y)>(b.currentVideo.source.y+b.currentVideo.source.height)){var s={};c(s,"VSVS","Video.setVideoSize returns failure. out of range or type error. ("+b.currentVideo.source.width+" : "+b.currentVideo.source.height+")");j(s);return}a.Request("luna://com.webos.service.tv.signage/",{method:"setVideoSize",parameters:{videoSize:{source:{x:k.source.x,y:k.source.y,width:k.source.width,height:k.source.height},destination:{x:p.x,y:p.y,width:p.width,height:p.height}}},onSuccess:function(t){g("setVideoSize: On Success 3");if(t.returnValue===true&&i&&typeof i==="function"){i();return}},onFailure:function(t){g("setVideoSize: On Failure 3");delete t.returnValue;if(j&&typeof j==="function"){c(t,"VSVS","Video.setVideoSize returns failure. Can't current video source size.");j(t);return}}})}},onFailure:function(){}})}else{if(b.currentVideo.uri===null||b.currentVideo.source===null||(k.source.width+k.source.x)>(b.currentVideo.source.x+b.currentVideo.source.width)||(k.source.height+k.source.y)>(b.currentVideo.source.y+b.currentVideo.source.height)){var q={};c(q,"VSVS","Video.setVideoSize returns failure. out of range or type error. ("+b.currentVideo.source.width+" : "+b.currentVideo.source.height+")");j(q);return}a.Request("luna://com.webos.service.tv.signage/",{method:"setVideoSize",parameters:{videoSize:{source:{x:k.source.x,y:k.source.y,width:k.source.width,height:k.source.height},destination:{x:p.x,y:p.y,width:p.width,height:p.height}}},onSuccess:function(r){g("setVideoSize: On Success 4");if(r.returnValue===true&&i&&typeof i==="function"){i();return}},onFailure:function(r){g("setVideoSize: On Failure 4");delete r.returnValue;if(j&&typeof j==="function"){c(r,"VSVS","Video.setVideoSize returns failure. Can't current video source size.");j(r);return}}})}}},onFailure:function(l){g("setVideoSize: On Failure");delete l.returnValue;if(j&&typeof j==="function"){c(l,"VSVS","Video.setVideoSize returns failure.");j(l);return}}});g("Video.setVideoSize Done")};f.exports=b});Video=cordova.require("cordova/plugin/video");