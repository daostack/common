/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const Iconapproved = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 0c282.304 0 512 229.696 512 512s-229.696 512-512 512-512-229.696-512-512 229.696-512 512-512z m0 64C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448-200.96-448-448-448z m252.032 286.72a32 32 0 0 1 0 45.248L486.72 673.28a32.192 32.192 0 0 1-45.312 0L302.72 534.592a32 32 0 0 1 45.248-45.248l116.096 116.032 254.72-254.72a32 32 0 0 1 45.248 0z"
        fill={getIconColor(color, 0, '#6EE569')}
      />
    </Svg>
  );
};

Iconapproved.defaultProps = {
  size: 18,
};

export default Iconapproved;
