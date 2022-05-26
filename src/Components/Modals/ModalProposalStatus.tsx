import {useNavigation, CommonActions} from '@react-navigation/native';
import React, {ReactElement, useEffect, useState} from 'react';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {useStore} from '~/Util/hooks/useStore';
import ModalProposalApproval from './ModalProposalApproval';
import ModalProposalRejected from './ModalProposalRejected';

interface Props {
  proposalId?: string;
  eventType: string;
  fromNotificationItem: boolean;
}

export const ModalProposalStatus = ({
  proposalId,
  eventType,
  fromNotificationItem,
}: Props): ReactElement => {
  const proposalStore = useStore('proposalStore');
  const navigation = useNavigation();

  const proposalInfo = proposalId
    ? proposalStore.getProposalById(proposalId)
    : {};
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalRejectedVisible, setModalRejectedVisible] = useState(false);

  useEffect(() => {
    if (
      fromNotificationItem &&
      eventType === EventTypeState.fundingRequestAccepted
    ) {
      setModalSuccessVisible(true);
    } else if (
      fromNotificationItem &&
      eventType === EventTypeState.fundingRequestRejected
    ) {
      setModalRejectedVisible(true);
    }
  }, [fromNotificationItem, eventType]);

  useEffect(() => {
    let unsubscribeFromProposalById: FirestoreUnsubscribeFn;
    if (proposalId) {
      unsubscribeFromProposalById =
        proposalStore.subscribeToProposalById(proposalId);
    }

    return () => {
      unsubscribeFromProposalById && unsubscribeFromProposalById();
    };
  }, [proposalId]);

  function onClose(): void {
    setModalSuccessVisible(false);
    setModalRejectedVisible(false);
  }

  function goToProposal(): void {
    onClose();
    const navigate = CommonActions.navigate({
      name: NAVIGATION_SCREENS.PROPOSAL_SCREEN,
      params: {
        proposalId,
      },
    });
    navigation.dispatch(navigate);
  }

  return (
    <>
      <ModalProposalApproval
        isVisible={modalSuccessVisible}
        onPressClose={onClose}
        proposalInfo={proposalInfo}
        goToProposal={goToProposal}
      />
      <ModalProposalRejected
        isVisible={modalRejectedVisible}
        onPressClose={onClose}
        proposalInfo={proposalInfo}
        goToProposal={goToProposal}
      />
    </>
  );
};
