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

export const Iconfacebook: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} {...rest}>
      <Path
      fill={getIconColor(color, 0, "#0077FB")}
      d="M12 2C6.477 2 2 6.496 2 12.042c0 4.974 3.605 9.093 8.332 9.89v-7.795H7.92V11.33h2.412V9.263c0-2.4 1.46-3.708 3.593-3.708 1.021 0 1.899.076 2.154.11v2.508l-1.48.001c-1.159 0-1.383.553-1.383 1.365v1.791h2.767l-.36 2.805h-2.407V22C18.164 21.395 22 17.171 22 12.039 22 6.496 17.523 2 12 2z"/>
    </Svg>
  );
};

Iconfacebook.defaultProps = {
  size: 18,
};

export default Iconfacebook;
