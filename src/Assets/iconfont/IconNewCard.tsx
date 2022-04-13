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

export const IconNewCard: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 48 48" width={48} height={48} {...rest}>
      <Path
        d="M30.907 14.4c1.28.564 1.88 2.044 1.842 3.588l.461.05c.803.094 1.364.194 1.59.293.507.224.853 1.681 1.039 3.613a4.359 4.359 0 0 0-1.096-.138h-5.415c-2.392 0-4.332 1.92-4.332 4.288 0 2.369 1.94 4.289 4.332 4.289h5.415c.344 0 .678-.04.999-.115-.199 1.585-.513 2.796-.942 3.174-1.6 1.41-20 1.41-21.6 0-1.6-1.41-1.6-13.7 0-15.11.267-.237 1.006-.413 2.057-.54.079-1.199.596-2.37 1.553-3.214 1.77-1.56 11.66-1.253 14.097-.179zm3.836 9.55c.461 0 .888.142 1.24.385.032 1.169.02 2.389-.04 3.544-.343.227-.755.36-1.2.36h-5.415a2.155 2.155 0 0 1-2.166-2.145c0-1.184.97-2.144 2.166-2.144h5.415zM18.25 16.18c-.428.377-.692.89-.792 1.432 3.817-.199 9.326-.062 13.13.196 0-.69-.197-1.289-.562-1.45-1.744-.769-10.787-1.05-11.776-.179z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

IconNewCard.defaultProps = {
  size: 45,
};

export default IconNewCard;
