import { baseApi } from '../api/baseApi';
import type {
  ApiEnvelope,
  CleanerAssignment,
  Housekeeper,
  Paginated,
} from '../types';

/**
 * Assignments = the link between a host's accommodation and a cleaner.
 * Host side discovers and invites cleaners; cleaner side reads the inbox of
 * incoming requests and accepts or refuses them.
 */
export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Host: cleaner discovery ───────────────────────────────────────────────
    findHousekeepers: builder.query<
      Paginated<Housekeeper>,
      | {
          search?: string;
          interventionZone?: string;
          page?: number;
          limit?: number;
        }
      | void
    >({
      query: (params) => ({ url: '/assignment/housekeepers', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Housekeeper>>) => res.data,
      providesTags: ['Housekeeper'],
    }),

    getHousekeeperProfile: builder.query<Housekeeper, string>({
      query: (cleanerId) => `/assignment/housekeepers/${cleanerId}`,
      transformResponse: (res: ApiEnvelope<Housekeeper>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Housekeeper', id }],
    }),

    /**
     * This cleaner's request/assignment status across the host's own
     * accommodations — drives the "already requested / already added" badges.
     */
    getCleanerAssignments: builder.query<
      {
        _id: string;
        accommodation: string;
        role: 'primary' | 'substitute';
        status: 'pending' | 'accepted' | 'refused';
        createdAt: string;
      }[],
      string
    >({
      query: (cleanerId) => `/assignment/housekeepers/${cleanerId}/assignments`,
      transformResponse: (res: ApiEnvelope<any[]>) => res.data,
      providesTags: ['Assignment'],
    }),

    // ── Host: manage assignments per accommodation ────────────────────────────
    assignCleaner: builder.mutation<
      CleanerAssignment,
      {
        accommodationId: string;
        cleanerId: string;
        role?: 'primary' | 'substitute';
        pricePerCleaning?: number;
        message?: string;
      }
    >({
      query: ({ accommodationId, ...body }) => ({
        url: `/assignment/${accommodationId}/assign`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<CleanerAssignment>) => res.data,
      invalidatesTags: ['Assignment', 'Accommodation', 'Housekeeper', 'HostDashboard'],
    }),

    getAccommodationCleaners: builder.query<CleanerAssignment[], string>({
      query: (accommodationId) => `/assignment/${accommodationId}/cleaners`,
      transformResponse: (res: ApiEnvelope<CleanerAssignment[]>) => res.data,
      providesTags: ['Assignment'],
    }),

    changeAssignmentRole: builder.mutation<
      CleanerAssignment,
      { assignmentId: string; role: 'primary' | 'substitute' }
    >({
      query: ({ assignmentId, role }) => ({
        url: `/assignment/${assignmentId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (res: ApiEnvelope<CleanerAssignment>) => res.data,
      invalidatesTags: ['Assignment', 'Accommodation'],
    }),

    removeAssignment: builder.mutation<ApiEnvelope<null>, string>({
      query: (assignmentId) => ({ url: `/assignment/${assignmentId}`, method: 'DELETE' }),
      // Ending the link also changes the cleaner's missions and the host's
      // housing / dashboard, so all of those refresh.
      invalidatesTags: [
        'Assignment',
        'Accommodation',
        'CleanerRequest',
        'CleanerHome',
        'Schedule',
        'Housekeeper',
        'HostDashboard',
      ],
    }),

    /**
     * Cleaner ends the collaboration (status -> "left"). The backend cancels
     * their upcoming cleanings there (refunding paid ones) and promotes a
     * substitute if they were primary. DELETE /assignment/:id is host-only.
     */
    leaveAssignment: builder.mutation<
      ApiEnvelope<{
        assignmentId: string;
        accommodationId: string;
        cancelledSchedules: number;
        refundedPayments: number;
        newPrimaryAssignmentId: string | null;
      }>,
      string
    >({
      query: (assignmentId) => ({
        url: `/assignment/${assignmentId}/leave`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        'Assignment',
        'Accommodation',
        'CleanerRequest',
        'CleanerHome',
        'Schedule',
        'Housekeeper',
        'HostDashboard',
        'Payment',
      ],
    }),

    // ── Host: every connection request, across properties ──────────────────
    /** GET /assignment/host — refused and left ones are kept until removed. */
    getHostAssignments: builder.query<
      Paginated<CleanerAssignment>,
      {
        /** One status or several, comma-separated. */
        status?: string;
        accommodationId?: string;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({ url: '/assignment/host', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<CleanerAssignment>>) => res.data,
      providesTags: ['Assignment'],
    }),

    // ── Cleaner: inbox ────────────────────────────────────────────────────────
    /**
     * Incoming requests. Omit `status` for everything; the backend annotates
     * each host with `totalProperties` and `memberSince` for the request card.
     */
    getMyRequests: builder.query<
      Paginated<CleanerAssignment>,
      { status?: 'pending' | 'accepted' | 'refused'; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/assignment/my-requests', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<CleanerAssignment>>) => res.data,
      providesTags: ['CleanerRequest'],
    }),

    /** Accommodations this cleaner already accepted ("my clients"). */
    getMyCleanerAccommodations: builder.query<
      Paginated<CleanerAssignment>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/assignment/my-accommodations', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<CleanerAssignment>>) => res.data,
      providesTags: ['CleanerRequest', 'Assignment'],
    }),

    respondToAssignment: builder.mutation<
      CleanerAssignment,
      { assignmentId: string; action: 'accept' | 'refuse' }
    >({
      query: ({ assignmentId, action }) => ({
        url: `/assignment/${assignmentId}/respond`,
        method: 'PATCH',
        body: { action },
      }),
      transformResponse: (res: ApiEnvelope<CleanerAssignment>) => res.data,
      invalidatesTags: ['CleanerRequest', 'Assignment', 'CleanerHome', 'Schedule'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useFindHousekeepersQuery,
  useGetHousekeeperProfileQuery,
  useGetCleanerAssignmentsQuery,
  useAssignCleanerMutation,
  useGetAccommodationCleanersQuery,
  useChangeAssignmentRoleMutation,
  useRemoveAssignmentMutation,
  useGetMyRequestsQuery,
  useGetMyCleanerAccommodationsQuery,
  useRespondToAssignmentMutation,
  useLeaveAssignmentMutation,
  useGetHostAssignmentsQuery,
} = assignmentApi;

/**
 * How many host requests are waiting for this cleaner's answer. Drives the
 * Requests tab badge and the home-screen reminder, so a new request is seen
 * without opening the Requests tab. Polls while the app is open and refreshes
 * when it returns to the foreground; accepting or refusing updates it at once
 * (the respond mutation invalidates `CleanerRequest`).
 */
export const usePendingRequestCount = (options?: { skip?: boolean }): number => {
  const { data } = useGetMyRequestsQuery(
    { status: 'pending', page: 1, limit: 1 },
    {
      skip: options?.skip,
      pollingInterval: 60_000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: 30,
    },
  );
  return data?.meta?.total ?? data?.data?.length ?? 0;
};
