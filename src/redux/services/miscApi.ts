import { baseApi } from '../api/baseApi';
import { PLATFORM_FEE_PERCENT } from '@/lib/pricing';
import type { ApiEnvelope } from '../types';

// ─── Support (Help & Support form) ────────────────────────────────────────────

export interface SupportTicket {
  _id: string;
  subject: string;
  email: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

/** A person this user has blocked, as `GET /user/blocked` returns them. */
export interface BlockedUser {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  profileImage?: string | null;
  role?: string | null;
}

// ─── Static legal / about content ─────────────────────────────────────────────

export type ContentType =
  | 'about_us'
  | 'terms_of_use'
  | 'privacy_policy'
  | 'legal_notice';

export interface ContentPage {
  type: ContentType;
  content: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Platform settings ────────────────────────────────────────────────────────

export interface PublicSettings {
  /** Platform commission %, charged to the host on top of the cleaner's rate. */
  platformCommission: number;
}

export const miscApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation<
      SupportTicket,
      { subject: string; email: string; message: string }
    >({
      query: (body) => ({ url: '/support', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<SupportTicket>) => res.data,
      invalidatesTags: ['Support'],
    }),

    getAllContent: builder.query<ContentPage[], void>({
      query: () => '/content',
      transformResponse: (res: ApiEnvelope<ContentPage[]>) => res.data,
      providesTags: ['Content'],
    }),

    getContent: builder.query<ContentPage, ContentType>({
      query: (type) => `/content/${type}`,
      transformResponse: (res: ApiEnvelope<ContentPage>) => res.data,
      providesTags: (_r, _e, type) => [{ type: 'Content', id: type }],
    }),

    /**
     * The commission an admin set in the dashboard, so every price breakdown
     * matches what Stripe actually charges at checkout.
     */
    getPublicSettings: builder.query<PublicSettings, void>({
      query: () => '/settings/public',
      transformResponse: (res: ApiEnvelope<PublicSettings>) => res.data,
      providesTags: ['Settings'],
    }),

    // ── Push notifications (OneSignal player id) ─────────────────────────────
    /** Register this device on login / after the permission prompt. */
    registerDeviceToken: builder.mutation<ApiEnvelope<null>, { playerId: string }>({
      query: (body) => ({ url: '/user/device-token', method: 'POST', body }),
    }),

    /** Unregister on logout so a signed-out device stops receiving pushes. */
    removeDeviceToken: builder.mutation<ApiEnvelope<null>, void>({
      query: () => ({ url: '/user/device-token', method: 'DELETE' }),
    }),

    // ── Blocking ─────────────────────────────────────────────────────────────
    // Blocking is symmetric on the backend: once either side blocks, neither
    // can message the other.
    getBlockedUsers: builder.query<BlockedUser[], void>({
      query: () => '/user/blocked',
      transformResponse: (res: ApiEnvelope<BlockedUser[]>) => res.data,
      providesTags: ['Blocked'],
    }),

    blockUser: builder.mutation<ApiEnvelope<null>, string>({
      query: (userId) => ({ url: `/user/block/${userId}`, method: 'POST' }),
      invalidatesTags: ['Blocked', 'Chat', 'Message'],
    }),

    unblockUser: builder.mutation<ApiEnvelope<null>, string>({
      query: (userId) => ({ url: `/user/block/${userId}`, method: 'DELETE' }),
      invalidatesTags: ['Blocked', 'Chat', 'Message'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSupportTicketMutation,
  useGetBlockedUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetAllContentQuery,
  useGetContentQuery,
  useGetPublicSettingsQuery,
  useRegisterDeviceTokenMutation,
  useRemoveDeviceTokenMutation,
} = miscApi;

/**
 * Fee percentage to price with. Falls back to the backend's default while the
 * request is in flight (or if it fails), so totals never render as a 0% fee.
 */
export const usePlatformFeePercent = (): number => {
  const { data } = useGetPublicSettingsQuery();
  const pct = data?.platformCommission;
  return typeof pct === 'number' && Number.isFinite(pct) ? pct : PLATFORM_FEE_PERCENT;
};
