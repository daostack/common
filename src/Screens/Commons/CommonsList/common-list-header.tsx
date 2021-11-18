import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {font} from '~/Theme';

export const CommonListHeader = () => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: 15,
    }}>
    <Text style={styles.lengthCommons}>Explore Commons</Text>
  </View>
);

const styles = StyleSheet.create({
  lengthCommons: {
    ...font.fontSize(5),
    ...font.heading.bold,
  },
});
