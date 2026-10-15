// Adapters from the backend's payloads to the shapes the existing screen
// components already render. Keeping the mapping in one place means the UI
// files change as little as possible when an endpoint's payload shifts.

import { IMAGE_COMPONENTS } from '@/constants/image.index';
import type { RecommendedSchedule, Task, TaskStatus } from '@/types/hostTypes';
import type { Cleaner, CleanerTask, HousingItem } from '@/types/taskStatus';
import type { CalendarEvent, ListEvent } from '@/types/planningTypes';
import type {
  Accommodation as ApiAccommodation,
  CleanerAssignment,
  Housekeeper,
  MissionCard,
} from '@/redux/types';

import { resolveAssetUrl } from './config';
import {
  formatCleaningWindow,
  formatDayKey,
  formatDate,
  formatTime,
  parseDate,
  relativeFromNow,
  toDateKey,
} from './datetime';
import { formatMoney } from './pricing';
import { t } from '@/i18n';
import { keysText, roomsText } from '@/constants/accommodation';

/**
 * expo-image `source`. Backend photos are relative paths; anything missing
 * falls back to the bundled placeholder so a card never renders a blank box.
 */
export const imageSource = (path?: string | null, fallback: any = IMAGE_COMPONENTS.apartment) => {
  const url = resolveAssetUrl(path);
  return url ? { uri: url } : fallback;
};

// No stock photo here: an unset avatar should render AppImage's neutral grey
// placeholder rather than a picture of a stranger.
export const avatarSource = (
  path?: string | null,
  fallback: any = null,
) => imageSource(path, fallback);

export const hostAvatarSource = (person?: any) => {
  const path =
    person?.profileImage ??
    person?.avatar ??
    person?.photo ??
    person?.image ??
    person?.profilePicture ??
    person?.user?.profileImage;
  return imageSource(path, null);
};

export const cleanerAvatarSource = (person?: any) => {
  const path =
    person?.profileImage ??
    person?.avatar ??
    person?.photo ??
    person?.image ??
    person?.profilePicture ??
    person?.user?.profileImage;
  return imageSource(path, null);
};

/** The backend sends firstName/lastName, or a pre-joined `name`. */
export const personName = (
  person?: { firstName?: string | null; lastName?: string | null; name?: string | null } | null,
  fallback = 'Unassigned',
): string => {
  if (!person) return fallback;
  const joined = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
  return joined || person.name || fallback;
};

/** First photo of an accommodation, whatever shape it arrived in. */
export const accommodationPhoto = (accommodation?: any) =>
  imageSource(accommodation?.photos?.[0]);

/** "12 Rue de Charenton, Paris" — address plus city, skipping blanks. */
export const accommodationLocation = (accommodation?: any): string =>
  [accommodation?.address, accommodation?.city].filter(Boolean).join(', ');

// ─── Host home: recommended schedule ─────────────────────────────────────────

/** One entry of `GET /accommodation/dashboard -> recommended_schedule`. */
export interface ApiRecommendation {
  accommodation: {
    _id: string;
    name: string;
    address?: string;
    city?: string;
    photos?: string[];
    accommodationType?: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
  };
  cleaner: { _id: string; firstName?: string; lastName?: string; profileImage?: string } | null;
  recommendedDate: string;
  freeFrom: string;
  freeUntil: string | null;
  checkOutTime: string | null;
  checkInTime: string | null;
  booking?: { _id: string; summary?: string; platform?: string };
}

export const toRecommendedSchedule = (rec: ApiRecommendation): RecommendedSchedule => {
  // The card shows the free window: cleaning starts at the guest's check-out
  // and must finish before the next guest checks in.
  const slot = formatCleaningWindow(rec.checkOutTime, rec.checkInTime);

  return {
    id: rec.accommodation._id,
    apartmentName: rec.accommodation.name,
    idealDate: formatDate(rec.recommendedDate, { day: 'numeric', month: 'long' }),
    timeSlot: slot || t('Flexible'),
    cleanerName: personName(rec.cleaner, t('No cleaner')),
    cleanerImage: avatarSource(rec.cleaner?.profileImage),
    apartmentImage: accommodationPhoto(rec.accommodation),
  };
};

// ─── Host home: to-do activity feed ──────────────────────────────────────────

/** One entry of `GET /accommodation/dashboard -> to_do.data`. */
export interface ApiTodoEvent {
  kind: 'schedule' | 'assignment';
  scheduleId?: string;
  assignmentId?: string;
  status: string;
  label: string;
  timestamp: string;
  accommodation: any;
  cleaner: any;
}

/** Backend lifecycle status -> the four to-do card variants the app renders. */
const todoStatus = (event: ApiTodoEvent): TaskStatus => {
  if (event.kind === 'assignment') {
    return event.status === 'refused' ? 'refused' : 'pending_accept';
  }
  switch (event.status) {
    case 'refused':
      return 'refused';
    case 'completed':
      return 'completed';
    case 'disputed':
      return 'report_problem';
    default:
      // accepted / in_progress / proof_submitted
      return 'scheduled';
  }
};

/**
 * The backend sends its card labels in English ("Cleaner accepted your
 * request"), so the label is rebuilt from the event's kind and status in the
 * app's language. An unknown combination falls back to the backend text, run
 * through the catalog in case it has a translation.
 */
const TODO_LABELS: Record<string, string> = {
  'assignment:pending': 'Demande en attente',
  'assignment:accepted': 'Demande acceptée',
  'assignment:refused': 'Demande refusée',
  'schedule:scheduled': 'Ménage planifié – En attente de validation',
  'schedule:pending': 'Ménage planifié – En attente de validation',
  'schedule:accepted': 'Ménage validé',
  'schedule:refused': 'Ménage refusé',
  'schedule:in_progress': 'Ménage en cours',
  'schedule:proof_submitted': 'Preuve de ménage à valider',
  'schedule:completed': 'Preuve de ménage à valider',
  'schedule:disputed': 'Problème signalé',
  'schedule:cancelled': 'Ménage annulé',
};

export const todoLabel = (event: Pick<ApiTodoEvent, 'kind' | 'status' | 'label'>): string => {
  const key = TODO_LABELS[`${event.kind}:${event.status}`];
  if (key) return t(key);
  if (event.label) {
    if (/refused/i.test(event.label) || /declined/i.test(event.label)) {
      return event.kind === 'schedule' ? t('Ménage refusé') : t('Demande refusée');
    }
    if (/accepted/i.test(event.label) || /valid/i.test(event.label)) {
      return event.kind === 'schedule' ? t('Ménage validé') : t('Demande acceptée');
    }
    if (/proof|validate|preuve/i.test(event.label)) {
      return t('Preuve de ménage à valider');
    }
    if (/schedule|planifi/i.test(event.label)) {
      return t('Ménage planifié – En attente de validation');
    }
    if (/pending|attente/i.test(event.label)) {
      return event.kind === 'schedule' ? t('Ménage planifié – En attente de validation') : t('Demande en attente');
    }
    return t(event.label);
  }
  return '';
};

export const toTodoTask = (event: ApiTodoEvent): Task => ({
  // The id is the underlying record's id, so the detail screen can refetch it.
  id: event.scheduleId ?? event.assignmentId ?? `${event.kind}-${event.timestamp}`,
  recordId: event.scheduleId ?? event.assignmentId ?? undefined,
  kind: event.kind,
  status: todoStatus(event),
  statusLabel: todoLabel(event),
  apartmentName: event.accommodation?.name ?? t('Accommodation'),
  timeAgo: relativeFromNow(event.timestamp),
  cleanerName: personName(event.cleaner),
  cleanerImage: avatarSource(event.cleaner?.profileImage),
  apartmentImage: accommodationPhoto(event.accommodation),
  address: accommodationLocation(event.accommodation),
  date: formatDate(event.timestamp, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  // Times and prices live on the schedule itself — the detail screen fetches
  // them; the card does not show them.
  checkOut: '',
  checkIn: '',
  price: 0,
  serviceFee: 0,
});

/** The kind the "dismiss" endpoint needs (`DELETE /accommodation/todo/:kind/:id`). */
export const todoKindOf = (event: ApiTodoEvent) => event.kind;

// ─── Housing list ────────────────────────────────────────────────────────────

export const toHousingItem = (accommodation: ApiAccommodation): HousingItem => ({
  id: accommodation._id,
  name: accommodation.name,
  location: accommodation.city || accommodation.address || '',
  image: accommodationPhoto(accommodation),
  // A refused invitation is history, not a cleaner of this property.
  cleaners: (accommodation.assignedCleaners ?? [])
    .filter((entry) => entry.cleaner && entry.status !== 'refused')
    .map<Cleaner>((entry) => ({
      id: entry.cleaner!._id,
      name: personName(entry.cleaner),
      image: avatarSource(entry.cleaner!.profileImage),
      status: entry.status,
    })),
});

// ─── Housekeeper (cleaner discovery) ─────────────────────────────────────────

export const toUiHousekeeper = (cleaner: Housekeeper) => ({
  id: cleaner._id,
  name: personName(cleaner, t('Housekeeper')),
  role: t('Housekeeper'),
  location: cleaner.interventionZone || cleaner.workCity || '',
  interventionZone: cleaner.interventionZone || cleaner.workCity || '',
  appExperience: t('{n} cleanings completed', { n: cleaner.cleaningsCompleted ?? 0 }),
  memberSince: cleaner.createdAt ? formatDate(cleaner.createdAt as string, {
    month: 'long',
    year: 'numeric',
  }) : '',
  about: cleaner.about || cleaner.biography || '',
  services: cleaner.servicesOffered ?? [],
  languages: cleaner.languages ?? [],
  image: avatarSource(cleaner.profileImage),
  cleaningsCompleted: cleaner.cleaningsCompleted ?? 0,
});

// ─── Cleaner side: missions ──────────────────────────────────────────────────

/**
 * A schedule as every cleaner-side screen wants it: the card fields plus the
 * property detail the task page shows. Fields the list endpoints do not
 * populate (keys, access code, instructions) arrive empty here — the detail
 * screen refetches the schedule, which populates the whole accommodation.
 */
export const toCleanerTask = (mission: MissionCard): CleanerTask & {
  status: string;
  needsResponse: boolean;
  payAmount: number | null;
  payLabel: string;
  estimationHours: number;
  hostId: string;
  proofPhotos: string[];
  paymentStatus: string;
} => {
  const accommodation = (mission.accommodation ?? {}) as any;
  const host = (mission.host ?? accommodation?.host ?? accommodation?.userId ?? {}) as any;
  const assignment = mission.assignment as any;

  return {
    id: mission._id,
    apartmentName: accommodation?.name ?? t('Accommodation'),
    address: accommodationLocation(accommodation),
    date: formatDayKey(mission.dayKey) || formatDate(mission.date, { weekday: 'long', day: 'numeric', month: 'long' }),
    time: formatCleaningWindow(mission.checkInTime, mission.checkOutTime),
    image: accommodationPhoto(accommodation),
    // "Principal" = this cleaner is the primary on the assignment, not a
    // substitute standing in for them.
    isPrincipal: (assignment?.role ?? 'primary') === 'primary',
    isUpcoming: mission.dayKey ? mission.dayKey > toDateKey(new Date()) : false,

    type: accommodation?.accommodationType ?? '',
    surface: accommodation?.surface ? `${accommodation.surface}m²` : '',
    floor: accommodation?.floor ? String(accommodation.floor) : '',
    rooms: roomsText(accommodation?.numberOfRooms),
    bathrooms: accommodation?.numberOfBathrooms
      ? t('{n} bathrooms', { n: accommodation.numberOfBathrooms })
      : '',
    access: accommodation?.hasElevator ? t('Elevator') : t('Stairs'),
    cleaningRate: formatMoney(
      assignment?.pricePerCleaning ?? accommodation?.cleaningRate ?? 0,
    ),
    keyBox: keysText(accommodation?.keys) || '—',
    keyBoxCode: accommodation?.accessCode ?? accommodation?.doorCode ?? '',
    specificInstruction: accommodation?.instructions ?? mission.notes ?? '',

    client: {
      name: personName(host, t('Host')),
      phone: host?.phone ?? '',
      image: hostAvatarSource(host),
    },

    status: mission.status,
    /** Waiting on this cleaner to accept or refuse. */
    needsResponse: mission.status === 'scheduled',
    payAmount: mission.payAmount ?? null,
    payLabel: formatMoney(mission.payAmount ?? 0, mission.payCurrency),
    estimationHours: mission.estimationHours,
    hostId: host?._id ?? '',
    proofPhotos: mission.proofPhotos ?? [],
    paymentStatus: mission.paymentStatus,
  };
};

/** A pending assignment request as the cleaner's request cards want it. */
export const toCleanerRequest = (assignment: CleanerAssignment) => {
  const accommodation = assignment.accommodation as any;
  const host = (assignment.host ?? accommodation?.host ?? {}) as any;
  return {
    id: assignment._id,
    accommodationId: accommodation?._id ?? '',
    apartmentName: accommodation?.name ?? t('Accommodation'),
    address: accommodationLocation(accommodation),
    pricePerCleaning: formatMoney(
      assignment.pricePerCleaning ?? accommodation?.cleaningRate ?? 0,
    ),
    description: assignment.message ?? '',
    image: accommodationPhoto(accommodation),
    status: assignment.status,
    role: assignment.role,
    hostId: host?._id ?? '',
    hostName: personName(host, t('Host')),
    hostImage: hostAvatarSource(host),
    hostProperties: host?.totalProperties ?? 0,
    hostMemberSince: host?.memberSince
      ? formatDate(host.memberSince, { month: 'long', year: 'numeric' })
      : '',
    requestedAt: relativeFromNow(assignment.createdAt),
  };
};

// ─── Chat ────────────────────────────────────────────────────────────────────

/** A conversation row as the message list renders it. */
export interface ConversationRow {
  id: string;
  name: string;
  image: any;
  lastMessage: string;
  time: string;
  unreadCount: number;
  otherParticipantId: string;
}

export const toConversationRow = (conversation: any): ConversationRow => {
  const other = conversation?.otherParticipant;
  return {
    id: conversation._id,
    name: personName(other, 'Conversation'),
    image: avatarSource(other?.profileImage),
    lastMessage: conversation.lastMessage ?? '',
    time: conversation.lastMessageAt ? formatTime(conversation.lastMessageAt) : '',
    unreadCount: conversation.unreadCount ?? 0,
    otherParticipantId: other?._id ?? '',
  };
};

// ─── Calendar (iCal bookings + scheduled cleanings) ──────────────────────────

/** Platform ids the planning UI knows how to style. */
const knownPlatform = (platform?: string): 'airbnb' | 'booking' | 'vrbo' | 'other' => {
  const value = (platform ?? '').toLowerCase();
  if (value.includes('airbnb')) return 'airbnb';
  if (value.includes('booking')) return 'booking';
  if (value.includes('vrbo') || value.includes('abritel')) return 'vrbo';
  return 'other';
};

const stayLabel = (value?: string | null) =>
  value
    ? `${formatDate(value, { weekday: 'short', day: 'numeric', month: 'short' })}, ${formatTime(value)}`
    : '';

/**
 * `GET /calendar/:id/month` returns bookings and cleanings separately; the
 * month grid wants one row per booking, annotated with the cleaning that
 * covers its check-out day.
 */
export const toCalendarEvents = (month: any): CalendarEvent[] => {
  const bookings: any[] = month?.bookings ?? [];
  const schedules: any[] = month?.schedules ?? [];

  // Index cleanings by the day they happen so a booking can find its own.
  const scheduleByDay = new Map<string, any>();
  schedules.forEach((schedule) => {
    scheduleByDay.set(toDateKey(schedule.date), schedule);
  });

  const bookedEvents = bookings.map((booking) => {
    const checkoutKey = toDateKey(booking.endDate);
    const schedule = scheduleByDay.get(checkoutKey);
    const checkoutDate = parseDate(booking.endDate);

    return {
      id: String(booking._id),
      scheduleId: schedule ? String(schedule._id) : undefined,
      // The grid keys cells by day-of-month; the cleaning happens at check-out.
      date: checkoutDate ? checkoutDate.getDate() : 1,
      checkIn: stayLabel(booking.startDate),
      checkOut: stayLabel(booking.endDate),
      platform: knownPlatform(booking.platform),
      cleanerImage: avatarSource(schedule?.cleaner?.profileImage),
      hasManualCleaning: Boolean(schedule && !schedule.booking),
      cleaningTime: schedule ? formatCleaningWindow(schedule.checkInTime, schedule.checkOutTime) : '',
    };
  });

  // Also include standalone cleanings that do not correspond to an iCal booking
  const coveredDates = new Set(bookings.map((b) => toDateKey(b.endDate)));
  const standaloneEvents: CalendarEvent[] = [];
  schedules.forEach((schedule) => {
    const sDateKey = toDateKey(schedule.date);
    if (!coveredDates.has(sDateKey)) {
      const sDate = parseDate(schedule.date);
      if (sDate) {
        standaloneEvents.push({
          id: String(schedule._id),
          scheduleId: String(schedule._id),
          date: sDate.getDate(),
          checkIn: '',
          checkOut: formatDate(schedule.date, { weekday: 'short', day: 'numeric', month: 'short' }),
          platform: 'other',
          cleanerImage: avatarSource(schedule.cleaner?.profileImage),
          hasManualCleaning: true,
          cleaningTime: formatCleaningWindow(schedule.checkInTime, schedule.checkOutTime),
        });
      }
    }
  });

  return [...bookedEvents, ...standaloneEvents];
};

/** `GET /calendar/:id/list` pairs each booking with its cleaning, and includes standalone cleanings. */
export const toListEvents = (list: any): ListEvent[] => {
  const items: ListEvent[] = (list?.items ?? []).map((item: any) => {
    const booking = item.booking ?? {};
    const schedule = item.schedule ?? null;
    return {
      id: String(booking._id ?? item._id ?? ''),
      scheduleId: schedule ? String(schedule._id) : undefined,
      checkIn: stayLabel(booking.startDate),
      checkOut: stayLabel(booking.endDate),
      platform: knownPlatform(booking.platform),
      cleanerImage: avatarSource(schedule?.cleaner?.profileImage),
      cleaningLabel: schedule ? t('Scheduled Cleaning') : t('No cleaning scheduled'),
      cleaningTime: schedule
        ? `${formatDate(schedule.date, { weekday: 'short', day: 'numeric', month: 'short' })}, ${formatCleaningWindow(schedule.checkInTime, schedule.checkOutTime)}`
        : '',
      hasManualCleaning: Boolean(schedule && !schedule.booking),
    };
  });

  // Add schedules that don't belong to any booking in the list
  const schedules: any[] = list?.schedules ?? [];
  const coveredScheduleIds = new Set(items.map((i) => i.scheduleId).filter(Boolean));
  schedules.forEach((s) => {
    if (!coveredScheduleIds.has(String(s._id))) {
      items.push({
        id: String(s._id),
        scheduleId: String(s._id),
        checkIn: '',
        checkOut: formatDate(s.date, { weekday: 'short', day: 'numeric', month: 'short' }),
        platform: 'other',
        cleanerImage: avatarSource(s.cleaner?.profileImage),
        cleaningLabel: t('Scheduled Cleaning'),
        cleaningTime: `${formatDate(s.date, { weekday: 'short', day: 'numeric', month: 'short' })}, ${formatCleaningWindow(s.checkInTime, s.checkOutTime)}`,
        hasManualCleaning: true,
      });
    }
  });

  return items;
};
