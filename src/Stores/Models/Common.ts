import {makeAutoObservable, computed} from 'mobx';
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
  reservedBalance: number;
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
    this.reservedBalance = newCommonInfo.reservedBalance || 0;
    this.raised = newCommonInfo.raised;
    this.fundingGoalDeadline = newCommonInfo.fundingGoalDeadline;
    this.members = newCommonInfo.members;
    this.rules = newCommonInfo.rules;
    this.links = newCommonInfo.links;
    this.metadata = newCommonInfo.metadata;
    this.register = newCommonInfo.register;
    this.active = newCommonInfo.active;
    this.updatedAt = newCommonInfo.updatedAt;
    makeAutoObservable(this);
  }

  get raisedFormatted(): string {
    return formatNumber(this.raised / 100).toString();
  }

  get balanceFormatted(): string {
    return formatNumber(this.balance / 100).toString();
  }

  @computed
  minFeeToJoinFormatted(numberValue = false): string {
    const minValue = this.metadata.zeroContribution
      ? 0
      : +this.metadata.minFeeToJoin;
    return !numberValue
      ? formatNumber(minValue / 100).toString()
      : (minValue / 100).toString();
  }
}
