import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, AuthUser, Role } from '@/types/authTypes';

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
  isAuthenticated: false,
  pendingEmail: null,
  pendingPassword: null,
  isBootstrapped: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token?: string | null; user?: AuthUser | null }>,
    ) => {
      // `token` is optional: complete-profile returns a fresh user on the token
      // we already hold, so the caller passes only `user` there.
      if (action.payload.token !== undefined && action.payload.token !== null) {
        state.token = action.payload.token;
      }
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
        state.role = action.payload.user?.role ?? state.role;
      }
      state.isAuthenticated = Boolean(state.token);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.role = action.payload.role ?? state.role;
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
      if (state.user) state.user.role = action.payload;
    },
    // Signup spans four screens; the email and password entered along the way
    // are kept here so the final step can re-signin for a role-bearing token.
    setPendingSignup: (
      state,
      action: PayloadAction<{ email?: string; password?: string }>,
    ) => {
      if (action.payload.email !== undefined) state.pendingEmail = action.payload.email;
      if (action.payload.password !== undefined) {
        state.pendingPassword = action.payload.password;
      }
    },
    clearPendingSignup: (state) => {
      state.pendingEmail = null;
      state.pendingPassword = null;
    },
    // Set once the persisted token has been read back (or found missing) so the
    // root layout knows it can stop showing the splash and route by role.
    setBootstrapped: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapped = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.pendingEmail = null;
      state.pendingPassword = null;
      // Bootstrapping already happened; signing out must not re-show the splash.
      state.isBootstrapped = true;
    },
  },
});

export const {
  setCredentials,
  setToken,
  setUser,
  setRole,
  setPendingSignup,
  clearPendingSignup,
  setBootstrapped,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
