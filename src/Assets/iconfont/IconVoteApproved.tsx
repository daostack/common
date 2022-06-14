/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconVoteApproved: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 16 16" fill="none" width={size} height={size} {...rest}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" fill="#6EE569" />
      <Path d="M7.62128 10.7263C7.25857 11.0912 6.67005 11.0912 6.30752 10.7263L4.27203 8.67868C3.90932 8.31398 3.90932 7.72194 4.27203 7.35724C4.63456 6.99237 5.22308 6.99237 5.58579 7.35724L6.79854 8.57707C6.89009 8.669 7.03871 8.669 7.13043 8.57707L10.4142 5.27366C10.7767 4.90878 11.3653 4.90878 11.728 5.27366C11.9021 5.44887 12 5.6866 12 5.93437C12 6.18214 11.9021 6.41988 11.728 6.59509L7.62128 10.7263Z" fill="white" />
    </Svg>
  );
};
