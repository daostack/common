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

export const IconcheckIconSelected: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M167.381333 85.333333h689.237334c28.544 0 38.869333 2.986667 49.322666 8.533334 10.410667 5.589333 18.602667 13.781333 24.192 24.192 5.546667 10.453333 8.533333 20.778667 8.533334 49.322666v689.237334c0 28.544-2.986667 38.869333-8.533334 49.322666a58.496 58.496 0 0 1-24.192 24.192c-10.453333 5.546667-20.778667 8.533333-49.322666 8.533334H167.381333c-28.544 0-38.869333-2.986667-49.322666-8.533334a58.496 58.496 0 0 1-24.192-24.192c-5.546667-10.453333-8.533333-20.778667-8.533334-49.322666V167.381333c0-28.544 2.986667-38.869333 8.533334-49.322666 5.589333-10.410667 13.781333-18.602667 24.192-24.192 10.453333-5.546667 20.778667-8.533333 49.322666-8.533334z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
      <Path
        d="M495.829333 628.309333a39.424 39.424 0 0 1-56.021333 0L352.938667 541.013333a40.064 40.064 0 0 1 0-56.405333 39.466667 39.466667 0 0 1 56.064 0l51.754666 52.053333c3.882667 3.925333 10.24 3.925333 14.122667 0l140.117333-140.970666a39.466667 39.466667 0 0 1 56.064 0 39.978667 39.978667 0 0 1 0 56.362666l-175.232 176.256z"
        fill={getIconColor(color, 1, '#FFFFFF')}
      />
    </Svg>
  );
};

IconcheckIconSelected.defaultProps = {
  size: 18,
};

export default IconcheckIconSelected;
