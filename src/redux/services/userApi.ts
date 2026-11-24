import { baseApi } from '../api/baseApi';
import type { ApiEnvelope } from '../types';

/** One property both users work on, as `GET /user/:id/profile` lists it. */
export interface SharedAccommodation {
  _id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  photo?: string | null;
  assignmentStatus: 'pending' | 'accepted';
  assignmentRole?: 'primary' | 'substitute' | string;
}

/**
 * Someone you work with (host <-> cleaner). Only readable when the two users
 * share an assignment or a conversation (otherwise 403). Never has email/phone.
 */
export interface UserProfile {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  profileImage: string | null;
  role: 'host' | 'cleaner' | 'admin' | null;
  city: string | null;
  createdAt: string;
  /** Hosts only (null for cleaners). */
  totalProperties: number | null;
  sharedAccommodations: SharedAccommodation[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, string>({
      query: (id) => `/user/${id}/profile`,
      transformResponse: (res: ApiEnvelope<UserProfile>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Housekeeper', id }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserProfileQuery } = userApi;
