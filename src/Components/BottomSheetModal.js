import {forwardRef} from 'react';
import {View, StyleSheet} from 'react-native';

import React from 'react';
import Modal from 'react-native-modal';

const BottomSheetModal = forwardRef(props => {
  const renderSheetContent = () => {
    return <View style={[styles.content, props.style]}>{props.children}</View>;
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
});

export default BottomSheetModal;
