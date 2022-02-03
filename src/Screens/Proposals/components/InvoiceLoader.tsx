import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Loader from '~/Components/Loader';
import {colors, font} from '~/Theme';

export const InvoiceLoader = (): ReactElement => (
  <View style={styles.container}>
    <Loader color={colors.mainBlue} isMedium />
    <Text style={styles.loaderText}>Loading Invoice</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  loaderText: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    color: colors.mainBlue,
    marginTop: 55,
  },
});
