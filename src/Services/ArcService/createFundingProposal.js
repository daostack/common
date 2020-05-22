// TODO: add here scripts for createRequestToJoin and createFundingRequest
// import {getArc} from './arc';
// const {ARC_VERSION, OVERRIDES} = require('./arc');
const {first} = require('rxjs/operators');

export const createFundingProposal = async (arc, data) => {
  // data must look like this
  // {
  //   title: `A test proposal on ${Date()}`,
  //   description: 'Some description',
  //   files: [],
  //   images: [],
  //   links: [], // {title: "title", url: "url"}
  //   funding: new BN(100000),
  // };

  console.log('createFundingProposal -> ', data);

  try {
    const dao = arc.dao('0x0f0c735f67fbe866a65c10ace6b3536fa09cddab');

    console.log('dao -> ', dao);

    let plugins;
    try {
      plugins = await dao
        .plugins({where: {name: 'fundingRequest'}})
        .pipe(first())
        .toPromise();
    } catch (e) {
      console.log(e);
      throw e;
    }

    console.log('plugins');
    console.log(plugins);
    /*

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
    */
  } catch (e) {
    console.log(e);
    throw e;
  }
};
