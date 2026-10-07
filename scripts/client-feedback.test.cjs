// Regression tests for the October 2026 client feedback: cleaning slot order,
// French labels, no service fee, property wizard rules, postal-code checks.
// Run with: node --test scripts/
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(relativePath, dependencies) {
  const filename = path.join(__dirname, '..', relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (name) => dependencies[name] ?? require(name),
    fetch,
    AbortController,
    setTimeout,
    clearTimeout,
    console,
    Intl,
    Date,
  }, { filename });
  return module.exports;
}

// The real French catalog, behind the same `t()` contract as src/i18n.
const { fr } = loadTs('src/i18n/fr.ts', {});
const interpolate = (text, vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;
const i18n = {
  t: (text, vars) => interpolate(fr[text] ?? text, vars),
  intlLocale: () => 'fr-FR',
};

const datetime = loadTs('src/lib/datetime.ts', { '@/i18n': i18n });
const accommodation = loadTs('src/constants/accommodation.ts', { '@/i18n': i18n });
const pricing = loadTs('src/lib/pricing.ts', { '@/i18n': i18n });
const geo = loadTs('src/lib/frenchGeo.ts', {});
const validation = loadTs('utils/validation.ts', {});
const draftSlice = loadTs('src/redux/slices/accommodationDraftSlice.ts', {
  '@/constants/accommodation': accommodation,
  '@/lib/frenchGeo': geo,
});
const mappers = loadTs('src/lib/mappers.ts', {
  '@/constants/image.index': { IMAGE_COMPONENTS: {} },
  './config': { resolveAssetUrl: (p) => p ?? '' },
  './datetime': datetime,
  './pricing': pricing,
  '@/i18n': i18n,
  '@/constants/accommodation': accommodation,
});

// ── Cleaning slot: arrival first, then departure ────────────────────────────
test('slot reads arrival → departure whatever order the fields are stored in', () => {
  // Stored as checkIn = arrival (what the cleaner screens showed reversed)…
  assert.equal(datetime.formatCleaningWindow('10:00', '14:00'), '10:00 – 14:00');
  // …and the other way round (guest semantics). Both read 10h–14h.
  assert.equal(datetime.formatCleaningWindow('14:00', '10:00'), '10:00 – 14:00');
  assert.equal(datetime.formatCleaningWindow('14:00:00', '9:30'), '09:30 – 14:00');
  assert.deepEqual({ ...datetime.cleaningWindow('14:00', '10:00') }, { arrival: '10:00', departure: '14:00' });
});

test('slot with a missing time shows what exists, never a dangling dash', () => {
  assert.equal(datetime.formatCleaningWindow('10:00', null), '10:00');
  assert.equal(datetime.formatCleaningWindow(undefined, ''), '');
});

test('slot duration is positive in either storage order', () => {
  assert.equal(datetime.cleaningHours('10:00', '14:00'), 4);
  assert.equal(datetime.cleaningHours('14:00', '10:00'), 4);
  assert.equal(datetime.cleaningHours('10:00', '11:30'), 1.5);
  assert.equal(datetime.cleaningHours('10:00', '10:00'), null);
  assert.equal(datetime.cleaningHours('', '10:00'), null);
});

test('mission cards show the slot in arrival order and a French day', () => {
  const card = mappers.toCleanerTask({
    _id: 's1', accommodation: { name: 'T3' }, host: {}, cleaner: {},
    date: '2026-09-19T00:00:00.000Z', dayKey: '2026-09-19', dayLabel: 'Saturday 19 September',
    checkInTime: '10:00', checkOutTime: '14:00', status: 'accepted', paymentStatus: 'unpaid',
    estimationHours: 4, payAmount: 55, payCurrency: 'EUR',
  });
  assert.equal(card.time, '10:00 – 14:00');
  assert.equal(card.date, 'samedi 19 septembre');
});

test('day keys render on the right day in French', () => {
  assert.equal(datetime.formatDayKey('2026-09-20'), 'dimanche 20 septembre');
  assert.equal(datetime.formatDayKey('not a date'), '');
});

// ── French labels on the host home ──────────────────────────────────────────
test('to-do labels are French whatever English text the backend sends', () => {
  assert.equal(
    mappers.todoLabel({ kind: 'assignment', status: 'accepted', label: 'Cleaner accepted your request' }),
    "L'agent d'entretien a accepté votre demande",
  );
  assert.equal(
    mappers.todoLabel({ kind: 'schedule', status: 'completed', label: 'Cleaning completed' }),
    'Ménage terminé',
  );
  assert.equal(
    mappers.todoLabel({ kind: 'assignment', status: 'pending', label: 'x' }),
    "Invitation envoyée – En attente d'acceptation",
  );
  // Unknown combination: falls back to the backend text.
  assert.equal(mappers.todoLabel({ kind: 'schedule', status: 'weird', label: 'Something' }), 'Something');
});

test('"time ago" is French', () => {
  const now = Date.now();
  assert.equal(datetime.relativeFromNow(new Date(now - 6 * 60_000)), 'Il y a 6 min');
  assert.equal(datetime.relativeFromNow(new Date(now - 26 * 3_600_000)), 'Il y a 1 j');
});

// ── Payment: no service fee ─────────────────────────────────────────────────
test('the host pays the cleaning rate only — no 5% fee', () => {
  const price = pricing.computeSchedulePrice(55, 75);
  assert.equal(price.serviceFee, 0);
  assert.equal(price.total, 55);
  assert.equal(price.cleaningService, 55);
  // Falls back to the accommodation rate when there is no agreed price.
  assert.equal(pricing.computeSchedulePrice(undefined, 80).total, 80);
});

// ── Email ───────────────────────────────────────────────────────────────────
test('emails are trimmed and validated after trimming', () => {
  assert.equal(validation.normalizeEmail(' user@email.com  '), 'user@email.com');
  assert.equal(validation.validateEmail('user@email.com '), '');
  assert.equal(validation.validateEmail('   '), 'Email is required');
  assert.equal(validation.validateEmail('not-an-email'), 'Please enter a valid email address');
});

// ── Property wizard ─────────────────────────────────────────────────────────
const validDraft = () => ({
  name: 'Chalet la montagne',
  accommodationType: 'House',
  address: 'Chemin des guides',
  city: 'Thonon-les-Bains',
  zipCode: '74200',
  cityPostalCodes: ['74200'],
  numberOfRooms: '3',
  surface: '80',
  floor: '',
  hasElevator: null,
  cleaningRate: '75',
  notes: '',
  photos: [],
  keys: 'Key box',
  accessCode: '',
  instructions: '',
  frequency: '',
  checkInTime: '14:00',
  checkOutTime: '10:00',
  editingId: null,
});

test('a new wizard starts with nothing pre-filled', () => {
  const state = draftSlice.default(undefined, { type: '@@init' });
  for (const field of ['accommodationType', 'numberOfRooms', 'keys', 'frequency', 'checkInTime', 'checkOutTime', 'zipCode']) {
    assert.equal(state[field], '', `${field} must start empty`);
  }
  assert.equal(state.hasElevator, null);
});

test('floor and elevator are asked for apartments and studios only', () => {
  assert.equal(accommodation.hasFloorAndElevator('Apartment'), true);
  assert.equal(accommodation.hasFloorAndElevator('Studio'), true);
  assert.equal(accommodation.hasFloorAndElevator('House'), false);
  assert.equal(accommodation.hasFloorAndElevator('Other'), false);
  assert.equal(accommodation.hasFloorAndElevator(''), false);
});

test('a house never sends a floor or an elevator', () => {
  const fields = draftSlice.draftToFields({ ...validDraft(), floor: '3', hasElevator: true });
  assert.equal(fields.floor, '');
  assert.equal(fields.hasElevator, false);
  const flat = draftSlice.draftToFields({ ...validDraft(), accommodationType: 'Apartment', floor: '3', hasElevator: true });
  assert.equal(flat.floor, '3');
  assert.equal(flat.hasElevator, true);
});

test('draft validation requires the type and a 5-digit postal code', () => {
  assert.equal(draftSlice.validateDraft(validDraft()), null);
  assert.equal(draftSlice.validateDraft({ ...validDraft(), accommodationType: '' }), 'Choose the type of accommodation.');
  assert.equal(draftSlice.validateDraft({ ...validDraft(), zipCode: '7420' }), 'Enter a valid 5-digit postal code.');
  assert.equal(draftSlice.validateDraft({ ...validDraft(), numberOfRooms: '' }), 'Choose the number of rooms.');
  // Host onboarding never asks about keys: that must not block it.
  assert.equal(draftSlice.validateDraft({ ...validDraft(), keys: '' }), null);
});

test('only two key options remain, both in French', () => {
  assert.deepEqual([...accommodation.KEY_OPTIONS], ['Key box', 'Hand delivery']);
  assert.equal(i18n.t('Key box'), 'Boîte à clés');
  assert.equal(i18n.t('Hand delivery'), 'Remise en main propre');
  // Values saved before the change still display in French.
  assert.equal(accommodation.keysText('Under the doormat', i18n.t), 'Sous le paillasson');
});

test('room options read in French and map to numbers', () => {
  assert.equal(i18n.t('3 rooms (T3)'), '3 pièces (T3)');
  assert.equal(accommodation.roomsToNumber('3 rooms (T3)'), '3');
  assert.equal(accommodation.roomsToNumber(''), '');
  assert.equal(accommodation.roomsToLabel(''), '');
  assert.equal(accommodation.roomsToLabel(7), '5+ rooms');
  assert.equal(accommodation.roomsText(1, i18n.t), '1 pièce');
});

// ── City and postal code (live: geo.api.gouv.fr) ────────────────────────────
test('city names compare without accents, hyphens or "St"', () => {
  assert.equal(geo.normalizeCityName('Saint-Étienne'), geo.normalizeCityName('st etienne'));
  assert.equal(geo.normalizeCityName("L'Haÿ-les-Roses"), 'l hay les roses');
});

test('postal-code format is checked before any request', async () => {
  assert.equal(await geo.checkPostalCode('Lyon', '7500'), 'invalid_format');
  assert.equal(await geo.checkPostalCode('Lyon', 'abcde'), 'invalid_format');
});

test('known postal codes of a picked city are checked offline', async () => {
  assert.equal(await geo.checkPostalCode('Thonon-les-Bains', '74200', ['74200']), 'ok');
  assert.equal(await geo.checkPostalCode('Thonon-les-Bains', '75002', ['74200']), 'mismatch');
});

test('live: any French city can be searched, not just five', { timeout: 20_000 }, async () => {
  const results = await geo.searchCommunes('thonon');
  const thonon = results.find((c) => c.name === 'Thonon-les-Bains');
  assert.ok(thonon, 'Thonon-les-Bains is found');
  assert.deepEqual(thonon.postalCodes, ['74200']);
  assert.equal(thonon.department, '74');
});

test('live: the postal code must match the typed city', { timeout: 30_000 }, async () => {
  // The client's example: Thonon-les-Bains and its code.
  assert.equal(await geo.checkPostalCode('Thonon-les-Bains', '74200'), 'ok');
  assert.equal(await geo.checkPostalCode('thonon les bains', '74200'), 'ok');
  // The data in the screenshots: "Lyon" with Thonon's 74200, and 75002.
  assert.equal(await geo.checkPostalCode('Lyon', '74200'), 'mismatch');
  assert.equal(await geo.checkPostalCode('Lyon', '75002'), 'mismatch');
  // Cities with several codes.
  assert.equal(await geo.checkPostalCode('Lyon', '69003'), 'ok');
  assert.equal(await geo.checkPostalCode('Paris', '75015'), 'ok');
  assert.equal(await geo.checkPostalCode('Marseille', '13008'), 'ok');
  assert.equal(await geo.checkPostalCode('Douai', '59500'), 'ok');
  // A code that does not exist.
  assert.equal(await geo.checkPostalCode('Lyon', '00000'), 'unknown_postal_code');
});

// ── French catalog sanity ───────────────────────────────────────────────────
test('the strings the client asked for are exact', () => {
  assert.equal(i18n.t('Service Fee'), 'Frais de service');
  assert.equal(i18n.t('Off-app payment'), 'Paiement hors application');
  assert.equal(i18n.t('Confirm'), 'Confirmer');
  assert.equal(i18n.t('Assign a cleaner'), 'Assigner une femme de ménage');
  assert.equal(i18n.t('Invitation sent – waiting for acceptance'), "Invitation envoyée – En attente d'acceptation");
  assert.equal(i18n.t('Schedule a cleaning'), 'Planifier un ménage');
  assert.equal(i18n.t('Create a cleaning'), 'Créer un ménage');
});
