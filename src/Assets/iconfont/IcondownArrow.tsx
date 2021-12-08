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

export const IcondownArrow: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 534.176l160.41600001-165.28c21.856-22.528 57.6-22.528 79.45599999 0a57.664 57.664 0 0 1 0 80l-200.16 206.208a55.072 55.072 0 0 1-79.424 0l-200.128-206.208a57.6 57.6 0 0 1 1e-8-80c21.856-22.528 57.6-22.528 79.45599999 0L512 534.176z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

IcondownArrow.defaultProps = {
  size: 18,
};

export default IcondownArrow;
