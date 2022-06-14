/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconVoteDeclined: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 16 16" fill="none" width={size} height={size} {...rest}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" fill="#FF603E" />
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M5.29392 4.22749C4.99792 3.92417 4.51801 3.92417 4.222 4.22749C3.926 4.53081 3.926 5.02258 4.222 5.3259L6.93445 8.10538L4.42767 10.6741C4.13167 10.9774 4.13167 11.4692 4.42767 11.7725C4.72368 12.0758 5.20359 12.0758 5.4996 11.7725L8.00637 9.20379L10.5004 11.7594C10.7964 12.0628 11.2763 12.0628 11.5723 11.7594C11.8683 11.4561 11.8683 10.9644 11.5723 10.661L9.07829 8.10538L11.778 5.33897C12.074 5.03565 12.074 4.54387 11.778 4.24056C11.482 3.93724 11.0021 3.93724 10.7061 4.24056L8.00637 7.00697L5.29392 4.22749Z" fill="white" />
    </Svg>
  );
};
