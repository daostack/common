import React, {useState, useEffect} from 'react';
import {InferProps, object} from 'prop-types';
import {
  EventTypeState,
  NotificationItemData,
} from '~/Graphql/Notification/NotificationType';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PROPOSAL_TYPE} from '~/Config';
import {JoinRequestEntity, FundingProposalEntity} from '~/Graphql/Proposal';

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
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});

  useEffect(() => {
    (async () => {
      const proposalNotificationData =
        await rootStore.notificationStore.getProposalNotificationData(
          item.eventObjectId,
        );
      if (proposalNotificationData) {
        const {proposal, user, common} = proposalNotificationData;
        let data = {} as NotificationItemData;

        if (proposal?.isModerationHidden) {
          return null;
        }

        // Temporarry logic for fixing undefined value for amount inside Notification Item of type `New Proposal`.
        // We have that logic in Proposal.ts in a computed field called 'fundingFormatted' , but for some reasons
        // all the computed fields in Proposal model are undefined once we read it from mobx-persist.
        let proposalFunding = 0;
        if (proposal.type === PROPOSAL_TYPE.Join) {
          proposalFunding = (proposal as JoinRequestEntity).join.funding;
        } else {
          proposalFunding = (proposal as FundingProposalEntity).funding.amount;
        }
        const fundingFormatted = proposalFunding / 100;

        data = {
          createdAt: item.createdAt,
          missingData: false,
          descriptionBold: `"${proposal.description}"`,
          description: ` (${fundingFormatted}$ requested)`,
          common,
          ownerAvatar: user.photoURL,
          proposal,
        };

        if (item.eventType === EventTypeState.fundingRequestCreated) {
          data = {
            ...notificationData,
            header: ' by',
            headerBold: `${user.firstName} ${user.lastName}`,
          };
        }
        setNotificationData(data);
      }
    })();
  }, [item, item.eventObjectId]);

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
