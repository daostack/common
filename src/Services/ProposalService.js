
import {DB_COLLECTIONS} from '../Firebase/Databasee';
import Toast from '../Util/Toast';
import moment from 'moment';

import {db} from '../Firebase';

export const PROPOSAL_STAGE = {
  ExpiredInQueue: '0',
  Executed: '1',
  Queued: '2',
  PreBoosted: '3',
  Boosted: '4',
  QuietEndingPeriod: '5',
};

import {PROPOSAL_TYPE} from '../Config';

export const PROPOSAL_STAGES_ACTIVE = [
  PROPOSAL_STAGE.Queued,
  PROPOSAL_STAGE.PreBoosted,
  PROPOSAL_STAGE.Boosted,
  PROPOSAL_STAGE.QuietEndingPeriod,
];

export const PROPOSAL_STAGES_HISTORY = [
  PROPOSAL_STAGE.ExpiredInQueue,
  PROPOSAL_STAGE.Executed,
];

export const LAUNCHED_STATES = [
  PROPOSAL_STAGE.Queued, PROPOSAL_STAGE.PreBoosted,
];

export const COUNTDOWN_STATES = [
  PROPOSAL_STAGE.Boosted, PROPOSAL_STAGE.QuietEndingPeriod,
];

export default class ProposalService {
  static serviceInstance = null;

  constructor() {}

  static getInstance = () => {
    if (ProposalService.serviceInstance == null) {
      ProposalService.serviceInstance = new ProposalService();
    }
    return this.serviceInstance;
  };

  async getUserProposalsCounts(uid, onlyMembershipRequests = false, onlyFundingProposals = false) {
    let query = db
      .collection(DB_COLLECTIONS.proposals)
      .where('proposerId', '==', uid);

    if (onlyFundingProposals) {
      query = query.where('type', '==', PROPOSAL_TYPE.FundingRequest);
    }

    if (onlyMembershipRequests) {
      query = query.where('type', '==', PROPOSAL_TYPE.Join);
    }

    return query.get()
      .then((snapshots) => {
        if (!snapshots) {
          return {all: 0, active: 0, history: 0};
        } else {
          const stats = {
            all: snapshots.docs.length,
            active: snapshots.docs.filter((s) => PROPOSAL_STAGES_ACTIVE.includes(s.data().stageStr)).length,
            history: snapshots.docs.filter((s) => PROPOSAL_STAGES_HISTORY.includes(s.data().stageStr)).length,
          };
          return stats;
        }
      });
  }

  async getUserPendingProposals(uid) {
    let query = db
      .collection(DB_COLLECTIONS.proposals)
      .where('proposerId', '==', uid)
      .where('type', '==', PROPOSAL_TYPE.JoinAndQuit);
    return query.get().then((snapshots) => {
      if (!snapshots) {
        return [];
      } else {
        return snapshots.docs.filter((s) => PROPOSAL_STAGES_ACTIVE.includes(s.data().stageStr));
      }
    });
  }

  async getProposalInfo(proposalUid) {
    return db
      .collection(DB_COLLECTIONS.proposals)
      .doc(proposalUid)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        return snapshots.data();
      });
  }

  async getProposalDiscussionsCount(proposalId) {
    return db
      .collection(DB_COLLECTIONS.discussionMessages)
      .where('discussionId', '==', proposalId )
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return 0;
        }
        return snapshots.docs.length;
      });
  }

  async subscribeToPendingProposalsData(daoId, userSafeAddress, callback) {
    let proposals = db
      .collection(DB_COLLECTIONS.proposals)
      .where('dao', '==', daoId)
      .where('closingAt', '>', moment().unix())
      .where('type', '==', PROPOSAL_TYPE.Join)
      .where('stageStr', 'in', PROPOSAL_STAGES_ACTIVE)
      .orderBy('closingAt', 'desc');

    return proposals.onSnapshot((snapshot) => {
      callback({
        pendingProposalCount: snapshot.docs.length,
        usersPendingProposal: (userSafeAddress && snapshot.docs.find((doc) => doc.data().proposer === userSafeAddress)?.data()) || false,
      });
    }, (error) => Toast.error(error));

  }

  async subscribeToProposalById(proposalId, callback) {

    let proposals = db
      .collection(DB_COLLECTIONS.proposals)
      .where('id', '==', proposalId);

    return proposals.onSnapshot((snapshot) => {
      callback(snapshot.docChanges()[0].doc._data);
    }, (error) => Toast.error(error));

  }

  async subscribeToProposalList(
    commonId,
    userId,
    stages,
    safeAddress,
    showAll,
    listChangeCallback,
    listRef,
    onlyRequestsToJoin,
    onlyFundingRequests,
    membershipRequests = false
  ) {

    let proposalCollection = db.collection(DB_COLLECTIONS.proposals);

    if (commonId) {
      proposalCollection = proposalCollection.where('dao', '==', commonId);
    }
    if (userId) {
      proposalCollection = proposalCollection.where('proposerId', '==', userId);
    }

    if (onlyFundingRequests) {
      proposalCollection = proposalCollection.where('type', '==', PROPOSAL_TYPE.FundingRequest);
    }

    if (safeAddress) {
      if (safeAddress.isCreatingInProgress) {

      } else {
        proposalCollection = proposalCollection.where(
          'proposer',
          '==',
          safeAddress.toString(),
        );
      }
    }

    if (membershipRequests) {
      // // Start the query from the beginning because we want
      // // all request for the user commons, not only those made by
      // // the user itself
      // proposalCollection = db.collection(DB_COLLECTIONS.proposals);
      //
      // // List of the ids of all daos that the user is part of
      // let daos  = await db.collection(DB_COLLECTIONS.daos)
      //   .get();
      // let userDaos = [];
      //
      // daos.forEach(doc => {
      //   if(doc.data().members.some(x => x.address == safeAddress)) {
      //     userDaos.push(doc.data().id)
      //   }
      //
      //   return doc;
      // })
      //
      // proposalCollection = proposalCollection
      //   // Only the join and quit proposals
      //   .where('type', '==', PROPOSAL_TYPE.Join)
      //   // Only those made to dao that the user is member of
      //   .where('dao', 'in', userDaos);

      proposalCollection = proposalCollection.where('type', '==', PROPOSAL_TYPE.Join);
    }

    if (!showAll) {
      proposalCollection = proposalCollection.where('stageStr', 'in', stages);
    }

    proposalCollection = proposalCollection.orderBy('closingAt', 'desc');


    return proposalCollection.onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          listChangeCallback([]);
        } else {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => {
              if (onlyRequestsToJoin) {
                if (doc.data().type !== PROPOSAL_TYPE.Join) {
                  return false;
                }
              }
              return {
                id: doc.id,
                ...doc.data(),
              };
            });

            let createList = newList
              .map((item) => {
                let index = listRef.current.findIndex((v) => v.id === item.id);
                if (index > -1) {
                  listRef.current[index] = item;
                } else {
                  return item;
                }
              })
              .filter((item) => item);
            if (createList.length > 0) {
              const allList = [...createList, ...listRef.current];
              listRef.current = allList;
            }
            listChangeCallback(listRef.current);
          }
        }
      },
      (error) => console.error(error),
    );
  }
}
