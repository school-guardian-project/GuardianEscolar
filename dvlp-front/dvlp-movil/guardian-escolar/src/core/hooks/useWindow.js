import { useWindowDimensions } from 'react-native';

// Small helper hook wrapping useWindowDimensions with common breakpoints
export default function useWindow() {
  const { width, height } = useWindowDimensions();

  const isSmall = width <= 360;
  const isMedium = width > 360 && width <= 420;
  const isLarge = width > 420;

  // scale relative to a base width (iPhone 8 / 375dp)
  const scale = width / 375;

  return { width, height, isSmall, isMedium, isLarge, scale };
}
