import React from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import Logger from '~/Services/Logger';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const CommonWhitelisted: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;

  // NOTE: if the commonData is still not loaded into the store, we will have an exception here
  try {
    let common = rootStore.commonStore.getCommonById(item.eventObjectId);

    if (common) {
      const user = rootStore.userStore.getUserById(common.members[0].userId);
      if (user) {
        notificationData = {
          missingData: false,
          descriptionBold: `"${common.name}"`,
          description: ' - You might want to check it out.',
          ownerAvatar: user.photoURL,
          common,
        };
      }
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
};

CommonWhitelisted.propTypes = props;

export default inject('rootStore')(observer(CommonWhitelisted));
