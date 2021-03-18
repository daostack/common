import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, text, font} from '~/Theme';
import {InferProps, string, object} from 'prop-types';
import {
  BadgeProps,
  EventTitleState,
  EventTypeState,
  NotificationItemData,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';

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
  let common = null;

  common = rootStore.commonStore.getCommonById(item.eventObjectId);

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

  console.log('notificationData -> ', notificationData);
  console.log('item -> ', item);

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
