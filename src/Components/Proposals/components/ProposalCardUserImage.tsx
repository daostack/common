import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IconVoteAbstained} from '~/Assets/iconfont/IconVoteAbstained';
import {IconVoteApproved} from '~/Assets/iconfont/IconVoteApproved';
import {IconVoteDeclined} from '~/Assets/iconfont/IconVoteDeclined';
import {colors} from '~/Theme';
import {VOTE_STATUSES} from '~/Util/constants/votes';
import {useStore} from '~/Util/hooks/useStore';

interface ImageProps {
  currentUserVote: string;
}

export const ProposalCardUserImage = (props: ImageProps) => {
  const {currentUserVote} = props;
  const authStore = useStore('authStore');

  const VoteIcon = useCallback(() => {
    switch (currentUserVote) {
      case VOTE_STATUSES.APPROVED:
        return <IconVoteApproved size={16} style={styles.iconStyle} />;
      case VOTE_STATUSES.ABSTAINED:
        return <IconVoteAbstained size={16} style={styles.iconStyle} />;
      case VOTE_STATUSES.REJECTED:
        return <IconVoteDeclined size={16} style={styles.iconStyle} />;
    }
  }, [currentUserVote]);

  return (
    <View style={styles.container}>
      <FastImage
        style={[styles.userImage]}
        source={{
          uri: authStore.userInfo?.photoURL,
        }}
      />
      {VoteIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    height: 31,
    width: 31,
  },
  userImage: {
    backgroundColor: colors.grey3,
    width: 28,
    height: 28,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
  iconStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
