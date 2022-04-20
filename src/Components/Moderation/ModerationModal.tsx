import React from 'react';
import {bool, func, InferProps, object, string} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {layout} from '~/Theme';
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
    style={layout.optionsModal}
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
  moderationFormStore: object,
  onReportContent: func,
  hasPermission: string,
};

ModerationModal.propTypes = moderationModalProps;

export default ModerationModal;
