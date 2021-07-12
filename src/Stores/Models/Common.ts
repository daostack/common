import {observable, computed} from 'mobx';
import {formatNumber} from '~/Util';
import {
  //CommonRegister,
  ICommonEntity,
  ICommonLink,
  ICommonMember,
  //ICommonMetadata,
  ICommonRule,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {PERMISSIONS_GRAPHQL} from '~/Util/constants/permissions.enum';
import {BaseModel} from './BaseModel';

export class Common extends BaseModel<ICommonEntity> {
  @observable
  id: string;

  @observable
  name: string;

  @observable
  image: string;

  @observable
  balance: number;

  @observable
  raised: number;

  @observable
  fundingGoalDeadline: number;

  @observable
  members: ICommonMember[];

  @observable
  rules: ICommonRule[];

  @observable
  links: ICommonLink[];

  /*@observable
  metadata: ICommonMetadata;

  @observable
  register: CommonRegister;*/

  @observable
  fundingMinimumAmount: number;

  @observable
  whitelisted: boolean;

  @observable
  fundingType: string;

  @observable
  action: string;

  @observable
  byline: string;

  @observable
  description: string;

  @observable
  founderId: string | undefined;

  constructor(newCommonInfo: ICommonEntity) {
    super(newCommonInfo);
    this.id = newCommonInfo.id;
    this.name = newCommonInfo.name;
    this.image = newCommonInfo.image;
    this.balance = newCommonInfo.balance;
    this.raised = newCommonInfo.raised;
    this.fundingGoalDeadline = newCommonInfo.fundingGoalDeadline;
    this.members = newCommonInfo.members;
    this.rules = newCommonInfo.rules || [];
    this.links = newCommonInfo.links || [];
    this.fundingMinimumAmount = newCommonInfo.fundingMinimumAmount;
    this.whitelisted = newCommonInfo.whitelisted;
    this.fundingType = newCommonInfo.fundingType;
    this.action = newCommonInfo.action;
    this.byline = newCommonInfo.byline;
    this.description = newCommonInfo.description;
    this.founderId = newCommonInfo.members.find(({roles = []}) =>
      (roles ?? []).includes(PERMISSIONS_GRAPHQL.FOUNDER),
    )?.userId;

    console.log('tlt newCommonInfo', newCommonInfo, 'this', this);
  }

  @computed
  get raisedFormatted(): string {
    return formatNumber(this.raised / 100).toString();
  }

  @computed
  get balanceFormatted(): string {
    return formatNumber(this.balance / 100).toString();
  }

  @computed
  get minFeeToJoinFormatted(): string {
    const minValue = this.metadata.zeroContribution
      ? 0
      : +this.fundingMinimumAmount;//this.metadata.minFeeToJoin;

    console.log('tkt this.minValue', minValue)
    return formatNumber(minValue / 100).toString();
  }
}
