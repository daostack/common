import React, {useState, useEffect} from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import {Proposal} from '~/Stores/Models/Proposal';
import {Discussion} from '~/Stores/Models/Discussion';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const DiscussionMessageReported: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
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

  const [messageReportedData, setMessageReportedData] = useState();

  useEffect(() => {
    (async () => {
      const messageResponse =
        await rootStore.discussionMessageStore.getDiscussionMessageById(
          item.eventObjectId,
        );
      setMessageReportedData(messageReportedData);
      if (messageResponse) {
        const objectData =
          rootStore.notificationStore.getParentDiscussion(messageResponse);

        if (objectData && objectData.commonId) {
          const common = rootStore.commonStore.getCommonById(
            objectData.commonId,
          );
          const messageOwner = await rootStore.userStore.getUserById(
            messageResponse.ownerId,
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
  }, [item.eventObjectId]);

  //Skip in case of missiing data
  if (notificationData.missingData || messageReportedData?.isModerationHidden) {
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

DiscussionMessageReported.propTypes = props;

export default inject('rootStore')(observer(DiscussionMessageReported));
