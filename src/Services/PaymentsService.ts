import axios, {AxiosInstance} from 'axios';
import {db} from '../Firebase';
import {auth} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {InvoiceImage} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PAYME_TYPE_CODES} from '~/Util/constants/payme';
import StorageService from './StorageService';
import {STORAGE_PATH, FILE_TYPES} from '~/Util/constants/firebaseStorage';
import {
  IPaymentEntity,
  ISaleEntity,
} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {payMeUrl} from '~/Config';
import {PaymentsCollection} from '~/Firebase/Databasee/Collections/PaymentsCollection';

class PaymentService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    createToken: string;
    uploadInvoices: string;
    addBankAccount: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: payMeUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      createToken: '/payme/payin/create-buyer-token-page',
      uploadInvoices: '/payout-docs/add',
    };
  }

  async createBuyerTokenPage(cardId: string): Promise<ISaleEntity> {
    try {
      return await this.axiosClient.post(
        this.endpoints.createToken,
        {
          cardId,
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
  }

  getPaymentById = async (paymentId: string): Promise<IPaymentEntity> =>
    (await db.collection(DB_COLLECTIONS.payments).doc(paymentId).get()).data();

  subscribeToPaymentById = async (paymentId: string, callback: any) =>
    PaymentsCollection.doc(paymentId).onSnapshot((snapshot: any) => {
      callback(snapshot);
    });

  subscribeToUserPayments = (
    userId: string,
    callback: any,
  ): FirestoreUnsubscribeFn =>
    PaymentsCollection.where(userId, '==', 'userId').onSnapshot(
      (snapshot: any) => {
        callback(snapshot);
      },
    );

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
