import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {func, string} from 'prop-types';

export const ModerationMenu = ({showOptions, color = ''}) => (
  <TouchableOpacity onPress={showOptions} style={{padding: 5}}>
    <Icon name="menu1" size={20} color={color} />
  </TouchableOpacity>
);

ModerationMenu.propTypes = {
  showOptions: func,
  color: string,
};
