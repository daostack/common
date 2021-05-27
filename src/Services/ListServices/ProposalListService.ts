import {ProposalsCollection} from '~/Firebase/Databasee/Collections/ProposalsCollection';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE} from '~/Config';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import { CreateFundingProposalDocument, CreateFundingProposalInput, CreateJoinProposalDocument, CreateJoinProposalInput } from '~/Graphql/Proposal';
import ApolloClient from '~/Services/util/ApolloClient';
import { getErrorObject, getGQLErrorObject } from '~/Util';

export type proposalListLoadCallbackFn = (
  updatedProposalList: Array<IProposalEntity>,
) => void;

export const PROPOSAL_STAGE = {
  countdown: 'countdown',
  passed: 'passed',
  failed: 'failed',
  passedInsufficientBalance: 'passedInsufficientBalance',
};

export const PROPOSAL_STAGES_ACTIVE = [PROPOSAL_STAGE.countdown];
export const PROPOSAL_STAGES_HISTORY = [
  PROPOSAL_STAGE.passed,
  PROPOSAL_STAGE.failed,
  PROPOSAL_STAGE.passedInsufficientBalance,
];
export const PROPOSAL_STAGES_ALL = [
  ...PROPOSAL_STAGES_HISTORY,
  ...PROPOSAL_STAGES_ACTIVE,
];

interface ProposalFilter {
  id?: string;
  commonId?: string;
  userId?: string;
  showAll?: boolean;
  onlyRequestsToJoin?: boolean;
  onlyFundingRequests?: boolean;
  onlyActive?: boolean;
  onlyHistory?: boolean;
}

// Private
export const subscribeToProposalList = (
  listChangeCallback: (
    updatedProposals: IFirebaseSnapshot<IProposalEntity>,
  ) => void,
  filter: ProposalFilter,
): FirestoreUnsubscribeFn => {
  let proposalListQuery = ProposalsCollection;

  if (filter.id) {
    proposalListQuery = proposalListQuery.where('id', '==', filter.id);
  }
  if (filter.commonId) {
    proposalListQuery = proposalListQuery.where(
      'commonId',
      '==',
      filter.commonId,
    );
  }
  if (filter.userId) {
    proposalListQuery = proposalListQuery.where(
      'proposerId',
      '==',
      filter.userId,
    );
  }

  if (filter.onlyFundingRequests) {
    proposalListQuery = proposalListQuery.where(
      'type',
      '==',
      PROPOSAL_TYPE.FundingRequest,
    );
  }
  if (filter.onlyRequestsToJoin) {
    proposalListQuery = proposalListQuery.where(
      'type',
      '==',
      PROPOSAL_TYPE.Join,
    );
  }

  if (!filter.showAll) {
    if (filter.onlyActive || filter.onlyHistory) {
      const stages = filter.onlyActive
        ? PROPOSAL_STAGES_ACTIVE
        : PROPOSAL_STAGES_HISTORY;
      proposalListQuery = proposalListQuery.where('state', 'in', stages);
    } else {
      proposalListQuery = proposalListQuery.where(
        'state',
        'in',
        PROPOSAL_STAGES_ALL,
      );
    }
  }

  //proposalListQuery = proposalListQuery.orderBy('createdAt', 'desc');

  return proposalListQuery.onSnapshot(
    (snapshot: IFirebaseSnapshot<IProposalEntity>) => {
      listChangeCallback(snapshot);
    },
  );
};

export const fetchProposalById = async (
  proposalId: string,
): Promise<IFirebaseDoc<IProposalEntity>> => {
  if (!proposalId) {
    throw new Error(
      'Proposal Id (proposalId) is required parameter, but it was not provided',
    );
  }
  return await ProposalsCollection.doc(proposalId).get();
};

export const createFundingProposal = async (formData: CreateFundingProposalInput) => {
  try {
    return await ApolloClient.getInstance().mutate({
      mutation: CreateFundingProposalDocument,
      variables: {
        proposal: formData,
      },
    });
  } catch (err) {
    console.log('CREATE FUNDING PROPOSAL ERROR -> ', getGQLErrorObject(err));
    throw err;
  }
};

export const createJoinProposal = async (formData: CreateJoinProposalInput) => {
  try {
    return await ApolloClient.getInstance().mutate({
      mutation: CreateJoinProposalDocument,
      variables: {
        proposal: formData,
      },
      errorPolicy: 'none',
    });
  } catch (err) {
    console.log('CREATE FUNDING PROPOSAL ERROR -> ', getGQLErrorObject(err));
    throw err;
  }
};



// async createRequestToJoin(formData) {
//   try {
//     return await this.axiosClient.post(this.endpoints.createJoin, formData, {
//       headers: {
//         Authorization: await auth().currentUser.getIdToken(true),
//       },
//     });
//   } catch (err) {
//     console.log('CREATE REQUEST TO JOIN ERROR -> ', getErrorObject(err));
//     throw err;
//   }
// }
