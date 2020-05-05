import {forwardRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

import React from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, text, layout} from '../Theme';
import Modal from 'react-native-modal';

const BottomSheetModal = forwardRef((props, ref) => {
  const renderSheetContent = () => {
    let contentStyle = {
      ...layout.content,
      ...styles.contentContainer,
    };

    return <View style={styles.content}>{props.children}</View>;

    /*
    return (
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Hi 👋!</Text>
        <Button testID={'close-button'} onPress={props.onClose} title="Close" />
      </View>
    );
    */
  };

  const onSwipeComplete = () => {
    console.log('On slipe complete');
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={props.isVisible}
      onSwipeComplete={onSwipeComplete}
      backdropOpacity={0.2}
      onBackButtonPress={props.onClose}
      onBackdropPress={props.onClose}
      //swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.view}>
      {renderSheetContent()}
    </Modal>
  );
});

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default BottomSheetModal;
