import {IPFSApiClient} from './ipfs-api';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink, split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import Config from 'react-native-config';

// the value of ARC_VERSION should coincide with the "migration-experimental" versoin
// TODO: we should probably read this from the package..

if (Config.ENV === 'production') {

} else if (Config.ENV === 'staging') {

} else {
  throw Error(`Unknown Config.ENV: must be one of "staging" or "production", but is ${Config.ENV}`);
}

export const mangoPayUrl = `${Config.cloudFunctionURL}/mangopay`;
export const graphqlUrl = `${Config.cloudFunctionURL}/graphql`;
export const ARC_VERSION = Config.ARC_VERSION;
export const GRAPH_VERSION = Config.GRAPH_VERSION;
export const graphHttpLink = `${Config.graphHttpLink}${GRAPH_VERSION}`;
export const graphwsLink = `${Config.graphwsLink}${GRAPH_VERSION}`;
export const ipfsLink = Config.ipfsLink;
export const web3ProviderUrl = Config.web3ProviderUrl;
export const relayerUrl = Config.relayerUrl;
export const web3NetworkId = Config.eb3NetworkId;
export const COMMONTOKENADDRESS = Config.COMMONTOKENADDRESS;
export const firebaseWebClientId = Config.firebaseWebClientId;

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

const httpLink = new HttpLink({
  uri: graphHttpLink,
  fetchOptions: {
    mode: 'no-cors',
  },
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: graphwsLink,
  options: {
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const apolloClientConfig = new ApolloClient({
  link: ApolloLink.from([
    onError(({graphQLErrors, networkError}) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    link,
  ]),
  cache: new InMemoryCache(),
});

// TODO: is this still needed?
export const ApolloClientConfig = new ApolloClient(apolloClientConfig);

// We will need this until https://github.com/daostack/arc.js/issues/468 is resolved
export const IpfsClient = new IPFSApiClient(ipfsLink);

export const ipfsUpload = async data => {
  // TODO: use arc.saveIPFSData({ name: formData.name}) once https://github.com/daostack/arc.js/issues/468 is resolved
  return IpfsClient.addAndPinString(JSON.stringify(data));
};
