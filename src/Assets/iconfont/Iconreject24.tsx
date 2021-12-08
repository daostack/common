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

export const Iconreject24: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M228.053333 128c25.6 0 51.2 9.813333 70.741334 29.312L512 370.517333l213.248-213.205333A99.541333 99.541333 0 0 1 795.946667 128c25.6 0 51.2 9.770667 70.741333 29.312 19.541333 19.541333 29.312 45.141333 29.312 70.741333 0 25.6-9.770667 51.2-29.312 70.741334L653.397333 512l213.290667 213.248c19.541333 19.541333 29.312 45.141333 29.312 70.741333A99.84 99.84 0 0 1 795.904 896a99.413333 99.413333 0 0 1-70.698667-29.312l-213.248-213.248-213.248 213.333333a99.925333 99.925333 0 0 1-141.397333-0.085333A99.712 99.712 0 0 1 128 795.946667c0-25.6 9.770667-51.2 29.312-70.741334l213.162667-213.248-213.162667-213.162666A99.84 99.84 0 0 1 128 228.053333 99.925333 99.925333 0 0 1 228.053333 128z"
        fill={getIconColor(color, 0, '#FF603E')}
      />
    </Svg>
  );
};

Iconreject24.defaultProps = {
  size: 18,
};

export default Iconreject24;
