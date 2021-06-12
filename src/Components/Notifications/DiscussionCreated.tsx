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

const DiscussionCreated: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const discussion = rootStore.discussionStore.getDiscussionById(
    item.discussionId,
  );
  if (discussion) {
    const user = rootStore.userStore.getUserById(discussion.ownerId);
    if (discussion && user) {
      notificationData = {
        missingData: false,
        createdAt: item.createdAt,
        descriptionBold: ` by ${user.firstName} ${user.lastName}`,
        ownerAvatar: user.photoURL,
        discussion: discussion,
      };
    }

    if (discussion && discussion.commonId) {
      const common = rootStore.commonStore.getCommonById(discussion.commonId);

      if (common && common.name) {
        notificationData = {
          ...notificationData,
          headerBold: `${discussion.title}`,
          common,
        };
      }
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

DiscussionCreated.propTypes = props;

export default inject('rootStore')(observer(DiscussionCreated));
