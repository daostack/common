const {Arc} = require('@daostack/arc.js');
// const arc = require('@daostack/client')
// this value should coincide with the "migration-experimental" versoin
const ARC_VERSION = '0.1.1-rc.16'; // we should probably read this from the package..

// TODO: have this available as a global
async function getArc(wallet) {
  const arc = new Arc({
    // we just use arc for writing..
    graphqlHttpProvider:
      'https://api.thegraph.com/subgraphs/name/daostack/v7_5_exp_rinkeby',
    graphqlWsProvider:
      'wss://api.thegraph.com/subgraphs/name/daostack/v7_5_exp_rinkeby',
    web3Provider: wallet,
  });
  await arc.fetchContractInfos();
  return arc;
}
const OVERRIDES = {
  gasLimit: 10000000,
  gasPrice: 1000000000,
};

module.exports = {
  ARC_VERSION,
  getArc,
  OVERRIDES,
};
