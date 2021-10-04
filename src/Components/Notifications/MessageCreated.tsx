import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const MessageCreated = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const message = rootStore.discussionMessageStore.getDiscussionMessageById(
    item.eventObjectId,
  );

  useEffect(() => {
    (async () => {
      if (message) {
        let data = {} as NotificationItemData;
        const discussion = await rootStore.discussionStore.getDiscussionById(
          message.discussionId,
        );
        let proposal;
        if (!discussion) {
          proposal = await rootStore.proposalStore.getProposalById(
            message.discussionId,
          );
        }
        const objectData = discussion || proposal;

        const user = rootStore.userStore.getUserById(message.ownerId);

        const objectType = objectData?.userId
          ? {
              proposal: objectData,
              tabIndex: 1,
            }
          : {discussion: objectData};

        if (objectData && user) {
          data = {
            missingData: false,
            createdAt: item.createdAt,
            descriptionBold: `${user.firstName} ${user.lastName}:`,
            description: ` ${message.text}`,
            ownerAvatar: user.photoURL,
            ...objectType,
          };
        }

        if (objectData && objectData.commonId) {
          const common = rootStore.commonStore.getCommonById(
            objectData.commonId,
          );

          if (common && common.name) {
            data = {
              ...notificationData,
              header: ' on',
              headerBold: `${objectData.title || objectData.description.title}`,
              common,
            };
          }
        }
        setNotificationData(data);
      }
    })();
  }, [message]);

  //Skip in case of missiing data
  if (notificationData.missingData || message?.isModerationHidden) {
    return null;
  }

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <MessageCreated {...(props as NotificationProps)} />
  )),
);
