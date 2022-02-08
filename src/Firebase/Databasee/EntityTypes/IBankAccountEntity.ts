import {IBaseEntity} from './IBaseEntity';
import {IPaymeDocument} from './IPaymeDocument';

export interface BankAccountDetails {
  bankName: string;
  bankCode: number;
  branchNumber: number;
  accountNumber: number;
  identificationDocs: IPaymeDocument[];
  city: string;
  country: string;
  streetAddress: string;
  streetNumber: number;
  socialId: string;
  socialIdIssueDate: string;
  birthdate: string;
  gender: number;
  phoneNumber: string;
}

export interface IBankAccountEntity extends IBaseEntity, BankAccountDetails {
  userId: string;
}
