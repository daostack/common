import {bool, number, string} from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font, layout} from '~/Theme';
import {IconVoteApproved} from '~/Assets/iconfont/IconVoteApproved';
import {IconVoteDeclined} from '~/Assets/iconfont/IconVoteDeclined';
import {IconVoteAbstained} from '~/Assets/iconfont/IconVoteAbstained';

const ProposalApprovalTag = ({iconName, value, isMarked}) => {
  let containerStyle = isMarked
    ? {
        ...styles.container,
      }
    : styles.container;

  return (
    <View style={containerStyle}>
      {iconName === 'approved' ? (
        <IconVoteApproved size={16} style={styles.iconStyle} />
      ) : iconName === 'abstained' ? (
        <IconVoteAbstained size={16} style={styles.iconStyle} />
      ) : (
        <IconVoteDeclined size={16} style={styles.iconStyle} />
      )}
      <Text style={styles.title}>{value}%</Text>
    </View>
  );
};

ProposalApprovalTag.propTypes = {
  iconName: string,
  value: number,
  isMarked: bool,
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
  notificationContainer: {},
});

export default ProposalApprovalTag;
