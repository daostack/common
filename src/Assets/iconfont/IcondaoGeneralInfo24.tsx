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

export const IcondaoGeneralInfo24: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512.170667 42.666667c70.698667 0 128.042667 58.624 128.042666 130.901333v84.48l26.026667 1.066667c106.88 4.650667 191.957333 14.506667 206.250667 29.696 15.189333 16.085333 22.016 109.44 23.509333 223.146666L850.773333 512c-69.12 0-125.184 57.301333-125.184 128 0 67.968 51.84 123.562667 117.333334 127.744l7.893333 0.256h41.386667l-1.749334 39.978667c-4.608 95.061333-11.264 169.045333-17.92 183.210666-20.693333 43.733333-672.298667 43.733333-713.557333 0-41.301333-43.776-41.301333-658.602667 0-702.378666 15.104-16.042667 109.525333-26.197333 225.109333-30.464V173.568C384.128 101.290667 441.472 42.666667 512.213333 42.666667z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

IcondaoGeneralInfo24.defaultProps = {
  size: 18,
};

export default IcondaoGeneralInfo24;
