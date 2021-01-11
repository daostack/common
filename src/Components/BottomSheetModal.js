import {View, StyleSheet} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {func, bool, object} from 'prop-types';

const BottomSheetModal = ({style, children, isVisible, onClose}) => {
  const renderSheetContent = () => (
    <View style={[styles.content, style]}>{children}</View>
  );

  const onSwipeComplete = () => {};

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      onSwipeComplete={onSwipeComplete}
      backdropOpacity={0.2}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.view}>
      {renderSheetContent()}
    </Modal>
  );
};

BottomSheetModal.propTypes = {
  style: object,
  children: object,
  isVisible: bool,
  onClose: func,
};

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
