import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {Common} from '~/Stores/Models';
import {useStore} from '~/Stores';
import {EditType, IModerationEntity} from '~/Types';

export const ModerationMenu: React.FC<{
  color: string;
  common: Common;
  moderation: IModerationEntity;
}> = ({moderation, common, ...props}) => {
  const {
    uiStore: {bottomSheetStore},
  } = useStore();
  return (
    <TouchableOpacity
      onPress={() => {
        bottomSheetStore.showHiddenNote(
          moderation,
          EditType.rules,
          common.isModerator,
        );
      }}
      style={{padding: 5}}>
      <Icon name="menu1" size={20} {...props} />
    </TouchableOpacity>
  );
};
