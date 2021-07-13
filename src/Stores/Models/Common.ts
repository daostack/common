import {observable, computed} from 'mobx';
import {formatNumber} from '~/Util';
import {
  ICommonEntity,
  ICommonLink,
  ICommonMember,
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
  members: ICommonMember[];

  @observable
  rules: ICommonRule[];

  @observable
  links: ICommonLink[];

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
    this.createdAt = newCommonInfo.createdAt;
    this.updatedAt = newCommonInfo.updatedAt;
    this.name = newCommonInfo.name;
    this.image = newCommonInfo.image;
    this.balance = newCommonInfo.balance;
    this.raised = newCommonInfo.raised;
    this.members = newCommonInfo.members.map((member: ICommonMember) => member);
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
  get fundingMinimumAmountFormatted(): string {
    const minValue = +this.fundingMinimumAmount;
    return formatNumber(minValue / 100).toString();
  }
}
