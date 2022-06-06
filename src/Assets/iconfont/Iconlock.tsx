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

export const Iconlock: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 13 15" width={size} height={size} {...rest}>
      <Path
        d="M11.6071 6.77388H10.9107V4.8968C10.9107 2.71209 8.9317 0.934082 6.5 0.934082C4.0683 0.934082 2.08929 2.71209 2.08929 4.8968V6.77388H1.39286C0.623884 6.77388 0 7.3344 0 8.02527V13.0308C0 13.7217 0.623884 14.2822 1.39286 14.2822H11.6071C12.3761 14.2822 13 13.7217 13 13.0308V8.02527C13 7.3344 12.3761 6.77388 11.6071 6.77388ZM8.58929 6.77388H4.41071V4.8968C4.41071 3.8618 5.34799 3.01973 6.5 3.01973C7.65201 3.01973 8.58929 3.8618 8.58929 4.8968V6.77388Z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconlock.defaultProps = {
  size: 18,
};

export default Iconlock;
