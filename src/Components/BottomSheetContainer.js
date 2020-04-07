import {forwardRef} from 'react';
import {View, StyleSheet} from 'react-native';

import React from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, text, layout} from '../Theme';

const BottomSheetContainer = forwardRef((props, ref) => {
  openBottomSheet = () => {};

  closeBottomSheet = () => {
    ref.snapTo(0);
  };

  renderSheetHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.draggingElement} />
      </View>
    );
  };

  renderSheetContent = () => {
    const contentStyle = {
      ...layout.content,
      ...layout.flexStart,
      ...styles.contentContainer,
    };

    return <View style={contentStyle}>{props.children}</View>;
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[0, 500]}
      renderContent={renderSheetContent}
      renderHeader={renderSheetHeader}
      enabledBottomInitialAnimation={true}
    />
  );
});

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
    ...layout.paddingTopM,
    zIndex: 5,
  },
  contentContainer: {
    paddingTop: 0,
    height: 600,
    backgroundColor: colors.white,
    zIndex: 6,
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

export default BottomSheetContainer;
