import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import {Discussion} from '~/Stores/Models/Discussion';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const DiscussionReported = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const [discussion, setDiscussion] = useState<Discussion>();

  useEffect(() => {
    (async () => {
      const discussionResponse =
        await rootStore.discussionStore.getDiscussionById(item.eventObjectId);
      setDiscussion(discussionResponse);
      if (discussionResponse) {
        const reporter = await rootStore.userStore.getUserById(
          discussionResponse.ownerId,
        );

        if (discussionResponse && discussionResponse.commonId) {
          const common = rootStore.commonStore.getCommonById(
            discussionResponse.commonId,
          );

          const data = {
            createdAt: item.createdAt,
            missingData: false,
            description: 'A post was reported',
            ownerAvatar: reporter.photoURL,
            common,
          };

          setNotificationData(data);
        }
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
    <DiscussionReported {...(props as NotificationProps)} />
  )),
);
