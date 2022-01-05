import React, {ReactElement} from 'react';
import {StyleSheet} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {UploadInvoicesInfo} from './UploadInvoicesInfo';
import {UploadInvoicesLoader} from './UploadInvoicesLoader';
import {UploadInvoicesSuccess} from './UploadInvoicesSuccess';

type Props = {
  proposalId: string;
  commonId: string;
  isVisible: boolean;
  onPressClose: () => void;
  proposalAmount?: number;
  invoicesAmount: number;
  description: string;
  setDescription: (value: string) => void;
  uploadInvoices: () => void;
  uploadInvoiceStatus: {
    isLoading: boolean;
    isUploaded: boolean;
  };
};

function UploadInvoicesSwitcher({
  uploadInvoiceStatus,
  proposalId,
  commonId,
  onPressClose,
  ...props
}: Omit<Props, 'isVisible'>) {
  if (uploadInvoiceStatus.isLoading) {
    return <UploadInvoicesLoader />;
  }

  if (uploadInvoiceStatus.isUploaded) {
    return (
      <UploadInvoicesSuccess
        proposalId={proposalId}
        commonId={commonId}
        onPressClose={onPressClose}
      />
    );
  }

  return <UploadInvoicesInfo {...props} onPressClose={onPressClose} />;
}

export const ModalFinishUploadInvoices = ({
  isVisible,
  onPressClose,
  proposalAmount,
  invoicesAmount,
  description,
  setDescription,
  uploadInvoices,
  uploadInvoiceStatus,
  proposalId,
  commonId,
}: Props): ReactElement => (
  <BottomSheetModal
    isVisible={isVisible}
    onClose={onPressClose}
    style={styles.modalContainer}>
    <UploadInvoicesSwitcher
      onPressClose={onPressClose}
      proposalAmount={proposalAmount}
      invoicesAmount={invoicesAmount}
      description={description}
      setDescription={setDescription}
      uploadInvoices={uploadInvoices}
      uploadInvoiceStatus={uploadInvoiceStatus}
      proposalId={proposalId}
      commonId={commonId}
    />
  </BottomSheetModal>
);

export const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 25,
  },
});
