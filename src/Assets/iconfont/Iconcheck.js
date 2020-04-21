/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const Iconcheck = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M487.744 686.464a59.136 59.136 0 0 1-84.032 0L273.408 555.52a60.096 60.096 0 0 1 0-84.608 59.2 59.2 0 0 1 84.096 0l77.632 78.08c5.824 5.888 15.36 5.888 21.184 0l210.176-211.392a59.2 59.2 0 0 1 84.096 0 59.968 59.968 0 0 1 0 84.544l-262.848 264.384z"
        fill={getIconColor(color, 0, '#3CC7E1')}
      />
    </Svg>
  );
};

Iconcheck.defaultProps = {
  size: 18,
};

export default Iconcheck;
