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

export const Iconapproved16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 64c247.04 0 448 200.96 448 448s-200.96 448-448 448-448-200.96-448-448 200.96-448 448-448z m0 56C295.872 120 120 295.872 120 512S295.872 904 512 904 904 728.128 904 512 728.128 120 512 120z m220.544 250.88c10.88 10.88 10.88 28.608 0 39.552l-242.688 242.688a27.904 27.904 0 0 1-39.68 0L328.96 531.776a28.032 28.032 0 1 1 39.616-39.616l101.504 101.568 222.912-222.912a28.16 28.16 0 0 1 39.616 0z"
        fill={getIconColor(color, 0, '#6EE569')}
      />
    </Svg>
  );
};

Iconapproved16.defaultProps = {
  size: 18,
};

export default Iconapproved16;
