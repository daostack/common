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
import {PROPOSAL_TYPE} from '~/Config';
import {
  IFundingRequestDescription,
  IFundingRequestProposal,
  IJoinRequestProposal,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const FundingRequest: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  let notificationData = {missingData: true} as NotificationItemData;
  const proposalNotificationData = rootStore.notificationStore.getProposalNotificationData(
    item.eventObjectId,
  );

  if (proposalNotificationData) {
    const {proposal, user, common} = proposalNotificationData;

    if (proposal?.isModerationHidden) {
      return null;
    }

    // Temporarry logic for fixing undefined value for amount inside Notification Item of type `New Proposal`.
    // We have that logic in Proposal.ts in a computed field called 'fundingFormatted' , but for some reasons
    // all the computed fields in Proposal model are undefined once we read it from mobx-persist.
    let proposalFunding = 0;
    if (proposal.type === PROPOSAL_TYPE.Join) {
      proposalFunding = (proposal as IJoinRequestProposal).join.funding;
    } else {
      proposalFunding = (proposal as IFundingRequestProposal).fundingRequest
        .amount;
    }
    const fundingFormatted = proposalFunding / 100;

    notificationData = {
      createdAt: item.createdAt,
      missingData: false,
      descriptionBold: `"${
        (proposal.description as IFundingRequestDescription).title
      }"`,
      description: ` (${fundingFormatted}$ requested)`,
      common,
      ownerAvatar: user.photoURL,
      proposal,
    };

    if (item.eventType === EventTypeState.fundingRequestCreated) {
      notificationData = {
        ...notificationData,
        header: ' by',
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

FundingRequest.propTypes = props;

export default inject('rootStore')(observer(FundingRequest));
