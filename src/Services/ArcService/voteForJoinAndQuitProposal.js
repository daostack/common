

// const {ARC_VERSION, OVERRIDES} = require('./arc');
const {first} = require('rxjs/operators');
import {ipfsUpload} from '../../Config';
const {OVERRIDES} = require('../../Config');
import {Arc, JoinAndQuitProposal} from '@daostack/arc.js';
import {PROPOSAL_STAGES_HISTORY} from '../../Services/ProposalService';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const createVoteTransaction = async (proposal, outcome) => {
  const amount = 0;
  return {
    contract: await proposal.votingMachine(),
    method: 'vote',
    args: [
      proposal.id, // proposalId
      outcome, // a value between 0 to and the proposal number of choices.
      amount.toString(), // amount of reputation to vote with . if _amount == 0 it will use all voter reputation.
      NULL_ADDRESS,
    ],
  };
};

export const voteForJoinAndQuitProposal = async (arc, proposalId, data) => {

  try {

    const proposal = new JoinAndQuitProposal(arc, proposalId);
    // console.log('Proposal -> ', proposal);

    // TODO: error Handler shoudl only be called in case an error occurred, once https://daostack1.atlassian.net/browse/CM-402 is implemented
    const errorHandler = async (receipt) => {
      const proposalState = await proposal.fetchState();
      console.log(proposalState);
      if (proposalState.stage in PROPOSAL_STAGES_HISTORY) {
        throw Error('Cannot vote: the proposal has been already executed, or it expired');
      }
    };
    await errorHandler(receipt);


    const voteTransaction = await createVoteTransaction(proposal, data.vote);
    // console.log('voteTransaction -> ', voteTransaction);
    const transaction = voteTransaction;
    const receipt = await transaction.contract.sendToRelayerWithReceipt(transaction.method, transaction.args);

    // const receipt = await voteTransaction.send();
    console.log('receipt -> ', receipt);
    console.log('transactionHAsh -> ', receipt.transactionHash);

  } catch (e) {
    console.log(e);
    throw e;
  }
};
