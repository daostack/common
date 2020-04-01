/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const Iconfollow = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M770.415849 63.996H253.584151A61.11618 61.11618 0 0 0 192.019999 124.47222v863.178052c0 13.183176 7.231548 25.27842 18.942816 31.67802a37.11768 37.11768 0 0 0 37.373664-0.767952l263.727517-159.990001 263.663521 158.774077a37.501656 37.501656 0 0 0 37.373664 0.767952c11.647272-6.3996 18.87882-18.55884 18.87882-31.67802V124.408224A61.052184 61.052184 0 0 0 770.415849 63.996z m-12.287232 857.674396l-226.801825-136.631461a37.821636 37.821636 0 0 0-38.71758 0.063996l-226.737829 137.591401V136.439473h492.257234v785.166927z"
        fill={getIconColor(color, 0, '#3CC7E1')}
      />
    </Svg>
  );
};

Iconfollow.defaultProps = {
  size: 18,
};

export default Iconfollow;
