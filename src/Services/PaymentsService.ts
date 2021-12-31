import {db} from '../Firebase';
import axios, {AxiosInstance} from 'axios';

import {payMeUrl} from '~/Config';

import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {IPaymentEntity} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {InvoiceImage} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PAYME_TYPE_CODES} from '~/Util/constants/payme';
import StorageService from './StorageService';

class PaymentService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    uploadInvoices: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: payMeUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      uploadInvoices: '/payme/payout/save-legal-docs-info',
    };
  }

  getPaymentById = async (paymentId: string): Promise<IPaymentEntity> =>
    (await db.collection(DB_COLLECTIONS.payments).doc(paymentId).get()).data();

  uploadInvoices = async (
    proposalId: string,
    invoices: InvoiceImage[],
  ): Promise<void> => {
    try {
      const legalDocsInfo = await Promise.all(
        invoices.map(async (invoice) => {
          const downloadUrl = invoice.mimeType.includes('application')
            ? await StorageService.uploadFile(
                invoice.url,
                invoice.name as string,
                'private',
              )
            : await StorageService.uploadImage(invoice.url, 'private');

          return {
            name: StorageService.getFilename(downloadUrl),
            amount: invoice.amount,
            mimeType: invoice.mimeType,
            downloadUrl,
            legalType: PAYME_TYPE_CODES.Invoice,
          };
        }),
      );

      console.log('---legalDocsInfo', proposalId, legalDocsInfo);
      const {data} = await this.axiosClient.post(
        this.endpoints.uploadInvoices,
        {
          proposalId,
          legalDocsInfo,
        },
      );
      console.log('----data');
    } catch (err) {
      console.log('--errr', err);
    }
  };
}

export default new PaymentService();
