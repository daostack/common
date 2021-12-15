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

export const IconaccountSelected: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M362.965333 514.858667A296.96 296.96 0 0 0 512 554.666667c53.76 0 104.192-14.208 147.754667-39.04l33.536 1.877333c75.733333 4.906667 132.608 13.056 144.298666 24.533333 40.832 40.021333 82.517333 326.570667 41.685334 366.592-40.874667 40.064-696.832 40.064-737.664 0-40.832-40.021333 21.248-326.570667 41.685333-366.592 7.04-13.824 82.346667-22.869333 179.626667-27.178666zM512 42.666667a213.333333 213.333333 0 1 1-0.042667 426.709333A213.333333 213.333333 0 0 1 512 42.666667z"
        fill={getIconColor(color, 0, '#7786FF')}
      />
    </Svg>
  );
};

IconaccountSelected.defaultProps = {
  size: 18,
};

export default IconaccountSelected;
