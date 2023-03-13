/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import Animated, {AnimateProps} from 'react-native-reanimated';
import { Svg, GProps, Path, PathProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
  animatedIconStyle?: Partial<AnimateProps<PathProps>>;
}

export const AnimatedPath = Animated.createAnimatedComponent(Path);

export const IconmenuHorizontal: FunctionComponent<Props> = ({ size, color, animatedIconStyle, ...rest }) => {
  return (
    <Svg viewBox="0 0 24 6" width={size} height={size} {...rest}>
      <AnimatedPath
        d="M18 3C18 1.34315 19.3431 0 21 0C22.6569 0 24 1.34315 24 3C24 4.65685 22.6569 6 21 6C19.3431 6 18 4.65685 18 3ZM9 3C9 1.34315 10.3431 0 12 0C13.6569 0 15 1.34315 15 3C15 4.65685 13.6569 6 12 6C10.3431 6 9 4.65685 9 3ZM0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z"
        animatedProps={animatedIconStyle}
      />
    </Svg>
  );
};

IconmenuHorizontal.defaultProps = {
  size: 18,
};

export default IconmenuHorizontal;
