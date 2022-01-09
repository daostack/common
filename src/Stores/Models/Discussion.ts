import {makeAutoObservable} from 'mobx';
import {FLAGS} from '~/Components/Moderation/constants';
import {firebase} from '~/Firebase';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';

export class Discussion implements IDiscussionEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  title: string;
  message: string;
  ownerId: string;
  commonId: string;
  createTime: Date;
  lastMessage: Date;
  files: string[];
  images: string[];
  followers: string[];
  moderation?: IModerationEntity | null = null;
  isExpanded: boolean;

  constructor(newDiscussionInfo: IDiscussionEntity, isExpanded: boolean) {
    this.id = newDiscussionInfo.id;
    this.title = newDiscussionInfo.title;
    this.message = newDiscussionInfo.message;
    this.ownerId = newDiscussionInfo.ownerId;
    this.commonId = newDiscussionInfo.commonId;
    // TODO: remove the createTime when we start using createdAt instead.
    this.createTime = newDiscussionInfo.createTime;
    this.createdAt = newDiscussionInfo.createTime;
    this.lastMessage = newDiscussionInfo.lastMessage;
    this.files = newDiscussionInfo.files;
    this.images = newDiscussionInfo.images;
    this.followers = newDiscussionInfo.followers;
    this.moderation = newDiscussionInfo.moderation;
    this.isExpanded = isExpanded;
    makeAutoObservable(this);
  }

  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }
}
