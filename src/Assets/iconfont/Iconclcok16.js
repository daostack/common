/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const Iconclcok16 = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 64c247.04 0 448 200.96 448 448s-200.96 448-448 448-448-200.96-448-448 200.96-448 448-448z m0 74.688C306.176 138.688 138.688 306.176 138.688 512S306.176 885.312 512 885.312 885.312 717.824 885.312 512 717.824 138.688 512 138.688z m23.36 139.968V502.4l133.12 133.12-32.96 33.024-146.88-146.816V278.656h46.72z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconclcok16.defaultProps = {
  size: 18,
};

export default Iconclcok16;
