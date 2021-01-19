import {observable, decorate, action, computed} from 'mobx';
import {formatNumber} from '~/Util';
import {
  CommonRegister,
  ICommonEntity,
  ICommonLink,
  ICommonMember,
  ICommonMetadata,
  ICommonRule,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {BaseModel} from './BaseModel';

export class Common extends BaseModel<ICommonEntity> {
  // Fields
  id: string;
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
    super();
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
  }

  // Computed fields:
  get raisedFormatted(): string {
    return formatNumber(this.raised / 100).toString();
  }

  get balanceFormatted(): string {
    return formatNumber(this.balance / 100).toString();
  }
}

decorate(Common, {
  //observables
  id: observable,
  name: observable,
  image: observable,
  balance: observable,
  raised: observable,
  fundingGoalDeadline: observable,
  members: observable,
  rules: observable,
  links: observable,
  metadata: observable,
  register: observable,

  //computed
  raisedFormatted: computed,
  balanceFormatted: computed,

  //actions
});
