import React from 'react';
import {InferProps, object} from 'prop-types';
import {NotificationItemData} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {inject, observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';
import {rootStorePropTypes} from '~/Types/propTypes';
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
  let notificationData = {missingData: true} as NotificationItemData;
  let eventType = item.eventType;
  const proposal = rootStore.proposalStore.getProposalById(item.eventObjectId);
  if (proposal) {
    const proposer = rootStore.userStore.getUserById(
      proposal.proposerId,
    );
    const isJoin = proposal.type === PROPOSAL_TYPE.Join;

    if (isJoin) {
      eventType = EventTypeState.membershipRequestReported;
    }
    if (proposal && proposal.commonId) {
      const common = rootStore.commonStore.getCommonById(proposal.commonId);

      notificationData = {
        missingData: false,
        description: `A ${
          isJoin ? 'membership request' : 'proposal'
        } was reported`,
        ownerAvatar: proposer.photoURL,
        common,
      };
    }
  }

  //Skip in case of missiing data
  if (notificationData.missingData) {
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
