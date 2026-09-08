import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

import { API_BASE_URL, TOKEN_KEY } from '@/lib/config';
import { deviceTimezone } from '@/lib/datetime';

// Re-exported for the screens that already import them from here.
export { TOKEN_KEY };
export const BASE_URL = API_BASE_URL;

// ── Token persistence ─────────────────────────────────────────────────────────
export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    /* keychain unavailable — the in-memory redux token still works this run */
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* nothing to clear */
  }
};

// AuthState shape defined locally to avoid a circular import with the slice.
interface AuthStateMinimal {
  auth: { token: string | null };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthStateMinimal).auth?.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    // Tell the backend this device's timezone so server-computed day grouping,
    // labels and ranges come back in the user's own local time.
    headers.set('x-timezone', deviceTimezone());
    return headers;
  },
});

// One 401 anywhere means the token expired or was revoked: drop the session so
// the root layout bounces the user back to sign-in.
const baseQueryWithAuth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Imported lazily: the slice imports nothing from here, but keeping the
    // dependency one-way makes the module graph obvious.
    const { clearAuth } = await import('../slices/authSlice');
    await deleteToken();
    api.dispatch(clearAuth());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Auth',
    'Me',
    'Accommodation',
    'HostDashboard',
    'Assignment',
    'Housekeeper',
    'CleanerRequest',
    'Schedule',
    'CleanerHome',
    'Calendar',
    'Payment',
    'Notification',
    'Support',
    'Content',
    'Chat',
    'Message',
    'Settings',
    'Blocked',
  ],
  endpoints: () => ({}),
});
