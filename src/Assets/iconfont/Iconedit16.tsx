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

export const Iconedit16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M614.784 222.4l186.688 186.688-550.784 550.784H64v-186.688l550.784-550.784z m143.872-143.872a49.92 49.92 0 0 1 70.4 0l116.288 116.288a49.92 49.92 0 0 1 0 70.4l-91.136 91.072-186.624-186.624z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconedit16.defaultProps = {
  size: 18,
};

export default Iconedit16;
