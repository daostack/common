import {BaseType} from '~/Graphql/BaseType';
import {UserType} from '~/Graphql/User';
import {DiscussionMessage} from '~/Stores/Models/DiscussionMessage';
import {MessageReport, REPORT_FLAG} from '~/Graphql/Report';

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

  owner: UserType;

  /**
   * When was the last message sent in this discussion
   */
  lastMessage: Date;

  isModerationHidden: boolean;

  isExpanded: boolean;

  messages: DiscussionMessage[];

  reports: MessageReport[];
  flag: REPORT_FLAG;

  type: DiscussionTypes;
}

export enum DiscussionTypes {
  PROPOSAL_DISCUSSION = 'ProposalDiscussion',
  COMMON_DISCUSSION = 'CommonDiscussion',
}
