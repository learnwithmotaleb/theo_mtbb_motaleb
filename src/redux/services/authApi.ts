import { baseApi, deleteToken, saveToken } from '../api/baseApi';
import { clearAuth, setCredentials, setPendingSignup } from '../slices/authSlice';
import type { ApiEnvelope, User } from '../types';

/**
 * Auth mutations return the backend envelope untouched (not the inner `data`)
 * because every screen shows `res.message` in a toast, and verify-otp / signin
 * carry the token at the envelope's top level. The data modules unwrap instead.
 *
 * Signup order (backend contract, see auth.routes.ts):
 *   signup(email) -> verify-otp(email, 4-digit otp) -> complete-profile -> select-role
 * `select-role` does NOT re-issue a token, and the verify-otp token carries no
 * role, so role-protected routes reject it. The final signup step must call
 * `signin` again with the captured password to get a role-bearing token.
 */

export interface AuthEnvelope extends ApiEnvelope<User> {
  token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Sign up ───────────────────────────────────────────────────────────────
    signup: builder.mutation<ApiEnvelope<null>, { email: string }>({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
      async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setPendingSignup({ email }));
        } catch {
          /* the screen surfaces the error */
        }
      },
    }),

    resendOtp: builder.mutation<ApiEnvelope<null>, { email: string }>({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body }),
    }),

    // OTP is 4 digits. Returns a roleless onboarding token.
    verifyOtp: builder.mutation<AuthEnvelope, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body }),
      async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        await saveToken(data.token);
        dispatch(setCredentials({ token: data.token, user: data.data }));
        dispatch(setPendingSignup({ email }));
      },
    }),

    // Runs on the onboarding token. The password is stashed so the final step
    // can re-signin for a role-bearing token.
    completeProfile: builder.mutation<
      ApiEnvelope<User>,
      { firstName: string; lastName: string; password: string }
    >({
      query: (body) => ({ url: '/auth/complete-profile', method: 'POST', body }),
      async onQueryStarted({ password }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.data }));
        dispatch(setPendingSignup({ password }));
      },
      invalidatesTags: ['Auth', 'Me'],
    }),

    selectRole: builder.mutation<ApiEnvelope<User>, { role: 'host' | 'cleaner' }>({
      query: (body) => ({ url: '/auth/select-role', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.data }));
      },
      invalidatesTags: ['Auth', 'Me'],
    }),

    // ── Sign in ───────────────────────────────────────────────────────────────
    signin: builder.mutation<AuthEnvelope, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/signin', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        await saveToken(data.token);
        dispatch(setCredentials({ token: data.token, user: data.data }));
      },
      invalidatesTags: ['Auth', 'Me'],
    }),

    logout: builder.mutation<void, void>({
      // The backend has no logout route — the token is stateless. Clearing the
      // keychain and the store is the whole operation.
      queryFn: async (_arg, api) => {
        await deleteToken();
        api.dispatch(clearAuth());
        return { data: undefined };
      },
      invalidatesTags: ['Auth', 'Me'],
    }),

    // ── Forgot / reset password ───────────────────────────────────────────────
    forgotPassword: builder.mutation<ApiEnvelope<null>, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
      async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setPendingSignup({ email }));
        } catch {
          /* handled by the screen */
        }
      },
    }),

    verifyResetOtp: builder.mutation<
      ApiEnvelope<{ resetToken: string }>,
      { email: string; otp: string }
    >({
      query: (body) => ({ url: '/auth/verify-reset-otp', method: 'POST', body }),
    }),

    resetPassword: builder.mutation<
      ApiEnvelope<null>,
      { email: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    changePassword: builder.mutation<
      ApiEnvelope<null>,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),

    // ── Profile ───────────────────────────────────────────────────────────────
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (res: ApiEnvelope<User>) => res.data,
      providesTags: ['Me', 'Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch {
          /* a 401 is already handled globally in baseApi */
        }
      },
    }),

    /**
     * PATCH /auth/update-me — multipart. Pass a FormData and append the avatar
     * as `profileImage`. Cleaner onboarding fields (siretNumber, workCity,
     * serviceRadius, availability, languages, servicesOffered, biography, ...)
     * all go through this same endpoint.
     */
    updateMe: builder.mutation<User, FormData>({
      query: (body) => ({ url: '/auth/update-me', method: 'PATCH', body }),
      transformResponse: (res: ApiEnvelope<User>) => res.data,
      invalidatesTags: ['Me', 'Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch {
          /* handled by the screen */
        }
      },
    }),

    deleteMyAccount: builder.mutation<ApiEnvelope<null>, { password: string }>({
      query: (body) => ({ url: '/auth/delete-me', method: 'DELETE', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        await deleteToken();
        dispatch(clearAuth());
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignupMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useCompleteProfileMutation,
  useSelectRoleMutation,
  useSigninMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useDeleteMyAccountMutation,
} = authApi;

// ── Back-compat aliases for screens written against the older names ──────────
export const useLoginMutation = useSigninMutation;
export const useGetProfileQuery = useGetMeQuery;
export const useVerifyForgotPasswordOtpMutation = useVerifyResetOtpMutation;
