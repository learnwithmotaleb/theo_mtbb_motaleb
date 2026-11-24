import { useEffect } from 'react';
import { AppState } from 'react-native';
import { io, Socket } from 'socket.io-client';

import { API_ORIGIN } from '@/lib/config';
import { baseApi, deleteToken } from '@/redux/api/baseApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAuth } from '@/redux/slices/authSlice';

/** The bits of a `notification:new` payload this hook reads. */
interface LiveNotification {
    type?: string;
    data?: { scheduleId?: string; assignmentId?: string; status?: string } | null;
}

/**
 * Keeps the status badges live, for cleaners and hosts. The server pushes
 * `notification:new` for every host-side change to a cleaning (new / updated /
 * reassigned / cancelled schedule, validation, rejected proof, hand-cash);
 * any one carrying `data.scheduleId` refetches home, planning and that
 * schedule. Most share type `schedule_created`, so the type is not used.
 *
 * Contract (backend):
 *  - same origin as the REST API, without /api/v1, default path /socket.io
 *  - token in `auth.token`, checked only on connect
 *  - a rejected connect fires `connect_error` "Unauthorized – …" and does not
 *    auto-reconnect -> the session is over, sign out
 *  - Render can sleep / restart and drop the socket, so every (re)connect
 *    refetches, to catch anything missed while offline
 */
export const useScheduleLiveUpdates = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((s) => s.auth.token);
    const role = useAppSelector((s) => s.auth.role);

    useEffect(() => {
        if (!token || (role !== 'cleaner' && role !== 'host')) return;

        // Hosts track requests, payments and connection requests the cleaner
        // answers from their own phone; cleaners track their missions.
        const roleTags =
            role === 'host'
                ? (['HostDashboard', 'Assignment', 'Accommodation', 'Payment', 'Calendar'] as const)
                : (['CleanerHome'] as const);

        const refreshLists = (scheduleId?: string) => {
            dispatch(
                baseApi.util.invalidateTags([
                    ...roleTags,
                    'Schedule',
                    'Notification',
                    ...(scheduleId ? [{ type: 'Schedule' as const, id: scheduleId }] : []),
                ]),
            );
        };

        const socket: Socket = io(API_ORIGIN, {
            auth: { token },
            transports: ['websocket'],
        });

        socket.on('connect', () => refreshLists());

        socket.on('notification:new', (notification: LiveNotification) => {
            const data = notification?.data;
            if (data?.status === 'accommodation_deleted') {
                // The host deleted a property: the cleaner's cleanings for it
                // are cancelled and the assignment closed, in one go.
                dispatch(
                    baseApi.util.invalidateTags([
                        ...roleTags,
                        'Schedule',
                        'Assignment',
                        'CleanerRequest',
                        'Notification',
                    ]),
                );
                return;
            }
            if (data?.scheduleId || data?.assignmentId) refreshLists(data?.scheduleId);
        });

        // Bell badge count.
        socket.on('notification:unreadCount', () => {
            dispatch(baseApi.util.invalidateTags(['Notification']));
        });

        socket.on('connect_error', (err: Error) => {
            // Network trouble retries on its own (socket.active stays true).
            // A rejected token does not: the session is no longer valid.
            if (!socket.active && /unauthori[sz]ed/i.test(err?.message ?? '')) {
                deleteToken().finally(() => dispatch(clearAuth()));
            }
        });

        // Phones suspend the socket in the background; reconnect on return.
        const appStateSub = AppState.addEventListener('change', (state) => {
            if (state === 'active' && !socket.connected) socket.connect();
        });

        return () => {
            appStateSub.remove();
            socket.removeAllListeners();
            socket.disconnect();
        };
        // A new token (re-login) builds a fresh socket with the new auth.
    }, [token, role, dispatch]);
};
