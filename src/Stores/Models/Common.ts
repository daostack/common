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
import {formatMinFeeToJoin} from '~/Util/FormatUtil';

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
  active: boolean;
  proposalCount: number;
  messageCount: number;
  discussionCount: number;
  byline: string;

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
    this.proposalCount = newCommonInfo.proposalCount;
    this.messageCount = newCommonInfo.messageCount;
    this.discussionCount = newCommonInfo.discussionCount;
    this.byline = newCommonInfo.byline;
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
    return formatMinFeeToJoin({
      numberValue,
      zeroContribution: this.metadata.zeroContribution,
      minFeeToJoin: this.metadata.minFeeToJoin,
    });
  }
}
