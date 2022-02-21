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

export const IconupArrow: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 489.824l-160.41600001 165.28c-21.856 22.528-57.6 22.528-79.45599999 0a57.664 57.664 0 0 1 0-80l200.16-206.208a55.072 55.072 0 0 1 79.424 0l200.128 206.208a57.6 57.6 0 0 1-1e-8 80c-21.856 22.528-57.6 22.528-79.45599999 0L512 489.824z"
        fill={getIconColor(color, 0, '#001A36')}
      />
    </Svg>
  );
};

IconupArrow.defaultProps = {
  size: 18,
};

export default IconupArrow;
