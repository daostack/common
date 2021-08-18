import {BaseType} from '~/Graphql/BaseType';
import {User} from '~/Graphql';
import {ModerationType, MessageReport, REPORT_FLAG} from '~/Graphql/Report';

export type DiscussionMessageType = BaseType & {
  /**
   * ID of the parent discussion of this message, could be a Discussion ID, or a Proposal ID
   */
  discussionId: string;

  /**
   * The ID of the creator of the message
   */
  userId: string;

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
  moderation: ModerationType;

  reports: MessageReport[];

  type: string;

  flag: REPORT_FLAG;

  owner: User;
};
