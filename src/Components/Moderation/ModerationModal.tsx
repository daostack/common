import React from 'react';
import {func, string, bool, InferProps} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import Report from './Report';

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
    transparent
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

const moderationModalProps = {
  title: string,
  visible: bool,
  setShowModerationModal: func,
  moderationFormStore: func,
  onReportContent: func,
  hasPermission: bool,
};

ModerationModal.propTypes = moderationModalProps;

export default ModerationModal;
