import React from 'react';
import { Text, TextProps } from 'react-native';
import { fp } from '../../../utils/responsiveDevice';

const fontFamily = {
    regular: "Poppins_400Regular",
    regularItalic: "Poppins_400Regular_Italic",
    medium: "Poppins_500Medium",
    mediumItalic: "Poppins_500Medium_Italic",
    semiBold: "Poppins_600SemiBold",
    semiBoldItalic: "Poppins_600SemiBold_Italic",
    bold: "Poppins_700Bold",
    boldItalic: "Poppins_700Bold_Italic",
    extraBold: "Poppins_800ExtraBold",
};

/**
 * Typography Variant → Font Size / Weight mapping
 *
 * h1          → 24px / 500 (medium)
 * h2          → 20px / 700 (bold)
 * h3          → 20px / 500 (medium)
 * h4          → 20px / 400 (regular)
 * h5          → 18px / 700 (bold)
 * h6          → 18px / 600 (semiBold)
 * body1       → 16px / 600 (semiBold)
 * body2       → 16px / 500 (medium)
 * body3       → 16px / 400 (regular)
 * body4       → 14px / 500 (medium)
 * body5       → 14px / 600 (semiBold)
 * body6       → 14px / 400 (regular)
 * body7       → 14px / 700 (bold)
 * caption1    → 12px / 500 (medium)
 * caption2    → 12px / 600 (semiBold)
 * caption3    → 12px / 400 (regular)
 * caption4    → 10px / 500 (medium)
 * caption5    → 10px / 400 (regular)
 * button      → 16px / 600 (semiBold)
 * specialText → 20px / 800 (extraBold)
 */
export type TypographyVariant =
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "body1" | "body2" | "body3" | "body4" | "body5" | "body6" | "body7"
    | "caption1" | "caption2" | "caption3" | "caption4" | "caption5"
    | "button" | "specialText";

export type TypographyWeight =
    | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold';

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    weight?: TypographyWeight;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    children: React.ReactNode;
    italic?: boolean;
}

const Typography: React.FC<TypographyProps> = ({
    variant = "body2",
    color = "#333333",
    align = "left",
    weight = "regular",
    children,
    style,
    italic = false,
    ...props
}) => {

    const getFontSize = (): number => {
        switch (variant) {
            // ── Headings ──────────────────────────────
            case "h1": return fp(24);   // 24 / 500
            case "h2": return fp(20);   // 20 / 700
            case "h3": return fp(20);   // 20 / 500
            case "h4": return fp(20);   // 20 / 400
            case "h5": return fp(18);   // 18 / 700
            case "h6": return fp(18);   // 18 / 600
            // ── Body ──────────────────────────────────
            case "body1": return fp(16);  // 16 / 600
            case "body2": return fp(16);  // 16 / 500
            case "body3": return fp(16);  // 16 / 400
            case "body4": return fp(14);  // 14 / 500
            case "body5": return fp(14);  // 14 / 600
            case "body6": return fp(14);  // 14 / 400
            case "body7": return fp(14);  // 14 / 700
            // ── Captions ──────────────────────────────
            case "caption1": return fp(12); // 12 / 500
            case "caption2": return fp(12); // 12 / 600
            case "caption3": return fp(12); // 12 / 400
            case "caption4": return fp(10); // 10 / 500
            case "caption5": return fp(10); // 10 / 400
            // ── Special ───────────────────────────────
            case "button":      return fp(16);
            case "specialText": return fp(20);
            default: return fp(16);
        }
    };

    /**
     * Line heights follow the 1.4–1.6× multiplier convention:
     *   ≥ 20px text  → ~1.4× (generous display spacing)
     *   14–18px text → ~1.5× (comfortable reading)
     *   ≤ 12px text  → ~1.6× (aids legibility at small sizes)
     */
    const getLineHeight = (): number => {
        switch (variant) {
            // ── Headings ──────────────────────────────
            case "h1": return fp(34);   // 24 × 1.42
            case "h2": return fp(28);   // 20 × 1.40
            case "h3": return fp(28);   // 20 × 1.40
            case "h4": return fp(28);   // 20 × 1.40
            case "h5": return fp(26);   // 18 × 1.44
            case "h6": return fp(26);   // 18 × 1.44
            // ── Body ──────────────────────────────────
            case "body1": return fp(24); // 16 × 1.50
            case "body2": return fp(24); // 16 × 1.50
            case "body3": return fp(24); // 16 × 1.50
            case "body4": return fp(22); // 14 × 1.57
            case "body5": return fp(22); // 14 × 1.57
            case "body6": return fp(22); // 14 × 1.57
            case "body7": return fp(22); // 14 × 1.57
            // ── Captions ──────────────────────────────
            case "caption1": return fp(18); // 12 × 1.50
            case "caption2": return fp(18); // 12 × 1.50
            case "caption3": return fp(18); // 12 × 1.50
            case "caption4": return fp(16); // 10 × 1.60
            case "caption5": return fp(16); // 10 × 1.60
            // ── Special ───────────────────────────────
            case "button":      return fp(24); // 16 × 1.50
            case "specialText": return fp(28); // 20 × 1.40
            default: return fp(24);
        }
    };

    const getFontFamily = (): string => {
        if (italic) {
            switch (weight) {
                case "medium":   return fontFamily.mediumItalic;
                case "semiBold": return fontFamily.semiBoldItalic;
                case "bold":     return fontFamily.boldItalic;
                case "extraBold":return fontFamily.boldItalic;
                default:         return fontFamily.regularItalic;
            }
        }

        switch (weight) {
            case "regular":  return fontFamily.regular;
            case "medium":   return fontFamily.medium;
            case "semiBold": return fontFamily.semiBold;
            case "bold":     return fontFamily.bold;
            case "extraBold":return fontFamily.extraBold;
            default:         return fontFamily.regular;
        }
    };

    return (
        <Text
            style={[
                {
                    fontSize:   getFontSize(),
                    lineHeight: getLineHeight(),
                    color,
                    textAlign:  align,
                    fontFamily: getFontFamily(),
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

// ─── Heading shortcuts ────────────────────────────────────────────────────────

/** 24px / medium (500) */
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h1" weight="medium" {...props} />
);
/** 20px / bold (700) */
export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h2" weight="bold" {...props} />
);
/** 20px / medium (500) */
export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h3" weight="medium" {...props} />
);
/** 20px / regular (400) */
export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h4" weight="regular" {...props} />
);
/** 18px / bold (700) */
export const H5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h5" weight="bold" {...props} />
);
/** 18px / semiBold (600) */
export const H6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h6" weight="semiBold" {...props} />
);

// ─── Body shortcuts ───────────────────────────────────────────────────────────

/** 16px / semiBold (600) */
export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body1" weight="semiBold" {...props} />
);
/** 16px / medium (500) */
export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body2" weight="medium" {...props} />
);
/** 16px / regular (400) */
export const Body3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body3" weight="regular" {...props} />
);
/** 14px / medium (500) */
export const Body4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body4" weight="medium" {...props} />
);
/** 14px / semiBold (600) */
export const Body5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body5" weight="semiBold" {...props} />
);
/** 14px / regular (400) */
export const Body6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body6" weight="regular" {...props} />
);
/** 14px / bold (700) */
export const Body7: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body7" weight="bold" {...props} />
);

// ─── Caption shortcuts ────────────────────────────────────────────────────────

/** 12px / medium (500) */
export const Caption1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption1" weight="medium" {...props} />
);
/** 12px / semiBold (600) */
export const Caption2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption2" weight="semiBold" {...props} />
);
/** 12px / regular (400) */
export const Caption3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption3" weight="regular" {...props} />
);
/** 10px / medium (500) */
export const Caption4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption4" weight="medium" {...props} />
);
/** 10px / regular (400) */
export const Caption5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption5" weight="regular" {...props} />
);

// ─── Special shortcuts ────────────────────────────────────────────────────────

/** 16px / semiBold (600) */
export const ButtonText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="button" weight="semiBold" {...props} />
);
/** 20px / extraBold (800) */
export const SpecialText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="specialText" weight="extraBold" {...props} />
);

export default Typography;