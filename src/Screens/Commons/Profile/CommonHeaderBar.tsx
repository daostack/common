import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
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
  const {
    onLeftPress,
    dark,
    shareCommon,
    hasPermission,
    openCommonOptions,
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: insets.top}]}>
      <Pressable style={styles.leftButton} onPress={onLeftPress}>
        <BlurView style={styles.blur} isBlurring={dark}>
          <Icon name="left-arrow" size={32} color={dark ? 'black' : 'white'} />
        </BlurView>
      </Pressable>
      <View style={styles.rightContainer}>
        <Pressable style={styles.rightButton} onPress={shareCommon}>
          <BlurView style={styles.blur} isBlurring={dark}>
            <Icon name="share-32" size={32} color={dark ? 'black' : 'white'} />
          </BlurView>
        </Pressable>
        {hasPermission && (
          <Pressable
            style={styles.rightButton}
            onPress={() => openCommonOptions()}>
            <BlurView style={styles.optionsBlur} isBlurring={dark}>
              <Icon name="menu1" size={30} color={dark ? 'black' : 'white'} />
            </BlurView>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  blur: {
    padding: 5,
    borderRadius: 15,
  },
  optionsBlur: {
    padding: 6,
    borderRadius: 15,
  },
  rightButton: {
    height: 42,
    justifyContent: 'center',
    marginLeft: 10,
  },
  leftButton: {
    width: 42,
    left: 16,
    top: 10,
  },
  rightContainer: {
    position: 'absolute',
    right: 16,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...text.h2Black,
    maxWidth: '70%',
    alignSelf: 'center',
  },
});
