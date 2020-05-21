import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink, ipfsLink, ARC_VERSION} from '../Config';

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
  gasPrice: 15000000000,
};

module.exports = {
  ARC_VERSION,
  getArc,
  OVERRIDES,
};
