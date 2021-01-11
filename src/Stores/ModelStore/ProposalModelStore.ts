import {observable, action} from 'mobx';

export const ProposalModel = (proposalInfo) =>
  observable.object(
    {
      // Fields
      uid: proposalInfo.uid,

      //proposalDiscussions

      // Actions
      setProposal(newProposalInfo) {
        if (newProposalInfo) {
          if (newProposalInfo.uid) {
            this.uid = newProposalInfo.uid;
          }
        }
      },
    },
    {
      setProposal: action,
    },
  );
