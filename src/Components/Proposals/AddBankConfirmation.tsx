import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';

export function AddBankConfirmation() {
  return (
    <View style={styles.container}>
      <Icon name="add-document" />
      <View style={styles.titleContainer}>
        <Text style={[styles.text, styles.title]}>
          Add bank account confirmation letter
        </Text>
        <Text style={[styles.text, styles.hint]}>
          The form can be found on the bank's website
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(244,246,255)',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  titleContainer: {
    marginLeft: 16,
  },
  text: {
    fontSize: 11,
  },
  title: {
    color: colors.black,
    marginBottom: 8,
  },
  hint: {
    color: 'rgb(86,102,245)',
  },
});
