import BaseStore from './BaseStore';
import RootStore from '../RootStore';
import {IBankAccountEntity} from '~/Firebase/Databasee/EntityTypes/IBankAccountEntity';
import {BankAccount} from '../Models/BankAccount';
import Logger from '~/Services/Logger';
import BankAccountService from '~/Services/BankAccountService';
import {computed} from 'mobx';

export default class BankAccountStore extends BaseStore<
  BankAccount,
  IBankAccountEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
    this.reset();
  }

  @computed
  get bankAccountData() {
    const haveBankAccount = this?.data?.size !== 0;
    const bankAccountData = haveBankAccount
      ? this?.data?.entries()?.next()?.value[1]
      : undefined;
    return bankAccountData;
  }

  getBankAccountById = (id: string): BankAccount | undefined => {
    try {
      return this.getDataById(id);
    } catch (e) {
      Logger.log('error', e);
    }
  };

  fetchBankAccount = async () => {
    try {
      const bankAccount = await BankAccountService.fetchBankAccount();
      const bankAccountModel = new BankAccount(
        bankAccount as IBankAccountEntity,
      );
      this.setData(bankAccount!.id, bankAccountModel);
    } catch (err) {
      Logger.error('fetchBankAccountByUserId ~>', err);
      this.reset();
    }
  };

  getEntityModel(entity: IBankAccountEntity): BankAccount {
    return new BankAccount(entity);
  }

  reset(): void {
    this.data.clear();
  }

  subscribeToBankAccount = (userId: string): any =>
    BankAccountService.subscribeToBankAccount(userId, (snapshot: any) => {
      this.updateStoreData(snapshot);
      if (!snapshot?._docs.length) {
        this.reset();
      }
    });
}
