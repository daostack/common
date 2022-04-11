import React, {ReactElement} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '~/Theme';

interface Props {
  mt?: number;
  mb?: number;
}

export function Divider({mt = 0, mb = 0}: Props): ReactElement {
  return <View style={[styles.divider, {marginTop: mt, marginBottom: mb}]} />;
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
});
