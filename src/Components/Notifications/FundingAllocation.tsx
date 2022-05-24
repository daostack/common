import React from 'react';
import {InferProps, object} from 'prop-types';
import {
  EventTypeState,
  NotificationItemData,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import {CurrencySymbols} from '~/Util/locale';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const FundingAllocation: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const proposalNotificationData =
    rootStore.notificationStore.getProposalNotificationData(item.eventObjectId);

  if (proposalNotificationData) {
    const {proposal, user, common} = proposalNotificationData;

    notificationData = {
      createdAt: item.createdAt,
      missingData: false,
      descriptionBold: `${proposal.description}`,
      description: `${CurrencySymbols.SHEKEL} GOVERNANCE_FUNDING_ALLOCATION`,
      common,
      ownerAvatar: user.photoURL,
      proposal,
    };

    if (item.eventType === EventTypeState.fundingRequestCreated) {
      notificationData = {
        ...notificationData,
        header: ' by ',
        headerBold: `${user.firstName} ${user.lastName}`,
      };
    }
  }

  // Skip in case of missiing data
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

FundingAllocation.propTypes = props;

export default inject('rootStore')(observer(FundingAllocation));
