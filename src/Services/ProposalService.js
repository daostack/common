import {DB_COLLECTIONS} from './FirebaseService';

import {db} from '../Firebase';

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
}
