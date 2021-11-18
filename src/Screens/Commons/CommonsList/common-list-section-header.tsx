import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';

// eslint-disable-next-line react/prop-types
export const CommonListSectionHeader: React.FC<{title: string}> = ({title}) =>
  title === '' ? null : (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.header}>{title}</Text>
    </View>
  );

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    ...font.primary.bold,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.grey3,
    padding: 20,
  },
  sectionHeaderContainer: {
    marginHorizontal: -20,
    backgroundColor: colors.backgroundWhite,
  },
});
