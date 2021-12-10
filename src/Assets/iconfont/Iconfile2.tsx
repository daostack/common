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

export const Iconfile2: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M627.008 0H243.456C180.864 0 129.92 53.824 129.92 120v784c0 66.176 50.944 120 113.536 120h539.072c62.528 0 113.472-53.824 113.472-120v-618.24L627.008 0z m13.184 135.808l126.848 121.6h-81.088c-20.864 0-45.76-13.12-45.76-35.2v-86.4z m191.936 784.128c0 22.08-16.96 40-37.824 40H230.976c-20.864 0-37.76-17.92-37.76-40V120c0-22.08 16.896-40 37.76-40H576.64v142.208c0 66.176 46.72 97.92 109.312 97.92h146.176v599.808z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

Iconfile2.defaultProps = {
  size: 18,
};

export default Iconfile2;
