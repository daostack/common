/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const Iconshare32 = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M697.152 224A102.976 102.976 0 0 1 800 326.848a102.976 102.976 0 0 1-102.848 102.88 102.528 102.528 0 0 1-70.88-28.384l-194.08 106.944a28.832 28.832 0 0 1-4.192 1.92l-0.704 3.424a26.144 26.144 0 0 1 4.896 2.08l194.08 106.944a102.528 102.528 0 0 1 70.88-28.384A102.976 102.976 0 0 1 800 697.152 102.976 102.976 0 0 1 697.152 800a102.976 102.976 0 0 1-99.68-128.224l-194.176-107.008-2.688-1.696a102.624 102.624 0 0 1-73.76 31.2C270.144 594.272 224 548.16 224 491.424s46.144-102.848 102.848-102.848c41.856 0 77.952 25.12 93.984 61.056l176.64-97.376A102.976 102.976 0 0 1 697.152 224z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

Iconshare32.defaultProps = {
  size: 18,
};

export default Iconshare32;
