import { onPushIdChange, openFromPush, setPushLanguage, setPushTapHandler, startPushForUser } from '@/lib/push';
import { useAppSelector } from '@/redux/hooks';
import { useRegisterDeviceTokenMutation } from '@/redux/services/miscApi';
import { useEffect, useRef } from 'react';

/**
 * Registers this phone for push once someone is signed in, and opens the
 * right screen when a notification is tapped. `ready` is false until the root
 * layout has shown the first screen, so a tap that launched the app is not
 * overwritten by the initial redirect.
 */
export const usePushNotifications = (ready: boolean) => {
    const token = useAppSelector((s) => s.auth.token);
    const userId = useAppSelector((s) => s.auth.user?._id as string | undefined);
    const role = useAppSelector((s) => s.auth.role);
    const locale = useAppSelector((s) => s.locale.locale);
    const [registerDeviceToken] = useRegisterDeviceTokenMutation();
    const lastSent = useRef<string | null>(null);

    // Register (and re-register whenever OneSignal rotates the id).
    useEffect(() => {
        if (!token || !userId) {
            lastSent.current = null;
            return;
        }
        let cancelled = false;
        const send = (playerId: string | null) => {
            if (cancelled || !playerId || playerId === lastSent.current) return;
            lastSent.current = playerId;
            registerDeviceToken({ playerId })
                .unwrap()
                .catch(() => {
                    // Try again on the next change or launch.
                    lastSent.current = null;
                });
        };
        startPushForUser(userId).then(send).catch(() => {});
        const unsubscribe = onPushIdChange(send);
        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, [token, userId, registerDeviceToken]);

    // Push text follows the language chosen in the app, not the phone's.
    useEffect(() => {
        if (token && userId) setPushLanguage(locale);
    }, [token, userId, locale]);

    // Taps open the related screen once a signed-in role is on screen.
    useEffect(() => {
        if (!ready || !token || (role !== 'host' && role !== 'cleaner')) {
            setPushTapHandler(null);
            return;
        }
        setPushTapHandler((data) => openFromPush(data, role));
        return () => setPushTapHandler(null);
    }, [ready, token, role]);
};
