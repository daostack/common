import {firebase} from '~/Firebase';
import {IBaseEntity} from './IBaseEntity';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

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
  createdAt: firebase.firestore.Timestamp;

  /**
   * Owner info
   */

  owner: IUserEntity;

  /**
   * When was the last message sent in this discussion
   */
  lastMessage: firebase.firestore.Timestamp;

  isModerationHidden: boolean;

  isExpanded: boolean;
}
