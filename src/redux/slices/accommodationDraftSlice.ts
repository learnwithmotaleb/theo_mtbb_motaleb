import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { hasFloorAndElevator, type AccommodationType } from '@/constants/accommodation';
import { POSTAL_CODE_PATTERN } from '@/lib/frenchGeo';

import type { PickedPhoto } from '../services/accommodationApi';

/**
 * The "add an accommodation" wizard spans five screens, so the answers live
 * here until the summary step posts them. Field names match
 * `createAccommodationSchema` on the backend, so the draft can be turned into
 * the multipart body without renaming anything.
 */
export interface AccommodationDraft {
  // Step 1 — general information
  name: string;
  /** '' until the host picks one — nothing is pre-selected. */
  accommodationType: AccommodationType | '';
  address: string;
  city: string;
  zipCode: string;
  /** Postal codes of the commune picked from the suggestions, if any. */
  cityPostalCodes: string[];

  // Step 2 — accommodation details
  numberOfRooms: string;
  surface: string;
  floor: string;
  /** null until answered; only asked for apartments and studios. */
  hasElevator: boolean | null;
  cleaningRate: string;
  notes: string;

  // Step 3 — photos
  photos: PickedPhoto[];

  // Step 4 — practical information
  keys: string;
  accessCode: string;
  instructions: string;
  frequency: string;
  /** "HH:mm" — required by the backend and used for cleaning recommendations. */
  checkInTime: string;
  checkOutTime: string;

  /** Set when the wizard is editing an existing accommodation instead. */
  editingId: string | null;
}

// Nothing is pre-filled: every answer is the host's own. Defaults here used to
// leak into the form (3 rooms, an elevator, 10:00 → 14:00...) and were
// mistaken for real values.
const initialState: AccommodationDraft = {
  name: '',
  accommodationType: '',
  address: '',
  city: '',
  zipCode: '',
  cityPostalCodes: [],

  numberOfRooms: '',
  surface: '',
  floor: '',
  hasElevator: null,
  cleaningRate: '',
  notes: '',

  photos: [],

  keys: '',
  accessCode: '',
  instructions: '',
  frequency: '',
  checkInTime: '',
  checkOutTime: '',

  editingId: null,
};

const accommodationDraftSlice = createSlice({
  name: 'accommodationDraft',
  initialState,
  reducers: {
    // Each wizard step merges only the fields it owns.
    updateDraft: (state, action: PayloadAction<Partial<AccommodationDraft>>) =>
      ({ ...state, ...action.payload }),
    setDraftPhotos: (state, action: PayloadAction<PickedPhoto[]>) => {
      state.photos = action.payload;
    },
    /** Seed the wizard from an existing accommodation for the edit flow. */
    loadDraft: (
      _state,
      action: PayloadAction<Partial<AccommodationDraft> & { editingId: string }>,
    ) => ({ ...initialState, ...action.payload }),
    resetDraft: () => initialState,
  },
});

export const { updateDraft, setDraftPhotos, loadDraft, resetDraft } =
  accommodationDraftSlice.actions;

export default accommodationDraftSlice.reducer;

/**
 * Draft -> the multipart body `POST /accommodation` and `PATCH
 * /accommodation/:id` expect. Numbers and booleans go out as strings; the
 * backend coerces them (see the zod preprocessors).
 */
export const draftToFields = (draft: AccommodationDraft) => {
  // A house has no floor or elevator; never send stale answers for one.
  const inBuilding = hasFloorAndElevator(draft.accommodationType);
  return {
  name: draft.name.trim(),
  accommodationType: draft.accommodationType,
  address: draft.address.trim(),
  city: draft.city.trim(),
  zipCode: draft.zipCode.trim(),
  numberOfRooms: draft.numberOfRooms,
  surface: draft.surface,
  floor: inBuilding ? draft.floor.trim() : '',
  hasElevator: inBuilding ? Boolean(draft.hasElevator) : false,
  cleaningRate: draft.cleaningRate,
  notes: draft.notes.trim(),
  keys: draft.keys,
  accessCode: draft.accessCode.trim(),
  instructions: draft.instructions.trim(),
  frequency: draft.frequency,
  checkInTime: draft.checkInTime,
  checkOutTime: draft.checkOutTime,
  };
};

/**
 * What the backend requires before an accommodation can be posted. Shared by
 * the property wizard and the host onboarding, which asks fewer questions, so
 * step-specific answers (keys, elevator) are checked on their own steps.
 * Returns the English message; screens pass it through `t()`.
 */
export const validateDraft = (draft: AccommodationDraft): string | null => {
  if (draft.name.trim().length < 2) return 'Enter an accommodation name.';
  if (!draft.accommodationType) return 'Choose the type of accommodation.';
  if (draft.address.trim().length < 5) return 'Enter a full address.';
  if (!draft.city.trim()) return 'Enter a city.';
  if (!POSTAL_CODE_PATTERN.test(draft.zipCode.trim())) return 'Enter a valid 5-digit postal code.';
  if (!Number(draft.numberOfRooms)) return 'Choose the number of rooms.';
  if (!(Number(draft.surface) > 0)) return 'Enter the surface area.';
  if (draft.cleaningRate === '' || !(Number(draft.cleaningRate) >= 0)) {
    return 'Enter a cleaning rate.';
  }
  if (!draft.checkInTime || !draft.checkOutTime) {
    return 'Choose the check-in and check-out times.';
  }
  return null;
};
