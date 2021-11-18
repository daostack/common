import {BaseDocument} from './base-document';
import {FLAGS} from '~/Components/Moderation/constants';
import {IDiscussionEntity} from '~/Types/EntityTypes/IDiscussionEntity';
import {Timestamp} from '~/Firebase';

export class Discussion extends BaseDocument<IDiscussionEntity> {
  description: any;
  get id(): string {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  get message(): string {
    return this.data.message;
  }

  get ownerId(): string {
    return this.data.ownerId;
  }

  get commonId(): string {
    return this.data.commonId;
  }

  get _createTime(): Timestamp {
    return this.data.createTime;
  }

  get createTime(): Date {
    return this._createTime.toDate();
  }

  get _lastMessage() {
    return this.data.lastMessage;
  }

  get lastMessage(): Date {
    return this._lastMessage.toDate();
  }

  get files(): string[] {
    return this.data.files;
  }

  get images(): string[] {
    return this.data.images;
  }

  get followers(): string[] {
    return this.data.followers;
  }

  get moderation() {
    return this.data.moderation;
  }

  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }
  get isReported() {
    return this.moderation?.flag !== FLAGS.visible;
  }
}
