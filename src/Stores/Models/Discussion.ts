import {observable, computed} from 'mobx';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {BaseModel} from './BaseModel';
import {UserModel} from './UserModel';
import {FLAGS} from '~/Components/Moderation/constants';
import {DiscussionMessage} from './DiscussionMessage';
import {DiscussionType, DiscussionTypes} from '~/Graphql/Discussion/DiscussionType';

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
  moderation?: IModerationEntity;

  @observable
  isExpanded: boolean;

  @observable
  owner: IUserEntity;

  @observable
  messages: DiscussionMessage[];

  @observable
  type: DiscussionTypes;

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
    this.type = newDiscussionInfo.type;
    this.messages = newDiscussionInfo.messages?.map(
      (message: any) => new DiscussionMessage(message),
    );
  }
}
