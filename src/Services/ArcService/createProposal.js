// TODO: add here scripts for createRequestToJoin and createFundingRequest
// import {getArc} from './arc';
// const {ARC_VERSION, OVERRIDES} = require('./arc');
const {first} = require('rxjs/operators');
import {ipfsUpload} from '../../Config';
const {OVERRIDES} = require('../../Config');

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
    // let plugins;

    let joinAndQuitPlugin;
    try {
      joinAndQuitPlugin = await dao.plugin({where: {name: 'JoinAndQuit'}});
    } catch (e) {
      console.log(e);
      console.log(daoId);
      const plugins = (await dao.plugins().pipe(first()).toPromise());
      console.log(plugins.map(p => p.coreState.name));
      throw e;
    }

    // console.log('PLUGINS -> ', plugins);
    // const joinAndQuitPlugin = plugins[0];
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
    console.log('creating transaction');
    const transaction = await joinAndQuitPlugin.createProposalTransaction(args);

    const opts = { ...OVERRIDES, value: transaction.opts.value};
    tx = await transaction.contract[transaction.method](...transaction.args, opts);
    const receipt = await tx.wait();
    console.log(
      `Transaction with ${receipt.transactionHash} was mined: proposal created!`,
    );
    const proposal = joinAndQuitPlugin.createProposalTransactionMap(receipt);
    return proposal;
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
