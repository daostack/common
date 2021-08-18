import React, {useState, useEffect} from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Discussion} from '~/Stores/Models/Discussion';
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
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const [discussion, setDiscussion] = useState<Discussion>();

  useEffect(() => {
    (async () => {
      const discussionData = await rootStore.discussionStore.getDiscussionById(
        item.eventObjectId,
      );
      setDiscussion(discussionData);
    })();
  }, [item.eventObjectId]);

  useEffect(() => {
    if (discussion) {
      const user = rootStore.userStore.getUserById(discussion.ownerId);
      let data = {} as NotificationItemData;
      if (discussion && user) {
        data = {
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
          data = {
            ...data,
            headerBold: `${discussion.title}`,
            common,
          };
        }
      }
      setNotificationData(data);
    }
  }, [discussion]);

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
