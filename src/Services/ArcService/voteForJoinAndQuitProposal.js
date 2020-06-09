
import {JoinAndQuitProposal} from '@daostack/arc.js';
import {PROPOSAL_STAGES_HISTORY} from '../../Services/ProposalService';

// TODO: move this to the config file
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

// TODO: rename this function to "voteForProposal". It probably works without changes fro the FundingRequest as well
export const voteForJoinAndQuitProposal = async (arc, proposalId, data) => {

  try {

    const proposal = new JoinAndQuitProposal(arc, proposalId);
    // console.log('Proposal -> ', proposal);

    // TODO: error Handler shoudl only be called in case an error occurred, once https://daostack1.atlassian.net/browse/CM-402 is implemented
    const errorHandler = async (receipt) => {
      const proposalState = await proposal.fetchState();
      if (proposalState.stage in PROPOSAL_STAGES_HISTORY) {
        throw Error('Cannot vote: the proposal has been already executed, or it expired');
      }
      // TODO: we also want to check if the user is a member of the Common here
    };
    await errorHandler(receipt);


    const voteTransaction = await createVoteTransaction(proposal, data.vote);
    // console.log('voteTransaction -> ', voteTransaction);
    const transaction = voteTransaction;
    const receipt = await transaction.contract.sendToRelayerWithReceipt(transaction.method, transaction.args);

    // const receipt = await voteTransaction.send();
    // console.log('receipt -> ', receipt);
    console.log('transactionHAsh -> ', receipt.transactionHash);

    // TODO: get the voteId from the transaction receipt and return it
    // TODO: once we have https://daostack1.atlassian.net/browse/CM-404, we should call "updateVotes" with the voteId
    return receipt;

  } catch (e) {
    console.log(e);
    throw e;
  }
};
