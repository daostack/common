import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {BottomRightButton} from '.';
import {font, colors, text, layout} from '~/Theme';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

const ModalCreateCommon = ({showModal, closeModal}: Props) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={showModal}
    onRequestClose={closeModal}>
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create your own Common</Text>
          <Text style={styles.description}>
            Tell the world, invite friends, and work together to achieve common
            goals. Start now!
          </Text>
          <TouchableOpacity style={styles.btn} onPress={closeModal}>
            <Text style={styles.btnText}>Got it</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.triangleShape} />
        <View style={styles.circle} />
      </View>
    </View>
    <BottomRightButton bottom={Platform.OS === 'ios' ? 112 : 72} />
  </Modal>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 54, 0.3)',
  },
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 104 : 64,
    right: 6,
  },
  modal: {
    width: 370,
    borderRadius: 18,
    backgroundColor: colors.mainBlue,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
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
    paddingVertical: 16,
  },
  btn: {
    ...layout.btnOutline,
    height: 50,
  },
  btnText: {
    ...font.fontSize(3),
    color: colors.white,
  },
  triangleShape: {
    marginRight: 25,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 13,
    borderTopColor: colors.mainBlue,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    alignSelf: 'flex-end',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 1,
    borderColor: 'white',
    borderWidth: 2,
    alignSelf: 'flex-end',
  },
});

export default ModalCreateCommon;
