import React, {useState, useEffect} from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
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
  const [discussion, setDiscussion] = useState();

  useEffect(() => {
    (async (): Promise<void> => {
      const discussionResponse =
        await rootStore.discussionStore.getDiscussionById(item.eventObjectId);
      setDiscussion(discussionResponse);
      if (discussionResponse) {
        const user = rootStore.userStore.getUserById(
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
