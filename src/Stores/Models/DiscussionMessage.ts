import {observable, computed} from 'mobx';
import {
  DiscussionMessageImage,
  IDiscussionMessageEntity,
  IModerationEntity,
} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {BaseModel} from './BaseModel';
import {FLAGS} from '~/Components/Moderation/constants';

export class DiscussionMessage extends BaseModel<IDiscussionMessageEntity> {
  @observable
  discussionId: string;

  @observable
  ownerId: string;

  @observable
  ownerName: string;

  @observable
  text: string;

  @observable
  createTime: Date;

  @observable
  ownerAvatar: string;

  @observable
  moderation?: IModerationEntity;

  @observable
  image?: DiscussionMessageImage;

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  constructor(newDiscussionMessageInfo: IDiscussionMessageEntity) {
    super(newDiscussionMessageInfo);
    this.discussionId = newDiscussionMessageInfo.discussionId;
    this.ownerId = newDiscussionMessageInfo.ownerId;
    this.ownerName = newDiscussionMessageInfo.ownerName;
    this.text = newDiscussionMessageInfo.text;
    this.createTime = newDiscussionMessageInfo.createTime;
    this.ownerAvatar = newDiscussionMessageInfo.ownerAvatar;
    this.moderation = newDiscussionMessageInfo.moderation;
    this.image = newDiscussionMessageInfo.image;
  }
}
