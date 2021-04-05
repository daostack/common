import React from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import {FLAGS} from '~/Components/Moderation/constants';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const RequestToJoinCreated: React.FC<InferProps<typeof props>> = ({
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

    notificationData = {
      missingData: false,
      description:
        ' Your Common has new pending members, view their requests and vote',
      ownerAvatar: common.image,
      common,
      proposal,
    };
  }

  //Skip in case of missiing data
  if (
    notificationData.missingData ||
    proposalNotificationData?.moderation?.flag === FLAGS.hidden
  ) {
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

RequestToJoinCreated.propTypes = props;

export default inject('rootStore')(observer(RequestToJoinCreated));
