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

export const Iconwallet16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M677.184 66.752c17.92 4.8 33.344 15.36 44.16 30.208l5.12 7.744 116.736 203.968c39.04 3.2 70.4 33.6 74.432 72.32l0.448 8.32v61.056a20.48 20.48 0 0 1-15.68 19.84l-4.672 0.512h-142.336a162.816 162.816 0 0 0-162.688 162.688 162.88 162.88 0 0 0 152 162.304l10.688 0.384h142.336c9.6 0 17.728 6.656 19.84 15.616l0.512 4.672v60.992c0 42.112-32.064 76.8-73.024 80.96l-8.32 0.384H145.28c-42.048 0-76.8-32-80.896-72.96L64 877.44V389.312c0-42.048 32.064-76.8 73.024-80.896l8.32-0.448H215.68L616 74.88c18.624-10.88 40.384-13.76 61.184-8.192z m220.544 444.608c31.232 0 57.088 23.616 60.608 53.888l0.384 7.104v122.048a61.12 61.12 0 0 1-53.888 60.608l-7.04 0.384h-142.4a122.112 122.112 0 0 1-121.984-121.984c0-64.128 49.6-116.8 112.448-121.664l9.536-0.384h142.336z m-142.336 81.344a40.768 40.768 0 0 0-40.704 40.704 40.704 40.704 0 1 0 40.704-40.704z m-3.776-362.048L618.688 308.032h177.28l-44.352-77.44z m-109.44-123.328l-5.696 2.752-339.968 197.952h80.256l314.368-183.04a39.808 39.808 0 0 0-48.96-17.664z"
        fill={getIconColor(color, 0, '#D5DEE4')}
      />
    </Svg>
  );
};

Iconwallet16.defaultProps = {
  size: 18,
};

export default Iconwallet16;
