import React, {useEffect, useState, useRef} from 'react';
import {FlatList} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import ViewTabNoData from '../../Components/ViewTabNoData';
import ProposalService, {PROPOSAL_STAGE} from '../../Services/ProposalService';
import ProposalCard from '../../Components/Proposals/ProposalCard';

const ProposalsList = props => {
  const commonId = props.commonId;
  const isHistory = props.isHistory;
  const [list, setList] = useState([]);

  console.log('commonId', commonId);

  let listRef = useRef([]);
  let unsubscribe = null;
  useEffect(() => {
    const proposal = ProposalService.getInstance().getProposalInfo(
      '0x79557f003cc2f8d88435525f34480113ed8b6544b53ebf0f9092a96199021a7e',
    );

    console.log('proposal -> ', proposal);

    const loadProposalInfo = async (commonId, isHistory) => {
      console.log('Load proposal info -> ', commonId, isHistory);
      let proposalStages = null;
      if (isHistory) {
        proposalStages = [
          PROPOSAL_STAGE.ExpiredInQueue,
          PROPOSAL_STAGE.Executed,
        ];
      } else {
        proposalStages = [
          PROPOSAL_STAGE.Queued,
          PROPOSAL_STAGE.PreBoosted,
          PROPOSAL_STAGE.Boosted,
          PROPOSAL_STAGE.QuietEndingPeriod,
        ];
      }

      unsubscribe = await ProposalService.getInstance().subscribeToProposalList(
        commonId,
        proposalStages,
        newList => {
          console.log('subscribe new lisy');
          setList(newList);
        },
        listRef,
      );
    };

    loadProposalInfo(commonId);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [commonId, isHistory]);

  return (
    <>
      {list.length > 0 ? (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <ProposalCard
              key={item.id}
              data={item}
              onReviewProposal={props.onReviewProposal}
            />
          )}
          extraData={listRef}
        />
      ) : (
        <ViewTabNoData
          title={isHistory ? 'No Past activity' : 'No proposals yet'}
          subtitle={
            isHistory
              ? 'You will be able to see proposals that passed or were rejected here.'
              : 'Write your first proposals and invite members to make an impact together!'
          }
        />
      )}
    </>
  );
};

export default React.memo(ProposalsList);
