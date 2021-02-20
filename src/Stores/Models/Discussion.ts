import {observable} from 'mobx';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {BaseModel} from './BaseModel';

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
  moderation?: object | undefined; // TODO create moderation type

  constructor(newDiscussionInfo: IDiscussionEntity) {
    super(newDiscussionInfo);
    this.id = newDiscussionInfo.id;
    this.title = newDiscussionInfo.title;
    this.message = newDiscussionInfo.message;
    this.ownerId = newDiscussionInfo.ownerId;
    this.commonId = newDiscussionInfo.commonId;
    this.createTime = newDiscussionInfo.createTime;
    this.lastMessage = newDiscussionInfo.lastMessage;
    this.files = newDiscussionInfo.files;
    this.images = newDiscussionInfo.images;
    this.followers = newDiscussionInfo.followers;
    this.moderation = newDiscussionInfo.moderation;
  }
}
