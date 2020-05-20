import {IPFSApiClient} from './ipfs-api';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink, split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';

const GRAPH_VERSION = 'v8_1_exp_xdai';
export const graphHttpLink = `https://api.thegraph.com/subgraphs/name/daostack/${GRAPH_VERSION}`;
export const graphwsLink = `wss://api.thegraph.com/subgraphs/name/daostack/${GRAPH_VERSION}`;
export const ipfsLink = 'https://api.thegraph.com/ipfs-daostack/api/v0';
export const web3ProviderUrl = 'https://dai.poa.network';
// export const web3NetworkId = 100;

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
