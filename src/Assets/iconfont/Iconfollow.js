/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const Iconfollow = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M787.700512 0H236.299488C200.119662 0 170.680888 28.926795 170.680888 64.466647v920.793634c0 14.079413 7.722345 26.96421 20.223158 33.790592a39.678347 39.678347 0 0 0 39.849006-0.853298l281.332278-170.659556 281.246948 169.379609c12.159493 7.381026 27.433524 7.67968 39.849006 0.810633a38.611725 38.611725 0 0 0 20.137828-33.747927V64.466647C853.319112 28.926795 823.880338 0 787.700512 0z m-13.140785 914.863214l-241.952586-145.700596a39.977001 39.977001 0 0 0-41.299612 0.042665l-241.867256 146.724553V77.394109h525.119454v837.51177z"
        fill={getIconColor(color, 0, '#3CC7E1')}
      />
    </Svg>
  );
};

Iconfollow.defaultProps = {
  size: 18,
};

export default Iconfollow;
