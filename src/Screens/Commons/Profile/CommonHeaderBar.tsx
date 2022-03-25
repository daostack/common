import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {font, text} from '~/Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  DYNAMIC_LINKS_TYPES,
  DYNAMIC_LINK_URI_PREFIX,
} from '~/Util/constants/dynamicLinks';
import Share from 'react-native-share';
import logger from '~/Services/Logger';
import {Common} from '~/Stores/Models/Common';
import {colors} from '~/Theme';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Svg, Path} from 'react-native-svg';

export const AnimatedPath = Animated.createAnimatedComponent(Path);

interface HeaderProps {
  currCommon: Common;
  hasPermission: boolean;
  openCommonOptions: () => void;
  yIndex: SharedValue<number>;
}

export const CommonHeaderBar = (props: HeaderProps) => {
  const {yIndex, currCommon, hasPermission, openCommonOptions} = props;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const onLeftPress = () => {
    navigation.pop();
  };

  const shareCommon = async () => {
    try {
      const url = await dynamicLinks().buildShortLink({
        link: `${DYNAMIC_LINK_URI_PREFIX}/${DYNAMIC_LINKS_TYPES.COMMON}/${currCommon.id}`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
        social: {
          title: currCommon.name,
          descriptionText: currCommon.metadata.description,
          imageUrl: currCommon.image,
        },
      });
      const options = {
        url,
        title: currCommon.name,
        message: `${currCommon.byline}. Download the Common app to join now.`,
      };
      Share.open(options);
    } catch (err) {
      logger.log('Deep Linking works only in production');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      yIndex.value,
      [0, 260 - (insets.top + 61)],
      ['transparent', colors.white],
    ),
    borderBottomColor: interpolateColor(
      yIndex.value,
      [0, 260 - (insets.top + 61)],
      ['transparent', colors.grey4],
    ),
  }));

  const animatedBlurStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      yIndex.value,
      [260 - (insets.top + 61), 260 - (insets.top + 60)],
      ['rgba(0, 0, 0, 0.25)', colors.white],
    ),
  }));

  const animatedIconStyle = useAnimatedProps(() => ({
    fill: interpolateColor(
      yIndex.value,
      [260 - (insets.top + 61), 260 - (insets.top + 60)],
      [colors.white, colors.black],
    ),
  }));

  const animatedTitle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          yIndex.value,
          [50, 260 - (insets.top + 80)],
          [20, -20],
          Extrapolate.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      yIndex.value,
      [50, 260 - (insets.top + 110)],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle, {paddingTop: insets.top}]}>
      <Pressable style={styles.leftButton} onPress={onLeftPress}>
        <Animated.View style={[styles.blur, animatedBlurStyle]}>
          <Svg viewBox="0 0 1024 1024" width={32} height={32}>
            <AnimatedPath
              d="M489.824 512l165.28 160.416c22.528 21.856 22.528 57.6 0 79.456a57.664 57.664 0 0 1-80 0l-206.208-200.16a55.072 55.072 0 0 1 0-79.424l206.208-200.128a57.6 57.6 0 0 1 80 0c22.528 21.856 22.528 57.6 0 79.456L489.824 512z"
              animatedProps={animatedIconStyle}
            />
          </Svg>
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.titleContainer, animatedTitle]}>
        <Text style={[styles.title]}>{currCommon.name}</Text>
      </Animated.View>

      <View style={[styles.rightContainer, {top: insets.top + 10}]}>
        <Pressable style={styles.rightButton} onPress={shareCommon}>
          <Animated.View style={[styles.blur, animatedBlurStyle]}>
            <Svg viewBox="0 0 1024 1024" width={32} height={32}>
              <AnimatedPath
                d="M697.152 224A102.976 102.976 0 0 1 800 326.848a102.976 102.976 0 0 1-102.848 102.88 102.528 102.528 0 0 1-70.88-28.384l-194.08 106.944a28.832 28.832 0 0 1-4.192 1.92l-0.704 3.424a26.144 26.144 0 0 1 4.896 2.08l194.08 106.944a102.528 102.528 0 0 1 70.88-28.384A102.976 102.976 0 0 1 800 697.152 102.976 102.976 0 0 1 697.152 800a102.976 102.976 0 0 1-99.68-128.224l-194.176-107.008-2.688-1.696a102.624 102.624 0 0 1-73.76 31.2C270.144 594.272 224 548.16 224 491.424s46.144-102.848 102.848-102.848c41.856 0 77.952 25.12 93.984 61.056l176.64-97.376A102.976 102.976 0 0 1 697.152 224z"
                animatedProps={animatedIconStyle}
              />
            </Svg>
          </Animated.View>
        </Pressable>
        {hasPermission && (
          <Pressable
            style={styles.rightButton}
            onPress={() => openCommonOptions()}>
            <Animated.View style={[styles.blur, animatedBlurStyle]}>
              <Svg viewBox="0 0 1024 1024" width={30} height={30}>
                <AnimatedPath
                  d="M512 256A128 128 0 1 1 511.936 0.064 128 128 0 0 1 512 256z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 640z m0 384a128 128 0 1 1-0.064-255.936A128 128 0 0 1 512 1024z"
                  animatedProps={animatedIconStyle}
                />
              </Svg>
            </Animated.View>
          </Pressable>
        )}
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
