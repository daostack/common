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

export const Iconhidden: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M918.272 196.864a64 64 0 0 1 0 90.496l-49.728 49.728c48.704 42.56 95.936 94.528 141.504 155.84 7.232 9.664 8.32 22.464 3.136 33.088l-3.136 5.12-14.976 19.712C849.792 738.304 688.704 832 512 832a484.48 484.48 0 0 1-122.624-15.68l-104.704 104.576a64 64 0 0 1-90.496-90.496l633.6-633.6a64 64 0 0 1 90.496 0z m-214.656 305.088l-201.728 201.792A192 192 0 0 0 704 512l-0.384-10.048zM512 192c42.112 0 83.328 5.312 123.712 16L523.2 320.32A192 192 0 0 0 320 512l0.32 11.2-164.224 164.288C107.136 644.8 59.776 592.64 13.952 531.072a31.936 31.936 0 0 1-3.136-33.088l3.136-5.12 14.976-19.712C174.208 285.696 335.296 192 512 192z"
        fill={getIconColor(color, 0, '#979BBA')}
      />
    </Svg>
  );
};

Iconhidden.defaultProps = {
  size: 18,
};

export default Iconhidden;
