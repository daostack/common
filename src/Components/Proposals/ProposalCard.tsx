import {observer, inject} from 'mobx-react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {text, layout, colors, font} from '~/Theme';
import MemberCard from '../MemberCard';
import {ProposalCardHeader} from './ProposalCardHeader';
import ProposalApprovalTag from './ProposalApprovalTag';
import {ModerationMenu} from '../Moderation/ModerationMenu';
import {FLAGS} from '../Moderation/constants';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {useStore} from '~/Stores';
import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Common, Proposal} from '~/Stores/Models';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {EditType, PROPOSAL_TYPE} from '~/Types';

const {width} = Dimensions.get('window');

const ProposalCard: React.FC<{
  proposal: Proposal;
  containerStyle: ViewStyle;
  isSwiper: boolean;
  common: Common;
}> = ({proposal, containerStyle, isSwiper, common}) => {
  // Stores
  const {
    userStore,
    uiStore: {bottomSheetStore},
  } = useStore();
  const navigation = useNavigation();
  const isFundingRequest = proposal?.type === PROPOSAL_TYPE.FundingRequest;
  const isVisible =
    proposal.moderation?.flag !== FLAGS.hidden || !proposal.moderation;
  const hasPermission = common.getPermission();
  const showCard = isVisible || (!isVisible && !!hasPermission);
  const isOwner = proposal.proposerIsOwner;

  const cardWidth = () => {
    if (isSwiper && Platform.OS === 'ios') {
      return '100%';
    }
    return width - 40;
  };

  const onReviewProposal = async () => {
    if (proposal.isModerationHidden && proposal.moderation) {
      bottomSheetStore.showHiddenNote(
        proposal.moderation,
        EditType.rules,
        common.isModerator,
      );
    } else {
      navigation.navigate(NAVIGATION_SCREENS.PROPOSAL_SCREEN, {
        proposalId: proposal.id,
        hasPermission,
        commonId: proposal.commonId,
      });
    }
  };

  const getReporter = () =>
    proposal.moderation?.reporter &&
    userStore.getUserById(proposal.moderation?.reporter);

  return proposal ? (
    <Animated.View
      style={[
        styles.proposalCard,
        containerStyle,
        {width: cardWidth(), borderRadius: showCard ? 20 : 5},
      ]}>
      <TouchableOpacity onPress={() => onReviewProposal()}>
        <ProposalCardHeader proposal={proposal} common={common} />

        {showCard && (
          <View style={styles.containerView}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isFundingRequest &&
                  (proposal?.description?.title || 'Unknown title')}
              </Text>
              {(!proposal.isModerationHidden || hasPermission) &&
                isMember &&
                !isSwiper &&
                !isOwner &&
                proposal.moderation && (
                  <ModerationMenu
                    moderation={proposal.moderation}
                    common={common}
                  />
                )}
            </View>
            <MemberCard
              showDate={proposal.isJoinRequest}
              userInfo={userStore.getUserById(proposal.proposerId)}
              proposalInfo={proposal}
              commonId={proposal.commonId}
              isPending={false}
            />
            <View style={{...layout.flexRow}}>
              <ProposalApprovalTag
                iconName="approved"
                value={proposal.votesFor || 0}
                isMarked={true}
              />
              <ProposalApprovalTag
                iconName="declined"
                value={proposal.votesAgainst || 0}
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
                {proposal.isJoinRequest ? 'View request' : 'View proposal'}
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
