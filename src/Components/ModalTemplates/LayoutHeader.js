import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';
import { bool, func } from 'prop-types';

const LayoutHeader = ({onClose, hideLogo}) => (
  <View style={styles.headerSafeArea}>
    <View style={styles.spacer} />

    {!hideLogo && (
      <Image style={styles.logo} source={require('~/Assets/appLogo.png')} />
    )}

    <TouchableOpacity style={styles.closeBtn}>
      <Icon name="close" color={colors.black} size={20} onPress={onClose} />
    </TouchableOpacity>
  </View>
);

LayoutHeader.propTypes = {
  onClose: func.isRequired,
  hideLogo: bool
};
const styles = StyleSheet.create({
  spacer: {
    width: 20,
  },
  closeBtn: {
    padding: 5,
  },
  logo: {
    height: 24,
    width: 80,
  },
  headerSafeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default LayoutHeader;
