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

export const Iconstyle16: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M193.92 418.304a23.168 23.168 0 0 1 32.832 0l377.472 377.472a23.232 23.232 0 0 1 0 32.896l-166.656 166.656c-17.6 17.536-40.96 27.2-65.728 27.2a92.16 92.16 0 0 1-65.728-27.2l-175.168-175.168a23.168 23.168 0 0 1-3.84-27.712l45.44-81.92-81.92 45.504a23.168 23.168 0 0 1-27.712-3.84l-35.648-35.776A91.904 91.904 0 0 1 0 650.688c0-24.832 9.664-48.128 27.264-65.728zM875.392 0c81.152 0 147.2 66.048 147.2 147.2 0 46.08-22.08 90.112-58.88 117.76l-245.888 172.736a52.864 52.864 0 0 0-5.12 79.488l48.32 48.256c18.752 18.816 29.12 43.776 29.12 70.4v6.528c0 26.56-10.368 51.584-29.12 70.4l-70.656 70.592a23.296 23.296 0 0 1-32.832 0L239.232 365.056a23.232 23.232 0 0 1 0-32.896L309.76 261.568a98.88 98.88 0 0 1 70.4-29.184h6.528c26.56 0 51.52 10.368 70.336 29.184l48.256 48.256c21.632 21.632 61.568 18.816 79.936-5.696L757.184 59.52A148.096 148.096 0 0 1 875.392 0z m7.68 92.928a46.528 46.528 0 0 0 0.064 92.992 46.528 46.528 0 0 0 0-92.992z"
        fill={getIconColor(color, 0, '#D5DEE4')}
      />
    </Svg>
  );
};

Iconstyle16.defaultProps = {
  size: 18,
};

export default Iconstyle16;
