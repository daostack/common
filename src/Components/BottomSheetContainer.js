import {forwardRef} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import React from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, text, layout} from '../Theme';
import GSignInButton from '../Components/GSignInButton';

const BottomSheetContainer = forwardRef((props, ref) => {
  openBottomSheet = () => {};

  closeBottomSheet = () => {
    ref.snapTo(0);
  };

  renderSheetHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.draggingElement} />
        <Text style={styles.sheetTitleStyle}>Be a part of Common</Text>
      </View>
    );
  };

  renderSheetContent = () => {
    const contentStyle = {
      ...layout.content,
      ...layout.flexStart,
      ...styles.contentContainer,
    };

    return (
      <View style={contentStyle}>
        <Text
          style={{
            ...styles.sheetTextStyle,
            ...layout.marginBottomXL,
          }}>
          To join this Common you need to be connected with your Google account
        </Text>

        <GSignInButton />

        <View style={layout.paddingHorizontalXL}>
          <Text
            style={{
              ...styles.sheetTextStyle,
              ...layout.marginTopL,
            }}>
            By clicking next you are accepting the Common app terms of use
          </Text>
        </View>
      </View>
    );
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
    height: 80,

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
    height: 550,
    backgroundColor: Colors.white,
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
    width: 72,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.paleblue,
  },
});

export default BottomSheetContainer;
