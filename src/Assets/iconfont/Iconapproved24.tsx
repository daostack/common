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

export const Iconapproved24: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M881.792 170.666667c25.386667 0 50.773333 9.6 70.144 28.672a98.048 98.048 0 0 1 0 140.032L458.88 824.746667A99.925333 99.925333 0 0 1 388.693333 853.333333a99.413333 99.413333 0 0 1-70.144-28.672L72.064 581.973333a97.877333 97.877333 0 0 1 0-139.989333 99.797333 99.797333 0 0 1 70.186667-28.672c25.386667 0 50.773333 9.6 70.144 28.672l176.341333 173.610667 422.869333-416.256A99.797333 99.797333 0 0 1 881.792 170.666667z"
        fill={getIconColor(color, 0, '#6EE569')}
      />
    </Svg>
  );
};

Iconapproved24.defaultProps = {
  size: 18,
};

export default Iconapproved24;
