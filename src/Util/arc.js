import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink, ipfsLink} from '../Config';

// this value should coincide with the "migration-experimental" versoin
const ARC_VERSION = '0.1.1-rc.16'; // we should probably read this from the package..

// TODO: have this available as a global
async function getArc(wallet) {
  const arc = new Arc({
    graphqlHttpProvider: graphHttpLink,
    graphqlWsProvider: graphwsLink,
    ipfsProvider: ipfsLink,
    web3Provider: wallet,
  });
  await arc.fetchContractInfos();
  return arc;
}
const OVERRIDES = {
  gasLimit: 10000000,
  gasPrice: 20000000000,
};

module.exports = {
  ARC_VERSION,
  getArc,
  OVERRIDES,
};
