import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {PROPOSAL_TYPE} from '~/Config';
import {
  EventTypeState,
  NotificationItemData,
} from '~/Graphql/Notification/NotificationType';
import {FundingProposalEntity, JoinRequestEntity} from '~/Graphql/Proposal';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const FundingRequest = ({item, rootStore}: NotificationProps) => {
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

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <FundingRequest {...(props as NotificationProps)} />
  )),
);
