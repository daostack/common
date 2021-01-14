import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  Animated,
  Dimensions,
} from 'react-native';
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
import {string, bool, object} from 'prop-types';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const {width} = Dimensions.get('window');

const ProposalCard = ({
  proposalId,
  data,
  navigation,
  containerStyle,
  membershipRequest,
  isSwiper,
  isMember,
  commonInfo,
}) => {
  const [proposalCardInfo, setProposalCardInfo] = useState(false);
  const [proposalDiscussionCount, setProposalDiscussionCount] = useState(0);

  useEffect(() => {
    let unsubscribeProposalDiscussionsCount = null;
    let unsubscribeProposalInfo = null;

    const getProposalInfo = async (currProposalId) => {
      try {
        unsubscribeProposalInfo = await ProposalService.getInstance().subscribeToProposalById(
          currProposalId,
          async (currProposalInfo) => {
            //RequestToJoin proposal
            let funding = null;
            if (currProposalInfo.type === PROPOSAL_TYPE.Join) {
              funding = currProposalInfo.join.funding;
            }
            //FundingRequest proposal
            else {
              funding = currProposalInfo.fundingRequest.amount;
            }
            const currProposedUser = await UserService.getInstance().getUserById(
              currProposalInfo.proposerId,
            );
            setProposalCardInfo({
              proposedUser: currProposedUser,
              proposalInfo: {...currProposalInfo, funding},
            });
          },
        );

        unsubscribeProposalDiscussionsCount = await ProposalService.getInstance().subscribeToProposalDiscussionsCount(
          currProposalId,
          (discussionsCount) => {
            setProposalDiscussionCount(discussionsCount);
          },
        );
      } catch (error) {
        logger.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (proposalId) {
      getProposalInfo(proposalId);
    }

    return () => {
      unsubscribeProposalDiscussionsCount &&
        unsubscribeProposalDiscussionsCount();
      unsubscribeProposalInfo && unsubscribeProposalInfo();
    };
  }, [proposalId]);

  useEffect(() => {
    let unsubscribeProposalDiscussionsCount = null;
    let unsubscribeProposalInfo = null;

    const loadProposalInfo = async (currProposalInfo) => {
      try {
        unsubscribeProposalInfo = await ProposalService.getInstance().subscribeToProposalById(
          currProposalInfo.id,
          async (updatedProposalInfo) => {
            //RequestToJoin proposal
            const proposedMemberUser = await UserService.getInstance().getUserById(
              updatedProposalInfo.proposerId,
            );
            let funding = null;
            if (updatedProposalInfo.type === PROPOSAL_TYPE.Join) {
              funding = updatedProposalInfo.join.funding;
            }
            //FundingRequest proposal
            else {
              funding = updatedProposalInfo.fundingRequest.amount;
            }
            const allProposalInfo = {...updatedProposalInfo, funding};
            setProposalCardInfo({
              proposedUser: proposedMemberUser,
              proposalInfo: allProposalInfo,
            });
          },
        );

        unsubscribeProposalDiscussionsCount = await ProposalService.getInstance().subscribeToProposalDiscussionsCount(
          currProposalInfo.id,
          (discussionsCount) => {
            setProposalDiscussionCount(discussionsCount);
          },
        );
      } catch (error) {
        logger.log('error: ', error);
        Toast.error(error?.toString());
      }
    };

    if (data) {
      loadProposalInfo(data);
    }

    return () => {
      unsubscribeProposalDiscussionsCount &&
        unsubscribeProposalDiscussionsCount();
      unsubscribeProposalInfo && unsubscribeProposalInfo();
    };
  }, [data]);

  const cardWidth = () => {
    if (isSwiper && Platform.OS === 'ios') {
      return '100%';
    }
    return width - 40;
  };

  const onReviewProposal = async () => {
    let currCommonInfo = commonInfo;

    if (!currCommonInfo) {
      currCommonInfo = await DaoService.getInstance().getDaoById(
        proposalCardInfo.proposalInfo.commonId,
      );
    }

    navigation.navigate('ProposalScreen', {
      title: commonInfo?.name,
      proposalId: proposalCardInfo.proposalInfo.id,
      proposalCardInfo,
      commonBalance: commonInfo?.balance,
      isMember,
      paymentState: proposalCardInfo.proposalInfo?.paymentState,
    });
  };

  return proposalCardInfo ? (
    <Animated.View
      style={[styles.proposalCard, containerStyle, {width: cardWidth()}]}>
      <TouchableOpacity onPress={onReviewProposal}>
        <ProposalCardHeader
          state={proposalCardInfo.proposalInfo?.state}
          paymentStatus={proposalCardInfo.proposalInfo?.paymentState}
          closingAt={
            proposalCardInfo.proposalInfo?.createdAt.seconds +
            proposalCardInfo.proposalInfo?.countdownPeriod
          }
        />

        <View
          style={{
            paddingTop: 0,
            paddingHorizontal: 7,
            ...layout.flexStart,
            flexWrap: 'wrap',
          }}>
          {proposalCardInfo?.proposalInfo?.type ===
            PROPOSAL_TYPE.FundingRequest && (
            <Text style={styles.title}>
              {proposalCardInfo.proposalInfo?.description?.title ||
                'Unknown title'}
            </Text>
          )}

          <MemberCard
            showDate={membershipRequest}
            userInfo={proposalCardInfo.proposedUser}
            proposalInfo={proposalCardInfo.proposalInfo}
            isPending={false}
          />
          <View style={{...layout.flexRow}}>
            <ProposalApprovalTag
              iconName="approved"
              value={proposalCardInfo?.proposalInfo.votesFor || 0}
              isMarked={true}
            />
            <ProposalApprovalTag
              iconName="declined"
              value={proposalCardInfo?.proposalInfo.votesAgainst || 0}
              isMarked={false}
            />
            <ProposalApprovalTag
              iconName="discussion"
              value={proposalDiscussionCount}
              isMarked={false}
            />
          </View>

          <View style={styles.proposalCardActionContainer}>
            <Text style={styles.proposalActionBtnText}>
              {membershipRequest ? 'View request' : 'View proposal'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <Animated.View
      style={[styles.proposalCard, containerStyle, {width: cardWidth()}]}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine
          width={40}
          style={{alignSelf: 'center', marginTop: 20}}
        />
        <View
          style={{
            ...layout.flexRow,
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <View style={{padding: 10}}>
            <PlaceholderMedia
              size={50}
              isRound={true}
              style={{borderWidth: 2, borderColor: colors.white}}
            />
          </View>
          <View style={{padding: 10, paddingVertical: 15, width: '100%'}}>
            <PlaceholderLine width={50} />
            <PlaceholderLine width={30} />
          </View>
        </View>
        <PlaceholderLine
          width={30}
          style={{alignSelf: 'center', marginTop: 10, marginBottom: 20}}
        />
      </Placeholder>
    </Animated.View>
  );
};

ProposalCard.propTypes = {
  proposalId: string,
  data: object,
  navigation: object,
  containerStyle: object,
  membershipRequest: bool,
  isSwiper: bool,
  isMember: bool,
  commonInfo: object,
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
  title: {
    ...text.h3Black,
    textAlign: 'left',
    width: '100%',
    flexWrap: 'wrap',
    padding: 10,
    fontSize: 16,
  },
});

export default ProposalCard;
