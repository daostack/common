import {makeAutoObservable} from 'mobx';
import {IBankAccountEntity} from '~/Firebase/Databasee/EntityTypes/IBankAccountEntity';
import {firebase} from '~/Firebase';
import {DocInfo} from '~/Firebase/Databasee/EntityTypes/DocInfo';

export class BankAccount implements IBankAccountEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  userId: string;
  bankName: string;
  bankCode: number;
  branchNumber: number;
  accountNumber: number;
  identificationDocs: DocInfo[];
  city: string;
  country: string;
  streetAddress: string;
  streetNumber: number;
  socialId: string;
  socialIdIssueDate: string;
  birthdate: string;
  gender: number;
  phoneNumber: string;

  constructor(newCardInfo: IBankAccountEntity) {
    this.id = newCardInfo.id;
    this.userId = newCardInfo.userId;
    this.bankName = newCardInfo.bankName;
    this.bankCode = newCardInfo.bankCode;
    this.branchNumber = newCardInfo.branchNumber;
    this.accountNumber = newCardInfo.accountNumber;
    this.identificationDocs = newCardInfo.identificationDocs;
    this.city = newCardInfo.city;
    this.country = newCardInfo.country;
    this.streetAddress = newCardInfo.streetAddress;
    this.streetNumber = newCardInfo.streetNumber;
    this.socialId = newCardInfo.socialId;
    this.socialIdIssueDate = newCardInfo.socialIdIssueDate;
    this.birthdate = newCardInfo.birthdate;
    this.gender = newCardInfo.gender;
    this.phoneNumber = newCardInfo.phoneNumber;
    makeAutoObservable(this);
  }
}
