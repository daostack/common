import {observable, computed} from 'mobx';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
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

  @observable
  lastMessage: Date;

  @observable
  moderation?: IModerationEntity;

  @observable
  isExpanded: boolean;

  @observable
  owner: IUserEntity;

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
    this.createdAt = newDiscussionInfo.createdAt;
    this.lastMessage = newDiscussionInfo.lastMessage;
    this.isExpanded = isExpanded;
    this.owner = newDiscussionInfo.owner;
  }
}
