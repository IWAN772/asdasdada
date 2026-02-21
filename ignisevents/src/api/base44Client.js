import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Get app params with fallbacks
const getAppParams = () => {
  try {
    const params = appParams || {};
    return {
      appId: params.appId || import.meta.env.VITE_BASE44_APP_ID || '6989edde65063fc06a55765d',
      apiKey: params.token || import.meta.env.VITE_BASE44_ACCESS_TOKEN || '062e5cf56d324c539922ea2aa2ee05a3',
      functionsVersion: params.functionsVersion || import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1',
      appBaseUrl: params.appBaseUrl || import.meta.env.VITE_BASE44_APP_BASE_URL || 'https://api.base44.com'
    };
  } catch (e) {
    // Fallback when running in browser without proper setup
    return {
      appId: import.meta.env.VITE_BASE44_APP_ID || '6989edde65063fc06a55765d',
      apiKey: import.meta.env.VITE_BASE44_ACCESS_TOKEN || '062e5cf56d324c539922ea2aa2ee05a3',
      functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1',
      appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || 'https://api.base44.com'
    };
  }
};

const { appId, apiKey, functionsVersion, appBaseUrl } = getAppParams();

// Log environment setup for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('Base44 Config:', {
    appId: appId ? '✓ loaded' : '✗ missing',
    apiKey: apiKey ? '✓ loaded' : '✗ missing',
    functionsVersion,
    appBaseUrl
  });
}

// Create a client configured for Base44 entity operations
// The SDK will handle entity.create/list/update/delete requests
export const base44 = createClient({
  appId,
  apiKey,
  functionsVersion: functionsVersion || 'v1',
  serverUrl: appBaseUrl,
  requiresAuth: false
});

// Export a helper to check if Base44 is configured
export const isBase44Configured = () => {
  return !!(appId && apiKey);
};
