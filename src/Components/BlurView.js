import React from 'react';
import { View } from 'react-native';

const BlurView = ({ children, style, isBlurring }) => (
  <View
    style={{
      backgroundColor: isBlurring ? 'white' : 'rgba(0, 0, 0, 0.25)',
      ...style,
    }}
  >
    {children}
  </View>
);

export default BlurView;
