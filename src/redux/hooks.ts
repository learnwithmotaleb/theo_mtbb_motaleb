import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** The whole auth slice — token, user, role, bootstrap flag. */
export const useAuth = () => useAppSelector((state) => state.auth);

/** The signed-in user's role, or null while onboarding / signed out. */
export const useRole = () => useAppSelector((state) => state.auth.role);

/** The signed-in user, or null. */
export const useCurrentUser = () => useAppSelector((state) => state.auth.user);
