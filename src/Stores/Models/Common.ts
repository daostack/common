import {observable, computed} from 'mobx';
import {formatNumber} from '~/Util';
import {
  CommonRegister,
  ICommonEntity,
  ICommonLink,
  ICommonMember,
  ICommonMetadata,
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

  @observable
  metadata: ICommonMetadata;

  @observable
  register: CommonRegister;

  constructor(newCommonInfo: ICommonEntity) {
    super(newCommonInfo);
    this.id = newCommonInfo.id;
    this.name = newCommonInfo.name;
    this.image = newCommonInfo.image;
    this.balance = newCommonInfo.balance;
    this.raised = newCommonInfo.raised;
    this.fundingGoalDeadline = newCommonInfo.fundingGoalDeadline;
    this.members = newCommonInfo.members;
    this.rules = newCommonInfo.rules;
    this.links = newCommonInfo.links;
    this.metadata = {
      action: newCommonInfo.action,
      byline: newCommonInfo.byline,
      contributionType: newCommonInfo.contributionType,
      description: newCommonInfo.description,
      minFeeToJoin: newCommonInfo.minFeeToJoin,
      founderId: newCommonInfo.members?.find(({roles = []}) =>
        (roles ?? []).includes(PERMISSIONS_GRAPHQL.FOUNDER),
      )?.userId,
    };
    this.register = newCommonInfo.register;
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
      : +this.metadata.minFeeToJoin;
    return formatNumber(minValue / 100).toString();
  }
}
