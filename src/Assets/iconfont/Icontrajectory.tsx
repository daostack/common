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

export const Icontrajectory: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M950.08 239.936l-167.68-167.744a27.904 27.904 0 1 0-47.68 19.776v84.992a336.832 336.832 0 0 0-223.552 113.088 336.832 336.832 0 0 0-223.616-113.088V91.968a27.84 27.84 0 0 0-47.68-19.776l-167.68 167.68a27.968 27.968 0 0 0 0 39.488l167.68 167.68a27.52 27.52 0 0 0 30.464 6.016 27.776 27.776 0 0 0 17.28-25.728V345.856a167.744 167.744 0 0 1 139.648 165.312v419.2c0 15.36 12.48 27.904 27.904 27.904H567.04c15.36 0 27.968-12.48 27.968-27.968v-419.2c0-82.88 60.48-152 139.712-165.248v81.472c0 11.264 6.784 21.504 17.28 25.792 10.368 4.48 22.4 1.92 30.464-6.016l167.68-167.68a27.968 27.968 0 0 0 0-39.488z m-159.488 119.936V315.52a27.968 27.968 0 0 0-27.968-27.904 223.744 223.744 0 0 0-223.552 223.552V902.4H483.2V511.168a223.744 223.744 0 0 0-223.552-223.552 27.968 27.968 0 0 0-27.968 27.904v44.352L131.456 259.648 231.68 159.36v44.352c0 15.36 12.544 27.904 27.968 27.904a280.32 280.32 0 0 1 228.608 119.488c10.56 14.912 35.264 14.912 45.76 0a280.384 280.384 0 0 1 228.608-119.488 27.968 27.968 0 0 0 27.968-27.904V159.36l100.224 100.224-100.224 100.224z"
        fill={getIconColor(color, 0, '#22A5FA')}
      />
    </Svg>
  );
};

Icontrajectory.defaultProps = {
  size: 18,
};

export default Icontrajectory;
