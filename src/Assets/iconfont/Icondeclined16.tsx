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

export const Icondeclined16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 64c247.04 0 448 200.96 448 448s-200.96 448-448 448-448-200.96-448-448 200.96-448 448-448z m0 56C295.872 120 120 295.872 120 512S295.872 904 512 904 904 728.128 904 512 728.128 120 512 120z m158.464 233.6c10.88 10.88 10.88 28.608 0 39.552L551.616 512l118.784 118.784a28.032 28.032 0 1 1-39.616 39.616L512 551.552l-118.784 118.848a28.16 28.16 0 0 1-39.616 0 28.16 28.16 0 0 1 0-39.68L472.384 512 353.6 393.216a28.032 28.032 0 1 1 39.616-39.616L512 472.384l118.848-118.848a28.16 28.16 0 0 1 39.616 0z"
        fill={getIconColor(color, 0, '#FF603E')}
      />
    </Svg>
  );
};

Icondeclined16.defaultProps = {
  size: 18,
};

export default Icondeclined16;
