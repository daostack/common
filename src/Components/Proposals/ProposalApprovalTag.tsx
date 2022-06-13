import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font, layout} from '~/Theme';
import {IconVoteApproved} from '~/Assets/iconfont/IconVoteApproved';
import {IconVoteDeclined} from '~/Assets/iconfont/IconVoteDeclined';
import {IconVoteAbstained} from '~/Assets/iconfont/IconVoteAbstained';
import {VOTE_STATUSES} from '~/Util/constants/votes';

interface TagProps {
  iconName: string;
  value: number;
  isMarked: boolean;
}

const ProposalApprovalTag = ({iconName, value, isMarked}: TagProps) => {
  let containerStyle = isMarked
    ? {
        ...styles.container,
      }
    : styles.container;

  return (
    <View style={containerStyle}>
      {iconName === VOTE_STATUSES.APPROVED ? (
        <IconVoteApproved size={16} style={styles.iconStyle} />
      ) : iconName === VOTE_STATUSES.ABSTAINED ? (
        <IconVoteAbstained size={16} style={styles.iconStyle} />
      ) : (
        <IconVoteDeclined size={16} style={styles.iconStyle} />
      )}
      <Text style={styles.title}>{value}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...font.primary.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.greySubtitle,
  },
  container: {
    ...layout.content,
    ...layout.flexRow,
    padding: 0,
    paddingRight: 24,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    height: 20,
  },
  iconStyle: {
    ...layout.marginRightXS,
  },
});

export default ProposalApprovalTag;
