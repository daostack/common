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
  //   dao: °0xdB853007b8694D825cE567D527fB634caafD8282°
  // };

  try {
    const dao = arc.dao(data.dao);
    let plugins;
    try {
      plugins = await dao
        .plugins({where: {name: 'JoinAndQuit'}})
        .pipe(first())
        .toPromise();
    } catch (e) {
      console.log(e);
      throw e;
    }
    if (plugins.length === 0) {
      throw Error(
        `No JoinAndQuit plugin found in DAO ${dao.id} - this is not a correctly configured Common DAO`,
      );
    }
    const joinAndQuitPlugin = plugins[0];
    console.log('joinAndQuitPlugin', joinAndQuitPlugin.id);

    let ipfsHash;
    const fee = data.funding;
    if (!fee) {
      throw Error('Fee argument must be given');
    }
    console.log('saving ipfs data');
    // ipfsHash = await arc.saveIPFSData(data);
    ipfsHash = await ipfsUpload({description: data});
    console.log('ipfsHash', ipfsHash);

    const args = {
      descriptionHash: ipfsHash,
      fee,
      dao: dao.id,
      plugin: joinAndQuitPlugin.coreState.address,
    };
    const transaction = await joinAndQuitPlugin.createProposal(args);
    console.log(
      `sending transaction ${transaction.hash}, please wait for it to be mined..`,
    );
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
