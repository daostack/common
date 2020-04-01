/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const IconleftArrow = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M489.824 512l165.28 160.416c22.528 21.856 22.528 57.6 0 79.456a57.664 57.664 0 0 1-80 0l-206.208-200.16a55.072 55.072 0 0 1 0-79.424l206.208-200.128a57.6 57.6 0 0 1 80 0c22.528 21.856 22.528 57.6 0 79.456L489.824 512z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

IconleftArrow.defaultProps = {
  size: 18,
};

export default IconleftArrow;
