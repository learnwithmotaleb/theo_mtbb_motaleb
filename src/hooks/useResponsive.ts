import { PixelRatio, useWindowDimensions } from "react-native";

const BASE_WIDTH = 360;
const BASE_HEIGHT = 800;
const TABLET_BREAKPOINT = 600;

export const useResponsive = () => {
  const { width, height } = useWindowDimensions(); // auto-updates on rotation

  const isTablet = width >= TABLET_BREAKPOINT;
  const dampener = (scale: number) => (isTablet ? Math.pow(scale, 0.75) : scale);

  const wp = (size: number): number => size * dampener(width / BASE_WIDTH);
  const hp = (size: number): number => size * dampener(height / BASE_HEIGHT);
  const fp = (size: number): number =>
    Math.round(PixelRatio.roundToNearestPixel(size * (width / BASE_WIDTH))) /
    (isTablet ? 1.3 : 1);

  return { wp, hp, fp, isTablet };
};