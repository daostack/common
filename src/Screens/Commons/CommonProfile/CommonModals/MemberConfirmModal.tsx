import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import Modal from 'react-native-modal';
import SentTemplate from '~/Components/ModalTemplates/SentTemplate';

interface MemberConfirmModalProps {
  showRequestSentModal: boolean;
  closeModal: () => void;
  viewProposal: () => void;
}

export const MemberConfirmModal = ({
  showRequestSentModal,
  closeModal,
  viewProposal,
}: MemberConfirmModalProps) => {
  return (
    <>
      <Modal
        isVisible={showRequestSentModal}
        avoidKeyboard={true}
        backdropColor={colors.white}
        backdropOpacity={1}
        onBackdropPress={closeModal}
        style={{padding: 0}}>
        <SentTemplate
          hideLogo
          title="Membership request sent"
          description="The common members will vote on your membership request. If it's approved, you will become a member with equal voting rights."
          onClose={closeModal}>
          <View>
            <TouchableOpacity
              style={styles.modalRequestSentBtnPrimary}
              onPress={viewProposal}>
              <Text style={text.buttoncenterwhite}>View request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalRequestSentBtnOutline}
              onPress={closeModal}>
              <Text style={styles.backButton}>Back to Common</Text>
            </TouchableOpacity>
          </View>
        </SentTemplate>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalRequestSentBtnPrimary: {
    ...layout.btnPrimary,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
  },
  modalRequestSentBtnOutline: {
    ...layout.btnOutline,
    ...layout.marginTopL,
    flexGrow: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  backButton: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.black,
  },
});
