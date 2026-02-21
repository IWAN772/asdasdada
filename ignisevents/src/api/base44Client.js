import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Log environment setup for debugging
console.log('Base44 Config:', {
  appId: appId ? '✓ loaded' : '✗ missing',
  apiKey: token ? '✓ loaded' : '✗ missing',
  functionsVersion,
  appBaseUrl
});

// Create a client configured for Base44 entity operations.
// The SDK will handle entity.create/list/update/delete requests.
// Note: Base44 API requires 'api_key' header, not 'token'
export const base44 = createClient({
  appId,
  apiKey: token,  // Changed from 'token' to 'apiKey'
  functionsVersion: functionsVersion || 'v1',
  serverUrl: appBaseUrl,
  requiresAuth: false
});
