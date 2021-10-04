import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const CommonMemberAdded = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});

  useEffect(() => {
    (async () => {
      const proposalNotificationData =
        await rootStore.notificationStore.getProposalNotificationData(
          item.eventObjectId,
        );
      if (proposalNotificationData) {
        const {proposal, user, common} = proposalNotificationData;

        const data = {
          createdAt: item.createdAt,
          missingData: false,
          description: ' Congrats! You are now a member!',
          ownerAvatar: user.photoURL,
          common,
          proposal,
        };
        setNotificationData(data);
      }
    })();
  }, [item, item.eventObjectId]);

  //Skip in case of missiing data
  if (notificationData.missingData) {
    return null;
  }

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <CommonMemberAdded {...(props as NotificationProps)} />
  )),
);
