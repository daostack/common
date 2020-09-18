import WalletManager from '~/Util/WalletManager';
import {JoinProposal, FundingRequestProposal} from '@daostack/arc.js';
import {PROPOSAL_STAGES_HISTORY} from '../ProposalService';
import {NULL_ADDRESS, PROPOSAL_TYPE} from '~/Config';
import GraphqlSyncService from '../GraphqlSyncService';
import logger from '../Logger';

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

export const voteForProposal = async (
  arc,
  proposalId,
  data,
  proposalType = PROPOSAL_TYPE.Join,
) => {
  try {
    logger.log('voteForProposal');
    let proposal;

    if (proposalType === PROPOSAL_TYPE.Join) {
      proposal = new JoinProposal(arc, proposalId);
    } else {
      proposal = new FundingRequestProposal(arc, proposalId);
    }

    const errorHandler = async () => {
      const proposalState = await proposal.fetchState();
      if (proposalState.stage in PROPOSAL_STAGES_HISTORY) {
        throw Error(
          `Cannot vote: the proposal ${proposalId} has been already executed, or it expired`,
        );
      }
      // check if the user is a member of the Common
      const manager = await WalletManager.getInstance();
      const voter = manager.safeAddress;
      const dao = proposalState.dao.entity;
      const daoState = await dao.fetchState();
      const reputation = await daoState.reputation.entity;
      const oldReputationContract = await reputation.contract();
      const reputationContract = await oldReputationContract.addProvider();
      const reputationBalance = await reputationContract.balanceOf(voter);
      if (Number(reputationBalance) === 0) {
        throw Error(`Voting failed because you (${voter}) are not a member of this DAO (${dao.id}) - rep: ${reputationBalance}`);

      }
    };

    // TODO: error Handler shoudl only be called in case an error occurred, once https://daostack1.atlassian.net/browse/CM-402 is implemented
    // .. we are runnning the error handler here to check conditions before sending the transaction ...
    // .. this is expensive, and once we have reduced such errors to the minimmum, we should to error handling only ...
    // .. when the transaction actually failed
    logger.log('checking preconditions for voting');
    await errorHandler();
    logger.log('creating the vote transaction');
    const transaction = await createVoteTransaction(proposal, data.vote);
    logger.log('waiting for the transaction to be processed');
    const receipt = await transaction.contract.sendToRelayerWithReceipt(
      transaction.method,
      transaction.args,
    );

    logger.log('transactionHash -> ', receipt.transactionHash);

    await GraphqlSyncService.getInstance().syncProposalById(proposalId, receipt.blockNumber);

    // TODO: get the voteId from the transaction receipt and return it

    return receipt;
  } catch (e) {
    logger.log(e);
    throw e;
  }
};
