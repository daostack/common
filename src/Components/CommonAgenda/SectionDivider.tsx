import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '~/Theme';

const SectionDivider: FC = () => (
  <View style={styles.sectionDividerContent}>
    <View style={styles.sectionDivider} />
  </View>
);

const styles = StyleSheet.create({
  sectionDividerContent: {
    paddingHorizontal: 20,
  },
  sectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.grey4,
  },
});

export default SectionDivider;
