import React, {ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {colors, font, layout, text} from '~/Theme';

type Props = {
  isVisible: boolean;
  onPressClose: () => void;
  onConfirm: () => void;
};

const ModalDeleteInvoice = ({
  isVisible,
  onPressClose,
  onConfirm,
}: Props): ReactElement => (
  <BottomSheetModal
    isVisible={isVisible}
    onClose={onPressClose}
    style={styles.modalContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure want to delete this invoice</Text>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={{
            ...layout.btnOutline,
            ...layout.marginTopL,
            ...layout.marginRightS,
          }}
          onPress={onPressClose}>
          <Text style={styles.doneBtn}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
          <Text style={text.buttoncenterwhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </BottomSheetModal>
);

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 25,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginTop: 31,
    marginBottom: 80,
    textAlign: 'center',
    ...font.primary.bold,
    ...font.fontSize(4),
  },
  btnContainer: {
    flexDirection: 'row',
    ...layout.marginBottomXL,
  },
  doneBtn: {
    ...text.buttoncenterwhite,
    color: colors.black,
  },
  deleteBtn: {
    ...layout.btnPrimary,
    ...layout.marginTopL,
    ...layout.marginLeftS,
    backgroundColor: colors.against,
  },
});

export default ModalDeleteInvoice;
