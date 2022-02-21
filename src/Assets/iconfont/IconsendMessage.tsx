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

export const IconsendMessage: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M358.208 146.784l530.848 322.112 0.224 0.128c15.968 9.92 25.472 27.072 25.472 45.856 0 18.816-9.504 35.936-25.472 45.856l-0.224 0.16-530.848 322.08a128.704 128.704 0 0 1-158.144-19.072l-56.288-56.288a54.08 54.08 0 0 1-1.6-74.688l154.624-218.048-154.624-218.048a54.08 54.08 0 0 1 1.6-74.688l56.32-56.288a128.672 128.672 0 0 1 158.112-19.072zM234.016 199.808L177.728 256.096a6.016 6.016 0 0 0 0 8.48c0.96 0.96 1.824 1.984 2.624 3.072l158.272 223.232h327.04a24 24 0 0 1 0 48h-327.04l-158.272 223.232a26.912 26.912 0 0 1-2.624 3.104 6.016 6.016 0 0 0 0 8.48l56.288 56.288c26.464 26.464 67.296 31.36 99.296 11.968L864 519.936a5.728 5.728 0 0 0 2.752-5.056 5.76 5.76 0 0 0-2.752-5.056L333.312 187.84a80.8 80.8 0 0 0-99.296 11.968z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

IconsendMessage.defaultProps = {
  size: 18,
};

export default IconsendMessage;
