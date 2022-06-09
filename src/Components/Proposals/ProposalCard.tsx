import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {layout, colors, font} from '~/Theme';
import {MemberCard} from '../MemberCard';
import ProposalCardHeader from './ProposalCardHeader';
import ProposalService from '~/Services/ProposalService';
import {PROPOSAL_TYPE} from '~/Config';
import ProposalApprovalTag from './ProposalApprovalTag';
import Toast from '~/Util/Toast';
import logger from '../../Services/Logger';
import {FLAGS} from '../Moderation/constants';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {useStore} from '~/Util/hooks/useStore';
import ModerationMenu from '../Moderation/ModerationMenu';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {screenWidth} from '~/Util/dimensions';
import {useNavigation} from '@react-navigation/native';
import Icon from '~/Assets/iconfont/Icon';
import {ProposalCardUserImage} from '~/Components/Proposals/components/ProposalCardUserImage';

interface CardProps {
  proposalId: string;
  data: {};
  containerStyle: {};
  membershipRequest: boolean;
  isSwiper: boolean;
  commonInfo: {};
  hasPermission: boolean;
  openCommonOptions: () => void;
  hiddenProposalNote: () => void;
  viewerPermission: string;
  type: string;
}

export const ProposalCard = observer((props: CardProps) => {
  const {
    proposalId,
    containerStyle,
    isSwiper,
    commonInfo,
    openCommonOptions,
    hiddenProposalNote,
    viewerPermission,
    type,
  } = props;
  const navigation = useNavigation();
  const {userStore, proposalStore, commonStore, authStore} =
    useStore('rootStore');

  const {userInfo} = authStore;

  const proposalInfo = proposalStore.getProposalById(proposalId);

  let currentUserVote;
  const filteredVotes = proposalInfo?.votes.filter(
    (item) => item.voterId === userInfo?.uid,
  );

  if (filteredVotes?.length !== 0) {
    currentUserVote = filteredVotes?.[0].voteOutcome;
  }

  const {approvedCount, abstainedCount, rejectedCount, allVoteCount} =
    proposalStore.getVotesCounts(proposalInfo?.votes);

  const [proposalDiscussionCount, setProposalDiscussionCount] = useState(0);
  const isFundingRequest =
    proposalInfo?.type === PROPOSAL_TYPE.FundingAllocation;
  const isVisible =
    proposalInfo?.moderation?.flag !== FLAGS.hidden ||
    !proposalInfo?.moderation;
  const hasPermission = authStore.getPermission(
    proposalInfo?.commonId,
    authStore?.userInfo?.uid,
  );
  const showCard =
    isVisible || (!isVisible && hasPermission === PERMISSIONS.MODERATOR);
  const isOwner = authStore.isCurrentlyLogged(proposalInfo?.proposerId);

  useEffect(() => {
    let unsubscribeProposalDiscussionsCount = null;

    const getProposalInfo = async (currProposalId) => {
      try {
        unsubscribeProposalDiscussionsCount =
          await ProposalService.subscribeToProposalDiscussionsCount(
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

    if (proposalInfo) {
      getProposalInfo(proposalInfo.id);
    }

    return () => {
      unsubscribeProposalDiscussionsCount &&
        unsubscribeProposalDiscussionsCount();
    };
  }, [proposalInfo]);

  const cardWidth = () => {
    if (isSwiper && Platform.OS === 'ios') {
      return '100%';
    }
    return screenWidth - 40;
  };

  const onReviewProposal = async () => {
    if (proposalInfo?.isModerationHidden) {
      hiddenProposalNote();
    } else {
      let currCommonInfo = {...commonInfo};

      if (!currCommonInfo) {
        currCommonInfo = await commonStore.getCommonById(
          proposalInfo?.commonId,
        );
      }
      navigation.navigate('ProposalScreen', {
        proposalId: proposalInfo?.id,
        hasPermission,
        commonId: proposalInfo?.commonId,
      });
    }
  };

  const getReporter = () =>
    proposalInfo?.moderation?.reporter &&
    userStore.getUserById(proposalInfo?.moderation?.reporter);

  const showModerationMenu =
    (!proposalInfo?.isModerationHidden || hasPermission) &&
    !isSwiper &&
    !isOwner;

  return proposalInfo ? (
    <Animated.View
      style={[
        styles.proposalCard,
        containerStyle,
        {
          borderRadius: showCard ? 20 : 5,
          borderWidth: showCard ? 1 : 0,
        },
      ]}>
      <TouchableOpacity onPress={onReviewProposal}>
        <ProposalCardHeader
          state={proposalInfo?.state}
          paymentStatus={proposalInfo?.paymentState}
          closingAt={
            (proposalInfo?.moderation?.updatedAt.seconds ||
              proposalInfo?.createdAt.seconds) + proposalInfo?.countdownPeriod
          }
          isReported={proposalInfo.moderation?.flag !== FLAGS.visible}
          moderation={
            proposalInfo.moderation && {...proposalInfo.moderation, type}
          }
          reporter={getReporter()}
          hasPermission={hasPermission}
          viewerPermission={viewerPermission}
          showCard={showCard}
        />

        {showCard && (
          <View style={styles.containerView}>
            <View style={styles.titleContainer}>
              {isFundingRequest ? (
                <Text style={styles.title}>
                  {proposalInfo?.description?.title || 'Unknown title'}
                </Text>
              ) : (
                <View style={{flex: 12}} />
              )}
              {showModerationMenu && (
                <View style={{flex: 1}}>
                  <ModerationMenu showOptions={openCommonOptions} />
                </View>
              )}
            </View>
            <MemberCard
              openCommonOptions={openCommonOptions}
              showModerationMenu={showModerationMenu}
              showDate={proposalInfo.isJoinRequest}
              userInfo={userStore.getUserById(proposalInfo.proposerId)}
              proposalInfo={proposalInfo}
              commonId={proposalInfo.commonId}
              isPending={false}
            />
            <View style={styles.votes}>
              <View style={{...layout.flexRow}}>
                <ProposalApprovalTag
                  iconName="approved"
                  value={(approvedCount / allVoteCount) * 100 || 0}
                />
                <ProposalApprovalTag
                  iconName="abstained"
                  value={(abstainedCount / allVoteCount) * 100 || 0}
                />
                <ProposalApprovalTag
                  iconName="declined"
                  value={(rejectedCount / allVoteCount) * 100 || 0}
                />
              </View>
              {currentUserVote && (
                <ProposalCardUserImage currentUserVote={currentUserVote} />
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.proposalCardActionContainer}>
              <View style={styles.messageCountContainer}>
                {/* disable till we get the number of messages for proposals */}
                {false && (
                  <>
                    <Icon name="discussion" size={20} />
                    <Text style={styles.msgCount}>0</Text>
                  </>
                )}
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={onReviewProposal}>
                <Text style={styles.joinTheDiscussion}>
                  {proposalInfo.isJoinRequest
                    ? 'View request'
                    : 'View proposal'}
                </Text>
                <Icon name="right-arrow" size={20} color={colors.mainBlue} />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
});

const styles = StyleSheet.create({
  proposalCardActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proposalActionBtnText: {
    ...font.primary.regular,
    fontSize: 16,
    color: colors.mainBlue,
    marginVertical: 14,
  },
  containerView: {
    padding: 16,
  },
  proposalCard: {
    marginBottom: 24,
    backgroundColor: colors.white,

    borderStyle: 'solid',
    borderColor: colors.grey4,

    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
    elevation: 4,
  },
  title: {
    ...font.primary.bold,
    textAlign: 'left',
    flexWrap: 'wrap',
    fontSize: 16,
    flex: 12,
    color: colors.black,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  messageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgCount: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.grey3,
    paddingHorizontal: 5,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  joinTheDiscussion: {
    textAlign: 'right',
    ...font.primary.bold,
    fontSize: 16,
    color: colors.mainBlue,
  },
  divider: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 15,
    marginTop: 20,
    marginHorizontal: -16,
  },
  votes: {
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
