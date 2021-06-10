import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import Toast from '~/Util/Toast';
import {db} from '~/Firebase';
import logger from './Logger';

import axios from 'axios';
import {proposalsUrl} from '~/Config';
import {auth} from '~/Firebase';
import {getErrorObject} from '~/Util';

export const PROPOSAL_STAGE = {
  countdown: 'countdown',
  passed: 'passed',
  failed: 'failed',
  passedInsufficientBalance: 'passedInsufficientBalance',
};

import {PROPOSAL_TYPE} from '../Config';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';

export const PROPOSAL_STAGES_ACTIVE = [PROPOSAL_STAGE.countdown];

export const PROPOSAL_STAGES_HISTORY = [
  PROPOSAL_STAGE.passed,
  PROPOSAL_STAGE.failed,
  PROPOSAL_STAGE.passedInsufficientBalance,
];

export const LAUNCHED_STATES = [PROPOSAL_STAGE.passed];

export const COUNTDOWN_STATES = [PROPOSAL_STAGE.failed];

import {
  isTypeFilterFundingRequest,
  isTypeFilterJoin,
} from '~/Stores/DataStores/ProposalStore';
import Logger from './Logger';

export default class ProposalService {
  static serviceInstance = null;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: proposalsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      createJoin: '/create/join',
      createFunding: '/create/funding',
      createVote: '/create/vote',
    };
  }

  static getInstance = () => {
    if (ProposalService.serviceInstance == null) {
      ProposalService.serviceInstance = new ProposalService();
    }
    return this.serviceInstance;
  };

  async getUserProposalsCounts(uid, proposalTypeFilter) {
    let query = db
      .collection(DB_COLLECTIONS.proposals)
      .where('proposerId', '==', uid);

    if (isTypeFilterFundingRequest(proposalTypeFilter)) {
      query = query.where('type', '==', PROPOSAL_TYPE.FundingRequest);
    }

    if (isTypeFilterJoin(proposalTypeFilter)) {
      query = query.where('type', '==', PROPOSAL_TYPE.Join);
    }

    return query.get().then((snapshots) => {
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
  }

  async subscribeToUserPendingProposals(uid, callback) {
    let query = db
      .collection(DB_COLLECTIONS.proposals)
      .where('proposerId', '==', uid)
      .where('type', '==', PROPOSAL_TYPE.Join)
      .where('state', 'in', [...PROPOSAL_STAGES_ACTIVE, PROPOSAL_STAGE.passed]);

    return query.onSnapshot((snapshots) => {
      if (!snapshots) {
        callback([]);
      } else {
        callback(
          snapshots.docs.filter((s) => {
            const doc = s.data();

            return (
              PROPOSAL_STAGES_ACTIVE.some((x) => x === doc.state) ||
              ACTIVE_PAYMENT_STATES.includes(doc.paymentState)
            );
          }),
        );
      }
    });
  }

  async getProposalInfo(proposalId) {
    return db
      .collection(DB_COLLECTIONS.proposals)
      .doc(proposalId)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        return snapshots.data();
      });
  }

  async subscribeToProposalDiscussionsCount(proposalId, callback) {
    const proposalDiscusstionMessages = db
      .collection(DB_COLLECTIONS.discussionMessages)
      .where('discussionId', '==', proposalId);

    return proposalDiscusstionMessages.onSnapshot(
      (snapshot) => {
        callback(snapshot.docs.length);
      },
      (error) => Toast.error(error),
    );
  }

  async getProposalDiscussionsCount(proposalId) {
    return db
      .collection(DB_COLLECTIONS.discussionMessages)
      .where('discussionId', '==', proposalId)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return 0;
        }
        return snapshots.docs.length;
      });
  }

  async subscribeToPendingProposalsData(daoId, userInfoUid, callback) {
    let proposals = db
      .collection(DB_COLLECTIONS.proposals)
      .where('commonId', '==', daoId)
      .where('type', '==', PROPOSAL_TYPE.Join)
      .where('state', 'in', [...PROPOSAL_STAGES_ACTIVE, PROPOSAL_STAGE.passed]);

    // We can add the payment state to the statement above, but not all proposals have it, so that will
    // exclude them

    return proposals.onSnapshot(
      (snapshot) => {
        const pendingProposals = snapshot.docs.filter(
          (x) =>
            // If the proposal is in any stage, but with pending payment
            ACTIVE_PAYMENT_STATES.some((y) => y === x.data().paymentState) ||
            // Or if it does not have payment state and is in active stage
            (x.data().paymentState === undefined &&
              x.data().state !== PROPOSAL_STAGE.passed),
        );

        callback({
          pendingProposalCount: pendingProposals.length,
          usersPendingProposal:
            (userInfoUid &&
              pendingProposals
                .find((doc) => doc.data().proposerId === userInfoUid)
                ?.data()) ||
            false,
        });
      },
      (error) => Toast.error(error),
    );
  }

  async subscribeToProposalById(proposalId, callback) {
    let proposals = db
      .collection(DB_COLLECTIONS.proposals)
      .where('id', '==', proposalId);

    return proposals.onSnapshot(
      (snapshot) => {
        callback(snapshot.docChanges()[0].doc._data);
      },
      (error) => Toast.error(error),
    );
  }

  async subscribeToProposalList(
    commonId,
    userId,
    stages,
    showAll,
    listChangeCallback,
    listRef,
    onlyRequestsToJoin,
    onlyFundingRequests,
    membershipRequests = false,
  ) {
    let proposalCollection = db.collection(DB_COLLECTIONS.proposals);

    if (commonId) {
      proposalCollection = proposalCollection.where('commonId', '==', commonId);
    }
    if (userId) {
      proposalCollection = proposalCollection.where('proposerId', '==', userId);
    }

    if (onlyFundingRequests) {
      proposalCollection = proposalCollection.where(
        'type',
        '==',
        PROPOSAL_TYPE.FundingRequest,
      );
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
      //   if(doc.data().members.some(x => x.userId == userId)) {
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

      proposalCollection = proposalCollection.where(
        'type',
        '==',
        PROPOSAL_TYPE.Join,
      );
    }

    if (!showAll) {
      proposalCollection = proposalCollection.where('state', 'in', stages);
    }

    proposalCollection = proposalCollection.orderBy('createdAt', 'desc');

    return proposalCollection.onSnapshot(
      (snapshot) => {
        if (!snapshot || snapshot.empty) {
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
      (error) => logger.error(error),
    );
  }

  //TODO: NoBlockchain: Move that logic in separate file ?
  async createFundingProposal(formData) {
    try {
      return await this.axiosClient.post(
        this.endpoints.createFunding,
        formData,
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (err) {
      Logger.log('CREATE FUNDING PROPOSAL ERROR -> ', getErrorObject(err));
      throw err;
    }
  }

  async createRequestToJoin(formData) {
    try {
      return await this.axiosClient.post(this.endpoints.createJoin, formData, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (err) {
      Logger.log('CREATE REQUEST TO JOIN ERROR -> ', getErrorObject(err));
      throw err;
    }
  }

  async createVote(formData) {
    try {
      return await this.axiosClient.post(this.endpoints.createVote, formData, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (err) {
      Logger.log('CREATE VOTE ERROR -> ', getErrorObject(err));
      throw err;
    }
  }
}
