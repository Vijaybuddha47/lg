
declare namespace SCAPv14 {

	interface ISuccessCallback<TReturnValue = any> {
		(cbObject: TReturnValue): void;
	}
	interface IError {
		errorText: string;
	}
	interface IErrorCallback {
		(cbObject?: IError): void;
	}
	interface ISetCurrentTimeOptions {
		year: number;
		month: number;
		day: number;
		hour: number;
		minute: number;
		sec: number;
		ntp?: boolean;
	}
	interface ISetOSDLanguageOptions {
		specifier: string;
	}
	interface ISetOSDLockOptions {
		enabled: boolean;
	}
	interface ISetPictureModeOptions {
		PictureMode: string;
	}
	interface IPictureMode {
		APS: string;
		CINEMA: string;
		EXPERT1: string;
		EXPERT2: string;
		GAME: string;
		SPORTS: string;
		STANDARD: string;
		VIVID: string;
	}
	interface ISetPicturePropertyOptions {
		backlight?: number;
		contrast?: number;
		brightness?: number;
		sharpness?: number;
		hSharpness?: number;
		vSharpness?: number;
		color?: number;
		tint?: number;
		colorTemperature?: any;
		dynamicContrast?: string;
		superResolution?: string;
		colorGamut?: string;
		dynamicColor?: string;
		noiseReduction?: string;
		mpegNoiseReduction?: string;
		blackLevel?: string;
		gamma?: string;
	}
	interface ISetServerPropertyOptions {
		serverIp: string;
		serverPort: number;
		secureConnection: boolean;
		appLaunchMode: string;
		appType?: 'zip' | 'ipk';
		fqdnMode: boolean;
		fqdnAddr: string;
	}
	interface IAppMode {
		LOCAL: string;
		USB: string;
		REMOTE: string;
	}
	interface ISetTimezoneOptions {
		timeZone: ITimezoneProps;
	}
	export interface ITimezoneProps {
		continent: string;
		country: string;
		city: string;
	}
	export interface ITimezoneList {
		timeZone: ITimezoneProps[];
	}
	interface ISetUSBLockOptions {
		enabled: boolean;
	}
	interface ISetVirtualKeyboardLanguageOptions {
		languageCodeList: any;
	}
	interface IDebugOptions {
		enabled: boolean;
	}
	export class ConfigurationPlugin {
		public clearCache: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getCurrentTime: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getLocaleList: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getOSDLanguage: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getOSDLock: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getPictureMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getPictureProperty: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getProperty: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: string) => void;
		public getServerProperty: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getTimeZone: (successCallback: ISuccessCallback<ConfigurationPlugin.IGetTimeZoneSuccess>, errorCallback: IErrorCallback) => void;
		public getTimeZoneList: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getUsbLock: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getVirtualKeyboardLanguage: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public restartApplication: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public setCurrentTime: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetCurrentTimeOptions) => void;
		public setOSDLanguage: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetOSDLanguageOptions) => void;
		public setOSDLock: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetOSDLockOptions) => void;
		public setPictureMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetPictureModeOptions) => void;
		public setPictureProperty: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetPicturePropertyOptions) => void;
		public setProperty: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setServerProperty: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetServerPropertyOptions) => void;
		public setTimeZone: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetTimezoneOptions) => void;
		public setUSBLock: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetUSBLockOptions) => void;
		public setVirtualKeyboardLanguage: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetVirtualKeyboardLanguageOptions) => void;
		public debug(successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IDebugOptions): void;
	}

	namespace ConfigurationPlugin {

		interface IGetTimeZoneSuccess {
			timeZone: {
				continent: string;
				country: string;
				city: string;
			};
		}
	}

	interface ConfigurationPluginStatic {
		new(): ConfigurationPlugin;
		AppMode: IAppMode;
		PictureMode: IPictureMode;
	}

	interface IEddystoneFrame {
		UUID: string;
		URL: string;
	}
	interface IConnectWifiOptions {
		ssid: string;
		password: string;
		hidden?: boolean;
	}
	interface IGetSystemUsageInfoOptions {
		cpus?: boolean;
		memory?: boolean;
	}
	interface ISetBeaconInfoOptions {
		enabled: boolean;
		uuid?: string;
		major?: number;
		minor?: number;
	}
	interface ISetEddystoneInfoOptions {
		enabled: boolean;
		frame?: string;
		frameData?: string;
	}
	interface ISetNetworkInfoOptions {
		wired: INetworkInfoOptions;
		wifi: INetworkInfoOptions;
	}
	interface INetworkInfoOptions {
		enabled: boolean;
		method?: string;
		ipAddress?: string;
		netmask?: string;
		gateway?: string;
		dns1?: string;
		dns2?: string;
	}
	interface INetworkInfo {
		wired: INetworkInterfaceInfo;
		wifi: INetworkInterfaceInfo;
	}
	interface INetworkInterfaceInfo {
		state: NetworkInterfaceState;
		interfaceName?: string;
		ipAddress?: string;
		netmask?: string;
		gateway?: string;
		onInternet?: 'yes' | 'no';
		method?: NetworkInterfaceMethod;
		dns1?: string;
		dns2?: string;
	}
	type NetworkInterfaceState = 'connected' | 'disconnected';
	type NetworkInterfaceMethod = 'dhcp' | 'manual';
	interface ISetProxyInfoOptions {
		enabled: boolean;
		ipAddress?: string;
		port?: number;
		userName?: string;
		password?: string;
	}
	interface ISetSoftApInfo {
		enabled: boolean;
		ssid?: string;
		securityKey?: string;
	}
	interface IStartWpsOptions {
		method: "PBC" | "PIN";
	}
	export class DeviceInfoPlugin {
		public connectWifi: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IConnectWifiOptions) => void;
		public getBeaconInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getEddystoneInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getNetworkInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getNetworkMacInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getPlatformInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getProxyInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getSoftAPIInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public getSystemUsageInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options?: IGetSystemUsageInfoOptions) => void;
		public getWifiList: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public setBeaconInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetBeaconInfoOptions) => void;
		public setEddystoneInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetEddystoneInfoOptions) => void;
		public setiEddystoneInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetEddystoneInfoOptions) => void;
		public setNetworkInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetNetworkInfoOptions) => void;
		public setProxyInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetProxyInfoOptions) => void;
		public setSoftApInfo: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetSoftApInfo) => void;
		public startWps: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IStartWpsOptions) => void;
		public stopWps: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
	}

	interface DeviceInfoPluginStatic {
		new(): DeviceInfoPlugin;
		EddystoneFrame: IEddystoneFrame;
	}

	interface IDisplayMode {
		DISPLAY_OFF: string;
		DISPLAY_ON: string;
	}
	interface IDPMSignalType {
		CLOCK: string;
	}
	interface IPowerCommand {
		REBOOT: string;
		SHUTDOWN: string;
	}
	interface ITimerWeek {
		MONDAY: 1;
		TUESDAY: 2;
		WEDNESDAY: 4;
		THURSDAY: 8;
		FRIDAY: 16;
		SATURDAY: 32;
		SUNDAY: 64;
		EVERYDAY: 127;
	}
	interface IPMMode {
		PowerOff: string;
		ScreenOff: string;
		ScreenOffAlways: string;
		SustainAspectRatio: string;
	}
	interface ITimerOptions {
		hour: number;
		minute: number;
		week: number;
	}
	interface IOnTimerOptions extends ITimerOptions {
		inputSource: IInputSource;
	}
	type IInputSource = "ext://hdmi:1" | "ext://hdmi:2" | "ext://dp:1" | "ext://dvi:1";
	interface IEnableOnTimerOptions {
		allOnTimer: boolean;
	}
	interface IEnableOffTimerOptions {
		allOffTimer: boolean;
	}
	interface IEnableWakeOnLanOptions {
		wakeOnLan: boolean;
	}
	interface IExecutePowerCommandOptions {
		powerCommand: string;
	}
	interface ISetPMModeOption {
		mode: string;
	}
	interface ISetDisplayModeOption {
		displayMode: string;
	}
	interface IPowerStatus {
		wakeOnLan: boolean;
		displayMode: string;
		allOffTimer: boolean;
		allOnTimer: boolean;
	}
	interface IInputSourceStatus {
		inputSourceList: { inputPort: IInputSource; }[];
		currentSignalState: 'good' | 'bad' | 'unknown';
		currentInputSource: IInputSource;
	}

	interface IGetOnTimerListSuccess {
		timerList: SCAPv14.IOnTimerOptions[];
	}

	interface IGetOffTimerListSuccess {
		timerList: SCAPv14.ITimerOptions[];
	}

	//TODO not full implementation
	export class PowerPlugin {
		public addOffTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ITimerOptions) => void;
		public addOnTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IOnTimerOptions) => void;
		public deleteOffTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ITimerOptions) => void;
		public deleteOnTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IOnTimerOptions) => void;
		public getOffTimerList: (successCallback: ISuccessCallback<IGetOffTimerListSuccess>, errorCallback: IErrorCallback) => void;
		public getOnTimerList: (successCallback: ISuccessCallback<IGetOnTimerListSuccess>, errorCallback: IErrorCallback) => void;
		public getPowerStatus: (successCallback: ISuccessCallback<IPowerStatus>, errorCallback: IErrorCallback) => void;
		public enableAllOnTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IEnableOnTimerOptions) => void;
		public enableAllOffTimer: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IEnableOffTimerOptions) => void;
		public enableWakeOnLan: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IEnableWakeOnLanOptions) => void;
		public executePowerCommand: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IExecutePowerCommandOptions) => void;
		public getDPMWakeup: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public setDisplayMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetDisplayModeOption) => void;
		public setPMMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetPMModeOption) => void;
	}

	interface PowerPluginStatic {
		new(): PowerPlugin;
		DisplayMode: IDisplayMode;
		DPMSignalType: IDPMSignalType;
		PowerCommand: IPowerCommand;
		TimerWeek: ITimerWeek;
		PMMode: IPMMode;
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
	interface ISignageCaptureScreenOptions {
		save?: boolean;
		thumbnail?: boolean;
	}
	interface ISignageRegisterSystemMonitor {
		monitorConfiguration: ISignageRegisterSystemMonitorConfiguration,
		eventHandler: ISignageRegisterSystemMonitorEventHandler
	}
	interface ISignageRegisterSystemMonitorConfiguration {
		fan?: boolean,
		lamp?: boolean,
		screen?: boolean,
		signal?: boolean,
		temperature?: boolean
	}
	interface ISignageRegisterSystemMonitorEventHandler {
		(event: ISignageRegisterSystemMonitorEvent): void,
	}
	interface ISignageRegisterSystemMonitorEvent {
		source: TSignageMonitoringSource,
		type: TSignageEventType,
		data: {
			temperature?: number
			status?: number
		}
	}
	type TSignageMonitoringSource = 'FAN' | 'LAMP' | 'SCREEN' | 'SIGNAL' | 'THERMOMETER';
	interface ISignageMonitoringSource {
		FAN: 'FAN',
		LAMP: 'LAMP',
		SCREEN: 'SCREEN',
		SIGNAL: 'SIGNAL',
		THERMOMETER: 'THERMOMETER',
	}
	type TSignageEventType = 'CURRENT_TEMPERATURE' | 'FAN_STATUS' | 'LAMP_STATUS' | 'SCREEN_STATUS' | 'SIGNAL_STATUS';
	interface ISignageEventType {
		CURRENT_TEMPERATURE: 'CURRENT_TEMPERATURE',
		FAN_STATUS: 'FAN_STATUS',
		LAMP_STATUS: 'LAMP_STATUS',
		SCREEN_STATUS: 'SCREEN_STATUS',
		SIGNAL_STATUS: 'SIGNAL_STATUS',
	}
	export class SignagePlugin {
		public setPortraitMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignagePortraitModePluginOptions) => void;
		public setUsagePermission: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignageUsagePermissionPluginOptions) => void;
		public getUsagePermission: (successCallback: ISuccessCallback, errorCallback: IErrorCallback) => void;
		public captureScreen: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignageCaptureScreenOptions) => void;
		public registerSystemMonitor: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISignageRegisterSystemMonitor) => void;
	}

	interface SignagePluginStatic {
		new(): SignagePlugin;
		OsdPortraitMode: IOsdPortraitMode;
		KeyOperationMode: IKeyOperationMode;
		MonitoringSource: ISignageMonitoringSource;
		EventType: ISignageEventType;
	}

	interface ISoundMode {
		Standard: string;
		Cinema: string;
		ClearVoice: string;
		Sports: string;
		Music: string;
		Game: string;
	}
	interface ISoundStatus {
		level: number;
		mute: boolean;
		externalSpeaker: boolean;
	}
	interface ISetVolumeLevelOptions {
		level: number;
	}
	//TODO not full implementation
	export class SoundPlugin {
		public getSoundStatus: (successCallback: ISuccessCallback<ISoundStatus>, errorCallback: IErrorCallback) => void;
		public setVolumeLevel: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: ISetVolumeLevelOptions) => void;
	}

	interface SoundPluginStatic {
		new(): SoundPlugin;
		SoundMode: ISoundMode;
	}

	export class StoragePlugin {
		public upgradeApplication: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IUpgradeApplicationOptions) => void;
		public upgradeFirmware: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback) => void;
		public writeFile: (successCallback: ISuccessCallback<StoragePlugin.IWriteFileSuccess>, errorCallback: IErrorCallback, options: StoragePlugin.IWriteFileOptions) => void;
		public changeLogoImage: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IChangeLogoImageOptions) => void;
		public copyFile: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.ICopyFileOptions) => void;
		public downloadFirmware: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IDownloadFirmwareOptions) => void;
		public exists: (successCallback: ISuccessCallback<StoragePlugin.IExistsSuccess>, errorCallback: IErrorCallback, options: StoragePlugin.IExistsOptions) => void;
		public fsync: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IFsyncOptions) => void;
		public getStorageInfo: (successCallback: ISuccessCallback<StoragePlugin.IGetStorageSuccess>, errorCallback: IErrorCallback) => void;
		public listFiles: (successCallback: ISuccessCallback<StoragePlugin.IListFilesSuccess>, errorCallback: IErrorCallback, options: StoragePlugin.IListFilesOptions) => void;
		public mkdir: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IMkdirOptions) => void;
		public moveFile: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IMoveFileOptions) => void;
		public readFile: (successCallback: ISuccessCallback<StoragePlugin.IReadFileSuccess>, errorCallback: IErrorCallback, options: StoragePlugin.IReadFileOptions) => void;
		public removeAll: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IRemoveAllOptions) => void;
		public removeApplication: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IRemoveApplicationOptions) => void;
		public removeFile: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IRemoveFileOptions) => void;
		public statFile: (successCallback: ISuccessCallback<StoragePlugin.IStatFileSuccess>, errorCallback: IErrorCallback, options: StoragePlugin.IStatFileOptions) => void;
		public unzipFile: (successCallback: ISuccessCallback<void>, errorCallback: IErrorCallback, options: StoragePlugin.IUnzipFileOptions) => void;
		public getMD5Hash: (successCallback: ISuccessCallback<StoragePlugin.IGetMD5HashSuccess>, errorCallback: IErrorCallback, options: StoragePlugin.IGetMD5HashOptions) => void;
	}

	namespace StoragePlugin {
		type IDeviceUri = 'usb:1' | 'usb:2' | 'usb:3' | 'usb:4' | 'usb:5' | 'usb:6' | 'sdcard:1' | 'sdcard:2' | 'sdcard:3' | 'sdcard:4' | 'sdcard:5' | 'sdcard:6';

		interface IUpgradeApplicationOptions {
			to: string;
			type?: "zip" | "ipk";
			recovery: boolean;
		}
		interface IWriteFileOptions {
			path: string;
			data: string | ArrayBuffer;
			mode?: "truncate" | "append" | "position";
			position?: number;
			length?: number;
			encoding?: "utf8" | "base64" | "binary";
			offset?: number;
		}
		interface IWriteFileSuccess {
			written: number;
		}
		interface IChangeLogoImageOptions {
			uri: string;
		}
		interface ICopyFileOptions {
			source: string;
			destination: string;
			ftpOption?: {
				secure: boolean;
				secureOptions: {
					privateKey: string;
					passphrase: string;
				};
				connTimeout?: number;
				pasvTimeout?: number;
				keepalive?: number;
			};
			httpOption?: {
				maxRedirection?: number;
				headers?: any;
				timeout?: number;
			};
		}
		interface IDownloadFirmwareOptions {
			uri: string;
		}
		interface IExistsOptions {
			path: string;
		}
		interface IExistsSuccess {
			exists: boolean;
		}
		interface IFsyncOptions {
			path: string;
		}
		interface IGetStorageSuccess {
			free: number;
			total: number;
			used: number;
			externalMemory?: {
				[deviceUri: string]: {
					free: number;
					total: number;
					used: number;
				};
			};
		}
		interface IListFilesOptions {
			path: string;
		}
		interface IListFilesSuccess {
			files: {
				name: string;
				type: string;
				size: number;
			}[],
			totalCount: number;
		}
		interface IMkdirOptions {
			path: string;
		}
		interface IMoveFileOptions {
			oldPath: string;
			newPath: string;
		}
		interface IReadFileOptions {
			path: string;
			position?: number;
			length?: number;
			encoding?: 'utf8' | 'binary' | 'base64';
		}
		interface IReadFileSuccess {
			data: string | ArrayBuffer; // ArrayBuffer for binary
		}
		interface IRemoveAllOptions {
			device: 'internal' | IDeviceUri;
		}
		interface IRemoveApplicationOptions {
			to: string;
		}
		interface IRemoveFileOptions {
			file: string;
			recursive?: boolean;
		}
		interface IStatFileOptions {
			path: string;
		}
		interface IStatFileSuccess {
			type: 'file' | 'directory' | 'unknown';
			size: number; // byte
			atime: string;
			mtime: string;
			ctime: string;
		}
		interface IUnzipFileOptions {
			zipPath: string;
			targetPath: string;
		}
		interface IGetMD5HashSuccess {
			md5hash: string;
		}
		interface IGetMD5HashOptions {
			filePath: string;
		}
	}

	interface StoragePluginStatic {
		new(): StoragePlugin;
		AppMode: IAppMode;
	}

	export class TimePlugin {
		public addHolidaySchedule: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public delAllHolidaySchedules: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public delHolidaySchedule: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public getAllHolidaySchedules: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public getHolidayScheduleMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setHolidayScheduleMode: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
	}

	export class VideoPlugin {
		public getContentRotation: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public getVideoStatus: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setContentRotation: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setRotateVideoTransform: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setVideoSize: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
		public setVideoViewTransform: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: any) => void;
	}

	interface VideoPluginStatic {
		new(): VideoPlugin;
	}

	interface IChangeInputSourceOptions {
		src: IInputSource;
	}

	interface IInitializeInputSourceOptions {
		divId: string;
		videoId: string;
		callback: () => void;
		src: IInputSource;
	}

	export class InputSourcePlugin {
		public changeInputSource: (successCallback: ISuccessCallback<IInputSourceStatus>, errorCallback: IErrorCallback, options: IChangeInputSourceOptions) => void;
		public getInputSourceStatus: (successCallback: ISuccessCallback<InputSourcePlugin.IGetInputSourceStatusSuccess>, errorCallback: IErrorCallback) => void;
		public initialize: (successCallback: ISuccessCallback, errorCallback: IErrorCallback, options: IInitializeInputSourceOptions) => void;
	}

	namespace InputSourcePlugin {

		interface IGetInputSourceStatusSuccess {
			currentInputSource: IInputSource;
		}
	}

	interface InputSourcePluginStatic {
		new(): InputSourcePlugin;
	}

	type UtilityPlugin = any;

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
}
