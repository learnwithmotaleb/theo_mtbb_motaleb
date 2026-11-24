import { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { getToken } from '@/redux/api/baseApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useLazyGetMeQuery, useLogoutMutation } from '@/redux/services/authApi';
import { setBootstrapped, setToken } from '@/redux/slices/authSlice';
import type { User } from '@/redux/types';

/** Where a signed-in user belongs, by role. Admin is dashboard-only. */
export const homeRouteForRole = (role?: string | null): string => {
  if (role === 'cleaner') return '/cleaner/(tabs)';
  if (role === 'host') return '/host/(tabs)';
  // No role yet (verify-otp token) — the signup flow still owes us a role.
  return '/(auth)/role_select';
};

/**
 * A cleaner whose onboarding never got saved (e.g. the last step failed) must
 * finish it before reaching home, or their profile stays empty for good.
 * Trusts the backend's `isOnboardingComplete` when true; otherwise checks the
 * required fields directly, so an older backend that always reports `false`
 * cannot trap a fully set-up cleaner in onboarding. Unknown user -> no.
 */
export const cleanerNeedsOnboarding = (user?: User | null): boolean => {
  if (!user || user.role !== 'cleaner') return false;
  if (user.isOnboardingComplete === true) return false;
  return !user.siretNumber || !user.workCity;
};

/**
 * Reads the persisted token back out of the keychain on cold start and
 * refetches the profile, so a returning user lands straight on their home
 * screen. The user object itself is never persisted — SecureStore values are
 * size-capped on Android and a stale profile is worse than one extra request.
 *
 * Resolves `isBootstrapped` either way, so the splash always ends.
 */
export const useSessionBootstrap = () => {
  const dispatch = useAppDispatch();
  const { isBootstrapped, token, user, role } = useAppSelector((s) => s.auth);
  const [fetchMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (isBootstrapped) return;

    let cancelled = false;

    (async () => {
      const stored = await getToken();
      if (cancelled) return;

      if (!stored) {
        dispatch(setBootstrapped(true));
        return;
      }

      // Put the token in place first so the /auth/me request is authorized.
      dispatch(setToken(stored));
      try {
        // getMe writes the user into the slice via its onQueryStarted.
        await fetchMe().unwrap();
      } catch {
        // A 401 already cleared the session in baseApi; anything else (offline)
        // keeps the token so the user can retry without signing in again.
      } finally {
        if (!cancelled) dispatch(setBootstrapped(true));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isBootstrapped, dispatch, fetchMe]);

  return {
    isBootstrapped,
    isAuthenticated: Boolean(token),
    user,
    role,
    homeRoute: homeRouteForRole(role),
  };
};

/**
 * End of a signup / onboarding flow: drop the wizard screens from the stack,
 * then replace with the role's home (or a specific tab under it). Every flow
 * ends here, so the back gesture can never walk back into onboarding.
 */
export const useGoToRoleHome = () => {
  const router = useRouter();
  const role = useAppSelector((s) => s.auth.role);

  return useCallback(
    (path?: string) => {
      if (router.canDismiss()) router.dismissAll();
      router.replace((path ?? homeRouteForRole(role)) as never);
    },
    [router, role],
  );
};

/** Sign out: clears the keychain, the store and the RTK Query cache. */
export const useSignOut = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  return useCallback(async () => {
    await logout().unwrap();
    router.replace('/(auth)/login' as never);
  }, [logout, router]);
};
