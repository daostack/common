import {observable} from 'mobx';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {BaseModel} from './BaseModel';

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

  constructor(newDiscussionMessageInfo: IDiscussionMessageEntity) {
    super();
    this.discussionId = newDiscussionMessageInfo.discussionId;
    this.ownerId = newDiscussionMessageInfo.ownerId;
    this.ownerName = newDiscussionMessageInfo.ownerName;
    this.text = newDiscussionMessageInfo.text;
    this.createTime = newDiscussionMessageInfo.createTime;
    this.ownerAvatar = newDiscussionMessageInfo.ownerAvatar;
  }
}
