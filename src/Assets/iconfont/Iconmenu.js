/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const Iconmenu = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 256A128 128 0 1 1 511.936 0.064 128 128 0 0 1 512 256z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 640z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 1024z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconmenu.defaultProps = {
  size: 18,
};

export default Iconmenu;
