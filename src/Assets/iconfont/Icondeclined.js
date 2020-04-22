/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const Icondeclined = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 0c282.304 0 512 229.696 512 512s-229.696 512-512 512-512-229.696-512-512 229.696-512 512-512z m0 64C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448-200.96-448-448-448z m181.12 266.88a32.128 32.128 0 0 1 0 45.312L557.184 512l135.808 135.744a32.128 32.128 0 0 1-22.656 54.656 32 32 0 0 1-22.656-9.408L512 557.248l-135.68 135.744a32.32 32.32 0 0 1-22.72 9.408 32 32 0 0 1-22.592-54.656l135.68-135.808-135.68-135.68a32 32 0 1 1 45.248-45.312l135.68 135.744 135.872-135.744a31.936 31.936 0 0 1 45.248 0z"
        fill={getIconColor(color, 0, '#FF603E')}
      />
    </Svg>
  );
};

Icondeclined.defaultProps = {
  size: 18,
};

export default Icondeclined;
