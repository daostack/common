import React, {useEffect, ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import Icon from '~/Assets/iconfont/Icon';
import {IProposalVote} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {Proposal} from '~/Stores/Models/Proposal';
import {colors, layout, text} from '~/Theme';

interface VotingPannelProps {
  currentUserVote: IProposalVote;
  сurrentUserPhotoUrl: string;
  proposalInfo: Proposal;
}

export const VotingPannel = (props: VotingPannelProps): ReactElement => {
  const {currentUserVote, сurrentUserPhotoUrl, proposalInfo} = props;

  const animatedOpacity = useSharedValue(0);
  const animatedImageSize = useSharedValue(50);
  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animatedOpacity.value, {duration: 200, easing: Easing.linear}),
    height: withTiming(animatedImageSize.value, {duration: 200, easing: Easing.linear}),
    width: withTiming(animatedImageSize.value, {duration: 200, easing: Easing.linear}),
  }), [animatedOpacity.value, animatedImageSize.value]);

  const animatedIconSize = useSharedValue(36);
  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animatedOpacity.value, {duration: 200, easing: Easing.linear}),
    height: withTiming(animatedIconSize.value, {duration: 200, easing: Easing.linear}),
    width: withTiming(animatedIconSize.value, {duration: 200, easing: Easing.linear}),
  }), [animatedOpacity.value, animatedIconSize.value]);

  useEffect(() => {
    if (
      currentUserVote?.voteOutcome === 'rejected'
      || currentUserVote?.voteOutcome === 'approved') {
      animatedOpacity.value = 1;
      animatedImageSize.value = 26;
      animatedIconSize.value = 18;
    }
  }, [currentUserVote?.voteOutcome]);

  return (
    <View
    style={{
      ...layout.content,
      ...styles.container,
    }}>
    <View style={styles.proposalProgressInfo}>
      <View
        style={{
          ...layout.content,
          ...layout.flexRow,
          padding: 0,
        }}>
        <Icon
          name="user-approved"
          color={colors.lightishGreen}
          size={25}
          style={layout.marginRightXS}
        />
        { currentUserVote?.voteOutcome === 'approved' &&
          <View style={{
            ...layout.marginRightXS,
            ...styles.imageLeftContainer,
            }}>
            <Animated.Image
              style={[styles.imageApprove, animatedImageStyle]}
              source={{uri: сurrentUserPhotoUrl}}
            />
            <View style={styles.iconContainer}>
              <Animated.Image
                style={[styles.iconStyle, animatedIconStyle]}
                source={require('~/Assets/iconsApproved16.png')}
              />
            </View>
          </View>
        }
        <Text style={text.lightishGreenText}>
          {proposalInfo.votesFor}
        </Text>
      </View>

      <Text style={text.blackActionText}>
        {!proposalInfo.votesCount
          ? 'No votes yet'
          : `${proposalInfo.votesCount} ${
              proposalInfo.votesCount > 1 ? 'votes' : 'vote'
            }`}
      </Text>

      <View
        style={{
          ...layout.content,
          ...layout.flexRow,
          padding: 0,
        }}>
        <Text style={text.againstText}>
          {proposalInfo.votesAgainst}
        </Text>
        <Icon
          name="user-rejected"
          color={colors.against}
          size={25}
          style={layout.marginLeftXS}
        />
        { currentUserVote?.voteOutcome === 'rejected' &&
          <View style={{
                  ...styles.imageRightContainer,
                  ...layout.marginLeftXS,
                }}>
            <Animated.Image
              style={[styles.imageReject, animatedImageStyle]}
              source={{uri: сurrentUserPhotoUrl}}
              width={26}
              height={26}
            />
            <View style={styles.iconContainer}>
              <Animated.Image
                style={[styles.iconStyle, animatedIconStyle]}
                source={require('~/Assets/iconsReject16.png')}
              />
            </View>
          </View>
        }
      </View>
    </View>
    <View
      style={{
        ...styles.proposalProgressBar,
        ...{
          backgroundColor: isNaN(
            proposalInfo?.progressBarWidthPercent,
          )
            ? colors.grey4
            : colors.against,
        },
      }}>
      <View
        style={{
          ...styles.proposalInnerProgressBar,
          width: `${proposalInfo?.progressBarWidthPercent || 0}%`,
        }}
      />
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
  },
  imageLeftContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: -38,
    bottom: -36,
    width: 100,
    height: 100,
  },
  imageRightContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -38,
    bottom: -36,
    width: 100,
    height: 100,
  },
  imageApprove: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 70,
    borderColor: colors.lightishGreen,
    alignSelf: 'center',
  },
  imageReject: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 70,
    borderColor: colors.pinkishOrange,
    alignSelf: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 26,
    bottom: 28,
  },
  iconStyle: {
    position: 'absolute',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  proposalProgressBar: {
    width: '100%',
    borderRadius: 7,
    height: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...layout.marginTopS,
  },
  proposalInnerProgressBar: {
    borderRadius: 6,
    backgroundColor: colors.lightishGreen,
    height: 8,
  },
  proposalProgressInfo: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    padding: 0,
    justifyContent: 'space-between',
  },
});

