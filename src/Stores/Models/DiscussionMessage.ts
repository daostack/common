import {makeAutoObservable} from 'mobx';
import {FLAGS} from '~/Components/Moderation/constants';
import {firebase} from '~/Firebase';
import {
  IDiscussionMessageEntity,
  IModerationEntity
} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';

export class DiscussionMessage implements IDiscussionMessageEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  discussionId: string;
  ownerId: string;
  ownerName: string;
  text: string;
  createTime: Date;
  ownerAvatar: string;
  moderation?: IModerationEntity;

  constructor(newDiscussionMessageInfo: IDiscussionMessageEntity) {
    this.id = newDiscussionMessageInfo.id;
    this.discussionId = newDiscussionMessageInfo.discussionId;
    this.ownerId = newDiscussionMessageInfo.ownerId;
    this.ownerName = newDiscussionMessageInfo.ownerName;
    this.text = newDiscussionMessageInfo.text;
    this.createTime = newDiscussionMessageInfo.createTime;
    this.ownerAvatar = newDiscussionMessageInfo.ownerAvatar;
    this.moderation = newDiscussionMessageInfo.moderation;
    makeAutoObservable(this);
  }

  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }
}
