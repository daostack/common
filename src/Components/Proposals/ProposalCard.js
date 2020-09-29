import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Platform, View, Animated, Dimensions} from 'react-native';
import {text, layout, colors, font} from '~/Theme';
import MemberCard from '../MemberCard';
import ProposalCardHeader from './ProposalCardHeader';
import ProposalService from '~/Services/ProposalService';
import {PROPOSAL_TYPE} from '~/Config';
import UserService from '~/Services/UserService';
import DaoService from '~/Services/DaoService';
import ProposalApprovalTag from './ProposalApprovalTag';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from '~/Util/Toast';
import logger from '../../Services/Logger';
import {string, func, bool, object} from 'prop-types';
const {width} = Dimensions.get('window');

const ProposalCard = ({proposalId, data, onReviewProposal, containerStyle, membershipRequest, isSwiper}) => {
  const [proposalCardInfo, setProposalCardInfo] = useState(false);
  useEffect(() => {
    const getProposalInfo = async (currProposalId) => {
      try {
        let currProposalInfo = await ProposalService.getInstance().getProposalInfo(
          currProposalId,
        );

        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (currProposalInfo.type === PROPOSAL_TYPE.Join) {
          proposedMemberId = currProposalInfo.join.proposedMemberId;
          funding = currProposalInfo.description.funding;
        }
        //FundingRequest proposal
        else {

          const proposedMember = await UserService.getInstance().getUserByAddress(
            currProposalInfo.fundingRequest.beneficiary,
          );
          proposedMemberId = proposedMember.id;
          funding = currProposalInfo.fundingRequest.amount;
        }

        const discussionsCount = await ProposalService.getInstance().getProposalDiscussionsCount(currProposalId);

        const currProposedUser = await UserService.getInstance().getUserById(
          proposedMemberId,
        );

        setProposalCardInfo({
          proposedUser: currProposedUser,
          proposalInfo: {...currProposalInfo, ...{funding: funding}, discussionsCount},
        });

      } catch (error) {
        logger.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (proposalId) {
      getProposalInfo(proposalId);
    }
  }, [proposalId]);

  useEffect(() => {
    const loadProposalInfo = async (currProposalInfo) => {
      try {
        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (currProposalInfo.type === PROPOSAL_TYPE.Join) {
          proposedMemberId = currProposalInfo.join.proposedMemberId;
          funding = currProposalInfo.description.funding;
        }
        //FundingRequest proposal
        else {
          const proposedMember = await UserService.getInstance().getUserByAddress(
            currProposalInfo.fundingRequest.beneficiary,
          );
          proposedMemberId = proposedMember.id;
          funding = currProposalInfo.fundingRequest.amount;
        }

        const userFromDb = await UserService.getInstance().getUserById(
          proposedMemberId,
        );

        const currProposedUser = {
          ...userFromDb,
          daos: (await DaoService.getInstance().getUserDaos(userFromDb.uid, userFromDb.safeAddress)).docs?.map((dao) => dao.data()),
        };

        const discussionsCount = await ProposalService.getInstance().getProposalDiscussionsCount(currProposalInfo.id);

        const allProposalInfo = {...currProposalInfo, ...{funding: funding}, discussionsCount};

        setProposalCardInfo({
          proposedUser: currProposedUser,
          proposalInfo: allProposalInfo,
        });
      } catch (error) {
        logger.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (data) {
      loadProposalInfo(data);
    }
  }, [data]);

  const cardWidth = () => {
    if (isSwiper && Platform.OS === 'ios') {
      return '100%';
    }
    return width - 40;
  };

  return (
    <Animated.View style={[styles.proposalCard, containerStyle, {width: cardWidth()}]}>
      <TouchableOpacity onPress={onReviewProposal}>
        <ProposalCardHeader
          isBoosted
          showDate={membershipRequest}
          stage={proposalCardInfo.proposalInfo?.stageStr}
          closingAt={proposalCardInfo.proposalInfo?.closingAt}
          winningOutcome={proposalCardInfo.proposalInfo?.winningOutcome}
        />

        <View
          style={{
            paddingTop: 0,
            paddingHorizontal: 7,
            ...layout.flexStart,
            flexWrap: 'wrap',
          }}>
          {proposalCardInfo?.proposalInfo?.type === PROPOSAL_TYPE.FundingRequest && <Text
            style={{...text.h3Black, ...{textAlign: 'left', flexWrap: 'wrap', padding:10, fontSize: 16}}}>
            {proposalCardInfo.proposalInfo?.description?.title || 'Unknown title'}
          </Text>}

          <MemberCard
            showDate={membershipRequest}
            userInfo={proposalCardInfo.proposedUser}
            proposalInfo={proposalCardInfo.proposalInfo}
            isPending={false}
            showMemberCreatedDate={true}
          />
          <View style={{...layout.flexRow}}>
            <ProposalApprovalTag
              iconName="approved"
              value={proposalCardInfo.proposalInfo?.votesFor}
              isMarked={true}
            />
            <ProposalApprovalTag
              iconName="declined"
              value={proposalCardInfo.proposalInfo?.votesAgainst}
              isMarked={false}
            />
            <ProposalApprovalTag
              iconName="discussion"
              value={proposalCardInfo.proposalInfo?.discussionsCount.toString()}
              isMarked={false}
            />
          </View>

          <View style={styles.proposalCardActionContainer}>
            <Text style={styles.proposalActionBtnText}>
              {membershipRequest
                ? 'View request'
                : 'View proposal'
              }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


ProposalCard.propTypes = {
  proposalId: string,
  data: object,
  onReviewProposal: func,
  containerStyle: object,
  membershipRequest: bool,
  isSwiper: bool,
};

const styles = StyleSheet.create({
  proposalCardActionContainer: {
    // ...layout.content,
    ...layout.marginTopL,
    // ...layout.marginBottomL,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  proposalActionBtnText: {
    ...font.primary.regular,
    fontSize: 16,
    color: colors.mainBlue,
    marginVertical: 14,
  },

  proposalCard: {
    // marginHorizontal: 5,
    ...layout.marginBottomL,
    backgroundColor: colors.white,
    borderRadius: 20,
    //alignSelf: 'stretch',

    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,

    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 4,
  },
});

export default ProposalCard;
