import {IPFSApiClient} from './ipfs-api';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink, split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';

// the value of ARC_VERSION should coincide with the "migration-experimental" versoin
// TODO: we should probably read this from the package..
export const ARC_VERSION = '0.1.1-rc.21';
export const GRAPH_VERSION = 'v8_2_exp_xdai';
export const graphHttpLink = `https://api.thegraph.com/subgraphs/name/daostack/${GRAPH_VERSION}`;
export const graphwsLink = `wss://api.thegraph.com/subgraphs/name/daostack/${GRAPH_VERSION}`;
export const ipfsLink = 'https://api.thegraph.com/ipfs-daostack/api/v0';
export const web3ProviderUrl = 'https://dai.poa.network';
export const relayerUrl = 'https://us-central1-common-daostack.cloudfunctions.net/relayer/';
export const graphqlUrl = 'https://us-central1-common-daostack.cloudfunctions.net/graphql/';
export const web3NetworkId = 100;

export const defaultAllowance = 100000000000000000;

export const COMMONTOKENADDRESS = '0x2ea0be07dfc0357f40884365f2c9cfd2a36d4a6e';
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
