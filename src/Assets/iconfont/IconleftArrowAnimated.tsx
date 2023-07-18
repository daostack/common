/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import {ViewProps} from 'react-native';
import { Svg, GProps, Path, PathProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}


export const IconleftArrowAnimated: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M489.824 512l165.28 160.416c22.528 21.856 22.528 57.6 0 79.456a57.664 57.664 0 0 1-80 0l-206.208-200.16a55.072 55.072 0 0 1 0-79.424l206.208-200.128a57.6 57.6 0 0 1 80 0c22.528 21.856 22.528 57.6 0 79.456L489.824 512z"
      />
    </Svg>
  );
};

IconleftArrowAnimated.defaultProps = {
  size: 18,
};

export default IconleftArrowAnimated;
