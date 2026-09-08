// Shared API types mirroring the backend response contracts.
// Ported from the website's store so app and web speak the same shapes.

export type Role = 'admin' | 'host' | 'cleaner';

/** Every backend response is wrapped by sendResponse(). */
export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  token?: string;
  data: T;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

/** Subset of the sanitized user the backend returns (unset fields come as null). */
export interface User {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  role: Role | null;
  phone: string | null;
  profileImage: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  // Cleaner profile fields
  interventionZone?: string | null;
  workCity?: string | null;
  serviceRadius?: number | null;
  availability?: 'full_time' | 'part_time' | 'flexible' | null;
  biography?: string | null;
  languages?: string[];
  servicesOffered?: string[];
  cleaningsCompleted?: number;
  isProfessionalVerified?: boolean;
  stripeOnboardingComplete?: boolean;
  payoutsEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Accommodation {
  _id: string;
  name: string;
  accommodationType: string;
  address: string;
  city: string;
  zipCode: string;
  floor?: string;
  doorCode?: string;
  numberOfRooms: number;
  surface: number;
  hasElevator: boolean;
  cleaningRate: number;
  notes?: string;
  photos: string[];
  keys?: string;
  accessCode?: string;
  instructions?: string;
  frequency?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'scheduled' | 'not_scheduled';
  host: string | { _id: string; firstName?: string; lastName?: string };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Host-view annotations added by the listing endpoints.
  isCleanerAssigned?: boolean;
  cleanerStage?: 'new' | 'assigned' | 'accepted';
  assignedCleaners?: AssignedCleaner[];
  paymentStatus?: string | null;
  scheduleStatus?: string | null;
  [key: string]: unknown;
}

export interface AssignedCleaner {
  assignmentId: string;
  cleaner: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    profileImage?: string | null;
  } | null;
  role: 'primary' | 'substitute';
  status: 'pending' | 'accepted' | 'refused';
  pricePerCleaning?: number;
}

/** A cleaner's public profile (returned by the housekeeper discovery endpoints). */
export interface Housekeeper {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  profileImage?: string | null;
  interventionZone?: string;
  about?: string;
  biography?: string;
  languages?: string[];
  servicesOffered?: string[];
  cleaningsCompleted?: number;
  workCity?: string;
  serviceRadius?: number;
  availability?: 'full_time' | 'part_time' | 'flexible';
  [key: string]: unknown;
}

/** The host as a cleaner sees them (my-requests annotates these two fields). */
export interface HostSummary {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  profileImage?: string | null;
  phone?: string;
  totalProperties?: number;
  memberSince?: string | null;
  [key: string]: unknown;
}

export interface CleanerAssignment {
  _id: string;
  accommodation: string | Partial<Accommodation>;
  host: string | HostSummary;
  cleaner: string | Housekeeper;
  role: 'primary' | 'substitute';
  status: 'pending' | 'accepted' | 'refused';
  pricePerCleaning?: number;
  message?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleStatus =
  | 'scheduled'
  | 'accepted'
  | 'refused'
  | 'in_progress'
  | 'proof_submitted'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface CleaningSchedule {
  _id: string;
  accommodation: string | Partial<Accommodation>;
  host: string | HostSummary;
  cleaner: string | Housekeeper;
  assignment?: string | { _id: string; pricePerCleaning?: number; role?: string };
  date: string;
  checkInTime: string;
  checkOutTime: string;
  notes?: string;
  status: ScheduleStatus;
  paymentStatus: 'unpaid' | 'paid_held' | 'released' | 'refunded';
  proofPhotos?: string[];
  proofNotes?: string;
  dispute?: {
    reason?: string;
    notes?: string;
    photos: string[];
    raisedAt: string;
  } | null;
  completedAt?: string;
  cleanerResponse?: 'pending' | 'accepted' | 'refused';
  latestPayment?: {
    status: string;
    amount: number;
    currency: string;
    createdAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

/**
 * A schedule as the cleaner app sees it — the backend's `toMissionCard()`
 * decorates the raw schedule with day grouping keys (already resolved in the
 * viewer's timezone), the derived duration and the agreed pay.
 */
export interface MissionCard extends CleaningSchedule {
  /** "YYYY-MM-DD" in the viewer's timezone. */
  dayKey: string;
  /** Human day label the backend already localized ("Today", "12 Sept"...). */
  dayLabel: string;
  /** checkOutTime - checkInTime, in hours. */
  estimationHours: number;
  /** Agreed price for the cleaner, or the accommodation rate as fallback. */
  payAmount: number | null;
  payCurrency: string;
}

export interface CalendarConnection {
  _id: string;
  accommodation: string;
  host: string;
  platform: string;
  label?: string;
  icalUrl: string;
  lastSyncedAt?: string;
  lastSyncStatus?: 'success' | 'failed';
  lastSyncError?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
