// Central place for API endpoints. Values come from EXPO_PUBLIC_* env vars,
// which Expo inlines at build time.

/**
 * Development fallback only. A release build must be given real HTTPS URLs:
 * a LAN address would leave the shipped app unable to reach anything, and both
 * stores reject apps whose main flows do not work on the reviewer's device.
 * iOS App Transport Security also blocks plain HTTP by default.
 */
const DEV_API_ORIGIN = 'http://10.10.28.192:6050';

const requireProdUrl = (value: string | undefined, name: string): string => {
  if (value) return value;
  if (__DEV__) return '';
  // Fails at startup rather than shipping a build that silently talks to a
  // machine on the developer's network.
  throw new Error(
    `${name} is not set. Set it in the EAS build profile before releasing.`,
  );
};

export const API_ORIGIN =
  process.env.EXPO_PUBLIC_API_ORIGIN ||
  requireProdUrl(undefined, 'EXPO_PUBLIC_API_ORIGIN') ||
  DEV_API_ORIGIN;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  requireProdUrl(undefined, 'EXPO_PUBLIC_API_BASE_URL') ||
  `${DEV_API_ORIGIN}/api/v1`;

// expo-secure-store key holding the session token. The user object is NOT
// persisted — SecureStore values are size-capped on Android, so the profile is
// refetched from GET /auth/me on boot instead (always fresh, never stale).
export const TOKEN_KEY = 'gestlio_token';

// Turn a backend-relative asset path (e.g. "/uploads/profiles/x.png") into an
// absolute URL. Absolute URLs and empty values are returned untouched.
export const resolveAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
};
