
import {gql} from '@apollo/client';
import {Exact, LinkInput, Maybe, Scalars} from '~/Graphql';


type BillingDetailsInput = {
    name: Scalars['String'],
    city: Scalars['String'],
    country: Scalars['String'],
    line1: Scalars['String'],
    postalCode: Scalars['String'],
    line2: Scalars['String'],
    district: Scalars['String'],
    links: Maybe<Array<LinkInput>>,
  };


export type CreateCardInput = {
    keyId: Scalars['String'],
    encryptedData: Scalars['String'],
    expYear: Scalars['Int'],
    expMonth: Scalars['Int'],
    billingDetails: BillingDetailsInput,
};

// Input Variables

export type CreateFundingProposalMutationVariables = Exact<{
    createCard: CreateCardInput;
}>;



export const CreateCardDocument = gql`
  mutation CreateJoinProposal($createCard: CreateCardInput!) {
    createCard(input: $createCard) {
      id
    }
  }
`;


