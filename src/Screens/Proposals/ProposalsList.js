import React, {useEffect, useState, useRef} from 'react';
import { FlatList, StyleSheet, View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import ViewTabNoData from '../../Components/ViewTabNoData';
import ProposalService, {PROPOSAL_STAGE} from '../../Services/ProposalService';
import ProposalCard from '../../Components/Proposals/ProposalCard';
import {CommonActions} from '@react-navigation/native';
import {layout, colors, font,text, sizeXXL} from '../../Theme';

import SwiperCard from '../../Components/SwiperCard';

import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';

const {width, height} = Dimensions.get('window');

const ProposalsList = ({ isMember, commonName, safeAddress, showAll, showMax, onlyFundingRequests, ...props}) => {
  const commonId = props.commonId;
  const userId = props.userId;
  const isHistory = props.isHistory;
  const isSwiper = props.isSwiper;
  const navigation = props.navigation;
  const onCountChange = props.onCountChange;
  const onlyRequestsToJoin = props.onlyRequestsToJoin;
  const [list, setList] = useState(null);

  let listRef = useRef([]);
  let unsubscribe = null;
  useEffect(() => {
    const loadProposalInfo = async (commonId, userId, isHistory, showAll, onlyFundingRequests) => {
      let proposalStages = null;
      if (isHistory) {
        // TODO: use ProposalsList.PROPOSAL_STAGES_HISTORY here
        proposalStages = [
          PROPOSAL_STAGE.ExpiredInQueue,
          PROPOSAL_STAGE.Executed,
        ];
      } else {
        // TODO: use ProposalsList.PROPOSAL_STAGES_ACTIVE here
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
        safeAddress,
        showAll,
        newList => {
          setList(newList);
          if (onCountChange) {
            onCountChange(newList.length);
          }
        },
        listRef,
        onlyRequestsToJoin,
        onlyFundingRequests,
      );
    };

    loadProposalInfo(commonId, userId, isHistory, showAll, onlyFundingRequests);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [commonId, isHistory]);

  const onReviewProposal = proposalId => {
    
    navigation.navigate('ProposalScreen', {
        proposalId: proposalId,
        screenTitle: commonName,
        isMember,
    });
  };

  const renderProposalCard = (item, index) => {
    return (
      isSwiper ? (
        index < showMax ? <ProposalCard
          key={item.id}
          data={item}
          onReviewProposal={e => onReviewProposal(item.id)}
        /> : <TouchableOpacity onPress={() => navigation.navigate('MyProposals')} style={{ ...styles.commonBox }}>
          <Text style={text.buttonblue}>{`View all ${list.length} Proposals`}</Text>
        </TouchableOpacity>

      ) : <ProposalCard
        key={item.id}
        data={item}
        onReviewProposal={e => onReviewProposal(item.id)}
      />);
  };


  return isSwiper ? (
    list ? (
      list.length > 0 ? (
        <View style={layout.flexRow}>
          <SwiperCard
            cardRenderer={(item, index) => renderProposalCard(item, index)}
            data={list}
            extraData={listRef}
            showMax={showMax}
          />
        </View>
      ) : (
        <View style={styles.emptyObjectContainer}>
          <Image
            source={require('../../../src/Assets/pencil.png')}
          />
          <Text style={{...text.h2Black, ...layout.marginTopS}}>
            No Proposals
          </Text>
          <Text
            style={styles.textNoProposals}>
            Join a common and propose actions you think it should take to
            achieve its goal
          </Text>
        </View>
      )
    ) : (
      <View style={{paddingHorizontal: 20}}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia
            style={{
              height: 200,
              width: '100%',
              marginBottom: 20,
              borderRadius: 26,
            }}
          />
        </Placeholder>
      </View>
    )
  ) : (
    <>
      {list && list.length > 0 ? (
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
    borderRadius: 14,
    paddingHorizontal: sizeXXL,
    backgroundColor: colors.iceBlue,
  },

  textNoProposals: {
    ...font.primary.regular,
    ...font.fontSize(2),
    ...text.centered,
    ...layout.marginTopS,
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
  commonBox: {
    width: '100%',
    height: 237,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
});

export default React.memo(ProposalsList);
