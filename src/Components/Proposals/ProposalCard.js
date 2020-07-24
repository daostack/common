import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, Animated} from 'react-native';
import {text, layout, colors, font} from '../../Theme';
import MemberCard from '../MemberCard';
import ProposalCardHeader from './ProposalCardHeader';
import ProposalService, { PROPOSAL_TYPE } from '../../Services/ProposalService';
import FirebaseService from '../../Services/FirebaseService';
import ProposalApprovalTag from './ProposalApprovalTag';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from '../../Util/Toast';
import moment from 'moment';

const ProposalCard = ({proposalId, data, onReviewProposal, containerStyle}) => {
  const [proposalCardInfo, setProposalCardInfo] = useState(false);

  useEffect(() => {
    const getProposalInfo = async currProposalId => {
      try {
        let currProposalInfo = await ProposalService.getInstance().getProposalInfo(
          currProposalId,
        );

        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (currProposalInfo.type === PROPOSAL_TYPE.JoinAndQuit) {
          proposedMemberId = currProposalInfo.joinAndQuit.proposedMemberId;
          funding = currProposalInfo.description.funding;
        }
        //FundingRequest proposal
        else {

          const proposedMember = await FirebaseService.getInstance().getUserByAddress(
            currProposalInfo.fundingRequest.beneficiary,
          );
          proposedMemberId = proposedMember.id;
          funding = currProposalInfo.fundingRequest.amount;
        }

        const discussionsCount = await ProposalService.getInstance().getProposalDiscussionsCount(currProposalId);

        const currProposedUser = await FirebaseService.getInstance().getUserById(
          proposedMemberId,
        );

        setProposalCardInfo({
          proposedUser: currProposedUser,
          proposalInfo: {...currProposalInfo, ...{funding: funding}, discussionsCount},
        });

      } catch (error) {
        console.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (proposalId) {
      getProposalInfo(proposalId);
    }
  }, [proposalId]);

  useEffect(() => {
    const loadProposalInfo = async currProposalInfo => {
      try {
        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (currProposalInfo.type === PROPOSAL_TYPE.JoinAndQuit) {
          proposedMemberId = currProposalInfo.joinAndQuit.proposedMemberId;
          funding = currProposalInfo.description.funding;
        }
        //FundingRequest proposal
        else {
          const proposedMember = await FirebaseService.getInstance().getUserByAddress(
            currProposalInfo.fundingRequest.beneficiary,
          );
          proposedMemberId = proposedMember.id;
          funding = currProposalInfo.fundingRequest.amount;
        }

        const currProposedUser = await FirebaseService.getInstance().getUserById(
          proposedMemberId,
        );

        const discussionsCount = await ProposalService.getInstance().getProposalDiscussionsCount(currProposalInfo.id);

        const allProposalInfo = { ...currProposalInfo, ...{ funding: funding }, discussionsCount };

        setProposalCardInfo({
          proposedUser: currProposedUser,
          proposalInfo: allProposalInfo,
        });
      } catch (error) {
        console.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (data) {
      loadProposalInfo(data);
    }
  }, [data]);

  return (
    <Animated.View style={[styles.proposalCard, containerStyle]}>
      <TouchableOpacity onPress={onReviewProposal}>
        <ProposalCardHeader
          isBoosted={true}
          stage={proposalCardInfo.proposalInfo?.stageStr}
          winningOutcome={proposalCardInfo.proposalInfo?.winningOutcome}
          hasPassedExpiryDate={moment().isAfter(moment.unix(proposalCardInfo.proposalInfo?.closingAt))}
        />

        <View
          style={{
            ...layout.content,
            ...layout.flexStart,
            ...layout.paddingBottomL,
            ...{flexWrap: 'wrap'},
          }}>
          {proposalCardInfo?.proposalInfo?.type === PROPOSAL_TYPE.FundingRequest && <Text
            style={{ ...text.h3Black, ...{ textAlign: 'left', flexWrap: 'wrap' } }}>
            {proposalCardInfo.proposalInfo?.description?.title || 'Unknown title'}
          </Text>}

          <View style={layout.flexRow}>
            <MemberCard
              userInfo={proposalCardInfo.proposedUser}
              proposalInfo={proposalCardInfo.proposalInfo}
              isPending={false}
            />
          </View>

          <View style={{...layout.flexRow, ...layout.marginTopS}}>
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
              value={proposalCardInfo.proposalInfo?.discussionsCount}
              isMarked={false}
            />
          </View>

          <View style={styles.proposalCardActionContainer}>
            <Text style={styles.proposalActionBtnText}>Review proposal</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  proposalCardActionContainer: {
    ...layout.content,
    ...layout.marginTopL,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
    width: '100%',
  },
  proposalActionBtnText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.mainBlue,
  },

  proposalCard: {
    marginHorizontal: 5,
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
    //flex: 1,
    //flexWrap: 'wrap',
    //width: 350,
  },
});

export default ProposalCard;
