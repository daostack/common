import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink} from '../Config';

// this value should coincide with the "migration-experimental" versoin
const ARC_VERSION = '0.1.1-rc.16'; // we should probably read this from the package..

// TODO: have this available as a global
async function getArc(wallet) {
  const arc = new Arc({
    // we just use arc for writing..
    graphqlHttpProvider: graphHttpLink,
    graphqlWsProvider: graphwsLink,
    web3Provider: wallet,
  });
  await arc.fetchContractInfos();
  return arc;
}
const OVERRIDES = {
  gasLimit: 10000000,
  gasPrice: 10000000000,
};

module.exports = {
  ARC_VERSION,
  getArc,
  OVERRIDES,
};
