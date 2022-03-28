/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import {ViewProps} from 'react-native';
import Animated, {AnimateProps} from 'react-native-reanimated';
import { Svg, GProps, Path, PathProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
  animatedIconStyle?: Partial<AnimateProps<PathProps>>;
}

export const AnimatedPath = Animated.createAnimatedComponent(Path);

export const IconmenuAnimated: FunctionComponent<Props> = ({ size, color, animatedIconStyle, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <AnimatedPath
        d="M512 256A128 128 0 1 1 511.936 0.064 128 128 0 0 1 512 256z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 640z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 1024z"
        animatedProps={animatedIconStyle}
      />
    </Svg>
  );
};

IconmenuAnimated.defaultProps = {
  size: 18,
};

export default IconmenuAnimated;
