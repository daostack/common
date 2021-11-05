import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

import {font, colors, text, layout} from '~/Theme';

interface Props {
  showModal: boolean;
  closeModal: () => void;
  title: string;
  description: string;
}

const ModalPreview = ({showModal, closeModal, title, description}: Props) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={showModal}
    onRequestClose={closeModal}>
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <TouchableOpacity style={styles.btn} onPress={closeModal}>
            <Text style={styles.btnText}>Got it</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.triangle} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 54, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    width: '90%',
  },
  modal: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: colors.mainBlue,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    ...font.fontSize(5),
    ...font.heading.bold,
    color: colors.white,
    textAlign: 'center',
  },
  description: {
    ...text.greyText,
    ...font.fontSize(2),
    fontWeight: '600',
    color: colors.grey4,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  btn: {
    ...layout.btnOutline,
    height: 50,
  },
  btnText: {
    ...font.fontSize(3),
    color: colors.white,
  },
  triangle: {
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 13,
    borderTopColor: colors.mainBlue,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    alignSelf: 'center',
  },
});

export default ModalPreview;
