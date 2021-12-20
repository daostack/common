/* tslint:disable */
/* eslint-disable */

import React, {FunctionComponent} from 'react';
import {ViewProps} from 'react-native';
import {Svg, GProps, Path} from 'react-native-svg';
import {colors} from '~/Theme';
import {getIconColor} from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconCamera: FunctionComponent<Props> = ({
  size,
  color,
  ...rest
}) => {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.255 5.16c-.864 0-1.691.336-2.302.932A3.142 3.142 0 0 0 0 8.339v10.982c0 .843.343 1.652.953 2.248.61.596 1.438.931 2.302.931h17.49c.863 0 1.691-.335 2.302-.931.61-.596.953-1.405.953-2.248V8.34c0-.843-.343-1.651-.953-2.247a3.294 3.294 0 0 0-2.302-.931h-1.249c-.462 0-.905-.18-1.232-.499a1.682 1.682 0 0 1-.51-1.203c0-.52-.212-1.018-.588-1.385a2.03 2.03 0 0 0-1.418-.574H8.252a2.03 2.03 0 0 0-1.418.574 1.936 1.936 0 0 0-.587 1.385c0 .451-.184.884-.51 1.203-.328.32-.77.499-1.233.499h-1.25zM12 7.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"
        fill={getIconColor(color, 0, colors.white)}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        stroke="#000"
        opacity={0.5}
        strokeWidth="2"
        d="M7.5 13.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z"
        fill={getIconColor(color, 0, colors.white)}
      />
    </Svg>
  );
};

IconCamera.defaultProps = {
  size: 24,
};

export default IconCamera;
