const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

// Default values that work on hosting
const DEFAULT_APP_ID = '6989edde65063fc06a55765d';
const DEFAULT_ACCESS_TOKEN = '062e5cf56d324c539922ea2aa2ee05a3';
const DEFAULT_APP_BASE_URL = 'https://api.base44.com';

const getAppParams = () => {
	if (typeof window !== 'undefined' && getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	
	// Get from environment variables or use defaults
	const envAppId = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_BASE44_APP_ID : undefined;
	const envToken = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_BASE44_ACCESS_TOKEN : undefined;
	const envFunctionsVersion = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_BASE44_FUNCTIONS_VERSION : undefined;
	const envAppBaseUrl = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_BASE44_APP_BASE_URL : undefined;
	
	const params = {
		appId: getAppParamValue("app_id", { defaultValue: envAppId || DEFAULT_APP_ID }),
		token: getAppParamValue("access_token", { defaultValue: envToken || DEFAULT_ACCESS_TOKEN, removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: typeof window !== 'undefined' ? window.location.href : '' }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: envFunctionsVersion || 'v1' }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: envAppBaseUrl || DEFAULT_APP_BASE_URL }),
	};
	
	// Debug logging
	if (typeof window !== 'undefined' && import.meta?.env?.DEV) {
		console.log('[AppParams] Loaded config:', {
			appId: params.appId?.substring(0, 8) + '...' || 'MISSING',
			token: params.token?.substring(0, 8) + '...' || 'MISSING',
			functionsVersion: params.functionsVersion,
			appBaseUrl: params.appBaseUrl
		});
	}
	
	return params;
}


export const appParams = {
	...getAppParams()
}
