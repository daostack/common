import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {font, sizeL} from '~/Theme';

const UpdatePaymentMethod = () => (
  <View style={styles.container}>
    <Text style={styles.content}>Update Payment Method</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: sizeL,
  },
  content: {
    ...font.primary.bold,
    ...font.fontSize(5),
  },
});

export default UpdatePaymentMethod;
