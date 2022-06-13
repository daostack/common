import React from 'react';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {ItemProps} from './propType';
import Logger from '~/Services/Logger';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '~/Util/hooks/useStore';

interface CommonWhitelistedProps {
  item: ItemProps;
}
export const CommonWhitelisted = observer(({item}: CommonWhitelistedProps) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const navigation = useNavigation();
  const rootStore = useStore('rootStore');

  // NOTE: if the commonData is still not loaded into the store, we will have an exception here
  try {
    let common = rootStore.commonStore.getCommonById(item.eventObjectId);

    if (common) {
      notificationData = {
        missingData: false,
        hideCommonName: true,
        descriptionBold: `${common.name}`,
        description: ' - You might want to check it out.',
        ownerAvatar: common.image,
        createdAt: item.createdAt,
        common,
      };
    }
  } catch (error) {
    Logger.warn('Not found data');
  }

  //Skip in case of missiing data
  if (notificationData.missingData) {
    return null;
  }

  return (
    <NotificationItem
      item={item}
      notificationData={notificationData}
      navigation={navigation}
    />
  );
});
