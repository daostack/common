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

const MessageCreated: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  const message = rootStore.discussionMessageStore.getDiscussionMessageById(
    item.eventObjectId,
  );

  useEffect(() => {
    (async () => {
      if (message) {
        let data = {} as NotificationItemData;
        const discussion = await rootStore.discussionStore.getDiscussionById(
          message.discussionId,
        );
        let proposal;
        if (!discussion) {
          proposal = await rootStore.proposalStore.getProposalById(
            message.discussionId,
          );
        }
        const objectData = discussion || proposal;

        const user = await rootStore.userStore.getUserById(message.ownerId);

        const objectType = objectData?.userId
          ? {
              proposal: objectData,
              tabIndex: 1,
            }
          : {discussion: objectData};

        if (objectData && user) {
          data = {
            missingData: false,
            createdAt: item.createdAt,
            descriptionBold: `${user.firstName} ${user.lastName}:`,
            description: ` ${message.text}`,
            ownerAvatar: user.photoURL,
            ...objectType,
          };
        }

        if (objectData && objectData.commonId) {
          const common = rootStore.commonStore.getCommonById(
            objectData.commonId,
          );

          if (common && common.name) {
            data = {
              ...notificationData,
              header: ' on',
              headerBold: `${objectData.title || objectData.description.title}`,
              common,
            };
          }
        }
        setNotificationData(data);
      }
    })();
  }, [message]);

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
