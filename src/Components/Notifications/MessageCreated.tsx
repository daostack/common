import React from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const MessageCreated: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const message = rootStore.discussionMessageStore.getDiscussionMessageById(
    item.eventObjectId, // TODO!!
  );
  if (message) {
    const objectData =
      rootStore.discussionStore.getDiscussionById(message.discussionId) ||
      rootStore.proposalStore.getProposalById(message.discussionId);

    const user = rootStore.userStore.getUserById(message.ownerId);

    const objectType = objectData?.proposerId
      ? {
          proposal: objectData,
          tabIndex: 1,
        }
      : {discussion: objectData};

    if (objectData && user) {
      notificationData = {
        missingData: false,
        createdAt: item.createdAt,
        descriptionBold: `${user.firstName} ${user.lastName}:`,
        description: ` ${message.text}`,
        ownerAvatar: user.photoURL,
        ...objectType,
      };
    }

    if (objectData && objectData.commonId) {
      const common = rootStore.commonStore.getCommonById(objectData.commonId);

      if (common && common.name) {
        notificationData = {
          ...notificationData,
          header: ' on',
          headerBold: `${objectData.title || objectData.description.title}`,
          common,
        };
      }
    }
  }

  //Skip in case of missiing data
  if (notificationData.missingData || message?.isModerationHidden) {
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

MessageCreated.propTypes = props;

export default inject('rootStore')(observer(MessageCreated));
