import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { clearAuth } from './authSlice';
import { uploadFile } from '@/lib/photoUpload';

/**
 * The cleaner onboarding wizard spans five screens, so the answers live here
 * until the last step submits them. Field names match `updateProfileSchema`
 * on the backend, so the draft becomes the multipart body without renaming.
 */
export interface CleanerOnboardingDraft {
  /** Step 2 — professional status. 14 digits, validated by the backend too. */
  siretNumber: string;
  /** Step 3 — work location. */
  workCity: string;
  serviceRadius: number;
  /** Step 5 — profile. */
  biography: string;
  availability: 'full_time' | 'part_time' | 'flexible';
  /** Local uri of the picked avatar; uploaded as `profileImage`. */
  avatarUri: string | null;
  avatarName: string | null;
  avatarType: string | null;
}

const initialState: CleanerOnboardingDraft = {
  siretNumber: '',
  workCity: '',
  serviceRadius: 15,
  biography: '',
  availability: 'full_time',
  avatarUri: null,
  avatarName: null,
  avatarType: null,
};

const cleanerOnboardingSlice = createSlice({
  name: 'cleanerOnboarding',
  initialState,
  reducers: {
    updateOnboarding: (
      state,
      action: PayloadAction<Partial<CleanerOnboardingDraft>>,
    ) => {
      Object.assign(state, action.payload);
    },
    resetOnboarding: () => initialState,
  },
  // A draft never carries over to the next account on this phone.
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => initialState);
  },
});

export const { updateOnboarding, resetOnboarding } = cleanerOnboardingSlice.actions;
export default cleanerOnboardingSlice.reducer;

/**
 * The whole wizard as one `PATCH /auth/update-me` body. The avatar is only
 * appended when the cleaner actually picked one, so re-submitting without a
 * photo never clears the existing picture.
 */
export const onboardingToForm = (draft: CleanerOnboardingDraft): FormData => {
  const form = new FormData();
  if (draft.siretNumber) form.append('siretNumber', draft.siretNumber);
  if (draft.workCity) {
    form.append('workCity', draft.workCity);
    // Hosts search cleaners by intervention zone, so the work city seeds it.
    form.append('interventionZone', draft.workCity);
  }
  form.append('serviceRadius', String(draft.serviceRadius));
  form.append('availability', draft.availability);
  if (draft.biography) form.append('biography', draft.biography);

  if (draft.avatarUri) {
    form.append('profileImage', uploadFile(draft.avatarUri, draft.avatarName, draft.avatarType, 'avatar'));
  }

  return form;
};
