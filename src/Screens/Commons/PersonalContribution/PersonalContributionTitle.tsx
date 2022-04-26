import React, {ReactElement} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, font, sizeL} from '~/Theme';

export const PersonalContributionTitle = (): ReactElement => (
  <View style={styles.container}>
    <Text style={styles.content}>Personal Contribution</Text>
  </View>
);

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
