import {observer} from 'mobx-react';
import React from 'react';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const WelcomeNotification = ({item}: Omit<NotificationProps, STORE_KEYS>) => {
  const notificationData = {
    createdAt: item.createdAt,
    updatedAt: item.createdAt,
    missingData: false,
    descriptionBold: "We're excited to have you with us",
    description: ' Looking for the first Common to join? Browse now.',
    ownerAvatar:
      'https://firebasestorage.googleapis.com/v0/b/common-staging-50741.appspot.com/o/public_img%2FappLogo.png?alt=media&token=41fec685-b6fb-4b56-813a-fd3e8756787a',
  };

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default observer(WelcomeNotification);
