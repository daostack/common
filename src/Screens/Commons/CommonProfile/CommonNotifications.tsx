import React from 'react';
import NotificationList from '~/Screens/Notifications/NotificationList';
import {useStore} from '~/Util/hooks/useStore';
import {useRoute} from '@react-navigation/native';

export const CommonNotifications = () => {
  const rootStore = useStore('rootStore');
  const route = useRoute();
  const {currCommon} = route.params;
  const notificationsArray = rootStore.notificationStore.getCommonNotifications(
    currCommon.id,
  );

  return <NotificationList notificationsArray={notificationsArray} />;
};
