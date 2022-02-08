import {IBaseEntity} from './IBaseEntity';
import {firebase} from '~/Firebase';
import {IModerationEntity} from './IModerationEntity';

export interface IDiscussionEntity extends IBaseEntity {
  /**
   * Title of the discussion
   */
  title: string;

  /**
   * Message content
   */
  message: string;

  /**
   * The ID of the user who created the discussion
   */
  ownerId: string;

  /**
   * The ID of the common the discussion was created in
   */
  commonId: string;

  /**
   * Time of creation
   */
  createTime: firebase.firestore.Timestamp;

  /**
   * When was the last message sent in this discussion
   */
  lastMessage: firebase.firestore.Timestamp;

  /**
   * File URLs the discussion owner added in discussion creation
   */
  files: string[];

  /**
   * Image URLs the discussion owner added in discussion creation
   */
  images: string[];

  /**
   * Users who follow this discussion
   */
  followers: string[];

  /**
   * The moderation object that handles hiding/showing proposals
   */
  moderation?: IModerationEntity | null;

  isModerationHidden: boolean;
}
