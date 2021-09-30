import React, {useState, useEffect} from 'react';
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
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const [discussion, setDiscussion] = useState();

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
