/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import {ViewProps} from 'react-native';
import { Svg, GProps, Path, PathProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconmenuAnimated: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 256A128 128 0 1 1 511.936 0.064 128 128 0 0 1 512 256z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 640z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 1024z"
      />
    </Svg>
  );
};

IconmenuAnimated.defaultProps = {
  size: 18,
};

export default IconmenuAnimated;
