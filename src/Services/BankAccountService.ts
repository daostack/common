import axios, {AxiosInstance} from 'axios';
import {payMeUrl} from '~/Config';
import {auth} from '~/Firebase';
import {
  BankAccountDetails,
  IBankAccountEntity,
} from '~/Firebase/Databasee/EntityTypes/IBankAccountEntity';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {BanksAccountCollection} from '~/Firebase/Databasee/Collections/BankAccountCollection';

export type bankAccountLoadCallbackFunc = (
  updatedBankAccount: IFirebaseSnapshot<IBankAccountEntity>,
) => void;

class BankAccountService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    addBankAccount: string;
    getBankAccount: string;
    deleteBankAccount: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: payMeUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      addBankAccount: '/bank-account-details/add',
      getBankAccount: 'bank-account-details/get',
      deleteBankAccount: '/bank-account-details/delete',
    };
  }

  async deleteBankAccountDetails(): Promise<void> {
    try {
      await this.axiosClient.delete(this.endpoints.deleteBankAccount, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async addBankAccountDetails(body: BankAccountDetails): Promise<void> {
    try {
      return await this.axiosClient.post(this.endpoints.addBankAccount, body, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  fetchBankAccount = async (): Promise<IBankAccountEntity | null> => {
    try {
      const {data} = await this.axiosClient.get(this.endpoints.getBankAccount, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
      return data;
    } catch (e) {
      return null;
    }
  };

  subscribeToBankAccount = (
    userId: string,
    callback: bankAccountLoadCallbackFunc,
  ) => {
    const bankAccounts = BanksAccountCollection.where(
      'userId',
      '==',
      userId,
    ).onSnapshot((snapshot: any) => {
      callback(snapshot);
    });
    return bankAccounts;
  };
}

export default new BankAccountService();
