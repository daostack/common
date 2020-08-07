import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {colors, font} from '../Theme';
import Icon from '../Assets/iconfont/Icon';

const {width, height} = Dimensions.get('window');

const showHud = v => {
  DeviceEventEmitter.emit('HUD', v);
};

const showLoading = v => {
  DeviceEventEmitter.emit('HUD', v, true);
};
export default class Toast {
  static text(text) {
    showHud(
      <View
        style={{
          backgroundColor: colors.mainBlue,
          padding: 10,
          borderRadius: 10,
          width: width * 0.8,
        }}>
        <Text style={{color: colors.white}}>Text</Text>
      </View>,
    );
  }
  static info(text) {
    showHud(
      <View
        style={{...styles.container, ...{backgroundColor: colors.mainBlue}}}>
        <Icon name="check" size={20} color={colors.white} />
        <Text style={styles.text}>{text}</Text>
      </View>,
    );
  }
  static done(text) {
    showHud(
      <View
        style={{...styles.container, ...{backgroundColor: colors.mainBlue}}}>
        <Icon name="check" size={20} color={colors.white} />
        <Text style={styles.text}>{text}</Text>
      </View>,
    );
  }
  static success(text) {
    showHud(
      <View
        style={{
          ...styles.container,
          ...{backgroundColor: colors.mainBlue},
        }}>
        <Icon name="check" size={20} color={colors.white} />
        <Text style={styles.text}>{text}</Text>
      </View>,
    );
  }
  static error(text) {
    showHud(
      <View style={{...styles.container, ...{backgroundColor: colors.error}}}>
        <Icon name="close" size={10} color={colors.white} />
        <Text style={styles.text}>{text}</Text>
      </View>,
    );
  }

  static loading(text) {
    showLoading(
      // <View style={styles.loading} pointerEvents={'none'}>
      <View
        style={{...styles.container, ...{backgroundColor: colors.mainBlue}}}>
        {/* <Icon name="check" size={20} color={colors.white} /> */}
        <ActivityIndicator size="small" color={colors.white} />
        <Text style={styles.text}>{text}</Text>
      </View>,
      // </View>,
    );
  }

  static hide() {
    DeviceEventEmitter.emit('HUDHide');
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    width: width * 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 4,
  },
  text: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.white,
    flex: 1,
    marginLeft: 10,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});
