/**
 * App-wide design tokens — colors and fonts.
 *
 * Usage:
 *   import { Colors, Fonts } from '@/constants/Colors';
 *   Colors.BRAND_PRIMARY  →  "#0088FF"
 */

// ─── Raw palette ──────────────────────────────────────────────────────────────

// Brand
const BRAND_PRIMARY        = "#0088FF";
const BRAND_SECONDARY      = "#A5D4A9";

// Backgrounds
const APP_BACKGROUND       = "#FAFAFA";
const INPUT_BACKGROUND     = "#FFFFFF";
const BG_BLACK             = "#000000";

// Text
const PRIMARY_TEXT         = "#1A1A1A";
const SECONDARY_TEXT       = "#2A2A2A";
const TEXT_COLOR           = "#606060";
const SPECIAL_TEXT         = "#333333";
const TEXT_WHITE           = "#FFFFFF";
const PLACEHOLDER_TEXT     = "#7F7F7F80";

// Border
const BORDER_COLOR         = "#3C3C432E";

// Status / feedback
const STATUS_COLOR         = "#35A9D6";
const STATUS_COLOR_OPACITY = "#35A9D614";
const SUCCESS_COLOR        = "#1D9E75";
const COLOR_ACTIVE         = "#22C55E";
const COLOR_DANGER         = "#FF383C";
const COLOR_ORANGE         = "#FF8D28";
const ACCENT_YELLOW        = "#E4E500";

// ─── Exports ──────────────────────────────────────────────────────────────────

export const Colors = {

    // ── Theme (light / dark) ────────────────────────────────────────────────
    light: {
        text:           PRIMARY_TEXT,
        background:     APP_BACKGROUND,
        tint:           BRAND_PRIMARY,
        icon:           TEXT_COLOR,
        tabIconDefault: TEXT_COLOR,
        tabIconSelected: BRAND_PRIMARY,
    },
    dark: {
        text:           TEXT_WHITE,
        background:     BG_BLACK,
        tint:           TEXT_WHITE,
        icon:           TEXT_COLOR,
        tabIconDefault: TEXT_COLOR,
        tabIconSelected: TEXT_WHITE,
    },

    // ── Brand ───────────────────────────────────────────────────────────────
    BRAND_PRIMARY,
    BRAND_SECONDARY,

    // ── Backgrounds ─────────────────────────────────────────────────────────
    APP_BACKGROUND,
    INPUT_BACKGROUND,
    BG_BLACK,

    // ── Text ────────────────────────────────────────────────────────────────
    PRIMARY_TEXT,
    SECONDARY_TEXT,
    TEXT_COLOR,
    SPECIAL_TEXT,
    TEXT_WHITE,
    PLACEHOLDER_TEXT,

    // ── Border ──────────────────────────────────────────────────────────────
    BORDER_COLOR,

    // ── Status / feedback ───────────────────────────────────────────────────
    STATUS_COLOR,
    STATUS_COLOR_OPACITY,
    SUCCESS_COLOR,
    COLOR_ACTIVE,
    COLOR_DANGER,
    COLOR_ORANGE,
    ACCENT_YELLOW,
};

// ─── Fonts ────────────────────────────────────────────────────────────────────

export const Fonts = {
    regular:       'Poppins_400Regular',
    regularItalic: 'Poppins_400Regular_Italic',
    medium:        'Poppins_500Medium',
    mediumItalic:  'Poppins_500Medium_Italic',
    semiBold:      'Poppins_600SemiBold',
    semiBoldItalic:'Poppins_600SemiBold_Italic',
    bold:          'Poppins_700Bold',
    boldItalic:    'Poppins_700Bold_Italic',
    extraBold:     'Poppins_800ExtraBold',
};