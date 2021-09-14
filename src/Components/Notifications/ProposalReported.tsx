import React, {useState, useEffect} from 'react';
import {InferProps, object} from 'prop-types';
import {
  NotificationItemData,
  EventTypeState,
} from '~/Graphql/Notification/NotificationType';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PROPOSAL_TYPE} from '~/Config';

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
  const [proposal, setProposal] = useState();

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
      navigation={navigation}
    />
  );
};

ProposalReported.propTypes = props;

export default inject('rootStore')(observer(ProposalReported));
