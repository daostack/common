/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path, Circle, G } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconStandard: FunctionComponent<Props> = ({ size, color = '#979BBA', ...rest }) => {
  return (
    <Svg viewBox="0 0 34 30" width={52} height={32} {...rest}>
    <Circle cx="8.5" cy="14" r="8" fill={color}/>
      <Path
        d="M12.6066 12.817L10.0953 12.452L8.9726 10.1761C8.94194 10.1138 8.8915 10.0633 8.82918 10.0326C8.6729 9.95549 8.48299 10.0198 8.40485 10.1761L7.28219 12.452L4.77081 12.817C4.70157 12.8269 4.63826 12.8596 4.5898 12.909C4.5312 12.9692 4.49892 13.0503 4.50003 13.1343C4.50114 13.2183 4.53556 13.2984 4.59573 13.3571L6.41275 15.1286L5.98347 17.6301C5.97341 17.6883 5.97984 17.7481 6.00206 17.8029C6.02427 17.8576 6.06138 17.905 6.10916 17.9397C6.15694 17.9744 6.21349 17.995 6.27239 17.9992C6.3313 18.0034 6.3902 17.991 6.44243 17.9634L8.68872 16.7824L10.935 17.9634C10.9963 17.9961 11.0676 18.007 11.1358 17.9951C11.3079 17.9654 11.4237 17.8022 11.394 17.6301L10.9647 15.1286L12.7817 13.3571C12.8312 13.3086 12.8638 13.2453 12.8737 13.1761C12.9004 13.003 12.7797 12.8427 12.6066 12.817Z"
        fill="white"
      />
    </Svg>
  );
};

IconStandard.defaultProps = {
  size: 18,
};

export default IconStandard;