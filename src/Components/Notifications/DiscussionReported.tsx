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

const DiscussionReported: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const discussion = rootStore.discussionStore.getDiscussionById(
    item.eventObjectId,
  );
  if (discussion) {
    const reporter = rootStore.userStore.getUserById(discussion.ownerId);

    if (discussion && discussion.commonId) {
      const common = rootStore.commonStore.getCommonById(discussion.commonId);

      notificationData = {
        missingData: false,
        description: 'A post was reported',
        ownerAvatar: reporter.photoURL,
        common,
      };
    }
  }

  //Skip in case of missiing data
  if (notificationData.missingData || discussion?.isModerationHidden) {
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

DiscussionReported.propTypes = props;

export default inject('rootStore')(observer(DiscussionReported));
