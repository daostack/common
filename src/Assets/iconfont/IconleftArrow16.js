/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const IconleftArrow16 = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M457.856 512l165.248 160.384c22.528 21.888 22.528 57.6 0 79.488a57.664 57.664 0 0 1-80 0L336.896 551.68a55.424 55.424 0 0 1 0-79.488l206.208-200.128a57.664 57.664 0 0 1 80 0c22.528 21.888 22.528 57.6 0 79.488L457.856 512z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

IconleftArrow16.defaultProps = {
  size: 18,
};

export default IconleftArrow16;
