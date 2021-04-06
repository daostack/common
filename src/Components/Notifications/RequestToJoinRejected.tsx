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

const RequestToJoinRejected: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const proposalNotificationData = rootStore.notificationStore.getProposalNotificationData(
    item.eventObjectId,
  );

  if (proposalNotificationData) {
    const {proposal, common} = proposalNotificationData;

    if (proposal?.isModerationHidden) {
      return null;
    }

    notificationData = {
      missingData: false,
      description:
        "Don't give up, there are plenty of other Commons you can join.",
      ownerAvatar: common.image,
      common,
      proposal,
    };
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

RequestToJoinRejected.propTypes = props;

export default inject('rootStore')(observer(RequestToJoinRejected));
