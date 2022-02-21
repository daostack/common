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

export const Iconshow: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 192c182.784 0 348.8 100.288 498.048 300.928 7.232 9.664 8.32 22.464 3.136 33.088l-3.136 5.12-14.976 19.712C849.792 738.304 688.704 832 512 832 329.216 832 163.2 731.712 13.952 531.072a31.936 31.936 0 0 1-3.136-33.088l3.136-5.12 14.976-19.712C174.208 285.696 335.296 192 512 192z m0 128a192 192 0 1 0 0 384 192 192 0 0 0 0-384z m0 64a128 128 0 1 1 0.064 255.936A128 128 0 0 1 512 384z"
        fill={getIconColor(color, 0, '#979BBA')}
      />
    </Svg>
  );
};

Iconshow.defaultProps = {
  size: 18,
};

export default Iconshow;
