import { router } from 'expo-router';
import { OneSignal, type NotificationClickEvent, type PushSubscriptionChangedState } from 'react-native-onesignal';

/**
 * Push notifications run through OneSignal: the backend sends every push to
 * the OneSignal id the app registers at `POST /user/device-token`.
 *
 * The App ID is public (it ships in every app) and comes from the build
 * profile. Without it push is simply off, so a missing value never crashes.
 */
const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '';

/** OneSignal App IDs are UUIDs; a placeholder or empty value keeps push off. */
export const isPushConfigured = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    ONESIGNAL_APP_ID,
);

type PushData = Record<string, unknown>;
type Role = 'host' | 'cleaner';

let initialized = false;
/** A tap that arrived before the app knew who is signed in (cold start). */
let pendingTap: PushData | null = null;
let tapHandler: ((data: PushData) => void) | null = null;

/** Called once at startup, before any screen renders. */
export const initPush = () => {
    if (initialized || !isPushConfigured) return;
    initialized = true;

    OneSignal.initialize(ONESIGNAL_APP_ID);

    OneSignal.Notifications.addEventListener('click', (event: NotificationClickEvent) => {
        const data = (event.notification.additionalData ?? {}) as PushData;
        if (tapHandler) tapHandler(data);
        else pendingTap = data;
    });
};

/**
 * The signed-in app takes over tap handling. A tap that opened the app from
 * a closed state is replayed once the user and the first screen are ready.
 */
export const setPushTapHandler = (handler: ((data: PushData) => void) | null) => {
    tapHandler = handler;
    if (handler && pendingTap) {
        const data = pendingTap;
        pendingTap = null;
        handler(data);
    }
};

const str = (value: unknown): string | undefined =>
    typeof value === 'string' && value ? value : undefined;

/**
 * Opens the screen a push is about. The backend puts the ids it already uses
 * for in-app notifications in the push data: conversationId for messages,
 * scheduleId for cleanings and photo proofs, assignmentId for property
 * requests. Anything else lands on the role's home.
 */
export const openFromPush = (data: PushData, role: Role) => {
    const conversationId = str(data.conversationId) ?? str(data.chatId);
    const scheduleId = str(data.scheduleId);
    const assignmentId = str(data.assignmentId);

    if (conversationId) {
        router.push({
            pathname: `/${role}/message/chat`,
            params: { conversationId },
        } as never);
        return;
    }

    if (scheduleId) {
        router.push(
            (role === 'cleaner'
                ? { pathname: '/cleaner/task/details', params: { taskId: scheduleId } }
                : { pathname: '/host/home/task_status', params: { taskId: scheduleId, kind: 'schedule' } }) as never,
        );
        return;
    }

    if (assignmentId && role === 'cleaner') {
        router.navigate('/cleaner/(tabs)/request' as never);
        return;
    }

    router.navigate(`/${role}/(tabs)` as never);
};

/** Ties this device to the signed-in user and asks for permission once. */
export const startPushForUser = async (userId: string): Promise<string | null> => {
    if (!isPushConfigured) return null;
    OneSignal.login(userId);
    // iOS shows its prompt only the first time; later calls just resolve.
    await OneSignal.Notifications.requestPermission(false);
    return OneSignal.User.pushSubscription.getIdAsync();
};

/** Fires whenever OneSignal assigns or changes this device's subscription id. */
export const onPushIdChange = (listener: (id: string) => void) => {
    if (!isPushConfigured) return () => {};
    const handler = (event: PushSubscriptionChangedState) => {
        if (event.current.id) listener(event.current.id);
    };
    OneSignal.User.pushSubscription.addEventListener('change', handler);
    return () => OneSignal.User.pushSubscription.removeEventListener('change', handler);
};

/** Signed out: this device stops belonging to that user. */
export const stopPushForUser = () => {
    if (!isPushConfigured) return;
    OneSignal.logout();
};

/**
 * OneSignal would otherwise pick en/fr from the phone's language, but Gestlio
 * has its own language setting: send the one the user chose.
 */
export const setPushLanguage = (locale: string) => {
    if (!isPushConfigured) return;
    OneSignal.User.setLanguage(locale);
};
