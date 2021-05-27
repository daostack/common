
import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
import {CommonContributionType, Exact, FileInput, ImageInput, LinkInput, Maybe, Mutation, Scalars} from '~/Graphql';

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

type CreateProposalInput = {
    title: Scalars['String'];
    commonId: Scalars['String'];
    description: Scalars['String'];
    links?: Maybe<Array<LinkInput>>;
  };

export type CreateJoinProposalInput = CreateProposalInput & {
    fundingAmount: Scalars['Int'];
    cardId: Scalars['String'];
    join: ProposalJoin;
};

export type CreateFundingProposalInput = CreateProposalInput & {
    amount: Scalars['Int'];
    files?: Maybe<Array<FileInput>>;
    images?: Maybe<Array<ImageInput>>;
    funding: ProposalFunding;
};


export type CreateFundingProposalMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createFundingProposal'
>;

export type CreateJoinProposalMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createJoinProposal'
>;

export type CreateFundingProposalMutationVariables = Exact<{
    proposal: CreateFundingProposalInput;
}>;

export type CreateJoinProposalMutationVariables = Exact<{
    proposal: CreateJoinProposalMutation;
}>;

export type CreateJoinProposalVariables = Exact<{
    proposal: CreateJoinProposalInput;
}>;

export type CreateFundingProposalVariables = Exact<{
    proposal: CreateFundingProposalInput;
}>;



export const CreateJoinProposalDocument = gql`
  mutation CreateJoinProposal($proposal: CreateJoinProposalInput!) {
    createJoinProposal(input: $proposal) {
      title
      commonId
      description
      links
      fundingAmount
      cardId
    }
  }
`;

export const CreateFundingProposalDocument = gql`
    mutation CreateFundingProposal($proposal: CreateFundingProposalInput!) {
    createFundingProposal(input: $proposal) {
      title
      commonId
      description
      links
      files
      images
      funding {
          amount
      }
    }
  }
`;

export function useCreateFundingProposalMutation(
    baseOptions?: Apollo.MutationHookOptions<
      CreateFundingProposalMutation,
      CreateFundingProposalVariables
    >,
  ) {
    return Apollo.useMutation<
    CreateFundingProposalMutation,
    CreateFundingProposalVariables
    >(CreateFundingProposalDocument, baseOptions);
}

export function useCreateJoinProposalMutation(
    baseOptions?: Apollo.MutationHookOptions<
      CreateJoinProposalMutation,
      CreateJoinProposalVariables
    >,
  ) {
    return Apollo.useMutation<
    CreateJoinProposalMutation,
    CreateJoinProposalVariables
    >(CreateJoinProposalDocument, baseOptions);
}
