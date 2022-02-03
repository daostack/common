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

export const IconcheckMark: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M479.701333 744.661333a78.933333 78.933333 0 0 1-112.128 0l-173.653333-174.762666a80.042667 80.042667 0 0 1 0-112.768 78.933333 78.933333 0 0 1 112.085333 0l103.466667 104.106666c7.808 7.850667 20.48 7.850667 28.330667 0l280.192-281.898666a78.933333 78.933333 0 0 1 112.128 0 80.042667 80.042667 0 0 1 0 112.768l-350.421334 352.554666z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

IconcheckMark.defaultProps = {
  size: 18,
};

export default IconcheckMark;
