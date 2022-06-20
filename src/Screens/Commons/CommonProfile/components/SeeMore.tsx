import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font} from '~/Theme';

export const SeeMore = ({onSeeMorePress, text}) => (
  <TouchableOpacity onPress={onSeeMorePress()} style={styles.seeMoreBtn}>
    <Text style={styles.seeMore}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  seeMoreBtn: {
    alignSelf: 'flex-end',
  },
  seeMore: {
    ...font.primary.regular,
    lineHeight: 20,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: colors.black,
  },
});
