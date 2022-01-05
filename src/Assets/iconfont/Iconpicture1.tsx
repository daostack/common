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

export const Iconpicture1: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M929.728 0H94.272C43.328 0 0 51.776 0 118.656v808.832c0 40.32 15.744 75.2 39.424 96.512l354.944-446.72c11.712-14.72 30.72-14.72 42.432 0l117.44 134.592 225.728-296.384a27.456 27.456 0 0 1 21.248-11.072c7.936 0 15.552 4.032 21.184 11.072L1024 669.184V118.656C1024 51.776 980.672 0 929.728 0zM287.04 191.68A96 96 0 0 0 191.36 287.808a96 96 0 0 0 95.68 96.064 96 96 0 1 0 0-192.192z m520.064 293.44l-229.696 290.56c-11.328 14.4-29.888 14.4-41.28 0l-104.448-132.224L130.88 1024h801.344c49.6 0 91.776-50.688 91.776-116.096v-148.352L807.04 485.12z"
        fill={getIconColor(color, 0, '#92A2B5')}
      />
    </Svg>
  );
};

Iconpicture1.defaultProps = {
  size: 18,
};

export default Iconpicture1;
