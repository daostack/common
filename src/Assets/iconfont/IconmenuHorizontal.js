/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const IconmenuHorizontal = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M640 512a64 64 0 1 1 127.968-0.032A64 64 0 0 1 640 512z m-192 0a64 64 0 1 1 127.968-0.032A64 64 0 0 1 448 512z m-192 0a64 64 0 1 1 127.968-0.032A64 64 0 0 1 256 512z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

IconmenuHorizontal.defaultProps = {
  size: 18,
};

export default IconmenuHorizontal;
