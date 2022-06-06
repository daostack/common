import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '~/Theme';

interface SectionDividerProps {
  padding: number;
}

const SectionDivider = ({padding}: SectionDividerProps) => (
  <View style={{paddingHorizontal: padding ? padding : 20}}>
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
