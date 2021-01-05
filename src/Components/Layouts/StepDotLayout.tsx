import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import {inject} from 'mobx-react';
import {object, bool, number, func, string, shape, InferProps} from 'prop-types';
import {colors, layout} from '~/Theme';
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import CreateStepDotHeader from './CreateStepDotHeader';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
// import UseAcknowledgment from '../../../Components/Proposals/UseAcknowledgment';
const {width} = Dimensions.get('window');

const props = {
  closeDialog: func,
  navigation: object,
  stepDotHeaderTitle: string,
  navTitle: string,
  currentIndex: number,
  prependedArea: object,
  appendedArea: object,
  requestStepActionButton: object,
  children: object,
  bottomSheetStore: shape({
    showBottomSheet: func,
    hideBottomSheet: func,
  }),
};

const StepDotLayout: React.FC<InferProps<typeof props>> = ({
  navigation,
  stepDotHeaderTitle,
  navTitle,
  currentIndex,
  requestStepActionButton,
  prependedArea,
  appendedArea,
  children,
  bottomSheetStore,
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
    setHeaderHeight(height);
  }, [scrollY]);

  const closeDialog = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
      navigation: navigation,
      onContinueEditing: () => bottomSheetStore.hideBottomSheet(),
      onLeaveWithoutSaving: () => {
        bottomSheetStore.hideBottomSheet();
        navigation.popToTop();
      },
    });
  };

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
            title: navTitle,
          }}
          rightButton={
            <TouchableOpacity
              style={{justifyContent: 'center'}}
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
          }
        />
        <CreateStepDotHeader
          title={stepDotHeaderTitle}
          currentIndex={currentIndex}
          navigation={navigation}
          headerHeight={headerHeight}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          width={width}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: scrollY}}},
          ],
          {useNativeDriver: false})}>
          <CreateStepHeader currentIndex={Number(currentIndex) - 1} />
          {children}
        </ScrollView>
        {requestStepActionButton}
      </SafeAreaView>
      {appendedArea}
    </>
  );
};

StepDotLayout.propTypes = props;

export default inject(
  'bottomSheetStore',
)(StepDotLayout);