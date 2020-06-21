import WalletManager from '../../Util/WalletManager';
import {JoinAndQuitProposal, FundingRequestProposal} from '@daostack/arc.js';
import { PROPOSAL_STAGES_HISTORY } from '../ProposalService';
import axios from 'axios';
import { NULL_ADDRESS, PROPOSAL_TYPE, graphqlUrl} from '../../Config';

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
export const voteForProposal = async (
  arc,
  proposalId,
  data,
  proposalType = PROPOSAL_TYPE.JoinAndQuit,
) => {
  try {
    console.log('voteForProposal');
    let proposal;

    if (proposalType === PROPOSAL_TYPE.JoinAndQuit) {
      proposal = new JoinAndQuitProposal(arc, proposalId);
    } else {
      proposal = new FundingRequestProposal(arc, proposalId);
    }

    const errorHandler = async () => {
      const proposalState = await proposal.fetchState();
      if (proposalState.stage in PROPOSAL_STAGES_HISTORY) {
        throw Error(
          'Cannot vote: the proposal has been already executed, or it expired',
        );
      }
      // check if the user is a member of the Common
      const voter =  WalletManager.getInstance().safeAddress;
      const dao = proposalState.dao.entity;
      const daoState = await dao.fetchState();
      const reputation = await daoState.reputation.entity;
      const reputationContract = await reputation.contract();
      const reputationBalance = await reputationContract.balanceOf(voter);
      if (Number(reputationBalance) === 0) {
        throw Error(`Voting failed because you (${voter}) are not a member of this DAO (${dao.id}) - rep: ${reputationBalance}`);

      }
    };

    // TODO: error Handler shoudl only be called in case an error occurred, once https://daostack1.atlassian.net/browse/CM-402 is implemented
    // .. we are runnning the error handler here to check conditions before sending the transaction ...
    // .. this is expensive, and once we have reduced such errors to the minimmum, we should to error handling only ...
    // .. when the transaction actually failed
    await errorHandler();

    const voteTransaction = await createVoteTransaction(proposal, data.vote);
    const transaction = voteTransaction;
    const receipt = await transaction.contract.sendToRelayerWithReceipt(
      transaction.method,
      transaction.args,
    );

    console.log('transactionHAsh -> ', receipt.transactionHash);

    const axiosClient = axios.create({
      baseURL: graphqlUrl,
      timeout: 1000000, // milliseconds
    });

    console.log('Proposals updating started.');
    const proposalUpdateResponse = await axiosClient.get('update-proposals');
    console.log('Proposals updated: ', proposalUpdateResponse);

    // TODO: get the voteId from the transaction receipt and return it

    return receipt;
  } catch (e) {
    console.log('ERROR IN VOTE FOR PROPOSAL');
    console.log(e);
    throw e;
  }
};
