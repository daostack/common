/* tslint:disable */
/* eslint-disable */

import React, {FunctionComponent} from 'react';
import {ViewProps} from 'react-native';
import {Svg, GProps, Path} from 'react-native-svg';
import {getIconColor} from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconAbstained: FunctionComponent<Props> = ({
  size,
  color,
  ...rest
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...rest}>
      <Path
        d="M16 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 4c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z"
        fill={getIconColor(color, 0, '#979BBA')}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
};

IconAbstained.defaultProps = {
  size: 18,
};

export default IconAbstained;
