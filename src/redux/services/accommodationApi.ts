import { baseApi } from '../api/baseApi';
import type { Accommodation, ApiEnvelope, Paginated } from '../types';

/** Common list query params for the host listing endpoints. */
export interface AccommodationListParams {
  status?: 'scheduled' | 'not_scheduled';
  accommodationType?: string;
  city?: string;
  search?: string;
  cleanerStage?: 'new' | 'assigned' | 'accepted';
  isCleanerAssigned?: boolean;
  page?: number;
  limit?: number;
}

/** GET /accommodation/dashboard — the host home screen buckets. */
export interface HostDashboard {
  recommended_schedule: any[];
  recommended_total: number;
  to_do: Paginated<any>;
}

export const accommodationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /accommodation — multipart with optional `photos[]`.
     * Build the FormData with `buildAccommodationForm` below so React Native
     * file objects are appended in the shape the server's multer expects.
     */
    createAccommodation: builder.mutation<Accommodation, FormData>({
      query: (body) => ({ url: '/accommodation', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      invalidatesTags: ['Accommodation', 'HostDashboard'],
    }),

    // Generic list (honours ?status, ?search, etc.).
    getAccommodations: builder.query<
      Paginated<Accommodation>,
      AccommodationListParams | void
    >({
      query: (params) => ({ url: '/accommodation', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Accommodation>>) => res.data,
      providesTags: ['Accommodation'],
    }),

    // Housing tab — created + cleaner-assignment stage (not scheduled yet).
    getHousing: builder.query<Paginated<Accommodation>, AccommodationListParams | void>({
      query: (params) => ({ url: '/accommodation/housing', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Accommodation>>) => res.data,
      providesTags: ['Accommodation'],
    }),

    // Planning tab — accommodations with their connected iCal feeds.
    getPlanning: builder.query<Paginated<Accommodation>, AccommodationListParams | void>({
      query: (params) => ({ url: '/accommodation/planning', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Accommodation>>) => res.data,
      providesTags: ['Accommodation', 'Calendar'],
    }),

    // Host home — recommended schedule + the to-do activity feed.
    getHostDashboard: builder.query<HostDashboard, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: '/accommodation/dashboard', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<HostDashboard>) => res.data,
      providesTags: ['HostDashboard'],
    }),

    // Full paginated recommended-schedule list ("see all" screen).
    getRecommendedSchedules: builder.query<
      Paginated<any>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/accommodation/recommended-schedule',
        params: params ?? {},
      }),
      transformResponse: (res: ApiEnvelope<Paginated<any>>) => res.data,
      providesTags: ['HostDashboard'],
    }),

    getAccommodationById: builder.query<Accommodation, string>({
      query: (id) => `/accommodation/${id}`,
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Accommodation', id }, 'Accommodation'],
    }),

    /**
     * Cleaner-side single accommodation — the host requested this cleaner for
     * it, so a separate route with its own guard (`auth("cleaner")`).
     */
    getAccommodationForCleaner: builder.query<Accommodation, string>({
      query: (id) => `/accommodation/cleaner/${id}`,
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Accommodation', id }],
    }),

    updateAccommodation: builder.mutation<Accommodation, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/accommodation/${id}`, method: 'PATCH', body }),
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      invalidatesTags: ['Accommodation', 'HostDashboard'],
    }),

    deleteAccommodation: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/accommodation/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Accommodation', 'HostDashboard'],
    }),

    // Host dismisses one card from the to-do feed.
    deleteTodoItem: builder.mutation<
      ApiEnvelope<null>,
      { kind: 'schedule' | 'assignment'; id: string }
    >({
      query: ({ kind, id }) => ({
        url: `/accommodation/todo/${kind}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HostDashboard'],
    }),
  }),
  overrideExisting: true,
});

/**
 * React Native has no `File`; an image picked with expo-image-picker is
 * appended as `{ uri, name, type }`. This builds the multipart body for
 * create/update so both screens stay consistent.
 */
export interface PickedPhoto {
  uri: string;
  name?: string;
  type?: string;
}

export const buildAccommodationForm = (
  fields: Record<string, unknown>,
  photos: PickedPhoto[] = [],
): FormData => {
  const form = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => form.append(key, String(v)));
    } else {
      form.append(key, String(value));
    }
  });

  photos.forEach((photo, index) => {
    const name = photo.name ?? photo.uri.split('/').pop() ?? `photo-${index}.jpg`;
    const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
    form.append('photos', {
      uri: photo.uri,
      name,
      type: photo.type ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as unknown as Blob);
  });

  return form;
};

export const {
  useCreateAccommodationMutation,
  useGetAccommodationsQuery,
  useGetHousingQuery,
  useGetPlanningQuery,
  useGetHostDashboardQuery,
  useGetRecommendedSchedulesQuery,
  useGetAccommodationByIdQuery,
  useGetAccommodationForCleanerQuery,
  useUpdateAccommodationMutation,
  useDeleteAccommodationMutation,
  useDeleteTodoItemMutation,
} = accommodationApi;
