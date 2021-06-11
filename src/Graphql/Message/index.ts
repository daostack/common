
import {gql} from '@apollo/client';
import {CommonContributionType} from '~/Graphql/Common';
import {Exact, FileInput, ImageInput, LinkInput, Maybe, Mutation, Scalars} from '~/Graphql';

export enum VoteOutcome {
  APPROVE = 'Approve',
  REJECT = 'Condemn',
}

export enum ProposalState {
  ACCEPTED = 'Accepted',
  COUNTDOWN = 'Countdown',
  FINALIZING = 'Finalizing',
  REJECTED = 'Rejected',
}

export enum ProposalType {
  FUNDING_REQUEST = 'FundingRequest',
  JOIN_REQUEST = 'JoinRequest',
}

export type ProposalFunding = {
    __typename?: 'ProposalFunding';
    amount: Scalars['Int'];
  };

  export type ProposalJoin = {
    __typename?: 'ProposalJoin';
    cardId: Scalars['ID'];
    funding: Scalars['Int'];
    fundingType?: Maybe<CommonContributionType>;
  };


export type CreateDiscussionMessageInput = {
    discussionId: Scalars['ID'];
    message: Scalars['String'];
}

// Input Variables

export type CreateDiscussionMessageVariables = Exact<{
    discussionMessage: CreateDiscussionMessageInput;
}>;

export const CreateDiscussionMessageDocument = gql`
  mutation CreateDiscussionMessage($discussionMessage: CreateDiscussionMessageInput!) {
    createDiscussionMessage(input: $discussionMessage) {
      id
      message
    }
  }
`;




// export const getProposalsDocument = gql`
//   query ($where: ProposalWhereInput!){
//     discussionMessage( where: $where) {
//         id: UUID!
//         createdAt: DateTime!
//         updatedAt: DateTime!
//         message: String!
//         type: DiscussionMessageType!
//         flag: DiscussionMessageFlag!
//         userId: String!
//         reports: [Report!]!
//         owner: User
//     }
//   }
// `;


