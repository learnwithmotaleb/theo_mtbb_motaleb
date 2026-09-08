// Auth types. The canonical API shapes now live in `@/redux/types` (shared with
// the website's contracts); this module re-exports them so existing screens
// keep their imports and older aliases (BaseResponse, AuthUser) still resolve.

import type { ApiEnvelope, Role as ApiRole, User } from '@/redux/types';

export type { User, Accommodation, Paginated } from '@/redux/types';

/** The app only ever signs in a host or a cleaner (admin is dashboard-only). */
export type AppRole = 'host' | 'cleaner';

/** Nullable while onboarding — verify-otp issues a token before a role exists. */
export type Role = ApiRole | null;

export type AuthUser = User;

export type BaseResponse<T = null> = ApiEnvelope<T>;

/** verify-otp / signin also carry the token at the envelope's top level. */
export interface VerifyOtpResponse extends ApiEnvelope<User> {
  token: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  /** Email captured at the start of signup / reset so later steps reuse it. */
  pendingEmail: string | null;
  /** Password captured during signup so we can re-signin after select-role. */
  pendingPassword: string | null;
  /** False until the persisted session has been read back from SecureStore. */
  isBootstrapped: boolean;
}
