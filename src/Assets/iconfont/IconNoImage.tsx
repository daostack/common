/* tslint:disable */
/* eslint-disable */

import React, {FunctionComponent} from 'react';
import {ViewProps} from 'react-native';
import {Svg, GProps, Path} from 'react-native-svg';
import {getIconColor} from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

export const IconNoImage: FunctionComponent<Props> = ({
  size,
  color,
  ...rest
}) => {
  return (
    <Svg viewBox="0 0 16 16" width={size} height={size} {...rest}>
      <Path
        d="M14.158.227C12.81.083 10.652.007 8.45 0h-.75C4.33.012 1.06.182.645.512c-.711.566-.834 9.976-.369 13.597L14.158.227zm-7.143 9.971 8.77-8.769c.143.994.206 2.67.214 4.525v.735c-.003.922-.018 1.87-.043 2.788C15.079 7.84 14.069 7 12.887 7c-1.178 0-1.819.849-2.736 2.87l-.432.95c-.442.923-.752 1.315-.971 1.315-.365 0-.586-.193-1.008-.87l-.217-.354a5.74 5.74 0 0 0-.508-.712zm-4.353 4.353 3.618-3.618c.11.13.229.302.37.53l.218.355c.609.972 1.032 1.343 1.88 1.343.842 0 1.322-.634 2.002-2.107l.453-.998c.674-1.444 1.144-2.03 1.684-2.03 1.023 0 2.049 1.242 2.98 3.835-.095 1.943-.23 3.412-.363 3.625-.208.33-3.478.501-6.901.513h-.735c-2.242-.008-4.462-.083-5.846-.227.22-.433.434-.84.64-1.22zM3 4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"
        fill={getIconColor(color, 0, '#D5D5E4')}
        fillRule="evenodd"
      />
    </Svg>
  );
};

IconNoImage.defaultProps = {
  size: 18,
};

export default IconNoImage;
