import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 360;
const BASE_HEIGHT = 800;
const TABLET_BREAKPOINT = 600; // dp

const isTablet = width >= TABLET_BREAKPOINT;

// Apply a dampening factor on tablets to prevent over-scaling
const scaleTablet = (scale: number) => (isTablet ? Math.pow(scale, 0.75) : scale);

export const wp = (size: number): number => {
  const scale = width / BASE_WIDTH;
  return size * scaleTablet(scale);
};

export const hp = (size: number): number => {
  const scale = height / BASE_HEIGHT;
  return size * scaleTablet(scale);
};

export const fp = (size: number): number => {
  // Font: use width ratio, dampen via PixelRatio, cap for tablets
  const scale = width / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) / (isTablet ? 1.3 : 1);
};