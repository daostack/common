import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {text} from '~/Theme';
import {BlurView} from '~/Components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderProps {
  onLeftPress: () => void;
  onRightPress: () => void;
  dark: boolean;
  shareCommon: () => void;
  hasPermission: boolean;
  openCommonOptions: () => void;
}

export const CommonHeaderBar = (props: HeaderProps) => {
  const {onLeftPress, dark, shareCommon, hasPermission, openCommonOptions} = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: insets.top}]}>
      <TouchableOpacity
        style={styles.leftButton}
        onPress={onLeftPress}>
        <BlurView style={styles.blur} isBlurring={dark}>
          <Icon
            name="left-arrow"
            size={32}
            color={dark ? 'black' : 'white'}
          />
        </BlurView>
      </TouchableOpacity>
      <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={shareCommon}>
            <BlurView style={styles.blur} isBlurring={dark}>
              <Icon
                name="share-32"
                size={32}
                color={dark ? 'black' : 'white'}
              />
            </BlurView>
          </TouchableOpacity>
          {hasPermission && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => openCommonOptions()}>
              <BlurView
                style={styles.optionsBlur}
                isBlurring={dark}>
                <Icon name="menu1" size={30} color={dark ? 'black' : 'white'} />
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    left: 5,
    backgroundColor: 'transparent',
  },
  blur: {
    padding: 5,
    borderRadius: 15,
  },
  optionsBlur: {
    padding: 6,
    borderRadius: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    marginRight: 10,
  },
  leftButton: {
    position: 'absolute',
    left: 0,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    right: 0,
  },
  text: {
    ...text.h2Black,
    maxWidth: '70%',
    alignSelf: 'center',
  },
});

