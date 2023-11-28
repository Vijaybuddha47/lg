/// <reference path="./scapv1.4.d.ts" />

declare namespace SCAPv14 {

	interface ICustomPluginOptions {
		nativePortrait: string;
	}

	interface INativePortraitDegree {
		OFF: '0';
		DEGREE_90: '90';
		DEGREE_180: '180';
		DEGREE_270: '270';
	}

	interface INativePortraitResult {
		nativePortrait: '0' | '90' | '180' | '270';
	}

	interface IWebOSVersionResult {
		webOSVersion: string;
	}

	interface IAddUSBAttachEventListenerResult {
		deviceList: {
			type: string;
			vendor: string;
			device: string;
		}[];
	}

	export class Custom {
		Configuration: {
			setNativePortraitMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ICustomPluginOptions) => void;
			getNativePortraitMode: (successCallback: ISuccessCallback<INativePortraitResult>, errorCallback: IErrorCallback) => void;
		};
		Signage: {
			getwebOSVersion: (successCallback: ISuccessCallback<IWebOSVersionResult>, errorCallback: IErrorCallback) => void;
			addUSBAttachEventListener: (successCallback: ISuccessCallback<IAddUSBAttachEventListenerResult>, errorCallback: IErrorCallback) =>  void;
		};
	}

	interface CustomStatic {
		new(): Custom;
		NATIVEPORTRAIT: INativePortraitDegree;
	}
}

interface Window {

	Custom: SCAPv14.CustomStatic;
}
