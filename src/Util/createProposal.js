// TODO: add here scripts for createRequestToJoin and createFundingRequest
// import {getArc} from './arc';
// const {ARC_VERSION, OVERRIDES} = require('./arc');
const {first} = require('rxjs/operators');
import {ipfsUpload} from '../Config';

export const createProposalRequestToJoin = async (arc, data) => {
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
    //const dao = arc.dao('0x0f0c735f67fbe866a65c10ace6b3536fa09cddab');
    console.log('CREATE PROPOSAL | request to join');
    const daoId = '0x99d48232e014891b9bc320aa6910f2bcfa2027f1'; // My dao
    //const daoId = '0x4e95b0c6f9777a19b08487848ea125b6787f8944'; // New dao
    const dao = arc.dao(daoId);
    console.log('DAO -> ', dao);
    let plugins;

    try {
      const allPlugins = await dao
        .plugins()
        .pipe(first())
        .toPromise();

      console.log('allPlugins -> ', allPlugins);

      plugins = await dao
        .plugins({where: {name: 'JoinAndQuit'}})
        .pipe(first())
        .toPromise();
    } catch (e) {
      console.log(e);
      throw e;
    }
    console.log('PLUGINS -> ', plugins);

    const joinAndQuitPlugin = plugins[0];
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
    console.log(args);
    const transaction = await joinAndQuitPlugin.createProposal(args);
    const receipt = await transaction.send();
    console.log(
      `Transaction with ${receipt.transactionHash} was mined: proposal created!`,
    );
    return receipt.result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
