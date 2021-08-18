import React, {useState, useEffect} from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import {Proposal} from '~/Stores/Models/Proposal';
import {PROPOSAL_TYPE} from '~/Config';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
  rootStore: rootStorePropTypes.isRequired,
};

const ProposalReported: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  rootStore,
}) => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});
  let eventType = item.eventType;
  const [proposal, setProposal] = useState<Proposal>();

  useEffect(() => {
    (async () => {
      const proposalData = await rootStore.proposalStore.getProposalById(
        item.eventObjectId,
      );
      setProposal(proposalData);
    })();
  }, [item.eventObjectId]);

  useEffect(() => {
    (async () => {
      if (proposal) {
        const proposer = proposal.user;
        const isJoin = proposal.type === PROPOSAL_TYPE.Join;

        if (isJoin) {
          eventType = EventTypeState.membershipRequestReported;
        }
        if (proposal && proposal.commonId) {
          const common = rootStore.commonStore.getCommonById(proposal.commonId);

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
  }, [proposal]);

  //Skip in case of missiing data
  if (notificationData.missingData || proposal?.isModerationHidden) {
    return null;
  }

  return (
    <NotificationItem
      item={{...item, eventType}}
      notificationData={notificationData}
      navigation={navigation}
    />
  );
};

ProposalReported.propTypes = props;

export default inject('rootStore')(observer(ProposalReported));
