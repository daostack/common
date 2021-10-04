import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import {Discussion} from '~/Stores/Models/Discussion';
import {Proposal} from '~/Stores/Models/Proposal';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const DiscussionMessageReported = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const getParentObject = (
    discussionObject: Proposal | Discussion,
  ): Record<any, any> =>
    discussionObject?.userId
      ? {
          proposal: discussionObject,
          tabIndex: 1,
        }
      : {discussion: discussionObject};

  const messageReportedData =
    rootStore.discussionMessageStore.getDiscussionMessageById(
      item.eventObjectId,
    );
  useEffect(() => {
    (async () => {
      if (messageReportedData) {
        const objectData =
          await rootStore.notificationStore.getParentDiscussion(
            messageReportedData,
          );

        if (objectData && objectData.commonId) {
          const common = rootStore.commonStore.getCommonById(
            objectData.commonId,
          );
          const messageOwner = rootStore.userStore.getUserById(
            messageReportedData.ownerId,
          );
          const data = {
            createdAt: item.createdAt,
            missingData: false,
            description: 'A comment was reported',
            ownerAvatar: messageOwner.photoURL,
            common,
            ...getParentObject(objectData),
          };
          setNotificationData(data);
        }
      }
    })();
  }, [messageReportedData]);

  //Skip in case of missiing data
  if (notificationData.missingData || messageReportedData?.isModerationHidden) {
    return null;
  }

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <DiscussionMessageReported {...(props as NotificationProps)} />
  )),
);
