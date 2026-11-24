import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { AppState } from 'react-native';

import { baseApi } from './api/baseApi';
import accommodationDraftReducer from './slices/accommodationDraftSlice';
import authReducer, { clearAuth, setCredentials } from './slices/authSlice';
import cleanerOnboardingReducer from './slices/cleanerOnboardingSlice';
import localeReducer from './slices/localeSlice';

// Register the endpoint modules so their injected endpoints attach to baseApi
// even when a screen imports only the hook it needs.
import './services/authApi';
import './services/accommodationApi';
import './services/assignmentApi';
import './services/scheduleApi';
import './services/calendarApi';
import './services/chatApi';
import './services/notificationApi';
import './services/paymentApi';
import './services/miscApi';

/**
 * Account isolation. RTK Query caches every response by endpoint + arguments,
 * not by user, so without this a new account opened lists (conversations,
 * properties...) straight from the previous account's cache until a refetch
 * replaced them. Every cached response is dropped:
 *  - on sign-out / expired session (clearAuth),
 *  - when the signed-in user changes without a sign-out in between.
 * Requests still in flight for the old account are discarded too: RTK only
 * writes a result into a cache entry that still exists.
 */
const sessionListener = createListenerMiddleware();

sessionListener.startListening({
  actionCreator: clearAuth,
  effect: (_action, api) => {
    api.dispatch(baseApi.util.resetApiState());
  },
});

sessionListener.startListening({
  actionCreator: setCredentials,
  effect: (action, api) => {
    const previous = (api.getOriginalState() as { auth: { user: { _id?: string } | null } })
      .auth.user?._id;
    const next = action.payload.user?._id;
    if (previous && next && previous !== next) {
      api.dispatch(baseApi.util.resetApiState());
    }
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accommodationDraft: accommodationDraftReducer,
    cleanerOnboarding: cleanerOnboardingReducer,
    locale: localeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Multipart bodies carry RN file descriptors ({ uri, name, type }) and
      // FormData, which the default serializability check flags on every
      // upload. The check is dev-only overhead here, so it is scoped out.
      serializableCheck: {
        ignoredActions: ['api/executeMutation/pending'],
        ignoredPaths: ['api.mutations'],
      },
      // The wizard holds picked-photo descriptors, which are plain objects but
      // large enough that deep-checking every keystroke costs more than it
      // catches.
      immutableCheck: { ignoredPaths: ['accommodationDraft.photos'] },
    })
      .prepend(sessionListener.middleware)
      .concat(baseApi.middleware),
});

// RTK Query's focus listeners are browser-only; on a phone, "focus" is the app
// returning to the foreground. Queries opted into `refetchOnFocus` (request
// badges, lists another device changes) refresh then.
setupListeners(store.dispatch, (dispatch, { onFocus, onFocusLost }) => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') dispatch(onFocus());
    else dispatch(onFocusLost());
  });
  return () => subscription.remove();
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
