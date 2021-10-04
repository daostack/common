import {observable, computed} from 'mobx';
import {MessageType} from '~/Graphql/Message/MessageType';
import {ModerationType} from '~/Graphql/Report';
import {User} from '~/Graphql';
import {BaseModel} from './BaseModel';
import {FLAGS} from '~/Components/Moderation/constants';

export class DiscussionMessage extends BaseModel<MessageType> {
  @observable
  discussionId: string;

  @observable
  proposalId: string | undefined;

  @observable
  userId: string;

  @observable
  message: string;

  @observable
  ownerAvatar: string;

  @observable
  owner: User;

  @observable
  moderation: ModerationType;

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  constructor(newDiscussionMessageInfo: MessageType) {
    super(newDiscussionMessageInfo);
    this.discussionId = newDiscussionMessageInfo.discussionId;
    this.userId = newDiscussionMessageInfo.userId;
    this.message = newDiscussionMessageInfo.message;
    this.createdAt = newDiscussionMessageInfo.createdAt;
    this.ownerAvatar = newDiscussionMessageInfo.owner.photoURL;
    this.owner = newDiscussionMessageInfo.owner;
    this.moderation = {
      reports: newDiscussionMessageInfo.reports,
      flag: newDiscussionMessageInfo.flag,
    };
  }
}
