import React from 'react';
import {func, string, bool, InferProps, object} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import Report from './Report';
import FormStore from '~/Stores/FormStores/FormStore';
import { PERMISSIONS } from '~/Types';

const ModerationModal: React.FC<{
  title: string,
  visible: boolean,
  setShowModerationModal(show:boolean): void,
  moderationFormStore: FormStore,
  onReportContent(): void,
  permission: PERMISSIONS,
}> = ({
  title,
  visible,
  setShowModerationModal,
  moderationFormStore,
  onReportContent,
  permission,
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
      permission={permission}
    />
  </BottomSheetModal>
);

const moderationModalProps = ;

ModerationModal.propTypes = moderationModalProps;

export default ModerationModal;
