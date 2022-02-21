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

export const Icongoogle: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M788.48 518.56c0-20.448-1.824-40.064-5.248-58.912H512v111.392h155.008a132.512 132.512 0 0 1-57.472 86.912v72.288h93.056c54.464-50.144 85.888-124 85.888-211.68z"
        fill={getIconColor(color, 0, '#4285F4')}
      />
      <Path
        d="M512 800c77.76 0 142.944-25.792 190.592-69.76l-93.056-72.288c-25.792 17.28-58.784 27.52-97.536 27.52-75.008 0-138.496-50.688-161.152-118.752H254.624v74.624A287.936 287.936 0 0 0 512 800z"
        fill={getIconColor(color, 1, '#34A853')}
      />
      <Path
        d="M350.848 566.72c-5.76-17.28-9.024-35.744-9.024-54.72s3.264-37.44 9.024-54.72v-74.624H254.624a288.16 288.16 0 0 0 0 258.688l96.224-74.624z"
        fill={getIconColor(color, 2, '#FBBC05')}
      />
      <Path
        d="M512 338.56c42.272 0 80.256 14.528 110.08 43.04l82.624-82.56C654.816 252.512 589.632 224 512 224a287.936 287.936 0 0 0-257.376 158.656l96.224 74.624c22.656-68.064 86.144-118.72 161.152-118.72z"
        fill={getIconColor(color, 3, '#EA4335')}
      />
    </Svg>
  );
};

Icongoogle.defaultProps = {
  size: 18,
};

export default Icongoogle;
