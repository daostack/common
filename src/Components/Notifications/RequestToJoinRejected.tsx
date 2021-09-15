import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const RequestToJoinRejected = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});

  useEffect(() => {
    (async () => {
      const proposalNotificationData =
        await rootStore.notificationStore.getProposalNotificationData(
          item.eventObjectId,
        );
      if (proposalNotificationData) {
        const {proposal, common} = proposalNotificationData;

        if (proposal?.isModerationHidden) {
          return null;
        }

        const data = {
          createdAt: item.createdAt,
          missingData: false,
          description:
            "Don't give up, there are plenty of other Commons you can join.",
          ownerAvatar: common?.image,
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
    <RequestToJoinRejected {...(props as NotificationProps)} />
  )),
);
