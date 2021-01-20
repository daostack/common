import {ProposalsCollection} from '~/Firebase/Databasee/Collections/ProposalsCollection';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE} from '~/Config';
import {FirestoreUnsubscribeFn, IFirebaseSnapshot} from '~/Firebase/types';

export type proposalListLoadCallbackFn = (
  updatedProposalList: Array<IProposalEntity>,
) => void;

export const PROPOSAL_STAGE = {
  countdown: 'countdown',
  passed: 'passed',
  failed: 'failed',
};

export const PROPOSAL_STAGES_ACTIVE = [PROPOSAL_STAGE.countdown];
export const PROPOSAL_STAGES_HISTORY = [
  PROPOSAL_STAGE.passed,
  PROPOSAL_STAGE.failed,
];
export const PROPOSAL_STAGES_ALL = [
  ...PROPOSAL_STAGES_HISTORY,
  ...PROPOSAL_STAGES_ACTIVE,
];

interface ProposalFilter {
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
  listChangeCallback: (updatedProposals: IFirebaseSnapshot) => void,
  filter: ProposalFilter,
): FirestoreUnsubscribeFn => {
  console.log('PROPOSAL SERVICE subscribeToProposalList ', filter);

  let proposalListQuery = ProposalsCollection;

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

  console.log('proposalListQuery ', proposalListQuery);

  return proposalListQuery.onSnapshot((snapshot: IFirebaseSnapshot) => {
    console.log('PROPOSAL ON SNAPSHOT -> ', snapshot);

    if (snapshot) {
      let proposalsList = [];

      // // TODO: Make better handling of changes with docChanges()
      // if (!snapshot.empty) {
      //   proposalsList = snapshot.docs.map(
      //     (doc: any) => doc.data() as IProposalEntity,
      //   );
      // }

      listChangeCallback(snapshot);
    } else {
      console.log('===========================================');
      console.log('NULL SNAPSHOT RETURNED');
      console.log('===========================================');
    }
  });
};
