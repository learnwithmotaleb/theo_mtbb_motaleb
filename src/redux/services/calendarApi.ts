import { baseApi } from '../api/baseApi';
import type { ApiEnvelope, CalendarConnection } from '../types';

/**
 * "Connect my calendars" — the host links Airbnb/Booking iCal feeds to an
 * accommodation, and the month/list views merge those bookings with the
 * cleanings scheduled for the same property.
 */
export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query<CalendarConnection[], string>({
      query: (accommodationId) => `/calendar/${accommodationId}/connections`,
      transformResponse: (res: ApiEnvelope<CalendarConnection[]>) => res.data,
      providesTags: ['Calendar'],
    }),

    addConnection: builder.mutation<
      CalendarConnection,
      { accommodationId: string; platform?: string; label?: string; icalUrl: string }
    >({
      query: ({ accommodationId, ...body }) => ({
        url: `/calendar/${accommodationId}/connections`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<CalendarConnection>) => res.data,
      invalidatesTags: ['Calendar', 'Accommodation'],
    }),

    removeConnection: builder.mutation<ApiEnvelope<null>, string>({
      query: (connectionId) => ({
        url: `/calendar/connections/${connectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Calendar', 'Accommodation'],
    }),

    /** Manual "refresh now" — re-pulls every feed on the accommodation. */
    syncCalendars: builder.mutation<{ message: string; connections: number }, string>({
      query: (accommodationId) => ({
        url: `/calendar/${accommodationId}/sync`,
        method: 'POST',
      }),
      transformResponse: (res: ApiEnvelope<{ message: string; connections: number }>) =>
        res.data,
      invalidatesTags: ['Calendar'],
    }),

    getCalendarMonth: builder.query<
      any,
      { accommodationId: string; year?: number; month?: number }
    >({
      query: ({ accommodationId, ...params }) => ({
        url: `/calendar/${accommodationId}/month`,
        params,
      }),
      transformResponse: (res: ApiEnvelope<any>) => res.data,
      providesTags: ['Calendar'],
    }),

    getCalendarList: builder.query<
      any,
      { accommodationId: string; year?: number; month?: number }
    >({
      query: ({ accommodationId, ...params }) => ({
        url: `/calendar/${accommodationId}/list`,
        params,
      }),
      transformResponse: (res: ApiEnvelope<any>) => res.data,
      providesTags: ['Calendar'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetConnectionsQuery,
  useAddConnectionMutation,
  useRemoveConnectionMutation,
  useSyncCalendarsMutation,
  useGetCalendarMonthQuery,
  useGetCalendarListQuery,
} = calendarApi;
