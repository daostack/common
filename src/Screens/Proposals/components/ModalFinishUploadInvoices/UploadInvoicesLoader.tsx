import React, {ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {layout, text} from '~/Theme';
import {InvoiceLoader} from '../InvoiceLoader';

export const UploadInvoicesLoader = (): ReactElement => (
  <>
    <InvoiceLoader />
    <TouchableOpacity style={styles.disabledUploadInvoiceBtn} disabled>
      <Text style={text.buttoncenterwhite}>Upload Invoices</Text>
    </TouchableOpacity>
  </>
);

export const styles = StyleSheet.create({
  disabledUploadInvoiceBtn: {
    ...layout.btnPrimary,
    marginTop: 190,
    marginBottom: 40,
    width: '100%',
    backgroundColor: 'rgba(119,134,255,0.3)',
  },
});
