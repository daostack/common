import {axiosProposalClient} from '~/Config/network';
import {auth, db} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {ProposalsCollection} from '~/Firebase/Databasee/Collections/ProposalsCollection';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {
  CreateFundingRequestProposalPayload,
  IFundingRequestProposal,
  IJoinRequestProposal,
  IProposalEntity,
  JoinRequestPayload,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {
  CreateVotePayload,
  IVoteEntity,
} from '~/Firebase/Databasee/EntityTypes/IVoteEntity';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import {
  IProposalTypeFilter,
  isTypeFilterFundingRequest,
  isTypeFilterJoin,
} from '~/Stores/DataStores/ProposalStore';
import {getErrorObject} from '~/Util';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import Toast from '~/Util/Toast';
import {PROPOSAL_TYPE} from '../Config';

export type proposalListLoadCallbackFn = (
  updatedProposalList: Array<IProposalEntity>,
) => void;

const endpoints = {
  createJoin: '/create/join',
  createFunding: '/create/funding',
  createVote: '/create/vote',
};

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

export const LAUNCHED_STATES = [PROPOSAL_STAGE.passed];

export const COUNTDOWN_STATES = [PROPOSAL_STAGE.failed];

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

export const getUserProposalsCounts = async (
  uid: string,
  proposalTypeFilter: IProposalTypeFilter,
) => {
  let query = db
    .collection(DB_COLLECTIONS.proposals)
    .where('proposerId', '==', uid);

  if (isTypeFilterFundingRequest(proposalTypeFilter)) {
    query = query.where('type', '==', PROPOSAL_TYPE.FundingRequest);
  }

  if (isTypeFilterJoin(proposalTypeFilter)) {
    query = query.where('type', '==', PROPOSAL_TYPE.Join);
  }

  return query
    .get()
    .then(
      (
        snapshots: IFirebaseSnapshot<
          IJoinRequestProposal | IFundingRequestProposal
        >,
      ) => {
        if (!snapshots) {
          return {all: 0, active: 0, history: 0};
        } else {
          const stats = {
            all: snapshots.docs.length,
            active: snapshots.docs.filter((s) =>
              PROPOSAL_STAGES_ACTIVE.includes(s.data().state),
            ).length,
            history: snapshots.docs.filter((s) =>
              PROPOSAL_STAGES_HISTORY.includes(s.data().state),
            ).length,
          };
          return stats;
        }
      },
    );
};

export const subscribeToProposalDiscussionsCount = async (
  proposalId: string,
  callback: (value: number) => void,
) => {
  const proposalDiscussionMessages = db
    .collection(DB_COLLECTIONS.discussionMessages)
    .where('discussionId', '==', proposalId);

  return proposalDiscussionMessages.onSnapshot(
    (snapshot: IFirebaseSnapshot<IDiscussionEntity>) => {
      callback(snapshot.docs.length);
    },
    (error: string) => Toast.error(error),
  );
};

export const getProposalDiscussionsCount = async (
  proposalId: string,
): Promise<number> =>
  db
    .collection(DB_COLLECTIONS.discussionMessages)
    .where('discussionId', '==', proposalId)
    .get()
    .then((snapshots: IFirebaseSnapshot<IDiscussionEntity>) => {
      if (!snapshots) {
        return 0;
      }
      return snapshots.docs.length;
    });

export const subscribeToPendingProposalsData = async (
  daoId: string,
  userInfoUid: string,
  callback: (value: {
    pendingProposalCount: number;
    usersPendingProposal:
      | IFundingRequestProposal
      | IJoinRequestProposal
      | boolean;
  }) => void,
): Promise<FirestoreUnsubscribeFn> => {
  let proposals = db
    .collection(DB_COLLECTIONS.proposals)
    .where('commonId', '==', daoId)
    .where('type', '==', PROPOSAL_TYPE.Join)
    .where('state', 'in', [...PROPOSAL_STAGES_ACTIVE, PROPOSAL_STAGE.passed]);

  // We can add the payment state to the statement above, but not all proposals have it, so that will
  // exclude them

  return proposals.onSnapshot(
    (snapshot: IFirebaseSnapshot<IJoinRequestProposal>) => {
      const pendingProposals = snapshot.docs.filter(
        (x) =>
          // If the proposal is in any stage, but with pending payment
          ACTIVE_PAYMENT_STATES.some((y) => y === x.data().paymentState) ||
          // Or if it does not have payment state and is in active stage
          (x.data().paymentState === undefined &&
            x.data().state !== PROPOSAL_STAGE.passed),
      );

      console.log(pendingProposals);

      callback({
        pendingProposalCount: pendingProposals.length,
        usersPendingProposal:
          (userInfoUid &&
            pendingProposals
              .find(
                (
                  doc: IFirebaseDoc<
                    IJoinRequestProposal | IFundingRequestProposal
                  >,
                ) => doc.data().proposerId === userInfoUid,
              )
              ?.data()) ||
          false,
      });
    },
    (error: string) => Toast.error(error),
  );
};

export const createFundingProposal = async (
  formData: CreateFundingRequestProposalPayload,
): Promise<IFundingRequestProposal> => {
  try {
    return await axiosProposalClient.post(endpoints.createFunding, formData, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    });
  } catch (err) {
    console.log('CREATE FUNDING PROPOSAL ERROR -> ', getErrorObject(err));
    throw err;
  }
};

export const createRequestToJoin = async (
  formData: JoinRequestPayload,
): Promise<IJoinRequestProposal> => {
  try {
    return await axiosProposalClient.post(endpoints.createJoin, formData, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    });
  } catch (err) {
    console.log('CREATE REQUEST TO JOIN ERROR -> ', getErrorObject(err));
    throw err;
  }
};

export const createVote = async (
  formData: CreateVotePayload,
): Promise<IVoteEntity> => {
  try {
    return await axiosProposalClient.post(endpoints.createVote, formData, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    });
  } catch (err) {
    console.log('CREATE VOTE ERROR -> ', getErrorObject(err));
    throw err;
  }
};
