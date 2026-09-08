import { baseApi } from '../api/baseApi';
import type { ApiEnvelope } from '../types';

export interface AppNotification {
  _id: string;
  user: string;
  title: string;
  message: string;
  titleFr?: string;
  messageFr?: string;
  type: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationList {
  data: AppNotification[];
  unreadCount: number;
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Pass `lang: 'fr'` to hit the French variant — the backend swaps in the
     * `titleFr`/`messageFr` copy rather than returning both.
     */
    getNotifications: builder.query<
      NotificationList,
      | { page?: number; limit?: number; isRead?: boolean; type?: string; lang?: string }
      | void
    >({
      query: (params) => {
        const { lang, ...queryParams } = params || {};
        const url = lang === 'fr' || lang === 'fn' ? '/notification/fn' : '/notification';
        return { url, params: queryParams };
      },
      transformResponse: (res: ApiEnvelope<NotificationList>) => res.data,
      providesTags: ['Notification'],
    }),

    getUnreadCount: builder.query<{ unreadCount: number }, void>({
      query: () => '/notification/unread-count',
      transformResponse: (res: ApiEnvelope<{ unreadCount: number }>) => res.data,
      providesTags: ['Notification'],
    }),

    markNotificationRead: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/notification/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),

    markAllNotificationsRead: builder.mutation<ApiEnvelope<null>, void>({
      query: () => ({ url: '/notification/read-all', method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/notification/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
