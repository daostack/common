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

export const Iconphone: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 41 40" width={size} height={size} {...rest}>
      <Path
      fill={getIconColor(color, 0, "#001A36")}
      d="M18.184 22.318c-2.59-2.59-3.175-5.18-3.307-6.219a.93.93 0 0 1 .267-.778l2.096-2.096a.936.936 0 0 0 .132-1.158l-3.337-5.182a.936.936 0 0 0-1.213-.342L7.464 9.067a.93.93 0 0 0-.515.93c.281 2.667 1.444 9.223 7.887 15.667 6.443 6.444 12.999 7.606 15.668 7.887a.93.93 0 0 0 .93-.515l2.523-5.358a.936.936 0 0 0-.34-1.21l-5.182-3.337a.936.936 0 0 0-1.158.13l-2.096 2.097a.93.93 0 0 1-.778.267c-1.038-.132-3.628-.717-6.219-3.307z"/>
    </Svg>
  );
};

Iconphone.defaultProps = {
  size: 18,
};

export default Iconphone;
