import {ProposalsCollection} from '~/Firebase/Databasee/Collections/ProposalsCollection';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';

export type proposalListLoadCallbackFn = (
  updatedProposalList: Array<IProposalEntity>,
) => void;

export const subscribeToAllProposals = (callback: proposalListLoadCallbackFn) =>
  ProposalsCollection.onSnapshot((snapshot: any) => {
    let proposalList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      proposalList = snapshot.docs.map(
        (doc: any) => doc.data() as IProposalEntity,
      );
    }

    callback(proposalList);
  });
