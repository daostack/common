import {BaseType} from '~/Graphql/BaseType';
import {IModerationEntity} from './IModerationEntity';

export interface IDiscussionMessageEntity extends BaseType {
  /**
   * ID of the parent discussion of this message, could be a Discussion ID, or a Proposal ID
   */
  discussionId: string;

  /**
   * The ID of the creator of the message
   */
  userId: string;

  /**
   * The name of the creator of the message
   */
  ownerName: string;

  /**
   * The content of the message
   */
  message: string;

  /**
   * Image URLs of the user's avatar
   */
  ownerAvatar: string;

  /**
   * The moderation object that handles hiding/showing proposals
   */
  moderation?: IModerationEntity;
}
