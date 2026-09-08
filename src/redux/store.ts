import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api/baseApi';
import accommodationDraftReducer from './slices/accommodationDraftSlice';
import authReducer from './slices/authSlice';
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
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
