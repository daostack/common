import React from 'react';
import {func, string, bool, InferProps, object} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import Report from './Report';
import {StyleSheet} from 'react-native';

const ModerationModal: React.FC<InferProps<typeof moderationModalProps>> = ({
  title,
  visible,
  setShowModerationModal,
  moderationFormStore,
  onReportContent,
  hasPermission,
}) => (
  <BottomSheetModal
    isVisible={visible}
    style={styles.modal}
    onClose={setShowModerationModal}>
    <Report
      title={title}
      onCancel={setShowModerationModal}
      onReportContent={onReportContent}
      formStore={moderationFormStore}
      hasPermission={hasPermission}
    />
  </BottomSheetModal>
);

const styles = StyleSheet.create({
  modal: {
    borderRadius: 27,
    padding: 16,
  },
});

const moderationModalProps = {
  title: string,
  visible: bool,
  setShowModerationModal: func,
  moderationFormStore: object,
  onReportContent: func,
  hasPermission: string,
};

ModerationModal.propTypes = moderationModalProps;

export default ModerationModal;
