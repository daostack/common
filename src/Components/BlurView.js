import React from 'react';
import {View} from 'react-native';
import {object, bool} from 'prop-types';

const BlurView = ({children, style, isBlurring}) => (
  <View
    style={{
      backgroundColor: isBlurring ? 'white' : 'rgba(0, 0, 0, 0.25)',
      ...style,
    }}>
    {children}
  </View>
);

BlurView.propTypes = {
  children: object,
  style: object,
  isBlurring: bool,
};

export default BlurView;
