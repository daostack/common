import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { observer, inject } from 'mobx-react';
import React, { useRef, useEffect } from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { colors, text, layout } from '~/Theme';
import Animated from 'react-native-reanimated';

const BottomSheetContainer = props => {
  let ref = useRef();
  let fall = new Animated.Value(0);

  useEffect(() => {
    if (ref.current) {
      ref.current.snapTo(1);
    }
  }, []);

  const closeBottomSheet = () => {
    ref.current.snapTo(0);
  };

  const onClosed = () => {
    props.bottomSheetStore.hideBottomSheet();
  };

  const renderSheetHeader = () => {
    if (props.withoutHeader) {
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
        height: props.bottomSheetStore.topSnap + 100,
      },
    };

    if (props.withoutHeader) {
      contentStyle = { ...contentStyle, ...styles.contentContainerShadow };
    }
    return <View style={contentStyle}>{props.bottomSheetStore.template}</View>;
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <>
      <AnimatedTouchable
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          flex: 1,
          backgroundColor: '#000000',
          alignItems: 'center',
          opacity: Animated.sub(0.3, Animated.multiply(fall, 0.3)),
        }}
        onPress={closeBottomSheet}
      />

      <BottomSheet
        ref={ref}
        snapPoints={[0, props.bottomSheetStore.topSnap]}
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
});

export default inject('bottomSheetStore')(observer(BottomSheetContainer));
