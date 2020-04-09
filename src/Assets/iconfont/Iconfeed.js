/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const Iconfeed = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M128 938.666667V128h768v810.666667H128zM853.333333 170.666667H170.666667v725.333333h42.666666v-128h597.333334v128h42.666666V170.666667z m-85.333333 640H256v85.333333h512v-85.333333z m42.666667-256v170.666666H213.333333v-170.666666h597.333334z m-42.666667 34.133333H256v102.4h512v-102.4zM810.666667 341.333333v170.666667H213.333333V341.333333h597.333334z m-42.666667 34.133334H256v102.4h512V375.466667zM810.666667 213.333333v85.333334H213.333333V213.333333h597.333334z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconfeed.defaultProps = {
  size: 18,
};

export default Iconfeed;
