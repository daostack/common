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

export const IcondiscussionSelected: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M941.632 366.336c24.48 12.448 24.48 397.6 0 422.464-13.312 13.472-163.712 19.648-302.4 18.496-18.56-0.16-67.296 89.12-85.056 88.704-27.616-0.64-65.504-93.504-74.016-94.112l-14.496-1.152-13.312-1.248c-27.424-2.816-45.728-6.4-49.984-10.688-24.48-24.864-24.48-397.6 0-422.464 24.512-24.832 514.752-12.416 539.264 0z m-320-224c9.76 4.96 15.616 69.056 17.6 145.984L600.32 288l-43.264 0.064c-18.112 0.16-34.688 0.416-49.92 0.896a32 32 0 0 0-23.392-48.736L480 240H224l-3.744 0.224a32 32 0 0 0 0 63.552L224 304h162.56c-12.96 4.608-22.592 10.4-29.76 17.664-9.92 10.048-17.28 25.28-22.688 46.304L224 368l-3.744 0.224a32 32 0 0 0 0 63.552L224 432h100.352c-3.072 35.68-4.16 79.68-4.32 132.8v18.496h-0.8c-18.56-0.16-67.296 89.12-85.056 88.704-27.616-0.64-65.504-93.504-74.016-94.112l-14.496-1.152c-34.784-2.976-58.368-6.944-63.296-11.936-24.48-24.864-24.48-397.6 0-422.464 24.512-24.832 514.752-12.416 539.264 0zM800 592h-256l-3.744 0.224a32 32 0 0 0 0 63.552L544 656h256l3.744-0.224A32 32 0 0 0 800 592z m0-128h-256l-3.744 0.224a32 32 0 0 0 0 63.552L544 528h256l3.744-0.224A32 32 0 0 0 800 464z"
        fill={getIconColor(color, 0, '#7682FF')}
      />
    </Svg>
  );
};

IcondiscussionSelected.defaultProps = {
  size: 18,
};

export default IcondiscussionSelected;
