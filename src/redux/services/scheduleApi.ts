import { baseApi } from '../api/baseApi';
import type {
  ApiEnvelope,
  CleaningSchedule,
  MissionCard,
  Paginated,
} from '../types';
import type { PickedPhoto } from './accommodationApi';

export interface CreateSchedulePayload {
  accommodationId: string;
  /** The assigned cleaner (its user id or the assignment id). */
  cleanerId: string;
  /** `YYYY-MM-DD` — the backend resolves it against the x-timezone header. */
  date: string;
  checkInTime: string; // HH:mm
  checkOutTime: string; // HH:mm
  notes?: string;
  /** Optional iCal booking to link this cleaning to. */
  bookingId?: string;
}

/** GET /schedule/cleaner/home */
export interface CleanerHome {
  summary: { date: string; missionsToday: number; completedToday: number };
  todaysCleaning: MissionCard[];
  upcomingTasks: MissionCard[];
}

/** GET /schedule/cleaner/planning */
export interface CleanerPlanning {
  range: { from: string; to: string };
  /** Per-day counts for the calendar strip dots. */
  days: { date: string; count: number }[];
  groups: { date: string; label: string; count: number; missions: MissionCard[] }[];
}

// Photos ride along as multipart; RN files are `{ uri, name, type }`.
const photosForm = (
  photos: PickedPhoto[],
  fields: Record<string, string | undefined>,
): FormData => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value) form.append(key, value);
  });
  photos.forEach((photo, index) => {
    const name = photo.name ?? photo.uri.split('/').pop() ?? `proof-${index}.jpg`;
    const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
    form.append('photos', {
      uri: photo.uri,
      name,
      type: photo.type ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as unknown as Blob);
  });
  return form;
};

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Host ──────────────────────────────────────────────────────────────────
    createSchedule: builder.mutation<CleaningSchedule, CreateSchedulePayload>({
      query: ({ accommodationId, ...body }) => ({
        url: `/schedule/${accommodationId}`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'Accommodation', 'HostDashboard'],
    }),

    getHostSchedules: builder.query<
      Paginated<CleaningSchedule>,
      | {
          status?: string;
          /** Named lifecycle bucket for the planning-list tabs. */
          view?: 'awaiting' | 'accepted' | 'pay_now' | 'paid';
          accommodationId?: string;
          page?: number;
          limit?: number;
        }
      | void
    >({
      query: (params) => ({ url: '/schedule/host', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<CleaningSchedule>>) => res.data,
      providesTags: ['Schedule'],
    }),

    /** Host validates the cleaning — this releases the escrowed payout. */
    completeSchedule: builder.mutation<CleaningSchedule, string>({
      query: (id) => ({ url: `/schedule/${id}/complete`, method: 'PATCH' }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'Payment', 'HostDashboard', 'CleanerHome'],
    }),

    /** Host rejects the submitted proof — sends the job back to the cleaner. */
    invalidateProof: builder.mutation<CleaningSchedule, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/schedule/${id}/invalidate`,
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'HostDashboard', 'CleanerHome'],
    }),

    /** Host edits a schedule — allowed only while the cleaner has not accepted. */
    updateSchedule: builder.mutation<
      CleaningSchedule,
      {
        id: string;
        cleanerId?: string;
        date?: string;
        checkInTime?: string;
        checkOutTime?: string;
        notes?: string;
      }
    >({
      query: ({ id, ...body }) => ({ url: `/schedule/${id}`, method: 'PATCH', body }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'CleanerHome'],
    }),

    deleteSchedule: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/schedule/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Schedule', 'Calendar', 'Accommodation', 'HostDashboard', 'CleanerHome'],
    }),

    /** Host asks to settle in cash instead of via Stripe. */
    initiateHandCash: builder.mutation<CleaningSchedule, string>({
      query: (id) => ({ url: `/schedule/${id}/handcash`, method: 'POST' }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'HostDashboard', 'CleanerHome'],
    }),

    // ── Cleaner ───────────────────────────────────────────────────────────────
    getCleanerHome: builder.query<CleanerHome, void>({
      query: () => '/schedule/cleaner/home',
      transformResponse: (res: ApiEnvelope<CleanerHome>) => res.data,
      providesTags: ['CleanerHome', 'Schedule'],
    }),

    /** Calendar view. Pass `?month=YYYY-MM`, or an explicit `from`/`to` range. */
    getCleanerPlanning: builder.query<
      CleanerPlanning,
      { month?: string; from?: string; to?: string; status?: string } | void
    >({
      query: (params) => ({ url: '/schedule/cleaner/planning', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<CleanerPlanning>) => res.data,
      providesTags: ['CleanerHome', 'Schedule'],
    }),

    /**
     * The cleaner's mission list. `status: 'accepted'` covers both `accepted`
     * and `in_progress` — accepting moves a job straight to in_progress while
     * the host's payment may still be pending.
     */
    getCleanerSchedules: builder.query<
      Paginated<MissionCard>,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/schedule/cleaner', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<MissionCard>>) => res.data,
      providesTags: ['Schedule'],
    }),

    respondToSchedule: builder.mutation<
      CleaningSchedule,
      { id: string; action: 'accept' | 'refuse' }
    >({
      query: ({ id, action }) => ({
        url: `/schedule/${id}/respond`,
        method: 'PATCH',
        body: { action },
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'CleanerHome', 'HostDashboard'],
    }),

    /** Cleaner submits the after-cleaning proof (multipart: photos[]). */
    submitProof: builder.mutation<
      CleaningSchedule,
      { id: string; proofNotes?: string; photos?: PickedPhoto[] }
    >({
      query: ({ id, proofNotes, photos = [] }) => ({
        url: `/schedule/${id}/submit-proof`,
        method: 'PATCH',
        body: photosForm(photos, { proofNotes }),
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'CleanerHome', 'HostDashboard'],
    }),

    /** Cleaner raises a problem about the property (multipart: photos[]). */
    reportDispute: builder.mutation<
      CleaningSchedule,
      { id: string; reason?: string; notes?: string; photos?: PickedPhoto[] }
    >({
      query: ({ id, reason, notes, photos = [] }) => ({
        url: `/schedule/${id}/dispute`,
        method: 'PATCH',
        body: photosForm(photos, { reason, notes }),
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'CleanerHome', 'HostDashboard'],
    }),

    approveHandCash: builder.mutation<CleaningSchedule, string>({
      query: (id) => ({ url: `/schedule/${id}/handcash/approve`, method: 'POST' }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'CleanerHome', 'Payment'],
    }),

    // ── Shared (host or its cleaner) ──────────────────────────────────────────
    getScheduleById: builder.query<CleaningSchedule, string>({
      query: (id) => `/schedule/${id}`,
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      // Also provide the plain 'Schedule' tag so list-level invalidations
      // (complete / invalidate / pay) refetch this detail view too.
      providesTags: (_r, _e, id) => [{ type: 'Schedule', id }, 'Schedule'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateScheduleMutation,
  useGetHostSchedulesQuery,
  useCompleteScheduleMutation,
  useInvalidateProofMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useInitiateHandCashMutation,
  useGetCleanerHomeQuery,
  useGetCleanerPlanningQuery,
  useGetCleanerSchedulesQuery,
  useRespondToScheduleMutation,
  useSubmitProofMutation,
  useReportDisputeMutation,
  useApproveHandCashMutation,
  useGetScheduleByIdQuery,
} = scheduleApi;
