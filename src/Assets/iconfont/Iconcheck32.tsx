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

export const Iconcheck32: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M487.776 686.496a59.2 59.2 0 0 1-84.096 0l-130.24-131.072a60.032 60.032 0 0 1 0-84.576 59.2 59.2 0 0 1 84.064 0l77.6 78.08c5.856 5.888 15.36 5.888 21.248 0l210.144-211.424a59.2 59.2 0 0 1 84.096 0 60.032 60.032 0 0 1 0 84.576l-262.816 264.416z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

Iconcheck32.defaultProps = {
  size: 18,
};

export default Iconcheck32;
