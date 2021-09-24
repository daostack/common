import {User} from '~/Graphql';
import {BaseType} from '~/Graphql/BaseType';
import {Scalars} from '../';

export interface MessageReport extends BaseType {
  /**
   * UserId of the moderator
   */
  moderator?: string;

  /**
   * Moderator not about why this object was reported
   */
  note?: string;

  /**
   * Array of reasons why this object was reported
   */
  reasons: string[];

  /**
   * The userId of the person who reported this object
   * every member can report an object
   */
  reporter: string;

  /**
   * The time of the moderation
   */
  updatedAt: Date;
  reporterInfo: User;
  moderatorInfo: User;
}

export interface ModerationType {
  flag: REPORT_FLAG;
  reports: MessageReport[];
}

export enum REPORT_FOR {
  ProposalReport = 'ProposalReport',
  MessageReport = 'MessageReport',
}

export enum REPORT_TYPE {
  ProposalReport = 'ProposalReport',
  MessageReport = 'MessageReport',
  DiscussionReport = 'DiscussionReport',
}

export enum REPORT_FLAG {
  Clear = 'Clear',
  Reported = 'Reported',
  Hidden = 'Hidden',
}

export type CreateReportInput = {
  type?: Scalars['String'];
  note?: Scalars['String'];
  messageId?: Scalars['ID'];
  proposalId?: Scalars['ID'];
};
