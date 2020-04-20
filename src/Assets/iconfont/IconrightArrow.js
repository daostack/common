/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const IconrightArrow = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M566.144 512l-165.248 160.384a55.168 55.168 0 0 0 0 79.488 57.664 57.664 0 0 0 80 0l206.208-200.128a55.232 55.232 0 0 0 0-79.488L480.896 272.128a57.664 57.664 0 0 0-80 0 55.168 55.168 0 0 0 0 79.488L566.144 512z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

IconrightArrow.defaultProps = {
  size: 18,
};

export default IconrightArrow;
