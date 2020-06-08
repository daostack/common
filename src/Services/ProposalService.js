import {DB_COLLECTIONS} from './FirebaseService';

import {db} from '../Firebase';

export const PROPOSAL_STAGE = {
  ExpiredInQueue: '0',
  Executed: '1',
  Queued: '2',
  PreBoosted: '3',
  Boosted: '4',
  QuietEndingPeriod: '5',
};

export default class ProposalService {
  static serviceInstance = null;

  constructor() {}

  static getInstance = () => {
    if (ProposalService.serviceInstance == null) {
      ProposalService.serviceInstance = new ProposalService();
    }
    return this.serviceInstance;
  };

  async getProposalInfo(proposalUid) {
    console.log('proposalUid -> ', proposalUid);
    return db
      .collection(DB_COLLECTIONS.proposals)
      .doc(proposalUid)
      .get()
      .then(snapshots => {
        if (!snapshots) {
          return null;
        }
        return snapshots.data();
      });
  }

  async subscribeToProposalList(
    commonId,
    userId,
    stages,
    listChangeCallback,
    listRef,
    onlyRequestsToJoin,
  ) {
    console.log('subscribeToProposalList');

    let proposalCollection = db.collection(DB_COLLECTIONS.proposals);

    if (commonId) {
      proposalCollection = proposalCollection.where('dao', '==', commonId);
    }
    if (userId) {
      proposalCollection = proposalCollection.where('proposerId', '==', userId);
    }

    proposalCollection = proposalCollection.where('stageStr', 'in', stages);

    return proposalCollection.onSnapshot(
      snapshot => {
        if (snapshot.empty) {
          listChangeCallback([]);
        } else {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => {
              if (onlyRequestsToJoin) {
                if (!doc.data().joinAndQuit) {
                  return false;
                }
              }
              return {
                id: doc.id,
                ...doc.data(),
              };
            });

            let createList = newList
              .map(item => {
                let index = listRef.current.findIndex(v => v.id === item.id);
                if (index > -1) {
                  listRef.current[index] = item;
                } else {
                  return item;
                }
              })
              .filter(item => item);
            if (createList.length > 0) {
              const allList = [...createList, ...listRef.current];
              listRef.current = allList;
            }
            listChangeCallback(listRef.current);
          }
        }
      },
      error => console.error(error),
    );
  }
}
