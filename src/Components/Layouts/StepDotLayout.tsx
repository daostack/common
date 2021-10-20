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
import {inject} from 'mobx-react';
import {
  object,
  bool,
  number,
  func,
  string,
  shape,
  InferProps,
  oneOfType,
} from 'prop-types';
import {colors, layout} from '~/Theme';
import StepHeader from './StepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import StepDotHeader from './StepDotHeader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {uiStorePropTypes} from '~/Types/propTypes';
import IntercomShowButton from '~/Components/IntercomChat/IntercomShowButton';
// import UseAcknowledgment from '../../../Components/Proposals/UseAcknowledgment';
const {width} = Dimensions.get('window');

const props = {
  closeDialog: func,
  navigation: shape({
    popToTop: func.isRequired,
    pop: func.isRequired,
  }).isRequired,
  stepDotHeaderTitle: string,
  navTitle: string,
  currentIndex: number,
  skipFirstStep: bool,
  isRequestToJoin: bool,

  //ScrollView:
  onScrollEndDrag: func,

  prependedArea: object,
  appendedArea: oneOfType([bool, object]),
  requestStepActionButton: object,
  layoutTitle: object,
  children: object,
  uiStore: uiStorePropTypes.isRequired,
  onContentSizeChange: func,
  isRequestButtonSticky: bool,
};

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

const StepDotLayout: React.FC<InferProps<typeof props>> = ({
  navigation,
  stepDotHeaderTitle,
  navTitle,
  currentIndex,
  skipFirstStep,
  isRequestToJoin = false,
  requestStepActionButton,
  onScrollEndDrag,
  prependedArea,
  appendedArea,
  children,
  layoutTitle,
  uiStore,
  onContentSizeChange,
  isRequestButtonSticky = true,
}) => {
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
    uiStore.bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES,
      {
        navigation: navigation,
        onContinueEditing: () => uiStore.bottomSheetStore.hideBottomSheet(),
        onLeaveWithoutSaving: () => {
          uiStore.bottomSheetStore.hideBottomSheet();
          navigation.popToTop();
        },
      },
    );
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
              onPress={() => navigation.pop()}>
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
          navigation={navigation}
          headerHeight={headerHeight}
          isFirstStepSkipped={skipFirstStep}
          totalDots={currDotInfo.length}
          onClose={closeDialog}
        />
        {/* )} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          width={width}
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
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

StepDotLayout.propTypes = props;

const styles = StyleSheet.create({
  navBtn: {
    justifyContent: 'center',
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default inject('uiStore')(StepDotLayout);
