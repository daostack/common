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

export const IcondaoGeneralInfo16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1088 1024" width={size} height={size} {...rest}>
      <Path
        d="M512.128 128c58.944 0 106.752 45.888 106.752 102.4v66.176l21.696 0.832c88.96 3.584 159.936 11.392 171.84 23.232 12.672 12.608 18.304 85.632 19.584 174.656h-37.632c-57.6 0-104.32 44.8-104.32 100.16 0 53.248 43.136 96.704 97.664 99.968l6.656 0.256h34.432l-1.408 31.296c-3.84 74.368-9.408 132.224-14.976 143.36-17.216 34.24-560.192 34.24-594.56 0-34.432-34.24-34.432-515.456 0-549.696 12.544-12.544 91.264-20.48 187.52-23.872V230.464C405.44 173.888 453.248 128 512.192 128z"
        fill={getIconColor(color, 0, '#D5DEE4')}
      />
    </Svg>
  );
};

IcondaoGeneralInfo16.defaultProps = {
  size: 18,
};

export default IcondaoGeneralInfo16;
