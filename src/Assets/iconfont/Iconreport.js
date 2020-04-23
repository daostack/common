/* eslint-disable */

import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {getIconColor} from './helper';

export const Iconreport = ({size, color, ...rest}) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M874.496 150.4l-0.448-0.448A512 512 0 0 0 149.568 873.6l0.384 0.448A512 512 0 0 0 874.496 150.464z m-664.192 59.904a426.752 426.752 0 0 1 571.776-28.672l-600.448 600.384a426.688 426.688 0 0 1 28.672-571.712z m603.392 603.392a426.624 426.624 0 0 1-571.712 28.672l600.384-600.384a426.688 426.688 0 0 1-28.672 571.712z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconreport.defaultProps = {
  size: 18,
};

export default Iconreport;
