import {ethers} from 'ethers';
import WalletManager from '~/Util/WalletManager';
import {ipfsUpload} from '~/Config';
import GraphqlSyncService from '../GraphqlSyncService';
import logger from '../Logger';
const {first} = require('rxjs/operators');
const {
  ARC_VERSION,
  IPFS_DATA_VERSION,
  PROPOSAL_TYPE,
} = require('~/Config');


export const createFundingProposal = async (arc, userAddress, daoId, data) => {
  // data must look like this
  // {
  //   title: `A test proposal on ${Date()}`,
  //   description: 'Some description',
  //   files: [],
  //   images: [],
  //   links: [], // {title: "title", url: "url"}
  //   funding: new BN(100000),
  // };

  try {
    const dao = arc.dao(daoId);

    const plugins = await dao.plugins().first();
    const abi = arc.getABI({abiName: 'FundingRequest', version: ARC_VERSION});
    const interf = new ethers.utils.Interface(abi);

    logger.log(interf);
    logger.log(interf.events);


    logger.log('PLUGINS -> ', plugins);

    let fundingRequestPlugin;
    try {
      fundingRequestPlugin = await dao.plugin({
        where: {name: 'FundingRequest'},
      });
    } catch (e) {
      logger.log(e);
      logger.log(daoId);
      const catchPlugins = await dao
        .plugins()
        .pipe(first())
        .toPromise();
      logger.log(catchPlugins.map((p)=> p.coreState.name));
      throw e;
    }

    logger.log('fundingRequestPlugin', fundingRequestPlugin.id);

    let ipfsHash;
    const funding = data.funding;
    if (!funding) {
      throw Error('"funding" argument must be given');
    }

    const oldDaoContract = await arc.getContract(dao.id);
    const daoContract = await oldDaoContract.addProvider();

    const errorHandler = async (receipt) => {
      // lets first check some sanity things about the dao
      const joinPlugin = await dao.plugin({where: {name: PROPOSAL_TYPE.Join}});
      const joinPluginState = await joinPlugin.fetchState();
      const errorFundingRequestPlugin = await dao.plugin({where: {name: 'FundingRequest'}});
      const fundingRequestPluginState = await errorFundingRequestPlugin.fetchState();
      const activationTime = fundingRequestPluginState.pluginParams.voteParams.activationTime;
      if (activationTime > ((new Date()).getTime() / 1000)) {
        throw Error(`Canot create a funding request as the plugin is not actived yet (it activates on ${activationTime})`);
      }

      // TODO: The "FUNDED_BEFORE_DEADLINE" flag can (and should) be set on common creation, not on "first proposal creation"
      let fundingGoalReachedFlag = await daoContract.functions.db('FUNDED_BEFORE_DEADLINE');
      if (fundingGoalReachedFlag !== 'TRUE') {
        const errorJoinPlugin = await dao.plugin({
          where: {name: PROPOSAL_TYPE.Join},
        });
        logger.log(`fundingGoalReachedFlag is not TRUE (its value is "${fundingGoalReachedFlag}") - so we cannot create a proposal`);

        const fundingGoal = Number(joinPluginState.pluginParams.fundingGoal);
        logger.log(`funding goal: ${fundingGoal}`);
        if (fundingGoal !== 0) {
          throw Error(`Invalidly configured DAO - funding goal is not 0, it is ${fundingGoal} instead`);
        }

        // TODO: check fundingGoal < dao.balance ?

        if (joinPluginState.pluginParams.fundingGoalDeadline < new Date()) {
          throw Error('Invalidly configured DAO - cannot create funding request (the fundingGoalDeadline of the join plugin is in the past, so we cannot set the fundingGoalReeched flag to true)');
        }
        logger.log('We will try to reset the fundingGoalReachedFlag');
        const oldJoinContract = await arc.getContract(joinPlugin.coreState.address);
        const joinContract = await oldJoinContract.addProvider();
        const setFlagTx  = {
          contract: joinContract,
          method: 'setFundingGoalReachedFlag',
          args: [],
        };
        const setFlagTxReceipt = await setFlagTx.contract.sendToRelayerWithReceipt(
          setFlagTx.method,
          setFlagTx.args,
        );
        logger.log(setFlagTxReceipt);
        logger.log('setFlagTxReceipt.transactionHash ->', setFlagTxReceipt.transactionHash);
        fundingGoalReachedFlag = await daoContract.db('FUNDED_BEFORE_DEADLINE');
        logger.log(`fundingGoalReachedFlag value is now ${fundingGoalReachedFlag}`);
        if (fundingGoalReachedFlag !== 'TRUE') {
          throw Error('funding goal is not reached yet - cannot create a funding request');
        }
      }
      // TODO: check if the user is a member
    };
    // TODO: the error handler shoudl only be caleed if an actual error occurred, when https://daostack1.atlassian.net/browse/CM-402 is resolved
    await errorHandler();

    logger.log('saving ipfs data');
    // not working :-()
    // ipfsHash = await arc.saveIPFSData(data);
    data = {...data, VERSION: IPFS_DATA_VERSION};
    ipfsHash = await ipfsUpload({description: JSON.stringify(data)});
    logger.log('ipfsHash', ipfsHash);

    const args = {
      descriptionHash: ipfsHash,
      amount: funding,
      beneficiary: userAddress,
      dao: dao.id,
      plugin: fundingRequestPlugin.coreState.address,
    };

    // send the acdtual transaction
    logger.log('creating transaction');
    const transaction = await fundingRequestPlugin.createProposalTransaction(args);

    logger.log('Transaction -> ', transaction);

    // TODO: test not 0 value
    const receipt = await transaction.contract.sendToRelayerWithReceipt(
      transaction.method,
      transaction.args,
    );

    // logger.log('RECEIPT -> ', receipt);
    logger.log(
      `Transaction with ${receipt.transactionHash} was mined`,
    );

    const manager = await WalletManager.getInstance();
    const events = manager.getTransactionEvents(interf, receipt);

    // TODO:  if the transacdtion reverts, we can check for that here and include that in the error message
    if (!events.NewFundingProposal) {
      throw Error('Expected (but did not find a NewFundingProposal event: something went wrong');
    }
    // logger.log(events.NewFundingProposal);

    const proposalId = events.NewFundingProposal._proposalId;

    await GraphqlSyncService.getInstance().syncProposalById(proposalId);
    return proposalId;
  } catch (e) {
    logger.log(e);
    logger.log(e.response);
    throw e;
  }
};
