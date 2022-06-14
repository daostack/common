import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Path} from 'react-native-svg';
import Icon from '~/Assets/iconfont/Icon';
import {HEADER_HEIGHT} from '~/Screens/Commons/components/commonConstants';
import {Common} from '~/Stores/Models/Common';
import {colors, font, text} from '~/Theme';

export const AnimatedPath = Animated.createAnimatedComponent(Path);

interface HeaderProps {
  currCommon: Common;
  isMember: boolean;
  openCommonOptions: () => void;
  yIndex: SharedValue<number>;
}

export const AgendaHeaderBar = (props: HeaderProps) => {
  const {yIndex, currCommon, openCommonOptions} = props;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const onLeftPress = () => {
    navigation.pop();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      yIndex.value,
      [0, HEADER_HEIGHT - (insets.top + 61)],
      ['transparent', colors.white],
    ),
    borderBottomColor: interpolateColor(
      yIndex.value,
      [0, HEADER_HEIGHT - (insets.top + 61)],
      ['transparent', colors.grey4],
    ),
  }));

  const animatedBlurStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      yIndex.value,
      [HEADER_HEIGHT - (insets.top + 61), HEADER_HEIGHT - (insets.top + 60)],
      ['rgba(0, 0, 0, 0.25)', colors.white],
    ),
  }));

  const animatedIconStyle = useAnimatedProps(() => ({
    fill: interpolateColor(
      yIndex.value,
      [HEADER_HEIGHT - (insets.top + 61), HEADER_HEIGHT - (insets.top + 60)],
      [colors.white, colors.black],
    ),
  }));

  const animatedTitle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          yIndex.value,
          [50, HEADER_HEIGHT - (insets.top + 80)],
          [20, -20],
          Extrapolate.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      yIndex.value,
      [50, HEADER_HEIGHT - (insets.top + 110)],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle, {paddingTop: insets.top}]}>
      <Pressable style={styles.leftButton} onPress={onLeftPress}>
        <Animated.View style={[styles.blur, animatedBlurStyle]}>
          <Icon
            name="left-arrow-animated"
            size={32}
            animatedIconStyle={animatedIconStyle}
          />
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.titleContainer, animatedTitle]}>
        <Text style={[styles.title]}>{currCommon?.name}</Text>
      </Animated.View>

      <View style={[styles.rightContainer, {top: insets.top + 10}]}>
        <Pressable
          style={styles.rightButton}
          onPress={() => openCommonOptions()}>
          <Animated.View style={[styles.blur, animatedBlurStyle]}>
            <Icon
              name="menu-horizontal-anim"
              size={26}
              animatedIconStyle={animatedIconStyle}
            />
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: colors.white,
    zIndex: 99,
    paddingBottom: 5,
    borderBottomWidth: 1,
    height: 105,
  },
  blur: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...text.h2Black,
    maxWidth: '70%',
    alignSelf: 'center',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    ...font.heading.bold,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  titleContainer: {
    height: 30,
    alignSelf: 'center',
  },
});
