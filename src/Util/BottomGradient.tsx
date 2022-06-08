import React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const hexToRGBA = (hexCode: string, opacity = 1): string => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
};

const gradientColors = [
  hexToRGBA('#000', 0),
  hexToRGBA('#000', 0.2),
  hexToRGBA('#000', 0.315),
  hexToRGBA('#000', 0.58),
  '#000',
];

const gradientLocations = [0.5, 0.6, 0.65, 0.75, 1];

interface BottomGradientProps {
  style?: StyleProp<ViewStyle>;
}

export const BottomGradient = (props: BottomGradientProps) => {
  const {style} = props;
  return (
    <LinearGradient
      pointerEvents={'none'}
      style={[styles.gradientContainer, style]}
      colors={gradientColors}
      locations={gradientLocations}
    />
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
});
