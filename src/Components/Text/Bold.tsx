import React from 'react';
import {Text, TextStyle} from 'react-native';
import {text} from '~/Theme';

export const Bold = ({
  boldText,
  style = {},
}: {
  boldText: string;
  style?: TextStyle;
}) => <Text style={{...text.bold, ...style}}>{boldText}</Text>;
