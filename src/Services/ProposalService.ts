import axios, {AxiosInstance} from 'axios';
import {auth, db} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {ProposalsCollection} from '~/Firebase/Databasee/Collections/ProposalsCollection';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {
  BasicArgsProposal,
  ProposalType,
} from '~/Firebase/Databasee/EntityTypes/basicArgsProposal';
import {MembershipAdmittance} from '~/Firebase/Databasee/EntityTypes/memberAdmittance';
import {
  ChangeVotePayload,
  IVoteEntity,
} from '~/Firebase/Databasee/EntityTypes/IVoteEntity';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import {
  IProposalTypeFilter,
  isTypeFilterFundingAllocation,
  isTypeFilterJoin,
} from '~/Stores/DataStores/ProposalStore';
import {getErrorObject} from '~/Util';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import Toast from '~/Util/Toast';
import {proposalsUrl, PROPOSAL_TYPE} from '~/Config';
import logger from '~/Services/Logger';

export type proposalListLoadCallbackFn = (
  updatedProposalList: Array<BasicArgsProposal>,
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

export const LAUNCHED_STATES = [PROPOSAL_STAGE.passed];

export const COUNTDOWN_STATES = [PROPOSAL_STAGE.failed];

interface ProposalFilter {
  id?: string;
  commonId?: string;
  userId?: string;
  showAll?: boolean;
  onlyRequestsToJoin?: boolean;
  onlyFundingAllocations?: boolean;
  onlyActive?: boolean;
  onlyHistory?: boolean;
}

class ProposalService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    createJoin: string;
    createFundingAllocation: string;
    create: string;
    vote: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: proposalsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      createJoin: '/create/join', // also this
      createFundingAllocation: '/create/funding', //delete anyway
      create: '/create',
      vote: '/vote',
    };
  }

  // Private
  subscribeToProposalList = (
    listChangeCallback: (
      updatedProposals: IFirebaseSnapshot<BasicArgsProposal>,
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

    if (filter.onlyFundingAllocations) {
      proposalListQuery = proposalListQuery.where(
        'type',
        '==',
        PROPOSAL_TYPE.FundingAllocation,
      );
    }
    if (filter.onlyRequestsToJoin) {
      proposalListQuery = proposalListQuery.where(
        'type',
        '==',
        PROPOSAL_TYPE.MembershipAdmittance,
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
      (snapshot: IFirebaseSnapshot<BasicArgsProposal>) => {
        listChangeCallback(snapshot);
      },
    );
  };

  fetchProposalById = async (
    proposalId: string,
  ): Promise<IFirebaseDoc<BasicArgsProposal>> => {
    if (!proposalId) {
      throw new Error(
        'Proposal Id (proposalId) is required parameter, but it was not provided',
      );
    }
    return await ProposalsCollection.doc(proposalId).get();
  };

  getUserProposalsCounts = async (
    uid: string,
    proposalTypeFilter: IProposalTypeFilter,
  ) => {
    let query = db
      .collection(DB_COLLECTIONS.proposals)
      .where('proposerId', '==', uid);

    if (isTypeFilterFundingAllocation(proposalTypeFilter)) {
      query = query.where('type', '==', PROPOSAL_TYPE.FundingAllocation);
    }

    if (isTypeFilterJoin(proposalTypeFilter)) {
      query = query.where('type', '==', PROPOSAL_TYPE.MembershipAdmittance);
    }

    return query.get().then((snapshots: IFirebaseSnapshot<ProposalType>) => {
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
    });
  };

  subscribeToProposalDiscussionsCount = async (
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

  getProposalDiscussionsCount = async (proposalId: string): Promise<number> =>
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

  subscribeToPendingProposalsData = async (
    daoId: string,
    userInfoUid: string,
    callback: (value: {
      pendingProposalCount: number;
      usersPendingProposal: ProposalType | boolean;
    }) => void,
  ): Promise<FirestoreUnsubscribeFn> => {
    let proposals = db
      .collection(DB_COLLECTIONS.proposals)
      .where('commonId', '==', daoId)
      .where('type', '==', PROPOSAL_TYPE.MembershipAdmittance)
      .where('state', 'in', [...PROPOSAL_STAGES_ACTIVE, PROPOSAL_STAGE.passed]);

    // We can add the payment state to the statement above, but not all proposals have it, so that will
    // exclude them

    return proposals.onSnapshot(
      (snapshot: IFirebaseSnapshot<MembershipAdmittance>) => {
        const pendingProposals = snapshot.docs.filter(
          (x) =>
            // If the proposal is in any stage, but with pending payment
            ACTIVE_PAYMENT_STATES.some((y) => y === x.data().paymentState) ||
            // Or if it does not have payment state and is in active stage
            (x.data().paymentState === undefined &&
              x.data().state !== PROPOSAL_STAGE.passed),
        );

        logger.log(pendingProposals);

        callback({
          pendingProposalCount: pendingProposals.length,
          usersPendingProposal:
            (userInfoUid &&
              pendingProposals
                .find(
                  (doc: IFirebaseDoc<ProposalType>) =>
                    doc.data().proposerId === userInfoUid,
                )
                ?.data()) ||
            false,
        });
      },
      (error: string) => Toast.error(error),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create = async (payload: ProposalType) => {
    try {
    } catch (err) {
      logger.log('CREATE PROPOSAL ERROR -> ', getErrorObject(err));
      throw err;
    }
  };

  createVote = async (formData: ChangeVotePayload): Promise<IVoteEntity> => {
    try {
      return await this.axiosClient.post(this.endpoints.vote, formData, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (err) {
      logger.log('CREATE VOTE ERROR -> ', getErrorObject(err));
      throw err;
    }
  };

  updateVote = async (formData: ChangeVotePayload): Promise<IVoteEntity> => {
    try {
      return await this.axiosClient.patch(this.endpoints.vote, formData, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (err) {
      logger.log('UPDATE VOTE ERROR -> ', getErrorObject(err));
      throw err;
    }
  };
}

export default new ProposalService();
