import {observable, computed} from 'mobx';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';
import {BaseModel} from './BaseModel';
import {FLAGS} from '~/Components/Moderation/constants';

export class Discussion extends BaseModel<IDiscussionEntity> {
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

  // TODO: Remove that as we already have createAt in the BaseModel and every other collection follows that pattern
  @observable
  createTime: Date;

  @observable
  lastMessage: Date;

  @observable
  files: string[];

  @observable
  images: string[];

  @observable
  followers: string[];

  @observable
  moderation?: IModerationEntity;

  @observable
  isExpanded: boolean;

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  constructor(newDiscussionInfo: IDiscussionEntity, isExpanded: boolean) {
    super(newDiscussionInfo);
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
  }
}
