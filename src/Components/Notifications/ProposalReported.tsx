import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {PROPOSAL_TYPE} from '~/Config';
import {
  EventTypeState,
  NotificationItemData,
} from '~/Graphql/Notification/NotificationType';
import {Proposal} from '~/Stores/Models/Proposal';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const ProposalReported = ({item, rootStore}: NotificationProps) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  let eventType = item.eventType;
  const [proposal, setProposal] = useState<Proposal>();

  useEffect(() => {
    (async () => {
      const proposalResponse = await rootStore.proposalStore.getProposalById(
        item.eventObjectId,
      );
      setProposal(proposalResponse);
      if (proposalResponse) {
        const proposer = proposalResponse.user;
        const isJoin = proposalResponse.type === PROPOSAL_TYPE.Join;

        if (isJoin) {
          eventType = EventTypeState.membershipRequestReported;
        }
        if (proposal && proposalResponse.commonId) {
          const common = rootStore.commonStore.getCommonById(
            proposalResponse.commonId,
          );

          const data = {
            createdAt: item.createdAt,
            missingData: false,
            description: `A ${
              isJoin ? 'membership request' : 'proposal'
            } was reported`,
            ownerAvatar: proposer.photoURL,
            common,
          };
          setNotificationData(data);
        }
      }
    })();
  }, [item.eventObjectId]);

  //Skip in case of missiing data
  if (notificationData.missingData || proposal?.isModerationHidden) {
    return null;
  }

  return (
    <NotificationItem
      item={{...item, eventType}}
      notificationData={notificationData}
    />
  );
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <ProposalReported {...(props as NotificationProps)} />
  )),
);
