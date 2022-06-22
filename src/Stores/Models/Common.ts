import {makeAutoObservable, computed} from 'mobx';
import {formatNumber} from '~/Util';
import {
  ICommonEntity,
  ICommonLink,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {firebase} from '~/Firebase';
import {formatMinFeeToJoin} from '~/Util/FormatUtil';
import {COMMON_STATE} from '~/Shared/enums/commonState';
import {COMMON_REGISTERED} from '~/Shared/enums/commonRegistered';

export class Common implements ICommonEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  name: string;
  image: string;
  balance: number;
  reservedBalance: number;
  raised: number;
  links: ICommonLink[];
  register: COMMON_REGISTERED;
  proposalCount: number;
  messageCount: number;
  discussionCount: number;
  byline: string;
  description: string;
  founderId: string;
  governanceId: string | null;
  memberCount: number;
  score: number;
  state: COMMON_STATE;

  constructor(newCommonInfo: ICommonEntity) {
    this.id = newCommonInfo.id;
    this.name = newCommonInfo.name;
    this.image = newCommonInfo.image;
    this.balance = newCommonInfo.balance;
    this.reservedBalance = newCommonInfo.reservedBalance || 0;
    this.raised = newCommonInfo.raised;
    this.links = newCommonInfo.links;
    this.register = newCommonInfo.register;
    this.updatedAt = newCommonInfo.updatedAt;
    this.proposalCount = newCommonInfo.proposalCount;
    this.messageCount = newCommonInfo.messageCount;
    this.discussionCount = newCommonInfo.discussionCount;
    this.byline = newCommonInfo.byline;
    this.description = newCommonInfo.description;
    this.founderId = newCommonInfo.founderId;
    this.governanceId = newCommonInfo.governanceId;
    this.image = newCommonInfo.image;
    this.memberCount = newCommonInfo.memberCount;
    this.score = newCommonInfo.score;
    this.state = newCommonInfo.state;
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
      zeroContribution: true,
      minFeeToJoin: 0,
    });
  }
}
