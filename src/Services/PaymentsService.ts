import {db} from '../Firebase';
import axios, {AxiosInstance} from 'axios';
import {auth} from '~/Firebase';

import {payMeUrl} from '~/Config';

import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {IPaymentEntity} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {InvoiceImage} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PAYME_TYPE_CODES} from '~/Util/constants/payme';
import StorageService from './StorageService';
import {STORAGE_PATH, FILE_TYPES} from '~/Util/constants/firebaseStorage';

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
      uploadInvoices: '/payout-docs/add',
    };
  }

  getPaymentById = async (paymentId: string): Promise<IPaymentEntity> =>
    (await db.collection(DB_COLLECTIONS.payments).doc(paymentId).get()).data();

  uploadInvoices = async (
    proposalID: string,
    invoices: InvoiceImage[],
    payoutDocsComment: string,
  ): Promise<void> => {
    try {
      const payoutDocs = await Promise.all(
        invoices.map(async (invoice) => {
          const downloadURL = invoice.mimeType.includes(FILE_TYPES.application)
            ? await StorageService.uploadFile(
                invoice.url,
                invoice.name as string,
                `${STORAGE_PATH.payoutDocs}/${proposalID}`,
              )
            : await StorageService.uploadImage(
                invoice.url,
                `${STORAGE_PATH.payoutDocs}/${proposalID}`,
              );

          return {
            name: StorageService.getFilename(downloadURL),
            amount: invoice.amount,
            mimeType: invoice.mimeType,
            downloadURL,
            legalType: PAYME_TYPE_CODES.Invoice,
          };
        }),
      );

      await this.axiosClient.post(
        this.endpoints.uploadInvoices,
        {
          proposalID,
          payoutDocs,
          payoutDocsComment,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (error) {
      throw error;
    }
  };
}

export default new PaymentService();
