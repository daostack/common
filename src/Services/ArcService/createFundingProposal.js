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
    const fee = data.funding;
    if (!fee) {
      throw Error('Fee argument must be given');
    }
    console.log('saving ipfs data');
    // not working :-()
    // ipfsHash = await arc.saveIPFSData(data);
    ipfsHash = await ipfsUpload(data);
    console.log('ipfsHash', ipfsHash);

    const args = {
      descriptionHash: ipfsHash,
      amount: fee,
      beneficiary: userAddress,
      dao: dao.id,
      plugin: fundingRequestPlugin.coreState.address,
    };
    console.log('creating transaction');

    // check preconditions
    const daoContract = await arc.getContract(dao.id);
    const fundingGoalReachedFlag = await daoContract.db('FUNDED_BEFORE_DEADLINE');
    console.log(fundingGoalReachedFlag);
    if (fundingGoalReachedFlag !== 'true') {
      throw Error('funding goal is not reached yet - cannot create a funding request');
    }

    // send the acdtual transaction
    const transaction = await fundingRequestPlugin.createProposalTransaction(
      args,
    );

    console.log('Transaction -> ', transaction);

    // TODO: test not 0 value
    const receipt = await transaction.contract.sendToRelayerWithReceipt(
      transaction.method,
      transaction.args,
    );

    console.log('RECEIPT -> ', receipt);

    console.log(
      `Transaction with ${receipt.transactionHash} was mined: proposal created!`,
    );

    const proposal = fundingRequestPlugin.createProposalTransactionMap(receipt);
    console.log('PROPOSAL -> ', proposal);
    return proposal;
    /**  Original code, keep for reference until we are sure the current pattern works
     *
    const transaction = await fundingRequestPlugin.createProposal(args);
    console.log(`sending transaction ${transaction}`);
    console.log(transaction)
    const receipt = await transaction.send();
    return receipt.result; // this is a arc.js Proposal instance
     */
  } catch (e) {
    console.log(e);
    throw e;
  }
};
