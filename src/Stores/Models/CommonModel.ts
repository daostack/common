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
import {filterObjectByKeys} from '~/Util';
import {BaseModel} from './BaseModel';

export const commonInfoFields = [
  'name',
  'image',
  'balance',
  'raised',
  'fundingGoalDeadline',
  'members',
  'rules',
  'links',
  'metadata',
  'register',
];

export class CommonModel extends BaseModel<ICommonEntity> {
  // Fields
  name: string = '';
  image: string = '';
  balance: number = 0;
  raised: number = 0;
  fundingGoalDeadline: number = 0;
  members: ICommonMember[] = [];
  rules: ICommonRule[] = [];
  links: ICommonLink[] = [];
  metadata: ICommonMetadata = {
    action: '',
    byline: '',
    description: '',
    founderId: '',
    minFeeToJoin: 0,
    contributionType: 'one-time',
  };
  register: CommonRegister = 'na';

  constructor(newCommonInfo: ICommonEntity) {
    super();
    const filteredCommon: ICommonEntity = filterObjectByKeys(
      newCommonInfo,
      commonInfoFields,
    ) as ICommonEntity;

    this.setCommon(filteredCommon);
  }

  // Computed fields:
  get raisedFormatted(): string {
    return formatNumber(this.raised / 100).toString();
  }

  get balanceFormatted(): string {
    return formatNumber(this.balance / 100).toString();
  }

  setCommon(newCommonInfo: ICommonEntity) {
    Object.keys(newCommonInfo).forEach((key) => {
      this[key] = newCommonInfo[key];
    });
  }
}

decorate(CommonModel, {
  //observables
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
  setCommon: action,
});
