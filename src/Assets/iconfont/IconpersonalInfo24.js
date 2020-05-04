/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const IconpersonalInfo24 = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 512c282.752 0 512 229.248 512 512H0c0-282.752 229.248-512 512-512z m0-512a256 256 0 1 1 0 512 256 256 0 0 1 0-512z"
        fill={getIconColor(color, 0, '#3CC7E1')}
      />
    </Svg>
  );
};

IconpersonalInfo24.defaultProps = {
  size: 18,
};

export default IconpersonalInfo24;
