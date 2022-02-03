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

export const Iconwallet216: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M806.736 102.4c54.592 24.064 80.192 87.168 78.592 153.088l19.648 2.176c34.24 3.968 58.24 8.192 67.84 12.48 21.632 9.536 36.416 71.68 44.352 154.176a187.328 187.328 0 0 0-46.72-5.952h-231.04c-102.144 0-184.896 81.92-184.896 183.04 0 100.992 82.752 182.912 184.832 182.912h231.04c14.72 0 28.928-1.664 42.624-4.864-8.512 67.584-21.888 119.296-40.192 135.424-68.224 60.16-853.376 60.16-921.6 0C-17.072 854.72-17.072 330.24 51.216 270.08c11.392-10.048 42.88-17.6 87.744-23.04a199.296 199.296 0 0 1 66.304-137.088c75.52-66.56 497.472-53.504 601.472-7.68z m163.648 407.488c19.648 0 37.888 6.08 52.864 16.448 1.408 49.856 0.896 101.888-1.6 151.168-14.72 9.728-32.32 15.36-51.2 15.36h-231.04c-51.072 0-92.48-40.96-92.48-91.52 0-50.56 41.408-91.52 92.416-91.52h231.04zM266.704 178.368a105.984 105.984 0 0 0-33.792 61.056c162.816-8.448 397.888-2.624 560.128 8.384 0-29.44-8.32-55.04-23.936-61.888-74.432-32.768-460.224-44.8-502.4-7.616z"
        fill={getIconColor(color, 0, '#D5DEE4')}
      />
    </Svg>
  );
};

Iconwallet216.defaultProps = {
  size: 18,
};

export default Iconwallet216;
