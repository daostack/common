import React, {useCallback} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Common} from '~/Stores/Models/Common';
import {CommonHeaderBar} from './CommonHeaderBar';

const {width, height} = Dimensions.get('window');

let stickyHeightAddon = 62;
let statusBarHeight = Math.round(getStatusBarHeight(true));
const STICKY_HEADER_HEIGHT = statusBarHeight + stickyHeightAddon;
const DEFAULT_HEADER_HEIGHT = STICKY_HEADER_HEIGHT + 100 + stickyHeightAddon;

interface FlatListProps {
  currCommon: Common;
  hasPermission: boolean;
  openCommonOptionsModal: () => void;
  children: React.ReactNode;
}

export const CommonProfileFlatList = (props: FlatListProps) => {
  const {currCommon, children, openCommonOptionsModal, hasPermission} = props;
  const yIndex = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      yIndex.value = e.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          yIndex.value,
          [-height, 0],
          [5 * 1.5, 1],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          yIndex.value,
          [0, -height],
          [0, -(height / 5)],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const renderBackground = useCallback(
    () => (
      <Animated.View style={[styles.backgroundContainer, animatedStyle]}>
        <FastImage
          source={{
            uri: currCommon.image,
          }}
          style={styles.image}
        />
      </Animated.View>
    ),
    [currCommon.image, width, yIndex, animatedStyle],
  );

  return (
    <>
      <CommonHeaderBar
        currCommon={currCommon}
        openCommonOptions={openCommonOptionsModal}
        hasPermission={hasPermission}
        yIndex={yIndex}
      />
      <Animated.FlatList
        onScroll={onScroll}
        scrollEventThrottle={10}
        scrollIndicatorInsets={{right: 1}}
        listKey="CommonList"
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            {renderBackground()}
            {children}
          </>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    top: 0,
    height: DEFAULT_HEADER_HEIGHT,
    width: width,
  },
  image: {
    height: DEFAULT_HEADER_HEIGHT,
    width: width,
  },
});
