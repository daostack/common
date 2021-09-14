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

const RequestToJoinRejected: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});

  useEffect(() => {
    (async () => {
      const proposalNotificationData =
        await rootStore.notificationStore.getProposalNotificationData(
          item.eventObjectId,
        );
      if (proposalNotificationData) {
        const {proposal, common} = proposalNotificationData;

        if (proposal?.isModerationHidden) {
          return null;
        }

        const data = {
          createdAt: item.createdAt,
          missingData: false,
          description:
            "Don't give up, there are plenty of other Commons you can join.",
          ownerAvatar: common?.image,
          common,
          proposal,
        };
        setNotificationData(data);
      }
    })();
  }, [item, item.eventObjectId]);

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

RequestToJoinRejected.propTypes = props;

export default inject('rootStore')(observer(RequestToJoinRejected));
