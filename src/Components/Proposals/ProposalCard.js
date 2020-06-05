import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, Animated} from 'react-native';
import {text, layout, colors} from '../../Theme';
import MemberCard from '../MemberCard';
import ProposalCardHeader from './ProposalCardHeader';
import ProposalService from '../../Services/ProposalService';
import FirebaseService from '../../Services/FirebaseService';
import ProposalApprovalTag from './ProposalApprovalTag';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ProposalCard = ({proposalId, data, onReviewProposal, containerStyle}) => {
  const [proposalInfo, setProposalInfo] = useState(false);
  const [proposedUser, setProposedUser] = useState(false);

  useEffect(() => {
    const getProposalInfo = async currProposalId => {
      try {
        let currProposalInfo = await ProposalService.getInstance().getProposalInfo(
          currProposalId,
        );

        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (currProposalInfo.joinAndQuit) {
          proposedMemberId = currProposalInfo.joinAndQuit.proposedMemberId;
          funding = currProposalInfo.joinAndQuit.funding;
        }
        //FundingRequest proposal
        else {
          proposedMemberId = currProposalInfo.fundingRequest.beneficiaryId;
          funding = currProposalInfo.joinAndQuit.amount;
        }

        console.log('proposedMemberId 1 -> ', proposedMemberId);

        const currProposedUser = await FirebaseService.getInstance().getUserById(
          proposedMemberId,
        );

        setProposedUser(currProposedUser);
        setProposalInfo({...currProposalInfo, ...{funding: funding}});

        console.log('proposedUser -> ', proposedUser);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    console.log('Console.log proposalId -> ', proposalId);

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
        if (currProposalInfo.joinAndQuit) {
          proposedMemberId = currProposalInfo.joinAndQuit.proposedMemberId;
          funding = currProposalInfo.joinAndQuit.funding;
        }
        //FundingRequest proposal
        else {
          proposedMemberId = currProposalInfo.fundingRequest.beneficiaryId;
          funding = currProposalInfo.joinAndQuit.amount;
        }

        console.log('proposedMemberId 2 -> ', proposedMemberId);

        const currProposedUser = await FirebaseService.getInstance().getUserById(
          proposedMemberId,
        );

        console.log('currProposedUser 2 -> ', currProposedUser);

        setProposedUser(currProposedUser);
        setProposalInfo(currProposalInfo);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    console.log('Console.log data -> ', data);

    if (data) {
      loadProposalInfo(data);
    }
  }, [data]);

  return (
    <Animated.View style={[styles.proposalCard, containerStyle]}>
      <ProposalCardHeader isBoosted={true} stage={proposalInfo.stage} />

      <View
        style={{
          ...layout.content,
          ...layout.flexStart,
          ...layout.paddingBottomL,
          ...{flexWrap: 'wrap'},
        }}>
        <Text
          style={{...text.h3Black, ...{textAlign: 'left', flexWrap: 'wrap'}}}>
          {proposalInfo?.title}
        </Text>

        <View style={layout.flexRow}>
          <MemberCard
            userInfo={proposedUser}
            proposalInfo={proposalInfo}
            memberCustomText={'3d ago'}
            isPending={false}
          />
        </View>

        <View style={{...layout.flexRow, ...layout.marginTopS}}>
          <ProposalApprovalTag iconName="approved" value={40} isMarked={true} />
          <ProposalApprovalTag
            iconName="declined"
            value={28}
            isMarked={false}
          />
          <ProposalApprovalTag
            iconName="discussion"
            value={121}
            isMarked={false}
          />
        </View>

        <View style={styles.proposalCardActionContainer}>
          <TouchableOpacity onPress={onReviewProposal}>
            <Text style={styles.proposalActionBtnText}>Review proposal</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    ...text.h3Black,
    fontWeight: '500',
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
