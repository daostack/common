import Config from 'react-native-config';
import axios from 'axios';
import logger from '../Services/Logger';
import {Platform} from 'react-native';

// the value of ARC_VERSION should coincide with the "migration-experimental" versoin
// TODO: we should probably read this from the package..

const localFunctionURL = Config.localFunctionURL;
const cloudFunctionURL = Config.cloudFunctionURL;
const networkId = Config.networkId;
const clientId = Config.clientId;
const web3Provider = Config.web3Provider;
const commonTokenAddress = Config.commonTokenAddress;
const androidAppId = Config.androidAppId;
const iosAppId = Config.iosAppId;
const graphqlApiUrl = Config.graphqlApiUrl;
const graphqlApiUseSsl = Config.graphqlApiUseSsl;

if (Config.local === 'true' && __DEV__) {
  logger.warn('Using local firebase');

  axios.get('http://localhost:5003').catch((error) => {
    if (error.response?.status !== 404) {
      logger.error(
        'Set to use local firebase, but the local firebase is not accessible',
      );
    }
  });
}

export const getGraphqlApiUrl = () => graphqlApiUrl;
export const isGraphqlApiUseSsl = () => graphqlApiUseSsl;

const cloudFuncURL = () =>
  Config.local === 'true' && __DEV__ ? localFunctionURL : cloudFunctionURL;

const functionEndpoint = (endpoint) => `${cloudFuncURL()}/${endpoint}`;

export const mangoPayUrl = () => functionEndpoint('mangopay');
export const graphqlUrl = () => functionEndpoint('graphql');
export const relayerUrl = () => functionEndpoint('relayer');
export const createUrl = () => functionEndpoint('create');
export const subscriptionsUrl = () => functionEndpoint('subscriptions');

// No Blockchain urls
export const commonsUrl = () => functionEndpoint('commons');
export const metadataUrl = () => functionEndpoint('metadata');
export const proposalsUrl = () => functionEndpoint('proposals');
export const votesUrl = () => functionEndpoint('votes');
export const discussionsUrl = () => functionEndpoint('discussions');
export const permissionsUrl = () => functionEndpoint('permissions');
export const moderationUrl = () => functionEndpoint('moderation');

export const circlePayUrl = () => functionEndpoint('circlepay');
export const web3ProviderUrl = web3Provider;
export const web3NetworkId = networkId;
export const COMMONTOKENADDRESS = commonTokenAddress;
export const firebaseWebClientId = clientId;
export const isProduction = Config.ENV === 'production';

// JUST HARDCODING THIS TO BE TRUE FOR A QUICK FIX; SORRY
export const testCard = __DEV__ && false; //Config.testCard === 'true';

export const appId = Platform.OS === 'android' ? androidAppId : iosAppId;

// Arc.js related string constants
export const PROPOSAL_TYPE = {
  Join: 'Join',
  FundingRequest: 'FundingRequest',
};

export const PROPOSAL_STAGE = {
  Active: 'active',
  History: 'history',
};
