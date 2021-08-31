import {observable, computed} from 'mobx';
import {ModerationType, REPORT_FLAG} from '~/Graphql/Report';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {BaseModel} from './BaseModel';
import {UserModel} from './UserModel';
import {DiscussionMessage} from './DiscussionMessage';
import {DiscussionType} from '~/Graphql/Discussion/DiscussionType';

export class Discussion extends BaseModel<DiscussionType> {
  @observable
  id: string;

  @observable
  title: string;

  @observable
  message: string;

  @observable
  ownerId: string;

  @observable
  commonId: string;

  @observable
  lastMessage: Date;

  @observable
  moderation?: ModerationType;

  @observable
  isExpanded: boolean;

  @observable
  owner: IUserEntity;

  @observable
  messages: DiscussionMessage[];

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === REPORT_FLAG.Hidden;
  }

  constructor(newDiscussionInfo: DiscussionType, isExpanded: boolean) {
    super(newDiscussionInfo);
    this.id = newDiscussionInfo.id;
    this.title = newDiscussionInfo.title;
    this.message = newDiscussionInfo.message;
    this.ownerId = newDiscussionInfo.ownerId;
    this.commonId = newDiscussionInfo.commonId;
    this.createdAt = new Date(newDiscussionInfo.createdAt);
    this.lastMessage = newDiscussionInfo.lastMessage;
    this.isExpanded = isExpanded;
    this.owner = new UserModel(newDiscussionInfo.owner);
    this.moderation = {
      reports: newDiscussionInfo.reports,
      flag: newDiscussionInfo.flag,
    };
    this.messages = newDiscussionInfo.messages?.map(
      (message: any) => new DiscussionMessage(message),
    );
  }
}
