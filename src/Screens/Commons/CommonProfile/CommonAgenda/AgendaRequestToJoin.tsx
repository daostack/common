import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RequestToJoinBtn} from '~/Screens/Commons/CommonProfile/components/RequestToJoinBtn';
import ProposalService from '~/Services/ProposalService';
import {Common} from '~/Stores/Models/Common';
import {useStore} from '~/Util/hooks/useStore';

interface RequestToJoinProps {
  requestToJoin: () => void;
  currCommon: Common;
  isMember: boolean;
}

export const AgendaRequestToJoin = (props: RequestToJoinProps) => {
  const {requestToJoin, currCommon, isMember} = props;
  const commonId = currCommon?.id;
  const authStore = useStore('authStore');
  const [requestIsPending, setRequestIsPending] = useState(false);

  useEffect(() => {
    let unsubscribe = null;
    let getPendingProposalsData = async () => {
      unsubscribe = await ProposalService.subscribeToPendingProposalsData(
        commonId,
        authStore?.userInfo?.uid,
        (data) => {
          if (!isMember) {
            if (data) {
              if (data.usersPendingProposal) {
                setRequestIsPending(true);
              } else {
                setRequestIsPending(false);
              }
            }
          }
        },
      );
    };

    getPendingProposalsData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [commonId, isMember, authStore?.userInfo?.uid]);

  return (
    <>
      {!isMember && !requestIsPending && (
        <View style={styles.upperActionButtonContainer}>
          <RequestToJoinBtn requestToJoin={requestToJoin} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  upperActionButtonContainer: {
    paddingHorizontal: 15,
    marginTop: 18,
  },
});
