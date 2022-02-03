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

export const Iconadd24: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 160a64 64 0 0 1 64 64v224h224a64 64 0 1 1 0 128h-224.032L576 800a64 64 0 1 1-128 0l-0.032-224H224a64 64 0 1 1 0-128h224V224a64 64 0 0 1 64-64z"
        fill={getIconColor(color, 0, '#979BBA')}
      />
    </Svg>
  );
};

Iconadd24.defaultProps = {
  size: 18,
};

export default Iconadd24;
