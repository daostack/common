import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';

// TODO: Modal here
export function AddBankAccount() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name="warning" size={16} color={colors.orange} />
        <Text style={styles.title}>
          You must provide a bank account {'\n'}number in order to receive funds
        </Text>
      </View>
      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0.5 : 1.0,
          },
          styles.button,
        ]}>
        <Text style={styles.buttonTitle}>Add Bank Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 152,
    backgroundColor: 'rgba(255,174,38, 0.1)',
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 22,
  },
  titleContainer: {
    marginTop: 24,
    marginHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 24,
    textAlign: 'left',
    fontSize: 14,
    color: colors.black,
  },
  button: {
    height: 48,
    backgroundColor: colors.white,
    marginHorizontal: 28,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grey4,
  },
  buttonTitle: {
    marginLeft: 24,
    textAlign: 'center',
    fontSize: 16,
    color: colors.orange,
  },
});
