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

export const Iconwarning: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M513.728 0A513.344 513.344 0 0 0 0 513.728C0 794.304 229.696 1024 513.728 1024 794.304 1024 1024 794.304 1024 513.728 1024 229.76 794.304 0 513.728 0z m0 805.312a52.032 52.032 0 1 1 0-104 52.032 52.032 0 0 1 0 104z m52.096-263.808a52.096 52.096 0 0 1-104.128 0V267.264a52.032 52.032 0 0 1 104.128 0v274.24z"
        fill={getIconColor(color, 0, '#EF5456')}
      />
    </Svg>
  );
};

Iconwarning.defaultProps = {
  size: 18,
};

export default Iconwarning;
