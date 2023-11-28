
declare namespace SCAPv16 {

	import IInputSource = SCAPv14.IInputSource;

	interface ISuccessCallback<TReturnValue = any> {
		(cbObject: TReturnValue): void;
	}

	interface IErrorCallback {
		(cbObject?: any): void;
	}

	type ITimerType = 'OFFTIMER' | 'ONTIMER';

	interface ITimerOptions {
		type: ITimerType;
		hour: number;
		minute: number;
		week: number;
	}

	interface ITimer {
		id: string;
		type: ITimerType;
		hour: number;
		minute: number;
		week: number;
	}

	interface ICancelOnOffTimerOptions {
		id: number;
	}

	interface IInputSourceStatus {
		inputSourceList: { inputPort: IInputSource; }[];
		currentSignalState: 'good' | 'bad' | 'unknown';
		currentInputSource: IInputSource;
	}

	export class TimePlugin {
		public addHolidaySchedule: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public delAllHolidaySchedules: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public delHolidaySchedule: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public getAllHolidaySchedules: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public getHolidayScheduleMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setHolidayScheduleMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public cancelOnOffTimer:
			(successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ICancelOnOffTimerOptions) => void;
		public clearAllOnOffTimers: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getAllOnOffTimers: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public reserveOnOffTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ITimerOptions) => void;
	}

	interface TimePluginStatic {
		new(): TimePlugin;
	}

	interface IChangeInputSourceOptions {
		src: IInputSource;
	}

	interface IInitializeInputSourceOptions {
		divId: string;
		videoId: string;
		callback: () => void;
		src: IInputSource;
		noaudio: boolean;
	}

	export class InputSourcePlugin {
		public changeInputSource:
			(successCallback: ISuccessCallback<IInputSourceStatus>, errorCallback: IErrorCallback, options: IChangeInputSourceOptions) => void;
		public getInputSourceStatus: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public initialize: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IInitializeInputSourceOptions) => void;
	}

	interface InputSourcePluginStatic {
		new(): InputSourcePlugin;
	}

	interface ISignagePortraitModePluginOptions {
		portraitMode: string;
	}

	interface IOsdPortraitMode {
		OFF: string;
		ON: string;
	}

	interface ISignageUsagePermistionPolicy {
		remoteKeyOperationMode: TKeyOperationMode;
		localKeyOperationMode: TKeyOperationMode;
	}

	interface ISignageUsagePermissionPluginOptions {
		policy: ISignageUsagePermistionPolicy;
	}

	type TKeyOperationMode = 'normal' | 'blockAll' | 'usePwrOnly';

	interface IKeyOperationMode {
		ALLOW_ALL: 'normal';
		BLOCK_ALL: 'blockAll';
		POWER_ONLY: 'usePwrOnly';
	}

	interface IImgResolution {
		HD: string;
		FHD: string;
	}

	interface ISignageCaptureScreenOptions {
		save?: boolean;
		thumbnail?: boolean;
		imgResolution?: IImgResolution;
	}

	interface ISignageRegisterSystemMonitor {
		monitorConfiguration: ISignageRegisterSystemMonitorConfiguration;
		eventHandler: ISignageRegisterSystemMonitorEventHandler;
	}

	interface ISignageRegisterSystemMonitorConfiguration {
		fan?: boolean;
		lamp?: boolean;
		screen?: boolean;
		signal?: boolean;
		temperature?: boolean;
	}
	interface ISignageRegisterSystemMonitorEventHandler {
		(event: ISignageRegisterSystemMonitorEvent): void;
	}
	interface ISignageRegisterSystemMonitorEvent {
		source: TSignageMonitoringSource;
		type: TSignageEventType;
		data: {
			temperature?: number
			status?: number
		};
	}
	type TSignageMonitoringSource = 'FAN' | 'LAMP' | 'SCREEN' | 'SIGNAL' | 'THERMOMETER';
	interface ISignageMonitoringSource {
		FAN: 'FAN';
		LAMP: 'LAMP';
		SCREEN: 'SCREEN';
		SIGNAL: 'SIGNAL';
		THERMOMETER: 'THERMOMETER';
	}
	type TSignageEventType = 'CURRENT_TEMPERATURE' | 'FAN_STATUS' | 'LAMP_STATUS' | 'SCREEN_STATUS' | 'SIGNAL_STATUS';
	interface ISignageEventType {
		CURRENT_TEMPERATURE: 'CURRENT_TEMPERATURE';
		FAN_STATUS: 'FAN_STATUS';
		LAMP_STATUS: 'LAMP_STATUS';
		SCREEN_STATUS: 'SCREEN_STATUS';
		SIGNAL_STATUS: 'SIGNAL_STATUS';
	}

	export class SignagePlugin {
		public setPortraitMode:
			(successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignagePortraitModePluginOptions) => void;
		public setUsagePermission:
			(successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignageUsagePermissionPluginOptions) => void;
		public getUsagePermission: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public captureScreen: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignageCaptureScreenOptions) => void;
		public registerSystemMonitor:
			(successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignageRegisterSystemMonitor) => void;
	}

	interface SignagePluginStatic {
		OsdPortraitMode: IOsdPortraitMode;
		KeyOperationMode: IKeyOperationMode;
		MonitoringSource: ISignageMonitoringSource;
		EventType: ISignageEventType;
		ImgResolution: IImgResolution;
		new(): SignagePlugin;
	}

	export namespace API {
		export class Widget {
			public sendReadyEvent(): void;
		}
	}
}

interface Window {
	Configuration: SCAPv14.ConfigurationPluginStatic;
	DeviceInfo: SCAPv14.DeviceInfoPluginStatic;
	Power: SCAPv14.PowerPluginStatic;
	Sound: SCAPv14.SoundPluginStatic;
	Storage: SCAPv14.StoragePluginStatic;
	Signage: SCAPv14.SignagePluginStatic;
	Video: SCAPv14.VideoPluginStatic;
	InputSource: SCAPv14.InputSourcePluginStatic;
	Time: SCAPv16.TimePluginStatic;
}
