import React from 'react';
import {Text} from 'react-native';
import {object, string} from 'prop-types';
import {text} from '~/Theme';

export const Bold = ({
  boldText,
  style = {},
}: {
  boldText: string;
  style: object | null;
}) => <Text style={{...text.bold, ...style}}>{boldText}</Text>;

Bold.propTypes = {
  boldText: string,
  style: object,
};
