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

export const IconcheckIcon: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M160 85.418667L856.661333 85.333333c28.544 0 38.869333 2.986667 49.322667 8.533334 10.410667 5.589333 18.602667 13.781333 24.192 24.192 5.546667 10.453333 8.533333 20.778667 8.533333 49.322666v689.237334c0 28.544-2.986667 38.869333-8.533333 49.322666a58.496 58.496 0 0 1-24.192 24.192c-10.453333 5.546667-20.778667 8.533333-49.322667 8.533334H167.381333c-28.544 0-38.869333-2.986667-49.322666-8.533334a58.496 58.496 0 0 1-24.192-24.192c-5.034667-9.514667-7.978667-18.901333-8.448-41.984L85.333333 167.381333c0-28.544 2.986667-38.869333 8.533334-49.322666 5.589333-10.410667 13.781333-18.602667 24.192-24.192 9.514667-5.034667 18.901333-7.978667 41.984-8.448zM853.333333 170.666667H170.666667v682.666666h682.666666V170.666667z"
        fill={getIconColor(color, 0, '#979BBA')}
      />
    </Svg>
  );
};

IconcheckIcon.defaultProps = {
  size: 18,
};

export default IconcheckIcon;
