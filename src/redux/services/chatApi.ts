import { baseApi } from '../api/baseApi';
import type { ApiEnvelope, Paginated } from '../types';
import type { PickedPhoto } from './accommodationApi';

export interface Conversation {
  _id: string;
  participants: any[];
  otherParticipant: any | null;
  unreadCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: any;
  content?: string;
  messageType: 'text' | 'image' | 'pdf' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  messageType: 'image' | 'pdf' | 'file';
}

/**
 * Chat over REST. The backend also broadcasts every message over Socket.io,
 * but `POST /chat/:id/messages` sends AND broadcasts in one call, so the app
 * needs no socket client: send over REST, and keep the thread fresh with the
 * `pollingInterval` the chat screen passes to `useGetMessagesQuery`.
 */
export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<Conversation, { receiverId: string }>({
      query: (body) => ({ url: '/chat/conversation', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Conversation>) => res.data,
      invalidatesTags: ['Chat'],
    }),

    getConversations: builder.query<
      Paginated<Conversation>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/chat/conversations', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Conversation>>) => res.data,
      providesTags: ['Chat'],
    }),

    getMessages: builder.query<
      Paginated<Message>,
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, ...params }) => ({
        url: `/chat/${conversationId}/messages`,
        params,
      }),
      transformResponse: (res: ApiEnvelope<Paginated<Message>>) => res.data,
      providesTags: (_r, _e, { conversationId }) => [
        { type: 'Message', id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<
      Message,
      { conversationId: string; text?: string; file?: PickedPhoto }
    >({
      query: ({ conversationId, text, file }) => {
        const form = new FormData();
        if (text) form.append('text', text);
        if (file) {
          const name = file.name ?? file.uri.split('/').pop() ?? 'attachment.jpg';
          const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
          form.append('file', {
            uri: file.uri,
            name,
            type: file.type ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          } as unknown as Blob);
        }
        return { url: `/chat/${conversationId}/messages`, method: 'POST', body: form };
      },
      transformResponse: (res: ApiEnvelope<Message>) => res.data,
      invalidatesTags: (_r, _e, { conversationId }) => [
        { type: 'Message', id: conversationId },
        'Chat',
      ],
    }),

    editMessage: builder.mutation<Message, { messageId: string; text: string }>({
      query: ({ messageId, text }) => ({
        url: `/chat/messages/${messageId}`,
        method: 'PATCH',
        body: { text },
      }),
      transformResponse: (res: ApiEnvelope<Message>) => res.data,
      invalidatesTags: ['Message', 'Chat'],
    }),

    deleteMessage: builder.mutation<
      ApiEnvelope<null>,
      { messageId: string; deleteFor: 'me' | 'everyone' }
    >({
      query: ({ messageId, deleteFor }) => ({
        url: `/chat/messages/${messageId}`,
        method: 'DELETE',
        body: { deleteFor },
      }),
      invalidatesTags: ['Message', 'Chat'],
    }),

    markConversationRead: builder.mutation<ApiEnvelope<null>, string>({
      query: (conversationId) => ({
        url: `/chat/${conversationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Chat'],
    }),

    uploadChatFile: builder.mutation<UploadedFile, PickedPhoto>({
      query: (file) => {
        const form = new FormData();
        const name = file.name ?? file.uri.split('/').pop() ?? 'attachment.jpg';
        const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
        form.append('file', {
          uri: file.uri,
          name,
          type: file.type ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        } as unknown as Blob);
        return { url: '/chat/upload', method: 'POST', body: form };
      },
      transformResponse: (res: ApiEnvelope<UploadedFile>) => res.data,
    }),
  }),
  overrideExisting: true,
});

export const {
  useStartConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useMarkConversationReadMutation,
  useUploadChatFileMutation,
} = chatApi;
