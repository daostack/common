/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const Iconedit = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M609.962667 236.245333l177.792 177.792L263.125333 938.666667H85.333333v-177.792L609.962667 236.245333z m137.045333-137.045333a47.530667 47.530667 0 0 1 67.072 0l110.72 110.72a47.530667 47.530667 0 0 1 0 67.072L837.973333 363.776l-177.792-177.792z"
        fill={getIconColor(color, 0, '#3CC7E1')}
      />
    </Svg>
  );
};

Iconedit.defaultProps = {
  size: 18,
};

export default Iconedit;
