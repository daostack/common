import Config from 'react-native-config';
import axios from 'axios';
import logger from '../Services/Logger';

// the value of ARC_VERSION should coincide with the "migration-experimental" versoin
// TODO: we should probably read this from the package..

let localFunctionURL;
let cloudFunctionURL;
let networkId;
let clientId;
let web3Provider;
let commonTokenAddress;

if (Config.ENV === 'production') {
  localFunctionURL = 'http://localhost:5003/common-daostack/us-central1';
  cloudFunctionURL = 'https://us-central1-common-daostack.cloudfunctions.net';
  networkId = 100;
  web3Provider = 'https://dai.poa.network';
  commonTokenAddress = '0x2ea0be07dfc0357f40884365f2c9cfd2a36d4a6e';
  clientId = '854172758045-l3summ7br1b9p1tv2tp6gha0j8kki3cq.apps.googleusercontent.com';
} else if (Config.ENV === 'staging') {
  localFunctionURL = 'http://localhost:5003/common-staging-50741/us-central1';
  cloudFunctionURL = 'https://us-central1-common-staging-50741.cloudfunctions.net';
  networkId = 42;
  web3Provider = 'https://kovan.infura.io/v3/3c08878d00734c0c98a3e4741d0b4cfc';
  commonTokenAddress = '0xdff3e43710d39d2ba5dda7a8d959ed22cc905b01';
  clientId = '78965953367-gp6r7vuvceqj4k8gngrqkng98thgqmo8.apps.googleusercontent.com';
} else {
  throw Error(`Unknown Config.ENV: must be one of "staging" or "production", but is ${Config.ENV}`);
}

if (Config.local === 'true' && __DEV__) {
  logger.warn('Using local firebase');

  axios.get('http://localhost:5003')
    .catch((error) => {
      if (error.response?.status !== 404) {
        logger.error('Set to use local firebase, but the local firebase is not accessible');
      }
    });
}

const cloudFuncURL = () =>
  (Config.local === 'true' && __DEV__)
    ? localFunctionURL
    : cloudFunctionURL;

const functionEndpoint = (endpoint) => `${cloudFuncURL()}/${endpoint}`;

export const mangoPayUrl = () => functionEndpoint('mangopay');
export const graphqlUrl = () => functionEndpoint('graphql');
export const relayerUrl = () => functionEndpoint('relayer');
export const createUrl = () => functionEndpoint('create');
export const circlePayUrl = () => functionEndpoint('circlepay');
export const web3ProviderUrl = web3Provider;
export const web3NetworkId = networkId;
export const COMMONTOKENADDRESS = commonTokenAddress;
export const firebaseWebClientId = clientId;
export const isProduction = Config.ENV === 'production';

// JUST HARDCODING THIS TO BE TRUE FOR A QUICK FIX; SORRY
export const testCard = false; //Config.testCard === 'true';

export const OVERRIDES = {
  // default settings for sending trasnsactions
  gasLimit: 10000000,
  gasPrice: 15000000000,
};

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

// Arc.js related string constants
export const PROPOSAL_TYPE = {
  Join: 'Join',
  FundingRequest: 'FundingRequest',
};
