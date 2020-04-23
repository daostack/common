/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const Iconsort = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M818.88 599.424l-275.2 283.072a43.904 43.904 0 0 1-63.36 0l-275.2-283.072a47.04 47.04 0 0 1 0-65.152 43.84 43.84 0 0 1 63.36 0l196.032 201.536v-552.96c0-30.272 23.488-54.848 52.48-54.848 28.992 0 52.48 24.576 52.48 54.848l0.064 542.72 185.984-191.36a44.032 44.032 0 0 1 63.36 0 47.232 47.232 0 0 1 0 65.28z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

Iconsort.defaultProps = {
  size: 18,
};

export default Iconsort;
