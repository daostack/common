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

export const IconpersonalInfo16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 512a512 512 0 0 1 512 512H0a512 512 0 0 1 512-512z m0-512c141.44 0 256 114.56 256 256s-114.56 256-256 256-256-114.56-256-256 114.56-256 256-256z"
        fill={getIconColor(color, 0, '#D5DEE4')}
      />
    </Svg>
  );
};

IconpersonalInfo16.defaultProps = {
  size: 18,
};

export default IconpersonalInfo16;
