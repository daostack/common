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

export const Iconclose: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M877.12 146.88a64.704 64.704 0 0 1 0 91.328l-273.92 273.856 273.792 273.792a64.64 64.64 0 1 1-91.264 91.2L511.936 603.328l-273.664 273.728a64.576 64.576 0 1 1-91.264-91.264l273.664-273.728-273.728-273.792a64.512 64.512 0 1 1 91.264-91.264l273.728 273.728 273.92-273.856a64.64 64.64 0 0 1 91.264 0z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconclose.defaultProps = {
  size: 18,
};

export default Iconclose;
