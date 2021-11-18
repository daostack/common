import {Document} from 'firestorter';
import {FLAGS} from '~/Components/Moderation/constants';
import {IDiscussionMessageEntity} from '~/Types/EntityTypes/IDiscussionMessageEntity';
import {Timestamp} from '~/Firebase';

export class DiscussionMessage extends Document<IDiscussionMessageEntity> {
  get discussionId() {
    return this.data.discussionId;
  }

  get ownerId() {
    return this.data.ownerId;
  }

  get ownerName() {
    return this.data.ownerName;
  }

  get text() {
    return this.data.text;
  }

  get _createTime() {
    return (this.data.createTime as unknown) as Timestamp;
  }
  get createTime(): Date {
    return this._createTime.toDate();
  }

  get ownerAvatar() {
    return this.data.ownerAvatar;
  }

  get moderation() {
    return this.data.moderation;
  }

  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }
  get parentDiscussion() {
    return (
      getDiscussionById(this.discussionId) || getProposalById(this.discussionId)
    );
  }
}
