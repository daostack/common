// TODO: rename this file to °createProposalRequestToJoin.js°
const {first} = require('rxjs/operators');
import {ipfsUpload, IPFS_DATA_VERSION, PROPOSAL_TYPE} from '~/Config';
import WalletManager from '~/Util/WalletManager';
import logger from '../Logger';

export const createProposalRequestToJoin = async (arc, daoId, data) => {
  // data must look like this
  // {
  //   title: `A test proposal on ${Date()}`,
  //   description: 'Some description',
  //   files: [],
  //   images: [],
  //   links: [], // {title: "title", url: "url"}
  //   funding: new BN(100000),
  // .  payment: { ... }
  // };

  try {
    const dao = arc.dao(daoId);

    let joinPlugin;
    try {
      joinPlugin = await dao.plugin({where: {name: PROPOSAL_TYPE.Join}});
    } catch (e) {
      logger.log(e);
      logger.log(daoId);
      const plugins = await dao
        .plugins()
        .pipe(first())
        .toPromise();
      logger.log(plugins.map((p) => p.coreState.name));
      throw e;
    }

    logger.log('joinPlugin', joinPlugin.id);

    let ipfsHash;
    if (!data.funding) {
      throw Error('"funding" argument must be given');
    }
    const fee = Number(data.funding);
    data = {...data, VERSION: IPFS_DATA_VERSION};
    logger.log('saving ipfs data');
    // not working :-()
    // ipfsHash = await arc.saveIPFSData(data);
    ipfsHash = await ipfsUpload({description: JSON.stringify(data)});
    logger.log('ipfsHash', ipfsHash);

    const args = {
      descriptionHash: ipfsHash,
      fee: 0,
      dao: dao.id,
      plugin: joinPlugin.coreState.address,
    };

    const errorHandler = async () => {
      const errorJoinPlugin = await dao.plugin({where: {name: PROPOSAL_TYPE.Join}});
      const joinContract  = await arc.getContract(errorJoinPlugin.coreState.address);
      const manager = await WalletManager.getInstance();
      const proposer = manager.safeAddress;

      logger.log('proposer ->', proposer, manager.address);

      // we check the conditions from the contract

      // require(!fundings[proposer].candidate, "already a candidate");
      const memberFund = await joinContract.membersState(proposer);
      if (memberFund === true) {
        // If this error is thrown from a user action, there is a ui bug:s it means that some action was enabled where it shoudl not
        throw Error(`Cannot create the proposal, because the proposer ${proposer} has already a pending membership request`);
      }

      // require(avatar.nativeReputation().balanceOf(proposer) == 0, "already a member");
      const daoState = await dao.fetchState();
      const reputation = await daoState.reputation.entity;
      const reputationContract = await reputation.contract();
      const reputationBalanceOfProposer = await reputationContract.balanceOf(proposer);
      if (Number(reputationBalanceOfProposer) !== 0) {
        throw Error(`Request to join failed because you (${proposer}) are already a member of this DAO (${dao.id}) - rep: ${reputationBalanceOfProposer}`);
      }

      // const minFeeToJoin = Number(joinPlugin.coreState.pluginParams.minFeeToJoin);
      // if (fee < minFeeToJoin) {
      //   const msg = `fee (${fee}) should be >= minFeeToJoin (${minFeeToJoin})`;
      //   throw Error(msg);
      // }
      // require(_feeAmount >= minFeeToJoin, "_feeAmount should be >= then the minFeeToJoin")
    };
    // TODO: we are runnning the error handler here to check conditions before sending the transaction ...
    // .. this is expensive, and once we have reduced such errors to the minimmum, we should to error handling only ...
    // .. when the transaction actually failed
    logger.log('checking precondition for transaction');
    await errorHandler();
    logger.log('preconditions are ok - creating the transaction');
    const transaction = await joinPlugin.createProposalTransaction(args);
    // send the request to the cloudfunction relayer

    logger.log('fee ->', fee);
    const manager = await WalletManager.getInstance();
    const proposalId = await manager.requestToJoin(transaction.contract, transaction.method, transaction.args, data.preAuthId);
    return proposalId;
  } catch (e) {
    logger.log(e.data);
    throw e;
  }
};
