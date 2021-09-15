import {observable, computed} from 'mobx';
import {UserType} from '~/Graphql/User';
import {BaseModel} from './BaseModel';
import {UserModel} from './UserModel';
import {FLAGS} from '~/Components/Moderation/constants';
import {DiscussionMessage} from './DiscussionMessage';
import {DiscussionType} from '~/Graphql/Discussion/DiscussionType';
import {ModerationType} from '~/Graphql/Report';

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
  owner: UserType;

  @observable
  messages: DiscussionMessage[];

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
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
    this.messages = newDiscussionInfo.messages?.map(
      (message: any) => new DiscussionMessage(message),
    );
  }
}
