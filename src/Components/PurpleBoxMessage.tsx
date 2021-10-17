import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {colors, sizeM} from '~/Theme';

export const PurpleBoxMessage = ({message}: {message: string}) => (
  <View style={styles.textContainer}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: colors.lighterBlue,
    marginBottom: sizeM,
    justifyContent: 'center',
    padding: 15,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.slate,
    paddingHorizontal: 5,
  },
});
