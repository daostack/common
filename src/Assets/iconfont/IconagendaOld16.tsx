/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconagendaOld16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M895.488 691.456h-59.712V197.12c0-73.728-57.344-133.12-128.512-133.12H186.24c-2.304 0-4.608 0-6.912 1.216-71.168 8.32-121.6 73.6-114.752 147.328 6.848 61.76 53.952 111.68 114.752 118.848 2.304 0 4.608 1.152 6.848 1.152h6.912v495.552C194.304 900.608 251.648 960 321.664 960h573.824C966.592 960 1024 900.608 1024 826.88c1.152-76.032-57.408-135.424-128.512-135.424zM194.368 256v-1.216C157.44 254.784 128 226.752 128 191.424 128 155.968 157.376 128 194.368 128H640a133.632 133.632 0 0 0 0 128H194.368zM704 704H256v-64h448v64z m0-128H256V512h448v64z m0-128H256V384h448v64z m192 448c-35.712 0-64-28.288-64-64v-64h64c35.712 0 64 28.288 64 64s-28.288 64-64 64z"
        fill={getIconColor(color, 0, '#D5DEE4')}
      />
    </Svg>
  );
};

IconagendaOld16.defaultProps = {
  size: 18,
};

export default IconagendaOld16;
