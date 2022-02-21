/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const Iconfollowing16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M770.415849 63.996H253.584151A61.11618 61.11618 0 0 0 192.019999 124.47222v863.178052c0 13.183176 7.231548 25.27842 18.942816 31.67802a37.11768 37.11768 0 0 0 37.373664-0.767952l263.727517-159.990001 263.663521 158.774077a37.501656 37.501656 0 0 0 37.373664 0.767952c11.647272-6.3996 18.87882-18.55884 18.87882-31.67802V124.408224A61.052184 61.052184 0 0 0 770.415849 63.996z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

Iconfollowing16.defaultProps = {
  size: 18,
};

export default Iconfollowing16;
