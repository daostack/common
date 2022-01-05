import {View, StyleSheet, Pressable, BackHandler} from 'react-native';
import {observer, inject} from 'mobx-react';
import React, {useRef, useEffect} from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, text, layout} from '~/Theme';
import Animated, {Easing} from 'react-native-reanimated';
import {bool, object} from 'prop-types';
import {uiStorePropTypes} from '~/Types/propTypes';

const BottomSheetContainer = ({uiStore, withoutHeader, navigation}) => {
  let ref = useRef();
  let fall = new Animated.Value(0);
  const state = {
    backgroundOpacity: new Animated.Value(0.3),
  };

  useEffect(() => {
    const backAction = () => uiStore.bottomSheetStore.hideBottomSheet();
    BackHandler.addEventListener('hardwareBackPress', backAction);
    if (ref.current) {
      ref.current.snapTo(1);
    }

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const closeBottomSheet = () => {
    Animated.timing(state.backgroundOpacity, {
      duration: 150,
      toValue: 0,
      easing: Easing.in(Easing.linear),
    }).start();
    ref.current.snapTo(0);
  };

  const onClosed = () => {
    uiStore.bottomSheetStore.hideBottomSheet();
  };

  const animatedStyles = {
    opacity: state.backgroundOpacity,
  };

  const renderSheetHeader = () => {
    if (uiStore.bottomSheetStore) {
      return null;
    }
    return (
      <View style={styles.headerContainer}>
        <View style={styles.draggingElement} />
      </View>
    );
  };

  const renderSheetContent = () => {
    let contentStyle = {
      ...layout.content,
      ...styles.contentContainer,
      ...{
        padding: 0,
        height: uiStore.bottomSheetStore.topSnap + 100,
      },
    };

    if (withoutHeader) {
      contentStyle = {...contentStyle, ...styles.contentContainerShadow};
    }
    return (
      <View style={contentStyle}>
        {React.cloneElement(uiStore.bottomSheetStore.template, {navigation})}
      </View>
    );
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

  return (
    <>
      <AnimatedTouchable
        style={[styles.backgroundView, animatedStyles]}
        onPress={closeBottomSheet}
      />

      <BottomSheet
        ref={ref}
        snapPoints={[0, uiStore.bottomSheetStore.topSnap]}
        renderContent={renderSheetContent}
        renderHeader={renderSheetHeader}
        enabledBottomInitialAnimation={true}
        enabledInnerScrolling={false}
        onCloseEnd={onClosed}
        callbackNode={fall}
      />
    </>
  );
};

BottomSheetContainer.propTypes = {
  uiStore: uiStorePropTypes,
  withoutHeader: bool,
  navigation: object,
};

const styles = StyleSheet.create({
  headerContainer: {
    ...layout.content,
    ...layout.flexStart,
    backgroundColor: Colors.white,
    height: 30,

    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,

    borderColor: 'rgba(0, 0, 0, 0.3)',

    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowRadius: 12,
    shadowOpacity: 0.1,
    elevation: 10,
    ...layout.paddingTopM,
    zIndex: 5,
  },
  contentContainer: {
    paddingTop: 0,
    backgroundColor: colors.white,
    zIndex: 6,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },

  contentContainerShadow: {
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowRadius: 12,
    shadowOpacity: 0.1,
    elevation: 10,
    ...layout.paddingTopM,
    zIndex: 5,

    borderTopWidth: 1,
    borderTopColor: colors.grey3,
  },

  sheetTitleStyle: {
    ...text.centered,
    ...text.h3Black,
    ...layout.marginTopM,
  },

  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },

  draggingElement: {
    alignSelf: 'center',
    width: 72,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.paleblue,
  },
  backgroundView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
});

export default inject('uiStore')(observer(BottomSheetContainer));
