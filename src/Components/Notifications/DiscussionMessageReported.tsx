import React from 'react';
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
  const getParentObject = (
    discussionObject: Proposal | Discussion,
  ): Record<any, any> =>
    discussionObject?.proposerId
      ? {
          proposal: discussionObject,
          tabIndex: 1,
        }
      : {discussion: discussionObject};

  let notificationData = {missingData: true} as NotificationItemData;
  const messageReportedData = rootStore.discussionMessageStore.getDiscussionMessageById(
    item.eventObjectId,
  );

  if (messageReportedData) {
    const {moderation} = messageReportedData;
    const objectData = rootStore.notificationStore.getParentDiscussion(
      messageReportedData,
    );

    if (objectData) {
      const common = rootStore.commonStore.getCommonById(objectData.commonId);
      const reporter = rootStore.userStore.getUserById(moderation.reporter);
      notificationData = {
        missingData: false,
        description: 'A comment was reported',
        ownerAvatar: reporter.photoURL,
        common,
        ...getParentObject(objectData),
      };
    }
  }

  //Skip in case of missiing data
  if (notificationData.missingData) {
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
