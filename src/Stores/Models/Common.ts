import {makeAutoObservable} from 'mobx';
import {formatNumber} from '~/Util';
import {
  CommonRegister,
  ICommonEntity,
  ICommonLink,
  ICommonMember,
  ICommonMetadata,
  ICommonRule,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {firebase} from '~/Firebase';

export class Common implements ICommonEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  name: string;
  image: string;
  balance: number;
  raised: number;
  fundingGoalDeadline: number;
  members: ICommonMember[];
  rules: ICommonRule[];
  links: ICommonLink[];
  metadata: ICommonMetadata;
  register: CommonRegister;

  constructor(newCommonInfo: ICommonEntity) {
    this.id = newCommonInfo.id;
    this.name = newCommonInfo.name;
    this.image = newCommonInfo.image;
    this.balance = newCommonInfo.balance;
    this.raised = newCommonInfo.raised;
    this.fundingGoalDeadline = newCommonInfo.fundingGoalDeadline;
    this.members = newCommonInfo.members;
    this.rules = newCommonInfo.rules;
    this.links = newCommonInfo.links;
    this.metadata = newCommonInfo.metadata;
    this.register = newCommonInfo.register;
    makeAutoObservable(this);
  }

  get raisedFormatted(): string {
    return formatNumber(this.raised / 100).toString();
  }

  get balanceFormatted(): string {
    return formatNumber(this.balance / 100).toString();
  }

  get minFeeToJoinFormatted(): string {
    const minValue = this.metadata.zeroContribution
    ? 0
    : +this.metadata.minFeeToJoin;
    return formatNumber(minValue / 100).toString();
  }
}
