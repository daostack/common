import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {func, string, bool} from 'prop-types';
import {colors} from '~/Theme';

export const ModerationMenu = ({showOptions, color = ''}) => (
  <TouchableOpacity onPress={showOptions} style={{padding: 5}}>
    <Icon name="menu1" size={20} color={color} />
  </TouchableOpacity>
);

ModerationMenu.propTypes = {
  showOptions: func,
  color: string,
};

export const Reported = ({reported}) => (
  <Text style={{fontSize: 15, color: colors.grey3}}>
    {reported && ' (reported)'}
  </Text>
);

Reported.propTypes = {
  reported: bool,
};
