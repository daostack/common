import {BaseType} from '~/Graphql/BaseType';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {DiscussionMessage} from '~/Stores/Models/DiscussionMessage';

export interface DiscussionType extends BaseType {
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
  createdAt: Date;

  /**
   * Owner info
   */

  owner: IUserEntity;

  /**
   * When was the last message sent in this discussion
   */
  lastMessage: Date;

  isModerationHidden: boolean;

  isExpanded: boolean;

  messages: DiscussionMessage[];
}
