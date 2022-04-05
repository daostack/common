/* tslint:disable */
/* eslint-disable */

import React, {FunctionComponent} from 'react';
import {ViewProps} from 'react-native';
import {Svg, GProps, Path, G} from 'react-native-svg';
import {getIconColor} from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const Iconclcok: FunctionComponent<Props> = ({size, color, ...rest}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill="none" fill-rule="evenodd">
        <G fill={getIconColor(color, 0, '#FFAE26')} fill-rule="nonzero">
          <G>
            <G>
              <Path
                d="M11.636 0c.6 0 1.089.468 1.089 1.044 0 .575-.487 1.043-1.089 1.043h-.647v.8c2.228.21 4.24 1.12 5.798 2.498l.894-.857-.3-.285c-.252-.24-.252-.63 0-.871.249-.24.656-.24.907 0l1.36 1.305c.253.24.253.63 0 .87-.248.24-.655.24-.906 0l-.27-.258-.91.872c1.515 1.679 2.44 3.862 2.438 6.257C20 17.71 15.525 22 10 22c-5.522 0-10-4.29-10-9.582 0-2.387.916-4.563 2.421-6.24l.556-.575c1.593-1.508 3.712-2.505 6.07-2.72h.04v-.796h-.718c-.601 0-1.09-.466-1.09-1.043C7.28.468 7.769 0 8.37 0zM9.988 4.441c-4.587 0-8.308 3.564-8.308 7.96s3.72 7.96 8.308 7.96c4.586 0 8.307-3.564 8.307-7.96s-3.72-7.96-8.307-7.96zm.053 1.304l.605.927v5.017c.378.212.631.601.63 1.05 0 .676-.574 1.223-1.277 1.223-.704 0-1.276-.547-1.276-1.223 0-.449.255-.838.631-1.05V6.672l.687-.927z"
                transform="translate(-257 -551) translate(59 52) translate(198 499) translate(2 1)"
              />
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

Iconclcok.defaultProps = {
  size: 18,
};

export default Iconclcok;
