import { IPFSApiClient } from './ipfs-api';
import Config from 'react-native-config';
import axios from 'axios';
// the value of ARC_VERSION should coincide with the "migration-experimental" versoin
// TODO: we should probably read this from the package..

let arcVersion;
let graphVersion;
let localFunctionURL;
let cloudFunctionURL;
let networkId;
let clientId;
let graphUrl;
let graphWS;
let web3Provider;
let commonTokenAddress;
let ipfsUrl;
let ipfsDataVersion;


if (Config.ENV === 'production') {
  arcVersion = '0.1.2-rc.0';
  graphVersion = 'v8_7_exp_xdai';
  localFunctionURL = 'http://localhost:5001/common-daostack/us-central1';
  cloudFunctionURL = 'https://us-central1-common-daostack.cloudfunctions.net';
  graphUrl = 'https://api.thegraph.com/subgraphs-daostack/name/daostack';
  graphWS = 'wss://api.thegraph.com/subgraphs-daostack/name/daostack';
  ipfsUrl = 'https://api.thegraph.com/ipfs-daostack/api/v0';
  ipfsDataVersion = '000002';
  networkId = 100;
  web3Provider = 'https://dai.poa.network';
  commonTokenAddress = '0x2ea0be07dfc0357f40884365f2c9cfd2a36d4a6e';
  clientId = '854172758045-l3summ7br1b9p1tv2tp6gha0j8kki3cq.apps.googleusercontent.com';
} else if (Config.ENV === 'staging') {
  arcVersion = '0.1.2-rc.0';
  graphVersion = 'v8_7_exp_kovan';
  localFunctionURL = 'http://localhost:5001/common-staging-50741/us-central1';
  cloudFunctionURL = 'https://us-central1-common-staging-50741.cloudfunctions.net';
  graphUrl = 'https://api.thegraph.com/subgraphs-daostack/name/daostack';
  graphWS = 'wss://api.thegraph.com/subgraphs-daostack/name/daostack';
  ipfsUrl = 'https://api.thegraph.com/ipfs-daostack/api/v0';
  ipfsDataVersion = '000002';
  networkId = 42;
  web3Provider = 'https://kovan.infura.io/v3/3c08878d00734c0c98a3e4741d0b4cfc';
  commonTokenAddress = '0xdff3e43710d39d2ba5dda7a8d959ed22cc905b01';
  clientId = '78965953367-gp6r7vuvceqj4k8gngrqkng98thgqmo8.apps.googleusercontent.com';
} else {
  throw Error(`Unknown Config.ENV: must be one of "staging" or "production", but is ${Config.ENV}`);
}

let isLocalPort = false;
if (__DEV__) {
  axios.get('http://localhost:5001')
    .catch(error => {
      isLocalPort = error.response.status === 404;
    });
}

const cloudFuncURL = () => {
  return isLocalPort ?  localFunctionURL : cloudFunctionURL;
};

const functionEndpoint = endpoint => {
  return `${cloudFuncURL()}/${endpoint}`;
};


export const ARC_VERSION = arcVersion;
export const GRAPH_VERSION = graphVersion;
export const IPFS_DATA_VERSION = ipfsDataVersion;
export const mangoPayUrl = () => { return functionEndpoint('mangopay'); };
export const graphqlUrl = () => { return functionEndpoint('graphql'); };
export const relayerUrl = () => { return functionEndpoint('relayer'); };
export const graphHttpLink = `${graphUrl}/${graphVersion}`;
export const graphwsLink = `${graphWS}/${graphVersion}`;
export const ipfsLink = ipfsUrl;
export const web3ProviderUrl = web3Provider;
export const web3NetworkId = networkId;
export const COMMONTOKENADDRESS = commonTokenAddress;
export const firebaseWebClientId = clientId;

export const defaultAllowance = 100000000000000000;
export const MEMBER_REPUTATION = 1000; // how much rep a new members gets

export const OVERRIDES = {
  // default settings for sending trasnsactions
  gasLimit: 10000000,
  gasPrice: 15000000000,
};

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

// Arc.js related string constants
export const PROPOSAL_TYPE = {
  JoinAndQuit: 'JoinAndQuit',
  FundingRequest: 'FundingRequest',
};

// We will need this until https://github.com/daostack/arc.js/issues/468 is resolved
export const IpfsClient = new IPFSApiClient(ipfsLink);

export const ipfsUpload = async data => {
  // TODO: use arc.saveIPFSData({ name: formData.name}) once https://github.com/daostack/arc.js/issues/468 is resolved
  return IpfsClient.addAndPinString(JSON.stringify(data));
};
