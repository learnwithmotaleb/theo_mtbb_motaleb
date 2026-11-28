import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { showToast } from '@/components/shared/Toast';
import { useT } from '@/i18n';
import { getApiErrorMessage } from '@/lib/apiError';
import { resolveAssetUrl } from '@/lib/config';
import { formatTime } from '@/lib/datetime';
import { avatarSource, personName } from '@/lib/mappers';
import { useCurrentUser } from '@/redux/hooks';
import {
  useGetConversationQuery,
  useGetConversationsQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
  type Message,
} from '@/redux/services/chatApi';
import { useGetMessagesQuery } from '@/redux/services/chatApi';
import { UPLOAD_PICKER_OPTIONS } from '@/lib/photoUpload';

/** A message in the shape the existing chat bubbles render. */
export interface ChatBubble {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  /** Absolute url for image/file messages; empty for plain text. */
  fileUrl: string;
  /** Original name of an attached document, shown on its bubble. */
  fileName: string;
  messageType: Message['messageType'];
}

const PAGE_SIZE = 50;

/**
 * One conversation: its header, its messages (oldest -> newest, the order the
 * list renders) and sending. Messages go over REST — `POST /chat/:id/messages`
 * also broadcasts on the socket, so the other side sees them live — and the
 * thread is polled while it is open instead of holding a socket connection.
 */
export const useConversation = (conversationId?: string) => {
  const t = useT();
  const me = useCurrentUser();
  const [inputText, setInputText] = useState('');
  // A photo upload can take a few seconds on mobile data; the screen shows a
  // spinner in place of the "+" meanwhile.
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading, refetch } = useGetMessagesQuery(
    { conversationId: conversationId as string, page: 1, limit: PAGE_SIZE },
    { skip: !conversationId, pollingInterval: 5000 },
  );

  // The header (avatar + name) comes from the conversation list, which is
  // already cached by the message tab the user arrived from.
  const { data: conversations } = useGetConversationsQuery(
    { page: 1, limit: 50 },
    { skip: !conversationId },
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markRead] = useMarkConversationReadMutation();

  // Opening the thread clears its unread badge, and so does every message that
  // arrives while it is open — otherwise the inbox would show it as unread on
  // the way back. Keyed on the newest message (the list is newest first).
  const newestMessageId = data?.data?.[0]?._id;
  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, newestMessageId, markRead]);

  // Fetched on its own, so the header works for any conversation — not only
  // ones within the first page of the inbox.
  const { data: single } = useGetConversationQuery(conversationId as string, {
    skip: !conversationId,
  });

  const header = useMemo(() => {
    const conversation =
      single ?? conversations?.data.find((c) => c._id === conversationId);
    const other = conversation?.otherParticipant;
    return {
      name: personName(other, 'Conversation'),
      image: avatarSource(other?.profileImage),
      otherParticipantId: other?._id ?? '',
    };
  }, [single, conversations, conversationId]);

  const messages = useMemo<ChatBubble[]>(() => {
    const rows = data?.data ?? [];
    // The backend returns newest first for pagination; the list reads oldest
    // first, so reverse a copy rather than mutating the cached array.
    return [...rows].reverse().map((message) => {
      const senderId =
        typeof message.sender === 'string' ? message.sender : message.sender?._id;
      return {
        id: message._id,
        text: message.isDeleted ? t('This message was deleted') : message.content ?? '',
        sender: senderId && me?._id && senderId === me._id ? 'me' : 'other',
        time: formatTime(message.createdAt),
        // A deleted photo must not keep showing its picture.
        fileUrl: message.isDeleted ? '' : resolveAssetUrl(message.fileUrl),
        fileName: message.fileName ?? '',
        messageType: message.isDeleted ? 'text' : message.messageType,
      };
    });
  }, [data, me, t]);

  const send = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !conversationId) return;
    setInputText('');
    try {
      await sendMessage({ conversationId, text }).unwrap();
    } catch {
      // Put the text back so nothing is silently lost.
      setInputText(text);
      throw new Error('send-failed');
    }
  }, [inputText, conversationId, sendMessage]);

  /** Attach a photo from the library and send it as one message. */
  const sendAttachment = useCallback(async () => {
    if (!conversationId || isUploading) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast(t("Photo permission is needed to add a picture."), 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        ...UPLOAD_PICKER_OPTIONS,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setIsUploading(true);
    try {
      await sendMessage({
        conversationId,
        file: {
          uri: asset.uri,
          name: asset.fileName ?? undefined,
          type: asset.mimeType ?? undefined,
        },
      }).unwrap();
    } catch (err) {
      // Before, a failed upload was silently dropped (unhandled rejection).
      showToast(getApiErrorMessage(err, t("The photo could not be sent.")), 'error');
    } finally {
      setIsUploading(false);
    }
  }, [conversationId, isUploading, sendMessage, t]);

  return {
    header,
    messages,
    isLoading,
    isSending,
    isUploading,
    inputText,
    setInputText,
    send,
    sendAttachment,
    refetch,
  };
};

/**
 * Opens (or reuses) the conversation with someone and returns its id — used by
 * the "Message" buttons on a cleaner's or host's profile.
 */
export { useStartConversationMutation } from '@/redux/services/chatApi';
