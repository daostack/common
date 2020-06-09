import React, {useEffect, useState, useRef} from 'react';
import {FlatList, StyleSheet, View, Text, Dimensions} from 'react-native';

import ViewTabNoData from '../../Components/ViewTabNoData';
import ProposalService, {PROPOSAL_STAGE} from '../../Services/ProposalService';
import ProposalCard from '../../Components/Proposals/ProposalCard';
import {CommonActions} from '@react-navigation/native';
import {layout, colors, text, sizeXXL} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

import SwiperCard from '../../Components/SwiperCard';

const {width, height} = Dimensions.get('window');

const ProposalsList = props => {
  const commonId = props.commonId;
  const userId = props.userId;
  const isHistory = props.isHistory;
  const isSwiper = props.isSwiper;
  const navigation = props.navigation;
  const onCountChange = props.onCountChange;
  const onlyRequestsToJoin = props.onlyRequestsToJoin;
  const [list, setList] = useState([]);

  console.log('commonId', commonId);
  console.log('userId', userId);

  let listRef = useRef([]);
  let unsubscribe = null;
  useEffect(() => {
    const loadProposalInfo = async (commonId, userId, isHistory) => {
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
        userId,
        proposalStages,
        newList => {
          console.log('subscribe new lisy');
          setList(newList);
          if (onCountChange) {
            onCountChange(newList.length);
          }
        },
        listRef,
        onlyRequestsToJoin,
      );
    };

    loadProposalInfo(commonId, userId, isHistory);

    return () => {
      console.log('Unsubscribe -> ', unsubscribe);
      if (unsubscribe) {
        console.log('CALL UNSUBSCRIBE');
        unsubscribe();
      }
    };
  }, [commonId, isHistory]);

  const onReviewProposal = proposalId => {
    const navigate = CommonActions.navigate({
      name: 'ProposalScreen',
      params: {
        proposalId: proposalId,
      },
    });
    navigation.dispatch(navigate);
  };

  const renderProposalCard = (item, index) => {
    return (
      <ProposalCard
        key={item.id}
        data={item}
        onReviewProposal={e => onReviewProposal(item.id)}
      />
    );
  };

  return isSwiper ? (
    list.length > 0 ? (
      <View style={layout.flexRow}>
        <SwiperCard
          cardRenderer={(item, index) => renderProposalCard(item, index)}
          data={list}
          extraData={listRef}
        />
      </View>
    ) : (
      <View style={styles.emptyObjectContainer}>
        <Icon name="pencil" size={46} />
        <Text style={{...text.h3Black, ...layout.marginTopS}}>
          No Proposals
        </Text>
        <Text
          style={{
            ...text.blackText,
            ...text.centered,
            ...layout.marginTopS,
          }}>
          Join a common and propose actions you think it should take to achieve
          its goal
        </Text>
      </View>
    )
  ) : (
    <>
      {list.length > 0 ? (
        <FlatList
          data={list}
          renderItem={({item}) => renderProposalCard(item)}
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

const styles = StyleSheet.create({
  emptyObjectContainer: {
    ...layout.content,
    ...layout.marginTopM,
    borderRadius: 14,
    paddingHorizontal: sizeXXL,
    backgroundColor: colors.lightBlue,
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center',
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center',
  },
});

export default React.memo(ProposalsList);
