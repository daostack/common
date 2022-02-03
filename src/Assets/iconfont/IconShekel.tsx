import React, {ReactElement} from 'react';
import {Text} from 'react-native';
import {CurrencySymbols} from '~/Util/locale';
import {getIconColor} from './helper';

interface Props {
  color?: string | string[];
}

export const IconShekel = ({color}: Props): ReactElement => {
  return (
    <Text style={{color: getIconColor(color, 0, '#000000')}}>
      {CurrencySymbols.SHEKEL}
    </Text>
  );
};
