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

export const Iconclcok: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 81.472a366.528 366.528 0 1 0 0 733.056A366.528 366.528 0 0 0 512 145.472z m0 122.176c20.864 0 38.08 15.68 40.448 35.968l0.256 4.736v184.576l107.52 89.6c16 13.312 19.2 36.224 8.32 53.248l-3.072 4.096a40.768 40.768 0 0 1-53.248 8.32l-4.096-3.072-122.24-101.824a40.768 40.768 0 0 1-14.272-26.176L471.296 512V308.352c0-22.464 18.24-40.704 40.704-40.704z"
        fill={getIconColor(color, 0, '#FFAE26')}
      />
    </Svg>
  );
};

Iconclcok.defaultProps = {
  size: 18,
};

export default Iconclcok;
