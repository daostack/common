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

export const IconpersonalInfo241: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 512c282.752 0 512 229.248 512 512H0c0-282.752 229.248-512 512-512z m0-512a256 256 0 1 1 0 512 256 256 0 0 1 0-512z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

IconpersonalInfo241.defaultProps = {
  size: 18,
};

export default IconpersonalInfo241;
