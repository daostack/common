import React from 'react';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {func, string, bool, InferProps} from 'prop-types';
import HideContentSuccess from './HideContentSuccess';

const ModerationActionSuccessModal: React.FC<
  InferProps<typeof moderationActionSuccessModalProps>
> = ({type, visible, setShowModerationSuccessModal, action}) => (
  <BottomSheetModal
    isVisible={visible}
    transparent
    onClose={setShowModerationSuccessModal}>
    <HideContentSuccess
      type={type}
      action={action}
      onDismiss={setShowModerationSuccessModal}
    />
  </BottomSheetModal>
);

const moderationActionSuccessModalProps = {
  type: string,
  visible: bool,
  setShowModerationSuccessModal: func,
  action: func,
};

ModerationActionSuccessModal.propTypes = moderationActionSuccessModalProps;

export default ModerationActionSuccessModal;
