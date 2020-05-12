// TODO: add here scripts for createRequestToJoin and createFundingRequest
import {getArc} from './arc';
const {ARC_VERSION, OVERRIDES} = require('./arc');
const {first} = require('rxjs/operators');
import {BN} from '@daostack/arc.js';

export const createProposal = async (arc, givenOpts = {}) => {
  const dao = arc.dao('0x0f0c735f67fbe866a65c10ace6b3536fa09cddab');
  console.log('dao', dao);
  const daoState = await dao
    .state()
    .pipe(first())
    .toPromise();
  console.log('daoState', daoState);
  let plugins;
  try {
    plugins = await dao
      .plugins({where: {name: 'JoinAndQuit'}})
      .pipe(first())
      .toPromise();
  } catch (e) {
    console.log(e);
  }
  const joinAndQuitPlugin = plugins[0];
  console.log('joinAndQuitPlugin', joinAndQuitPlugin);

  const amount = new BN(1 * 10 ** 18);
  console.log('amount', amount);

  const ipfsHash = await arc.saveIPFSData({
    title: 'Test proposal',
    url: 'https://github.com/',
    description: 'This is my test proposal',
    tag: ['test', 'mock'],
  });
  console.log('ipfsHash', ipfsHash);

  const transaction = await joinAndQuitPlugin.createProposal({
    descriptionHash: ipfsHash,
    fee: amount,
  });
};
