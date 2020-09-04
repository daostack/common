import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors, font, sizeL } from '~/Theme';

const MembershipRequest = () => {
  return <View style={styles.container}><Text style={styles.content}>Membership Request</Text></View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: sizeL,
  },
  content: {
    ...font.primary.bold,
    color: colors.againstBlackColor,
    ...font.fontSize(5),
  },
});

export default MembershipRequest;
