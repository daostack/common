import React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';
import {styles} from './styles';

export function AddBankAccountTitle() {
  return (
    <View style={[styles.titleContainer]}>
      <FastImage
        source={require('~/Assets/transparent.png')}
        style={styles.fundingImage}
      />
      <Text
        style={[
          styles.title,
          {textAlign: 'center', marginLeft: 0, marginBottom: 12},
        ]}>
        You must provide a bank account number{'\n'} in order to receive funds{' '}
        {'\n'}(No one will have access to this but you)
      </Text>
    </View>
  );
}

export function AddBankAccountTitleError() {
  return (
    <View style={[styles.titleContainer, styles.titleErrorContainer]}>
      <Icon name="warning" size={16} color={colors.orange} />
      <Text style={[styles.title, styles.titleError]}>
        You must provide a bank account {'\n'}number in order to receive funds
      </Text>
    </View>
  );
}
