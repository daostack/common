import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import {Discussion} from '~/Stores/Models/Discussion';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const DiscussionCreated = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const [discussion, setDiscussion] = useState<Discussion>();

  useEffect(() => {
    (async (): Promise<void> => {
      const discussionResponse =
        await rootStore.discussionStore.getDiscussionById(item.eventObjectId);
      setDiscussion(discussionResponse);
      if (discussionResponse) {
        const user = await rootStore.userStore.getUserById(
          discussionResponse.ownerId,
        );
        let data = {} as NotificationItemData;
        if (discussionResponse && user) {
          data = {
            missingData: false,
            createdAt: item.createdAt,
            descriptionBold: ` by ${user.firstName} ${user.lastName}`,
            ownerAvatar: user.photoURL,
            discussion: discussionResponse,
          };
        }

        if (discussionResponse && discussionResponse.commonId) {
          const common = rootStore.commonStore.getCommonById(
            discussionResponse.commonId,
          );

          if (common && common.name) {
            data = {
              ...data,
              headerBold: `${discussionResponse.title}`,
              common,
            };
          }
        }
        setNotificationData(data);
      }
    })();
  }, [item.eventObjectId]);

  //Skip in case of missiing data
  if (notificationData.missingData || discussion?.isModerationHidden) {
    return null;
  }

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <DiscussionCreated {...(props as NotificationProps)} />
  )),
);
