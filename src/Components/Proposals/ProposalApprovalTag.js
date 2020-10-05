import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {text, layout, colors} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {string, bool} from 'prop-types';

const ProposalApprovalTag = ({iconName, value, isMarked}) => {
  // Default colors
  let markColor = colors.grey3;
  let mainColor = colors.grey3;

  if (iconName === 'approved') {
    markColor = colors.lightGreen;
    mainColor = colors.lightishGreen;
  } else if (iconName === 'declined') {
    markColor = colors.against;
    mainColor = colors.error;
  }

  let containerStyle = isMarked
    ? {
      ...styles.container,
      ...{borderColor: mainColor, backgroundColor: markColor},
    }
    : styles.container;

  return (
    <View style={containerStyle}>
      <Icon name={iconName} size={10} style={styles.iconStyle} />
      <Text style={{...styles.title, ...{color: mainColor}}}>{value}</Text>
    </View>
  );
};

ProposalApprovalTag.propTypes = {
  iconName: string,
  value: string,
  isMarked: bool,
};


const styles = StyleSheet.create({
  title: {
    ...text.smallBlackText,
    ...text.bold,
    lineHeight: 18,
  },
  container: {
    ...layout.content,
    ...layout.flexRow,
    padding: 0,
    paddingHorizontal: 10,
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
