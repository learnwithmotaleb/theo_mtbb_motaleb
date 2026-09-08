import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  accommodationType: 'House' | 'Apartment' | 'Studio' | 'Other';
  address: string;
  city: string;
  zipCode: string;

  // Step 2 — accommodation details
  numberOfRooms: string;
  surface: string;
  floor: string;
  hasElevator: boolean;
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

const initialState: AccommodationDraft = {
  name: '',
  accommodationType: 'Apartment',
  address: '',
  city: '',
  zipCode: '',

  numberOfRooms: '3',
  surface: '',
  floor: '',
  hasElevator: true,
  cleaningRate: '',
  notes: '',

  photos: [],

  keys: 'Key box at the entrance',
  accessCode: '',
  instructions: '',
  frequency: 'Every week',
  checkInTime: '14:00',
  checkOutTime: '10:00',

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
export const draftToFields = (draft: AccommodationDraft) => ({
  name: draft.name.trim(),
  accommodationType: draft.accommodationType,
  address: draft.address.trim(),
  city: draft.city.trim(),
  zipCode: draft.zipCode.trim(),
  numberOfRooms: draft.numberOfRooms,
  surface: draft.surface,
  floor: draft.floor.trim(),
  hasElevator: draft.hasElevator,
  cleaningRate: draft.cleaningRate,
  notes: draft.notes.trim(),
  keys: draft.keys,
  accessCode: draft.accessCode.trim(),
  instructions: draft.instructions.trim(),
  frequency: draft.frequency,
  checkInTime: draft.checkInTime,
  checkOutTime: draft.checkOutTime,
});

/** The fields the backend refuses to create an accommodation without. */
export const validateDraft = (draft: AccommodationDraft): string | null => {
  if (draft.name.trim().length < 2) return 'Enter an accommodation name.';
  if (draft.address.trim().length < 5) return 'Enter a full address.';
  if (!draft.city.trim()) return 'Enter a city.';
  if (!draft.zipCode.trim()) return 'Enter a zip code.';
  if (!Number(draft.numberOfRooms)) return 'Enter the number of rooms.';
  if (!Number(draft.surface)) return 'Enter the surface area.';
  if (draft.cleaningRate === '' || Number.isNaN(Number(draft.cleaningRate))) {
    return 'Enter a cleaning rate.';
  }
  if (!draft.checkInTime || !draft.checkOutTime) {
    return 'Enter the check-in and check-out times.';
  }
  return null;
};
