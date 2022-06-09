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
import {AgendaHeaderBar} from './AgendaHeader/AgendaHeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  HEADER_BUTTON_HEIGHT,
  HEADER_HEIGHT,
} from '~/Screens/Commons/components/commonConstants';

const {width, height} = Dimensions.get('window');

let stickyHeightAddon = 62;
let statusBarHeight = Math.round(getStatusBarHeight(true));
const STICKY_HEADER_HEIGHT = statusBarHeight + stickyHeightAddon;
const DEFAULT_HEADER_HEIGHT = STICKY_HEADER_HEIGHT + 100 + stickyHeightAddon;

interface FlatListProps {
  currCommon: Common;
  openCommonOptionsModal: () => void;
  children: React.ReactNode;
  showMembershipAdmittance: boolean;
  renderMembershipAdmittanceBtn: () => any;
  isMember: boolean;
}

export const AgendaFlatList = (props: FlatListProps) => {
  const {currCommon, children, openCommonOptionsModal, isMember} = props;
  const yIndex = useSharedValue(0);
  const insets = useSafeAreaInsets();

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

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      yIndex.value,
      [
        HEADER_HEIGHT - insets.top + 110,
        HEADER_HEIGHT - insets.top + 110 + HEADER_BUTTON_HEIGHT,
      ],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <>
      <AgendaHeaderBar
        currCommon={currCommon}
        openCommonOptions={openCommonOptionsModal}
        isMember={isMember}
        yIndex={yIndex}
      />
      <Animated.FlatList
        onScroll={onScroll}
        scrollEventThrottle={10}
        scrollIndicatorInsets={{right: 1}}
        listKey="CommonList"
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>
            <Animated.View style={[styles.backgroundContainer, animatedStyle]}>
              <FastImage
                source={{
                  uri: currCommon.image,
                }}
                style={styles.image}
              />
            </Animated.View>
            {children}
          </>
        }
      />
      {showMembershipAdmittance && !isMember && (
        <Animated.View style={[styles.actionButtonContainer, animatedOpacity]}>
          {renderMembershipAdmittanceBtn()}
        </Animated.View>
      )}
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
  actionButtonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
  },
});
