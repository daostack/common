import React, {useEffect, useState, useRef} from 'react';
import {FlatList, StyleSheet, View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import ViewTabNoData from '~/Components/ViewTabNoData';
import ProposalService, {PROPOSAL_STAGE} from '~/Services/ProposalService';
import ProposalCard from '~/Components/Proposals/ProposalCard';
import {layout, colors, font, text, sizeM} from '~/Theme';
import DaoService from '~/Services/DaoService';
import SwiperCard from '~/Components/SwiperCard';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import {PROPOSAL_STAGES_ACTIVE, PROPOSAL_STAGES_HISTORY} from '~/Services/ProposalService';
import moment from 'moment';
import logger from '../../Services/Logger';
import {string, bool, object, number, shape, func} from 'prop-types';
const {width, height} = Dimensions.get('window');

const ProposalsList = ({isMember,
  commonInfo,
  safeAddress,
  showAll,
  showMax,
  onlyFundingRequests,
  userId,
  membershipRequests,
  isHistory,
  isSwiper,
  navigation,
  onCountChange,
  onlyRequestsToJoin,
  includeHistoryInCount}) => {

  const commonId = commonInfo?.id;
  const commonName = commonInfo?.name;

  const [list, setList] = useState(null);

  let listRef = useRef([]);
  let unsubscribe = null;
  useEffect(() => {
    const loadProposalInfo = async (loadCommonId, loadUserId, loadIsHistory, loadShowAll, loadOnlyFundingRequests, loadMembershipRequests) => {
      let proposalStages = [...PROPOSAL_STAGES_HISTORY, ...PROPOSAL_STAGES_ACTIVE];

      unsubscribe = await ProposalService.getInstance().subscribeToProposalList(
        loadCommonId,
        loadUserId,
        proposalStages,
        safeAddress,
        loadShowAll,
        (newList) => {
          // logger.log(newList, PROPOSAL_STAGE.Executed);
          const history =  newList.filter((proposal) => PROPOSAL_STAGES_HISTORY.some((stg) => stg === proposal.stageStr) || moment().isAfter(moment.unix(proposal.closingAt)));
          const active = newList.filter((proposal) => PROPOSAL_STAGES_ACTIVE.some((stg) => stg === proposal.stageStr) && !moment().isAfter(moment.unix(proposal.closingAt)));

          const filteredList = loadIsHistory
            ? history
            : active;

          setList(filteredList);
          if (onCountChange) {
            if (includeHistoryInCount) {
              onCountChange(history.length + active.length);
            } else {
              onCountChange(filteredList.length);
            }
          }
        },
        listRef,
        onlyRequestsToJoin,
        loadOnlyFundingRequests,
        loadMembershipRequests
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

    let currCommonName = commonName;
    let currCommonBalance = commonInfo?.balance;

    if (!commonInfo) {
      const currCommonInfo = await DaoService.getInstance().getDaoById(daoId);
      currCommonName = currCommonInfo.name;
      currCommonBalance = currCommonInfo.balance;
    }

    navigation.navigate('ProposalScreen', {
      title: currCommonName,
      proposalId: proposalId,
      commonBalance: currCommonBalance,
      isMember,
    });
  };

  const renderProposalCard = (item, index) => (
    isSwiper ? (
      !showMax || (index < showMax) ? (
        <ProposalCard
          key={item.id}
          data={item}
          isSwiper={true}
          membershipRequest={membershipRequests}
          onReviewProposal={(e) => onReviewProposal(item.id, item.dao)}
        />
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('MyProposals', {onlyFundingRequests: onlyFundingRequests, onlyMembershipRequests: membershipRequests})}
          style={{...styles.commonBox}}
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
      onReviewProposal={(e) => onReviewProposal(item.id, item.dao)}
    />);


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
            style={{height: 100, width: 100}}
            source={require('../../../src/Assets/pencil.png')}
          />
          <Text style={{...text.h2Black, ...layout.marginTopS}}>
            {membershipRequests
              ? 'No Active Requests'
              : 'No Active Proposals'
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
            {!isHistory && <View style={styles.newMemberMsgContainer}>
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

ProposalsList.propTypes = {
  includeHistoryInCount: bool,
  isMember: bool,
  commonInfo: shape({
    id: string,
    name: string,
  }),
  safeAddress: string,
  showAll: bool,
  showMax: number,
  onlyFundingRequests: bool,
  membershipRequests: bool,
  userId: string,
  isHistory: bool,
  isSwiper: bool,
  navigation: object,
  onCountChange: func,
  onlyRequestsToJoin: bool,
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

export default React.memo(ProposalsList);
