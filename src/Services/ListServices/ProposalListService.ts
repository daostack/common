import {
  CreateFundingProposalDocument,
  CreateFundingProposalInput,
  CreateJoinProposalDocument,
  CreateJoinProposalInput,
  CreateProposalVoteDocument,
  CreateVoteInput,
  finalizeProposalDocument,
  getProposalsDocument,
  onProposalChangeDocument,
  ProposalEntity,
  proposalsStateFilterQueryPart,
  ProposalState,
  ProposalType,
  ProposalWhereInput,
  getProposalDocumentById,
} from '~/Graphql/Proposal';
import logger from '~/Services/Logger';
import {Proposal} from '~/Stores/Models/Proposal';
import {getGQLErrorObject} from '~/Util';
import {apollo} from '~/Util/helpers/apolloHelper';

export type proposalListLoadCallbackFn = (
  updatedProposalList: Array<ProposalEntity>,
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

export const fetchProposalById = async (
  proposalId: string,
): Promise<ProposalEntity | undefined> => {
  if (!proposalId) {
    throw new Error(
      'Proposal Id (proposalId) is required parameter, but it was not provided',
    );
  }

  const {data} = await apollo.query({
    query: getProposalDocumentById,
    variables: {
      where: {
        id: proposalId,
      },
    },
  });

  if (!data.proposal) {
    return data;
  }
  return data.proposal as ProposalEntity;
};

// Create Proposals
export const createFundingProposal = async (
  formData: CreateFundingProposalInput,
) => {
  try {
    return await apollo.mutate({
      mutation: CreateFundingProposalDocument,
      variables: {
        proposal: formData,
      },
    });
  } catch (err) {
    logger.log(
      'Error while trying to create a new Funding Proposal: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

export const createJoinProposal = async (formData: CreateJoinProposalInput) => {
  try {
    return await apollo.mutate({
      mutation: CreateJoinProposalDocument,
      variables: {
        proposal: formData,
      },
      errorPolicy: 'none',
    });
  } catch (err) {
    logger.log(
      'Error while trying to create a new Join Proposal: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

export const createProposalVote = async (
  createProposalVoteData: CreateVoteInput,
) => {
  try {
    return await apollo.mutate({
      mutation: CreateProposalVoteDocument,
      variables: {
        proposalVote: createProposalVoteData,
      },
      errorPolicy: 'none',
    });
  } catch (err) {
    logger.log(
      'Error while trying to create a new Join Proposal: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

// Proposal actions
export const finalizeProposal = async (proposalId: string) => {
  try {
    return await apollo.mutate({
      mutation: finalizeProposalDocument,
      variables: {
        proposalId: proposalId,
      },
    });
  } catch (err) {
    logger.log(
      'Error while trying to listen for proposal change: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

// Proposal subscription
export const onProposalChange = (proposalId: string) => {
  try {
    return apollo.subscribe({
      query: onProposalChangeDocument,
      variables: {
        proposalId: proposalId,
      },
    });
  } catch (err) {
    logger.log(
      'Error while trying to listen for proposal change: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

// Fetch proposals
const getProposals = async (
  proposalsWhere: ProposalWhereInput,
  page: number = 0,
) => {
  try {
    return await apollo.query({
      query: getProposalsDocument,
      variables: {
        where: proposalsWhere,
        paginate: {
          skip: page * 10,
          take: 10,
        },
      },
      //fetchPolicy: 'cache-first',
    });
  } catch (err) {
    logger.log('Error while trying to get proposals: ', getGQLErrorObject(err));
    throw err;
  }
};

export const getCommonActiveProposals = async (
  commonId: string,
  page: number = 0,
): Promise<ProposalEntity[]> => {
  const {data} = await getProposals(
    {
      commonId: commonId,
      type: ProposalType.FUNDING_REQUEST,
      state: ProposalState.COUNTDOWN,
    },
    page,
  );
  return data.proposals;
};

export const getCommonHistoryProposals = async (
  commonId: string,
  page: number = 0,
): Promise<ProposalEntity[]> => {
  const {data} = await getProposals(
    {
      commonId: commonId,
      type: ProposalType.FUNDING_REQUEST,
      OR: proposalsStateFilterQueryPart([
        ProposalState.ACCEPTED,
        ProposalState.FINALIZING,
        ProposalState.REJECTED,
      ]),
    },
    page,
  );
  return data.proposals;
};

export const getCommonPendingReqToJoins = async (
  commonId: string,
  page: number = 0,
): Promise<ProposalEntity[]> => {
  const {data} = await getProposals(
    {
      commonId: commonId,
      type: ProposalType.JOIN_REQUEST,
      state: ProposalState.COUNTDOWN,
    },
    page,
  );
  return data.proposals;
};

export const getCommonHistoryReqToJoins = async (
  commonId: string,
  page: number = 0,
): Promise<ProposalEntity[]> => {
  const {data} = await getProposals(
    {
      commonId: commonId,
      type: ProposalType.JOIN_REQUEST,
      OR: proposalsStateFilterQueryPart([
        ProposalState.ACCEPTED,
        ProposalState.FINALIZING,
        ProposalState.REJECTED,
      ]),
    },
    page,
  );
  return data.proposals;
};
