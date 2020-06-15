const {first} = require('rxjs/operators');
import {ipfsUpload} from '../../Config';

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

    const plugins = await dao.plugins();

    console.log('PLUGINS -> ', plugins);

    let fundingRequestPlugin;
    try {
      fundingRequestPlugin = await dao.plugin({
        where: {name: 'FundingRequest'},
      });
    } catch (e) {
      console.log(e);
      console.log(daoId);
      const plugins = await dao
        .plugins()
        .pipe(first())
        .toPromise();
      console.log(plugins.map(p => p.coreState.name));
      throw e;
    }

    console.log('fundingRequestPlugin', fundingRequestPlugin.id);

    let ipfsHash;
    const funding = data.funding;
    if (!funding) {
      throw Error('"funding" argument must be given');
    }
    // check preconditions

    // precondition: the FUNDED_BEFORE_DEADLINE should be true
    const daoContract = await arc.getContract(dao.id);

    const errorHandler = async (receipt) => {
      // lets first check some sanity things about the dao
      const joinAndQuitPlugin = await dao.plugin({where: {name: 'JoinAndQuit'}});
      const joinAndQuitPluginState = await joinAndQuitPlugin.fetchState();
      const fundingRequestPlugin = await dao.plugin({where: {name: 'FundingRequest'}});
      const fundingRequestPluginState = await fundingRequestPlugin.fetchState();
      const activationTime = fundingRequestPluginState.pluginParams.voteParams.activationTime;
      if (activationTime > new Date()) {
        throw Error(`Canot create a funding request as the plugin is not actived yet (it activates on ${activationTime})`);
      }
      let fundingGoalReachedFlag = await daoContract.functions.db('FUNDED_BEFORE_DEADLINE');
      if (fundingGoalReachedFlag !== 'TRUE') {
        // we will try to set it
        // TODO: this flag should be set on common creation instead
        const joinAndQuitPlugin = await dao.plugin({
          where: {name: 'JoinAndQuit'},
        });
        console.log(`fundingGoalReachedFlag is not TRUE (its value is "${fundingGoalReachedFlag}") - so we cannot create a proposal`);

        const fundingGoal = Number(joinAndQuitPluginState.pluginParams.fundingGoal);
        console.log(`funding goal: ${fundingGoal}`);
        if (fundingGoal !== 0) {
          throw Error(`Invalidly configured DAO - funding goal is not 0, it is ${fundingGoal} instead`);
        }


        if (joinAndQuitPluginState.pluginParams.fundingGoalDeadline < new Date()) {
          throw Error('Invalidly configured DAO - cannot create funding request (the fundingGoalDeadline of the joinAndQuit plugin is in the past, so we cannot set the fundingGoalReeched flag to true)');
        }
        console.log('We will try to reset the fundingGoalReachedFlag');
        const joinAndQuitContract = await arc.getContract(joinAndQuitPlugin.coreState.address);
        const setFlagTx  = {
          contract: joinAndQuitContract,
          method: 'setFundingGoalReachedFlag',
          args: [],
        };
        const setFlagTxReceipt = await setFlagTx.contract.sendToRelayerWithReceipt(
          setFlagTx.method,
          setFlagTx.args,
        );
        // console.log(setFlagTxReceipt);
        console.log('setFlagTxReceipt.transactionHash ->', setFlagTxReceipt.transactionHash);
        fundingGoalReachedFlag = await daoContract.db('FUNDED_BEFORE_DEADLINE');
        if (fundingGoalReachedFlag !== 'TRUE') {
          throw Error('funding goal is not reached yet - cannot create a funding request');
        }
      }
      // TODO: check if the user is a member
    };
    // TODO: the error handler shoudl only be caleed if an actual error occurred, when https://daostack1.atlassian.net/browse/CM-402 is resolved
    await errorHandler();

    console.log('saving ipfs data');
    // not working :-()
    // ipfsHash = await arc.saveIPFSData(data);
    ipfsHash = await ipfsUpload(data);
    console.log('ipfsHash', ipfsHash);

    const args = {
      descriptionHash: ipfsHash,
      amount: funding,
      beneficiary: userAddress,
      dao: dao.id,
      plugin: fundingRequestPlugin.coreState.address,
    };

    console.log('ARGS -> ', args);

    // send the acdtual transaction
    console.log('creating transaction');
    const transaction = await fundingRequestPlugin.createProposalTransaction(args);

    console.log('Transaction -> ', transaction);

    // TODO: test not 0 value
    const receipt = await transaction.contract.sendToRelayerWithReceipt(
      transaction.method,
      transaction.args,
    );

    console.log('RECEIPT -> ', receipt);

    console.log(
      `Transaction with ${receipt.transactionHash} was mined`,
    );

    const proposal = fundingRequestPlugin.createProposalTransactionMap(receipt);
    console.log('PROPOSAL -> ', proposal);
    // TOOD: call update-proposal?proposalID=proposal.id endpoint here, so we are sure that the proposal is in the database
    return proposal.id;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
