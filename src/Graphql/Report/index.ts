import {gql} from '@apollo/client';
import {BaseType} from '~/Graphql/BaseType';
import {User} from '~/Graphql';
import {gqlUserProps} from '~/Graphql/User';
import {Scalars} from '../';

export const gqlReportProps = `
reports {
  id
  reporter: reporterId
  reporterInfo: reporter {
    ${gqlUserProps}
  }
  moderator: reviewerId
  moderatorInfo: reviewer {
    ${gqlUserProps}
  }
  note
  updatedAt
  for
}`;

export const gqlDiscussionMessageProps = `
  id
  updatedAt
  createdAt
  type
  message
  discussionId
  userId
  flag
`;

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

const gqlReportResponseProps = `
  id
`;

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

export enum REPORT_TITLES {
  Proposal = 'Proposal',
  Discussion = 'Discussion',
  Post = 'Post',
}

export type CreateReportInput = {
  type?: Scalars['String'];
  note?: Scalars['String'];
  messageId?: Scalars['ID'];
  proposalId?: Scalars['ID'];
};

export type ReportResponse = {
  id: number;
  flag: REPORT_FLAG;
};

export const CreateReportDocument = gql`
  mutation CreateReport(
    $input: CreateReportInput!
  ) {
    createReport(input: $input) {
      ${gqlReportResponseProps}
    }
  }
`;

export const ChangeDiscussionMessageFlagDocument = gql`
  mutation ChangeDiscussionMessageFlag($id: ID!, $flag: ReportFlag!) {
    changeDiscussionMessageVisibility(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

export const ChangeProposalFlagDocument = gql`
  mutation ChangeProposalFlag($id: ID!, $flag: ReportFlag!) {
    changeProposalVisibility(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

export const ChangeDiscussionFlagDocument = gql`
  mutation ChangeDiscussionFlag($id: ID!, $flag: ReportFlag!) {
    changeDiscussionVisibility(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;
