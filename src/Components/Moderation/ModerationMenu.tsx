import React from 'react';
import {TouchableOpacity} from 'react-native';
import {func, string, InferProps} from 'prop-types';
import Icon from '~/Assets/iconfont/Icon';

const ModerationMenu: React.FC<InferProps<typeof moderationMenuProps>> = ({
  showOptions,
  color = '',
}) => (
  <TouchableOpacity onPress={showOptions} style={{padding: 5}}>
    <Icon name="menu1" size={20} color={color} />
  </TouchableOpacity>
);

const moderationMenuProps = {
  showOptions: func.isRequired,
  color: string,
};

ModerationMenu.propTypes = moderationMenuProps;

export default ModerationMenu;
