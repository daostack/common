import React, {useEffect, useMemo, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, {Easing, Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import Icon from '~/Assets/iconfont/Icon';
import {IProposalVote} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {Proposal} from '~/Stores/Models/Proposal';
import {colors, layout, text} from '~/Theme';

interface VotingPannelProps {
  currentUserVote: IProposalVote;
  сurrentUserPhotoUrl: string;
  proposalInfo: Proposal;
}

export const VotingPannel = (props: VotingPannelProps) => {
  const {currentUserVote, сurrentUserPhotoUrl, proposalInfo} = props;

  const [test, setTest] = useState(false);

  // const test = currentUserVote?.voteOutcome

  const animatedIndex = useSharedValue(0);
  const animatedSize = useSharedValue(50);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animatedIndex.value, {duration: 200, easing: Easing.linear}),
    height: withTiming(animatedSize.value, {duration: 200, easing: Easing.linear}),
    width: withTiming(animatedSize.value, {duration: 200, easing: Easing.linear}),
  }), [animatedIndex.value]);

  useEffect(() => {
    if (
      test ) {
      animatedIndex.value = 1;
      animatedSize.value = 26;
    }
  }, [test]);

  const containerStyle = useMemo(
    () => [
      {
        ...layout.marginRightXS,
        ...styles.imageContainer,
      },
      animatedStyle,
    ],
    [animatedStyle],
  );
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
        { // currentUserVote?.voteOutcome !== 'approved' ?
          test &&
          <Animated.View style={{
            ...layout.marginRightXS,
            ...styles.imageContainer,
            }}>
            <Animated.Image
              style={[styles.imageApprove, animatedStyle]}
              source={{uri: сurrentUserPhotoUrl}}
            />
            <Icon name={'iconVotingApproved16'} size={16} style={styles.iconStyle} />
          </Animated.View>
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
        { // currentUserVote?.voteOutcome !== 'rejected' ?
          test !== 'rejected' ?
          <Icon
            name="user-rejected"
            color={colors.against}
            size={25}
            style={layout.marginLeftXS}
          />
          :
          <View style={{
                  ...styles.imageContainer,
                  ...layout.marginLeftXS,
                }}>
            <Image
              style={styles.imageReject}
              source={{uri: сurrentUserPhotoUrl}}
              width={26}
              height={26}
            />
            <Icon name={'iconVotingRejected16'} size={16} style={styles.iconStyle} />
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
    <TouchableOpacity onPress={() => setTest(!test)}>
      <Text>yoyoyo</Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
  },
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: -12,
    bottom: -10,
    width: 50,
    height: 50,
  },
  imageApprove: {
    borderWidth: 2,
    borderRadius: 70,
    borderColor: colors.lightishGreen,
    alignSelf: 'center',
  },
  imageReject: {
    borderWidth: 2,
    borderRadius: 70,
    borderColor: colors.pinkishOrange,
    alignSelf: 'center',
  },
  iconStyle: {
    height: 11,
    width: 14,
    position: 'absolute',
    alignSelf: 'center',
    left: 15,
    bottom: -4,
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

