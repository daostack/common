import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import ViewTabNoData from '../../Components/ViewTabNoData';
import ProposalService, {PROPOSAL_STAGE} from '../../Services/ProposalService';
import ProposalCard from '../../Components/Proposals/ProposalCard';
import {layout, colors, font, text, sizeXXL, sizeM} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';
import SwiperCard from '../../Components/SwiperCard';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import { PROPOSAL_STAGES_ACTIVE, PROPOSAL_STAGES_HISTORY} from '../../Services/ProposalService';

const {width, height} = Dimensions.get('window');

const ProposalsList = ({ isMember, commonInfo, safeAddress, showAll, showMax, onlyFundingRequests, userId, membershipRequests, ...props}) => {
  const commonId = commonInfo?.id;
  const commonName = commonInfo?.name;

  const isHistory = props.isHistory;
  const isSwiper = props.isSwiper;
  const navigation = props.navigation;
  const onCountChange = props.onCountChange;
  const onlyRequestsToJoin = props.onlyRequestsToJoin;
  const [list, setList] = useState(null);

  let listRef = useRef([]);
  let unsubscribe = null;
  useEffect(() => {
    const loadProposalInfo = async (commonId, userId, isHistory, showAll, onlyFundingRequests, membershipRequests) => {
      let proposalStages = isHistory ? PROPOSAL_STAGES_HISTORY : PROPOSAL_STAGES_ACTIVE;
      
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
        membershipRequests
      );
    };

    loadProposalInfo(commonId, userId, isHistory, showAll, onlyFundingRequests, membershipRequests);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [commonId, isHistory, userId, safeAddress]);

  const onReviewProposal = async ( proposalId, daoId ) => {
    navigation.navigate('ProposalScreen', {
      proposalId: proposalId,
      screenTitle: commonName || await FirebaseService.getInstance().getDaoNameById(daoId),
      commonBalance: commonInfo?.balance,
      isMember,
    });
  };

  const renderProposalCard = (item, index) => {
    return (
      isSwiper ? (
        !showMax || (index < showMax) ? (
          <ProposalCard
            key={item.id}
            data={item}
            isSwiper={true}
            membershipRequest={membershipRequests}
            onReviewProposal={e => onReviewProposal(item.id, item.dao)}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('MyProposals')}
            style={{ ...styles.commonBox }}
          >
            <Text style={text.buttonblue}>
              {`View all ${list.length} ${membershipRequests ? 'Requests' : 'Proposals'}`}
            </Text>
          </TouchableOpacity>
        )

      ) : <ProposalCard
        key={item.id}
        data={item}
        isSwiper={false}
        membershipRequest={membershipRequests}
        onReviewProposal={e => onReviewProposal(item.id, item.dao)}
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
            {membershipRequests
              ? 'No Requests'
              : 'No Proposals'
            }
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
        <>
          {!props.isHistory && <View style={styles.newMemberMsgContainer}>
            <Text style={styles.newMemberMsg}>New members need to be approved to join the Common.</Text>
          </View>}
          <FlatList
            data={list}
            renderItem={({item}) => renderProposalCard(item)}
            extraData={listRef}
          />
        </>
      ) : (
        <ViewTabNoData
          title={
            isHistory
              ? 'No Past activity'
              : membershipRequests
                ? 'No requests yet'
                : 'No proposals'
          }
          subtitle={
            isHistory
              ? 'You will be able to see proposals that passed or were rejected here.'
              : 'Propose actions or request funding by creating proposals. The Common members will vote and decide to accept or reject them.'
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
    backgroundColor: colors.iceBlue,
    alignSelf: 'center',
    marginHorizontal: 12,
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
  newMemberMsg: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.slate,
  },
  newMemberMsgContainer: {
    paddingBottom: sizeM,
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
    elevation: 6,
  },
});

ProposalsList.propTypes = {
  onlyFundingRequests: PropTypes.bool,
  membershipRequests: PropTypes.bool,
};

export default React.memo(ProposalsList);
