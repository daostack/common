// TODO: rename this file to °createProposalRequestToJoin.js°
const {first} = require('rxjs/operators');
import {ipfsUpload} from '../../Config';
import WalletManager from '../../Util/WalletManager';

export const createProposalRequestToJoin = async (arc, daoId, data) => {
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

    let joinAndQuitPlugin;
    try {
      joinAndQuitPlugin = await dao.plugin({where: {name: 'JoinAndQuit'}});
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

    console.log('joinAndQuitPlugin', joinAndQuitPlugin.id);

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
      fee,
      dao: dao.id,
      plugin: joinAndQuitPlugin.coreState.address,
    };
    console.log('creating request to join transaction');

    const errorHandler = async () => {
      const joinAndQuitPlugin = await dao.plugin({where: {name: 'JoinAndQuit'}});
      const joinAndQuitContract  = await arc.getContract(joinAndQuitPlugin.coreState.address);
      const proposer =   WalletManager.getInstance().safeAddress;
      // we check the conditions from the contract
      // require(!fundings[proposer].candidate, "already a candidate");
      const memberFund = await joinAndQuitContract.fundings(proposer);
      if (memberFund[0] === true) {
        throw Error(`The proposer ${proposer} is already a canidate - cannot create a request`);
      }

      // TODO: check the other conditions
      // require(avatar.nativeReputation().balanceOf(proposer) == 0, "already a member");
      // require(_feeAmount >= minFeeToJoin, "_feeAmount should be >= then the minFeeToJoin")

      throw Error('Oh no');
    };
    await errorHandler();
    const transaction = await joinAndQuitPlugin.createProposalTransaction(args);
    // send the request to the cloudfunction relayer
    const proposalId = await WalletManager.getInstance().requestToJoin(transaction.contract, transaction.method, transaction.args);
    return proposalId;
    /**  Original code, keep for reference until we are sure the current pattern works
     *
    const transaction = await joinAndQuitPlugin.createProposal(args);
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
