import React, {useState, useEffect} from 'react';
import {observer, inject} from 'mobx-react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {text, layout, colors, font} from '~/Theme';
import MemberCard from '../MemberCard';
import ProposalCardHeader from './ProposalCardHeader';
import {subscribeToProposalDiscussionsCount} from '~/Services/ProposalService';
import {PROPOSAL_TYPE} from '~/Config';
import ProposalApprovalTag from './ProposalApprovalTag';
import Toast from '~/Util/Toast';
import logger from '../../Services/Logger';
import {string, bool, object, func} from 'prop-types';
import ModerationMenu from '../../Components/Moderation/ModerationMenu';
import {FLAGS} from '../../Components/Moderation/constants';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {rootStorePropTypes} from '~/Types/propTypes';

const {width} = Dimensions.get('window');

const ProposalCard = ({
  proposalId,
  navigation,
  containerStyle,
  isSwiper,
  commonInfo,
  openCommonOptions,
  hiddenProposalNote,
  rootStore,
  isMember,
  viewerPermission,
}) => {
  // Stores
  const userStore = rootStore.userStore;
  const proposalStore = rootStore.proposalStore;
  const commonStore = rootStore.commonStore;
  const authStore = rootStore.authStore;

  const proposalInfo = proposalStore.getProposalById(proposalId);
  const [proposalDiscussionCount, setProposalDiscussionCount] = useState(0);
  const isFundingRequest = proposalInfo?.type === PROPOSAL_TYPE.FundingRequest;
  const isVisible =
    proposalInfo.moderation?.flag !== FLAGS.hidden || !proposalInfo.moderation;
  const hasPermission = authStore.getPermission(
    proposalInfo.commonId,
    authStore?.userInfo?.uid,
  );
  const showCard = isVisible || (!isVisible && hasPermission);
  const isOwner = authStore.isCurrentlyLogged(proposalInfo.proposerId);

  useEffect(() => {
    let unsubscribeProposalDiscussionsCount = null;

    const getProposalInfo = async (currProposalId) => {
      try {
        unsubscribeProposalDiscussionsCount =
          await subscribeToProposalDiscussionsCount(
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
    return width - 40;
  };

  const onReviewProposal = async () => {
    if (proposalInfo.isModerationHidden) {
      hiddenProposalNote();
    } else {
      let currCommonInfo = {...commonInfo};

      if (!currCommonInfo) {
        currCommonInfo = await commonStore.getCommonById(
          proposalInfo?.commonId,
        );
      }
      navigation.navigate('ProposalScreen', {
        proposalId: proposalInfo.id,
        hasPermission,
        commonId: proposalInfo.commonId,
      });
    }
  };

  const getReporter = () =>
    proposalInfo.moderation?.reporter &&
    userStore.getUserById(proposalInfo.moderation?.reporter);

  return proposalInfo ? (
    <Animated.View
      style={[
        styles.proposalCard,
        containerStyle,
        {width: cardWidth(), borderRadius: showCard ? 20 : 5},
      ]}>
      <TouchableOpacity onPress={() => onReviewProposal()}>
        <ProposalCardHeader
          state={proposalInfo?.state}
          paymentStatus={proposalInfo?.paymentState}
          closingAt={
            (proposalInfo?.moderation?.updatedAt.seconds ||
              proposalInfo?.createdAt.seconds) + proposalInfo?.countdownPeriod
          }
          isReported={proposalInfo.moderation?.flag !== FLAGS.visible}
          moderation={proposalInfo.moderation}
          reporter={getReporter()}
          hasPermission={hasPermission}
          viewerPermission={viewerPermission}
        />

        {showCard && (
          <View style={styles.containerView}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isFundingRequest &&
                  (proposalInfo?.description?.title || 'Unknown title')}
              </Text>
              {(!proposalInfo.isModerationHidden || hasPermission) &&
                isMember &&
                !isSwiper &&
                !isOwner && <ModerationMenu showOptions={openCommonOptions} />}
            </View>
            <MemberCard
              showDate={proposalInfo.isJoinRequest}
              userInfo={userStore.getUserById(proposalInfo.proposerId)}
              proposalInfo={proposalInfo}
              commonId={proposalInfo.commonId}
              isPending={false}
            />
            <View style={{...layout.flexRow}}>
              <ProposalApprovalTag
                iconName="approved"
                value={proposalInfo.votesFor || 0}
                isMarked={true}
              />
              <ProposalApprovalTag
                iconName="declined"
                value={proposalInfo.votesAgainst || 0}
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
                {proposalInfo.isJoinRequest ? 'View request' : 'View proposal'}
              </Text>
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
};

ProposalCard.propTypes = {
  proposalId: string,
  data: object,
  navigation: object,
  containerStyle: object,
  membershipRequest: bool,
  isSwiper: bool,
  commonInfo: object,
  hasPermission: bool,
  openCommonOptions: func,
  hiddenProposalNote: func,
  rootStore: rootStorePropTypes,
  isMember: bool,
  viewerPermission: string,
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
  containerView: {
    paddingTop: 0,
    paddingHorizontal: 7,
    ...layout.flexStart,
    //flexWrap: 'wrap',
  },
  proposalCard: {
    // marginHorizontal: 5,
    ...layout.marginBottomL,
    backgroundColor: colors.white,
    //borderRadius: 20,
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
    flexWrap: 'wrap',
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
});

export default inject('rootStore')(observer(ProposalCard));
