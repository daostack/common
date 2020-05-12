import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import MemberCard from '../MemberCard';
import ProposalCardHeader from './ProposalCardHeader';
import ProposalService from '../../Services/ProposalService';
import FirebaseService from '../../Services/FirebaseService';
import ProposalApprovalTag from './ProposalApprovalTag';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ProposalCard = ({proposalId, onReviewProposal}) => {
  const [proposalInfo, setProposalInfo] = useState(false);
  const [proposedUser, setProposedUser] = useState(false);

  useEffect(() => {
    const getProposalInfo = async proposalId => {
      try {
        let proposalInfo = await ProposalService.getInstance().getProposalInfo(
          proposalId,
        );

        //RequestToJoin proposal
        let proposedMemberId = null;
        let funding = null;
        if (proposalInfo.joinAndQuit) {
          proposedMemberId = proposalInfo.joinAndQuit.proposedMemberId;
          funding = proposalInfo.joinAndQuit.funding;
        }
        //FundingRequest proposal
        else {
          proposedMemberId = proposalInfo.fundingRequest.beneficiaryId;
          funding = proposalInfo.joinAndQuit.amount;
        }

        const proposedUser = await FirebaseService.getInstance().getUserById(
          proposedMemberId,
        );

        setProposedUser(proposedUser);
        setProposalInfo({...proposalInfo, ...{funding: funding}});

        console.log('proposalInfo -> ', proposalInfo);
        console.log('proposedUser -> ', proposedUser);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    getProposalInfo(proposalId);
  }, [proposalId]);

  return (
    <View style={styles.proposalCard}>
      <ProposalCardHeader isBoosted={true} />

      <View
        style={{
          ...layout.content,
          ...layout.flexStart,
          ...layout.paddingBottomL,
        }}>
        <Text style={{...text.h3Black, ...{textAlign: 'left'}}}>
          {proposalInfo?.title}
        </Text>

        <View style={layout.flexRow}>
          <MemberCard
            name={proposedUser?.displayName}
            memberCustomText={'3d ago'}
            imageUrl={proposedUser.photoURL}
            isPending={false}
          />
          <View
            style={{
              ...layout.content,
              ...{alignItems: 'flex-end'},
            }}>
            <Text style={text.h2Black}>{`$${proposalInfo?.funding}`}</Text>
            <Text style={text.smallGreyText}>02:02:02:02</Text>
          </View>
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
    </View>
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
    marginHorizontal: 20,
    ...layout.marginBottomL,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignSelf: 'stretch',

    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
  },
});

export default ProposalCard;
