import React, {ReactElement} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import BottomSheetModal from '~/Components/BottomSheetModal';

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
    style={layout.bottomSheetRadius}>
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
