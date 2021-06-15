import {observable, computed} from 'mobx';
import {
  IDiscussionMessageEntity,
  IModerationEntity,
} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {BaseModel} from './BaseModel';
import {FLAGS} from '~/Components/Moderation/constants';


export class DiscussionMessage extends BaseModel<IDiscussionMessageEntity> {
  @observable
  discussionId: string;

  @observable
  userId: string;

  @observable
  ownerName: string;

  @observable
  message: string;

  @observable
  ownerAvatar: string;

  @observable
  moderation?: IModerationEntity;

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  constructor(newDiscussionMessageInfo: IDiscussionMessageEntity) {
    super(newDiscussionMessageInfo);
    this.discussionId = newDiscussionMessageInfo.discussionId;
    this.userId = newDiscussionMessageInfo.userId;
    this.ownerName = newDiscussionMessageInfo.ownerName;
    this.message = newDiscussionMessageInfo.message;
    this.createdAt = newDiscussionMessageInfo.createdAt;
    this.ownerAvatar = newDiscussionMessageInfo.ownerAvatar;
    this.moderation = newDiscussionMessageInfo.moderation;
  }
}
