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

export const IconcreateProposal: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M288 608a32 32 0 0 1 32 32v127.968L448 768a32 32 0 0 1 0 64l-128.032-0.032L320 960a32 32 0 0 1-64 0l-0.032-128.032L128 832a32 32 0 0 1 0-64l128-0.032V640a32 32 0 0 1 32-32z m252.8 123.616l17.248 0.192c59.712 1.376 110.752 9.6 119.072 16.768l2.272 2.56c12.768 17.6 9.184 78.144-5.088 113.312L672 869.76h-0.256l-0.608 0.192c-6.4 2.304-16.128 4.544-28.32 6.432-22.08 3.456-50.624 5.536-81.248 5.984l-13.216 0.096c-27.84 0-54.88-1.44-77.92-3.712a97.6 97.6 0 0 0 43.2-81.472c0-24.48-8.832-46.848-23.488-63.968a747.456 747.456 0 0 1 50.656-1.696zM537.472 128C682.464 128 800 246.208 800 392a264.256 264.256 0 0 1-137.12 232.064c-10.176 5.568-7.36 21.76-2.464 42.336a585.632 585.632 0 0 0-85.376-9.472V495.04a75.52 75.52 0 0 0 37.44-65.312 75.2 75.2 0 0 0-74.976-75.456 75.2 75.2 0 0 0-75.008 75.456c0 25.76 12.832 48.512 32.448 62.112l5.056 3.2v162.144c-24.736 1.28-48.512 3.808-69.728 7.488l-13.248 2.528 2.4-9.728c3.552-15.52 4.352-27.264-3.936-31.616a264.224 264.224 0 0 1-140.48-233.856C274.976 246.208 392.48 128 537.472 128z"
        fill={getIconColor(color, 0, '#979BBA')}
      />
    </Svg>
  );
};

IconcreateProposal.defaultProps = {
  size: 18,
};

export default IconcreateProposal;
