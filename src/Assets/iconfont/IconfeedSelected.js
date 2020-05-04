/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const IconfeedSelected = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m256 128H256v597.333334h512V213.333333z m-42.666667 42.666667v512H298.666667V256h426.666666z m-85.333333 426.666667H384v42.666666h256v-42.666666z m0-85.333334H384v42.666667h256v-42.666667z m0-85.333333H384v42.666667h256v-42.666667z m0-213.333333H384v170.666666h256V298.666667z m-42.666667 42.666666v85.333334h-170.666666V341.333333h170.666666z"
        fill={getIconColor(color, 0, '#3CC7E1')}
      />
    </Svg>
  );
};

IconfeedSelected.defaultProps = {
  size: 18,
};

export default IconfeedSelected;
