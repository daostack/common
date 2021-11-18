import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import {colors, layout} from '~/Theme';
import StepHeader from './StepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import StepDotHeader from './StepDotHeader';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import IntercomShowButton from '~/Services/IntercomChat/IntercomShowButton';
import {useStore} from '~/Stores';
import {useNavigation, StackActions} from '@react-navigation/core';
// import UseAcknowledgment from '../~/Componentsposals/UseAcknowledgment';
const {width} = Dimensions.get('window');

const DOT_INFO_JOIN_REQUEST = [
  {
    dotIconName: 'account-selected',
  },
  {
    dotIconName: 'agenda-24',
  },
  {
    dotIconName: 'contribution-24',
  },
  {
    dotIconName: 'billing-details-24-copy-4',
  },
  {
    dotIconName: 'wallet-24',
  },
];

const DOT_INFO_CREATE_COMMON = [
  {
    dotIconName: 'dao-general-info-24',
  },
  {
    dotIconName: 'funds',
  },
  {
    dotIconName: 'agenda',
  },
  {
    dotIconName: 'style',
  },
];

const StepDotLayout: React.FC<{
  closeDialog(): void;
  stepDotHeaderTitle: string;
  navTitle: string;
  currentIndex: number;
  skipFirstStep?: boolean;
  isRequestToJoin?: boolean;

  //ScrollView:
  onScrollEndDrag(): void;
  prependedArea: React.ReactNode;
  appendedArea: React.ReactNode;
  requestStepActionButton: React.ReactNode;
  layoutTitle: React.ReactNode;
  onContentSizeChange(): void;
  isRequestButtonSticky?: boolean;
}> = ({
  stepDotHeaderTitle,
  navTitle,
  currentIndex,
  requestStepActionButton,
  onScrollEndDrag,
  prependedArea,
  appendedArea,
  children,
  layoutTitle,
  onContentSizeChange,
  skipFirstStep = false,
  isRequestToJoin = false,
  isRequestButtonSticky = true,
}) => {
  const {
    uiStore: {bottomSheetStore},
  } = useStore();
  const navigation = useNavigation();
  const [headerHeight, setHeaderHeight] = useState(new Animated.Value(0));
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [125, 185],
      outputRange: [0, 56],
      extrapolate: 'clamp',
    });

    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height as Animated.Value);
  }, [scrollY]);

  const closeDialog = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET.UNSAVED_CHANGES, {
      onContinueEditing: () => bottomSheetStore.hideBottomSheet(),
      onLeaveWithoutSaving: () => {
        bottomSheetStore.hideBottomSheet();
        navigation.dispatch(StackActions.popToTop());
      },
    });
  };

  const currDotInfo = isRequestToJoin
    ? DOT_INFO_JOIN_REQUEST
    : DOT_INFO_CREATE_COMMON;

  return (
    <>
      {prependedArea}
      <SafeAreaView style={layout.backgroundWhite} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <NavigationBar
          statusBar={{hidden: true}}
          style={{borderBottomWidth: 1, borderBottomColor: colors.grey4}}
          title={{
            title: navTitle || '',
          }}
          leftButton={
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigation.dispatch(StackActions.pop())}>
              <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
            </TouchableOpacity>
          }
          rightButton={
            <View style={styles.rightButtonsContainer}>
              <IntercomShowButton />
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => {
                  closeDialog();
                }}>
                <Icon
                  name="close"
                  size={18}
                  style={{marginRight: 20}}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          }
        />
        <StepDotHeader
          title={stepDotHeaderTitle}
          currentIndex={currentIndex}
          headerHeight={headerHeight}
          isFirstStepSkipped={skipFirstStep}
          totalDots={currDotInfo.length}
          onClose={closeDialog}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            width,
          }}
          scrollEventThrottle={16}
          onScrollEndDrag={onScrollEndDrag}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}>
          {layoutTitle}
          <StepHeader
            skipFirstDot={Boolean(skipFirstStep)}
            currentIndex={Number(currentIndex) - 1}
            dotInfo={currDotInfo}
          />
          {children}
          {!isRequestButtonSticky && requestStepActionButton}
        </ScrollView>
        {isRequestButtonSticky && requestStepActionButton}
      </SafeAreaView>
      {appendedArea}
    </>
  );
};

const styles = StyleSheet.create({
  navBtn: {
    justifyContent: 'center',
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StepDotLayout;
